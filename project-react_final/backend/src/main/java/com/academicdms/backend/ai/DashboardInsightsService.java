package com.academicdms.backend.ai;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.academicdms.backend.AcademicRuntimeService;

@Service
public class DashboardInsightsService {

    private final AcademicRuntimeService runtimeService;
    private final ScheduleOptimizerService scheduleOptimizerService;
    private final NoticeClassifierService noticeClassifierService;

    public DashboardInsightsService(
            AcademicRuntimeService runtimeService,
            ScheduleOptimizerService scheduleOptimizerService,
            NoticeClassifierService noticeClassifierService) {
        this.runtimeService = runtimeService;
        this.scheduleOptimizerService = scheduleOptimizerService;
        this.noticeClassifierService = noticeClassifierService;
    }

    @SuppressWarnings("unchecked")
    public Optional<Map<String, Object>> buildInsights(String studentId) {
        return runtimeService.findStudentProfile(studentId).flatMap(profile ->
                scheduleOptimizerService.optimize(studentId).map(schedule -> {
                    List<Map<String, Object>> dailySummary = (List<Map<String, Object>>) schedule.get("dailySummary");
                    List<String> overloadedDays = new ArrayList<>();
                    for (Map<String, Object> day : dailySummary) {
                        if (String.valueOf(day.get("suggestion")).contains("overloaded")) {
                            overloadedDays.add(String.valueOf(day.get("day")));
                        }
                    }

                    List<Map<String, Object>> importantNotices = noticeClassifierService.importantNotices();
                    List<String> recommendations = new ArrayList<>();
                    recommendations.add(overloadedDays.isEmpty()
                            ? "Your weekly class distribution looks balanced."
                            : "Review " + String.join(", ", overloadedDays) + " because those days are heavy.");
                    recommendations.add(importantNotices.isEmpty()
                            ? "No urgent notices need immediate action."
                            : "Prioritize the latest high-priority notices from the notice board.");

                    return Map.of(
                            "studentId", studentId,
                            "totalClassesThisWeek", schedule.get("totalWeeklyClasses"),
                            "overloadedDays", overloadedDays,
                            "importantNotices", importantNotices,
                            "recommendations", recommendations);
                }));
    }
}
