import React, { useContext } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

// Pages
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Profile from "../pages/Profile.jsx";
import JobList from "../pages/JobList.jsx";
import RecruiterDashboard from "../pages/RecruiterDashboard.jsx";
import StudentDashboard from "../pages/StudentDashboard.jsx";
import RecruiterApplications from "../pages/RecruiterApplications.jsx";
import StudentMessages from "../pages/StudentMessages.jsx"; 
import NotFound from "../pages/NotFound.jsx";
import ProfileVisit from "../pages/ProfileVisit.jsx";

// Components
import Layout from "../layout/Layout.jsx";

export default function AppRoutes() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="text-center mt-20 text-blue-600">
        Loading...
      </div>
    );
  }

  // General protected route wrapper
  const ProtectedRoute = () => {
    if (!user) return <Navigate to="/user/login" />;
    return (
      <Layout>
        <Outlet />
      </Layout>
    );
  };

  // Role-based route wrapper
  const RoleRoute = ({ role }) => {
    if (!user) return <Navigate to="/user/login" />;
    if (user.role !== role) return <Navigate to="/" />;

    return <Outlet />;
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/user/login" element={<Login />} />
      <Route path="/user/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:id" element={<ProfileVisit />} /> 

        {/* Student Routes */}
        <Route element={<RoleRoute role="student" />}>
          <Route path="/jobs" element={<JobList />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/messages" element={<StudentMessages />} />   
        </Route>

        {/* Recruiter Routes */}
        <Route element={<RoleRoute role="recruiter" />}>
          <Route path="/recruiter" element={<RecruiterDashboard />} />
          <Route path="/recruiter/applications" element={<RecruiterApplications />}/>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
