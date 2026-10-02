"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { FirestoreService } from "@/lib/firestore";
import {
  UserProfile,
  Course,
  QuizSubmission,
  Announcement,
  CompetencyMapping,
  UserRole,
} from "@/types";
import {
  ShieldCheck,
  Users,
  CheckCircle,
  XCircle,
  Bell,
  Award,
  BarChart3,
  Network,
  Search,
  Plus,
  Trash2,
  Send,
  Building,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Archive,
  ArrowRightLeft,
  UserX,
} from "lucide-react";
import AuthModal from "@/components/AuthModal";

export default function AdminPortal() {
  const { currentUser } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "approvals" | "courses" | "analytics" | "cms" | "competency"
  >("approvals");

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [competencies, setCompetencies] = useState<CompetencyMapping[]>([]);

  // Search & Filter state for User Directory
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // CMS Announcement Form State
  const [annTitle, setAnnTitle] = useState("");
  const [annCategory, setAnnCategory] = useState<
    "circular" | "achievement" | "urgent_notice" | "course_spotlight"
  >("circular");
  const [annPriority, setAnnPriority] = useState<"normal" | "high">("normal");
  const [annContent, setAnnContent] = useState("");
  const [cmsNotice, setCmsNotice] = useState<string | null>(null);

  // Competency Filter State
  const [competencySearch, setCompetencySearch] = useState("");

  // Migration Modal State
  const [migrationModalOpen, setMigrationModalOpen] = useState(false);
  const [courseToMigrate, setCourseToMigrate] = useState<Course | null>(null);
  const [targetTrainerId, setTargetTrainerId] = useState("");

  useEffect(() => {
    refreshData();
  }, [currentUser]);

  const refreshData = async () => {
    const [dbUsers, dbCourses, dbSubmissions, dbAnnouncements, dbCompetencies] = await Promise.all([
      FirestoreService.getUsers(),
      FirestoreService.getCourses(),
      FirestoreService.getSubmissions(),
      FirestoreService.getAnnouncements(),
      FirestoreService.getCompetencies()
    ]);
    setUsers(dbUsers);
    setCourses(dbCourses);
    setSubmissions(dbSubmissions);
    setAnnouncements(dbAnnouncements);
    setCompetencies(dbCompetencies);
  };

  const handleApproveUser = async (uid: string) => {
    await FirestoreService.updateUserStatus(uid, "approved");
    refreshData();
  };

  const handleRejectUser = async (uid: string) => {
    await FirestoreService.updateUserStatus(uid, "suspended");
    refreshData();
  };

  const handleDeleteUser = async (uid: string) => {
    if (confirm("Are you sure you want to permanently delete this user?")) {
      await FirestoreService.deleteUser(uid);
      refreshData();
    }
  };

  const handleChangeRole = async (uid: string, newRole: UserRole) => {
    await FirestoreService.updateUserStatus(uid, "approved", newRole);
    refreshData();
  };

  // Publish Announcement
  const handlePublishAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !annTitle || !annContent) return;

    await FirestoreService.addAnnouncement({
      title: annTitle,
      category: annCategory,
      priority: annPriority,
      content: annContent,
      publishedBy: currentUser.displayName,
    });

    setCmsNotice(`Announcement "${annTitle}" published to Public Homepage!`);
    setAnnTitle("");
    setAnnContent("");
    refreshData();
    setTimeout(() => setCmsNotice(null), 4000);
  };

  const handleDeleteAnnouncement = async (id: string) => {
    await FirestoreService.deleteAnnouncement(id);
    refreshData();
  };

  const handleDeleteCourse = async (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      await FirestoreService.deleteCourse(id);
      refreshData();
    }
  };

  const handleArchiveCourse = async (id: string, currentlyArchived: boolean) => {
    if (currentlyArchived) {
      await FirestoreService.unarchiveCourse(id);
    } else {
      await FirestoreService.archiveCourse(id, true); // Admin archiving
    }
    refreshData();
  };

  const initiateMigration = (course: Course) => {
    setCourseToMigrate(course);
    setTargetTrainerId("");
    setMigrationModalOpen(true);
  };

  const submitMigrationRequest = async () => {
    if (!courseToMigrate || !targetTrainerId) return;
    const trainer = users.find(u => u.uid === targetTrainerId);
    if (!trainer) return;
    
    await FirestoreService.requestCourseMigration(courseToMigrate.id, trainer.uid, trainer.displayName);
    setMigrationModalOpen(false);
    setCourseToMigrate(null);
    refreshData();
  };

  // Competency CMS Form State
  const [compSubject, setCompSubject] = useState("");
  const [compDomain, setCompDomain] = useState("");
  const [compSkills, setCompSkills] = useState("");
  const [compExp, setCompExp] = useState<number>(3);
  const [compDesc, setCompDesc] = useState("");

  const handleAddCompetency = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compSubject || !compDomain || !compSkills) return;
    
    await FirestoreService.addCompetency({
      subject: compSubject,
      domain: compDomain,
      requiredSkills: compSkills.split(",").map(s => s.trim()).filter(Boolean),
      minExperienceYears: compExp,
      recommendedTrainerIds: [],
      description: compDesc
    });
    
    setCompSubject("");
    setCompDomain("");
    setCompSkills("");
    setCompDesc("");
    setCompExp(3);
    refreshData();
  };

  const handleDeleteCompetency = async (id: string) => {
    await FirestoreService.deleteCompetency(id);
    refreshData();
  };

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 sm:p-10 bg-white rounded-2xl border border-slate-200 text-center space-y-5 shadow-sm">
        <div className="w-16 h-16 bg-amber-50 text-amber-700 rounded-2xl mx-auto flex items-center justify-center">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Admin Console Sign In</h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
            Please sign in with authorized Administrative or Director General Office credentials to manage user approvals, national personnel directories, executive analytics, and competency mapping.
          </p>
        </div>
        <div className="pt-2 flex justify-center">
          <button
            onClick={() => setAuthModalOpen(true)}
            className="px-6 py-3 bg-[#0b2545] hover:bg-[#003b6d] text-white rounded-xl font-bold text-sm shadow transition"
          >
            Sign In with Administrator Credentials
          </button>
        </div>
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    );
  }

  // If logged in but not an admin
  if (currentUser.role !== "admin") {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 sm:p-10 bg-white rounded-2xl border border-slate-200 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 bg-red-50 text-red-700 rounded-2xl mx-auto flex items-center justify-center text-xl">
          🚫
        </div>
        <h2 className="text-xl font-bold text-slate-900">Administrative Access Restricted</h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          You are currently signed in as {currentUser.displayName} ({currentUser.role}). This section is strictly reserved for supervisory administrators.
        </p>
        <div className="pt-3 flex justify-center gap-3">
          <a
            href={currentUser.role === "trainer" ? "/trainer" : "/trainee"}
            className="px-5 py-2.5 bg-[#0b2545] text-white rounded-xl font-bold text-xs shadow"
          >
            Go to My Workspace
          </a>
        </div>
      </div>
    );
  }

  // Filter users
  const pendingUsers = users.filter((u) => u.status === "pending");
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Calculate Analytics Metrics
  const totalTrainees = users.filter((u) => u.role === "trainee").length;
  const totalTrainers = users.filter((u) => u.role === "trainer").length;
  const passedSubmissions = submissions.filter((s) => s.passed).length;
  const passRate =
    submissions.length > 0
      ? Math.round((passedSubmissions / submissions.length) * 100)
      : 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Profile Summary Card */}
      <div className="bg-gradient-to-r from-[#0b2545] via-[#003b6d] to-[#134e5e] text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-400 font-bold text-2xl shadow-inner">
            🏛️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold">{currentUser.displayName}</h1>
              <span className="text-[11px] bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Admin & Director General Office
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {currentUser.designation} • {currentUser.department} • {currentUser.location}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-xs bg-white/10 px-3 py-2 rounded-xl border border-white/10">
            <span className="text-slate-300 block text-[10px] uppercase font-bold">Pending Approvals</span>
            <span className="text-lg font-extrabold text-amber-400">{pendingUsers.length}</span>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-2 text-sm font-semibold scrollbar-none">
        <button
          onClick={() => setActiveTab("approvals")}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === "approvals"
              ? "bg-[#0b2545] text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Users className="w-4 h-4 text-cyan-400" />
          <span>User Approvals & Role Directory ({users.length})</span>
          {pendingUsers.length > 0 && (
            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {pendingUsers.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("courses")}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === "courses"
              ? "bg-[#0b2545] text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span>Course Management ({courses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === "analytics"
              ? "bg-[#0b2545] text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <BarChart3 className="w-4 h-4 text-emerald-400" />
          <span>Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab("cms")}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === "cms"
              ? "bg-[#0b2545] text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Bell className="w-4 h-4 text-amber-400" />
          <span>Announcements ({announcements.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("competency")}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === "competency"
              ? "bg-[#0b2545] text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Network className="w-4 h-4 text-purple-400" />
          <span>Competency Mapping Engine</span>
        </button>
      </div>

      {/* TAB 1: USER APPROVALS & ROLE MANAGEMENT */}
      {activeTab === "approvals" && (
        <div className="space-y-6">
          {/* Pending Approval Queue */}
          {pendingUsers.length > 0 && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-sm text-amber-950 uppercase tracking-wider">
                  Pending User Approval Pipeline ({pendingUsers.length})
                </h3>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                Review registrations before enabling full institutional course enrollments and trainer privileges:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingUsers.map((u) => (
                  <div
                    key={u.uid}
                    className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm space-y-2 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-900">{u.displayName}</div>
                      <div className="text-xs text-slate-600">{u.email}</div>
                      <div className="text-[11px] text-slate-500">
                        Dept: {u.department} • Role Requested:{" "}
                        <strong className="capitalize text-blue-700">{u.role}</strong>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveUser(u.uid)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectUser(u.uid)}
                        className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-semibold"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full User Directory */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  National Personnel & Role Directory
                </h3>
                <p className="text-xs text-slate-500">
                  Manage roles, view verification status, and adjust permissions for staff across India.
                </p>
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search name, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0b2545]"
                  />
                </div>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-700 font-medium"
                >
                  <option value="all">All Roles</option>
                  <option value="trainee">Trainees</option>
                  <option value="trainer">Trainers</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-800 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4 font-bold">Personnel Details</th>
                    <th className="py-3 px-4 font-bold">Current Role</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 font-bold">Email Verified</th>
                    <th className="py-3 px-4 font-bold text-right">Role Assignment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.uid} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{u.displayName}</div>
                        <div className="text-[11px] text-slate-500">{u.email}</div>
                        <div className="text-[10px] text-slate-400">{u.department} • {u.location}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            u.role === "admin"
                              ? "bg-amber-100 text-amber-800"
                              : u.role === "trainer"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {u.status === "approved" ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Approved
                          </span>
                        ) : u.status === "pending" ? (
                          <span className="text-amber-700 font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> Pending
                          </span>
                        ) : (
                          <span className="text-red-700 font-bold flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Suspended
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {u.emailVerified ? (
                          <span className="text-green-700 font-medium">✓ Confirmed</span>
                        ) : (
                          <span className="text-slate-400">Pending link</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right flex items-center justify-end gap-2">
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeRole(u.uid, e.target.value as UserRole)}
                          className="text-[11px] p-1 border border-slate-300 rounded bg-white text-slate-800 font-medium"
                        >
                          <option value="trainee">Trainee</option>
                          <option value="trainer">Trainer</option>
                          <option value="admin">Admin</option>
                        </select>
                        {u.status !== "suspended" && (
                          <button
                            onClick={() => handleRejectUser(u.uid)}
                            title="Suspend User"
                            className="p-1 text-amber-600 hover:bg-amber-50 rounded"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        {u.status === "suspended" && (
                          <button
                            onClick={() => handleApproveUser(u.uid)}
                            title="Unsuspend User"
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(u.uid)}
                          title="Permanently Delete User"
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: COURSE MANAGEMENT */}
      {activeTab === "courses" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Global Course Directory
                </h3>
                <p className="text-xs text-slate-500">
                  Full administrative control over courses created by any trainer on the platform.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <div key={course.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        {course.domain}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {course.enrolledTraineeIds.length} learners
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 mt-2">{course.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{course.description}</p>
                    <div className="text-[11px] text-slate-600 mt-2">
                      Instructor: <span className="font-semibold">{course.trainerName}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap justify-end gap-2">
                    <button
                      onClick={() => handleArchiveCourse(course.id, !!course.archived)}
                      className={`text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 ${course.archived ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}
                    >
                      <Archive className="w-3 h-3" /> {course.archived ? "Unarchive" : "Archive"}
                    </button>
                    <button
                      onClick={() => initiateMigration(course)}
                      className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-1 rounded flex items-center gap-1"
                    >
                      <ArrowRightLeft className="w-3 h-3" /> Migrate
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="text-[10px] font-bold bg-red-50 text-red-700 px-2 py-1 rounded flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              ))}

              {courses.length === 0 && (
                <div className="col-span-full py-8 text-center text-slate-500 text-sm">
                  No courses have been published yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EXECUTIVE MONITORING DASHBOARDS & ANALYTICS */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Platform Usage & Analytics
            </h2>
            <p className="text-xs text-slate-500">
              Real-time monitoring of course enrollments, active learners, and learning distribution.
            </p>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Total Learners
              </span>
              <div className="text-3xl font-extrabold text-blue-700 mt-1">{totalTrainees}</div>
              <div className="text-xs text-slate-500 mt-1">Registered & Active</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Platform Trainers
              </span>
              <div className="text-3xl font-extrabold text-emerald-700 mt-1">{totalTrainers}</div>
              <div className="text-xs text-slate-500 mt-1">Course Creators</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Total Assessments
              </span>
              <div className="text-3xl font-extrabold text-amber-700 mt-1">{submissions.length}</div>
              <div className="text-xs text-slate-500 mt-1">Attempts Logged</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                National Pass Rate
              </span>
              <div className="text-3xl font-extrabold text-purple-700 mt-1">{passRate}%</div>
              <div className="text-xs text-slate-500 mt-1">Passing Threshold &ge; 70%</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Courses by Enrollment */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                Top Enrolled Courses
              </h3>

              <div className="space-y-3">
                {courses.length > 0 ? (
                  [...courses].sort((a, b) => b.enrolledTraineeIds.length - a.enrolledTraineeIds.length).slice(0, 5).map((course, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-800 line-clamp-1">{course.title}</span>
                        <span className="font-bold text-slate-900 whitespace-nowrap ml-2">{course.enrolledTraineeIds.length} Learners</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${Math.min(100, Math.max(10, (course.enrolledTraineeIds.length / Math.max(1, totalTrainees)) * 100))}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-500 text-center py-4">No course data available</div>
                )}
              </div>
            </div>

            {/* Course Category Distribution */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                Course Category Distribution
              </h3>

              <div className="space-y-3">
                {(() => {
                  const domains = courses.reduce((acc, c) => {
                    acc[c.domain] = (acc[c.domain] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>);
                  const domainEntries = Object.entries(domains).sort((a, b) => b[1] - a[1]);
                  const colors = ["bg-cyan-500", "bg-blue-600", "bg-purple-600", "bg-amber-500", "bg-emerald-500"];
                  
                  if (domainEntries.length === 0) {
                    return <div className="text-xs text-slate-500 text-center py-4">No categories available</div>;
                  }

                  return domainEntries.map(([domain, count], idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-3 h-3 rounded-full ${colors[idx % colors.length]}`} />
                        <span className="text-xs font-bold text-slate-800">{domain}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-700">{count} Courses</span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HOMEPAGE CMS (ANNOUNCEMENTS, NOTICES, ACHIEVEMENTS) */}
      {activeTab === "cms" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Creator Form */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Publish to Public Notice Board
            </h3>

            {cmsNotice && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg">
                {cmsNotice}
              </div>
            )}

            <form onSubmit={handlePublishAnnouncement} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Title of Notice / Circular
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for Pre-Monsoon Radar Calibration"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category Tag
                </label>
                <select
                  value={annCategory}
                  onChange={(e) => setAnnCategory(e.target.value as any)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                >
                  <option value="circular">Departmental Circular</option>
                  <option value="urgent_notice">Urgent Notice</option>
                  <option value="achievement">Achievement & Milestone</option>
                  <option value="course_spotlight">Course Spotlight</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Priority
                </label>
                <select
                  value={annPriority}
                  onChange={(e) => setAnnPriority(e.target.value as any)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Content & Orders
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detailed circular text or achievement summary..."
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#0b2545] hover:bg-[#003b6d] text-white rounded-xl text-xs font-bold shadow flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Publish to Homepage
              </button>
            </form>
          </div>

          {/* Published Announcements List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-2">
              Live Notices on Public Homepage ({announcements.length})
            </h3>

            <div className="space-y-3">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-2 flex justify-between items-start"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        {ann.category.replace("_", " ")}
                      </span>
                      {ann.priority === "high" && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 px-2 py-0.5 rounded">
                          HIGH PRIORITY
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400">
                        {new Date(ann.publishedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900">{ann.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
                    <div className="text-[11px] text-slate-400">By: {ann.publishedBy}</div>
                  </div>

                  <button
                    onClick={() => handleDeleteAnnouncement(ann.id)}
                    className="text-slate-400 hover:text-red-600 p-1"
                    title="Delete notice"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COMPETENCY MAPPING ENGINE */}
      {activeTab === "competency" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Competency Mapping Engine
            </h2>
            <p className="text-xs text-slate-500">
              Intelligent matrix mapping specialized subjects to qualified trainers based on skills, domain, and experience.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 mb-4">
              Create New Competency Requirement
            </h3>
            <form onSubmit={handleAddCompetency} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject / Role Name</label>
                <input required value={compSubject} onChange={e => setCompSubject(e.target.value)} placeholder="e.g. Advanced Frontend Architecture" className="w-full text-xs p-2.5 border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Domain / Category</label>
                <input required value={compDomain} onChange={e => setCompDomain(e.target.value)} placeholder="e.g. Software Engineering" className="w-full text-xs p-2.5 border border-slate-300 rounded-lg" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Required Core Skills (comma separated)</label>
                <input required value={compSkills} onChange={e => setCompSkills(e.target.value)} placeholder="e.g. React, TypeScript, System Design" className="w-full text-xs p-2.5 border border-slate-300 rounded-lg" />
              </div>
              <div className="md:col-span-2 flex gap-4">
                <div className="w-1/3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Min Experience (Years)</label>
                  <input type="number" required min="0" value={compExp} onChange={e => setCompExp(Number(e.target.value))} className="w-full text-xs p-2.5 border border-slate-300 rounded-lg" />
                </div>
                <div className="w-2/3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                  <input required value={compDesc} onChange={e => setCompDesc(e.target.value)} placeholder="Brief description of the competency..." className="w-full text-xs p-2.5 border border-slate-300 rounded-lg" />
                </div>
              </div>
              <div className="md:col-span-2 flex justify-end mt-2">
                <button type="submit" className="px-5 py-2.5 bg-[#0b2545] hover:bg-[#003b6d] text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Add Competency Map
                </button>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {competencies.map((comp) => {
              const matchedTrainers = users.filter((u) =>
                u.role === "trainer" &&
                comp.requiredSkills.some((skill) => u.skills?.includes(skill))
              );

              return (
                <div
                  key={comp.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                          {comp.domain}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Req. Exp: <strong>{comp.minExperienceYears}+ Years</strong>
                        </span>
                      </div>
                      <button 
                        onClick={() => handleDeleteCompetency(comp.id)}
                        className="text-slate-400 hover:text-red-600 p-1"
                        title="Delete Competency Mapping"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="font-bold text-base text-slate-900">{comp.subject}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{comp.description}</p>

                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                        Required Core Competencies
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {comp.requiredSkills.map((sk, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-medium rounded"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <span className="text-[11px] font-bold text-slate-600 block">
                      Recommended Qualified Trainers ({matchedTrainers.length}):
                    </span>

                    <div className="space-y-1.5">
                      {matchedTrainers.length > 0 ? (
                        matchedTrainers.map((tr) => (
                          <div
                            key={tr.uid}
                            className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between"
                          >
                            <div>
                              <div className="font-bold text-xs text-emerald-950">
                                {tr.displayName}
                              </div>
                              <div className="text-[11px] text-emerald-800">
                                {tr.designation} • {tr.location}
                              </div>
                            </div>
                            <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold">
                              Eligible
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span>Competency Gap: No certified trainer available. Prioritize ToT.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {migrationModalOpen && courseToMigrate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md p-6 relative">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Migrate Course Ownership</h2>
            <p className="text-sm text-slate-500 mb-4">
              Transfer ownership of <strong className="text-slate-900">{courseToMigrate.title}</strong> to another trainer. They will need to accept the request.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Target Trainer</label>
                <select
                  value={targetTrainerId}
                  onChange={(e) => setTargetTrainerId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Choose a Trainer --</option>
                  {users.filter(u => u.role === "trainer" && u.status === "approved" && u.uid !== courseToMigrate.trainerId).map(tr => (
                    <option key={tr.uid} value={tr.uid}>{tr.displayName} ({tr.department})</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button onClick={() => setMigrationModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
                <button onClick={submitMigrationRequest} disabled={!targetTrainerId} className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-xl disabled:opacity-50">Send Request</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
