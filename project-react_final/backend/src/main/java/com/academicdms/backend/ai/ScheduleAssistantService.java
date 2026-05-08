package com.academicdms.backend.ai;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class ScheduleAssistantService {

    private final ScheduleOptimizerService scheduleOptimizerService;

    public ScheduleAssistantService(ScheduleOptimizerService scheduleOptimizerService) {
        this.scheduleOptimizerService = scheduleOptimizerService;
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> ask(String studentId, String question) {
        boolean bangla = containsBangla(question);
        String normalized = normalize(question);
        Optional<Map<String, Object>> optimized = scheduleOptimizerService.optimize(studentId);
        if (optimized.isEmpty()) {
            return Map.of(
                    "question", question,
                    "matchedTopic", "missing-student",
                    "answer", bangla ? "স্টুডেন্ট schedule data পাওয়া যায়নি।" : "Student schedule data was not found.");
        }

        Map<String, Object> schedule = optimized.get();
        Map<String, List<Map<String, Object>>> scheduleByDay =
                (Map<String, List<Map<String, Object>>>) schedule.getOrDefault("scheduleByDay", Map.of());
        List<Map<String, Object>> dailySummary = (List<Map<String, Object>>) schedule.getOrDefault("dailySummary", List.of());

        String targetDay = detectDay(normalized);
        String topic = detectTopic(normalized, targetDay);
        String answer = switch (topic) {
            case "today" -> todayAnswer(scheduleByDay, bangla);
            case "day" -> dayAnswer(targetDay, scheduleByDay, bangla);
            case "exam" -> examAnswer(bangla);
            case "lab" -> labAnswer(scheduleByDay, bangla);
            case "conflict" -> conflictAnswer(schedule, dailySummary, bangla);
            default -> weeklyAnswer(scheduleByDay, bangla);
        };

        return Map.of(
                "question", question,
                "matchedTopic", topic,
                "answer", answer,
                "suggestedFollowUps", bangla
                        ? List.of("আজ আমার কয়টা ক্লাস?", "কোন দিনে gap বেশি?")
                        : List.of("How many classes do I have today?", "Which day has the longest gaps?"));
    }

    private String todayAnswer(Map<String, List<Map<String, Object>>> scheduleByDay, boolean bangla) {
        String day = mapDayOfWeek(LocalDate.now().getDayOfWeek());
        return dayAnswer(day, scheduleByDay, bangla);
    }

    private String dayAnswer(String day, Map<String, List<Map<String, Object>>> scheduleByDay, boolean bangla) {
        if (day == null || day.isBlank()) {
            return weeklyAnswer(scheduleByDay, bangla);
        }
        List<Map<String, Object>> items = scheduleByDay.getOrDefault(day, List.of());
        if (items.isEmpty()) {
            return bangla
                    ? day + " এ কোনো scheduled class নেই। এই সময়টা self-study বা assignment-এর জন্য use করতে পারো।"
                    : "There are no scheduled classes on " + day + ". You can use the day for self-study or assignments.";
        }

        List<String> courseLines = new ArrayList<>();
        for (Map<String, Object> item : items) {
            courseLines.add(item.get("code") + " " + item.get("period") + " room " + item.get("room"));
        }
        if (bangla) {
            return day + " এর routine হলো: " + String.join(", ", courseLines)
                    + ". মোট " + items.size() + "টা class আছে।";
        }
        return "Your schedule for " + day + " is: " + String.join(", ", courseLines)
                + ". Total classes: " + items.size() + ".";
    }

    private String examAnswer(boolean bangla) {
        return bangla
                ? "Exam schedule exam tab-এ আছে। Exam question করলে date, time, room, আর course code আগে check করা উচিত।"
                : "Exam schedules are shown in the exam tab. For exams, focus on date, time, room, and course code first.";
    }

    private String labAnswer(Map<String, List<Map<String, Object>>> scheduleByDay, boolean bangla) {
        int labCount = 0;
        List<String> labDays = new ArrayList<>();
        for (Map.Entry<String, List<Map<String, Object>>> entry : scheduleByDay.entrySet()) {
            boolean hasLab = false;
            for (Map<String, Object> item : entry.getValue()) {
                if ("Lab".equalsIgnoreCase(String.valueOf(item.get("type")))) {
                    labCount++;
                    hasLab = true;
                }
            }
            if (hasLab) {
                labDays.add(entry.getKey());
            }
        }
        if (bangla) {
            return "তোমার weekly routine-এ মোট " + labCount + "টা lab class আছে। Lab থাকা দিনগুলো হলো: "
                    + (labDays.isEmpty() ? "কোনো দিন নেই" : String.join(", ", labDays)) + "।";
        }
        return "You have " + labCount + " lab classes in the current weekly routine. Lab days: "
                + (labDays.isEmpty() ? "none" : String.join(", ", labDays)) + ".";
    }

    private String conflictAnswer(Map<String, Object> schedule, List<Map<String, Object>> dailySummary, boolean bangla) {
        boolean conflictFree = Boolean.TRUE.equals(schedule.get("conflictFree"));
        List<String> longGapDays = new ArrayList<>();
        for (Map<String, Object> item : dailySummary) {
            Object idle = item.get("idleMinutes");
            if (idle instanceof Number number && number.intValue() > 90) {
                longGapDays.add(String.valueOf(item.get("day")));
            }
        }
        if (bangla) {
            return conflictFree
                    ? "বর্তমান optimized schedule conflict-free। Long gap থাকা দিনগুলো হলো "
                            + (longGapDays.isEmpty() ? "বিশেষ কোনো দিন নেই" : String.join(", ", longGapDays)) + "।"
                    : "বর্তমান schedule-এ timing conflict বা long gap আছে। বিশেষভাবে review করা উচিত: "
                            + (longGapDays.isEmpty() ? "daily summary" : String.join(", ", longGapDays)) + "।";
        }
        return conflictFree
                ? "The current optimized schedule is conflict-free. Days with longer gaps: "
                        + (longGapDays.isEmpty() ? "none in particular" : String.join(", ", longGapDays)) + "."
                : "The current schedule has timing conflicts or long gaps. Review these days first: "
                        + (longGapDays.isEmpty() ? "the daily summary" : String.join(", ", longGapDays)) + ".";
    }

    private String weeklyAnswer(Map<String, List<Map<String, Object>>> scheduleByDay, boolean bangla) {
        int totalClasses = scheduleByDay.values().stream().mapToInt(List::size).sum();
        String busiestDay = "";
        int busiestCount = -1;
        for (Map.Entry<String, List<Map<String, Object>>> entry : scheduleByDay.entrySet()) {
            if (entry.getValue().size() > busiestCount) {
                busiestCount = entry.getValue().size();
                busiestDay = entry.getKey();
            }
        }
        if (bangla) {
            return "তোমার weekly class routine-এ মোট " + totalClasses + "টা class আছে। সবচেয়ে busy দিন হলো "
                    + busiestDay + " (" + busiestCount + "টা class)। Day-wise routine, আজকের class, lab, gap, বা conflict নিয়ে আরও প্রশ্ন করতে পারো।";
        }
        return "Your weekly routine has " + totalClasses + " classes in total. The busiest day is "
                + busiestDay + " with " + busiestCount + " classes. You can ask about day-wise routine, today's classes, labs, gaps, or conflicts.";
    }

    private String detectDay(String normalized) {
        if (containsAny(normalized, "today", "আজ")) {
            return mapDayOfWeek(LocalDate.now().getDayOfWeek());
        }
        if (containsAny(normalized, "sunday", "রবিবার")) return "Sunday";
        if (containsAny(normalized, "monday", "সোমবার")) return "Monday";
        if (containsAny(normalized, "tuesday", "মঙ্গলবার")) return "Tuesday";
        if (containsAny(normalized, "wednesday", "বুধবার")) return "Wednesday";
        if (containsAny(normalized, "thursday", "বৃহস্পতিবার")) return "Thursday";
        if (containsAny(normalized, "friday", "শুক্রবার")) return "Friday";
        if (containsAny(normalized, "saturday", "শনিবার")) return "Saturday";
        return null;
    }

    private String detectTopic(String normalized, String targetDay) {
        if (containsAny(normalized, "today", "আজ")) return "today";
        if (targetDay != null) return "day";
        if (containsAny(normalized, "exam", "পরীক্ষা", "midterm", "final")) return "exam";
        if (containsAny(normalized, "lab", "ল্যাব")) return "lab";
        if (containsAny(normalized, "conflict", "gap", "overloaded", "free", "clash", "গ্যাপ", "balanced")) return "conflict";
        return "weekly";
    }

    private String mapDayOfWeek(DayOfWeek dayOfWeek) {
        return switch (dayOfWeek) {
            case SUNDAY -> "Sunday";
            case MONDAY -> "Monday";
            case TUESDAY -> "Tuesday";
            case WEDNESDAY -> "Wednesday";
            case THURSDAY -> "Thursday";
            case FRIDAY -> "Friday";
            case SATURDAY -> "Saturday";
        };
    }

    private boolean containsBangla(String text) {
        return text != null && text.matches(".*[\\u0980-\\u09FF].*");
    }

    private String normalize(String value) {
        return value == null
                ? ""
                : value.toLowerCase(Locale.ROOT)
                        .replaceAll("[^\\p{L}\\p{Nd} ]", " ")
                        .replaceAll("\\s+", " ")
                        .trim();
    }

    private boolean containsAny(String value, String... needles) {
        for (String needle : needles) {
            if (value.contains(needle)) {
                return true;
            }
        }
        return false;
    }
}
