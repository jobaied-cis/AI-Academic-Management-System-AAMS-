package com.academicdms.backend;

public record PaymentRequest(
        String studentId,
        Double amount,
        String method,
        String reference) {
}
