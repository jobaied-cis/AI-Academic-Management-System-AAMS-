package com.academicdms.backend;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AcademicRuntimeService runtimeService;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(AcademicRuntimeService runtimeService) {
        this.runtimeService = runtimeService;
        seedDefaultAccounts();
    }

    public Optional<Map<String, Object>> login(LoginRequest request) {
        if (request == null || isBlank(request.email()) || isBlank(request.password())) {
            return Optional.empty();
        }

        return runtimeService.findAccountByEmail(request.email())
                .filter(account -> isBlank(request.role()) || account.role().equalsIgnoreCase(request.role()))
                .filter(account -> passwordEncoder.matches(request.password(), account.passwordHash()))
                .map(account -> runtimeService.buildPublicUser(account));
    }

    public Optional<Map<String, Object>> register(RegisterRequest request) {
        if (request == null || isBlank(request.name()) || isBlank(request.email()) || isBlank(request.password())) {
            return Optional.empty();
        }

        String role = normalizedRole(request.role());
        if (runtimeService.findAccountByEmail(request.email()).isPresent()) {
            return Optional.empty();
        }

        if (!"student".equals(role)) {
            return Optional.empty();
        }

        String studentId = "AIQ-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Map<String, Object> profile = new LinkedHashMap<>();
        profile.put("role", role);
        profile.put("id", studentId);
        profile.put("name", request.name().trim());
        profile.put("email", request.email().trim().toLowerCase());
        profile.put("department", valueOrDefault(request.department(), "Computer Science & Engineering"));
        profile.put("program", valueOrDefault(request.program(), "B.Sc. in Artificial Intelligence Engineering"));
        profile.put("semester", valueOrDefault(request.semester(), "1st"));
        profile.put("batch", "2026");
        profile.put("cgpa", 0.0);
        profile.put("credits_completed", 0);
        profile.put("credits_total", 162);
        profile.put("advisor", "Academic Advisor");
        profile.put("standing", "New Student");
        profile.put("warnings", 0);
        profile.put("status", "pending_payment");
        profile.put("paymentStatus", "unpaid");

        runtimeService.saveStudentProfile(profile);
        runtimeService.saveAccount(new UserAccount(
                role,
                request.email().trim().toLowerCase(),
                passwordEncoder.encode(request.password()),
                studentId));

        return Optional.of(runtimeService.buildPublicUserByStudentId(studentId));
    }

    private void seedDefaultAccounts() {
        if (runtimeService.findAccountByEmail("akash@diu.edu.bd").isEmpty()) {
            runtimeService.saveAccount(new UserAccount(
                    "student",
                    "akash@diu.edu.bd",
                    passwordEncoder.encode("student123"),
                    "DIU-AI-2021-0423"));
        }

        if (runtimeService.findAccountByEmail("farhana@diu.edu.bd").isEmpty()) {
            runtimeService.saveAccount(new UserAccount(
                    "faculty",
                    "farhana@diu.edu.bd",
                    passwordEncoder.encode("faculty123"),
                    "DIU-FAC-2015-007"));
        }
    }

    private String normalizedRole(String role) {
        return isBlank(role) ? "student" : role.trim().toLowerCase();
    }

    private String valueOrDefault(String value, String defaultValue) {
        return isBlank(value) ? defaultValue : value.trim();
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
