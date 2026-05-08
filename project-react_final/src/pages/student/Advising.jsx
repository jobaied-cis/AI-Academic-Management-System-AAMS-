import React, { useState } from "react";
import { UserCheck, Calendar, Clock, Video, MapPin, Plus, CheckCircle2 } from "lucide-react";
import { advisingSessions as initial, studentData, facultyData } from "../../data/dummyData";

const topics = [
  "Course Selection", "Graduation Checklist", "Academic Warnings",
  "Research Guidance", "Internship Guidance", "Thesis/Project Discussion", "Other",
];

export default function Advising() {
  const [sessions, setSessions] = useState(initial.filter(s => s.studentName === studentData.name));
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ date: "", time: "", topic: "", mode: "In-person", notes: "" });

  const handleBook = (e) => {
    e.preventDefault();
    const newSession = {
      id: sessions.length + 100,
      studentName: studentData.name,
      advisor: facultyData.name,
      ...form,
      status: "pending",
    };
    setSessions(prev => [newSession, ...prev]);
    setForm({ date: "", time: "", topic: "", mode: "In-person", notes: "" });
    setShowForm(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const statusStyle = {
    confirmed: "status-active",
    pending:   "status-pending",
    cancelled: "status-closed",
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-slate-400 text-sm">Schedule one-on-one sessions with your academic advisor</p>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={15} /> Book Session
        </button>
      </div>

      {submitted && (
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-4 animate-slide-up">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <p className="text-sm text-emerald-400">Session request sent! Your advisor will confirm within 24 hours.</p>
        </div>
      )}

      {/* Advisor info */}
      <div className="glass-card glow-border rounded-2xl p-5 flex flex-col sm:flex-row gap-5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white font-display font-bold text-xl flex-shrink-0">
          {facultyData.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
        </div>
        <div className="flex-1">
          <p className="font-display font-bold text-white">{facultyData.name}</p>
          <p className="text-sm text-slate-400">{facultyData.designation} · {facultyData.department}</p>
          <p className="text-xs text-slate-500 mt-1">{facultyData.specialization}</p>
          <div className="flex flex-wrap gap-3 mt-3">
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><Clock size={12} />{facultyData.officeHours}</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><MapPin size={12} />Room {facultyData.room}</span>
          </div>
        </div>
        <div className="text-center">
          <p className="font-display text-2xl font-bold text-emerald-400">{sessions.filter(s => s.status === "confirmed").length}</p>
          <p className="text-xs text-slate-500">Sessions Done</p>
        </div>
      </div>

      {/* Booking form */}
      {showForm && (
        <div className="glass-card glow-border rounded-2xl p-6 animate-slide-up">
          <h3 className="font-display font-semibold text-white mb-5 flex items-center gap-2">
            <Calendar size={16} className="text-blue-400" /> Book New Session
          </h3>
          <form onSubmit={handleBook} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1.5">Preferred Date *</label>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="input-field" required />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1.5">Preferred Time *</label>
                <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} className="input-field" required />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1.5">Topic *</label>
              <select value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} className="input-field" required>
                <option value="">Select a topic…</option>
                {topics.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1.5">Mode</label>
              <div className="flex gap-3">
                {[
                  { id: "In-person", icon: MapPin  },
                  { id: "Online",    icon: Video    },
                ].map(({ id, icon: Icon }) => (
                  <button
                    key={id} type="button"
                    onClick={() => setForm(f => ({ ...f, mode: id }))}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                      form.mode === id
                        ? "bg-blue-600 text-white border-blue-600"
                        : "text-slate-400 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <Icon size={14} /> {id}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1.5">Additional Notes</label>
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any specific points you'd like to discuss…" rows={3} className="input-field resize-none" />
            </div>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-xl border border-white/10 hover:border-white/20 transition-all">Cancel</button>
              <button type="submit" className="btn-primary text-sm">Confirm Booking</button>
            </div>
          </form>
        </div>
      )}

      {/* Sessions list */}
      <div className="space-y-3 stagger-child">
        <h3 className="font-display font-semibold text-white text-sm">My Sessions</h3>
        {sessions.map(s => (
          <div key={s.id} className="glass-card glass-card-hover rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.mode === "Online" ? "bg-cyan-500/15" : "bg-violet-500/15"}`}>
              {s.mode === "Online" ? <Video size={18} className="text-cyan-400" /> : <MapPin size={18} className="text-violet-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-200 text-sm">{s.topic}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.advisor}</p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="flex items-center gap-1 text-xs text-slate-400"><Calendar size={11} />{s.date}</span>
                <span className="flex items-center gap-1 text-xs text-slate-400"><Clock size={11} />{s.time}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${s.mode === "Online" ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20" : "bg-violet-500/15 text-violet-400 border border-violet-500/20"}`}>{s.mode}</span>
              </div>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full capitalize flex-shrink-0 ${statusStyle[s.status]}`}>{s.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
