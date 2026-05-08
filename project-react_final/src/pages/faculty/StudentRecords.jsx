import React, { useState } from "react";
import { studentRecords } from "../../data/dummyData";
import { Users, Search, Filter, AlertTriangle, TrendingUp, Eye, MessageSquare } from "lucide-react";

const standingColor = {
  Good:       "status-active",
  Warning:    "status-pending",
  Probation:  "status-closed",
  graduating: "status-info",
};

export default function StudentRecords() {
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = studentRecords.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                        s.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all"
      || (filter === "good"      && s.standing === "Good")
      || (filter === "warning"   && (s.standing === "Warning" || s.standing === "Probation"))
      || (filter === "graduating"&& s.status === "graduating");
    return matchSearch && matchFilter;
  });

  const sel = studentRecords.find(s => s.id === selected);

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Students",   value: studentRecords.length,                               color: "text-white"       },
          { label: "Good Standing",    value: studentRecords.filter(s => s.standing === "Good").length, color: "text-emerald-400" },
          { label: "Warnings/Probation",value: studentRecords.filter(s => s.warnings > 0).length,  color: "text-amber-400"   },
          { label: "Graduating",       value: studentRecords.filter(s => s.status === "graduating").length, color: "text-blue-400" },
        ].map(s => (
          <div key={s.label} className="glass-card rounded-2xl p-4 text-center">
            <p className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or ID…" className="input-field pl-9" />
        </div>
        <div className="flex gap-2">
          {[
            { id: "all",       label: "All"       },
            { id: "good",      label: "Good"      },
            { id: "warning",   label: "At Risk"   },
            { id: "graduating",label: "Graduating"},
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`text-xs px-3 py-2 rounded-xl font-medium border transition-all ${
                filter === f.id ? "bg-blue-600 text-white border-blue-600" : "text-slate-400 border-white/10 hover:border-white/20"
              }`}
            >{f.label}</button>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        {/* Table */}
        <div className={`glass-card rounded-2xl overflow-hidden transition-all duration-300 ${sel ? "flex-1" : "w-full"}`}>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>ID</th>
                  <th>Semester</th>
                  <th>CGPA</th>
                  <th>Credits</th>
                  <th>Standing</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id} className={selected === s.id ? "bg-blue-500/5" : ""}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-display ${
                          s.cgpa >= 3.5 ? "bg-emerald-500/15 text-emerald-400" :
                          s.cgpa >= 2.5 ? "bg-amber-500/15 text-amber-400" : "bg-rose-500/15 text-rose-400"
                        }`}>{s.name.split(" ").map(w => w[0]).join("")}</div>
                        <span className="text-slate-200 font-medium text-sm">{s.name}</span>
                      </div>
                    </td>
                    <td className="font-mono text-xs text-slate-500">{s.id}</td>
                    <td className="text-slate-400">{s.semester}</td>
                    <td>
                      <span className={`font-display font-bold text-sm ${
                        s.cgpa >= 3.75 ? "text-emerald-400" : s.cgpa >= 3.0 ? "text-blue-400" : s.cgpa >= 2.5 ? "text-amber-400" : "text-rose-400"
                      }`}>{s.cgpa}</span>
                    </td>
                    <td className="text-slate-400">{s.credits}</td>
                    <td>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${standingColor[s.standing]}`}>{s.standing}</span>
                      {s.warnings > 0 && (
                        <span className="ml-1 text-xs bg-rose-500/15 text-rose-400 border border-rose-500/20 px-1.5 py-0.5 rounded-full">{s.warnings}W</span>
                      )}
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button onClick={() => setSelected(selected === s.id ? null : s.id)}
                          className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center hover:bg-blue-500/20 transition-colors">
                          <Eye size={12} />
                        </button>
                        <button className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center hover:bg-amber-500/20 transition-colors">
                          <MessageSquare size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail panel */}
        {sel && (
          <div className="w-72 flex-shrink-0 animate-slide-in-left">
            <div className="glass-card glow-border rounded-2xl p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-display font-bold mb-3">
                    {sel.name.split(" ").map(w => w[0]).join("")}
                  </div>
                  <h3 className="font-display font-bold text-white">{sel.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{sel.id}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-slate-600 hover:text-slate-300 text-lg leading-none">×</button>
              </div>

              {[
                { label: "CGPA",     value: sel.cgpa,     color: sel.cgpa >= 3.5 ? "text-emerald-400" : sel.cgpa >= 2.5 ? "text-amber-400" : "text-rose-400" },
                { label: "Semester", value: sel.semester, color: "text-white" },
                { label: "Credits",  value: sel.credits,  color: "text-cyan-400" },
                { label: "Standing", value: sel.standing, color: sel.standing === "Good" ? "text-emerald-400" : "text-amber-400" },
                { label: "Warnings", value: sel.warnings, color: sel.warnings > 0 ? "text-rose-400" : "text-emerald-400" },
                { label: "Advisor",  value: sel.advisor,  color: "text-slate-300" },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-xs text-slate-500">{row.label}</span>
                  <span className={`text-sm font-medium ${row.color}`}>{row.value}</span>
                </div>
              ))}

              <div className="pt-2 flex flex-col gap-2">
                <button className="btn-primary text-xs py-2 flex items-center justify-center gap-2">
                  <MessageSquare size={13} /> Send Message
                </button>
                {sel.warnings > 0 && (
                  <button className="text-xs py-2 rounded-xl flex items-center justify-center gap-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/15 transition-colors">
                    <AlertTriangle size={13} /> Issue Academic Warning
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
