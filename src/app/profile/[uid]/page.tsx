"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { StorageService } from "@/lib/storage";
import { UserProfile, Course } from "@/types";
import { User, MapPin, Building, Briefcase, Award, CheckCircle, BookOpen } from "lucide-react";

export default function PublicProfilePage() {
  const { uid } = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof uid === "string") {
      const foundUser = StorageService.getUserById(uid);
      if (foundUser) {
        setUser(foundUser);
        const allCourses = StorageService.getCourses();
        if (foundUser.role === "trainer") {
          setCourses(allCourses.filter(c => c.trainerId === foundUser.uid));
        } else if (foundUser.role === "trainee") {
          setCourses(allCourses.filter(c => c.enrolledTraineeIds.includes(foundUser.uid)));
        }
      }
      setLoading(false);
    }
  }, [uid]);

  if (loading) {
    return <div className="flex justify-center py-20 text-indigo-600 font-bold">Loading Profile...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto my-20 p-8 bg-white rounded-2xl border border-gray-200 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Profile Not Found</h1>
        <p className="text-gray-500 mt-2">The user you are looking for does not exist or the link is invalid.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 animate-fade-in">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-slide-up">
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-violet-600"></div>
        <div className="px-8 pb-8 relative">
          <div className="absolute -top-12 w-24 h-24 bg-white rounded-2xl shadow-md border border-gray-100 flex items-center justify-center">
            <span className="text-3xl font-bold text-indigo-600">
              {user.displayName.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <div className="mt-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {user.displayName}
                {user.emailVerified && <CheckCircle className="w-5 h-5 text-emerald-500" />}
              </h1>
              <div className="text-sm font-medium text-indigo-600 mt-1 capitalize flex items-center gap-2">
                {user.role} {user.role === 'admin' ? "Account" : ""}
                <span className="text-gray-400 font-normal">|</span>
                <span className="text-gray-500 font-normal flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {user.location || "Remote"}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg uppercase tracking-wider">
                Public Profile
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        {/* Left Column: Details */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-2">About</h3>
            <div className="space-y-3">
              <div className="flex gap-3 text-sm">
                <Briefcase className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-gray-500 text-xs">Designation</div>
                  <div className="font-medium text-gray-900">{user.designation || "Not specified"}</div>
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <Building className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-gray-500 text-xs">Department</div>
                  <div className="font-medium text-gray-900">{user.department || "Not specified"}</div>
                </div>
              </div>
            </div>
          </div>

          {user.skills && user.skills.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Courses/Activity */}
        <div className="md:col-span-2 space-y-6">
          {user.role === "trainer" && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-500" /> Published Courses ({courses.length})
              </h3>
              {courses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {courses.map(course => (
                    <div key={course.id} className="p-4 border border-gray-100 bg-gray-50 rounded-xl">
                      <div className="text-xs font-bold text-indigo-600 mb-1">{course.domain}</div>
                      <div className="font-bold text-sm text-gray-900">{course.title}</div>
                      <div className="text-xs text-gray-500 mt-2">{course.enrolledTraineeIds.length} Learners Enrolled</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">This trainer hasn't published any courses yet.</p>
              )}
            </div>
          )}

          {user.role === "trainee" && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-500" /> Enrolled Courses ({courses.length})
              </h3>
              {courses.length > 0 ? (
                <div className="space-y-3">
                  {courses.map(course => (
                    <div key={course.id} className="p-3 border border-gray-100 rounded-xl flex items-center justify-between hover:bg-gray-50 transition">
                      <div>
                        <div className="font-bold text-sm text-gray-900">{course.title}</div>
                        <div className="text-xs text-gray-500">Instructor: {course.trainerName}</div>
                      </div>
                      <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded">Enrolled</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">This learner hasn't enrolled in any courses yet.</p>
              )}
            </div>
          )}

          {user.role === "admin" && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm text-center py-12">
              <Award className="w-12 h-12 text-amber-400 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900">Platform Administrator</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mt-2">
                This user manages platform operations, course catalog integrity, and user approvals.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
