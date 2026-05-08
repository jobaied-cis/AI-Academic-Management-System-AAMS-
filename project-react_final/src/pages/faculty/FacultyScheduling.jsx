import React, { useState } from "react";
import { advisingSessions, classSchedule, facultyData } from "../../data/dummyData";
import { CalendarDays, Plus, Clock, Video, MapPin, CheckCircle2, XCircle, Users, Edit2 } from "lucide-react";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

export default function FacultyScheduling() {
  const [activeTab, setActiveTab] = useState("advising");
  const [sessions, setSessions]   = useState(advisingSessions.filter(s => s.advisor === facultyData.name));
  const [toast, setToast]         = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleConfirm = (id) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: "confirmed" } : s));
    showToast("Session confirmed.");
  };

  const handleCancel = (id) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: "cancelled" } : s));
    showToast("Session cancelled.");
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-2 bg-space-800 p-1 rounded-xl w-fit border border-white/5">
        {[
          { id: "advising", label: "Advising Sessions", icon: Users      },
          { id: "classes",  label: "Class Routine",     icon: CalendarDays },
        ].map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === id ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {toast && (
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-4 animate-slide-up">
          <CheckCircle2 size={16} className="text-emerald-400" /><p className="text-sm text-emerald-400">{toast}</p>
        </div>
      )}

      {activeTab === "advising" && (
        <div className="space-y-4 animate-fade-in">
          {/* Stats */}
          <div className="flex gap-3 flex-wrap">
            {[
              { label: "Total",     value: sessions.length,                                       color: "text-white"       },
              { label: "Pending",   value: sessions.filter(s => s.status === "pending").length,   color: "text-amber-400"   },
              { label: "Confirmed", value: sessions.filter(s => s.status === "confirmed").length, color: "text-emerald-400" },
            ].map(s => (
              <div key={s.label} className="glass-card rounded-xl px-4 py-3 flex items-center gap-3">
                <span className={`font-display text-xl font-bold ${s.color}`}>{s.value}</span>
                <span className="text-xs text-slate-500">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Sessions */}
          <div className="space-y-3 stagger-child">
            {sessions.map(s => (
              <div key={s.id} className="glass-card glass-card-hover rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.mode === "Online" ? "bg-cyan-500/15" : "bg-violet-500/15"}`}>
                  {s.mode === "Online" ? <Video size={18} className="text-cyan-400" /> : <MapPin size={18} className="text-violet-400" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-200 text-sm">{s.topic}</p>
                  <p className="text-xs text-blue-400 font-medium mt-0.5">{s.studentName}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-xs text-slate-400"><CalendarDays size={11} />{s.date}</span>
                    <span className="flex items-center gap-1 text-xs text-slate-400"><Clock size={11} />{s.time}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${s.mode === "Online" ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20" : "bg-violet-500/15 text-violet-400 border border-violet-500/20"}`}>{s.mode}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {s.status === "pending" && (
                    <>
                      <button onClick={() => handleConfirm(s.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">
                        <CheckCircle2 size={12} /> Confirm
                      </button>
                      <button onClick={() => handleCancel(s.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-colors">
                        <XCircle size={12} /> Cancel
                      </button>
                    </>
                  )}
                  {s.status !== "pending" && (
                    <span className={`text-xs px-3 py-1.5 rounded-full capitalize ${s.status === "confirmed" ? "status-active" : "status-closed"}`}>{s.status}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "classes" && (
        <div className="space-y-4 animate-fade-in">
          <div className="glass-card glow-border rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="font-display font-semibold text-white text-sm">Summer 2025 Teaching Schedule</p>
              <p className="text-xs text-slate-500 mt-0.5">{facultyData.name} · {facultyData.courses.join(", ")}</p>
            </div>
            <button className="btn-primary flex items-center gap-2 text-sm">
              <Edit2 size={13} /> Update Schedule
            </button>
          </div>

          {days.map(day => {
            const dayCourses = classSchedule.filter(c => c.day === day && c.instructor === facultyData.name);
            return (
              <div key={day} className="glass-card rounded-2xl overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 bg-white/[0.03] border-b border-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <h3 className="font-display font-semibold text-sm text-white">{day}</h3>
                  {dayCourses.length === 0 && <span className="text-xs text-slate-600">No classes</span>}
                </div>
                {dayCourses.length > 0 && (
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {dayCourses.map((c, i) => (
                      <div key={i} className={`border-l-2 rounded-r-xl p-4 ${c.type === "Lab" ? "border-l-amber-500 bg-amber-500/5" : "border-l-blue-500 bg-blue-500/5"}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm text-white">{c.course}</p>
                            <p className="text-xs font-mono text-slate-500 mt-0.5">{c.code}</p>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${c.type === "Lab" ? "bg-amber-500/15 text-amber-400 border-amber-500/20" : "bg-blue-500/15 text-blue-400 border-blue-500/20"}`}>{c.type}</span>
                        </div>
                        <div className="flex gap-3 mt-3">
                          <span className="flex items-center gap-1 text-xs text-slate-400"><Clock size={11} />{c.period}</span>
                          <span className="flex items-center gap-1 text-xs text-slate-400"><MapPin size={11} />Room {c.room}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
