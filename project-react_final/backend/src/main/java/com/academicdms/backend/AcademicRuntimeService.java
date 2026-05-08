package com.academicdms.backend;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

@Service
public class AcademicRuntimeService {

    private final Map<String, UserAccount> accountsByEmail = new ConcurrentHashMap<>();
    private final Map<String, Map<String, Object>> studentProfilesById = new ConcurrentHashMap<>();
    private final Map<String, Map<String, Object>> facultyProfilesByEmail = new ConcurrentHashMap<>();
    private final Map<String, List<Map<String, Object>>> enrolledCoursesByStudentId = new ConcurrentHashMap<>();
    private final Map<String, List<Payment>> paymentsByStudentId = new ConcurrentHashMap<>();

    public AcademicRuntimeService() {
        seedProfiles();
        seedEnrollments();
    }

    public Optional<UserAccount> findAccountByEmail(String email) {
        if (email == null) {
            return Optional.empty();
        }
        return Optional.ofNullable(accountsByEmail.get(email.trim().toLowerCase()));
    }

    public void saveAccount(UserAccount account) {
        accountsByEmail.put(account.email().trim().toLowerCase(), account);
    }

    public void saveStudentProfile(Map<String, Object> profile) {
        studentProfilesById.put(String.valueOf(profile.get("id")), new LinkedHashMap<>(profile));
        enrolledCoursesByStudentId.putIfAbsent(String.valueOf(profile.get("id")), new ArrayList<>());
        paymentsByStudentId.putIfAbsent(String.valueOf(profile.get("id")), new ArrayList<>());
    }

    public Optional<Map<String, Object>> findStudentProfile(String studentId) {
        Map<String, Object> profile = studentProfilesById.get(studentId);
        return profile == null ? Optional.empty() : Optional.of(new LinkedHashMap<>(profile));
    }

    public Optional<Map<String, Object>> findStudentProfileByEmail(String email) {
        return findAccountByEmail(email)
                .filter(account -> "student".equalsIgnoreCase(account.role()))
                .flatMap(account -> findStudentProfile(account.referenceId()));
    }

    public Optional<Map<String, Object>> findFacultyProfileByEmail(String email) {
        if (email == null) {
            return Optional.empty();
        }
        Map<String, Object> profile = facultyProfilesByEmail.get(email.trim().toLowerCase());
        return profile == null ? Optional.empty() : Optional.of(new LinkedHashMap<>(profile));
    }

    public Map<String, Object> buildPublicUser(UserAccount account) {
        if ("faculty".equalsIgnoreCase(account.role())) {
            return findFacultyProfileByEmail(account.email()).orElseGet(LinkedHashMap::new);
        }
        return buildPublicUserByStudentId(account.referenceId());
    }

    public Map<String, Object> buildPublicUserByStudentId(String studentId) {
        return findStudentProfile(studentId).orElseGet(LinkedHashMap::new);
    }

    public List<Map<String, Object>> getEnrolledCourses(String studentId) {
        return copyCourseList(enrolledCoursesByStudentId.getOrDefault(studentId, List.of()));
    }

    public List<Map<String, Object>> replaceEnrolledCourses(String studentId, List<Map<String, Object>> courses) {
        List<Map<String, Object>> safeCourses = copyCourseList(courses);
        enrolledCoursesByStudentId.put(studentId, safeCourses);
        return copyCourseList(safeCourses);
    }

    public Payment addPayment(PaymentRequest request) {
        String studentId = request.studentId();
        Payment payment = new Payment(
                "PAY-" + System.currentTimeMillis(),
                studentId,
                request.amount(),
                defaultText(request.method(), "Online"),
                defaultText(request.reference(), "N/A"),
                "paid",
                LocalDate.now().toString());

        paymentsByStudentId.computeIfAbsent(studentId, ignored -> new ArrayList<>()).add(payment);
        studentProfilesById.computeIfPresent(studentId, (id, profile) -> {
            Map<String, Object> updated = new LinkedHashMap<>(profile);
            updated.put("status", "active");
            updated.put("paymentStatus", "paid");
            updated.put("lastPaymentAmount", payment.amount());
            updated.put("lastPaymentDate", payment.paymentDate());
            return updated;
        });

        return payment;
    }

    public List<Payment> getPayments(String studentId) {
        return new ArrayList<>(paymentsByStudentId.getOrDefault(studentId, List.of()));
    }

    private void seedProfiles() {
        Map<String, Object> student = new LinkedHashMap<>();
        student.put("role", "student");
        student.put("id", "DIU-AI-2021-0423");
        student.put("name", "Akash Rahman");
        student.put("email", "akash@diu.edu.bd");
        student.put("department", "Computer Science & Engineering");
        student.put("program", "B.Sc. in Artificial Intelligence Engineering");
        student.put("semester", "6th");
        student.put("batch", "2021");
        student.put("cgpa", 3.94);
        student.put("credits_completed", 96);
        student.put("credits_total", 162);
        student.put("advisor", "Dr. Farhana Islam");
        student.put("standing", "Good Standing");
        student.put("warnings", 0);
        student.put("status", "active");
        student.put("paymentStatus", "paid");
        student.put("lastPaymentAmount", 18500.0);
        student.put("lastPaymentDate", "2026-01-15");
        saveStudentProfile(student);

        Map<String, Object> faculty = new LinkedHashMap<>();
        faculty.put("role", "faculty");
        faculty.put("id", "DIU-FAC-2015-007");
        faculty.put("name", "Dr. Farhana Islam");
        faculty.put("email", "farhana@diu.edu.bd");
        faculty.put("department", "Computer Science & Engineering");
        faculty.put("designation", "Associate Professor");
        faculty.put("specialization", "Machine Learning, NLP");
        faculty.put("room", "AB-5-401");
        faculty.put("officeHours", "Sun-Tue: 2PM-4PM");
        facultyProfilesByEmail.put("farhana@diu.edu.bd", faculty);
    }

    private void seedEnrollments() {
        List<Map<String, Object>> courses = new ArrayList<>();
        courses.add(course("CSE 3101", "Object-Oriented Programming", 3, "ongoing"));
        courses.add(course("CSE 3201", "Computer Networks", 3, "ongoing"));
        courses.add(course("BUS 2101", "Accounting", 3, "ongoing"));
        courses.add(course("AIE 3011", "AI Fundamentals", 3, "ongoing"));
        enrolledCoursesByStudentId.put("DIU-AI-2021-0423", courses);
    }

    private Map<String, Object> course(String code, String name, int credits, String status) {
        Map<String, Object> course = new LinkedHashMap<>();
        course.put("code", code);
        course.put("name", name);
        course.put("credits", credits);
        course.put("status", status);
        return course;
    }

    private List<Map<String, Object>> copyCourseList(List<Map<String, Object>> source) {
        List<Map<String, Object>> copy = new ArrayList<>();
        for (Map<String, Object> item : source) {
            copy.add(new LinkedHashMap<>(item));
        }
        return copy;
    }

    private String defaultText(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value.trim();
    }
}
