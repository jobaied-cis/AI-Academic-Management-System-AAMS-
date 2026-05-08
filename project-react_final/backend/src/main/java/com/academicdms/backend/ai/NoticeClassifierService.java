package com.academicdms.backend.ai;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.academicdms.backend.AcademicDataStore;

@Service
public class NoticeClassifierService {

    private final AcademicDataStore dataStore;

    public NoticeClassifierService(AcademicDataStore dataStore) {
        this.dataStore = dataStore;
    }

    public Map<String, Object> classifyAll() {
        List<Map<String, Object>> enriched = new ArrayList<>();
        for (Map<String, Object> notice : dataStore.notices()) {
            enriched.add(classifyNotice(notice));
        }

        long highPriority = enriched.stream()
                .filter(notice -> "high".equals(notice.get("aiPriority")))
                .count();

        return Map.of(
                "totalNotices", enriched.size(),
                "highPriorityCount", highPriority,
                "notices", enriched);
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> importantNotices() {
        List<Map<String, Object>> important = new ArrayList<>();
        for (Map<String, Object> notice : (List<Map<String, Object>>) classifyAll().get("notices")) {
            if ("high".equals(notice.get("aiPriority")) || ((Number) notice.get("urgencyScore")).intValue() >= 70) {
                important.add(notice);
            }
        }
        return important;
    }

    private Map<String, Object> classifyNotice(Map<String, Object> notice) {
        String title = String.valueOf(notice.getOrDefault("title", ""));
        String content = String.valueOf(notice.getOrDefault("content", ""));
        String combined = (title + " " + content).toLowerCase(Locale.ENGLISH);

        String aiCategory = detectCategory(combined);
        int urgencyScore = baseUrgencyScore(combined);
        urgencyScore += dateProximityBoost(String.valueOf(notice.getOrDefault("date", "")));
        urgencyScore = Math.max(10, Math.min(100, urgencyScore));

        String aiPriority = urgencyScore >= 75 ? "high" : urgencyScore >= 45 ? "medium" : "low";
        String action = recommendedAction(aiCategory, combined, aiPriority);
        boolean highlight = "high".equals(aiPriority);

        Map<String, Object> enriched = new LinkedHashMap<>(notice);
        enriched.put("aiCategory", aiCategory);
        enriched.put("aiPriority", aiPriority);
        enriched.put("urgencyScore", urgencyScore);
        enriched.put("recommendedAction", action);
        enriched.put("highlight", highlight);
        enriched.put("urgencyBadge", urgencyScore >= 75 ? "Urgent" : urgencyScore >= 45 ? "Needs Attention" : "Routine");
        return enriched;
    }

    private String detectCategory(String combined) {
        if (containsAny(combined, "exam", "midterm", "final", "quiz")) {
            return "Exam";
        }
        if (containsAny(combined, "deadline", "submit", "registration", "urgent", "immediately")) {
            return "Urgent";
        }
        if (containsAny(combined, "workshop", "symposium", "seminar", "event")) {
            return "Event";
        }
        return "Academic";
    }

    private int baseUrgencyScore(String combined) {
        int score = 25;
        if (containsAny(combined, "deadline", "urgent", "immediately")) {
            score += 35;
        }
        if (containsAny(combined, "exam", "midterm", "final")) {
            score += 30;
        }
        if (containsAny(combined, "registration", "submit", "clear dues")) {
            score += 20;
        }
        if (containsAny(combined, "workshop", "event", "symposium")) {
            score += 10;
        }
        return score;
    }

    private int dateProximityBoost(String dateValue) {
        try {
            LocalDate noticeDate = LocalDate.parse(dateValue);
            long days = Math.abs(ChronoUnit.DAYS.between(LocalDate.now(), noticeDate));
            if (days <= 3) {
                return 25;
            }
            if (days <= 7) {
                return 15;
            }
            if (days <= 30) {
                return 5;
            }
        } catch (Exception ignored) {
            return 0;
        }
        return 0;
    }

    private String recommendedAction(String category, String combined, String priority) {
        if ("Exam".equals(category)) {
            return "Check the exam routine and prepare the required documents.";
        }
        if ("Urgent".equals(category) || combined.contains("registration")) {
            return "Submit before deadline and confirm your portal status.";
        }
        if ("Event".equals(category)) {
            return "Review the event details and register early if seats are limited.";
        }
        return "Read the full notice and follow department instructions.";
    }

    private boolean containsAny(String value, String... keywords) {
        for (String keyword : keywords) {
            if (value.contains(keyword)) {
                return true;
            }
        }
        return false;
    }
}
