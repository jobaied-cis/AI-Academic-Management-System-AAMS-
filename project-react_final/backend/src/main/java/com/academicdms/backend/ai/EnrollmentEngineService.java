package com.academicdms.backend.ai;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.academicdms.backend.AcademicRuntimeService;

@Service
public class EnrollmentEngineService {

    private final AcademicRuntimeService runtimeService;
    private final CourseRecommenderService recommenderService;

    public EnrollmentEngineService(
            AcademicRuntimeService runtimeService,
            CourseRecommenderService recommenderService) {
        this.runtimeService = runtimeService;
        this.recommenderService = recommenderService;
    }

    public Map<String, Object> autoEnroll(AutoEnrollRequest request) {
        double cgpa = request.cgpa() == null ? 0.0 : request.cgpa();
        List<Map<String, Object>> existingCourses = runtimeService.getEnrolledCourses(request.studentId());
        List<Map<String, Object>> recommendations = recommenderService.recommend(
                request.studentId(),
                request.semester(),
                cgpa);

        List<Map<String, Object>> newCourses = new ArrayList<>(existingCourses);
        List<String> existingCodes = existingCourses.stream()
                .map(course -> String.valueOf(course.get("code")))
                .toList();

        for (Map<String, Object> recommended : recommendations) {
            if (newCourses.size() >= 6) {
                break;
            }

            String courseCode = String.valueOf(recommended.get("code"));
            if (!existingCodes.contains(courseCode)) {
                Map<String, Object> enrolled = new LinkedHashMap<>();
                enrolled.put("code", courseCode);
                enrolled.put("name", recommended.get("title"));
                enrolled.put("credits", 3);
                enrolled.put("status", "auto-enrolled");
                newCourses.add(enrolled);
            }
        }

        List<Map<String, Object>> savedCourses = runtimeService.replaceEnrolledCourses(request.studentId(), newCourses);
        return Map.of(
                "studentId", request.studentId(),
                "message", "Auto enrollment completed safely.",
                "enrolledCourses", savedCourses);
    }
}
