import React, { useState } from "react";
import { studentData, academicProgress } from "../../data/dummyData";
import {
  Sparkles, Brain, TrendingUp, BookOpen, Target,
  ChevronRight, Zap, Star, AlertCircle, CheckCircle2,
  BarChart2, Lightbulb, ArrowRight, RefreshCw
} from "lucide-react";

const recommendations = [
  {
    id: 1,
    type: "course",
    priority: "high",
    icon: BookOpen,
    color: "blue",
    title: "Enroll in Machine Learning Elective",
    reason: "Based on your AI Fundamentals score (A+) and CGPA of 3.94, you're well-positioned to take advanced ML coursework next semester.",
    action: "View CSE 4301 — Machine Learning",
    tags: ["Career Alignment", "Prerequisite Met", "High Priority"],
    confidence: 94,
  },
  {
    id: 2,
    type: "career",
    priority: "high",
    icon: Target,
    color: "cyan",
    title: "Start Research Internship Preparation",
    reason: "Students with your GPA profile typically succeed in research internships. FAU Erlangen-Nürnberg accepts research interns with strong AI coursework.",
    action: "Explore Research Opportunities",
    tags: ["Graduate School Prep", "International", "AI Research"],
    confidence: 89,
  },
  {
    id: 3,
    type: "skill",
    priority: "medium",
    icon: Zap,
    color: "amber",
    title: "Strengthen Python & PyTorch Skills",
    reason: "Your current coursework is Java-heavy. Top AI Engineering roles and graduate programs strongly prefer Python proficiency with ML frameworks.",
    action: "Browse Recommended Resources",
    tags: ["Skill Gap", "Industry Demand", "Self-Study"],
    confidence: 87,
  },
  {
    id: 4,
    type: "academic",
    priority: "medium",
    icon: Star,
    color: "violet",
    title: "Join the CIS Research Group",
    reason: "Faculty research participation boosts graduate school applications. Dr. Islam's NLP lab has openings for high-performing undergraduates.",
    action: "Learn About Research Labs",
    tags: ["Graduate School", "NLP", "Faculty Opportunity"],
    confidence: 82,
  },
  {
    id: 5,
    type: "warning",
    priority: "low",
    icon: AlertCircle,
    color: "rose",
    title: "Monitor Accounting Grade",
    reason: "Accounting has the lowest projected performance among your current courses. Consider visiting tutoring services to maintain your CGPA target.",
    action: "Book Tutoring Session",
    tags: ["Grade Alert", "Preventive", "GPA Protection"],
    confidence: 78,
  },
  {
    id: 6,
    type: "planning",
    priority: "low",
    icon: TrendingUp,
    color: "emerald",
    title: "Plan 7th & 8th Semester Courses",
    reason: "You have 66 credits remaining. Strategic course selection can align your final semesters with your graduate school application timeline.",
    action: "View Course Planner",
    tags: ["Long-term Planning", "Graduation", "Optimization"],
    confidence: 75,
  },
];

const pathSuggestions = [
  { label: "AI/ML Research Track",     match: 96, courses: ["Deep Learning", "NLP", "Computer Vision", "Research Thesis"], color: "from-blue-500/20 to-cyan-500/10",   border: "border-blue-500/25"   },
  { label: "Software Engineering Track", match: 81, courses: ["System Design", "Cloud Computing", "Backend Dev", "Capstone"], color: "from-violet-500/20 to-blue-500/10", border: "border-violet-500/25" },
  { label: "Data Science Track",        match: 74, courses: ["Statistics", "Data Mining", "Big Data", "Analytics Project"], color: "from-amber-500/20 to-orange-500/10", border: "border-amber-500/25"  },
];

