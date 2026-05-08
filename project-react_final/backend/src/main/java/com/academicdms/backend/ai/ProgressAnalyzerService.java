package com.academicdms.backend.ai;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class ProgressAnalyzerService {

    public Map<String, Object> analyze(ProgressRequest request) {
        double cgpa = request.cgpa() == null ? 0.0 : request.cgpa();
        String semester = request.semester() == null || request.semester().isBlank() ? "Unknown" : request.semester();

        String riskLevel = "low";
        String performanceBand = "excellent";
        List<String> suggestions = new ArrayList<>();

        if (cgpa < 2.5) {
            riskLevel = "high";
            performanceBand = "at risk";
            suggestions.add("Meet your advisor this week and build a recovery plan.");
            suggestions.add("Take a lighter course load until core subjects improve.");
            suggestions.add("Use tutoring support for the weakest course before the next assessment.");
        } else if (cgpa < 3.2) {
            riskLevel = "medium";
            performanceBand = "stable but needs attention";
            suggestions.add("Review your lowest-performing course every weekend.");
            suggestions.add("Balance theory and lab courses more carefully next semester.");
            suggestions.add("Track attendance and assignment deadlines in one place.");
        } else {
            suggestions.add("Keep the current study pattern because it is working well.");
            suggestions.add("Add one advanced elective that supports your long-term career plan.");
            suggestions.add("Document projects now for internship and scholarship applications.");
        }

        return new LinkedHashMap<>(Map.of(
                "studentId", request.studentId(),
                "semester", semester,
                "cgpa", cgpa,
                "riskLevel", riskLevel,
                "performanceBand", performanceBand,
                "suggestions", suggestions));
    }
}
