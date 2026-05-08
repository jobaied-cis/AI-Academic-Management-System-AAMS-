import React, { useEffect, useState } from "react";
import { CalendarDays, Clock, MapPin, User, BookOpen, Sparkles, Send } from "lucide-react";
import { classSchedule, examSchedule, studentData } from "../../data/dummyData";
import { useAuth } from "../../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
const SCHEDULE_ENDPOINTS = API_BASE
  ? [(studentId) => `${API_BASE}/api/ai/optimized-schedule/${studentId}`]
  : [
      (studentId) => `/api/ai/optimized-schedule/${studentId}`,
      (studentId) => `http://localhost:8080/api/ai/optimized-schedule/${studentId}`,
    ];
const SCHEDULE_ASK_ENDPOINTS = API_BASE
  ? [(studentId) => `${API_BASE}/api/ai/optimized-schedule/${studentId}/ask`]
  : [
      (studentId) => `/api/ai/optimized-schedule/${studentId}/ask`,
      (studentId) => `http://localhost:8080/api/ai/optimized-schedule/${studentId}/ask`,
    ];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
const colorByType = {
  Lecture: "border-l-blue-500 bg-blue-500/5",
  Lab: "border-l-amber-500 bg-amber-500/5",
};
const badgeByType = {
  Lecture: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Lab: "bg-amber-500/15 text-amber-400 border-amber-500/20",
};