const colorMap = {
  blue:    { bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-blue-500/20",    badge: "bg-blue-500/15 text-blue-400 border-blue-500/20"    },
  cyan:    { bg: "bg-cyan-500/10",    text: "text-cyan-400",    border: "border-cyan-500/20",    badge: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20"    },
  amber:   { bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/20",   badge: "bg-amber-500/15 text-amber-400 border-amber-500/20"   },
  violet:  { bg: "bg-violet-500/10",  text: "text-violet-400",  border: "border-violet-500/20",  badge: "bg-violet-500/15 text-violet-400 border-violet-500/20"  },
  rose:    { bg: "bg-rose-500/10",    text: "text-rose-400",    border: "border-rose-500/20",    badge: "bg-rose-500/15 text-rose-400 border-rose-500/20"    },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
};

export default function AIRecommendations() {
  const [dismissed, setDismissed] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = ["all", "course", "career", "skill", "academic", "warning", "planning"];

  const visible = recommendations.filter(r =>
    !dismissed.includes(r.id) &&
    (activeFilter === "all" || r.type === activeFilter)
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 1200));
    setRefreshing(false);
  };

  return (
    <div className="space-y-6 stagger-child">
      {/* AI banner */}
      <div className="glass-card glow-border rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-violet-600/5 to-transparent pointer-events-none" />
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-glow-blue">
              <Brain size={24} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={13} className="text-blue-400 animate-pulse" />
                <span className="text-xs text-blue-400 font-medium uppercase tracking-wider">AI-Powered Engine</span>
              </div>
              <h2 className="font-display text-xl font-bold text-white">Personalized Recommendations</h2>
              <p className="text-slate-400 text-sm mt-0.5">
                Tailored for <span className="text-white font-medium">{studentData.name}</span> based on academic profile, CGPA trends, and career goals.
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all flex-shrink-0"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Analyzing…" : "Refresh"}
          </button>
        </div>

        {/* Profile snapshot */}
        <div className="relative mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "CGPA",            value: studentData.cgpa,    color: "text-blue-400"    },
            { label: "Semester",        value: studentData.semester, color: "text-cyan-400"    },
            { label: "Credits Done",    value: studentData.credits_completed, color: "text-emerald-400" },
            { label: "Recommendations", value: visible.length,       color: "text-violet-400"  },
          ].map(s => (
            <div key={s.label} className="glass-card rounded-xl p-3 text-center">
              <p className={`font-display text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Academic Path Suggestions */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="font-display font-semibold text-white text-sm mb-4 flex items-center gap-2">
          <Lightbulb size={15} className="text-amber-400" /> Recommended Academic Paths
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pathSuggestions.map((path, i) => (
            <div key={path.label} className={`rounded-2xl p-4 bg-gradient-to-br ${path.color} border ${path.border} glass-card-hover cursor-pointer`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-300">{path.label}</span>
                {i === 0 && <span className="text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">Best Match</span>}
              </div>
              <div className="mb-3">
                <div className="flex items-end justify-between mb-1">
                  <span className="text-xs text-slate-500">Match Score</span>
                  <span className="font-display font-bold text-white text-lg">{path.match}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: `${path.match}%` }} />
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {path.courses.map(c => (
                  <span key={c} className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">{c}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`text-xs px-3 py-2 rounded-xl font-medium border capitalize transition-all ${
              activeFilter === f ? "bg-blue-600 text-white border-blue-600" : "text-slate-400 border-white/10 hover:border-white/20"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Recommendation cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-child">
        {visible.map(rec => {
          const c = colorMap[rec.color];
          return (
            <div key={rec.id} className={`glass-card glass-card-hover rounded-2xl p-5 border ${c.border} relative overflow-hidden`}>
              <div className={`absolute top-0 right-0 w-24 h-24 ${c.bg} rounded-full blur-2xl pointer-events-none opacity-40`} />
              <div className="relative">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${c.bg}`}>
                      <rec.icon size={17} className={c.text} />
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-white text-sm leading-snug">{rec.title}</h4>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full border capitalize ${
                        rec.priority === "high" ? "bg-rose-500/15 text-rose-400 border-rose-500/20"
                        : rec.priority === "medium" ? "bg-amber-500/15 text-amber-400 border-amber-500/20"
                        : "bg-slate-500/15 text-slate-400 border-slate-500/20"
                      }`}>{rec.priority} priority</span>
                    </div>
                  </div>
                  {/* Confidence */}
                  <div className="text-center flex-shrink-0">
                    <p className={`font-display text-lg font-bold ${c.text}`}>{rec.confidence}%</p>
                    <p className="text-[10px] text-slate-600">confidence</p>
                  </div>
                </div>

                <p className="text-sm text-slate-400 leading-relaxed mb-3">{rec.reason}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {rec.tags.map(tag => (
                    <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-full border ${c.badge}`}>{tag}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <button className={`flex items-center gap-1.5 text-xs font-medium ${c.text} hover:underline`}>
                    {rec.action} <ArrowRight size={12} />
                  </button>
                  <button
                    onClick={() => setDismissed(prev => [...prev, rec.id])}
                    className="text-xs text-slate-600 hover:text-slate-400 transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {visible.length === 0 && (
        <div className="text-center py-16">
          <CheckCircle2 size={40} className="text-emerald-400 mx-auto mb-3" />
          <p className="text-white font-display font-semibold mb-1">You're all caught up!</p>
          <p className="text-slate-500 text-sm">No recommendations for this filter. Click Refresh for new insights.</p>
        </div>
      )}
    </div>
  );
}
