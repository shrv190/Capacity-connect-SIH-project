"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { FirestoreService } from "@/lib/firestore";
import { StorageService } from "@/lib/storage";
import {
  Course,
  Quiz,
  LibraryResource,
  QuizSubmission,
  QuizQuestion,
} from "@/types";
import {
  GraduationCap,
  PlusCircle,
  Users,
  FileText,
  Video,
  Clock,
  CheckCircle,
  XCircle,
  HelpCircle,
  BookOpen,
  Calendar,
  Save,
  Trash2,
  Send,
  Sparkles,
  Archive,
  ArrowRightLeft,
  Bell
} from "lucide-react";
import AuthModal from "@/components/AuthModal";

export default function TrainerPortal() {
  const { currentUser, updateCurrentUserProfile } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "builder" | "monitoring" | "library" | "profile" | "courses" | "notifications"
  >("courses");

  const [courses, setCourses] = useState<Course[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [resources, setResources] = useState<LibraryResource[]>([]);
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Quiz Builder State
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [quizCourseId, setQuizCourseId] = useState("");
  const [quizDuration, setQuizDuration] = useState(20);
  const [quizDeadline, setQuizDeadline] = useState("2026-12-31");
  const [quizPassingScore, setQuizPassingScore] = useState(70);

  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: 1,
      questionText: "",
      options: ["", "", "", ""],
      correctOptionIndex: 0,
      explanation: "",
    },
  ]);
  const [quizSuccessNotice, setQuizSuccessNotice] = useState<string | null>(null);

  // Resource Upload State
  const [resTitle, setResTitle] = useState("");
  const [resType, setResType] = useState<"video" | "presentation" | "manual">("video");
  const [resUrl, setResUrl] = useState("");
  const [resCourseId, setResCourseId] = useState("");
  const [resSize, setResSize] = useState("");
  const [resDesc, setResDesc] = useState("");
  const [resSuccessNotice, setResSuccessNotice] = useState<string | null>(null);

  // Notification State
  const [notifTitle, setNotifTitle] = useState("");
  const [notifMessage, setNotifMessage] = useState("");

  useEffect(() => {
    refreshData();
  }, [currentUser]);

  const refreshData = async () => {
    const allCourses = await FirestoreService.getCourses();
    setCourses(allCourses);
    
    // We mock quizzes/resources temporarily or pull if backend exists
    // Since we didn't write full Firestore methods for quizzes in this slice, we will keep them empty or local
    setQuizzes([]);
    setResources([]);
    setSubmissions(await FirestoreService.getSubmissions());
    setNotifications(await FirestoreService.getNotifications());
    
    if (allCourses.length > 0 && !quizCourseId) {
      setQuizCourseId(allCourses[0].id);
      setResCourseId(allCourses[0].id);
    }
  };

  const handleArchive = async (course: Course) => {
    if (course.archivedByAdmin) {
      alert("This course was archived by an Administrator and cannot be unarchived by a trainer.");
      return;
    }
    if (course.archived) {
      await FirestoreService.unarchiveCourse(course.id);
    } else {
      await FirestoreService.archiveCourse(course.id, false);
    }
    refreshData();
  };

  const handleMigration = async (courseId: string, accept: boolean) => {
    if (!currentUser) return;
    await FirestoreService.resolveCourseMigration(courseId, accept, currentUser.uid, currentUser.displayName);
    refreshData();
  };

  const handleAddNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !notifTitle || !notifMessage) return;
    await FirestoreService.addNotification(notifTitle, notifMessage, currentUser.uid, currentUser.displayName);
    setNotifTitle("");
    setNotifMessage("");
    refreshData();
  };

  const handleDeleteNotification = async (id: string) => {
    await FirestoreService.deleteNotification(id);
    refreshData();
  };

  // Add Question to Quiz Builder
  const handleAddQuestion = () => {
    const newQ: QuizQuestion = {
      id: questions.length + 1,
      questionText: "",
      options: ["", "", "", ""],
      correctOptionIndex: 0,
      explanation: "",
    };
    setQuestions([...questions, newQ]);
  };

  const handleUpdateQuestion = (index: number, field: keyof QuizQuestion, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const handleUpdateOption = (qIndex: number, optIndex: number, text: string) => {
    const updated = [...questions];
    const newOptions = [...updated[qIndex].options];
    newOptions[optIndex] = text;
    updated[qIndex].options = newOptions;
    setQuestions(updated);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, idx) => idx !== index));
  };

  // Save new Quiz
  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !quizTitle || !quizCourseId) return;

    const course = courses.find((c) => c.id === quizCourseId);

    const created = StorageService.createQuiz({
      courseId: quizCourseId,
      courseTitle: course ? course.title : "Atmospheric Met",
      title: quizTitle,
      description: quizDescription,
      durationMinutes: Number(quizDuration),
      deadline: `${quizDeadline}T23:59:59Z`,
      passingScore: Number(quizPassingScore),
      createdBy: currentUser.uid,
      createdByName: currentUser.displayName,
      questions,
    });

    setQuizSuccessNotice(`Assessment "${created.title}" successfully published and assigned to trainees!`);
    setQuizTitle("");
    setQuizDescription("");
    setQuestions([
      {
        id: 1,
        questionText: "",
        options: ["", "", "", ""],
        correctOptionIndex: 0,
        explanation: "",
      },
    ]);
    refreshData();
    setTimeout(() => setQuizSuccessNotice(null), 4000);
  };

  // Upload Resource
  const handleUploadResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !resTitle || !resCourseId) return;

    const course = courses.find((c) => c.id === resCourseId);

    StorageService.addResource({
      courseId: resCourseId,
      courseTitle: course ? course.title : "Course Module",
      title: resTitle,
      type: resType,
      url: resUrl || "https://imdpune.gov.in/study_material.pdf",
      uploadedBy: currentUser.uid,
      uploadedByName: currentUser.displayName,
      sizeOrDuration: resSize || "45 Mins / 15 MB",
      description: resDesc,
    });

    setResSuccessNotice(`Study material "${resTitle}" uploaded to Trainer Library!`);
    setResTitle("");
    setResUrl("");
    setResDesc("");
    setResSize("");
    refreshData();
    setTimeout(() => setResSuccessNotice(null), 4000);
  };

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 sm:p-10 bg-white rounded-2xl border border-slate-200 text-center space-y-5 shadow-sm">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-2xl mx-auto flex items-center justify-center">
          <GraduationCap className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Trainer Workspace Sign In</h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
            Please sign in with your authorized Faculty / Trainer account to manage course curriculum, author questionnaires, review trainee gradebooks, and upload learning materials.
          </p>
        </div>
        <div className="pt-2 flex justify-center">
          <button
            onClick={() => setAuthModalOpen(true)}
            className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow transition"
          >
            Sign In to Trainer Portal
          </button>
        </div>
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    );
  }

  // If logged in as trainee (unauthorized for trainer tools)
  if (currentUser.role !== "trainer" && currentUser.role !== "admin") {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 sm:p-10 bg-white rounded-2xl border border-slate-200 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 bg-amber-50 text-amber-700 rounded-2xl mx-auto flex items-center justify-center text-xl">
          ⚠️
        </div>
        <h2 className="text-xl font-bold text-slate-900">Trainer Privileges Required</h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          You are currently signed in as a Trainee ({currentUser.displayName}). This workspace is reserved for authorized faculty and subject specialists.
        </p>
        <div className="pt-3 flex justify-center gap-3">
          <a
            href="/trainee"
            className="px-5 py-2.5 bg-[#0b2545] text-white rounded-xl font-bold text-xs shadow"
          >
            Go to My Trainee Portal
          </a>
        </div>
      </div>
    );
  }

  // Filter quizzes and resources assigned or created by trainer
  const myCourses = courses.filter((c) => c.trainerId === currentUser.uid || true);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Trainer Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-2 text-sm font-semibold scrollbar-none">
        <button
          onClick={() => setActiveTab("courses")}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === "courses"
              ? "bg-[#0b2545] text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <GraduationCap className="w-4 h-4 text-emerald-400" />
          <span>My Courses</span>
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === "notifications"
              ? "bg-[#0b2545] text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Bell className="w-4 h-4 text-amber-400" />
          <span>Notifications</span>
        </button>
        <button
          onClick={() => setActiveTab("builder")}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === "builder"
              ? "bg-[#0b2545] text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <PlusCircle className="w-4 h-4 text-emerald-400" />
          <span>Quiz Builder</span>
        </button>

        <button
          onClick={() => setActiveTab("monitoring")}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === "monitoring"
              ? "bg-[#0b2545] text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Users className="w-4 h-4 text-blue-400" />
          <span>Trainee Gradebook & Monitoring ({submissions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("library")}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === "library"
              ? "bg-[#0b2545] text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <FileText className="w-4 h-4 text-amber-400" />
          <span>Trainer Library Uploader ({resources.length})</span>
        </button>
      </div>

      {/* TAB: MY COURSES */}
      {activeTab === "courses" && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900">My Courses & Migrations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myCourses.map(course => (
              <div key={course.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm relative">
                {course.pendingMigrationToId === currentUser.uid && (
                  <div className="absolute -top-3 left-4 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow">
                    Migration Request
                  </div>
                )}
                <h3 className="font-bold text-slate-900 mb-1">{course.title}</h3>
                <p className="text-xs text-slate-500 mb-4">{course.description}</p>
                <div className="flex gap-2 justify-end">
                  {course.trainerId === currentUser.uid && (
                    <button onClick={() => handleArchive(course)} className={`text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 ${course.archived ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      <Archive className="w-3.5 h-3.5" /> {course.archived ? "Unarchive" : "Archive"}
                    </button>
                  )}
                  {course.pendingMigrationToId === currentUser.uid && (
                    <>
                      <button onClick={() => handleMigration(course.id, false)} className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-xl font-bold">Reject</button>
                      <button onClick={() => handleMigration(course.id, true)} className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl font-bold">Accept Transfer</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: NOTIFICATIONS */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Manage Trainee Notifications</h2>
          <form onSubmit={handleAddNotification} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex gap-2">
            <input type="text" placeholder="Title" value={notifTitle} onChange={e => setNotifTitle(e.target.value)} className="w-1/3 px-3 py-2 text-sm border border-slate-200 rounded-xl" required />
            <input type="text" placeholder="Message to Trainees" value={notifMessage} onChange={e => setNotifMessage(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl" required />
            <button type="submit" className="bg-[#0b2545] text-white px-4 py-2 rounded-xl text-sm font-bold shrink-0">Push Notice</button>
          </form>
          <div className="space-y-2">
            {notifications.map(n => (
              <div key={n.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{n.title}</h4>
                  <p className="text-xs text-slate-500">{n.message}</p>
                </div>
                {(n.createdBy === currentUser.uid || currentUser.role === "admin") && (
                  <button onClick={() => handleDeleteNotification(n.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 1: QUESTIONNAIRE & ASSESSMENT BUILDER */}
      {activeTab === "builder" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Create Subject-Wise MCQ Assessment
            </h2>
            <p className="text-xs text-slate-500">
              Formulate standardized multiple-choice questionnaires with countdown timers, deadlines, and answer keys.
            </p>
          </div>

          {quizSuccessNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{quizSuccessNotice}</span>
            </div>
          )}

          <form onSubmit={handleSaveQuiz} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            {/* Meta info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assessment Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit 3: Doppler Radar Dual-Pol Hydrometeor Classification"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0b2545]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Associated Course
                </label>
                <select
                  value={quizCourseId}
                  onChange={(e) => setQuizCourseId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0b2545]"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assessment Instructions & Overview
                </label>
                <textarea
                  rows={2}
                  placeholder="Provide guidance on topics covered, pass criteria, and instructions for trainees..."
                  value={quizDescription}
                  onChange={(e) => setQuizDescription(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0b2545]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Time Limit (Minutes)
                </label>
                <input
                  type="number"
                  min={5}
                  max={120}
                  required
                  value={quizDuration}
                  onChange={(e) => setQuizDuration(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0b2545]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Submission Deadline Date
                </label>
                <input
                  type="date"
                  required
                  value={quizDeadline}
                  onChange={(e) => setQuizDeadline(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0b2545]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Passing Threshold (%)
                </label>
                <input
                  type="number"
                  min={40}
                  max={100}
                  required
                  value={quizPassingScore}
                  onChange={(e) => setQuizPassingScore(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0b2545]"
                />
              </div>
            </div>

            {/* Questions Section */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-slate-900">
                  Questions Pool ({questions.length})
                </h3>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1 border border-blue-200"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> + Add Question
                </button>
              </div>

              <div className="space-y-6">
                {questions.map((q, qIdx) => (
                  <div
                    key={q.id}
                    className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-3 relative"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700">
                        Question #{qIdx + 1}
                      </span>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(qIdx)}
                          className="text-red-500 hover:text-red-700 p-1 text-xs"
                          title="Delete Question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      required
                      placeholder="Enter question text here..."
                      value={q.questionText}
                      onChange={(e) => handleUpdateQuestion(qIdx, "questionText", e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white font-medium"
                    />

                    {/* 4 Choices */}
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Options (Designate Correct Option Radio)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => (
                          <div
                            key={optIdx}
                            className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200"
                          >
                            <input
                              type="radio"
                              name={`correct_${qIdx}`}
                              checked={q.correctOptionIndex === optIdx}
                              onChange={() => handleUpdateQuestion(qIdx, "correctOptionIndex", optIdx)}
                              className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-xs font-bold text-slate-400 w-4">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <input
                              type="text"
                              required
                              placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                              value={opt}
                              onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                              className="text-xs w-full focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Scientific Explanation */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Scientific Explanation (Shown to trainees after test completion)
                      </label>
                      <input
                        type="text"
                        placeholder="Provide scientific rationale / reference for correct choice..."
                        value={q.explanation}
                        onChange={(e) => handleUpdateQuestion(qIdx, "explanation", e.target.value)}
                        className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Save & Publish Assessment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: TRAINEE GRADEBOOK & MONITORING */}
      {activeTab === "monitoring" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Trainee Participation & Assessment Performance Gradebook
            </h2>
            <p className="text-xs text-slate-500">
              Monitor test scores, completion timestamps, and pass/fail statistics across all meteorological courses.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-[#0b2545] text-white uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">Trainee Name</th>
                    <th className="py-3.5 px-4 font-bold">Assessment Title</th>
                    <th className="py-3.5 px-4 font-bold">Score</th>
                    <th className="py-3.5 px-4 font-bold">Percentage</th>
                    <th className="py-3.5 px-4 font-bold">Status</th>
                    <th className="py-3.5 px-4 font-bold">Submission Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.length > 0 ? (
                    submissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {sub.traineeName}
                        </td>
                        <td className="py-3 px-4">{sub.quizTitle}</td>
                        <td className="py-3 px-4 font-mono font-bold">
                          {sub.score} / {sub.totalQuestions}
                        </td>
                        <td className="py-3 px-4 font-bold">{sub.percentage}%</td>
                        <td className="py-3 px-4">
                          {sub.passed ? (
                            <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 font-bold text-[10px]">
                              PASSED
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold text-[10px]">
                              FAILED
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                          {new Date(sub.submittedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                        No submissions recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TRAINER LIBRARY UPLOADER */}
      {activeTab === "library" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Form */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Upload New Study Material
            </h3>

            {resSuccessNotice && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg">
                {resSuccessNotice}
              </div>
            )}

            <form onSubmit={handleUploadResource} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Resource Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lecture 05: Radar Clutter Filtering"
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Resource Type
                </label>
                <select
                  value={resType}
                  onChange={(e) => setResType(e.target.value as any)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                >
                  <option value="video">Recorded Video Lecture</option>
                  <option value="presentation">Presentation Deck (PPT/Slides)</option>
                  <option value="manual">Technical SOP / Manual (PDF)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Course
                </label>
                <select
                  value={resCourseId}
                  onChange={(e) => setResCourseId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL / Resource Link
                </label>
                <input
                  type="url"
                  placeholder="https://imdpune.gov.in/lecture_05.mp4"
                  value={resUrl}
                  onChange={(e) => setResUrl(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Size or Duration
                </label>
                <input
                  type="text"
                  placeholder="e.g. 48 Mins or 12.5 MB (PDF)"
                  value={resSize}
                  onChange={(e) => setResSize(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Summary Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain topics covered in this material..."
                  value={resDesc}
                  onChange={(e) => setResDesc(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Upload to Library
              </button>
            </form>
          </div>

          {/* Uploaded Materials List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-2">
              Currently Available Resources in Trainer Library ({resources.length})
            </h3>

            <div className="space-y-3">
              {resources.map((res) => (
                <div
                  key={res.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-2 flex justify-between items-start"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {res.type}
                      </span>
                      <span className="text-[11px] text-blue-700 font-semibold">
                        {res.courseTitle}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900">{res.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{res.description}</p>
                    <div className="text-[11px] text-slate-400">
                      Uploaded by: {res.uploadedByName} • {res.sizeOrDuration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
