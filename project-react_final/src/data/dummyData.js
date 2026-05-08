const bootstrap = typeof window !== "undefined" ? window.__ACADEMIC_DMS_DATA__ : undefined;
const fromBootstrap = (key, fallback) => bootstrap?.[key] ?? fallback;

export const studentData = fromBootstrap("studentData", {
  id: "DIU-AI-2021-0423",
  name: "Akash Rahman",
  email: "akash.rahman@diu.edu.bd",
  department: "Computer Science & Engineering",
  program: "B.Sc. in Artificial Intelligence Engineering",
  semester: "6th",
  batch: "2021",
  cgpa: 3.94,
  credits_completed: 96,
  credits_total: 162,
  avatar: null,
  advisor: "Dr. Farhana Islam",
  standing: "Good Standing",
  warnings: 0,
});

export const facultyData = fromBootstrap("facultyData", {
  id: "DIU-FAC-2015-007",
  name: "Dr. Farhana Islam",
  email: "farhana.islam@diu.edu.bd",
  department: "Computer Science & Engineering",
  designation: "Associate Professor",
  specialization: "Machine Learning, NLP",
  room: "AB-5-401",
  officeHours: "Sun-Tue: 2PM-4PM",
  avatar: null,
  courses: ["CSE 3101", "CSE 4201", "AIE 3011"],
});

export const classSchedule = fromBootstrap("classSchedule", [
  { day: "Sunday", period: "08:00-09:30", course: "Object-Oriented Programming", code: "CSE 3101", room: "3-209", instructor: "Dr. Farhana Islam", type: "Lecture" },
  { day: "Sunday", period: "10:00-11:30", course: "Computer Networks", code: "CSE 3201", room: "Lab-2", instructor: "Md. Hasan Mahmud", type: "Lab" },
  { day: "Monday", period: "08:00-09:30", course: "Accounting", code: "BUS 2101", room: "2-105", instructor: "Tasnuva Sultana", type: "Lecture" },
  { day: "Monday", period: "12:00-01:30", course: "AI Fundamentals", code: "AIE 3011", room: "4-302", instructor: "Dr. Farhana Islam", type: "Lecture" },
  { day: "Tuesday", period: "08:00-09:30", course: "Object-Oriented Programming", code: "CSE 3101", room: "Lab-1", instructor: "Dr. Farhana Islam", type: "Lab" },
  { day: "Tuesday", period: "10:00-11:30", course: "Computer Networks", code: "CSE 3201", room: "3-209", instructor: "Md. Hasan Mahmud", type: "Lecture" },
  { day: "Wednesday", period: "08:00-09:30", course: "AI Fundamentals", code: "AIE 3011", room: "Lab-3", instructor: "Dr. Farhana Islam", type: "Lab" },
  { day: "Wednesday", period: "12:00-01:30", course: "Accounting", code: "BUS 2101", room: "2-105", instructor: "Tasnuva Sultana", type: "Lecture" },
  { day: "Thursday", period: "08:00-09:30", course: "Computer Networks", code: "CSE 3201", room: "Lab-2", instructor: "Md. Hasan Mahmud", type: "Lab" },
  { day: "Thursday", period: "10:00-11:30", course: "Object-Oriented Programming", code: "CSE 3101", room: "3-209", instructor: "Dr. Farhana Islam", type: "Lecture" },
]);

export const examSchedule = fromBootstrap("examSchedule", [
  { date: "2025-08-10", course: "Object-Oriented Programming", code: "CSE 3101", time: "09:00 AM", room: "Exam Hall-A", type: "Midterm", duration: "2h" },
  { date: "2025-08-12", course: "Computer Networks", code: "CSE 3201", time: "09:00 AM", room: "Exam Hall-B", type: "Midterm", duration: "2h" },
  { date: "2025-08-14", course: "Accounting", code: "BUS 2101", time: "02:00 PM", room: "Exam Hall-C", type: "Midterm", duration: "2h" },
  { date: "2025-08-16", course: "AI Fundamentals", code: "AIE 3011", time: "09:00 AM", room: "Exam Hall-A", type: "Midterm", duration: "2h" },
  { date: "2025-10-01", course: "Object-Oriented Programming", code: "CSE 3101", time: "09:00 AM", room: "Exam Hall-A", type: "Final", duration: "3h" },
  { date: "2025-10-03", course: "Computer Networks", code: "CSE 3201", time: "09:00 AM", room: "Exam Hall-B", type: "Final", duration: "3h" },
]);

