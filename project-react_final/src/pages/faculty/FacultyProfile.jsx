import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { facultyData, studentRecords, advisingSessions, queries } from "../../data/dummyData";
import {
  User, Mail, BookOpen, Award, Edit2, CheckCircle2,
  Phone, MapPin, Clock, Save, X, Layers, Users
} from "lucide-react";

export default function FacultyProfile() {
  const { user }  = useAuth();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved]     = useState(false);
  const [profile, setProfile] = useState({
    phone:      "+880-2-9138707",
    address:    "Daffodil Smart City, Birulia, Savar, Dhaka",
    officeHours: "Sun–Tue: 2PM–4PM",
    room:       "AB-5-401",
    bio:        "Associate Professor specializing in Machine Learning and Natural Language Processing. 10+ years of academic and research experience. Advisor to 35+ undergraduate students in the AI Engineering program.",
    linkedin:   "linkedin.com/in/farhana-islam",
    researchgate: "researchgate.net/profile/Farhana-Islam",
  });
  const [draft, setDraft] = useState({ ...profile });

  const handleSave = () => { setProfile({ ...draft }); setEditing(false); setSaved(true); setTimeout(() => setSaved(false), 3000); };
  const handleCancel = () => { setDraft({ ...profile }); setEditing(false); };

  const myStudents   = studentRecords.filter(s => s.advisor === facultyData.name);
  const mySessions   = advisingSessions.filter(s => s.advisor === facultyData.name);
  const myQueries    = queries.filter(q => q.status === "resolved").length;
  const atRisk       = myStudents.filter(s => s.cgpa < 3.0 || s.warnings > 0).length;

  return (
    <div className="space-y-5 stagger-child">
      {saved && (
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-4 animate-slide-up">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <p className="text-sm text-emerald-400">Profile updated successfully!</p>
        </div>
      )}

      {/* Hero */}
      <div className="glass-card glow-border rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-transparent pointer-events-none" />
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-violet-500/8 rounded-full blur-3xl" />
        <div className="relative flex flex-col md:flex-row gap-6 items-start">
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white font-display font-bold text-3xl shadow-glow-cyan">
              {user?.name?.split(" ").slice(-2).map(w => w[0]).join("").toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-space-900" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="font-display text-2xl font-bold text-white">{user?.name}</h2>
                <p className="text-slate-400 text-sm mt-0.5">{facultyData.designation} · {facultyData.department}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="status-info text-xs px-2.5 py-1 rounded-full">{facultyData.id}</span>
                  <span className="text-xs bg-violet-500/15 text-violet-400 border border-violet-500/20 px-2.5 py-1 rounded-full">{facultyData.specialization}</span>
                </div>
              </div>
              <button
                onClick={() => editing ? handleCancel() : setEditing(true)}
                className={`flex items-center gap-2 text-sm px-4 py-2 rounded-xl border transition-all ${editing ? "text-slate-400 border-white/10 hover:border-white/20 hover:text-white" : "btn-primary"}`}
              >
                {editing ? <><X size={14} /> Cancel</> : <><Edit2 size={14} /> Edit Profile</>}
              </button>
            </div>
            <div className="mt-4">
              {editing
                ? <textarea value={draft.bio} onChange={e => setDraft(d => ({ ...d, bio: e.target.value }))} className="input-field resize-none text-sm" rows={3} />
                : <p className="text-slate-400 text-sm leading-relaxed">{profile.bio}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Students Advised", value: myStudents.length,              color: "text-blue-400",    icon: Users    },
          { label: "Sessions Held",    value: mySessions.length,              color: "text-cyan-400",    icon: Clock    },
          { label: "Queries Resolved", value: myQueries,                      color: "text-emerald-400", icon: CheckCircle2 },
          { label: "At-Risk Students", value: atRisk,                         color: atRisk > 0 ? "text-rose-400" : "text-emerald-400", icon: Award },
        ].map(s => (
          <div key={s.label} className="glass-card rounded-2xl p-5 flex flex-col gap-3">
            <s.icon size={18} className={s.color} />
            <div>
              <p className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Contact */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-display font-semibold text-white text-sm mb-4 flex items-center gap-2">
              <User size={15} className="text-blue-400" /> Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Full Name",    value: user?.name,        icon: User,    field: null,    editable: false },
                { label: "Email",        value: user?.email,       icon: Mail,    field: null,    editable: false },
                { label: "Phone",        value: draft.phone,       icon: Phone,   field: "phone", editable: true  },
                { label: "Office Room",  value: draft.room,        icon: MapPin,  field: "room",  editable: true  },
                { label: "Office Hours", value: draft.officeHours, icon: Clock,   field: "officeHours", editable: true },
                { label: "Address",      value: draft.address,     icon: MapPin,  field: "address", editable: true, span: true },
              ].map(item => (
                <div key={item.label} className={item.span ? "md:col-span-2" : ""}>
                  <label className="text-xs text-slate-500 flex items-center gap-1.5 mb-1.5">
                    <item.icon size={11} /> {item.label}
                  </label>
                  {editing && item.editable
                    ? <input type="text" value={item.value} onChange={e => setDraft(d => ({ ...d, [item.field]: e.target.value }))} className="input-field text-sm" />
                    : <p className="text-sm text-slate-200 bg-white/[0.03] rounded-xl px-3 py-2.5 border border-white/5">{item.field ? profile[item.field] : item.value}</p>
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Research & Links */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-display font-semibold text-white text-sm mb-4 flex items-center gap-2">
              <Layers size={15} className="text-cyan-400" /> Research & Online Profiles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "LinkedIn",       field: "linkedin"     },
                { label: "ResearchGate",   field: "researchgate" },
              ].map(item => (
                <div key={item.label}>
                  <label className="text-xs text-slate-500 block mb-1.5">{item.label}</label>
                  {editing
                    ? <input type="text" value={draft[item.field]} onChange={e => setDraft(d => ({ ...d, [item.field]: e.target.value }))} className="input-field text-sm" />
                    : <p className="text-sm text-blue-400 bg-white/[0.03] rounded-xl px-3 py-2.5 border border-white/5 truncate">{profile[item.field]}</p>
                  }
                </div>
              ))}
            </div>
            {editing && (
              <div className="flex justify-end mt-4 pt-4 border-t border-white/5">
                <button onClick={handleSave} className="btn-primary flex items-center gap-2 text-sm">
                  <Save size={14} /> Save Changes
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Academic info */}
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-display font-semibold text-white text-sm mb-4 flex items-center gap-2">
              <BookOpen size={15} className="text-violet-400" /> Academic Details
            </h3>
            <div className="space-y-3">
              {[
                { label: "Department",      value: facultyData.department     },
                { label: "Designation",     value: facultyData.designation    },
                { label: "Specialization",  value: facultyData.specialization },
                { label: "Courses (Current)", value: facultyData.courses.join(", ") },
                { label: "Employee ID",     value: facultyData.id             },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-start py-2 border-b border-white/5 last:border-0 gap-3">
                  <span className="text-xs text-slate-500 flex-shrink-0">{row.label}</span>
                  <span className="text-xs font-medium text-slate-200 text-right leading-snug">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-display font-semibold text-white text-sm mb-3">Student Breakdown</h3>
            {[
              { label: "Good Standing",  value: myStudents.filter(s => s.cgpa >= 3.5).length,   color: "bg-emerald-400" },
              { label: "Average",        value: myStudents.filter(s => s.cgpa >= 2.5 && s.cgpa < 3.5).length, color: "bg-amber-400" },
              { label: "At Risk",        value: myStudents.filter(s => s.cgpa < 2.5).length,    color: "bg-rose-400"    },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-3 py-2">
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${b.color}`} />
                <span className="text-xs text-slate-400 flex-1">{b.label}</span>
                <span className="text-sm font-bold font-display text-white">{b.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
