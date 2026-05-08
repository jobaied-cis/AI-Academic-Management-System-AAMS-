import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Cpu, Eye, EyeOff, GraduationCap, BookOpen, ArrowRight, Sparkles } from "lucide-react";
import { studentData, facultyData } from "../data/dummyData";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export default function Login() {
  const [role, setRole] = useState("student");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  const { login } = useAuth();
  const navigate = useNavigate();

  const credentials = {
    student: { email: "akash@diu.edu.bd", password: "student123", data: studentData },
    faculty: { email: "farhana@diu.edu.bd", password: "faculty123", data: facultyData },
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const credential = credentials[role];

    if (form.email === credential.email && form.password === credential.password) {
      login(role, credential.data);
      navigate(role === "student" ? "/student/dashboard" : "/faculty/dashboard");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, email: form.email, password: form.password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const payload = await response.json();
      login(role, payload.user);
      navigate(role === "student" ? "/student/dashboard" : "/faculty/dashboard");
    } catch (err) {
      setError(err instanceof Error && err.message !== "Invalid credentials"
        ? "Cannot reach the server. Start the backend or check VITE_API_BASE_URL."
        : "Invalid credentials. Use the hint below.");
    } finally {
      setLoading(false);
    }
  };

  const hint = credentials[role];

  return (
    <div className="min-h-screen bg-space-900 bg-grid flex overflow-hidden relative">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-glow-blue">
            <Cpu size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-white text-lg leading-none">AAMS</h1>
            <p className="text-xs text-slate-500">AI Academic Management System</p>
          </div>
        </div>

        <div className="max-w-md">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
            <Sparkles size={13} className="text-blue-400" />
            <span className="text-xs text-blue-400 font-medium">Welcome to AAMS</span>
          </div>
          <h2 className="font-display text-4xl font-bold text-white leading-tight mb-4">
            Smart Department
            <br />
            Experience,
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Powered by AI.</span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            AAMS brings schedules, notices, progress tracking, advising, and student support into one clean AI-enabled academic platform.
          </p>

          <div className="flex flex-wrap gap-2 mt-8">
            {["AI Chatbot", "Smart Schedule", "Notice Intelligence", "Progress Tracking"].map((feature) => (
              <span
                key={feature}
                className="text-xs bg-white/[0.05] border border-white/10 text-slate-400 rounded-full px-3 py-1.5"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          {[
            { label: "Active Students", value: "4,200+" },
            { label: "Faculty Members", value: "180+" },
            { label: "Queries Resolved", value: "98%" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-4 flex-1">
              <p className="font-display text-xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-[460px] flex items-center justify-center p-6 lg:p-12 bg-space-800/50 border-l border-white/5">
        <div className="w-full max-w-sm animate-slide-up">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <Cpu size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-white">AAMS</h1>
              <p className="text-[11px] text-slate-500">AI Academic Management System</p>
            </div>
          </div>

          <h3 className="font-display text-2xl font-bold text-white mb-1">Sign in to AAMS</h3>
          <p className="text-sm text-slate-500 mb-8">Access your AI-enabled academic department portal</p>

          <div className="flex gap-2 bg-space-900 p-1 rounded-xl mb-6 border border-white/5">
            {[
              { id: "student", label: "Student", Icon: GraduationCap },
              { id: "faculty", label: "Faculty", Icon: BookOpen },
            ].map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setRole(id);
                  setError("");
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  role === id ? "bg-blue-600 text-white shadow-glow-blue" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1.5">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                placeholder={hint.email}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  placeholder="********"
                  className="input-field pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">
                <p className="text-xs text-rose-400">{error}</p>
              </div>
            )}

            <div className="bg-blue-500/8 border border-blue-500/15 rounded-xl p-3">
              <p className="text-xs text-blue-400 font-medium mb-1">Demo Credentials</p>
              <p className="text-xs text-slate-500">
                Email: <span className="text-slate-400 font-mono">{hint.email}</span>
              </p>
              <p className="text-xs text-slate-500">
                Password: <span className="text-slate-400 font-mono">{role === "student" ? "student123" : "faculty123"}</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 mt-6">
            Daffodil International University · CIS Department
          </p>
        </div>
      </div>
    </div>
  );
}
