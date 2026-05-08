package com.academicdms.backend.ai;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.academicdms.backend.AcademicDataStore;
import com.academicdms.backend.AcademicRuntimeService;

@Service
public class AgenticNotificationService {

    private final AcademicDataStore dataStore;
    private final AcademicRuntimeService runtimeService;
    private final NoticeClassifierService noticeClassifierService;
    private final ScheduleOptimizerService scheduleOptimizerService;

    public AgenticNotificationService(
            AcademicDataStore dataStore,
            AcademicRuntimeService runtimeService,
            NoticeClassifierService noticeClassifierService,
            ScheduleOptimizerService scheduleOptimizerService) {
        this.dataStore = dataStore;
        this.runtimeService = runtimeService;
        this.noticeClassifierService = noticeClassifierService;
        this.scheduleOptimizerService = scheduleOptimizerService;
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> buildNotifications(String studentId) {
        List<Map<String, Object>> generated = new ArrayList<>();
        Map<String, Object> student = runtimeService.findStudentProfile(studentId).orElseGet(LinkedHashMap::new);
        List<Map<String, Object>> exams = new ArrayList<>(dataStore.examSchedule());
        List<Map<String, Object>> notices = new ArrayList<>(
                (List<Map<String, Object>>) noticeClassifierService.classifyAll().getOrDefault("notices", List.of()));
        Optional<Map<String, Object>> optimizedSchedule = scheduleOptimizerService.optimize(studentId);

        for (Map<String, Object> exam : exams) {
            generated.add(notification(
                    "deadline",
                    "high",
                    "Exam Reminder - " + exam.get("code"),
                    exam.get("course") + " is scheduled on " + exam.get("date") + " at " + exam.get("time")
                            + " in " + exam.get("room") + ". Duration: " + exam.get("duration") + ".",
                    String.valueOf(exam.get("date")),
                    "BookOpen",
                    "rose",
                    false));
        }

        for (Map<String, Object> notice : notices.stream().limit(4).toList()) {
            generated.add(notification(
                    "notice",
                    String.valueOf(notice.getOrDefault("aiPriority", "medium")),
                    "AI Notice Alert - " + notice.get("title"),
                    String.valueOf(notice.getOrDefault("recommendedAction", notice.get("content"))),
                    String.valueOf(notice.getOrDefault("date", "Today")),
                    "Megaphone",
                    "blue",
                    false));
        }

        optimizedSchedule.ifPresent(schedule -> {
            List<Map<String, Object>> dailySummary =
                    (List<Map<String, Object>>) schedule.getOrDefault("dailySummary", List.of());
            for (Map<String, Object> day : dailySummary) {
                generated.add(notification(
                        "ai",
                        "medium",
                        "Routine Insight - " + day.get("day"),
                        "AI summary: " + day.get("suggestion") + ". Total classes: " + day.get("totalClasses")
                                + ", idle minutes: " + day.get("idleMinutes") + ".",
                        "This week",
                        "Sparkles",
                        "violet",
                        true));
            }
        });

        if (!student.isEmpty()) {
            generated.add(notification(
                    "deadline",
                    "high",
                    "Payment & Clearance Reminder",
                    "Payment status is " + student.getOrDefault("paymentStatus", "unknown")
                            + ". Clear dues before registration, exam form, or clearance steps get blocked.",
                    String.valueOf(student.getOrDefault("lastPaymentDate", "Latest update")),
                    "AlertTriangle",
                    "amber",
                    false));
        }

        generated.sort(priorityComparator());
        return Map.of(
                "studentId", studentId,
                "total", generated.size(),
                "notifications", generated);
    }

    public Map<String, Object> buildNoticeDrafts() {
        List<Map<String, Object>> drafts = new ArrayList<>();

        for (Map<String, Object> exam : dataStore.examSchedule().stream().limit(3).toList()) {
            drafts.add(Map.of(
                    "title", exam.get("type") + " Exam Room Reminder - " + exam.get("code"),
                    "category", "Exam",
                    "priority", "high",
                    "author", "AAMS Agentic AI",
                    "content", exam.get("course") + " (" + exam.get("code") + ") is scheduled on " + exam.get("date")
                            + " at " + exam.get("time") + " in " + exam.get("room")
                            + ". Students should arrive early with required materials. Exam duration: " + exam.get("duration") + "."));
        }

        drafts.add(Map.of(
                "title", "Registration Clearance Reminder",
                "category", "Registration",
                "priority", "high",
                "author", "AAMS Agentic AI",
                "content", "Students are advised to clear all pending dues and complete required academic approvals before registration. Failure to complete clearance may block course enrollment."));

        drafts.add(Map.of(
                "title", "Final Exam Form Submission Reminder",
                "category", "Academic",
                "priority", "medium",
                "author", "AAMS Agentic AI",
                "content", "Students should submit the final exam form within the department deadline and verify room allocation, exam timing, and course code before the exam week begins."));

        return Map.of("drafts", drafts);
    }

    private Map<String, Object> notification(
            String type,
            String priority,
            String title,
            String desc,
            String time,
            String icon,
            String color,
            boolean read) {
        Map<String, Object> item = new LinkedHashMap<>();
        item.put("id", "NTF-" + Math.abs((title + time).hashCode()));
        item.put("type", type);
        item.put("priority", priority);
        item.put("title", title);
        item.put("desc", desc);
        item.put("time", time);
        item.put("icon", icon);
        item.put("color", color);
        item.put("read", read);
        return item;
    }

    private Comparator<Map<String, Object>> priorityComparator() {
        return Comparator.<Map<String, Object>, Integer>comparing(item -> switch (String.valueOf(item.get("priority"))) {
            case "high" -> 0;
            case "medium" -> 1;
            default -> 2;
        }).thenComparing(item -> String.valueOf(item.get("title")));
    }
}
