"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  GraduationCap,
  ShieldCheck,
  LogOut,
  LogIn,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  BookOpen,
  Send,
  Zap,
} from "lucide-react";
import AuthModal from "./AuthModal";

export default function Header() {
  const pathname = usePathname();
  const { currentUser, logout, resendVerificationEmail } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"signin" | "register">("signin");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [verificationNotice, setVerificationNotice] = useState<string | null>(null);

  const handleResendVerification = async () => {
    const res = await resendVerificationEmail();
    if (res.success) {
      setVerificationNotice("Activation link resent! Check your email inbox.");
      setTimeout(() => setVerificationNotice(null), 5000);
    }
  };

  const openAuth = (mode: "signin" | "register") => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <>
      {/* Main Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Brand Logo */}
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-gray-900 leading-none">
                  Capacity<span className="text-indigo-600">Connect</span>
                </span>
                <span className="text-[10px] text-gray-400 font-medium leading-none mt-0.5">
                  Professional Learning Platform
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                href="/"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  pathname === "/"
                    ? "text-indigo-700 bg-indigo-50 font-semibold"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Home
              </Link>

              <Link
                href="/#courses"
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
              >
                Courses
              </Link>

              <Link
                href="/#notices"
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
              >
                Announcements
              </Link>

              {/* Dynamic Role-Based Links when Authenticated */}
              {currentUser && currentUser.role === "trainee" && (
                <Link
                  href="/trainee"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    pathname.startsWith("/trainee")
                      ? "text-indigo-700 bg-indigo-50 font-semibold"
                      : "text-indigo-600 hover:bg-indigo-50"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>My Learning</span>
                </Link>
              )}

              {currentUser && currentUser.role === "trainer" && (
                <Link
                  href="/trainer"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    pathname.startsWith("/trainer")
                      ? "text-emerald-700 bg-emerald-50 font-semibold"
                      : "text-emerald-600 hover:bg-emerald-50"
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Trainer Workspace</span>
                </Link>
              )}

              {currentUser && currentUser.role === "admin" && (
                <Link
                  href="/admin"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    pathname.startsWith("/admin")
                      ? "text-violet-700 bg-violet-50 font-semibold"
                      : "text-violet-600 hover:bg-violet-50"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Console</span>
                </Link>
              )}
            </nav>

            {/* User Session / Sign In CTAs */}
            <div className="hidden md:flex items-center space-x-3">
              {currentUser ? (
                <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="font-semibold text-sm text-gray-900">
                        {currentUser.displayName}
                      </span>
                      {currentUser.status === "approved" ? (
                        <span className="inline-flex items-center text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[10px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.5 rounded-full">
                          Pending
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-end gap-1 text-xs text-gray-400">
                      <span className="capitalize font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded text-[11px]">
                        {currentUser.role}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={logout}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openAuth("signin")}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-100 text-sm font-medium transition"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuth("register")}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Get Started</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-2 pb-4 space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100"
            >
              Home
            </Link>
            <Link
              href="/#courses"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100"
            >
              Courses
            </Link>
            <Link
              href="/#notices"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100"
            >
              Announcements
            </Link>

            {currentUser && currentUser.role === "trainee" && (
              <Link
                href="/trainee"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-semibold text-indigo-700 bg-indigo-50"
              >
                My Learning Dashboard
              </Link>
            )}

            {currentUser && currentUser.role === "trainer" && (
              <Link
                href="/trainer"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-semibold text-emerald-700 bg-emerald-50"
              >
                Trainer Workspace
              </Link>
            )}

            {currentUser && currentUser.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-semibold text-violet-700 bg-violet-50"
              >
                Admin Console
              </Link>
            )}

            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              {currentUser ? (
                <div className="flex justify-between items-center px-1">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{currentUser.displayName}</p>
                    <p className="text-xs text-gray-400 capitalize">{currentUser.role} · {currentUser.status}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="px-3 py-1.5 text-xs text-red-600 font-semibold bg-red-50 rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setMobileMenuOpen(false); openAuth("signin"); }}
                    className="py-2 border border-gray-300 text-gray-700 text-center rounded-xl font-semibold text-sm"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); openAuth("register"); }}
                    className="py-2 bg-indigo-600 text-white text-center rounded-xl font-semibold text-sm"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Verification banner */}
        {currentUser && !currentUser.emailVerified && (
          <div className="bg-amber-50 border-t border-amber-200 px-4 py-2 text-xs text-amber-900 flex justify-between items-center">
            <div className="flex items-center space-x-2 max-w-7xl mx-auto w-full">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Email not verified:</strong> Please click the activation link sent to your email address.
              </span>
              <button
                onClick={handleResendVerification}
                className="ml-2 font-bold underline hover:text-amber-700 flex items-center gap-1"
              >
                <Send className="w-3 h-3" /> Resend Link
              </button>
            </div>
          </div>
        )}

        {verificationNotice && (
          <div className="bg-emerald-50 border-t border-emerald-200 px-4 py-2 text-xs text-emerald-900 text-center font-medium">
            <CheckCircle2 className="w-4 h-4 inline mr-1 text-emerald-600" />
            {verificationNotice}
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </>
  );
}