export default function Schedule() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("class");
  const [optimizedSchedule, setOptimizedSchedule] = useState(classSchedule);
  const [dailySummary, setDailySummary] = useState([]);
  const [scheduleNote, setScheduleNote] = useState("Showing current class routine.");
  const [question, setQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const studentId = user?.id || studentData.id;

    async function loadOptimizedSchedule() {
      try {
        let data = null;
        for (const buildEndpoint of SCHEDULE_ENDPOINTS) {
          try {
            const response = await fetch(buildEndpoint(studentId));
            if (!response.ok) {
              continue;
            }
            data = await response.json();
            break;
          } catch {
            // Try the next endpoint
          }
        }

        if (data) {
          const flattened = days.flatMap((day) => data.scheduleByDay?.[day] || []);
          if (flattened.length > 0) {
            setOptimizedSchedule(flattened);
          }
          setDailySummary(data.dailySummary || []);
          setScheduleNote(
            data.conflictFree
              ? "AI optimizer found a conflict-free weekly routine."
              : "AI optimizer found timing conflicts that should be reviewed."
          );
          return;
        }
      } catch {
        // Fallback handled below
      }
      setOptimizedSchedule(classSchedule);
    }

    loadOptimizedSchedule();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="glass-card glow-border rounded-2xl p-4 md:p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center flex-shrink-0">
            <Sparkles size={18} className="text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="font-display font-semibold text-white text-sm">Schedule AI Assistant</p>
            <p className="text-xs text-slate-500 mt-1">
              Ask in Bangla or English about today&apos;s classes, day-wise routine, labs, gaps, conflicts, or exam-related schedule questions.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {[
                "আজ আমার কয়টা ক্লাস?",
                "What is my schedule on Tuesday?",
                "কোন দিনে gap বেশি?",
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
                placeholder="Ask anything about your schedule..."
                rows={2}
                className="input-field flex-1 resize-none text-sm"
              />
              <button
                onClick={async () => {
                  const studentId = user?.id || studentData.id;
                  if (!question.trim()) return;
                  setAiLoading(true);
                  try {
                    let data = null;
                    const payload = JSON.stringify({ question });

                    for (const buildEndpoint of SCHEDULE_ASK_ENDPOINTS) {
                      try {
                        const response = await fetch(buildEndpoint(studentId), {
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

                    if (!data) throw new Error("AI schedule service unavailable");
                    setAiAnswer(data.answer || "");
                  } catch {
                    setAiAnswer("Schedule AI service is unavailable right now. Check that the backend is running on port 8080, then try again.");
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

      <div className="flex gap-2 bg-space-800 p-1 rounded-xl w-fit border border-white/5">
        {[
          { id: "class", label: "Class Routine", icon: CalendarDays },
          { id: "exam", label: "Exam Schedule", icon: BookOpen },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === id ? "bg-blue-600 text-white shadow-glow-blue" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {activeTab === "class" && (
        <div className="space-y-4 stagger-child">
          <div className="glass-card glow-border rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <CalendarDays size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="font-display font-semibold text-white text-sm">Summer 2025 Class Routine</p>
              <p className="text-xs text-slate-500">B.Sc. in AI Engineering · 6th Semester · Sunday-Thursday</p>
              <p className="text-xs text-emerald-400 mt-1">{scheduleNote}</p>
            </div>
            <div className="ml-auto flex gap-4 text-center">
              <div>
                <p className="font-display text-lg font-bold text-white">
                  {optimizedSchedule.filter((course) => course.type === "Lecture").length}
                </p>
                <p className="text-xs text-slate-500">Lectures</p>
              </div>
              <div>
                <p className="font-display text-lg font-bold text-amber-400">
                  {optimizedSchedule.filter((course) => course.type === "Lab").length}
                </p>
                <p className="text-xs text-slate-500">Labs</p>
              </div>
            </div>
          </div>

          {days.map((day) => {
            const dayCourses = optimizedSchedule.filter((course) => course.day === day);
            const summary = dailySummary.find((item) => item.day === day);

            return (
              <div key={day} className="glass-card rounded-2xl overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 bg-white/[0.03] border-b border-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <h3 className="font-display font-semibold text-sm text-white">{day}</h3>
                  <span className="text-xs text-slate-600">
                    {dayCourses.length} {dayCourses.length === 1 ? "class" : "classes"}
                  </span>
                  {summary && <span className="ml-auto text-xs text-slate-500">{summary.suggestion}</span>}
                </div>
                {dayCourses.length === 0 ? (
                  <div className="px-5 py-4 text-sm text-slate-600 italic">No scheduled classes</div>
                ) : (
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {dayCourses.map((course, index) => (
                      <div
                        key={`${course.code}-${course.day}-${index}`}
                        className={`border-l-2 rounded-r-xl p-4 glass-card-hover cursor-default ${
                          colorByType[course.type] || colorByType.Lecture
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-sm text-white leading-snug">{course.course || course.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5 font-mono">{course.code}</p>
                          </div>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${
                              badgeByType[course.type] || badgeByType.Lecture
                            }`}
                          >
                            {course.type}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <Clock size={11} />
                            {course.period}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <MapPin size={11} />
                            Room {course.room}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <User size={11} />
                            {course.instructor}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "exam" && (
        <div className="space-y-4 stagger-child">
          {["Midterm", "Final"].map((examType) => {
            const exams = examSchedule.filter((exam) => exam.type === examType);
            return (
              <div key={examType} className="glass-card rounded-2xl overflow-hidden">
                <div
                  className={`px-5 py-3 border-b border-white/5 flex items-center gap-3 ${
                    examType === "Midterm" ? "bg-amber-500/5" : "bg-rose-500/5"
                  }`}
                >
                  <BookOpen size={15} className={examType === "Midterm" ? "text-amber-400" : "text-rose-400"} />
                  <h3 className="font-display font-semibold text-sm text-white">{examType} Examinations</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Course</th>
                        <th>Code</th>
                        <th>Time</th>
                        <th>Room</th>
                        <th>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exams.map((exam, index) => (
                        <tr key={index}>
                          <td className="font-mono text-blue-400 font-medium">{exam.date}</td>
                          <td className="text-slate-200">{exam.course}</td>
                          <td className="font-mono text-slate-400 text-xs">{exam.code}</td>
                          <td className="text-slate-300">{exam.time}</td>
                          <td className="text-slate-400">{exam.room}</td>
                          <td>
                            <span className="status-pending text-xs px-2 py-0.5 rounded-full">{exam.duration}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
