package com.academicdms.backend;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final AcademicRuntimeService runtimeService;

    public PaymentController(AcademicRuntimeService runtimeService) {
        this.runtimeService = runtimeService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> pay(@RequestBody PaymentRequest request) {
        if (request == null || request.studentId() == null || request.studentId().isBlank()
                || request.amount() == null || request.amount() <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "A valid studentId and payment amount are required."));
        }

        if (runtimeService.findStudentProfile(request.studentId()).isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Student not found."));
        }

        Payment payment = runtimeService.addPayment(request);
        return ResponseEntity.ok(Map.of(
                "message", "Payment recorded successfully",
                "payment", payment,
                "student", runtimeService.buildPublicUserByStudentId(request.studentId())));
    }
}
