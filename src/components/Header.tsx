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
  const { currentUser, logout, fastLoginAs, resendVerificationEmail } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [verificationNotice, setVerificationNotice] = useState<string | null>(null);

  const handleResendVerification = async () => {
    const res = await resendVerificationEmail();
    if (res.success) {
      setVerificationNotice("Activation verification link resent! Please check your email inbox.");
      setTimeout(() => setVerificationNotice(null), 5000);
    }
  };

  return (
    <>
      {/* Top Institutional Bar */}
      <div className="bg-[#0a192f] text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-white tracking-wide flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              भारत सरकार | Government of India
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">
              पृथ्वी विज्ञान मंत्रालय (MoES) | भारत मौसम विज्ञान विभाग (IMD)
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="hidden md:inline text-slate-400">
              National Capacity Building Portal
            </span>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2 py-0.5 rounded text-[11px]">
              <span className="text-slate-400">Quick Demo Switch:</span>
              <button
                onClick={() => fastLoginAs("trainee")}
                className="text-cyan-400 hover:underline px-1 font-medium"
                title="Switch to Trainee"
              >
                Trainee
              </button>
              <span className="text-slate-600">/</span>
              <button
                onClick={() => fastLoginAs("trainer")}
                className="text-emerald-400 hover:underline px-1 font-medium"
                title="Switch to Trainer"
              >
                Trainer
              </button>
              <span className="text-slate-600">/</span>
              <button
                onClick={() => fastLoginAs("admin")}
                className="text-amber-400 hover:underline px-1 font-medium"
                title="Switch to Admin"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tricolor Ribbon */}
      <div className="tricolor-ribbon" />

      {/* Main Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo & Department Brand */}
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
                    MoES / IMD
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  Digital Capacity Building & LMS Portal
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
                href="/trainee"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 ${
                  pathname.startsWith("/trainee")
                    ? "text-blue-700 bg-blue-50"
                    : "text-slate-600 hover:text-blue-700 hover:bg-slate-50"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Trainee Portal
              </Link>

              <Link
                href="/trainer"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 ${
                  pathname.startsWith("/trainer")
                    ? "text-emerald-700 bg-emerald-50"
                    : "text-slate-600 hover:text-emerald-700 hover:bg-slate-50"
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                Trainer Portal
              </Link>

              <Link
                href="/admin"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 ${
                  pathname.startsWith("/admin")
                    ? "text-amber-700 bg-amber-50"
                    : "text-slate-600 hover:text-amber-700 hover:bg-slate-50"
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Console
              </Link>
            </nav>

            {/* User Session / Auth CTA */}
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
                        Role: {currentUser.role}
                      </span>
                      <span>•</span>
                      <span className="truncate max-w-[140px]">{currentUser.location}</span>
                    </div>
                  </div>

                  <button
                    onClick={logout}
                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#0b2545] hover:bg-[#003b6d] text-white text-sm font-semibold shadow-sm transition"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In / Register</span>
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
              href="/trainee"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md font-semibold text-blue-700 hover:bg-blue-50"
            >
              Trainee Portal
            </Link>
            <Link
              href="/trainer"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md font-semibold text-emerald-700 hover:bg-emerald-50"
            >
              Trainer Portal
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md font-semibold text-amber-700 hover:bg-amber-50"
            >
              Admin Console
            </Link>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {currentUser ? (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-sm text-slate-900">{currentUser.displayName}</p>
                    <p className="text-xs text-slate-500 capitalize">{currentUser.role} • {currentUser.status}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="px-3 py-1.5 text-xs text-red-600 font-semibold bg-red-50 rounded"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                  className="w-full py-2 bg-[#0b2545] text-white text-center rounded-lg font-semibold text-sm"
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        )}

        {/* Verification banner if user logged in but email not verified */}
        {currentUser && !currentUser.emailVerified && (
          <div className="bg-amber-50 border-t border-amber-200 px-4 py-2 text-xs text-amber-900 flex justify-between items-center">
            <div className="flex items-center space-x-2 max-w-4xl mx-auto w-full">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Email Verification Required:</strong> Your account activation email is pending confirmation.
              </span>
              <button
                onClick={handleResendVerification}
                className="ml-2 font-bold underline hover:text-amber-700 flex items-center gap-1"
              >
                <Send className="w-3 h-3" /> Resend Activation Verification Email
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
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
