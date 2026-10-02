"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StorageService } from "@/lib/storage";
import { useAuth } from "@/context/AuthContext";
import { Course, Announcement } from "@/types";
import {
  Compass,
  Award,
  BookOpen,
  GraduationCap,
  Users,
  Building,
  Bell,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Radar,
  Clock,
  Sparkles,
  ExternalLink,
  Target,
  FileCheck,
  Layers,
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
    setCourses(StorageService.getCourses());
    setAnnouncements(StorageService.getAnnouncements());
  }, []);

  const domains = [
    "All",
    "Radar Meteorology",
    "Numerical Modeling",
    "Satellite Meteorology",
    "Cyclone Forecasting",
    "Agro-Meteorology",
  ];

  const filteredCourses =
    selectedDomain === "All"
      ? courses
      : courses.filter((c) => c.domain === selectedDomain);

  const handleEnroll = (courseId: string) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    const success = StorageService.enrollInCourse(courseId, currentUser.uid);
    if (success) {
      setCourses(StorageService.getCourses());
      alert(
        "Successfully enrolled in course! You can now access all learning resources and assessments in your Trainee Portal."
      );
    } else {
      alert("You are already enrolled in this course, or enrollment is already active.");
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0a192f] via-[#0b2545] to-[#003b6d] text-white py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-lg border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-cyan-300 border border-blue-400/30 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Ministry of Earth Sciences (MoES) • Smart Education 26075</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              CAPACITY <span className="text-[#00c49f]">CONNECT</span>
              <span className="block text-xl sm:text-2xl font-normal text-slate-300 mt-2">
                Digital Capacity Building & Learning Management Portal
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Empowering India&apos;s meteorological and earth sciences workforce through structured
              curriculum, competency mapping, timed assessments, and verifiable digital certifications.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <a
                href="#courses"
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md hover:shadow-lg transition flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore Courses</span>
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
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition flex items-center gap-2"
                >
                  <span>Go to My Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition flex items-center gap-2"
                >
                  <span>Sign In to Start Learning</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Hero Right: Institutional Highlights Card */}
          <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 text-white space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-white/15 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold text-lg shadow-sm">
                🏛️
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">National Capacity Framework</h3>
                <p className="text-xs text-slate-300">Centralized Institutional Portal</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-slate-200">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-blue-500/20 text-cyan-300 rounded-lg shrink-0 mt-0.5">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white block font-semibold">Competency-Based Learning</strong>
                  Curricula aligned with WMO standards for NWP, Doppler Radar, and Cyclone Forecasting.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-emerald-500/20 text-emerald-300 rounded-lg shrink-0 mt-0.5">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white block font-semibold">Timed MCQ Assessments</strong>
                  Automated evaluation, passing thresholds, and detailed scientific answer reviews.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-amber-500/20 text-amber-300 rounded-lg shrink-0 mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white block font-semibold">Verifiable Digital Credentials</strong>
                  Tamper-proof completion certificates issued with unique verification codes and QR codes.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-purple-500/20 text-purple-300 rounded-lg shrink-0 mt-0.5">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white block font-semibold">Intelligent Competency Mapping</strong>
                  Algorithmic trainer discovery and departmental skill gap identification for leadership.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notice Board & Circulars Section */}
      <section id="notices" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 text-amber-900 rounded-xl">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Official Notice Board & Circulars
                </h2>
                <p className="text-xs text-slate-500">
                  Published by MoES Training Directorate & Headquarters
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
              Live Announcements
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-md transition space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        ann.category === "urgent_notice"
                          ? "bg-red-100 text-red-800"
                          : ann.category === "achievement"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {ann.category.replace("_", " ")}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(ann.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 line-clamp-2">
                    {ann.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-3 leading-relaxed">
                    {ann.content}
                  </p>
                </div>
                <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-200/60 font-medium">
                  Issued by: {ann.publishedBy}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Counters & Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">5,200+</div>
              <div className="text-xs font-semibold text-slate-500">Personnel Trained</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">1,480+</div>
              <div className="text-xs font-semibold text-slate-500">Certified Specialists</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">{courses.length} Modules</div>
              <div className="text-xs font-semibold text-slate-500">Active Curriculum</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700 shrink-0">
              <Radar className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">36 DWRs</div>
              <div className="text-xs font-semibold text-slate-500">Observatories Connected</div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Catalog Section */}
      <section id="courses" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Departmental Curriculum
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Specialized Atmospheric & Earth Science Courses
            </h2>
            <p className="text-xs text-slate-500">
              Comprehensive modules in Doppler Radar, Numerical Modeling, Cyclone Tracking, and Agrometeorology.
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
                    ? "bg-[#0b2545] text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
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
              currentUser?.uid && course.enrolledTraineeIds.includes(currentUser.uid);

            return (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col justify-between"
              >
                <div className="p-6 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                      {course.code}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {course.level}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 leading-snug line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{course.durationHours} Hours Duration</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="truncate">{course.trainerName}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedCourseDetails(course)}
                    className="text-xs font-semibold text-slate-700 hover:text-blue-700"
                  >
                    View Syllabus
                  </button>

                  <button
                    onClick={() => handleEnroll(course.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      isEnrolled
                        ? "bg-green-100 text-green-800 cursor-default"
                        : "bg-[#0b2545] hover:bg-[#003b6d] text-white"
                    }`}
                  >
                    {isEnrolled ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                        <span>Enrolled</span>
                      </>
                    ) : (
                      <>
                        <span>Enroll Now</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Course Syllabus Modal */}
      {selectedCourseDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-[#0b2545] p-5 text-white flex justify-between items-center">
              <div>
                <span className="text-[10px] bg-blue-500/30 text-cyan-200 px-2 py-0.5 rounded font-mono font-bold">
                  {selectedCourseDetails.code}
                </span>
                <h3 className="font-bold text-base mt-1">{selectedCourseDetails.title}</h3>
              </div>
              <button
                onClick={() => setSelectedCourseDetails(null)}
                className="text-slate-300 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Course Overview
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {selectedCourseDetails.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Official Syllabus Outline
                </h4>
                <ul className="space-y-2">
                  {selectedCourseDetails.syllabus.map((s, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-slate-700 flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200"
                    >
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs text-slate-600">
                <span>
                  Faculty: <strong>{selectedCourseDetails.trainerName}</strong>
                </span>
                <span>
                  Duration: <strong>{selectedCourseDetails.durationHours} hrs</strong>
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setSelectedCourseDetails(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleEnroll(selectedCourseDetails.id);
                  setSelectedCourseDetails(null);
                }}
                className="px-5 py-2 bg-[#0b2545] hover:bg-[#003b6d] text-white rounded-xl text-xs font-bold"
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
