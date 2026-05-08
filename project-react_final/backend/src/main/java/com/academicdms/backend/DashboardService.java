package com.academicdms.backend;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.academicdms.backend.ai.ProgressAnalyzerService;
import com.academicdms.backend.ai.ProgressRequest;

@Service
public class DashboardService {

    private final AcademicRuntimeService runtimeService;
    private final ProgressAnalyzerService progressAnalyzerService;
    private final com.academicdms.backend.ai.CourseRecommenderService courseRecommenderService;

    public DashboardService(
            AcademicRuntimeService runtimeService,
            ProgressAnalyzerService progressAnalyzerService,
            com.academicdms.backend.ai.CourseRecommenderService courseRecommenderService) {
        this.runtimeService = runtimeService;
        this.progressAnalyzerService = progressAnalyzerService;
        this.courseRecommenderService = courseRecommenderService;
    }

    public Optional<Map<String, Object>> buildDashboard(String studentId) {
        return runtimeService.findStudentProfile(studentId).map(profile -> {
            double cgpa = readDouble(profile.get("cgpa"), 0.0);
            String semester = String.valueOf(profile.getOrDefault("semester", "1st"));
            List<Map<String, Object>> aiSuggestions = new ArrayList<>();
            aiSuggestions.add(progressAnalyzerService.analyze(new ProgressRequest(studentId, cgpa, semester, null)));
            aiSuggestions.addAll(courseRecommenderService.recommend(studentId, semester, cgpa));

            return Map.of(
                    "student", profile,
                    "cgpa", cgpa,
                    "aiSuggestions", aiSuggestions,
                    "enrolledCourses", runtimeService.getEnrolledCourses(studentId),
                    "payments", runtimeService.getPayments(studentId));
        });
    }

    private double readDouble(Object value, double fallback) {
        if (value instanceof Number number) {
            return number.doubleValue();
        }
        return fallback;
    }
}
