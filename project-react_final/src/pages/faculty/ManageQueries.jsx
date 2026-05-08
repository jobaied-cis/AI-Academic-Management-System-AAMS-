import React, { useState } from "react";
import { queries as initial } from "../../data/dummyData";
import { MessageSquare, Send, Filter, Search, CheckCircle2, Clock, XCircle, ChevronDown, ChevronUp } from "lucide-react";

const statusStyle = { pending: "status-pending", resolved: "status-active", closed: "status-closed" };
const statusIcon  = { pending: Clock, resolved: CheckCircle2, closed: XCircle };

export default function ManageQueries() {
  const [queries, setQueries] = useState(initial);
  const [filter, setFilter]   = useState("all");
  const [search, setSearch]   = useState("");
  const [expanded, setExpanded] = useState(null);
  const [responses, setResponses] = useState({});
  const [toast, setToast] = useState("");

  const filtered = queries.filter(q => {
    const matchFilter = filter === "all" || q.status === filter;
    const matchSearch = q.subject.toLowerCase().includes(search.toLowerCase()) ||
                        q.studentName.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleRespond = (id) => {
    if (!responses[id]?.trim()) return;
    setQueries(prev => prev.map(q =>
      q.id === id ? { ...q, response: responses[id], status: "resolved" } : q
    ));
    setResponses(prev => ({ ...prev, [id]: "" }));
    setExpanded(null);
    setToast("Response sent successfully.");
    setTimeout(() => setToast(""), 3000);
  };

  const handleClose = (id) => {
    setQueries(prev => prev.map(q => q.id === id ? { ...q, status: "closed" } : q));
  };

  const counts = {
    all:      queries.length,
    pending:  queries.filter(q => q.status === "pending").length,
    resolved: queries.filter(q => q.status === "resolved").length,
    closed:   queries.filter(q => q.status === "closed").length,
  };

  return (
    <div className="space-y-5">
      {toast && (
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-4 animate-slide-up">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <p className="text-sm text-emerald-400">{toast}</p>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by student or subject…" className="input-field pl-9" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(counts).map(([key, count]) => (
            <button key={key} onClick={() => setFilter(key)}
              className={`text-xs px-3 py-2 rounded-xl font-medium border capitalize transition-all flex items-center gap-1.5 ${
                filter === key ? "bg-blue-600 text-white border-blue-600" : "text-slate-400 border-white/10 hover:border-white/20"
              }`}
            >
              {key} <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === key ? "bg-white/20" : "bg-white/5"}`}>{count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Query list */}
      <div className="space-y-3 stagger-child">
        {filtered.map(q => {
          const Icon   = statusIcon[q.status] || Clock;
          const isOpen = expanded === q.id;
          return (
            <div key={q.id} className="glass-card rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-colors">
              <button
                className="w-full flex items-center gap-4 p-5 text-left"
                onClick={() => setExpanded(isOpen ? null : q.id)}
              >
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 font-display font-bold text-xs flex-shrink-0">
                  {q.studentName.split(" ").map(w => w[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-200 text-sm">{q.subject}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="text-xs text-blue-400 font-medium">{q.studentName}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-xs text-slate-500">{q.category}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-xs text-slate-500">{q.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${
                    q.priority === "high" ? "bg-rose-500/15 text-rose-400 border border-rose-500/20"
                    : q.priority === "medium" ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                    : "bg-slate-500/15 text-slate-400 border border-slate-500/20"
                  }`}>{q.priority}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${statusStyle[q.status]}`}>{q.status}</span>
                  {isOpen ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4 animate-slide-up">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Student Message</p>
                    <p className="text-sm text-slate-300 leading-relaxed bg-white/[0.03] rounded-xl p-3">{q.message}</p>
                  </div>

                  {q.response && (
                    <div>
                      <p className="text-xs font-medium text-emerald-500 uppercase tracking-wider mb-2">Your Response</p>
                      <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-3">
                        <p className="text-sm text-slate-300">{q.response}</p>
                      </div>
                    </div>
                  )}

                  {q.status === "pending" && (
                    <div>
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Your Response</p>
                      <textarea
                        value={responses[q.id] || ""}
                        onChange={e => setResponses(prev => ({ ...prev, [q.id]: e.target.value }))}
                        placeholder="Type your response…"
                        rows={3}
                        className="input-field resize-none mb-3"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => handleRespond(q.id)} className="btn-primary flex items-center gap-2 text-sm">
                          <Send size={13} /> Send Response
                        </button>
                        <button onClick={() => handleClose(q.id)} className="px-4 py-2 text-xs text-slate-400 border border-white/10 rounded-xl hover:text-rose-400 hover:border-rose-500/30 transition-all">
                          Close Without Response
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <MessageSquare size={40} className="text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500">No queries found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
