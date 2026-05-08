package com.academicdms.backend.ai;

public record AutoEnrollRequest(
        String studentId,
        String semester,
        Double cgpa) {
}
