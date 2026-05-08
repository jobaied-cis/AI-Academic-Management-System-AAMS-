import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Cpu, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const { user } = useAuth();
  const homeLink = user
    ? user.role === "student" ? "/student/dashboard" : "/faculty/dashboard"
    : "/login";

  return (
    <div className="min-h-screen bg-space-900 bg-grid flex items-center justify-center p-6">
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center animate-slide-up max-w-md">
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-glow-blue">
            <Cpu size={20} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-white text-lg">AAMS</h1>
        </div>

        <div className="relative mb-6">
          <p className="font-display font-bold text-[120px] leading-none bg-gradient-to-b from-slate-600 to-slate-800 bg-clip-text text-transparent select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <span className="text-3xl">🔭</span>
            </div>
          </div>
        </div>

        <h2 className="font-display text-2xl font-bold text-white mb-3">Page Not Found</h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist or you may not have permission to view it. Double-check
          the URL or head back home.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link to={homeLink} className="btn-primary flex items-center gap-2 text-sm px-5 py-3">
            <Home size={15} /> Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-sm px-5 py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all"
          >
            <ArrowLeft size={15} /> Go Back
          </button>
        </div>

        <p className="text-xs text-slate-700 mt-10">AAMS · Daffodil International University · CIS Department</p>
      </div>
    </div>
  );
}