export const notices = fromBootstrap("notices", [
  { id: 1, title: "Midterm Examination Schedule Released", category: "Exam", date: "2025-07-15", priority: "high", content: "The midterm examination schedule for Summer 2025 semester has been published. Students are advised to check their assigned rooms.", author: "Exam Controller" },
  { id: 2, title: "Course Registration for Fall 2025", category: "Registration", date: "2025-07-10", priority: "high", content: "Course registration for Fall 2025 will begin on July 25. Students must clear all dues before registration.", author: "Academic Office" },
  { id: 3, title: "Research Symposium - Call for Papers", category: "Event", date: "2025-07-08", priority: "medium", content: "The Department of CSE invites students and faculty to submit research papers for the Annual Research Symposium 2025.", author: "CIS Club" },
  { id: 4, title: "Library Extended Hours - Exam Period", category: "Academic", date: "2025-07-05", priority: "low", content: "The central library will remain open until midnight during the examination period (Aug 1-20).", author: "Library" },
  { id: 5, title: "AI Workshop - Machine Learning Basics", category: "Workshop", date: "2025-07-01", priority: "medium", content: "A 3-day workshop on practical machine learning using Python is scheduled for July 20-22.", author: "CIS Club" },
  { id: 6, title: "Updated Grade Policy for Lab Courses", category: "Academic", date: "2025-06-28", priority: "medium", content: "The department has updated the grading policy for laboratory courses. Please review the updated rubric on the portal.", author: "Dept. Office" },
]);

export const queries = fromBootstrap("queries", [
  { id: 1, studentId: "DIU-AI-2021-0423", studentName: "Akash Rahman", subject: "Course Waiver for CSE 3105", category: "Course Selection", status: "pending", date: "2025-07-14", priority: "medium", message: "I would like to request a waiver for CSE 3105 as I have completed equivalent coursework.", response: null },
  { id: 2, studentId: "DIU-AI-2021-0456", studentName: "Sara Begum", subject: "Graduation Requirement Clarification", category: "Graduation", status: "resolved", date: "2025-07-10", priority: "high", message: "Can you clarify if AIE 4099 counts toward graduation credit hours?", response: "Yes, AIE 4099 counts as 3 credit hours toward your graduation requirements." },
  { id: 3, studentId: "DIU-AI-2021-0389", studentName: "Rafi Hossain", subject: "GPA Recalculation Request", category: "Academic Records", status: "pending", date: "2025-07-09", priority: "high", message: "There seems to be an error in my GPA calculation for the Spring semester.", response: null },
  { id: 4, studentId: "DIU-AI-2021-0412", studentName: "Nadia Islam", subject: "Lab Schedule Conflict", category: "Scheduling", status: "resolved", date: "2025-07-07", priority: "low", message: "I have a conflict between two lab sessions on Wednesday.", response: "The conflict has been noted. Please join the alternate section on Thursday 10:00 AM." },
  { id: 5, studentId: "DIU-AI-2021-0423", studentName: "Akash Rahman", subject: "Advising Session Rescheduling", category: "Advising", status: "closed", date: "2025-07-01", priority: "low", message: "Can we reschedule our advising session to next week?", response: "Rescheduled to July 8, 2PM. Please confirm." },
]);

