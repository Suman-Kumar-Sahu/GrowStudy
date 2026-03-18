import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import { FaBell, FaTimes } from "react-icons/fa";

export default function Navbar({ user, messagesCount, hasNew, handleLogout, setMenuOpen }) {
  return (
    <nav className="navbar-links active">
      {user?.role === "student" && (
        <>
          <Link to="/jobs" onClick={() => setMenuOpen(false)}>Explore Jobs</Link>
          <Link to="/student/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          <Link to="/student/messages" className="bell-link" onClick={() => setMenuOpen(false)}>
            <FaBell size={20} className={hasNew ? "glow" : ""} />
            {messagesCount > 0 && <span className="notification-badge">{messagesCount}</span>}
          </Link>
        </>
      )}

      {user?.role === "recruiter" && (
        <>
          <Link to="/recruiter" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          <Link to="/recruiter/applications" onClick={() => setMenuOpen(false)}>Applicants</Link>
        </>
      )}
      <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>

      {user ? (
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      ) : (
        <>
          <Link to="/user/login" onClick={() => setMenuOpen(false)}>Login</Link>
          <Link to="/user/register" onClick={() => setMenuOpen(false)}>Register</Link>
        </>
      )}
    </nav>
  );
}
