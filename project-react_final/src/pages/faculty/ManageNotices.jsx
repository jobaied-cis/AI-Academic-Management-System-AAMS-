import React, { useState } from "react";
import { notices as initial } from "../../data/dummyData";
import { Bell, Plus, Edit2, Trash2, CheckCircle2, Search, Send, Sparkles } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
const DRAFT_ENDPOINTS = API_BASE
  ? [`${API_BASE}/api/ai/notice-drafts`]
  : ["/api/ai/notice-drafts", "http://localhost:8080/api/ai/notice-drafts"];

const categories = ["Exam", "Registration", "Event", "Academic", "Workshop", "Administrative", "Other"];
const priorityStyle = {
  high:   "bg-rose-500/15 text-rose-400 border-rose-500/25",
  medium: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  low:    "bg-slate-500/15 text-slate-400 border-slate-500/25",
};

export default function ManageNotices() {
  const [notices, setNotices] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch]   = useState("");
  const [toast, setToast]     = useState("");
  const [editId, setEditId]   = useState(null);
  const [form, setForm] = useState({ title: "", category: "", priority: "medium", content: "", author: "Dr. Farhana Islam" });
  const [drafts, setDrafts] = useState([]);
  const [draftLoading, setDraftLoading] = useState(false);

  const filtered = notices.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId !== null) {
      setNotices(prev => prev.map(n => n.id === editId ? { ...n, ...form } : n));
      setToast("Notice updated successfully.");
      setEditId(null);
    } else {
      const newNotice = { id: Date.now(), ...form, date: new Date().toISOString().split("T")[0] };
      setNotices(prev => [newNotice, ...prev]);
      setToast("Notice published successfully.");
    }
    setForm({ title: "", category: "", priority: "medium", content: "", author: "Dr. Farhana Islam" });
    setShowForm(false);
    setTimeout(() => setToast(""), 3000);
  };

  const handleEdit = (n) => {
    setForm({ title: n.title, category: n.category, priority: n.priority, content: n.content, author: n.author });
    setEditId(n.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    setNotices(prev => prev.filter(n => n.id !== id));
    setToast("Notice deleted.");
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-slate-400 text-sm">Create, edit and manage department notices</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              setDraftLoading(true);
              try {
                let data = null;
                for (const endpoint of DRAFT_ENDPOINTS) {
                  try {
                    const response = await fetch(endpoint);
                    if (!response.ok) {
                      continue;
                    }
                    data = await response.json();
                    break;
                  } catch {
                    // Try the next endpoint
                  }
                }

                if (!data) throw new Error("Draft service unavailable");
                setDrafts(Array.isArray(data.drafts) ? data.drafts : []);
                setToast("AI notice drafts generated.");
              } catch {
                setToast("Could not generate AI notice drafts right now.");
              } finally {
                setDraftLoading(false);
                setTimeout(() => setToast(""), 3000);
              }
            }}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400 hover:bg-blue-500/15 transition-all"
          >
            <Sparkles size={15} /> {draftLoading ? "Generating..." : "AI Drafts"}
          </button>
          <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ title: "", category: "", priority: "medium", content: "", author: "Dr. Farhana Islam" }); }}
            className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={15} /> New Notice
          </button>
        </div>
      </div>

      {drafts.length > 0 && (
        <div className="glass-card glow-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={15} className="text-blue-400" />
            <h3 className="font-display font-semibold text-white text-sm">AI Notice Draft Suggestions</h3>
          </div>
          <div className="space-y-3">
            {drafts.map((draft, index) => (
              <div key={`${draft.title}-${index}`} className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">{draft.title}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {draft.category} · {draft.priority} · {draft.author}
                    </p>
                    <p className="text-sm text-slate-400 mt-2 leading-relaxed">{draft.content}</p>
                  </div>
                  <button
                    onClick={() => {
                      setForm({
                        title: draft.title,
                        category: draft.category,
                        priority: draft.priority,
                        content: draft.content,
                        author: draft.author,
                      });
                      setEditId(null);
                      setShowForm(true);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-xs px-3 py-2 rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all flex-shrink-0"
                  >
                    Use Draft
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {toast && (
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-4 animate-slide-up">
          <CheckCircle2 size={16} className="text-emerald-400" /><p className="text-sm text-emerald-400">{toast}</p>
        </div>
      )}

      {showForm && (
        <div className="glass-card glow-border rounded-2xl p-6 animate-slide-up">
          <h3 className="font-display font-semibold text-white mb-5 flex items-center gap-2">
            <Bell size={16} className="text-blue-400" />
            {editId ? "Edit Notice" : "Publish New Notice"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1.5">Title *</label>
              <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Notice title" className="input-field" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1.5">Category *</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input-field" required>
                  <option value="">Select…</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1.5">Priority</label>
                <div className="flex gap-2">
                  {["low", "medium", "high"].map(p => (
                    <button key={p} type="button" onClick={() => setForm(f => ({ ...f, priority: p }))}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium border capitalize transition-all ${
                        form.priority === p
                          ? p === "high" ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
                            : p === "medium" ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                            : "bg-slate-500/20 text-slate-300 border-slate-500/40"
                          : "text-slate-500 border-white/10"
                      }`}
                    >{p}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1.5">Author</label>
                <input type="text" value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} className="input-field" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1.5">Content *</label>
              <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                placeholder="Write the full notice content…" rows={4} className="input-field resize-none" required />
            </div>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-xl border border-white/10 hover:border-white/20 transition-all">Cancel</button>
              <button type="submit" className="btn-primary flex items-center gap-2 text-sm">
                <Send size={13} /> {editId ? "Update Notice" : "Publish Notice"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search notices…" className="input-field pl-9" />
      </div>

      {/* Notice list */}
      <div className="space-y-3 stagger-child">
        {filtered.map(n => (
          <div key={n.id} className="glass-card rounded-2xl p-5 flex gap-4 border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 flex-wrap">
                <h3 className="font-display font-semibold text-white text-sm flex-1 leading-snug">{n.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${priorityStyle[n.priority]}`}>{n.priority}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{n.date} · {n.author} · <span className="text-blue-400">{n.category}</span></p>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed line-clamp-2">{n.content}</p>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              <button onClick={() => handleEdit(n)} className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center hover:bg-blue-500/20 transition-colors">
                <Edit2 size={13} />
              </button>
              <button onClick={() => handleDelete(n.id)} className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center hover:bg-rose-500/20 transition-colors">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
