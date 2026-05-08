package com.academicdms.backend;

public class UserAccount {

    private final String role;
    private final String email;
    private final String passwordHash;
    private final String referenceId;

    public UserAccount(String role, String email, String passwordHash, String referenceId) {
        this.role = role;
        this.email = email;
        this.passwordHash = passwordHash;
        this.referenceId = referenceId;
    }

    public String role() {
        return role;
    }

    public String email() {
        return email;
    }

    public String passwordHash() {
        return passwordHash;
    }

    public String referenceId() {
        return referenceId;
    }
}
