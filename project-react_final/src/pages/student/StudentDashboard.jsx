import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import StatsCard from "../../components/StatsCard";
import {
  BookOpen, TrendingUp, Bell, MessageSquare, CalendarDays,
  AlertTriangle, ChevronRight, Clock, Sparkles, UserCheck,
  CheckCircle2, Circle, ArrowUpRight
} from "lucide-react";
import {
  studentData, notices, queries, classSchedule,
  academicProgress, advisingSessions
} from "../../data/dummyData";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";

const radarData = [
  { subject: "OOP",      A: 92 },
  { subject: "Networks", A: 78 },
  { subject: "AI Funds", A: 88 },
  { subject: "Accounting",A: 74 },
  { subject: "DSA",      A: 95 },
  { subject: "DBMS",     A: 88 },
];

const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
const todayClasses = classSchedule.filter(c =>
  c.day.toLowerCase().includes(today.toLowerCase().slice(0, 3))
);

export default function StudentDashboard() {
  const { user } = useAuth();
  const pendingQueries = queries.filter(q => q.status === "pending" && q.studentId === studentData.id).length;
  const upcomingSession = advisingSessions.find(s => s.studentName === studentData.name && s.status === "confirmed");

  return (
    <div className="space-y-6 stagger-child">

      {/* Hero greeting */}
      <div className="relative glass-card glow-border rounded-2xl p-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-500/5 pointer-events-none" />
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-blue-400" />
              <span className="text-xs text-blue-400 font-medium">Good morning</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-white">{user?.name} 👋</h2>
            <p className="text-slate-400 text-sm mt-1">
              {studentData.program} · {studentData.semester} Semester
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="status-info text-xs px-2.5 py-1 rounded-full">{studentData.id}</span>
              <span className="status-active text-xs px-2.5 py-1 rounded-full">{studentData.standing}</span>
              <span className="text-xs bg-violet-500/15 text-violet-400 border border-violet-500/25 px-2.5 py-1 rounded-full">Batch {studentData.batch}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="glass-card rounded-xl p-4 text-center min-w-[90px]">
              <p className="font-display text-2xl font-bold text-white">{studentData.cgpa}</p>
              <p className="text-xs text-slate-500 mt-0.5">CGPA</p>
            </div>
            <div className="glass-card rounded-xl p-4 text-center min-w-[90px]">
              <p className="font-display text-2xl font-bold text-white">{studentData.credits_completed}</p>
              <p className="text-xs text-slate-500 mt-0.5">Credits Done</p>
            </div>
            <div className="glass-card rounded-xl p-4 text-center min-w-[90px]">
              <p className="font-display text-2xl font-bold text-amber-400">{studentData.credits_total - studentData.credits_completed}</p>
              <p className="text-xs text-slate-500 mt-0.5">Remaining</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard label="CGPA"            value={studentData.cgpa}  sub="Current standing"       icon={TrendingUp}    color="blue"    trend="up"   trendValue="+0.06 last sem" />
        <StatsCard label="Credits Done"    value={`${studentData.credits_completed}/${studentData.credits_total}`} sub="Academic progress" icon={BookOpen}   color="cyan"    />
        <StatsCard label="Pending Queries" value={pendingQueries}    sub="Awaiting response"      icon={MessageSquare} color="amber"   />
        <StatsCard label="Warnings"        value={studentData.warnings} sub="Academic warnings"   icon={AlertTriangle} color={studentData.warnings === 0 ? "emerald" : "rose"} />
      </div>

      {/* Middle section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Today's classes */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-blue-400" />
              <h3 className="font-display font-semibold text-white text-sm">Today's Classes</h3>
              <span className="text-xs text-slate-500">({today})</span>
            </div>
            <Link to="/student/schedule" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
              Full schedule <ChevronRight size={12} />
            </Link>
          </div>

          {todayClasses.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 size={32} className="text-emerald-400 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">No classes today! Enjoy your day.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {todayClasses.map((c, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-blue-500/20 transition-colors">
                  <div className="text-center min-w-[70px]">
                    <p className="text-xs font-mono text-blue-400 font-medium">{c.period.split("–")[0]}</p>
                    <p className="text-[10px] text-slate-600">–{c.period.split("–")[1]}</p>
                  </div>
                  <div className="w-0.5 h-10 bg-white/10 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{c.course}</p>
                    <p className="text-xs text-slate-500">{c.instructor} · Room {c.room}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${c.type === "Lab" ? "bg-amber-500/15 text-amber-400 border border-amber-500/20" : "bg-blue-500/15 text-blue-400 border border-blue-500/20"}`}>
                    {c.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Radar chart */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-cyan-400" />
            <h3 className="font-display font-semibold text-white text-sm">Performance Radar</h3>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 10 }} />
              <Radar name="Score" dataKey="A" stroke="#2563eb" fill="#2563eb" fillOpacity={0.15} strokeWidth={1.5} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent notices */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-amber-400" />
              <h3 className="font-display font-semibold text-white text-sm">Latest Notices</h3>
            </div>
            <Link to="/student/notices" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
              View all <ChevronRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {notices.slice(0, 4).map(n => (
              <div key={n.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer group">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.priority === "high" ? "bg-rose-400" : n.priority === "medium" ? "bg-amber-400" : "bg-slate-600"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 font-medium leading-snug group-hover:text-white transition-colors">{n.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500">{n.date}</span>
                    <span className="text-slate-700">·</span>
                    <span className="text-xs text-slate-600">{n.category}</span>
                  </div>
                </div>
                <ArrowUpRight size={14} className="text-slate-700 group-hover:text-blue-400 transition-colors flex-shrink-0 mt-0.5" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions & upcoming */}
        <div className="space-y-4">
          {/* Upcoming advising */}
          {upcomingSession && (
            <div className="glass-card rounded-2xl p-4 border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-3">
                <UserCheck size={14} className="text-emerald-400" />
                <h3 className="font-display font-semibold text-white text-sm">Upcoming Session</h3>
              </div>
              <p className="text-xs text-emerald-400 font-medium">{upcomingSession.topic}</p>
              <p className="text-xs text-slate-400 mt-1">{upcomingSession.advisor}</p>
              <div className="flex items-center gap-1.5 mt-2 text-slate-500">
                <Clock size={11} />
                <span className="text-xs">{upcomingSession.date} at {upcomingSession.time}</span>
              </div>
              <span className={`mt-2 inline-block text-xs px-2 py-0.5 rounded-full ${upcomingSession.mode === "Online" ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20" : "bg-violet-500/15 text-violet-400 border border-violet-500/20"}`}>
                {upcomingSession.mode}
              </span>
            </div>
          )}

          {/* Quick actions */}
          <div className="glass-card rounded-2xl p-4">
            <h3 className="font-display font-semibold text-white text-sm mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: "Submit a Query",      path: "/student/queries",   color: "text-blue-400"    },
                { label: "Book Advising",        path: "/student/advising",  color: "text-emerald-400" },
                { label: "View Progress",        path: "/student/progress",  color: "text-cyan-400"    },
                { label: "Browse Documents",     path: "/student/documents", color: "text-amber-400"   },
              ].map(action => (
                <Link
                  key={action.path}
                  to={action.path}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.05] transition-colors group"
                >
                  <span className={`text-sm font-medium ${action.color}`}>{action.label}</span>
                  <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
