package com.academicdms.backend;

public record Payment(
        String paymentId,
        String studentId,
        double amount,
        String method,
        String reference,
        String status,
        String paymentDate) {
}
