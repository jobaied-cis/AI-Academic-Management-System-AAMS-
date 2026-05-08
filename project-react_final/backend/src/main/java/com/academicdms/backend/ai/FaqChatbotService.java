package com.academicdms.backend.ai;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;

import org.springframework.stereotype.Service;

import com.academicdms.backend.AcademicRuntimeService;

@Service
public class FaqChatbotService {

    private static final String DEFAULT_STUDENT_ID = "DIU-AI-2021-0423";
    private static final String DEFAULT_FACULTY_EMAIL = "farhana@diu.edu.bd";

    private final AcademicRuntimeService runtimeService;
    private final List<IntentRule> intentRules = new ArrayList<>();

    public FaqChatbotService(AcademicRuntimeService runtimeService) {
        this.runtimeService = runtimeService;
        seedRules();
    }

    public Map<String, Object> ask(String question) {
        boolean bangla = containsBangla(question);
        String normalizedQuestion = normalize(question);
        Set<String> tokens = tokenize(normalizedQuestion);
        Map<String, Object> student = runtimeService.buildPublicUserByStudentId(DEFAULT_STUDENT_ID);
        Map<String, Object> faculty = runtimeService.findFacultyProfileByEmail(DEFAULT_FACULTY_EMAIL)
                .orElseGet(LinkedHashMap::new);
        List<Map<String, Object>> courses = runtimeService.getEnrolledCourses(DEFAULT_STUDENT_ID);

        List<IntentRule> matchedRules = new ArrayList<>();
        int confidence = 0;

        for (IntentRule rule : intentRules) {
            int score = rule.score(normalizedQuestion, tokens);
            if (score > 0) {
                matchedRules.add(rule);
                confidence += score;
            }
        }

        matchedRules.sort((left, right) -> Integer.compare(
                right.score(normalizedQuestion, tokens),
                left.score(normalizedQuestion, tokens)));

        String answer = matchedRules.isEmpty()
                ? buildFallbackAnswer(question, student, faculty, courses, bangla)
                : buildCompositeAnswer(new ChatContext(question, normalizedQuestion, tokens, student, faculty, courses, bangla),
                        matchedRules);

        List<String> followUps = buildFollowUps(matchedRules.isEmpty() ? "general-support" : matchedRules.get(0).name, bangla);

        return Map.of(
                "question", question,
                "matchedTopic", matchedRules.isEmpty() ? "general-support" : matchedRules.get(0).name,
                "confidence", confidence,
                "answer", answer,
                "suggestedFollowUps", followUps);
    }

