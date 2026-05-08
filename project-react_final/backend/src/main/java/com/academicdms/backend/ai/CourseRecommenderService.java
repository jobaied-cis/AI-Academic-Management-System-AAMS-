package com.academicdms.backend.ai;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class CourseRecommenderService {

    public List<Map<String, Object>> recommend(String studentId, String semester, double cgpa) {
        List<Map<String, Object>> recommendations = new ArrayList<>();

        recommendations.add(course("CSE 3301", "Operating Systems", semester, cgpa >= 2.75,
                "Strong core systems course for this semester."));
        recommendations.add(course("CSE 3402", "Software Engineering", semester, cgpa >= 2.5,
                "Helps with project work and team-based development."));
        recommendations.add(course("AIE 4011", "Machine Learning", semester, cgpa >= 3.25,
                "Recommended for students with solid AI fundamentals."));
        recommendations.add(course("AIE 4021", "Data Mining", semester, cgpa >= 3.0,
                "Useful for analytics and AI-focused final year projects."));
        recommendations.add(course("BUS 3105", "Entrepreneurship", semester, true,
                "Adds communication and startup thinking alongside technical study."));

        List<Map<String, Object>> filtered = new ArrayList<>();
        for (Map<String, Object> recommendation : recommendations) {
            if (Boolean.TRUE.equals(recommendation.get("eligible"))) {
                Map<String, Object> item = new LinkedHashMap<>(recommendation);
                item.put("studentId", studentId);
                filtered.add(item);
            }
        }

        return filtered;
    }

    private Map<String, Object> course(String code, String title, String semester, boolean eligible, String reason) {
        Map<String, Object> item = new LinkedHashMap<>();
        item.put("code", code);
        item.put("title", title);
        item.put("targetSemester", semester);
        item.put("eligible", eligible);
        item.put("reason", reason);
        return item;
    }
}
