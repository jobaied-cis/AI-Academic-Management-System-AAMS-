package com.academicdms.backend.ai;

import java.util.List;
import java.util.Map;

public record ProgressRequest(
        String studentId,
        Double cgpa,
        String semester,
        List<Map<String, Object>> performanceHistory) {
}
