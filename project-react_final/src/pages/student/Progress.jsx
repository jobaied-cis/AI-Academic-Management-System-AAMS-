import React, { useState } from "react";
import { TrendingUp, BookOpen, Award, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { studentData, academicProgress } from "../../data/dummyData";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, ReferenceLine
} from "recharts";

const gradeColor = { "A+": "text-emerald-400", "A": "text-blue-400", "A-": "text-cyan-400", "B+": "text-amber-400", "B": "text-amber-500" };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl p-3 border border-white/10 text-xs">
      <p className="text-slate-400 mb-1">{label} Semester</p>
      <p className="text-white font-bold">GPA: {payload[0]?.value}</p>
    </div>
  );
};

export default function Progress() {
  const [activeTab, setActiveTab] = useState("overview");

  const completedCourses = academicProgress.courses.filter(c => c.status === "completed");
  const ongoingCourses   = academicProgress.courses.filter(c => c.status === "ongoing");
  const creditsDone      = studentData.credits_completed;
  const creditsTotal     = studentData.credits_total;
  const progressPct      = Math.round((creditsDone / creditsTotal) * 100);
  const chartData        = academicProgress.semesterGPA.filter(s => s.gpa !== null);

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-child">
        {[
          { label: "Current CGPA",      value: studentData.cgpa,                              sub: "Out of 4.00",                  icon: Award,          color: "text-blue-400",    bg: "bg-blue-500/10"    },
          { label: "Credits Completed", value: creditsDone,                                   sub: `of ${creditsTotal} total`,     icon: BookOpen,       color: "text-cyan-400",    bg: "bg-cyan-500/10"    },
          { label: "Courses Completed", value: completedCourses.length,                       sub: `${ongoingCourses.length} ongoing`, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Academic Standing", value: studentData.standing.split(" ")[0],            sub: "No warnings",                  icon: TrendingUp,     color: "text-emerald-400", bg: "bg-emerald-500/10" },
        ].map(card => (
          <div key={card.label} className="glass-card glass-card-hover rounded-2xl p-5 border border-white/5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.bg}`}>
              <card.icon size={20} className={card.color} />
            </div>
            <p className={`font-display text-2xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
            <p className="text-xs text-slate-600 mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Credit progress bar */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-semibold text-white text-sm">Graduation Progress</h3>
            <p className="text-xs text-slate-500 mt-0.5">{creditsDone} of {creditsTotal} credits completed</p>
          </div>
          <span className="font-display text-2xl font-bold text-white">{progressPct}%</span>
        </div>
        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-1000"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-slate-600">0</span>
          <span className="text-xs text-slate-600">Graduation at {creditsTotal} credits</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-space-800 p-1 rounded-xl w-fit border border-white/5">
        {[
          { id: "overview", label: "GPA Trend"    },
          { id: "courses",  label: "Course History"},
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === t.id ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="glass-card rounded-2xl p-5 animate-fade-in">
          <h3 className="font-display font-semibold text-white text-sm mb-5">GPA Progression by Semester</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gpaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="semester" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[3.5, 4]} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={3.5} stroke="rgba(244,63,94,0.3)" strokeDasharray="4 4" label={{ value: "Min 2.5", fill: "#f43f5e", fontSize: 10 }} />
              <Area type="monotone" dataKey="gpa" stroke="#2563eb" fill="url(#gpaGrad)" strokeWidth={2} dot={{ fill: "#2563eb", r: 4, strokeWidth: 2, stroke: "#0d1526" }} activeDot={{ r: 6, fill: "#60a5fa" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeTab === "courses" && (
        <div className="space-y-4 animate-fade-in">
          {/* Ongoing */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2 bg-amber-500/5">
              <Clock size={14} className="text-amber-400" />
              <h3 className="font-display font-semibold text-white text-sm">Current Semester</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead><tr><th>Code</th><th>Course</th><th>Credits</th><th>Status</th></tr></thead>
                <tbody>
                  {ongoingCourses.map(c => (
                    <tr key={c.code}>
                      <td className="font-mono text-xs text-blue-400">{c.code}</td>
                      <td className="text-slate-200">{c.name}</td>
                      <td className="text-slate-400">{c.credits}</td>
                      <td><span className="status-pending text-xs px-2 py-0.5 rounded-full">Ongoing</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Completed */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2 bg-emerald-500/5">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <h3 className="font-display font-semibold text-white text-sm">Completed Courses</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead><tr><th>Code</th><th>Course</th><th>Credits</th><th>Grade</th><th>Marks</th></tr></thead>
                <tbody>
                  {completedCourses.map(c => (
                    <tr key={c.code}>
                      <td className="font-mono text-xs text-blue-400">{c.code}</td>
                      <td className="text-slate-200">{c.name}</td>
                      <td className="text-slate-400">{c.credits}</td>
                      <td><span className={`font-display font-bold text-sm ${gradeColor[c.grade] || "text-white"}`}>{c.grade}</span></td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-white/5 rounded-full">
                            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: `${c.marks}%` }} />
                          </div>
                          <span className="text-xs text-slate-400">{c.marks}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
