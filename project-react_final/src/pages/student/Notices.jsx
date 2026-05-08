import React, { useEffect, useMemo, useState } from "react";
import { Bell, Search, AlertCircle, Calendar, Megaphone, BookOpen, Wrench, Users, Sparkles, Send } from "lucide-react";
import { notices } from "../../data/dummyData";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
const SMART_NOTICE_ENDPOINTS = API_BASE
  ? [`${API_BASE}/api/ai/smart-notices`]
  : ["/api/ai/smart-notices", "http://localhost:8080/api/ai/smart-notices"];
const NOTICE_ASK_ENDPOINTS = API_BASE
  ? [`${API_BASE}/api/ai/smart-notices/ask`]
  : ["/api/ai/smart-notices/ask", "http://localhost:8080/api/ai/smart-notices/ask"];
const categoryIcon = {
  Exam: { icon: BookOpen, color: "text-rose-400", bg: "bg-rose-500/10" },
  Registration: { icon: Wrench, color: "text-amber-400", bg: "bg-amber-500/10" },
  Event: { icon: Users, color: "text-violet-400", bg: "bg-violet-500/10" },
  Academic: { icon: BookOpen, color: "text-blue-400", bg: "bg-blue-500/10" },
  Workshop: { icon: Megaphone, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  Urgent: { icon: AlertCircle, color: "text-amber-300", bg: "bg-amber-500/10" },
};

const priorityStyle = {
  high: "bg-rose-500/15 text-rose-400 border-rose-500/25",
  medium: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  low: "bg-slate-500/15 text-slate-400 border-slate-500/25",
};

export default function Notices() {
  const [smartNotices, setSmartNotices] = useState(notices);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const [question, setQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    async function loadSmartNotices() {
      try {
        let data = null;
        for (const endpoint of SMART_NOTICE_ENDPOINTS) {
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

        if (Array.isArray(data.notices) && data.notices.length > 0) {
          setSmartNotices(data.notices);
          return;
        }
      } catch {
        // Fallback handled below
      }
      setSmartNotices(notices);
    }

    loadSmartNotices();
  }, []);

  const categories = useMemo(() => {
    const values = smartNotices.map((notice) => notice.aiCategory || notice.category);
    return ["All", ...new Set(values)];
  }, [smartNotices]);

  const filtered = smartNotices.filter((notice) => {
    const matchSearch = notice.title.toLowerCase().includes(search.toLowerCase()) ||
      notice.content.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" || (notice.aiCategory || notice.category) === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-5">
      <div className="glass-card glow-border rounded-2xl p-4 md:p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center flex-shrink-0">
            <Sparkles size={18} className="text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="font-display font-semibold text-white text-sm">Notice AI Assistant</p>
            <p className="text-xs text-slate-500 mt-1">
              Ask in Bangla or English about urgent notices, exam notices, registration deadlines, or what action you should take.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {[
                "সবচেয়ে জরুরি notice কোনটা?",
                "What should I do for registration notices?",
                "Exam notice gulo summarize koro",
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setQuestion(prompt)}
                  className="text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 hover:bg-blue-500/20 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask anything about notices..."
                rows={2}
                className="input-field flex-1 resize-none text-sm"
              />
              <button
                onClick={async () => {
                  if (!question.trim()) return;
                  setAiLoading(true);
                  try {
                    let data = null;
                    const payload = JSON.stringify({ question });

                    for (const endpoint of NOTICE_ASK_ENDPOINTS) {
                      try {
                        const response = await fetch(endpoint, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: payload,
                        });
                        if (!response.ok) {
                          continue;
                        }
                        data = await response.json();
                        break;
                      } catch {
                        // Try the next endpoint
                      }
                    }

                    if (!data) throw new Error("AI notice service unavailable");
                    setAiAnswer(data.answer || "");
                  } catch {
                    setAiAnswer("Notice AI service is unavailable right now. Check that the backend is running on port 8080, then try again.");
                  } finally {
                    setAiLoading(false);
                  }
                }}
                disabled={aiLoading || !question.trim()}
                className="btn-primary w-11 h-11 rounded-xl flex items-center justify-center p-0 flex-shrink-0 disabled:opacity-40 self-end"
              >
                <Send size={15} />
              </button>
            </div>
            {aiAnswer && (
              <div className="mt-4 bg-blue-500/8 border border-blue-500/15 rounded-xl p-4">
                <p className="text-xs text-blue-400 font-medium mb-2">AI Answer</p>
                <p className="text-sm text-slate-300 leading-relaxed">{aiAnswer}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search notices..."
            className="input-field pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`text-xs px-3 py-2 rounded-xl font-medium border transition-all ${
                category === item
                  ? "bg-blue-600 text-white border-blue-600"
                  : "text-slate-400 border-white/10 hover:border-white/20 hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        {[
          { label: "Total", value: smartNotices.length, color: "text-white" },
          { label: "High Priority", value: smartNotices.filter((notice) => (notice.aiPriority || notice.priority) === "high").length, color: "text-rose-400" },
          { label: "Urgent", value: smartNotices.filter((notice) => (notice.urgencyScore || 0) >= 70).length, color: "text-emerald-400" },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl px-4 py-3 flex items-center gap-3">
            <span className={`font-display text-xl font-bold ${stat.color}`}>{stat.value}</span>
            <span className="text-xs text-slate-500">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-child">
        {filtered.map((notice) => {
          const displayCategory = notice.aiCategory || notice.category;
          const displayPriority = notice.aiPriority || notice.priority;
          const categoryMeta = categoryIcon[displayCategory] || { icon: Bell, color: "text-blue-400", bg: "bg-blue-500/10" };
          const Icon = categoryMeta.icon;
          const isSelected = selected === notice.id;

          return (
            <div
              key={notice.id}
              onClick={() => setSelected(isSelected ? null : notice.id)}
              className={`glass-card glass-card-hover rounded-2xl p-5 cursor-pointer transition-all duration-300 ${
                isSelected ? "border border-blue-500/30 ring-1 ring-blue-500/15" : "border border-white/5"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${categoryMeta.bg}`}>
                  <Icon size={18} className={categoryMeta.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap">
                    <h3 className="font-display font-semibold text-white text-sm leading-snug flex-1">{notice.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${priorityStyle[displayPriority] || priorityStyle.low}`}>
                      {displayPriority}
                    </span>
                    {notice.urgencyBadge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
                        {notice.urgencyBadge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Calendar size={10} />
                      {notice.date}
                    </span>
                    <span className="text-xs text-slate-600">{notice.author}</span>
                    <span className={`text-xs ${categoryMeta.color}`}>{displayCategory}</span>
                    {typeof notice.urgencyScore === "number" && (
                      <span className="text-xs text-slate-500">Urgency {notice.urgencyScore}</span>
                    )}
                  </div>

                  <p className={`text-sm text-slate-400 mt-3 leading-relaxed transition-all duration-300 ${isSelected ? "" : "line-clamp-2"}`}>
                    {notice.content}
                  </p>

                  {notice.recommendedAction && (
                    <p className="text-xs text-blue-300 mt-3">Recommended action: {notice.recommendedAction}</p>
                  )}

                  {!isSelected && (
                    <button className="text-xs text-blue-400 mt-2 hover:text-blue-300">Read more -&gt;</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Bell size={40} className="text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500">No notices found for your search.</p>
        </div>
      )}
    </div>
  );
}
