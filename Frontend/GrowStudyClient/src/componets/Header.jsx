import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import api from "../api/Axios";

export default function Header() {
  const { user, setUser } = useContext(AuthContext);
  const { theme, toggle } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifCount, setNotifCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropping, setDropping] = useState(false);

  useEffect(() => { setMenuOpen(false); setDropping(false); }, [location.pathname]);

  useEffect(() => {
    if (user?.role !== "student") return;
    api.get("/notify/student/messages").then(res => {
      setNotifCount(res.data.filter(m => m.status !== "pending" && !m.isRead).length);
    }).catch(() => { });
  }, [user]);

  useEffect(() => {
    if (location.pathname !== "/student/messages") return;
    setNotifCount(0);
    api.put("/notify/mark-read", {}).catch(() => { });
  }, [location.pathname]);

  const handleLogout = async () => {
    try { await api.post("/auth/user/logout"); } catch { }
    setUser(null);
    toast.success("Logged out", "See you next time!");
    navigate("/user/login");
  };

  const isActive = (path) => location.pathname === path;

  const isDark = theme === "dark";

  return (
    <>
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        backdropFilter: "blur(20px) saturate(180%)",
        background: isDark ? "rgba(6,9,26,0.88)" : "rgba(255,255,255,0.92)",
        borderBottom: "1px solid var(--border)",
        height: "var(--header-h)",
        transition: "background 0.3s"
      }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 24px", height: "100%"
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg, var(--cyan), var(--cyan-d))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: 13, color: "var(--bg-base)", fontFamily: "var(--font-ui)",
              flexShrink: 0
            }}>CN</div>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", fontStyle: "italic", color: "var(--text-1)" }}>
              CareerNest
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="header-desktop-nav" aria-label="Main navigation">
            {user?.role === "student" && (<>
              <NavLink to="/jobs" active={isActive("/jobs")}>Explore Jobs</NavLink>
              <NavLink to="/student/dashboard" active={isActive("/student/dashboard")}>Dashboard</NavLink>
              <NavLink to="/student/ai-insights" active={isActive("/student/ai-insights")}>AI Insights</NavLink>
              <NavLink to="/profile" active={isActive("/profile")}>Profile</NavLink>
              <Link to="/student/messages" style={{
                position: "relative", width: 38, height: 38, borderRadius: 10,
                border: "1px solid var(--border)", background: "var(--bg-raised)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "var(--text-2)", textDecoration: "none",
                fontSize: 15, transition: "all 0.2s", flexShrink: 0
              }}
                aria-label="Notifications"
              >
                🔔
                {notifCount > 0 && (
                  <span style={{
                    position: "absolute", top: -4, right: -4,
                    width: 18, height: 18, borderRadius: "50%",
                    background: "var(--red)", border: "2px solid var(--bg-base)",
                    fontSize: 9, fontWeight: 800, color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>{notifCount}</span>
                )}
              </Link>
            </>)}

            {user?.role === "recruiter" && (<>
              <NavLink to="/recruiter" active={isActive("/recruiter")}>Dashboard</NavLink>
              <NavLink to="/recruiter/applications" active={isActive("/recruiter/applications")}>Applications</NavLink>
              <NavLink to="/profile" active={isActive("/profile")}>Profile</NavLink>
            </>)}

            {/* Theme toggle */}
            <button
              id="theme-toggle"
              onClick={toggle}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              style={{
                width: 38, height: 38, borderRadius: 10,
                border: "1px solid var(--border)", background: "var(--bg-raised)",
                cursor: "pointer", fontSize: 16,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--text-2)", transition: "all 0.2s", flexShrink: 0
              }}
            >
              {isDark ? "☀️" : "🌙"}
            </button>

            {/* Auth */}
            {user ? (
              <div style={{ position: "relative" }}>
                <button
                  id="profile-dropdown-btn"
                  onClick={() => setDropping(d => !d)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "6px 12px 6px 6px", borderRadius: 10,
                    border: "1px solid var(--border)", background: "var(--bg-raised)",
                    cursor: "pointer", transition: "all 0.2s"
                  }}
                  aria-haspopup="true"
                  aria-expanded={dropping}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", overflow: "hidden",
                    background: "linear-gradient(135deg, var(--cyan), #6366f1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, color: "var(--bg-base)", fontSize: 12, flexShrink: 0
                  }}>
                    {user.avatar
                      ? <img src={user.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : (user.name?.[0] || "U").toUpperCase()
                    }
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.name?.split(" ")[0] || "Account"}
                  </span>
                  <span style={{ fontSize: 10, color: "var(--text-3)" }}>{dropping ? "▲" : "▼"}</span>
                </button>
                {dropping && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 8px)", right: 0,
                    background: "var(--bg-surface)", border: "1px solid var(--border)",
                    borderRadius: "var(--r-md)", minWidth: 180,
                    boxShadow: "var(--shadow-lg)", overflow: "hidden", zIndex: 200,
                    animation: "cn-slide-up 0.15s ease"
                  }}>
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-1)" }}>{user.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2, textTransform: "capitalize" }}>{user.role}</div>
                    </div>
                    <Link to="/profile" style={{ display: "block", padding: "10px 16px", fontSize: 14, color: "var(--text-2)", textDecoration: "none", transition: "background 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "var(--bg-raised)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >👤 My Profile</Link>
                    <button onClick={handleLogout} style={{
                      width: "100%", textAlign: "left", padding: "10px 16px",
                      fontSize: 14, color: "var(--red)", background: "none", border: "none",
                      cursor: "pointer", fontFamily: "var(--font-ui)", transition: "background 0.15s"
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = "var(--red-muted)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >→ Logout</button>
                  </div>
                )}
              </div>
            ) : (<>
              <NavLink to="/user/login">Login</NavLink>
              <Link to="/user/register" className="cn-btn cn-btn-primary cn-btn-sm" style={{ textDecoration: "none", marginLeft: 4 }}>
                Register Free
              </Link>
            </>)}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="header-hamburger"
            aria-label="Toggle mobile menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(p => !p)}
            style={{ display: "none" }}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            borderTop: "1px solid var(--border)",
            background: "var(--bg-surface)",
            padding: "12px 24px 24px"
          }}>
            {user?.role === "student" && (<>
              <MobileLink to="/jobs" close={() => setMenuOpen(false)}>🔍 Explore Jobs</MobileLink>
              <MobileLink to="/student/dashboard" close={() => setMenuOpen(false)}>📊 Dashboard</MobileLink>
              <MobileLink to="/student/ai-insights" close={() => setMenuOpen(false)}>🧠 AI Insights</MobileLink>
              <MobileLink to="/student/messages" close={() => setMenuOpen(false)}>
                🔔 Messages {notifCount > 0 && `(${notifCount})`}
              </MobileLink>
            </>)}
            {user?.role === "recruiter" && (<>
              <MobileLink to="/recruiter" close={() => setMenuOpen(false)}>📋 Dashboard</MobileLink>
              <MobileLink to="/recruiter/applications" close={() => setMenuOpen(false)}>👥 Applications</MobileLink>
            </>)}
            <MobileLink to="/profile" close={() => setMenuOpen(false)}>👤 Profile</MobileLink>

            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <button onClick={toggle} className="cn-btn cn-btn-ghost cn-btn-sm" style={{ flex: 1, justifyContent: "center" }}>
                {isDark ? "☀️ Light" : "🌙 Dark"}
              </button>
              {user
                ? <button onClick={handleLogout} className="cn-btn cn-btn-danger cn-btn-sm" style={{ flex: 1, justifyContent: "center" }}>Logout</button>
                : <Link to="/user/login" className="cn-btn cn-btn-primary cn-btn-sm" style={{ flex: 1, justifyContent: "center", textDecoration: "none" }}>Login</Link>
              }
            </div>
          </div>
        )}
      </header>

      <style>{`
        .header-desktop-nav { display: flex; align-items: center; gap: 6px; }
        .header-hamburger { background: none; border: none; color: var(--text-1); cursor: pointer; font-size: 22px; padding: 6px 8px; border-radius: 8px; transition: background 0.2s; }
        .header-hamburger:hover { background: var(--bg-raised); }
        @media (max-width: 768px) {
          .header-desktop-nav { display: none !important; }
          .header-hamburger   { display: block !important; }
        }
      `}</style>
    </>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link to={to} style={{
      padding: "7px 13px", borderRadius: 8, textDecoration: "none",
      color: active ? "var(--cyan)" : "var(--text-2)",
      background: active ? "var(--bg-raised)" : "transparent",
      border: active ? "1px solid var(--border)" : "1px solid transparent",
      fontSize: 14, fontWeight: 500, transition: "all 0.2s",
      whiteSpace: "nowrap"
    }}>
      {children}
    </Link>
  );
}

function MobileLink({ to, close, children }) {
  return (
    <Link to={to} onClick={close} style={{
      display: "block", padding: "12px 0",
      borderBottom: "1px solid var(--border)",
      color: "var(--text-2)", textDecoration: "none",
      fontSize: 15, fontWeight: 500
    }}>{children}</Link>
  );
}