    private void seedRules() {
        intentRules.add(rule(
                "greeting",
                List.of("hi", "hello", "hey", "assalamu alaikum", "salam", "good morning", "good evening", "হ্যালো",
                        "হাই", "আসসালামু আলাইকুম", "সালাম"),
                context -> context.bangla
                        ? "হ্যালো! আমি registration, CGPA, course, schedule, exam, payment, documents, advising, notice, career planning আর সাধারণ academic question-এ help করতে পারি।"
                        : "Hello! I can help with registration, CGPA, courses, schedules, exams, payments, documents, advising, notices, career planning, and general academic questions."));

        intentRules.add(rule(
                "cgpa",
                List.of("cgpa", "gpa", "grade", "result", "marks", "standing", "performance", "সিজিপিএ", "জিপিএ", "রেজাল্ট",
                        "রেজাল্ট", "মার্কস", "ফলাফল", "grading"),
                context -> context.bangla
                        ? "তোমার current CGPA হলো " + value(context.student, "cgpa", "N/A")
                                + " এবং standing হলো " + value(context.student, "standing", "Good Standing")
                                + "। তুমি " + value(context.student, "credits_completed", "0") + " out of "
                                + value(context.student, "credits_total", "0")
                                + " credits complete করেছো। চাইলে আমি CGPA improve করার plan-ও বলতে পারি।"
                        : "Your current CGPA is " + value(context.student, "cgpa", "N/A")
                                + " with academic standing " + value(context.student, "standing", "Good Standing")
                                + ". You have completed " + value(context.student, "credits_completed", "0") + " out of "
                                + value(context.student, "credits_total", "0")
                                + " credits. I can also suggest ways to improve it if you want."));

        intentRules.add(rule(
                "graduation",
                List.of("graduate", "graduation", "credit", "credits", "pass out", "complete degree", "degree", "graduating",
                        "গ্রাজুয়েশন", "গ্রাজুয়েশন", "ক্রেডিট", "ডিগ্রি", "পাস আউট", "complete"),
                context -> context.bangla
                        ? "Graduation-এর জন্য সাধারণত " + value(context.student, "credits_total", "162")
                                + " total credits complete করতে হয় এবং minimum required CGPA maintain করতে হয়। এখন তোমার completed credits "
                                + value(context.student, "credits_completed", "0") + ", তাই remaining credits হলো "
                                + remainingCredits(context.student)
                                + "। সাথে dues, advising approval, আর academic clearance complete রাখা দরকার।"
                        : "For graduation, you usually need to complete " + value(context.student, "credits_total", "162")
                                + " total credits and maintain the required minimum CGPA. Right now you have completed "
                                + value(context.student, "credits_completed", "0") + " credits, so your remaining credits are "
                                + remainingCredits(context.student)
                                + ". You should also keep dues, advising approvals, and academic clearances complete."));

        intentRules.add(rule(
                "advisor",
                List.of("advisor", "advising", "teacher", "faculty", "sir", "madam", "office hour", "office hours", "advisor meeting",
                        "অ্যাডভাইজর", "এডভাইজর", "শিক্ষক", "স্যার", "ম্যাডাম", "অফিস আওয়ার", "অফিস আওয়ার"),
                context -> context.bangla
                        ? "তোমার academic advisor হলো " + value(context.student, "advisor", "Academic Advisor")
                                + "। Current faculty contact: " + value(context.faculty, "name", "Dr. Farhana Islam")
                                + ", " + value(context.faculty, "designation", "Faculty Member")
                                + "। Office hours: " + value(context.faculty, "officeHours", "Sun-Tue: 2PM-4PM")
                                + "। Room: " + value(context.faculty, "room", "AB-5-401") + "।"
                        : "Your academic advisor is " + value(context.student, "advisor", "Academic Advisor")
                                + ". Current faculty contact: " + value(context.faculty, "name", "Dr. Farhana Islam")
                                + ", " + value(context.faculty, "designation", "Faculty Member")
                                + ". Office hours: " + value(context.faculty, "officeHours", "Sun-Tue: 2PM-4PM")
                                + ". Room: " + value(context.faculty, "room", "AB-5-401") + "."));

        intentRules.add(rule(
                "schedule",
                List.of("schedule", "routine", "class", "classes", "timing", "time", "period", "today class", "weekly plan",
                        "শিডিউল", "রুটিন", "ক্লাস", "ক্লাসগুলো", "সময়", "টাইম", "আজ ক্লাস", "রুটিনটা"),
                context -> context.bangla
                        ? "তুমি এখন " + context.courses.size() + "টা active course-এ enrolled আছো: " + courseSummary(context.courses)
                                + "। Class routine Sunday থেকে Thursday পর্যন্ত spread করা আছে। Exact সময় জানার জন্য Schedule page দেখো, আর চাইলে exam, lab conflict, gap, বা আজকের class নিয়ে জিজ্ঞেস করতে পারো।"
                        : "You are currently enrolled in " + context.courses.size() + " active courses: " + courseSummary(context.courses)
                                + ". Class routines are spread across Sunday to Thursday. For exact time slots, check the Schedule page. You can also ask about exams, lab conflicts, gaps, or today's classes."));

        intentRules.add(rule(
                "course-registration",
                List.of("register", "registration", "enroll", "enrollment", "course add", "drop", "withdraw", "retake", "waiver", "registration process",
                        "রেজিস্ট্রেশন", "কোর্স", "এনরোল", "ড্রপ", "রিটেক", "ওয়েভার", "কোর্স নেওয়া"),
                context -> context.bangla
                        ? "Course registration-এর জন্য আগে dues clear করতে হবে, তারপর advisor-এর সাথে course plan confirm করে portal-এ submit করতে হবে। Drop, retake, বা waiver লাগলে department approval এবং deadline follow করা জরুরি।"
                        : "For course registration, first clear dues, then confirm the course plan with your advisor, and finally submit it through the portal. For drop, retake, or waiver requests, department approval and deadline compliance are important."));

        intentRules.add(rule(
                "payment",
                List.of("payment", "tuition", "fee", "fees", "dues", "bills", "clearance", "semester fee", "payment status",
                        "পেমেন্ট", "টিউশন", "ফি", "ফিস", "বকেয়া", "ক্লিয়ারেন্স", "সেমিস্টার ফি", "টাকা"),
                context -> context.bangla
                        ? "তোমার payment status হলো " + value(context.student, "paymentStatus", "unknown")
                                + " এবং latest recorded payment " + value(context.student, "lastPaymentAmount", "N/A")
                                + " on " + value(context.student, "lastPaymentDate", "N/A")
                                + "। Unpaid dues থাকলে registration, exam form, বা clearance block হতে পারে।"
                        : "Your payment status is " + value(context.student, "paymentStatus", "unknown")
                                + " and your latest recorded payment is " + value(context.student, "lastPaymentAmount", "N/A")
                                + " on " + value(context.student, "lastPaymentDate", "N/A")
                                + ". Unpaid dues can block registration, exam forms, or clearance."));

        intentRules.add(rule(
                "exam",
                List.of("exam", "midterm", "final", "viva", "seat plan", "exam form", "prepare for exam", "exam prep",
                        "পরীক্ষা", "এক্সাম", "মিড", "ফাইনাল", "ভাইভা", "সিট প্ল্যান", "exam routine"),
                context -> context.bangla
                        ? "Exam-এর সময় date, room, time, course code, আর exam form deadline আগে check করা দরকার। Preparation-এর জন্য class note, previous topics, আর weak course আগে revise করো। চাইলে আমি exam strategy বা course-wise plan-ও বলতে পারি।"
                        : "For exams, first check the date, room, time, course code, and exam form deadline. For preparation, review class notes, previous topics, and weaker courses first. I can also suggest an exam strategy or course-wise plan."));

        intentRules.add(rule(
                "attendance",
                List.of("attendance", "absent", "presence", "class participation", "attendance policy", "উপস্থিতি", "অ্যাটেনডেন্স", "অনুপস্থিত"),
                context -> context.bangla
                        ? "Attendance policy অনুযায়ী বেশিরভাগ course-এ minimum class participation maintain করতে হয়, সাধারণত 75% এর আশেপাশে। Attendance কম হলে teacher আর advisor-এর সাথে early কথা বলা ভালো।"
                        : "Attendance policy usually requires regular class participation, often around a 75% minimum. If your attendance is low, talk to your teacher and advisor early."));

        intentRules.add(rule(
                "documents",
                List.of("document", "documents", "transcript", "certificate", "form", "noc", "recommendation", "syllabus", "leave application",
                        "ডকুমেন্ট", "ট্রান্সক্রিপ্ট", "সার্টিফিকেট", "ফর্ম", "এনওসি", "রেকমেন্ডেশন", "সিলেবাস"),
                context -> context.bangla
                        ? "Transcript, certificate, NOC, recommendation letter, registration form, leave application এসব সাধারণত Documents section বা department office থেকে handle করতে হয়। Specific document বললে আমি likely process explain করতে পারি।"
                        : "Transcript, certificate, NOC, recommendation letter, registration form, and leave application requests are usually handled through the Documents section or the department office. If you name a specific document, I can explain the likely process."));

        intentRules.add(rule(
                "notices",
                List.of("notice", "notices", "announcement", "announcements", "update", "news", "urgent notice",
                        "নোটিশ", "ঘোষণা", "আপডেট", "নিউজ", "জরুরি notice"),
                context -> context.bangla
                        ? "Department notice-এ registration date, exam schedule, policy update, workshop, আর event related information থাকে। Notices page নিয়মিত check করা safest, আর specific notice topic বললে আমি summarize করতে পারি।"
                        : "Department notices usually include registration dates, exam schedules, policy updates, workshops, and events. The safest approach is to check the Notices page regularly, and I can summarize a specific notice topic if you mention it."));

        intentRules.add(rule(
                "scholarship-career",
                List.of("scholarship", "internship", "research", "career", "job", "thesis", "project", "higher study", "study plan", "semester plan",
                        "স্কলারশিপ", "ইন্টার্নশিপ", "রিসার্চ", "ক্যারিয়ার", "জব", "থিসিস", "প্রজেক্ট", "higher study", "স্টাডি প্ল্যান", "সেমিস্টার প্ল্যান"),
                context -> context.bangla
                        ? "তোমার CGPA " + value(context.student, "cgpa", "N/A")
                                + " হওয়ায় internship, research, আর higher study preparation-এর জন্য তুমি ভালো position-এ আছো। Strong grades, project work, advisor communication, আর specialization skill-building এ focus করো।"
                        : "With a CGPA of " + value(context.student, "cgpa", "N/A")
                                + ", you are in a strong position for internships, research, and higher-study preparation. Focus on strong grades, project work, advisor communication, and skill-building in your specialization area."));

        intentRules.add(rule(
                "account-login",
                List.of("login", "sign in", "password", "account", "cannot login", "can't login", "forgot password", "portal issue",
                        "লগইন", "সাইন ইন", "পাসওয়ার্ড", "পাসওয়ার্ড", "অ্যাকাউন্ট", "ঢুকতে পারছি না"),
                context -> context.bangla
                        ? "Login problem হলে আগে email, role, আর password ঠিক আছে কিনা confirm করো। Password forgotten হলে admin/department reset লাগতে পারে। Technical issue হলে backend running আছে কিনা আর API base URL ঠিক আছে কিনা check করো।"
                        : "For login problems, first confirm the correct email, role, and password. If the password is forgotten, you may need an admin or department reset. For technical issues, verify that the backend is running and the API base URL is correct."));
    }

