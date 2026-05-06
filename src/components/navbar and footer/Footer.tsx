import { Link } from "react-router-dom";
import { GraduationCap, Mail } from "lucide-react";

export function Footer() {
  const footerLinks = [
    { name: "Home", path: "/home" },
    { name: "Career", path: "/careers" },
    { name: "AI Match", path: "/ai-match" },
    { name: "Learning Path", path: "/learning-path" },
    { name: "Track Progress", path: "/track-progress" },
  ];

  return (
    // Removed the top margin (mt-20) that was breaking the blue background flow
    <footer className="border-t border-gray-100 bg-white pt-10 font-['Inter']">
      <div className="mx-auto max-w-5xl px-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left mb-10">

        {/* Brand */}
        <div>
          <Link to="/home" className="flex items-center justify-center md:justify-start gap-2 mb-4 group cursor-pointer">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4A5DF9]">
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-[#4A5DF9] uppercase tracking-wide group-hover:opacity-80 transition-opacity">
              JOBMAIKUB
            </span>
          </Link>
          <p className="text-sm text-gray-500 leading-relaxed max-w-[280px] mx-auto md:mx-0">
            Design your ideal future with AI-driven insights and complete learning roadmaps — all in one place.
          </p>


        </div>

        {/* Links */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-[#4A5DF9] text-[11px] uppercase tracking-[0.15em]">
            Platform Navigation
          </h3>
          <div className="flex flex-col gap-3">
            {footerLinks.map((link) => (
              <Link to={link.path} key={link.name} className="text-[13px] font-medium text-gray-600 hover:text-[#4A5DF9] transition-colors">
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-[#4A5DF9] text-[11px] uppercase tracking-[0.15em]">
            Get in Touch
          </h3>

          <div className="bg-[#F4F7FF] p-5 rounded-2xl flex flex-col gap-2 w-full max-w-[260px] mx-auto md:mx-0 overflow-hidden">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Email Support
            </span>
            <div className="flex items-center gap-3 mt-1 overflow-hidden">
              <div className="bg-white p-1.5 rounded-md shadow-sm shrink-0">
                <Mail size={16} className="text-[#4A5DF9]" />
              </div>
              <span className="font-bold text-[13px] text-gray-900 truncate">
                jobmaikub@gmail.com
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="w-full bg-[#D5E3FF]/40 py-3 text-center">
        <span className="text-[12px] font-medium text-gray-600">
          © 2026 JOBMAIKUB. ALL RIGHTS RESERVED.
        </span>
      </div>
    </footer>
  );
}