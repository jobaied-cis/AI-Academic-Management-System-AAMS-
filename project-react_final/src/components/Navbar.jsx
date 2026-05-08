import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Bell, Search, Menu, X, Sun, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { notices } from "../data/dummyData";

const pageTitle = {
  "/student/dashboard":  "Dashboard",
  "/student/schedule":   "Class Schedule",
  "/student/notices":    "Notices & Announcements",
  "/student/queries":    "Submit a Query",
  "/student/progress":   "Academic Progress",
  "/student/faq":        "FAQ — AI Assistant",
  "/student/advising":   "Book Advising Session",
  "/student/documents":  "Academic Documents",
  "/faculty/dashboard":  "Faculty Dashboard",
  "/faculty/queries":    "Manage Queries",
  "/faculty/notices":    "Manage Notices",
  "/faculty/students":   "Student Records",
  "/faculty/scheduling": "Schedule Management",
  "/faculty/documents":  "Document Management",
};

export default function Navbar({ setMobileOpen, mobileOpen }) {
  const { user } = useAuth();
  const location = useLocation();
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const title = pageTitle[location.pathname] || "AAMS";
  const unreadCount = 3;
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <header className="h-16 bg-space-800/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <div>
          <h2 className="font-display font-semibold text-white text-sm md:text-base leading-none">{title}</h2>
          <p className="text-xs text-slate-500 mt-0.5 hidden md:block">{today}</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Search */}
        <div className={`hidden md:flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 transition-all duration-200 ${searchFocused ? "border-blue-500/40 shadow-glow-blue w-52" : "w-44"}`}>
          <Search size={14} className="text-slate-500 flex-shrink-0" />
          <input
            type="text"
            placeholder="Quick search…"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="bg-transparent text-xs text-slate-300 placeholder:text-slate-600 outline-none w-full"
          />
        </div>

        {/* AI indicator */}
        <div className="hidden md:flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 rounded-xl px-3 py-2">
          <Sparkles size={13} className="text-blue-400 animate-pulse" />
          <span className="text-xs text-blue-400 font-medium">AI Active</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all relative"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-space-800">
                <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75" />
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 bg-space-700 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-slide-up">
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-display font-semibold text-sm text-white">Notifications</h3>
                <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">{unreadCount} new</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notices.slice(0, 4).map((n, i) => (
                  <div key={n.id} className={`p-4 border-b border-white/5 hover:bg-white/[0.03] cursor-pointer transition-colors ${i < unreadCount ? "bg-blue-500/[0.04]" : ""}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${i < unreadCount ? "bg-blue-400" : "bg-slate-600"}`} />
                      <div>
                        <p className="text-xs font-medium text-slate-200 leading-snug">{n.title}</p>
                        <p className="text-xs text-slate-500 mt-1">{n.date} · {n.author}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center">
                <button className="text-xs text-blue-400 hover:text-blue-300 font-medium">View all notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-xs font-display font-bold cursor-pointer">
          {user?.name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
