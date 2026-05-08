package com.academicdms.backend;

public record LoginRequest(String role, String email, String password) {
}