    private IntentRule rule(String name, List<String> keywords, Function<ChatContext, String> responseBuilder) {
        return new IntentRule(name, keywords, responseBuilder);
    }

    private String buildCompositeAnswer(ChatContext context, List<IntentRule> matchedRules) {
        List<String> sections = new ArrayList<>();
        Set<String> used = new LinkedHashSet<>();

        for (IntentRule rule : matchedRules) {
            if (used.contains(rule.name) || sections.size() >= 3) {
                continue;
            }
            used.add(rule.name);
            sections.add(rule.responseBuilder.apply(context));
        }

        if (sections.isEmpty()) {
            return buildFallbackAnswer(context.originalQuestion, context.student, context.faculty, context.courses, context.bangla);
        }

        return String.join(context.bangla ? "\n\n" : "\n\n", sections);
    }

    private String buildFallbackAnswer(
            String question,
            Map<String, Object> student,
            Map<String, Object> faculty,
            List<Map<String, Object>> courses,
            boolean bangla) {
        if (bangla) {
            return "তোমার প্রশ্ন \"" + question + "\" এর exact policy answer আমার কাছে নাও থাকতে পারে, কিন্তু academic context ধরে help করতে পারি। "
                    + "তুমি এখন " + value(student, "semester", "current") + " semester-এ আছো, CGPA "
                    + value(student, "cgpa", "N/A") + ", advisor " + value(student, "advisor", value(faculty, "name", "advisor"))
                    + "। Active course: " + courseSummary(courses)
                    + "। University-specific rule হলে department office বা advisor-এর সাথে confirm করা safest।";
        }
        return "I may not have an exact policy answer for \"" + question
                + "\", but I can still help based on your academic context. You are currently in "
                + value(student, "semester", "your current") + " semester with CGPA "
                + value(student, "cgpa", "N/A") + ", advised by "
                + value(student, "advisor", value(faculty, "name", "your advisor")) + ". Your active courses are "
                + courseSummary(courses)
                + ". If this is a university-specific rule, confirming it with the department office or your advisor is safest.";
    }

