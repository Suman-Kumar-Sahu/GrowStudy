import React, { useContext, lazy, Suspense } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { PageLoader } from "../componets/ui/Loader.jsx";

const Home = lazy(() => import("../pages/Home.jsx"));
const Login = lazy(() => import("../pages/Login.jsx"));
const Register = lazy(() => import("../pages/Register.jsx"));
const Profile = lazy(() => import("../pages/Profile.jsx"));
const ProfileVisit = lazy(() => import("../pages/ProfileVisit.jsx"));
const JobList = lazy(() => import("../pages/JobList.jsx"));
const StudentDashboard = lazy(() => import("../pages/StudentDashboard.jsx"));
const StudentMessages = lazy(() => import("../pages/StudentMessages.jsx"));
const AIInsightsPage = lazy(() => import("../pages/AIInsightsPage.jsx"));
const RecruiterDashboard = lazy(() => import("../pages/RecruiterDashboard.jsx"));
const RecruiterApplications = lazy(() => import("../pages/RecruiterApplications.jsx"));
const NotFound = lazy(() => import("../pages/NotFound.jsx"));

import Layout from "../layout/Layout.jsx";

function ProtectedRoute() {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <PageLoader text="Restoring session…" />;
  if (!user) return <Navigate to="/user/login" replace />;
  return <Layout><Outlet /></Layout>;
}

function RoleRoute({ role }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/user/login" replace />;
  if (user.role !== role) return <Navigate to="/" replace />;
  return <Outlet />;
}

function PublicRoute({ children }) {
  const { user } = useContext(AuthContext);
  if (user) {
    return <Navigate to={user.role === "recruiter" ? "/recruiter" : "/jobs"} replace />;
  }
  return children;
}

export default function AppRoutes() {
  const { loading } = useContext(AuthContext);

  if (loading) return <PageLoader text="Loading CareerNest…" />;

  return (
    <Suspense fallback={<PageLoader text="Loading page…" />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/user/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/user/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Protected routes (require auth) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<ProfileVisit />} />

          {/* Student-only */}
          <Route element={<RoleRoute role="student" />}>
            <Route path="/jobs" element={<JobList />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/messages" element={<StudentMessages />} />
            <Route path="/student/ai-insights" element={<AIInsightsPage />} />
          </Route>

          {/* Recruiter-only */}
          <Route element={<RoleRoute role="recruiter" />}>
            <Route path="/recruiter" element={<RecruiterDashboard />} />
            <Route path="/recruiter/applications" element={<RecruiterApplications />} />
          </Route>
        </Route>

        {/* 404 catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}