export const academicProgress = fromBootstrap("academicProgress", {
  semesterGPA: [
    { semester: "1st", gpa: 3.75 },
    { semester: "2nd", gpa: 3.82 },
    { semester: "3rd", gpa: 3.88 },
    { semester: "4th", gpa: 3.91 },
    { semester: "5th", gpa: 3.94 },
    { semester: "6th (Current)", gpa: null },
  ],
  courses: [
    { code: "CSE 3101", name: "Object-Oriented Programming", credits: 3, grade: null, marks: null, status: "ongoing" },
    { code: "CSE 3201", name: "Computer Networks", credits: 3, grade: null, marks: null, status: "ongoing" },
    { code: "BUS 2101", name: "Accounting", credits: 3, grade: null, marks: null, status: "ongoing" },
    { code: "AIE 3011", name: "AI Fundamentals", credits: 3, grade: null, marks: null, status: "ongoing" },
    { code: "CSE 2201", name: "Data Structures & Algorithms", credits: 3, grade: "A+", marks: 95, status: "completed" },
    { code: "CSE 2301", name: "Database Management Systems", credits: 3, grade: "A", marks: 88, status: "completed" },
    { code: "MAT 2101", name: "Discrete Mathematics", credits: 3, grade: "A+", marks: 93, status: "completed" },
    { code: "CSE 2101", name: "Computer Architecture", credits: 3, grade: "A", marks: 85, status: "completed" },
  ],
});

export const faqs = fromBootstrap("faqs", [
  { id: 1, question: "How do I calculate my CGPA?", answer: "Your CGPA is calculated by dividing the total grade points earned by the total credit hours attempted. Each letter grade carries specific points: A+ = 4.0, A = 3.75, A- = 3.50, B+ = 3.25, B = 3.0, etc.", category: "Academic", helpful: 45 },
  { id: 2, question: "What are the graduation requirements?", answer: "To graduate, you must complete a minimum of 162 credit hours with a CGPA of at least 2.5, including all core, elective, and thesis/project courses specified in your program curriculum.", category: "Graduation", helpful: 38 },
  { id: 3, question: "How do I register for courses?", answer: "Log into the student portal, navigate to Course Registration, select your desired courses from the available list, and submit. Registration opens two weeks before the semester begins.", category: "Registration", helpful: 52 },
  { id: 4, question: "Can I drop a course after registration?", answer: "Yes, you can drop a course within the first two weeks of the semester without any academic penalty. After that period, a 'W' grade will be recorded on your transcript.", category: "Course Management", helpful: 29 },
  { id: 5, question: "How do I apply for a leave of absence?", answer: "Submit a Leave Application form (available in Documents section) to the department office with supporting documents. Approval is subject to academic standing and department policy.", category: "Administrative", helpful: 21 },
  { id: 6, question: "What is the attendance policy?", answer: "A minimum of 75% attendance is mandatory in each course. Students falling below this threshold may be barred from appearing in the final examination.", category: "Academic", helpful: 67 },
  { id: 7, question: "How do I request a grade rechecking?", answer: "Fill out the Grade Rechecking Request form and submit it to the department office within 7 days of result publication. A processing fee may apply.", category: "Grades", helpful: 33 },
  { id: 8, question: "When are advising sessions available?", answer: "Faculty advisors hold office hours as posted on their profiles. You can also book advising sessions through the Advising module in this portal.", category: "Advising", helpful: 41 },
]);

export const advisingSessions = fromBootstrap("advisingSessions", [
  { id: 1, studentName: "Akash Rahman", date: "2025-07-18", time: "02:00 PM", advisor: "Dr. Farhana Islam", topic: "Course Selection for Fall 2025", status: "confirmed", mode: "In-person" },
  { id: 2, studentName: "Sara Begum", date: "2025-07-19", time: "03:00 PM", advisor: "Dr. Farhana Islam", topic: "Graduation Checklist Review", status: "pending", mode: "Online" },
  { id: 3, studentName: "Rafi Hossain", date: "2025-07-21", time: "02:30 PM", advisor: "Md. Hasan Mahmud", topic: "Internship Guidance", status: "confirmed", mode: "Online" },
  { id: 4, studentName: "Nadia Islam", date: "2025-07-22", time: "11:00 AM", advisor: "Dr. Farhana Islam", topic: "Research Paper Review", status: "pending", mode: "In-person" },
]);

