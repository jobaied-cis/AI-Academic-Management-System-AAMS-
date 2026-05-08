import React, { useState } from "react";
import { MessageSquare, Plus, Clock, CheckCircle2, XCircle, Send, ChevronDown, ChevronUp } from "lucide-react";
import { queries as initialQueries, studentData } from "../../data/dummyData";

const categories = ["Course Selection", "Graduation", "Academic Records", "Scheduling", "Advising", "Financial", "Other"];

const statusStyle = {
  pending:  "status-pending",
  resolved: "status-active",
  closed:   "status-closed",
};
const statusIcon = {
  pending:  Clock,
  resolved: CheckCircle2,
  closed:   XCircle,
};

export default function Queries() {
  const [queries, setQueries]   = useState(initialQueries.filter(q => q.studentId === studentData.id));
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [form, setForm]         = useState({ subject: "", category: "", priority: "medium", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newQuery = {
      id: queries.length + 100,
      studentId: studentData.id,
      studentName: studentData.name,
      ...form,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      response: null,
    };
    setQueries(prev => [newQuery, ...prev]);
    setForm({ subject: "", category: "", priority: "medium", message: "" });
    setShowForm(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm">Track and manage your academic queries</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus size={15} />
          New Query
        </button>
      </div>

      {/* Success banner */}
      {submitted && (
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-4 animate-slide-up">
          <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
          <p className="text-sm text-emerald-400">Query submitted successfully! You'll receive a response within 2–3 business days.</p>
        </div>
      )}

      {/* New query form */}
      {showForm && (
        <div className="glass-card glow-border rounded-2xl p-6 animate-slide-up">
          <h3 className="font-display font-semibold text-white mb-5 flex items-center gap-2">
            <MessageSquare size={16} className="text-blue-400" />
            Submit New Query
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1.5">Subject *</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                  placeholder="Brief subject of your query"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1.5">Category *</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="input-field"
                  required
                >
                  <option value="">Select category…</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1.5">Priority</label>
              <div className="flex gap-2">
                {["low", "medium", "high"].map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, priority: p }))}
                    className={`px-4 py-2 rounded-xl text-xs font-medium border capitalize transition-all ${
                      form.priority === p
                        ? p === "high" ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
                          : p === "medium" ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                          : "bg-slate-500/20 text-slate-300 border-slate-500/40"
                        : "text-slate-500 border-white/10 hover:border-white/20"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1.5">Message *</label>
              <textarea
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="Describe your query in detail…"
                rows={4}
                className="input-field resize-none"
                required
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-xl border border-white/10 hover:border-white/20 transition-all">
                Cancel
              </button>
              <button type="submit" className="btn-primary flex items-center gap-2 text-sm">
                <Send size={14} /> Submit Query
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="flex gap-3 flex-wrap">
        {[
          { label: "Total",    value: queries.length,                                 color: "text-white"       },
          { label: "Pending",  value: queries.filter(q => q.status === "pending").length,  color: "text-amber-400"   },
          { label: "Resolved", value: queries.filter(q => q.status === "resolved").length, color: "text-emerald-400" },
          { label: "Closed",   value: queries.filter(q => q.status === "closed").length,   color: "text-slate-400"   },
        ].map(s => (
          <div key={s.label} className="glass-card rounded-xl px-4 py-3 flex items-center gap-3">
            <span className={`font-display text-xl font-bold ${s.color}`}>{s.value}</span>
            <span className="text-xs text-slate-500">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Queries list */}
      <div className="space-y-3 stagger-child">
        {queries.map(q => {
          const StatusIcon = statusIcon[q.status] || Clock;
          const isOpen     = expanded === q.id;
          return (
            <div key={q.id} className="glass-card rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-colors">
              <button
                className="w-full flex items-center gap-4 p-5 text-left"
                onClick={() => setExpanded(isOpen ? null : q.id)}
              >
                <StatusIcon size={16} className={q.status === "resolved" ? "text-emerald-400" : q.status === "closed" ? "text-slate-500" : "text-amber-400"} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-200 text-sm leading-snug">{q.subject}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="text-xs text-slate-500">{q.date}</span>
                    <span className="text-xs text-slate-600">·</span>
                    <span className="text-xs text-slate-500">{q.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${statusStyle[q.status]}`}>{q.status}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${
                    q.priority === "high" ? "bg-rose-500/15 text-rose-400 border-rose-500/20"
                    : q.priority === "medium" ? "bg-amber-500/15 text-amber-400 border-amber-500/20"
                    : "bg-slate-500/15 text-slate-400 border-slate-500/20"
                  }`}>{q.priority}</span>
                  {isOpen ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 space-y-3 border-t border-white/5 pt-4 animate-slide-up">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Your Message</p>
                    <p className="text-sm text-slate-300 leading-relaxed bg-white/[0.03] rounded-xl p-3">{q.message}</p>
                  </div>
                  {q.response && (
                    <div>
                      <p className="text-xs font-medium text-emerald-500 uppercase tracking-wider mb-2">Faculty Response</p>
                      <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-3">
                        <p className="text-sm text-slate-300 leading-relaxed">{q.response}</p>
                      </div>
                    </div>
                  )}
                  {!q.response && q.status === "pending" && (
                    <p className="text-xs text-slate-600 italic flex items-center gap-1.5">
                      <Clock size={11} /> Awaiting faculty response…
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
