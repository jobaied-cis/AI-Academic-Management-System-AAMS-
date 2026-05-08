package com.academicdms.backend;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.Test;

class AuthServiceTest {

    @Test
    void bootstrapDataUsesSameEmailsAsSeededAccounts() {
        AcademicDataStore dataStore = new AcademicDataStore();

        @SuppressWarnings("unchecked")
        Map<String, Object> studentData = (Map<String, Object>) dataStore.bootstrap().get("studentData");
        @SuppressWarnings("unchecked")
        Map<String, Object> facultyData = (Map<String, Object>) dataStore.bootstrap().get("facultyData");
        @SuppressWarnings("unchecked")
        Map<String, Object> credentials = (Map<String, Object>) dataStore.bootstrap().get("credentials");
        @SuppressWarnings("unchecked")
        Map<String, Object> studentCredentials = (Map<String, Object>) credentials.get("student");
        @SuppressWarnings("unchecked")
        Map<String, Object> facultyCredentials = (Map<String, Object>) credentials.get("faculty");

        assertEquals(studentCredentials.get("email"), studentData.get("email"));
        assertEquals(facultyCredentials.get("email"), facultyData.get("email"));
        assertEquals("student", studentData.get("role"));
        assertEquals("faculty", facultyData.get("role"));
    }

    @Test
    void registerRejectsUnsupportedRole() {
        AuthService authService = new AuthService(new AcademicRuntimeService());

        Optional<Map<String, Object>> result = authService.register(new RegisterRequest(
                "faculty",
                "Test Faculty",
                "test-faculty@diu.edu.bd",
                "password123",
                "Computer Science & Engineering",
                "B.Sc. in Artificial Intelligence Engineering",
                "1st"));

        assertTrue(result.isEmpty());
    }

    @Test
    void registerCreatesStudentProfileForStudentRole() {
        AuthService authService = new AuthService(new AcademicRuntimeService());

        Optional<Map<String, Object>> result = authService.register(new RegisterRequest(
                "student",
                "New Student",
                "new.student@diu.edu.bd",
                "password123",
                "Computer Science & Engineering",
                "B.Sc. in Artificial Intelligence Engineering",
                "1st"));

        assertTrue(result.isPresent());
        assertEquals("student", result.get().get("role"));
        assertEquals("new.student@diu.edu.bd", result.get().get("email"));
        assertEquals("pending_payment", result.get().get("status"));
        assertEquals("unpaid", result.get().get("paymentStatus"));
        assertFalse(String.valueOf(result.get().get("id")).isBlank());
    }
}
