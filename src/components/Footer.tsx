import React from "react";
import Link from "next/link";
import { Zap, Mail, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-base tracking-tight">
                Capacity<span className="text-indigo-400">Connect</span>
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              A modern learning management platform for structured capacity building,
              competency development, and professional growth in earth and atmospheric sciences.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a href="#" aria-label="Twitter" className="text-gray-500 hover:text-white transition">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-gray-500 hover:text-white transition">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" aria-label="GitHub" className="text-gray-500 hover:text-white transition">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Platform */}
          <div>
            <h3 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">
              Platform
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/#courses" className="hover:text-white transition">
                  Browse Courses
                </Link>
              </li>
              <li>
                <Link href="/trainee" className="hover:text-white transition">
                  Learner Dashboard
                </Link>
              </li>
              <li>
                <Link href="/trainer" className="hover:text-white transition">
                  Trainer Workspace
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition">
                  Admin Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Learning Areas */}
          <div>
            <h3 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">
              Learning Areas
            </h3>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-white transition cursor-default">Radar Meteorology</span></li>
              <li><span className="hover:text-white transition cursor-default">Satellite Meteorology</span></li>
              <li><span className="hover:text-white transition cursor-default">Numerical Weather Prediction</span></li>
              <li><span className="hover:text-white transition cursor-default">Cyclone Forecasting</span></li>
              <li><span className="hover:text-white transition cursor-default">Agro-Meteorology</span></li>
            </ul>
          </div>

          {/* Col 4: Support */}
          <div>
            <h3 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">
              Support
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>support@capacityconnect.in</span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                For account access issues, course content queries, or technical support,
                reach out via email. Response within 1–2 business days.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 gap-2">
          <p>© {year} CapacityConnect. All rights reserved.</p>
          <p className="text-center">
            Built with Next.js · Tailwind CSS · Firebase Auth · Deployed on Vercel
          </p>
        </div>
      </div>
    </footer>
  );
}