export const documents = fromBootstrap("documents", [
  { id: 1, name: "Course Registration Form", type: "form", category: "Registration", available: true, lastUpdated: "2025-07-01" },
  { id: 2, name: "Course Withdrawal Form", type: "form", category: "Registration", available: true, lastUpdated: "2025-06-15" },
  { id: 3, name: "Grade Rechecking Request", type: "form", category: "Academic", available: true, lastUpdated: "2025-05-20" },
  { id: 4, name: "Leave Application", type: "form", category: "Administrative", available: true, lastUpdated: "2025-06-01" },
  { id: 5, name: "NOC Certificate Request", type: "certificate", category: "Certificate", available: true, lastUpdated: "2025-07-10" },
  { id: 6, name: "Recommendation Letter Request", type: "certificate", category: "Certificate", available: true, lastUpdated: "2025-07-10" },
  { id: 7, name: "Transcript Request", type: "certificate", category: "Academic", available: true, lastUpdated: "2025-07-08" },
  { id: 8, name: "Summer 2025 Syllabus - CSE 3101", type: "document", category: "Course", available: true, lastUpdated: "2025-06-20" },
  { id: 9, name: "Lab Manual - CSE 3201", type: "document", category: "Course", available: true, lastUpdated: "2025-06-22" },
  { id: 10, name: "Department Handbook 2025", type: "document", category: "Administrative", available: true, lastUpdated: "2025-01-15" },
]);

export const studentRecords = fromBootstrap("studentRecords", [
  { id: "DIU-AI-2021-0423", name: "Akash Rahman", semester: "6th", cgpa: 3.94, credits: 96, standing: "Good", advisor: "Dr. Farhana Islam", warnings: 0, status: "active" },
  { id: "DIU-AI-2021-0456", name: "Sara Begum", semester: "6th", cgpa: 3.72, credits: 96, standing: "Good", advisor: "Dr. Farhana Islam", warnings: 0, status: "active" },
  { id: "DIU-AI-2021-0389", name: "Rafi Hossain", semester: "6th", cgpa: 2.9, credits: 90, standing: "Warning", advisor: "Dr. Farhana Islam", warnings: 1, status: "active" },
  { id: "DIU-AI-2021-0412", name: "Nadia Islam", semester: "6th", cgpa: 3.55, credits: 93, standing: "Good", advisor: "Dr. Farhana Islam", warnings: 0, status: "active" },
  { id: "DIU-AI-2021-0398", name: "Tanvir Ahmed", semester: "6th", cgpa: 2.45, credits: 84, standing: "Probation", advisor: "Dr. Farhana Islam", warnings: 2, status: "active" },
  { id: "DIU-AI-2021-0441", name: "Mitu Roy", semester: "6th", cgpa: 3.88, credits: 96, standing: "Good", advisor: "Md. Hasan Mahmud", warnings: 0, status: "active" },
  { id: "DIU-AI-2020-0312", name: "Karim Sheikh", semester: "8th", cgpa: 3.5, credits: 140, standing: "Good", advisor: "Dr. Farhana Islam", warnings: 0, status: "graduating" },
]);

export const chatbotResponses = fromBootstrap("chatbotResponses", {
  registration: "Course registration opens 2 weeks before each semester. Ensure all dues are cleared, then go to Academic -> Course Registration to enroll.",
  cgpa: "Your current CGPA is 3.94. You need a minimum of 2.5 to graduate. Keep up the excellent work!",
  graduation: "You've completed 96 of 162 required credits. At your current pace, you're on track to graduate in 2027.",
  schedule: "Your current class schedule has 4 courses across Sunday-Thursday. Check the Schedule tab for details.",
  advisor: "Your academic advisor is Dr. Farhana Islam. Office hours: Sun-Tue, 2PM-4PM, Room AB-5-401.",
  default: "I'm here to help! You can ask about registration, CGPA, graduation requirements, schedules, or your academic advisor.",
});

