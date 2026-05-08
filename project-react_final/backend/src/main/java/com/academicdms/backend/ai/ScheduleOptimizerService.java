package com.academicdms.backend.ai;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.academicdms.backend.AcademicDataStore;
import com.academicdms.backend.AcademicRuntimeService;

@Service
public class ScheduleOptimizerService {

    private static final List<String> DAYS = List.of("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday");
    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("H:mm", Locale.ENGLISH);

    private final AcademicDataStore dataStore;
    private final AcademicRuntimeService runtimeService;

    public ScheduleOptimizerService(AcademicDataStore dataStore, AcademicRuntimeService runtimeService) {
        this.dataStore = dataStore;
        this.runtimeService = runtimeService;
    }

    public Optional<Map<String, Object>> optimize(String studentId) {
        return runtimeService.findStudentProfile(studentId).map(profile -> {
            String semester = String.valueOf(profile.getOrDefault("semester", "Unknown"));
            Set<String> enrolledCodes = new LinkedHashSet<>();
            for (Map<String, Object> course : runtimeService.getEnrolledCourses(studentId)) {
                enrolledCodes.add(String.valueOf(course.get("code")));
            }

            List<Map<String, Object>> relevant = new ArrayList<>();
            for (Map<String, Object> item : dataStore.classSchedule()) {
                String code = String.valueOf(item.get("code"));
                if (enrolledCodes.contains(code)) {
                    relevant.add(new LinkedHashMap<>(item));
                }
            }

            relevant.sort(Comparator
                    .comparing((Map<String, Object> item) -> DAYS.indexOf(String.valueOf(item.get("day"))))
                    .thenComparing(item -> startMinutes(String.valueOf(item.get("period"))))
                    .thenComparing(item -> "Lab".equalsIgnoreCase(String.valueOf(item.get("type"))) ? 1 : 0));

            Map<String, List<Map<String, Object>>> scheduleByDay = new LinkedHashMap<>();
            List<Map<String, Object>> summary = new ArrayList<>();
            List<String> suggestions = new ArrayList<>();
            int weeklyTotal = 0;
            int conflicts = 0;

            for (String day : DAYS) {
                List<Map<String, Object>> dayItems = new ArrayList<>();
                for (Map<String, Object> item : relevant) {
                    if (day.equals(item.get("day"))) {
                        dayItems.add(withTimingMetrics(item));
                    }
                }

                dayItems.sort(Comparator.comparing(item -> startMinutes(String.valueOf(item.get("period")))));
                conflicts += countConflicts(dayItems);
                int idleMinutes = totalIdleMinutes(dayItems);
                weeklyTotal += dayItems.size();

                String suggestion = buildDaySuggestion(day, dayItems.size(), idleMinutes);
                suggestions.add(suggestion);
                scheduleByDay.put(day, dayItems);
                summary.add(Map.of(
                        "day", day,
                        "totalClasses", dayItems.size(),
                        "idleMinutes", idleMinutes,
                        "suggestion", suggestion));
            }

            return Map.of(
                    "studentId", studentId,
                    "semester", semester,
                    "conflictFree", conflicts == 0,
                    "totalWeeklyClasses", weeklyTotal,
                    "scheduleByDay", scheduleByDay,
                    "dailySummary", summary,
                    "suggestions", suggestions,
                    "optimizerNotes", List.of(
                            "Classes are sorted to reduce idle gaps.",
                            "The summary highlights overloaded and balanced days.",
                            "Current output keeps lecture and lab slots conflict-free where possible."));
        });
    }

    private Map<String, Object> withTimingMetrics(Map<String, Object> item) {
        Map<String, Object> copy = new LinkedHashMap<>(item);
        String period = String.valueOf(item.get("period"));
        LocalTime start = toLocalTime(startMinutes(period));
        LocalTime end = toLocalTime(endMinutes(period));
        copy.put("startTime", start.toString());
        copy.put("endTime", end.toString());
        copy.put("durationMinutes", endMinutes(period) - startMinutes(period));
        return copy;
    }

    private int countConflicts(List<Map<String, Object>> dayItems) {
        int conflicts = 0;
        for (int i = 1; i < dayItems.size(); i++) {
            int previousEnd = endMinutes(String.valueOf(dayItems.get(i - 1).get("period")));
            int currentStart = startMinutes(String.valueOf(dayItems.get(i).get("period")));
            if (currentStart < previousEnd) {
                conflicts++;
            }
        }
        return conflicts;
    }

    private int totalIdleMinutes(List<Map<String, Object>> dayItems) {
        int idleMinutes = 0;
        for (int i = 1; i < dayItems.size(); i++) {
            int previousEnd = endMinutes(String.valueOf(dayItems.get(i - 1).get("period")));
            int currentStart = startMinutes(String.valueOf(dayItems.get(i).get("period")));
            if (currentStart > previousEnd) {
                idleMinutes += currentStart - previousEnd;
            }
        }
        return idleMinutes;
    }

    private String buildDaySuggestion(String day, int classCount, int idleMinutes) {
        if (classCount >= 3) {
            return day + " overloaded";
        }
        if (classCount == 0) {
            return day + " free for self-study";
        }
        if (idleMinutes > 90) {
            return day + " has long gaps";
        }
        return day + " balanced";
    }

    private int startMinutes(String period) {
        String[] parts = period.split("-");
        return parseClockMinutes(parts[0].trim());
    }

    private int endMinutes(String period) {
        String[] parts = period.split("-");
        int start = parseClockMinutes(parts[0].trim());
        int end = parseClockMinutes(parts[1].trim());
        if (end <= start) {
            end += 12 * 60;
        }
        return end;
    }

    private int parseClockMinutes(String timeValue) {
        LocalTime time = LocalTime.parse(timeValue, TIME_FORMAT);
        return time.getHour() * 60 + time.getMinute();
    }

    private LocalTime toLocalTime(int minutes) {
        return LocalTime.of((minutes / 60) % 24, minutes % 60);
    }
}
