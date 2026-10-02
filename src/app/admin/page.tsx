"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { StorageService } from "@/lib/storage";
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
} from "lucide-react";
import AuthModal from "@/components/AuthModal";

export default function AdminPortal() {
  const { currentUser } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "approvals" | "analytics" | "cms" | "competency"
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

  useEffect(() => {
    refreshData();
  }, [currentUser]);

  const refreshData = () => {
    setUsers(StorageService.getUsers());
    setCourses(StorageService.getCourses());
    setSubmissions(StorageService.getSubmissions());
    setAnnouncements(StorageService.getAnnouncements());
    setCompetencies(StorageService.getCompetencyMappings());
  };

  const handleApproveUser = (uid: string) => {
    StorageService.updateUserStatus(uid, "approved");
    refreshData();
  };

  const handleRejectUser = (uid: string) => {
    StorageService.updateUserStatus(uid, "suspended");
    refreshData();
  };

  const handleChangeRole = (uid: string, newRole: UserRole) => {
    StorageService.updateUserStatus(uid, "approved", newRole);
    refreshData();
  };

  // Publish Announcement
  const handlePublishAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !annTitle || !annContent) return;

    StorageService.addAnnouncement({
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

  const handleDeleteAnnouncement = (id: string) => {
    StorageService.deleteAnnouncement(id);
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
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === "analytics"
              ? "bg-[#0b2545] text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <BarChart3 className="w-4 h-4 text-emerald-400" />
          <span>Executive Dashboards & Analytics</span>
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
          <span>Homepage CMS & Circulars ({announcements.length})</span>
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

                      <td className="py-3 px-4 text-right">
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeRole(u.uid, e.target.value as UserRole)}
                          className="text-[11px] p-1 border border-slate-300 rounded bg-white text-slate-800 font-medium"
                        >
                          <option value="trainee">Trainee</option>
                          <option value="trainer">Trainer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EXECUTIVE MONITORING DASHBOARDS & ANALYTICS */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Executive Directorate Capacity Building Analytics
            </h2>
            <p className="text-xs text-slate-500">
              Real-time monitoring of course enrollments, regional RMC coverage, assessments, and pass rates.
            </p>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Total Trainees
              </span>
              <div className="text-3xl font-extrabold text-blue-700 mt-1">{totalTrainees}</div>
              <div className="text-xs text-slate-500 mt-1">Registered & Active</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Qualified Trainers
              </span>
              <div className="text-3xl font-extrabold text-emerald-700 mt-1">{totalTrainers}</div>
              <div className="text-xs text-slate-500 mt-1">Subject Specialists</div>
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

          {/* Regional RMC Participation Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                Regional Meteorological Centre (RMC) Participation
              </h3>

              <div className="space-y-3">
                {[
                  { rmc: "RMC New Delhi (HQ & Northern Plains)", count: 48, pct: 85 },
                  { rmc: "RMC Kolkata (Eastern & Bay of Bengal)", count: 42, pct: 78 },
                  { rmc: "IMD Pune (CTI & Climate Training)", count: 56, pct: 94 },
                  { rmc: "RMC Chennai (Southern Peninsula)", count: 38, pct: 72 },
                  { rmc: "RMC Mumbai (Arabian Sea & Western Coast)", count: 34, pct: 68 },
                  { rmc: "RMC Guwahati (Northeastern Region)", count: 28, pct: 60 },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-800">{item.rmc}</span>
                      <span className="font-bold text-slate-900">{item.count} Personnel</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Domain Enrollment Distribution */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                Discipline-Wise Training Distribution
              </h3>

              <div className="space-y-3">
                {[
                  { domain: "Radar Meteorology & Dual-Pol", share: "32%", color: "bg-cyan-500" },
                  { domain: "Numerical Weather Prediction (WRF)", share: "28%", color: "bg-blue-600" },
                  { domain: "Satellite Meteorology (INSAT-3DS)", share: "20%", color: "bg-purple-600" },
                  { domain: "Tropical Cyclone Warning Systems", share: "12%", color: "bg-amber-500" },
                  { domain: "Agrometeorological Advisories (AAS)", share: "8%", color: "bg-emerald-500" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-xs font-bold text-slate-800">{item.domain}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-700">{item.share}</span>
                  </div>
                ))}
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
              MoES / IMD Competency Mapping Engine
            </h2>
            <p className="text-xs text-slate-500">
              Intelligent matrix mapping specialized meteorological subjects to qualified trainers based on skills, domain, and experience.
            </p>
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
                      <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                        {comp.domain}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Req. Exp: <strong>{comp.minExperienceYears}+ Years</strong>
                      </span>
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
    </div>
  );
}
