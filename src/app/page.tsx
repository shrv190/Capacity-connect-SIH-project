"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StorageService } from "@/lib/storage";
import { FirestoreService } from "@/lib/firestore";
import { useAuth } from "@/context/AuthContext";
import { Course, Announcement } from "@/types";
import {
  Award,
  BookOpen,
  GraduationCap,
  Users,
  Bell,
  CheckCircle,
  ArrowRight,
  Radar,
  Clock,
  Target,
  FileCheck,
  Layers,
  Zap,
  ChevronRight,
} from "lucide-react";
import AuthModal from "@/components/AuthModal";

export default function HomePage() {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>("All");
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [selectedCourseDetails, setSelectedCourseDetails] = useState<Course | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const dbCourses = await FirestoreService.getCourses();
      const dbAnnouncements = await FirestoreService.getAnnouncements();
      setCourses(dbCourses);
      setAnnouncements(dbAnnouncements);
    };
    fetchData();
  }, []);

  const domains = [
    "All",
    "Software Engineering",
    "Data Science",
    "Hardware Engineering",
    "Artificial Intelligence",
    "Business Analytics",
  ];

  const filteredCourses =
    selectedDomain === "All"
      ? courses
      : courses.filter((c) => c.domain === selectedDomain);

  const handleEnroll = async (courseId: string) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    const success = await FirestoreService.enrollInCourse(courseId, currentUser.uid);
    if (success) {
      const dbCourses = await FirestoreService.getCourses();
      setCourses(dbCourses);
      alert(
        "Successfully enrolled! You can now access all learning resources and assessments in your dashboard."
      );
    } else {
      alert("You are already enrolled in this course or an error occurred.");
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* ── Hero Section ── */}
      <section className="relative bg-gradient-to-br from-indigo-50 via-white to-violet-50 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-gray-100">
        {/* Subtle grid decoration */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#6366f1_1px,transparent_1px),linear-gradient(to_bottom,#6366f1_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left */}
          <div className="lg:col-span-7 space-y-7 animate-slide-right">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 border border-indigo-200 px-3.5 py-1.5 rounded-full text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-indigo-500" />
              <span>Modern Learning Management Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-gray-900">
              Capacity
              <span className="text-indigo-600">Connect</span>
              <span className="block text-xl sm:text-2xl font-normal text-gray-500 mt-3">
                Professional Learning &amp; Capacity Building Platform
              </span>
            </h1>

            <p className="text-base text-gray-600 max-w-xl leading-relaxed">
              Structured curriculum, competency mapping, timed assessments, and verifiable digital
              certifications for professionals and teams.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="#courses"
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm hover:shadow-md transition flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Browse Courses</span>
              </a>

              {currentUser ? (
                <Link
                  href={
                    currentUser.role === "admin"
                      ? "/admin"
                      : currentUser.role === "trainer"
                      ? "/trainer"
                      : "/trainee"
                  }
                  className="px-6 py-3 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-semibold text-sm transition flex items-center gap-2 shadow-sm"
                >
                  <span>Go to My Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-6 py-3 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-semibold text-sm transition flex items-center gap-2 shadow-sm"
                >
                  <span>Sign In to Start Learning</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Hero Right: Feature Highlights Card */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 space-y-5 shadow-xl shadow-indigo-100/40 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center shadow-sm">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">Platform Features</h3>
                <p className="text-xs text-gray-400">Everything you need to grow professionally</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-gray-600">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0 mt-0.5">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-gray-900 block font-semibold">Competency-Based Learning</strong>
                  Curricula aligned with WMO standards for NWP, Doppler Radar, and Cyclone Forecasting.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0 mt-0.5">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-gray-900 block font-semibold">Timed MCQ Assessments</strong>
                  Automated evaluation, passing thresholds, and detailed answer reviews.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-violet-50 text-violet-600 rounded-lg shrink-0 mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-gray-900 block font-semibold">Verifiable Digital Credentials</strong>
                  Completion certificates with unique verification codes and QR codes.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg shrink-0 mt-0.5">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-gray-900 block font-semibold">Intelligent Competency Mapping</strong>
                  Algorithmic trainer discovery and departmental skill gap identification.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Users, color: "indigo", value: "5,200+", label: "Professionals Trained" },
            { icon: Award, color: "emerald", value: "1,480+", label: "Certified Specialists" },
            { icon: BookOpen, color: "violet", value: `${courses.length} Modules`, label: "Active Curriculum" },
            { icon: Radar, color: "amber", value: "36 DWRs", label: "Observatories Connected" },
          ].map(({ icon: Icon, color, value, label }) => (
            <div
              key={label}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl bg-${color}-50 flex items-center justify-center text-${color}-600 shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-gray-900">{value}</div>
                <div className="text-xs font-medium text-gray-400">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Announcements ── */}
      <section id="notices" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Announcements</h2>
                <p className="text-xs text-gray-400">Latest updates from the platform</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
              Live
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        ann.category === "urgent_notice"
                          ? "bg-red-100 text-red-700"
                          : ann.category === "achievement"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-indigo-100 text-indigo-700"
                      }`}
                    >
                      {ann.category.replace("_", " ")}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {new Date(ann.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 line-clamp-2">{ann.title}</h3>
                  <p className="text-xs text-gray-500 mt-1.5 line-clamp-3 leading-relaxed">
                    {ann.content}
                  </p>
                </div>
                <div className="pt-2 text-[11px] text-gray-400 border-t border-gray-100 font-medium">
                  Published by: {ann.publishedBy}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Course Catalog ── */}
      <section id="courses" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              Course Catalog
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">
              Professional Development Courses
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Comprehensive modules for career advancement and skill development.
            </p>
          </div>

          {/* Domain Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {domains.map((dom) => (
              <button
                key={dom}
                onClick={() => setSelectedDomain(dom)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedDomain === dom
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {dom}
              </button>
            ))}
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isEnrolled =
              currentUser?.uid && (course.enrolledTraineeIds || []).includes(currentUser.uid);

            return (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col justify-between group"
              >
                <div className="p-6 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                      {course.code}
                    </span>
                    <span className="text-[11px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {course.level}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-gray-900 leading-snug line-clamp-2 group-hover:text-indigo-700 transition">
                    {course.title}
                  </h3>

                  <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-300" />
                      <span>{course.durationHours} Hours</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="truncate">{course.trainerName}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedCourseDetails(course)}
                    className="text-xs font-semibold text-gray-500 hover:text-indigo-600 flex items-center gap-1 transition"
                  >
                    View Syllabus <ChevronRight className="w-3 h-3" />
                  </button>

                  {(!currentUser || currentUser.role === "trainee") && (
                    <button
                      onClick={() => handleEnroll(course.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        isEnrolled
                          ? "bg-emerald-100 text-emerald-700 cursor-default"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                      }`}
                    >
                      {isEnrolled ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Enrolled</span>
                        </>
                      ) : (
                        <span>Enroll Now</span>
                      )}
                    </button>
                  )}
                  {currentUser && currentUser.role !== "trainee" && (
                    <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-xl cursor-not-allowed">
                      Trainees Only
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Course Syllabus Modal */}
      {selectedCourseDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-5 text-white flex justify-between items-center">
              <div>
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded font-mono font-bold">
                  {selectedCourseDetails.code}
                </span>
                <h3 className="font-bold text-base mt-1">{selectedCourseDetails.title}</h3>
              </div>
              <button
                onClick={() => setSelectedCourseDetails(null)}
                className="text-white/70 hover:text-white p-1 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Course Overview
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {selectedCourseDetails.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Syllabus
                </h4>
                <ul className="space-y-2">
                  {(selectedCourseDetails.syllabus || []).length > 0 ? (
                    (selectedCourseDetails.syllabus || []).map((s, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-gray-700 flex items-start gap-2.5 bg-gray-50 p-2.5 rounded-xl border border-gray-100"
                      >
                        <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{s}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-gray-500 italic p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                      Detailed syllabus to be updated by the trainer.
                    </li>
                  )}
                </ul>
              </div>

              <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                <span>
                  Faculty: <strong className="text-gray-700">{selectedCourseDetails.trainerName}</strong>
                </span>
                <span>
                  Duration: <strong className="text-gray-700">{selectedCourseDetails.durationHours} hrs</strong>
                </span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => setSelectedCourseDetails(null)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleEnroll(selectedCourseDetails.id);
                  setSelectedCourseDetails(null);
                }}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
              >
                Enroll in Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
