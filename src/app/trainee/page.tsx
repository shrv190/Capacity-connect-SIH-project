"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { StorageService } from "@/lib/storage";
import {
  Course,
  Quiz,
  LibraryResource,
  Certificate,
  QuizSubmission,
  Qualification,
  WorkExperience,
} from "@/types";
import {
  User,
  GraduationCap,
  BookOpen,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Video,
  Plus,
  Star,
  Printer,
  Shield,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  QrCode,
  Calendar,
} from "lucide-react";
import confetti from "canvas-confetti";
import AuthModal from "@/components/AuthModal";

export default function TraineePortal() {
  const { currentUser, updateCurrentUserProfile } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "profile" | "courses" | "library" | "assessments" | "feedback"
  >("profile");

  const [courses, setCourses] = useState<Course[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [resources, setResources] = useState<LibraryResource[]>([]);
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);

  // Assessment Engine States
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizTimerSeconds, setQuizTimerSeconds] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [lastSubmission, setLastSubmission] = useState<QuizSubmission | null>(null);

  // Certificate Modal State
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  // Profile Form States
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [qualDegree, setQualDegree] = useState("");
  const [qualInst, setQualInst] = useState("");
  const [qualYear, setQualYear] = useState("");
  const [expDesig, setExpDesig] = useState("");
  const [expStation, setExpStation] = useState("");
  const [expYears, setExpYears] = useState("");

  // Feedback States
  const [feedbackCourseId, setFeedbackCourseId] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComments, setFeedbackComments] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  useEffect(() => {
    refreshData();
  }, [currentUser]);

  const refreshData = () => {
    setCourses(StorageService.getCourses());
    setQuizzes(StorageService.getQuizzes());
    setResources(StorageService.getResources());
    if (currentUser) {
      setSubmissions(StorageService.getSubmissionsByTrainee(currentUser.uid));
    }
  };

  // Timer countdown for active quiz
  useEffect(() => {
    if (!activeQuiz || quizCompleted) return;

    if (quizTimerSeconds <= 0) {
      handleAutoSubmitQuiz();
      return;
    }

    const interval = setInterval(() => {
      setQuizTimerSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeQuiz, quizTimerSeconds, quizCompleted]);

  // Quiz Handling
  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizTimerSeconds(quiz.durationMinutes * 60);
    setQuizCompleted(false);
    setLastSubmission(null);
  };

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleAutoSubmitQuiz = () => {
    if (!activeQuiz || !currentUser) return;

    let score = 0;
    const answerRecords = activeQuiz.questions.map((q) => {
      const selected = selectedAnswers[q.id];
      const isCorrect = selected === q.correctOptionIndex;
      if (isCorrect) score += 1;
      return {
        questionId: q.id,
        selectedOption: selected !== undefined ? selected : -1,
        isCorrect,
      };
    });

    const percentage = Math.round((score / activeQuiz.questions.length) * 100);
    const passed = percentage >= activeQuiz.passingScore;

    const sub = StorageService.submitQuiz({
      quizId: activeQuiz.id,
      quizTitle: activeQuiz.title,
      courseId: activeQuiz.courseId,
      traineeId: currentUser.uid,
      traineeName: currentUser.displayName,
      score,
      totalQuestions: activeQuiz.questions.length,
      percentage,
      passed,
      answers: answerRecords,
    });

    setLastSubmission(sub);
    setQuizCompleted(true);
    refreshData();

    if (passed) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  // Profile Updates
  const handleAddSkill = () => {
    if (!newSkill.trim() || !currentUser) return;
    const updated = [...(currentUser.skills || []), newSkill.trim()];
    updateCurrentUserProfile({ skills: updated });
    setNewSkill("");
  };

  const handleAddInterest = () => {
    if (!newInterest.trim() || !currentUser) return;
    const updated = [...(currentUser.interests || []), newInterest.trim()];
    updateCurrentUserProfile({ interests: updated });
    setNewInterest("");
  };

  const handleAddQualification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !qualDegree) return;
    const newQ: Qualification = {
      id: `q-${Date.now()}`,
      degree: qualDegree,
      institution: qualInst,
      year: qualYear,
      specialization: "Atmospheric & Earth Sciences",
    };
    const updated = [...(currentUser.qualifications || []), newQ];
    updateCurrentUserProfile({ qualifications: updated });
    setQualDegree("");
    setQualInst("");
    setQualYear("");
  };

  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !expDesig) return;
    const newE: WorkExperience = {
      id: `e-${Date.now()}`,
      designation: expDesig,
      organization: "India Meteorological Department (MoES)",
      station: expStation,
      years: parseInt(expYears) || 1,
    };
    const updated = [...(currentUser.experience || []), newE];
    updateCurrentUserProfile({ experience: updated });
    setExpDesig("");
    setExpStation("");
    setExpYears("");
  };

  // Feedback submit
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !feedbackCourseId) return;

    const course = courses.find((c) => c.id === feedbackCourseId);
    StorageService.addFeedback({
      courseId: feedbackCourseId,
      courseTitle: course ? course.title : "Course Module",
      traineeId: currentUser.uid,
      traineeName: currentUser.displayName,
      rating: feedbackRating,
      contentQuality: feedbackRating,
      trainerClarity: feedbackRating,
      comments: feedbackComments,
    });

    setFeedbackSuccess(true);
    setFeedbackComments("");
    setTimeout(() => setFeedbackSuccess(false), 4000);
  };

  // If user is not logged in
  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 sm:p-10 bg-white rounded-2xl border border-slate-200 text-center space-y-5 shadow-sm">
        <div className="w-16 h-16 bg-blue-50 text-blue-700 rounded-2xl mx-auto flex items-center justify-center">
          <GraduationCap className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Sign In to Trainee Portal</h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
            Please sign in with your official account to access your enrolled courses, lecture recordings, timed assessments, and verifiable certificates.
          </p>
        </div>
        <div className="pt-2 flex justify-center">
          <button
            onClick={() => setAuthModalOpen(true)}
            className="px-6 py-3 bg-[#0b2545] hover:bg-[#003b6d] text-white rounded-xl font-bold text-sm shadow transition"
          >
            Sign In / Register
          </button>
        </div>
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    );
  }

  const enrolledCourses = courses.filter((c) =>
    c.enrolledTraineeIds.includes(currentUser.uid)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Profile Summary Card */}
      <div className="bg-gradient-to-r from-[#0b2545] to-[#134e5e] text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-400 font-bold text-2xl shadow-inner">
            {currentUser.displayName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold">{currentUser.displayName}</h1>
              {currentUser.status === "approved" ? (
                <span className="text-[11px] bg-green-500/20 text-green-300 border border-green-400/30 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-400" /> Approved Trainee
                </span>
              ) : (
                <span className="text-[11px] bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                  Pending Admin Approval
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {currentUser.designation} • {currentUser.department} • {currentUser.location}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right text-xs bg-white/10 px-3 py-2 rounded-xl border border-white/10">
            <span className="text-slate-300 block text-[10px] uppercase font-bold">Enrolled Courses</span>
            <span className="text-lg font-extrabold text-amber-400">{enrolledCourses.length}</span>
          </div>
          <div className="text-right text-xs bg-white/10 px-3 py-2 rounded-xl border border-white/10">
            <span className="text-slate-300 block text-[10px] uppercase font-bold">Certificates</span>
            <span className="text-lg font-extrabold text-cyan-300">
              {currentUser.certificates ? currentUser.certificates.length : 0}
            </span>
          </div>
        </div>
      </div>

      {/* Trainee Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-2 text-sm font-semibold scrollbar-none">
        <button
          onClick={() => {
            setActiveTab("profile");
            setActiveQuiz(null);
          }}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === "profile" && !activeQuiz
              ? "bg-[#0b2545] text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Professional Profile</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("courses");
            setActiveQuiz(null);
          }}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === "courses" && !activeQuiz
              ? "bg-[#0b2545] text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>My Enrolled Courses ({enrolledCourses.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("library");
            setActiveQuiz(null);
          }}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === "library" && !activeQuiz
              ? "bg-[#0b2545] text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Trainer Library ({resources.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("assessments")}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === "assessments" || activeQuiz
              ? "bg-[#0b2545] text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>MCQ Assessments & Certifications</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("feedback");
            setActiveQuiz(null);
          }}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === "feedback" && !activeQuiz
              ? "bg-[#0b2545] text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Star className="w-4 h-4 text-amber-500" />
          <span>Course Feedback</span>
        </button>
      </div>

      {/* TAB 1: PROFESSIONAL PROFILE */}
      {activeTab === "profile" && !activeQuiz && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Col 1 & 2: Qualifications & Experience */}
          <div className="lg:col-span-2 space-y-6">
            {/* Qualifications Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-700" />
                  <h3 className="font-bold text-base text-slate-900">
                    Educational & Scientific Qualifications
                  </h3>
                </div>
              </div>

              <div className="space-y-3">
                {currentUser.qualifications && currentUser.qualifications.length > 0 ? (
                  currentUser.qualifications.map((q) => (
                    <div
                      key={q.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex justify-between items-start"
                    >
                      <div>
                        <div className="font-bold text-sm text-slate-900">{q.degree}</div>
                        <div className="text-xs text-slate-600">{q.institution}</div>
                        <div className="text-[11px] text-blue-700 font-medium mt-1">
                          Specialization: {q.specialization}
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {q.year}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">No qualifications added yet.</p>
                )}
              </div>

              {/* Add Qualification Form */}
              <form onSubmit={handleAddQualification} className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Degree (e.g. M.Sc Met)"
                  value={qualDegree}
                  onChange={(e) => setQualDegree(e.target.value)}
                  className="text-xs p-2 border border-slate-300 rounded-lg"
                />
                <input
                  type="text"
                  required
                  placeholder="University / Institute"
                  value={qualInst}
                  onChange={(e) => setQualInst(e.target.value)}
                  className="text-xs p-2 border border-slate-300 rounded-lg"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Year"
                    value={qualYear}
                    onChange={(e) => setQualYear(e.target.value)}
                    className="text-xs p-2 border border-slate-300 rounded-lg w-20"
                  />
                  <button
                    type="submit"
                    className="flex-1 px-3 py-2 bg-[#0b2545] text-white text-xs font-semibold rounded-lg hover:bg-[#003b6d]"
                  >
                    + Add
                  </button>
                </div>
              </form>
            </div>

            {/* Work Experience Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-700" />
                  <h3 className="font-bold text-base text-slate-900">
                    Work Experience & Departmental Postings
                  </h3>
                </div>
              </div>

              <div className="space-y-3">
                {currentUser.experience && currentUser.experience.length > 0 ? (
                  currentUser.experience.map((e) => (
                    <div
                      key={e.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex justify-between items-start"
                    >
                      <div>
                        <div className="font-bold text-sm text-slate-900">{e.designation}</div>
                        <div className="text-xs text-slate-600">{e.organization}</div>
                        <div className="text-[11px] text-emerald-700 font-medium mt-1">
                          Station / Observatory: {e.station}
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {e.years} Years Exp.
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">No experience records added.</p>
                )}
              </div>

              {/* Add Experience Form */}
              <form onSubmit={handleAddExperience} className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Designation (e.g. Scientific Officer)"
                  value={expDesig}
                  onChange={(e) => setExpDesig(e.target.value)}
                  className="text-xs p-2 border border-slate-300 rounded-lg"
                />
                <input
                  type="text"
                  required
                  placeholder="Station (e.g. RMC Chennai)"
                  value={expStation}
                  onChange={(e) => setExpStation(e.target.value)}
                  className="text-xs p-2 border border-slate-300 rounded-lg"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    required
                    placeholder="Years"
                    value={expYears}
                    onChange={(e) => setExpYears(e.target.value)}
                    className="text-xs p-2 border border-slate-300 rounded-lg w-20"
                  />
                  <button
                    type="submit"
                    className="flex-1 px-3 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800"
                  >
                    + Add
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Col 3: Skills, Interests & Certificates */}
          <div className="space-y-6">
            {/* Skills & Competencies */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                Competencies & Technical Skills
              </h3>

              <div className="flex flex-wrap gap-1.5">
                {currentUser.skills && currentUser.skills.length > 0 ? (
                  currentUser.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold rounded-lg"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No skills added yet.</p>
                )}
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <input
                  type="text"
                  placeholder="e.g. WRF, Python, Radar"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="text-xs p-2 border border-slate-300 rounded-lg flex-1"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-3 py-1.5 bg-[#0b2545] text-white text-xs font-semibold rounded-lg hover:bg-[#003b6d]"
                >
                  + Add
                </button>
              </div>
            </div>

            {/* Research & Functional Interests */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                Research & Operational Interests
              </h3>

              <div className="flex flex-wrap gap-1.5">
                {currentUser.interests && currentUser.interests.length > 0 ? (
                  currentUser.interests.map((int, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-purple-50 text-purple-800 border border-purple-200 text-xs font-semibold rounded-lg"
                    >
                      {int}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No interests added.</p>
                )}
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <input
                  type="text"
                  placeholder="e.g. Cyclone Tracking"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  className="text-xs p-2 border border-slate-300 rounded-lg flex-1"
                />
                <button
                  type="button"
                  onClick={handleAddInterest}
                  className="px-3 py-1.5 bg-purple-700 text-white text-xs font-semibold rounded-lg hover:bg-purple-800"
                >
                  + Add
                </button>
              </div>
            </div>

            {/* Earned Certificates Gallery */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
                <span>Earned Digital Certificates</span>
                <Award className="w-4 h-4 text-amber-500" />
              </h3>

              <div className="space-y-2">
                {currentUser.certificates && currentUser.certificates.length > 0 ? (
                  currentUser.certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5"
                    >
                      <div className="font-bold text-xs text-slate-900">{cert.courseTitle}</div>
                      <div className="text-[11px] text-amber-900 flex justify-between">
                        <span>Issued: {cert.issueDate}</span>
                        <span className="font-bold">{cert.grade} ({cert.scorePercentage}%)</span>
                      </div>
                      <button
                        onClick={() => setSelectedCert(cert)}
                        className="w-full mt-1 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <Printer className="w-3.5 h-3.5" /> View / Print Certificate
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Complete and pass subject-wise MCQ assessments to earn verifiable MoES/IMD credentials.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY ENROLLED COURSES */}
      {activeTab === "courses" && !activeQuiz && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Enrolled Training Modules</h2>
              <p className="text-xs text-slate-500">
                Track your syllabus milestones, learning resources, and examinations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrolledCourses.map((course) => {
              const courseQuizzes = quizzes.filter((q) => q.courseId === course.id);
              const courseResources = resources.filter((r) => r.courseId === course.id);
              const userSub = submissions.find((s) => s.courseId === course.id && s.passed);

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {course.code}
                      </span>
                      {userSub ? (
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Completed
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                          In Progress
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-base text-slate-900">{course.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2">{course.description}</p>

                    <div className="pt-2 text-xs text-slate-500 grid grid-cols-2 gap-2">
                      <div>Trainer: <strong>{course.trainerName}</strong></div>
                      <div>Duration: <strong>{course.durationHours} Hours</strong></div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setActiveTab("library")}
                      className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1"
                    >
                      <Video className="w-3.5 h-3.5 text-blue-600" />
                      <span>Resources ({courseResources.length})</span>
                    </button>

                    <button
                      onClick={() => {
                        const targetQuiz = courseQuizzes[0];
                        if (targetQuiz) {
                          startQuiz(targetQuiz);
                        } else {
                          alert("No assessment published for this module yet.");
                        }
                      }}
                      className="px-4 py-1.5 bg-[#0b2545] hover:bg-[#003b6d] text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>Take Assessment</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: TRAINER LIBRARY & STUDY MATERIALS */}
      {activeTab === "library" && !activeQuiz && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Trainer Library & Resource Repository</h2>
            <p className="text-xs text-slate-500">
              Access recorded lectures, SOP technical manuals, and presentation decks uploaded by faculty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((res) => (
              <div
                key={res.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        res.type === "video"
                          ? "bg-red-100 text-red-800"
                          : res.type === "presentation"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {res.type}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {res.sizeOrDuration}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 line-clamp-2">{res.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {res.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    By: <strong>{res.uploadedByName}</strong>
                  </span>

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[#0b2545] hover:bg-[#003b6d] text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <span>Open Material</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SUBJECT-WISE MCQ ASSESSMENTS */}
      {(activeTab === "assessments" || activeQuiz) && (
        <div className="space-y-6">
          {!activeQuiz ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Subject-Wise MCQ Assessments
                </h2>
                <p className="text-xs text-slate-500">
                  Timed standardized tests with instant scoring and digital certificate unlocks.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quizzes.map((quiz) => {
                  const sub = submissions.find((s) => s.quizId === quiz.id);

                  return (
                    <div
                      key={quiz.id}
                      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                            {quiz.courseTitle}
                          </span>
                          <h3 className="font-bold text-base text-slate-900 mt-1">
                            {quiz.title}
                          </h3>
                        </div>
                        {sub && (
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                              sub.passed
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            Score: {sub.percentage}% ({sub.passed ? "PASSED" : "FAILED"})
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{quiz.description}</p>

                      <div className="grid grid-cols-3 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-600">
                        <div>
                          Duration: <strong>{quiz.durationMinutes} Mins</strong>
                        </div>
                        <div>
                          Questions: <strong>{quiz.questions.length} MCQs</strong>
                        </div>
                        <div>
                          Passing: <strong>{quiz.passingScore}%</strong>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-slate-400">
                          Deadline: {new Date(quiz.deadline).toLocaleDateString()}
                        </span>

                        <button
                          onClick={() => startQuiz(quiz)}
                          className="px-4 py-2 bg-[#0b2545] hover:bg-[#003b6d] text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5"
                        >
                          <Award className="w-4 h-4 text-amber-400" />
                          <span>{sub ? "Retake Assessment" : "Attempt Assessment"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Active Interactive Assessment Screen */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
              {/* Quiz Header Bar with Countdown Timer */}
              <div className="bg-[#0b2545] text-white p-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
                    {activeQuiz.courseTitle}
                  </span>
                  <h2 className="text-lg font-bold">{activeQuiz.title}</h2>
                </div>

                {!quizCompleted && (
                  <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl border border-white/20">
                    <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
                    <div>
                      <span className="text-[10px] text-slate-300 block uppercase font-bold">
                        Time Remaining
                      </span>
                      <span className="text-lg font-mono font-extrabold text-white">
                        {Math.floor(quizTimerSeconds / 60)}:
                        {quizTimerSeconds % 60 < 10 ? `0${quizTimerSeconds % 60}` : quizTimerSeconds % 60}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {!quizCompleted ? (
                /* Question & Palette Layout */
                <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Active Question View */}
                  <div className="lg:col-span-3 space-y-6">
                    {(() => {
                      const q = activeQuiz.questions[currentQuestionIndex];
                      return (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-xs font-bold text-slate-500 border-b border-slate-200 pb-2">
                            <span>
                              Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
                            </span>
                            <span className="text-blue-700">Subject: Radar & Atmospheric Met</span>
                          </div>

                          <h3 className="text-base font-bold text-slate-900 leading-snug">
                            {q.questionText}
                          </h3>

                          {/* Options */}
                          <div className="space-y-2 pt-2">
                            {q.options.map((opt, optIdx) => {
                              const isSelected = selectedAnswers[q.id] === optIdx;

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() => handleSelectOption(q.id, optIdx)}
                                  className={`w-full p-4 rounded-xl border text-left text-xs font-semibold transition flex items-center gap-3 ${
                                    isSelected
                                      ? "bg-blue-50 border-blue-600 text-blue-900 shadow-sm"
                                      : "border-slate-200 hover:bg-slate-50 text-slate-800"
                                  }`}
                                >
                                  <span
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                      isSelected
                                        ? "bg-blue-600 text-white"
                                        : "bg-slate-200 text-slate-700"
                                    }`}
                                  >
                                    {String.fromCharCode(65 + optIdx)}
                                  </span>
                                  <span>{opt}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Prev / Next & Submit Controls */}
                    <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                      <button
                        type="button"
                        disabled={currentQuestionIndex === 0}
                        onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                        className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 disabled:opacity-40"
                      >
                        ← Previous
                      </button>

                      <div className="flex gap-2">
                        {currentQuestionIndex < activeQuiz.questions.length - 1 ? (
                          <button
                            type="button"
                            onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                            className="px-5 py-2 bg-[#0b2545] text-white rounded-xl text-xs font-semibold hover:bg-[#003b6d]"
                          >
                            Next Question →
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleAutoSubmitQuiz}
                            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md"
                          >
                            Final Submit Assessment
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Question Palette Sidebar */}
                  <div className="border-t lg:border-t-0 lg:border-l border-slate-200 lg:pl-6 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Question Palette
                    </h4>
                    <div className="grid grid-cols-5 gap-2">
                      {activeQuiz.questions.map((q, idx) => {
                        const isAnswered = selectedAnswers[q.id] !== undefined;
                        const isCurrent = currentQuestionIndex === idx;

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setCurrentQuestionIndex(idx)}
                            className={`w-9 h-9 rounded-lg font-bold text-xs flex items-center justify-center transition ${
                              isCurrent
                                ? "ring-2 ring-[#0b2545] font-extrabold"
                                : ""
                            } ${
                              isAnswered
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                          >
                            {idx + 1}
                          </button>
                        );
                      })}
                    </div>

                    <div className="text-[11px] text-slate-500 space-y-1 pt-3 border-t border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
                        <span>Answered</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-slate-200 inline-block" />
                        <span>Unanswered</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAutoSubmitQuiz}
                      className="w-full mt-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-sm"
                    >
                      Submit Exam Now
                    </button>
                  </div>
                </div>
              ) : (
                /* Assessment Result & Scorecard */
                <div className="p-8 space-y-6">
                  {lastSubmission && (
                    <div className="text-center space-y-3 max-w-xl mx-auto">
                      <div
                        className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                          lastSubmission.passed
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {lastSubmission.passed ? (
                          <CheckCircle className="w-10 h-10" />
                        ) : (
                          <XCircle className="w-10 h-10" />
                        )}
                      </div>

                      <h3 className="text-2xl font-extrabold text-slate-900">
                        {lastSubmission.passed
                          ? "Congratulations! Assessment Passed"
                          : "Assessment Not Cleared"}
                      </h3>

                      <p className="text-sm text-slate-600">
                        You scored{" "}
                        <strong className="text-slate-900 font-bold">
                          {lastSubmission.score} out of {lastSubmission.totalQuestions}
                        </strong>{" "}
                        ({lastSubmission.percentage}%). Required passing threshold:{" "}
                        <strong>{activeQuiz.passingScore}%</strong>.
                      </p>

                      {lastSubmission.passed && (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs">
                          <Award className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                          <strong>Official Digital Certificate Unlocked!</strong> You can now view and print your verified certificate.
                        </div>
                      )}

                      <div className="flex justify-center gap-3 pt-3">
                        <button
                          onClick={() => setActiveQuiz(null)}
                          className="px-5 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          Back to Assessments
                        </button>
                        {lastSubmission.passed && (
                          <button
                            onClick={() => {
                              const userCerts = StorageService.getUserById(currentUser.uid)?.certificates;
                              if (userCerts && userCerts.length > 0) {
                                setSelectedCert(userCerts[userCerts.length - 1]);
                              }
                            }}
                            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
                          >
                            <Printer className="w-4 h-4" /> View Certificate
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Answer Key Review with Scientific Explanations */}
                  <div className="pt-6 border-t border-slate-200 space-y-4">
                    <h4 className="font-bold text-sm text-slate-900">
                      Detailed Answer Review & Scientific Explanations
                    </h4>
                    <div className="space-y-4">
                      {activeQuiz.questions.map((q, idx) => {
                        const userAns = selectedAnswers[q.id];
                        const isCorrect = userAns === q.correctOptionIndex;

                        return (
                          <div
                            key={q.id}
                            className={`p-4 rounded-xl border ${
                              isCorrect
                                ? "bg-green-50/60 border-green-200"
                                : "bg-red-50/60 border-red-200"
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {isCorrect ? (
                                <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                              )}
                              <div className="space-y-1 text-xs">
                                <p className="font-bold text-slate-900">
                                  {idx + 1}. {q.questionText}
                                </p>
                                <p className="text-slate-700">
                                  Your selection:{" "}
                                  <strong>
                                    {userAns !== undefined
                                      ? q.options[userAns]
                                      : "Not Answered"}
                                  </strong>
                                </p>
                                {!isCorrect && (
                                  <p className="text-green-800 font-semibold">
                                    Correct Answer: {q.options[q.correctOptionIndex]}
                                  </p>
                                )}
                                <div className="mt-2 p-2.5 bg-white/80 rounded-lg text-slate-600 border border-slate-200/60">
                                  <strong>Scientific Explanation:</strong> {q.explanation}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: COURSE FEEDBACK */}
      {activeTab === "feedback" && !activeQuiz && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Course & Content Feedback</h2>
            <p className="text-xs text-slate-500">
              Provide constructive feedback on curriculum quality, trainer clarity, and practical utility.
            </p>
          </div>

          {feedbackSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Thank you! Your feedback has been submitted to the MoES Training Directorate.</span>
            </div>
          )}

          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Course / Module
              </label>
              <select
                required
                value={feedbackCourseId}
                onChange={(e) => setFeedbackCourseId(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
              >
                <option value="">-- Choose Course --</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} - {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Overall Quality Rating (1 to 5 Stars)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedbackRating(star)}
                    className="p-1"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= feedbackRating
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Written Feedback & Suggestions
              </label>
              <textarea
                required
                rows={4}
                value={feedbackComments}
                onChange={(e) => setFeedbackComments(e.target.value)}
                placeholder="Share your thoughts on lecture depth, hands-on radar/NWP exercises, and trainer explanations..."
                className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0b2545]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#0b2545] hover:bg-[#003b6d] text-white text-xs font-bold rounded-xl shadow-sm"
            >
              Submit Official Feedback
            </button>
          </form>
        </div>
      )}

      {/* OFFICIAL VERIFIABLE CERTIFICATE MODAL */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-2 relative">
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-2 z-10 no-print"
            >
              ✕
            </button>

            {/* Printable Certificate Canvas */}
            <div
              id="printable-certificate"
              className="border-8 border-double border-[#0b2545] p-8 bg-gradient-to-br from-amber-50/30 via-white to-amber-50/20 rounded-xl relative text-center space-y-4"
            >
              {/* National Emblem & Department Crest representation */}
              <div className="flex justify-center items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-amber-600 bg-amber-50 flex items-center justify-center text-amber-800 font-extrabold text-sm shadow-sm">
                  सत्यमेव<br/>जयते
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-widest font-extrabold text-slate-600">
                  Government of India • भारत सरकार
                </h4>
                <h3 className="text-sm font-bold text-slate-800">
                  Ministry of Earth Sciences (MoES)
                </h3>
                <h2 className="text-base font-extrabold text-[#0b2545]">
                  INDIA METEOROLOGICAL DEPARTMENT
                </h2>
              </div>

              <div className="tricolor-ribbon my-2" />

              <div>
                <span className="text-[11px] font-bold text-amber-700 tracking-widest uppercase">
                  Certificate of Competency & Completion
                </span>
                <p className="text-xs text-slate-500 mt-1">This is officially certified that</p>
                <h1 className="text-2xl font-serif font-bold text-slate-900 my-1">
                  {currentUser.displayName}
                </h1>
                <p className="text-xs text-slate-600 max-w-lg mx-auto">
                  has successfully undergone intensive digital capacity building and cleared the national competency assessment for
                </p>
                <h3 className="text-lg font-bold text-blue-900 mt-2">
                  {selectedCert.courseTitle}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Awarded with <strong>{selectedCert.grade}</strong> ({selectedCert.scorePercentage}% Score)
                </p>
              </div>

              <div className="pt-6 grid grid-cols-3 items-end text-xs text-slate-600">
                <div className="text-left space-y-1">
                  <div className="font-mono text-[10px] text-slate-500">
                    Verification ID:
                  </div>
                  <div className="font-mono font-bold text-slate-800 text-[11px]">
                    {selectedCert.verificationCode}
                  </div>
                  <div className="text-[10px] text-slate-400">Date: {selectedCert.issueDate}</div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full border-2 border-amber-500 bg-amber-50/80 flex items-center justify-center text-amber-700 font-bold text-[10px] shadow-sm">
                    ★ MOES ★<br/>SEAL
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div className="font-serif italic font-bold text-slate-800 text-sm">
                    Dr. M. Mohapatra
                  </div>
                  <div className="border-t border-slate-300 pt-1 text-[10px] font-semibold text-slate-500">
                    Director General of Meteorology
                  </div>
                </div>
              </div>
            </div>

            {/* Print Action Bar */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center no-print">
              <span className="text-xs text-slate-500 font-mono">
                Verification Hash: {selectedCert.verificationCode}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedCert(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2 bg-[#0b2545] hover:bg-[#003b6d] text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Print / Save as PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
