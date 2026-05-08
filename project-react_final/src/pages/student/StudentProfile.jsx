import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { studentData, academicProgress, advisingSessions, facultyData } from "../../data/dummyData";
import {
  User, Mail, BookOpen, Award, GraduationCap, Edit2,
  CheckCircle2, Phone, MapPin, Calendar, Shield, Save, X
} from "lucide-react";

export default function StudentProfile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved]     = useState(false);
  const [profile, setProfile] = useState({
    phone:    "+880-1700-123456",
    address:  "House 12, Road 4, Mirpur, Dhaka",
    dob:      "2002-05-15",
    linkedin: "linkedin.com/in/akash-rahman",
    github:   "github.com/akashrahman",
    bio:      "AI Engineering student passionate about machine learning, NLP, and building intelligent systems. Class Representative and Organizing Secretary of CIS Club.",
  });
  const [draft, setDraft] = useState({ ...profile });

  const completedCredits = studentData.credits_completed;
  const totalCredits     = studentData.credits_total;
  const progressPct      = Math.round((completedCredits / totalCredits) * 100);

  const handleSave = () => {
    setProfile({ ...draft });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => { setDraft({ ...profile }); setEditing(false); };

  return (
    <div className="space-y-5 stagger-child">
      {saved && (
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-4 animate-slide-up">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <p className="text-sm text-emerald-400">Profile updated successfully!</p>
        </div>
      )}

      {/* Profile hero */}
      <div className="glass-card glow-border rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent pointer-events-none" />
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-blue-500/8 rounded-full blur-3xl" />
        <div className="relative flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-display font-bold text-3xl shadow-glow-blue">
              {user?.name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-space-900" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="font-display text-2xl font-bold text-white">{user?.name}</h2>
                <p className="text-slate-400 text-sm mt-0.5">{studentData.program}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="status-info text-xs px-2.5 py-1 rounded-full">{studentData.id}</span>
                  <span className="status-active text-xs px-2.5 py-1 rounded-full">{studentData.standing}</span>
                  <span className="text-xs bg-violet-500/15 text-violet-400 border border-violet-500/20 px-2.5 py-1 rounded-full">
                    Batch {studentData.batch}
                  </span>
                  <span className="text-xs bg-amber-500/15 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full">
                    {studentData.semester} Semester
                  </span>
                </div>
              </div>
              <button
                onClick={() => editing ? handleCancel() : setEditing(true)}
                className={`flex items-center gap-2 text-sm px-4 py-2 rounded-xl border transition-all ${
                  editing
                    ? "text-slate-400 border-white/10 hover:border-white/20 hover:text-white"
                    : "btn-primary"
                }`}
              >
                {editing ? <><X size={14} /> Cancel</> : <><Edit2 size={14} /> Edit Profile</>}
              </button>
            </div>

            {/* Bio */}
            <div className="mt-4">
              {editing ? (
                <textarea
                  value={draft.bio}
                  onChange={e => setDraft(d => ({ ...d, bio: e.target.value }))}
                  className="input-field resize-none text-sm"
                  rows={3}
                />
              ) : (
                <p className="text-slate-400 text-sm leading-relaxed">{profile.bio}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "CGPA",              value: studentData.cgpa,                     color: "text-blue-400",    icon: Award          },
          { label: "Credits Completed", value: `${completedCredits}/${totalCredits}`, color: "text-cyan-400",    icon: BookOpen       },
          { label: "Courses Done",      value: academicProgress.courses.filter(c => c.status === "completed").length, color: "text-emerald-400", icon: CheckCircle2 },
          { label: "Sessions Booked",   value: advisingSessions.filter(s => s.studentName === studentData.name).length, color: "text-violet-400", icon: Calendar },
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
        {/* Contact & Personal Info */}
        <div className="lg:col-span-2 space-y-5">
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-display font-semibold text-white text-sm mb-4 flex items-center gap-2">
              <User size={15} className="text-blue-400" /> Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Full Name",   value: user?.name,           icon: User,         field: null,       editable: false },
                { label: "Email",       value: user?.email,          icon: Mail,         field: null,       editable: false },
                { label: "Phone",       value: draft.phone,          icon: Phone,        field: "phone",    editable: true  },
                { label: "Date of Birth", value: draft.dob,          icon: Calendar,     field: "dob",      editable: true  },
                { label: "Address",     value: draft.address,        icon: MapPin,       field: "address",  editable: true, span: true },
              ].map(item => (
                <div key={item.label} className={item.span ? "md:col-span-2" : ""}>
                  <label className="text-xs text-slate-500 flex items-center gap-1.5 mb-1.5">
                    <item.icon size={11} /> {item.label}
                  </label>
                  {editing && item.editable ? (
                    <input
                      type={item.field === "dob" ? "date" : "text"}
                      value={item.value}
                      onChange={e => setDraft(d => ({ ...d, [item.field]: e.target.value }))}
                      className="input-field text-sm"
                    />
                  ) : (
                    <p className="text-sm text-slate-200 bg-white/[0.03] rounded-xl px-3 py-2.5 border border-white/5">
                      {item.field === "dob" ? profile.dob : (item.field ? profile[item.field] : item.value)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Online Presence */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-display font-semibold text-white text-sm mb-4 flex items-center gap-2">
              <Shield size={15} className="text-cyan-400" /> Online Presence
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "LinkedIn",  field: "linkedin", prefix: "https://" },
                { label: "GitHub",    field: "github",   prefix: "https://" },
              ].map(item => (
                <div key={item.label}>
                  <label className="text-xs text-slate-500 block mb-1.5">{item.label}</label>
                  {editing ? (
                    <input
                      type="text"
                      value={draft[item.field]}
                      onChange={e => setDraft(d => ({ ...d, [item.field]: e.target.value }))}
                      className="input-field text-sm"
                    />
                  ) : (
                    <p className="text-sm text-blue-400 bg-white/[0.03] rounded-xl px-3 py-2.5 border border-white/5 truncate">
                      {profile[item.field]}
                    </p>
                  )}
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

        {/* Academic Info */}
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-display font-semibold text-white text-sm mb-4 flex items-center gap-2">
              <GraduationCap size={15} className="text-violet-400" /> Academic Details
            </h3>
            <div className="space-y-3">
              {[
                { label: "Department",    value: studentData.department    },
                { label: "Program",       value: "B.Sc. AI Engineering"    },
                { label: "Semester",      value: studentData.semester      },
                { label: "Batch",         value: studentData.batch         },
                { label: "Advisor",       value: facultyData.name          },
                { label: "Credits Done",  value: `${completedCredits} / ${totalCredits}` },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-xs text-slate-500">{row.label}</span>
                  <span className="text-xs font-medium text-slate-200 text-right max-w-[55%] leading-snug">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Graduation progress */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-display font-semibold text-white text-sm mb-3">Graduation Progress</h3>
            <div className="flex items-end justify-between mb-2">
              <span className="text-xs text-slate-500">Credits</span>
              <span className="font-display text-xl font-bold text-white">{progressPct}%</span>
            </div>
            <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden mb-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>{completedCredits} done</span>
              <span>{totalCredits - completedCredits} remaining</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