    private List<String> buildFollowUps(String topic, boolean bangla) {
        return switch (topic) {
            case "cgpa" -> bangla
                    ? List.of("CGPA improve করার উপায় কী?", "আমি কত credit complete করেছি?")
                    : List.of("How can I improve my CGPA?", "How many credits have I completed?");
            case "graduation" -> bangla
                    ? List.of("আর কত credit বাকি?", "Graduation-এর আগে কোন document লাগবে?")
                    : List.of("How many credits are left?", "What documents are needed before graduation?");
            case "advisor" -> bangla
                    ? List.of("Advisor-এর সাথে কী discuss করব?", "Office hour কখন?")
                    : List.of("What should I discuss with my advisor?", "When are the office hours?");
            case "schedule" -> bangla
                    ? List.of("আমার lab conflict আছে?", "এই সপ্তাহে কী prioritize করব?")
                    : List.of("Do I have any lab conflicts?", "What should I prioritize this week?");
            case "course-registration" -> bangla
                    ? List.of("আমি course retake করতে পারি?", "Course drop করলে কী হবে?")
                    : List.of("Can I retake a course?", "What happens if I drop a course?");
            case "payment" -> bangla
                    ? List.of("Unpaid dues registration block করবে?", "Payment confirm কীভাবে করব?")
                    : List.of("Will unpaid dues block registration?", "How do I confirm a payment?");
            default -> bangla
                    ? List.of("Registration নিয়ে বলো", "আমার graduation progress explain করো")
                    : List.of("Tell me about registration", "Explain my graduation progress");
        };
    }

