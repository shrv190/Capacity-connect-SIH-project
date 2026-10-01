import React from "react";
import Link from "next/link";
import { Building2, Phone, Mail, Globe, Shield, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0a192f] text-slate-300 border-t border-slate-800 text-sm">
      {/* Tricolor Ribbon on top of footer */}
      <div className="tricolor-ribbon" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Institutional Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Building2 className="w-6 h-6 text-amber-400" />
              <span className="font-bold text-white text-base tracking-wide">
                CAPACITY CONNECT
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official Digital Capacity Building & Learning Management Portal under the Ministry of Earth Sciences (MoES), Government of India, operated by the India Meteorological Department (IMD).
            </p>
            <div className="text-xs text-slate-400 space-y-1">
              <p>Mausam Bhavan, Lodhi Road</p>
              <p>New Delhi – 110003, India</p>
            </div>
          </div>

          {/* Col 2: Regional Centres */}
          <div>
            <h3 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider text-amber-400">
              Regional Met Centres (RMCs)
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>• RMC New Delhi (North India)</li>
              <li>• RMC Kolkata (East & Northeast)</li>
              <li>• RMC Mumbai (Western Coast)</li>
              <li>• RMC Chennai (Southern Peninsula)</li>
              <li>• RMC Guwahati (Northeastern Hills)</li>
              <li>• RMC Nagpur (Central India)</li>
            </ul>
          </div>

          {/* Col 3: Key National Links */}
          <div>
            <h3 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider text-amber-400">
              Government Portals
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a
                  href="https://mausam.imd.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1"
                >
                  IMD Official Portal <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://moes.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1"
                >
                  Ministry of Earth Sciences <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.india.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1"
                >
                  National Portal of India <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://karmayogi.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1"
                >
                  Mission Karmayogi (DoPT) <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Support & 24x7 Helpline */}
          <div>
            <h3 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider text-amber-400">
              Helpline & Support
            </h3>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>24x7 Weather Helpline: <strong>1800-180-1717</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>capacity.connect@imd.gov.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>NIC Government Cloud Hosted</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} India Meteorological Department, Ministry of Earth Sciences. All Rights Reserved.</p>
          <p className="text-center md:text-right">
            Designed for National Capacity Building | GIGW 3.0 & WCAG 2.1 AA Compliant
          </p>
        </div>
      </div>
    </footer>
  );
}
