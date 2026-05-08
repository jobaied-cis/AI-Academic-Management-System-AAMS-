package com.academicdms.backend;

public record RegisterRequest(
        String role,
        String name,
        String email,
        String password,
        String department,
        String program,
        String semester) {
}
