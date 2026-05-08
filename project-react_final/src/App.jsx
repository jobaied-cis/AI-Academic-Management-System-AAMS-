import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Layout from "./components/Layout";

const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));

const StudentDashboard = lazy(() => import("./pages/student/StudentDashboard"));
const Schedule = lazy(() => import("./pages/student/Schedule"));
const Notices = lazy(() => import("./pages/student/Notices"));
const Queries = lazy(() => import("./pages/student/Queries"));
const Progress = lazy(() => import("./pages/student/Progress"));
const FAQ = lazy(() => import("./pages/student/FAQ"));
const Advising = lazy(() => import("./pages/student/Advising"));
const StudentProfile = lazy(() => import("./pages/student/StudentProfile"));
const AIRecommendations = lazy(() => import("./pages/student/AIRecommendations"));
const Notifications = lazy(() => import("./pages/student/Notifications"));

const FacultyDashboard = lazy(() => import("./pages/faculty/FacultyDashboard"));
const ManageQueries = lazy(() => import("./pages/faculty/ManageQueries"));
const ManageNotices = lazy(() => import("./pages/faculty/ManageNotices"));
const StudentRecords = lazy(() => import("./pages/faculty/StudentRecords"));
const FacultyScheduling = lazy(() => import("./pages/faculty/FacultyScheduling"));
const FacultyProfile = lazy(() => import("./pages/faculty/FacultyProfile"));

const Documents = lazy(() => import("./pages/Documents"));

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/login" replace />;
  return children;
};

const studentRoutes = [
  { path: "dashboard", element: <StudentDashboard /> },
  { path: "schedule", element: <Schedule /> },
  { path: "notices", element: <Notices /> },
  { path: "queries", element: <Queries /> },
  { path: "progress", element: <Progress /> },
  { path: "faq", element: <FAQ /> },
  { path: "advising", element: <Advising /> },
  { path: "documents", element: <Documents /> },
  { path: "profile", element: <StudentProfile /> },
  { path: "recommendations", element: <AIRecommendations /> },
  { path: "notifications", element: <Notifications /> },
];

const facultyRoutes = [
  { path: "dashboard", element: <FacultyDashboard /> },
  { path: "queries", element: <ManageQueries /> },
  { path: "notices", element: <ManageNotices /> },
  { path: "students", element: <StudentRecords /> },
  { path: "scheduling", element: <FacultyScheduling /> },
  { path: "documents", element: <Documents /> },
  { path: "profile", element: <FacultyProfile /> },
];

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <Routes>
        <Route path="/login" element={user ? <Navigate to={user.role === "student" ? "/student/dashboard" : "/faculty/dashboard"} /> : <Login />} />
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/student" element={<ProtectedRoute role="student"><Layout /></ProtectedRoute>}>
          {studentRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>

        <Route path="/faculty" element={<ProtectedRoute role="faculty"><Layout /></ProtectedRoute>}>
          {facultyRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