    private int remainingCredits(Map<String, Object> student) {
        int total = parseInt(student.get("credits_total"));
        int completed = parseInt(student.get("credits_completed"));
        return Math.max(total - completed, 0);
    }

    private String courseSummary(List<Map<String, Object>> courses) {
        if (courses == null || courses.isEmpty()) {
            return "no active courses on record";
        }

        List<String> labels = new ArrayList<>();
        for (Map<String, Object> course : courses) {
            labels.add(value(course, "code", "N/A") + " - " + value(course, "name", "Course"));
        }
        return String.join(", ", labels);
    }

    private int parseInt(Object value) {
        if (value instanceof Number number) {
            return number.intValue();
        }
        try {
            return Integer.parseInt(String.valueOf(value));
        } catch (Exception ignored) {
            return 0;
        }
    }

    private String value(Map<String, Object> source, String key, String fallback) {
        if (source == null || source.get(key) == null) {
            return fallback;
        }
        return String.valueOf(source.get(key));
    }

    private Set<String> tokenize(String value) {
        Set<String> tokens = new LinkedHashSet<>();
        if (value == null || value.isBlank()) {
            return tokens;
        }
        for (String token : value.split(" ")) {
            if (token.length() >= 2) {
                tokens.add(token);
            }
        }
        return tokens;
    }

    private boolean containsBangla(String value) {
        return value != null && value.matches(".*[\\u0980-\\u09FF].*");
    }

    private String normalize(String value) {
        return value == null
                ? ""
                : value.toLowerCase(Locale.ROOT)
                        .replaceAll("[^\\p{L}\\p{Nd} ]", " ")
                        .replaceAll("\\s+", " ")
                        .trim();
    }

    private record IntentRule(String name, List<String> keywords, Function<ChatContext, String> responseBuilder) {
        int score(String normalizedQuestion, Set<String> tokens) {
            int score = 0;
            for (String keyword : keywords) {
                String normalizedKeyword = keyword.toLowerCase(Locale.ROOT);
                if (normalizedQuestion.contains(normalizedKeyword)) {
                    score += Math.max(3, normalizedKeyword.split(" ").length * 2);
                }
                for (String token : normalizedKeyword.split(" ")) {
                    if (tokens.contains(token)) {
                        score += 1;
                    }
                }
            }
            return score;
        }
    }

    private record ChatContext(
            String originalQuestion,
            String normalizedQuestion,
            Set<String> tokens,
            Map<String, Object> student,
            Map<String, Object> faculty,
            List<Map<String, Object>> courses,
            boolean bangla) {
    }
}
