import React, { useEffect, useState } from "react";
import {
  Bell, CheckCircle2, X, Clock, AlertTriangle, BookOpen,
  Calendar, Megaphone, Zap, Filter, BellOff, Sparkles,
  ChevronRight, MailCheck
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { studentData } from "../../data/dummyData";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
const NOTIFICATION_ENDPOINTS = API_BASE
  ? [(studentId) => `${API_BASE}/api/ai/agentic-notifications/${studentId}`]
  : [
      (studentId) => `/api/ai/agentic-notifications/${studentId}`,
      (studentId) => `http://localhost:8080/api/ai/agentic-notifications/${studentId}`,
    ];

const allNotifications = [
  { id: 1, type: "deadline",   priority: "high",   title: "Midterm Exam — CSE 3101",           desc: "OOP Midterm is in 3 days. Room: Exam Hall-A, 9:00 AM.",                 time: "3 days",    read: false, icon: BookOpen,    color: "rose"    },
  { id: 2, type: "deadline",   priority: "high",   title: "Assignment Submission Due",          desc: "CSE 3201 Lab Report #3 due tomorrow at 11:59 PM via portal.",           time: "1 day",     read: false, icon: Clock,       color: "amber"   },
  { id: 3, type: "notice",     priority: "medium", title: "New Notice Posted",                  desc: "Course Registration for Fall 2025 begins July 25. Clear dues first.",   time: "2 hrs",     read: false, icon: Megaphone,   color: "blue"    },
  { id: 4, type: "ai",         priority: "medium", title: "AI Insight — Course Recommendation", desc: "Based on your progress, consider enrolling in Machine Learning next semester.", time: "Today", read: false, icon: Sparkles,   color: "violet"  },
  { id: 5, type: "advising",   priority: "medium", title: "Advising Session Confirmed",         desc: "Dr. Farhana Islam confirmed your session on July 18 at 2:00 PM.",        time: "Yesterday", read: true,  icon: Calendar,    color: "emerald" },
  { id: 6, type: "deadline",   priority: "high",   title: "Midterm Exam — CSE 3201",           desc: "Computer Networks Midterm in 5 days. Room: Exam Hall-B.",                time: "5 days",    read: true,  icon: BookOpen,    color: "rose"    },
  { id: 7, type: "notice",     priority: "low",    title: "Library Extended Hours",             desc: "Library open until midnight during exam period August 1–20.",           time: "3 days ago", read: true,  icon: Bell,        color: "slate"   },
  { id: 8, type: "ai",         priority: "low",    title: "Weekly Academic Summary",            desc: "You've completed 3 of 4 scheduled lab sessions this week. Great work!", time: "4 days ago", read: true,  icon: Sparkles,    color: "cyan"    },
  { id: 9, type: "query",      priority: "medium", title: "Query Response Received",            desc: "Dr. Islam responded to your advising session rescheduling query.",       time: "1 week ago", read: true,  icon: MailCheck,   color: "blue"    },
  { id: 10, type: "deadline",  priority: "medium", title: "Exam Form Submission",               desc: "Submit your Final Exam form before July 30 via the Documents section.", time: "12 days",   read: false, icon: AlertTriangle,color: "amber"  },
];

const colorMap = {
  rose:    { bg: "bg-rose-500/10",    text: "text-rose-400",    border: "border-rose-500/20",    dot: "bg-rose-400"    },
  amber:   { bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/20",   dot: "bg-amber-400"   },
  blue:    { bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-blue-500/20",    dot: "bg-blue-400"    },
  violet:  { bg: "bg-violet-500/10",  text: "text-violet-400",  border: "border-violet-500/20",  dot: "bg-violet-400"  },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", dot: "bg-emerald-400" },
  cyan:    { bg: "bg-cyan-500/10",    text: "text-cyan-400",    border: "border-cyan-500/20",    dot: "bg-cyan-400"    },
  slate:   { bg: "bg-slate-500/10",   text: "text-slate-400",   border: "border-slate-500/20",   dot: "bg-slate-500"   },
};

const filters = ["all", "deadline", "notice", "ai", "advising", "query"];
const iconMap = { Bell, Clock, AlertTriangle, BookOpen, Calendar, Megaphone, Sparkles, MailCheck };

export default function Notifications() {
  const { user } = useAuth();
  const [notifs, setNotifs]         = useState(allNotifications);
  const [activeFilter, setFilter]   = useState("all");
  const [showUnreadOnly, setUnread] = useState(false);

  useEffect(() => {
    async function loadAgenticNotifications() {
      const studentId = user?.id || studentData.id;
      try {
        let data = null;
        for (const buildEndpoint of NOTIFICATION_ENDPOINTS) {
          try {
            const response = await fetch(buildEndpoint(studentId));
            if (!response.ok) {
              continue;
            }
            data = await response.json();
            break;
          } catch {
            // Try the next endpoint
          }
        }

        if (Array.isArray(data.notifications) && data.notifications.length > 0) {
          setNotifs(data.notifications);
          return;
        }
      } catch {
        // Fallback handled below
      }
      setNotifs(allNotifications);
    }

    loadAgenticNotifications();
  }, [user]);

  const unreadCount = notifs.filter(n => !n.read).length;

  const visible = notifs.filter(n => {
    const matchFilter = activeFilter === "all" || n.type === activeFilter;
    const matchRead   = !showUnreadOnly || !n.read;
    return matchFilter && matchRead;
  });

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const dismiss     = (id) => setNotifs(prev => prev.filter(n => n.id !== id));
  const markRead    = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const upcomingDeadlines = notifs.filter(n => n.type === "deadline" && !n.read);

  return (
    <div className="space-y-5 stagger-child">
      {/* Header */}
      <div className="glass-card glow-border rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/15 flex items-center justify-center relative">
            <Bell size={22} className="text-blue-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h2 className="font-display font-bold text-white">Smart Notifications</h2>
            <p className="text-slate-400 text-sm">{unreadCount} unread · {notifs.length} total</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setUnread(!showUnreadOnly)}
            className={`flex items-center gap-2 text-xs px-3 py-2 rounded-xl border transition-all ${
              showUnreadOnly ? "bg-blue-600 text-white border-blue-600" : "text-slate-400 border-white/10 hover:border-white/20"
            }`}
          >
            <Filter size={12} /> Unread Only
          </button>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl border border-white/10 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all">
              <CheckCircle2 size={12} /> Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Deadline countdown cards */}
      {upcomingDeadlines.length > 0 && (
        <div>
          <h3 className="font-display font-semibold text-white text-sm mb-3 flex items-center gap-2">
            <AlertTriangle size={14} className="text-amber-400" /> Upcoming Deadlines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {upcomingDeadlines.slice(0, 3).map(n => {
              const c = colorMap[n.color];
              const Icon = typeof n.icon === "string" ? (iconMap[n.icon] || Bell) : n.icon;
              return (
                <div key={n.id} className={`glass-card rounded-2xl p-4 border ${c.border} bg-gradient-to-br ${c.bg} to-transparent`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={14} className={c.text} />
                    <span className={`text-xs font-medium ${c.text}`}>{n.time} remaining</span>
                  </div>
                  <p className="text-sm font-medium text-white leading-snug">{n.title}</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{n.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs px-3 py-2 rounded-xl font-medium border capitalize transition-all ${
              activeFilter === f ? "bg-blue-600 text-white border-blue-600" : "text-slate-400 border-white/10 hover:border-white/20"
            }`}
          >{f}</button>
        ))}
      </div>

      {/* Notification list */}
      <div className="space-y-2 stagger-child">
        {visible.length === 0 && (
          <div className="text-center py-16">
            <BellOff size={40} className="text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500">No notifications to show.</p>
          </div>
        )}
        {visible.map(n => {
          const c = colorMap[n.color];
          const Icon = typeof n.icon === "string" ? (iconMap[n.icon] || Bell) : n.icon;
          return (
            <div
              key={n.id}
              className={`glass-card rounded-2xl p-4 flex items-start gap-4 border transition-all ${
                n.read ? "border-white/5 opacity-75" : `${c.border} bg-gradient-to-r ${c.bg} to-transparent`
              }`}
            >
              {/* Dot + icon */}
              <div className="flex flex-col items-center gap-1.5 flex-shrink-0 pt-0.5">
                <div className={`w-2 h-2 rounded-full ${n.read ? "bg-slate-700" : c.dot}`} />
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${c.bg}`}>
                  <Icon size={14} className={c.text} />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-medium leading-snug ${n.read ? "text-slate-400" : "text-white"}`}>
                    {n.title}
                  </p>
                  <span className="text-xs text-slate-600 flex-shrink-0 whitespace-nowrap">{n.time}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{n.desc}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border capitalize ${
                    n.priority === "high" ? "bg-rose-500/15 text-rose-400 border-rose-500/20"
                    : n.priority === "medium" ? "bg-amber-500/15 text-amber-400 border-amber-500/20"
                    : "bg-slate-500/15 text-slate-400 border-slate-500/20"
                  }`}>{n.priority}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border capitalize ${c.bg} ${c.text} ${c.border}`}>{n.type}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {!n.read && (
                  <button onClick={() => markRead(n.id)} title="Mark as read"
                    className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/20 transition-colors">
                    <CheckCircle2 size={12} />
                  </button>
                )}
                <button onClick={() => dismiss(n.id)} title="Dismiss"
                  className="w-7 h-7 rounded-lg bg-slate-500/10 text-slate-500 flex items-center justify-center hover:bg-rose-500/10 hover:text-rose-400 transition-colors">
                  <X size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
