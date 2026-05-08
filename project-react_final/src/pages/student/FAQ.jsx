import React, { useEffect, useRef, useState } from "react";
import { faqs } from "../../data/dummyData";
import { useAuth } from "../../context/AuthContext";
import { Sparkles, Send, User, ThumbsUp, ChevronDown, ChevronUp, Search, HelpCircle } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
const CHAT_ENDPOINTS = API_BASE
  ? [`${API_BASE}/api/ai/chat`]
  : ["/api/ai/chat", "http://localhost:8080/api/ai/chat"];
const categories = ["All", ...new Set(faqs.map((f) => f.category))];

export default function FAQ() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("faq");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi! I can answer general academic questions about registration, CGPA, graduation, exams, schedules, documents, payments, advising, and more. Ask naturally.",
      time: "just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const filteredFaqs = faqs.filter((f) => {
    const matchCategory = category === "All" || f.category === category;
    const matchSearch = f.question.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages((current) => [...current, { role: "user", text: userMsg, time: "just now" }]);
    setInput("");
    setTyping(true);

    try {
      const payload = JSON.stringify({
        question: user?.name ? `${userMsg}\nStudent: ${user.name}` : userMsg,
      });

      let data = null;
      let lastError = null;

      for (const endpoint of CHAT_ENDPOINTS) {
        try {
          const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload,
          });

          if (!response.ok) {
            lastError = new Error(`Chat service unavailable (${response.status})`);
            continue;
          }

          data = await response.json();
          break;
        } catch (error) {
          lastError = error;
        }
      }

      if (!data) {
        throw lastError || new Error("Chat service unavailable");
      }

      setMessages((current) => [...current, { role: "ai", text: data.answer, time: "just now" }]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "ai",
          text: "I could not reach the AI chat service right now. Check that the backend is running on port 8080, then try again.",
          time: "just now",
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const quickPrompts = [
    "What is my current CGPA and graduation progress?",
    "How does course registration work?",
    "Who is my advisor and when are office hours?",
    "What should I know about exams and payments?",
  ];

  return (
    <div className="space-y-5">
      <div className="flex gap-2 bg-space-800 p-1 rounded-xl w-fit border border-white/5">
        {[
          { id: "faq", label: "FAQ Library", icon: HelpCircle },
          { id: "chatbot", label: "AI Advisor", icon: Sparkles },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === id ? "bg-blue-600 text-white shadow-glow-blue" : "text-slate-400 hover:text-white"
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {activeTab === "faq" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search FAQs..."
                className="input-field pl-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-xs px-3 py-2 rounded-xl font-medium border transition-all ${
                    category === cat
                      ? "bg-blue-600 text-white border-blue-600"
                      : "text-slate-400 border-white/10 hover:border-white/20"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 stagger-child">
            {filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="glass-card rounded-2xl overflow-hidden border border-white/5 hover:border-blue-500/20 transition-colors"
              >
                <button
                  className="w-full flex items-center gap-4 p-5 text-left"
                  onClick={() => setExpanded(expanded === faq.id ? null : faq.id)}
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <HelpCircle size={15} className="text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-200">{faq.question}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-600">{faq.category}</span>
                      <span className="flex items-center gap-1 text-xs text-slate-600">
                        <ThumbsUp size={10} /> {faq.helpful} found helpful
                      </span>
                    </div>
                  </div>
                  {expanded === faq.id ? (
                    <ChevronUp size={15} className="text-slate-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown size={15} className="text-slate-500 flex-shrink-0" />
                  )}
                </button>
                {expanded === faq.id && (
                  <div className="px-5 pb-5 pt-0 animate-slide-up">
                    <div className="ml-12 bg-blue-500/5 border border-blue-500/15 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={12} className="text-blue-400" />
                        <span className="text-xs text-blue-400 font-medium">AI-assisted answer</span>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "chatbot" && (
        <div className="animate-fade-in">
          <div className="glass-card glow-border rounded-2xl overflow-hidden flex flex-col" style={{ height: "560px" }}>
            <div className="px-5 py-4 border-b border-white/5 bg-gradient-to-r from-blue-600/10 to-transparent flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <p className="font-display font-semibold text-white text-sm">AAMS AI Advisor</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-emerald-400">Online · Broader academic support</span>
                </div>
              </div>
            </div>

            <div ref={chatRef} className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""} animate-slide-up`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      msg.role === "ai"
                        ? "bg-gradient-to-br from-blue-500 to-cyan-400"
                        : "bg-gradient-to-br from-violet-500 to-blue-600"
                    }`}
                  >
                    {msg.role === "ai" ? (
                      <Sparkles size={14} className="text-white" />
                    ) : (
                      <User size={14} className="text-white" />
                    )}
                  </div>
                  <div className={`max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === "ai"
                          ? "bg-white/[0.05] border border-white/[0.08] text-slate-200 rounded-tl-sm"
                          : "bg-blue-600 text-white rounded-tr-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-600 px-1">{msg.time}</span>
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex gap-3 animate-slide-up">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                    <Sparkles size={14} className="text-white" />
                  </div>
                  <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                    {[0, 0.15, 0.3].map((delay, index) => (
                      <span
                        key={index}
                        className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${delay}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-5 py-2 flex gap-2 overflow-x-auto border-t border-white/5">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  className="text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 whitespace-nowrap hover:bg-blue-500/20 transition-colors flex-shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="px-4 py-4 border-t border-white/5 flex gap-2">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask any academic question..."
                rows={1}
                className="input-field flex-1 resize-none text-sm"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="btn-primary w-10 h-10 rounded-xl flex items-center justify-center p-0 flex-shrink-0 disabled:opacity-40"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
