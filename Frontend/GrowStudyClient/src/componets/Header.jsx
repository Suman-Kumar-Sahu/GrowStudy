// src/components/Header.jsx
import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { FaBars, FaBell } from "react-icons/fa";
import api from "../api/Axios";
import Navbar from "./Navbar.jsx";
import "../styles/Header.css";

export default function Header() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [messagesCount, setMessagesCount] = useState(0);
  const [hasNew, setHasNew] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Detect screen resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch unread notifications
  useEffect(() => {
    if (user?.role === "student") {
      const fetchMessages = async () => {
        try {
          const res = await api.get("/notify/student/messages", { withCredentials: true });
          const unread = res.data.filter(app => app.status !== "pending" && !app.isRead).length;
          setMessagesCount(unread);
          setHasNew(unread > 0);
        } catch (err) {
          console.error("Failed to fetch messages", err);
        }
      };
      fetchMessages();
    }
  }, [user]);

  // Reset glow when messages page is opened
  useEffect(() => {
    if (location.pathname === "/student/messages") {
      setHasNew(false);
      setMessagesCount(0);
      api.put("/notify/mark-read", {}, { withCredentials: true }).catch(console.error);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    navigate("/user/login");
  };

  return (
    <header className="header-container">
      <div className="header-left">
        <Link to="/" className="logo">CareerNest</Link>
      </div>

      {/* Desktop Navigation */}
      {!isMobile && (
        <nav className="header-nav">
          {user?.role === "student" && (
            <>
              <Link to="/jobs">Explore Jobs</Link>
              <Link to="/student/dashboard">Dashboard</Link>
              <Link to="/profile">Profile</Link>
              <Link to="/student/messages" className="bell-link">
                <FaBell size={22} className={hasNew ? "bell-glow" : ""} />
                {messagesCount > 0 && <span className="notification-badge">{messagesCount}</span>}
              </Link>
            </>
          )}

          {user?.role === "recruiter" && (
            <>
              <Link to="/recruiter">Dashboard</Link>
              <Link to="/recruiter/applications">Applicants</Link>
              <Link to="/profile">Profile</Link>
            </>
          )}

          {user ? (
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          ) : (
            <>
              <Link to="/user/login">Login</Link>
              <Link to="/user/register">Register</Link>
            </>
          )}
        </nav>
      )}

      {/* Mobile Hamburger Icon */}
      {isMobile && (
        <FaBars className="menu-icon" onClick={() => setMenuOpen(!menuOpen)} />
      )}

      {/* Mobile Navbar */}
      {isMobile && menuOpen && (
        <Navbar
          user={user}
          messagesCount={messagesCount}
          hasNew={hasNew}
          handleLogout={handleLogout}
          setMenuOpen={setMenuOpen}
        />
      )}
    </header>
  );
}
