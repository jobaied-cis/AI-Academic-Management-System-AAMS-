package com.academicdms.backend.ai;

public record RecommendationRequest(
        String studentId,
        String semester,
        Double cgpa) {
}
