package com.academicdms.backend.ai;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.academicdms.backend.AcademicRuntimeService;

@RestController
@RequestMapping({ "/api/ai", "/ai" })
public class AIController {

    private final AcademicRuntimeService runtimeService;
    private final ProgressAnalyzerService progressAnalyzerService;
    private final CourseRecommenderService courseRecommenderService;
    private final EnrollmentEngineService enrollmentEngineService;
    private final FaqChatbotService faqChatbotService;
    private final ScheduleOptimizerService scheduleOptimizerService;
    private final NoticeClassifierService noticeClassifierService;
    private final NoticeAssistantService noticeAssistantService;
    private final ScheduleAssistantService scheduleAssistantService;
    private final AgenticNotificationService agenticNotificationService;
    private final DashboardInsightsService dashboardInsightsService;

    public AIController(
            AcademicRuntimeService runtimeService,
            ProgressAnalyzerService progressAnalyzerService,
            CourseRecommenderService courseRecommenderService,
            EnrollmentEngineService enrollmentEngineService,
            FaqChatbotService faqChatbotService,
            ScheduleOptimizerService scheduleOptimizerService,
            NoticeClassifierService noticeClassifierService,
            NoticeAssistantService noticeAssistantService,
            ScheduleAssistantService scheduleAssistantService,
            AgenticNotificationService agenticNotificationService,
            DashboardInsightsService dashboardInsightsService) {
        this.runtimeService = runtimeService;
        this.progressAnalyzerService = progressAnalyzerService;
        this.courseRecommenderService = courseRecommenderService;
        this.enrollmentEngineService = enrollmentEngineService;
        this.faqChatbotService = faqChatbotService;
        this.scheduleOptimizerService = scheduleOptimizerService;
        this.noticeClassifierService = noticeClassifierService;
        this.noticeAssistantService = noticeAssistantService;
        this.scheduleAssistantService = scheduleAssistantService;
        this.agenticNotificationService = agenticNotificationService;
        this.dashboardInsightsService = dashboardInsightsService;
    }

    @PostMapping("/analyze-progress")
    public ResponseEntity<Map<String, Object>> analyzeProgress(@RequestBody ProgressRequest request) {
        if (!studentExists(request.studentId())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Student not found."));
        }
        return ResponseEntity.ok(progressAnalyzerService.analyze(request));
    }

    @PostMapping("/recommend-courses")
    public ResponseEntity<Map<String, Object>> recommendCourses(@RequestBody RecommendationRequest request) {
        if (!studentExists(request.studentId())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Student not found."));
        }
        double cgpa = request.cgpa() == null ? 0.0 : request.cgpa();
        return ResponseEntity.ok(Map.of(
                "studentId", request.studentId(),
                "recommendations", courseRecommenderService.recommend(request.studentId(), request.semester(), cgpa)));
    }

    @PostMapping("/auto-enroll")
    public ResponseEntity<Map<String, Object>> autoEnroll(@RequestBody AutoEnrollRequest request) {
        if (!studentExists(request.studentId())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Student not found."));
        }
        return ResponseEntity.ok(enrollmentEngineService.autoEnroll(request));
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody ChatRequest request) {
        if (request == null || request.question() == null || request.question().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Question is required."));
        }
        return ResponseEntity.ok(faqChatbotService.ask(request.question()));
    }

    @GetMapping("/optimized-schedule/{studentId}")
    public ResponseEntity<Map<String, Object>> optimizedSchedule(@PathVariable String studentId) {
        return scheduleOptimizerService.optimize(studentId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Student not found.")));
    }

    @GetMapping("/smart-notices")
    public ResponseEntity<Map<String, Object>> smartNotices() {
        return ResponseEntity.ok(noticeClassifierService.classifyAll());
    }

    @PostMapping("/smart-notices/ask")
    public ResponseEntity<Map<String, Object>> askAboutNotices(@RequestBody ChatRequest request) {
        if (request == null || request.question() == null || request.question().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Question is required."));
        }
        return ResponseEntity.ok(noticeAssistantService.ask(request.question()));
    }

    @GetMapping("/dashboard-insights/{studentId}")
    public ResponseEntity<Map<String, Object>> dashboardInsights(@PathVariable String studentId) {
        return dashboardInsightsService.buildInsights(studentId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Student not found.")));
    }

    @PostMapping("/optimized-schedule/{studentId}/ask")
    public ResponseEntity<Map<String, Object>> askAboutSchedule(
            @PathVariable String studentId,
            @RequestBody ChatRequest request) {
        if (request == null || request.question() == null || request.question().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Question is required."));
        }
        if (!studentExists(studentId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Student not found."));
        }
        return ResponseEntity.ok(scheduleAssistantService.ask(studentId, request.question()));
    }

    @GetMapping("/agentic-notifications/{studentId}")
    public ResponseEntity<Map<String, Object>> agenticNotifications(@PathVariable String studentId) {
        if (!studentExists(studentId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Student not found."));
        }
        return ResponseEntity.ok(agenticNotificationService.buildNotifications(studentId));
    }

    @GetMapping("/notice-drafts")
    public ResponseEntity<Map<String, Object>> noticeDrafts() {
        return ResponseEntity.ok(agenticNotificationService.buildNoticeDrafts());
    }

    private boolean studentExists(String studentId) {
        return studentId != null && runtimeService.findStudentProfile(studentId).isPresent();
    }
}
