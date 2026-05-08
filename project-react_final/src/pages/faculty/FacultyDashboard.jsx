import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import StatsCard from "../../components/StatsCard";
import {
  Users, MessageSquare, CalendarDays, Bell,
  ChevronRight, Clock, ArrowUpRight, AlertTriangle,
  CheckCircle2, TrendingUp, BookOpen, Sparkles
} from "lucide-react";
import { queries, advisingSessions, notices, studentRecords, facultyData } from "../../data/dummyData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const gpaData = [
  { range: "3.75–4.0",  count: 3 },
  { range: "3.5–3.74",  count: 1 },
  { range: "3.0–3.49",  count: 1 },
  { range: "2.5–2.99",  count: 1 },
  { range: "<2.5",      count: 1 },
];
const barColors = ["#10b981", "#06b6d4", "#2563eb", "#f59e0b", "#f43f5e"];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl p-3 border border-white/10 text-xs">
      <p className="text-slate-400">{label}</p>
      <p className="text-white font-bold">{payload[0].value} students</p>
    </div>
  );
};

export default function FacultyDashboard() {
  const { user } = useAuth();
  const pendingQ   = queries.filter(q => q.status === "pending").length;
  const todaySess  = advisingSessions.filter(s => s.advisor === facultyData.name && s.status === "confirmed").length;
  const atRisk     = studentRecords.filter(s => s.cgpa < 2.5 || s.warnings > 0).length;

  return (
    <div className="space-y-6 stagger-child">
      {/* Hero */}
      <div className="relative glass-card glow-border rounded-2xl p-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-blue-500/5 pointer-events-none" />
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-violet-500/10 rounded-full blur-2xl" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-violet-400" />
              <span className="text-xs text-violet-400 font-medium">Faculty Portal</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-white">{user?.name}</h2>
            <p className="text-slate-400 text-sm mt-1">{facultyData.designation} · {facultyData.department}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="status-info text-xs px-2.5 py-1 rounded-full">{facultyData.id}</span>
              <span className="text-xs bg-violet-500/15 text-violet-400 border border-violet-500/25 px-2.5 py-1 rounded-full">{facultyData.specialization}</span>
            </div>
          </div>
          <div className="flex gap-3">
            {[
              { label: "Students",  value: studentRecords.length },
              { label: "Courses",   value: facultyData.courses.length },
              { label: "Office Hrs",value: "6h/wk" },
            ].map(s => (
              <div key={s.label} className="glass-card rounded-xl p-4 text-center min-w-[80px]">
                <p className="font-display text-xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard label="Total Students"    value={studentRecords.length} sub="Under advising"       icon={Users}         color="blue"    />
        <StatsCard label="Pending Queries"   value={pendingQ}              sub="Awaiting response"    icon={MessageSquare} color="amber"   />
        <StatsCard label="Sessions Today"    value={todaySess}             sub="Confirmed advising"   icon={CalendarDays}  color="cyan"    />
        <StatsCard label="At-Risk Students"  value={atRisk}                sub="Need attention"       icon={AlertTriangle} color={atRisk > 0 ? "rose" : "emerald"} />
      </div>

      {/* Middle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pending queries */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-amber-400" />
              <h3 className="font-display font-semibold text-white text-sm">Pending Queries</h3>
            </div>
            <Link to="/faculty/queries" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
              Manage all <ChevronRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {queries.filter(q => q.status === "pending").slice(0, 4).map(q => (
              <div key={q.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-amber-500/20 transition-colors group cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 text-amber-400 font-display font-bold text-xs">
                  {q.studentName.split(" ").map(w => w[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 font-medium leading-snug">{q.subject}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500">{q.studentName}</span>
                    <span className="text-slate-700">·</span>
                    <span className="text-xs text-slate-600">{q.category}</span>
                    <span className="text-slate-700">·</span>
                    <span className="text-xs text-slate-600">{q.date}</span>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                  q.priority === "high" ? "bg-rose-500/15 text-rose-400 border border-rose-500/20"
                  : "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                }`}>{q.priority}</span>
                <ArrowUpRight size={14} className="text-slate-700 group-hover:text-amber-400 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* GPA distribution */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-cyan-400" />
            <h3 className="font-display font-semibold text-white text-sm">GPA Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={gpaData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="range" tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {gpaData.map((_, i) => <Cell key={i} fill={barColors[i]} opacity={0.85} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Today's sessions */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-blue-400" />
              <h3 className="font-display font-semibold text-white text-sm">Today's Sessions</h3>
            </div>
            <Link to="/faculty/scheduling" className="text-xs text-blue-400"><ChevronRight size={12} /></Link>
          </div>
          {advisingSessions.filter(s => s.advisor === facultyData.name).slice(0, 3).map(s => (
            <div key={s.id} className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-xs text-blue-400 font-bold font-display">
                {s.studentName.split(" ")[0][0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-200 truncate">{s.studentName}</p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><Clock size={10} />{s.time}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${s.status === "confirmed" ? "status-active" : "status-pending"}`}>{s.status}</span>
            </div>
          ))}
        </div>

        {/* At-risk students */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-rose-400" />
              <h3 className="font-display font-semibold text-white text-sm">Students Needing Attention</h3>
            </div>
            <Link to="/faculty/students" className="text-xs text-blue-400 flex items-center gap-1">All records <ChevronRight size={12} /></Link>
          </div>
          {studentRecords.filter(s => s.cgpa < 3.0 || s.warnings > 0).map(s => (
            <div key={s.id} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-display ${
                s.cgpa < 2.5 ? "bg-rose-500/15 text-rose-400" : "bg-amber-500/15 text-amber-400"
              }`}>
                {s.name.split(" ").map(w => w[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200">{s.name}</p>
                <p className="text-xs text-slate-500">{s.id} · {s.semester} Sem</p>
              </div>
              <div className="text-right">
                <p className={`font-display font-bold text-sm ${s.cgpa < 2.5 ? "text-rose-400" : "text-amber-400"}`}>{s.cgpa}</p>
                <p className="text-xs text-slate-600">CGPA</p>
              </div>
              {s.warnings > 0 && (
                <span className="text-xs bg-rose-500/15 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full">{s.warnings} warning{s.warnings > 1 ? "s" : ""}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Respond to Queries",   path: "/faculty/queries",    color: "from-amber-500/20 to-amber-500/5",  border: "border-amber-500/20",  icon: MessageSquare, iconColor: "text-amber-400"  },
          { label: "Post Announcement",     path: "/faculty/notices",    color: "from-blue-500/20 to-blue-500/5",    border: "border-blue-500/20",   icon: Bell,          iconColor: "text-blue-400"   },
          { label: "Update Schedule",       path: "/faculty/scheduling", color: "from-cyan-500/20 to-cyan-500/5",    border: "border-cyan-500/20",   icon: CalendarDays,  iconColor: "text-cyan-400"   },
          { label: "View Student Records",  path: "/faculty/students",   color: "from-violet-500/20 to-violet-500/5",border: "border-violet-500/20", icon: Users,         iconColor: "text-violet-400" },
        ].map(a => (
          <Link key={a.path} to={a.path}
            className={`glass-card glass-card-hover rounded-2xl p-4 flex flex-col gap-3 border ${a.border} bg-gradient-to-br ${a.color}`}
          >
            <a.icon size={20} className={a.iconColor} />
            <p className="text-sm font-medium text-slate-200 leading-snug">{a.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
