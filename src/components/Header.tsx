"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  GraduationCap,
  ShieldCheck,
  User,
  LogOut,
  LogIn,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  Compass,
  Building2,
  BookOpen,
  Send,
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
      setVerificationNotice("Activation verification link resent! Please check your email inbox.");
      setTimeout(() => setVerificationNotice(null), 5000);
    }
  };

  const openAuth = (mode: "signin" | "register") => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <>
      {/* Top Institutional Government Header Bar */}
      <div className="bg-[#0a192f] text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-white tracking-wide flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              भारत सरकार | Government of India
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">
              Ministry of Earth Sciences (MoES) • India Meteorological Department (IMD)
            </span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span className="hidden sm:inline">24x7 Weather & Training Support: 1800-180-1717</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-medium">NIC National Cloud Verified</span>
          </div>
        </div>
      </div>

      {/* Indian Tricolor Ribbon */}
      <div className="tricolor-ribbon" />

      {/* Main Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0b2545] to-[#003b6d] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <Compass className="w-7 h-7 text-amber-400" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl tracking-tight text-[#0b2545]">
                    CAPACITY<span className="text-[#008080]">CONNECT</span>
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    MoES Portal
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  Digital Capacity Building & Learning Management System
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              <Link
                href="/"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                  pathname === "/"
                    ? "text-[#0b2545] bg-slate-100"
                    : "text-slate-600 hover:text-[#0b2545] hover:bg-slate-50"
                }`}
              >
                Home
              </Link>

              <Link
                href="/#courses"
                className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-[#0b2545] hover:bg-slate-50 transition"
              >
                Courses & Modules
              </Link>

              <Link
                href="/#notices"
                className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-[#0b2545] hover:bg-slate-50 transition"
              >
                Circulars & Notices
              </Link>

              {/* Dynamic Role-Based Links when Authenticated */}
              {currentUser && currentUser.role === "trainee" && (
                <Link
                  href="/trainee"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 ${
                    pathname.startsWith("/trainee")
                      ? "text-blue-700 bg-blue-50 font-bold"
                      : "text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>My Learning</span>
                </Link>
              )}

              {currentUser && currentUser.role === "trainer" && (
                <Link
                  href="/trainer"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 ${
                    pathname.startsWith("/trainer")
                      ? "text-emerald-700 bg-emerald-50 font-bold"
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
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 ${
                    pathname.startsWith("/admin")
                      ? "text-amber-700 bg-amber-50 font-bold"
                      : "text-amber-600 hover:bg-amber-50"
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
                <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="font-bold text-sm text-slate-800">
                        {currentUser.displayName}
                      </span>
                      {currentUser.status === "approved" ? (
                        <span className="inline-flex items-center text-[10px] bg-green-100 text-green-800 font-semibold px-1.5 py-0.5 rounded">
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[10px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.5 rounded">
                          Pending Approval
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-end gap-1.5 text-xs text-slate-500">
                      <span className="capitalize font-medium text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded text-[11px]">
                        {currentUser.role}
                      </span>
                      <span>•</span>
                      <span className="truncate max-w-[130px]">{currentUser.location}</span>
                    </div>
                  </div>

                  <button
                    onClick={logout}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2.5">
                  <button
                    onClick={() => openAuth("signin")}
                    className="px-4 py-2 rounded-xl text-slate-700 hover:text-[#0b2545] hover:bg-slate-100 text-sm font-semibold transition"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuth("register")}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#0b2545] hover:bg-[#003b6d] text-white text-sm font-semibold shadow-sm transition"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Register</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md font-semibold text-slate-700 hover:bg-slate-100"
            >
              Home
            </Link>
            <Link
              href="/#courses"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md font-semibold text-slate-700 hover:bg-slate-100"
            >
              Courses & Modules
            </Link>
            <Link
              href="/#notices"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md font-semibold text-slate-700 hover:bg-slate-100"
            >
              Circulars & Notices
            </Link>

            {currentUser && currentUser.role === "trainee" && (
              <Link
                href="/trainee"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md font-semibold text-blue-700 bg-blue-50"
              >
                My Learning Dashboard
              </Link>
            )}

            {currentUser && currentUser.role === "trainer" && (
              <Link
                href="/trainer"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md font-semibold text-emerald-700 bg-emerald-50"
              >
                Trainer Workspace
              </Link>
            )}

            {currentUser && currentUser.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md font-semibold text-amber-700 bg-amber-50"
              >
                Admin Console
              </Link>
            )}

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {currentUser ? (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-sm text-slate-900">{currentUser.displayName}</p>
                    <p className="text-xs text-slate-500 capitalize">{currentUser.role} • {currentUser.status}</p>
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
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuth("signin");
                    }}
                    className="py-2 border border-slate-300 text-slate-700 text-center rounded-xl font-semibold text-sm"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuth("register");
                    }}
                    className="py-2 bg-[#0b2545] text-white text-center rounded-xl font-semibold text-sm"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Verification banner if user logged in but email not verified */}
        {currentUser && !currentUser.emailVerified && (
          <div className="bg-amber-50 border-t border-amber-200 px-4 py-2 text-xs text-amber-900 flex justify-between items-center">
            <div className="flex items-center space-x-2 max-w-7xl mx-auto w-full">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Account Activation Pending:</strong> Please click the activation link sent to your email to verify your account.
              </span>
              <button
                onClick={handleResendVerification}
                className="ml-2 font-bold underline hover:text-amber-700 flex items-center gap-1"
              >
                <Send className="w-3 h-3" /> Resend Activation Link
              </button>
            </div>
          </div>
        )}

        {verificationNotice && (
          <div className="bg-green-50 border-t border-green-200 px-4 py-2 text-xs text-green-900 text-center font-medium">
            <CheckCircle2 className="w-4 h-4 inline mr-1 text-green-600" />
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
