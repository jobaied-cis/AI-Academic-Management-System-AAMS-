import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { documents } from "../data/dummyData";
import {
  FileText, Download, Eye, Search, Upload, Award,
  FilePlus, FileSearch, Filter, CheckCircle2
} from "lucide-react";

const categoryColors = {
  Registration:  { bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-blue-500/20"    },
  Academic:      { bg: "bg-cyan-500/10",     text: "text-cyan-400",    border: "border-cyan-500/20"    },
  Certificate:   { bg: "bg-amber-500/10",    text: "text-amber-400",   border: "border-amber-500/20"   },
  Administrative:{ bg: "bg-violet-500/10",   text: "text-violet-400",  border: "border-violet-500/20"  },
  Course:        { bg: "bg-emerald-500/10",  text: "text-emerald-400", border: "border-emerald-500/20" },
};

const typeIcon = { form: FilePlus, certificate: Award, document: FileSearch };

export default function Documents() {
  const { user } = useAuth();
  const isFaculty = user?.role === "faculty";
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("All");
  const [requested, setRequested] = useState([]);
  const [toast, setToast]       = useState("");

  const categories = ["All", ...new Set(documents.map(d => d.category))];

  const filtered = documents.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = category === "All" || d.category === category;
    return matchSearch && matchCat;
  });

  const handleAction = (doc) => {
    setRequested(prev => [...prev, doc.id]);
    const msg = doc.type === "certificate"
      ? `Certificate request submitted for "${doc.name}"`
      : `"${doc.name}" is being prepared for download`;
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  return (
    <div className="space-y-5">
      {/* Banner */}
      <div className="glass-card glow-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h3 className="font-display font-bold text-white">
            {isFaculty ? "Document Management" : "Academic Documents"}
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            {isFaculty
              ? "Upload, manage, and track all department documents and student forms."
              : "Download forms, request certificates, and access academic documents."}
          </p>
        </div>
        <div className="flex gap-3">
          <div className="glass-card rounded-xl px-4 py-3 text-center">
            <p className="font-display text-xl font-bold text-white">{documents.length}</p>
            <p className="text-xs text-slate-500">Documents</p>
          </div>
          {isFaculty && (
            <button className="btn-primary flex items-center gap-2 text-sm whitespace-nowrap">
              <Upload size={14} /> Upload Document
            </button>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-4 animate-slide-up">
          <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
          <p className="text-sm text-emerald-400">{toast}</p>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text" value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search documents…" className="input-field pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`text-xs px-3 py-2 rounded-xl font-medium border transition-all ${
                category === cat ? "bg-blue-600 text-white border-blue-600" : "text-slate-400 border-white/10 hover:border-white/20"
              }`}
            >{cat}</button>
          ))}
        </div>
      </div>

      {/* Document grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-child">
        {filtered.map(doc => {
          const cat  = categoryColors[doc.category] || categoryColors.Academic;
          const Icon = typeIcon[doc.type] || FileText;
          const isDone = requested.includes(doc.id);

          return (
            <div key={doc.id} className="glass-card glass-card-hover rounded-2xl p-5 flex flex-col gap-4 border border-white/5">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cat.bg}`}>
                  <Icon size={18} className={cat.text} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 leading-snug">{doc.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${cat.bg} ${cat.text} ${cat.border}`}>
                      {doc.category}
                    </span>
                    <span className="text-xs text-slate-600 capitalize">{doc.type}</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-600">Updated: {doc.lastUpdated}</div>

              <div className="flex gap-2 mt-auto">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-slate-400 border border-white/10 hover:border-white/20 hover:text-slate-200 transition-all">
                  <Eye size={13} /> Preview
                </button>
                <button
                  onClick={() => handleAction(doc)}
                  disabled={isDone}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    isDone
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "btn-primary"
                  }`}
                >
                  {isDone ? (
                    <><CheckCircle2 size={13} /> Done</>
                  ) : doc.type === "certificate" ? (
                    <><Award size={13} /> Request</>
                  ) : (
                    <><Download size={13} /> Download</>
                  )}
                </button>
              </div>

              {isFaculty && (
                <div className="flex gap-2 border-t border-white/5 pt-3">
                  <button className="flex-1 text-xs text-amber-400 hover:text-amber-300 transition-colors">Edit</button>
                  <button className="flex-1 text-xs text-rose-400 hover:text-rose-300 transition-colors">Remove</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
