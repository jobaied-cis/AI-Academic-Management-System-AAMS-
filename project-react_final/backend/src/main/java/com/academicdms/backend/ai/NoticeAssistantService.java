package com.academicdms.backend.ai;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;

@Service
public class NoticeAssistantService {

    private final NoticeClassifierService noticeClassifierService;

    public NoticeAssistantService(NoticeClassifierService noticeClassifierService) {
        this.noticeClassifierService = noticeClassifierService;
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> ask(String question) {
        boolean bangla = containsBangla(question);
        String normalized = normalize(question);
        List<Map<String, Object>> notices = new ArrayList<>(
                (List<Map<String, Object>>) noticeClassifierService.classifyAll().getOrDefault("notices", List.of()));

        notices.sort(Comparator.comparingInt(this::urgencyScore).reversed());

        String topic = detectTopic(normalized);
        List<Map<String, Object>> relevant = filterRelevantNotices(notices, normalized, topic);
        if (relevant.isEmpty()) {
            relevant = notices.stream().limit(3).toList();
        }

        String answer = switch (topic) {
            case "registration" -> registrationAnswer(relevant, bangla);
            case "exam" -> examAnswer(relevant, bangla);
            case "event" -> eventAnswer(relevant, bangla);
            case "urgent" -> urgentAnswer(relevant, bangla);
            case "action" -> actionAnswer(relevant, bangla);
            default -> generalAnswer(relevant, notices, bangla);
        };

        return Map.of(
                "question", question,
                "matchedTopic", topic,
                "answer", answer,
                "referencedNotices", relevant.stream().limit(3).map(notice -> String.valueOf(notice.get("title"))).toList(),
                "suggestedFollowUps", bangla
                        ? List.of("সবচেয়ে জরুরি notice কোনটা?", "রেজিস্ট্রেশন নিয়ে কী করতে হবে?")
                        : List.of("Which notice is most urgent?", "What should I do for registration notices?"));
    }

    private List<Map<String, Object>> filterRelevantNotices(List<Map<String, Object>> notices, String normalized, String topic) {
        List<Map<String, Object>> relevant = new ArrayList<>();
        Set<String> keywords = topicKeywords(topic);
        for (Map<String, Object> notice : notices) {
            String combined = normalize(
                    String.valueOf(notice.getOrDefault("title", "")) + " " + String.valueOf(notice.getOrDefault("content", "")));
            boolean matched = keywords.stream().anyMatch(combined::contains);
            if (!matched) {
                for (String token : normalized.split(" ")) {
                    if (token.length() > 2 && combined.contains(token)) {
                        matched = true;
                        break;
                    }
                }
            }
            if (matched) {
                relevant.add(notice);
            }
        }
        return relevant;
    }

    private Set<String> topicKeywords(String topic) {
        Set<String> keywords = new LinkedHashSet<>();
        switch (topic) {
            case "registration" -> keywords.addAll(List.of("registration", "register", "course", "dues"));
            case "exam" -> keywords.addAll(List.of("exam", "midterm", "final", "quiz"));
            case "event" -> keywords.addAll(List.of("event", "workshop", "seminar", "symposium"));
            case "urgent", "action" -> keywords.addAll(List.of("deadline", "urgent", "submit", "immediately"));
            default -> {
            }
        }
        return keywords;
    }

    private String detectTopic(String normalized) {
        if (containsAny(normalized, "registration", "register", "রেজিস্ট্রেশন", "কোর্স", "dues", "বকেয়া")) {
            return "registration";
        }
        if (containsAny(normalized, "exam", "midterm", "final", "পরীক্ষা", "এক্সাম", "routine")) {
            return "exam";
        }
        if (containsAny(normalized, "event", "workshop", "seminar", "symposium", "ইভেন্ট", "ওয়ার্কশপ", "সেমিনার")) {
            return "event";
        }
        if (containsAny(normalized, "urgent", "জরুরি", "important", "deadline", "latest", "recent")) {
            return "urgent";
        }
        if (containsAny(normalized, "what should i do", "কি করব", "কি করতে হবে", "action", "করতে হবে")) {
            return "action";
        }
        return "general";
    }

    private String registrationAnswer(List<Map<String, Object>> relevant, boolean bangla) {
        Map<String, Object> top = relevant.get(0);
        if (bangla) {
            return "রেজিস্ট্রেশন সম্পর্কিত সবচেয়ে গুরুত্বপূর্ণ নোটিশ হলো \"" + top.get("title")
                    + "\"। আগে dues বা বকেয়া clear করতে হবে, তারপর portal status দেখে course registration complete করতে হবে। "
                    + "Deadline কাছে থাকলে আজই notice details follow করো।";
        }
        return "The most relevant registration notice is \"" + top.get("title")
                + "\". Clear dues first, then confirm your portal status and complete course registration before the deadline.";
    }

    private String examAnswer(List<Map<String, Object>> relevant, boolean bangla) {
        Map<String, Object> top = relevant.get(0);
        if (bangla) {
            return "পরীক্ষা সম্পর্কিত গুরুত্বপূর্ণ নোটিশ হিসেবে \"" + top.get("title")
                    + "\" আছে। Date, room, course code, আর form/deadline আগে check করা উচিত।";
        }
        return "An important exam-related notice is \"" + top.get("title")
                + "\". Focus on the exam date, room, course code, and any form or deadline mentioned there.";
    }

    private String eventAnswer(List<Map<String, Object>> relevant, boolean bangla) {
        Map<String, Object> top = relevant.get(0);
        if (bangla) {
            return "ইভেন্ট/ওয়ার্কশপ সম্পর্কিত notice হিসেবে \"" + top.get("title")
                    + "\" সবচেয়ে relevant। Registration window, venue, আর participation requirement আগে check করো।";
        }
        return "The most relevant event notice is \"" + top.get("title")
                + "\". Check the registration window, venue, and participation requirements first.";
    }

    private String urgentAnswer(List<Map<String, Object>> relevant, boolean bangla) {
        List<String> titles = relevant.stream().limit(2).map(notice -> String.valueOf(notice.get("title"))).toList();
        if (bangla) {
            return "এই মুহূর্তে সবচেয়ে জরুরি notice গুলোর মধ্যে আছে: " + String.join(", ", titles)
                    + ". Deadline, exam, আর registration related notice আগে follow করা উচিত।";
        }
        return "The most urgent notices right now include: " + String.join(", ", titles)
                + ". Prioritize deadline, exam, and registration-related items first.";
    }

    private String actionAnswer(List<Map<String, Object>> relevant, boolean bangla) {
        Map<String, Object> top = relevant.get(0);
        String action = String.valueOf(top.getOrDefault("recommendedAction", "Read the full notice carefully."));
        if (bangla) {
            return "\"" + top.get("title") + "\" notice-এর next step হলো: " + action
                    + "। Full notice পড়ে date আর requirement মিলিয়ে নাও।";
        }
        return "For the notice \"" + top.get("title") + "\", the next step is: " + action
                + ". Also read the full notice carefully for dates and requirements.";
    }

    private String generalAnswer(List<Map<String, Object>> relevant, List<Map<String, Object>> notices, boolean bangla) {
        long highPriority = notices.stream().filter(notice -> "high".equals(String.valueOf(notice.get("aiPriority")))).count();
        List<String> titles = relevant.stream().limit(3).map(notice -> String.valueOf(notice.get("title"))).toList();
        if (bangla) {
            return "এখন মোট " + notices.size() + "টা notice আছে, এর মধ্যে " + highPriority
                    + "টা high priority। সবচেয়ে relevant notice গুলো হলো: " + String.join(", ", titles)
                    + ". তুমি exam, registration, deadline, workshop, বা specific title ধরে আরও question করতে পারো।";
        }
        return "There are " + notices.size() + " notices right now, including " + highPriority
                + " high-priority items. The most relevant notices are: " + String.join(", ", titles)
                + ". You can ask specifically about exams, registration, deadlines, workshops, or a notice title.";
    }

    private int urgencyScore(Map<String, Object> notice) {
        Object score = notice.get("urgencyScore");
        return score instanceof Number number ? number.intValue() : 0;
    }

    private boolean containsBangla(String text) {
        return text != null && text.matches(".*[\\u0980-\\u09FF].*");
    }

    private String normalize(String value) {
        return value == null
                ? ""
                : value.toLowerCase(Locale.ROOT)
                        .replaceAll("[^\\p{L}\\p{Nd} ]", " ")
                        .replaceAll("\\s+", " ")
                        .trim();
    }

    private boolean containsAny(String value, String... needles) {
        for (String needle : needles) {
            if (value.contains(needle)) {
                return true;
            }
        }
        return false;
    }
}
