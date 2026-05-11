import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const STUDENT_LINKS = [
  { to: "/jobs",              icon: "🔍", label: "Explore Jobs" },
  { to: "/student/dashboard", icon: "📊", label: "Dashboard"    },
  { to: "/student/messages",  icon: "🔔", label: "Messages"     },
  { to: "/profile",           icon: "👤", label: "My Profile"   },
];

const RECRUITER_LINKS = [
  { to: "/recruiter",               icon: "📋", label: "Dashboard"    },
  { to: "/recruiter/applications",  icon: "👥", label: "Applications" },
  { to: "/profile",                 icon: "👤", label: "My Profile"   },
];

/**
 * Sidebar nav for dashboards.
 * Props: role ("student" | "recruiter"), notifCount (optional)
 */
export default function Sidebar({ notifCount = 0 }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = user?.role === "recruiter" ? RECRUITER_LINKS : STUDENT_LINKS;
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile toggle */}
      <button
        id="sidebar-toggle"
        aria-label="Toggle sidebar"
        onClick={() => setMobileOpen(o => !o)}
        style={{
          display: "none",
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 60,
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "var(--cyan)",
          color: "var(--bg-base)",
          border: "none",
          fontSize: 20,
          cursor: "pointer",
          boxShadow: "0 4px 24px rgba(34,211,238,0.5)",
          alignItems: "center",
          justifyContent: "center",
        }}
        className="sidebar-mobile-btn"
      >☰</button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 45,
            background: "rgba(6,9,26,0.7)",
            backdropFilter: "blur(4px)"
          }}
        />
      )}

      <nav
        className={`cn-sidebar${mobileOpen ? " open" : ""}`}
        aria-label="Sidebar navigation"
      >
        {/* User info */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "12px 14px", marginBottom: 8,
          borderRadius: "var(--r-sm)",
          background: "var(--bg-raised)",
          border: "1px solid var(--border)"
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, var(--cyan), #6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, color: "var(--bg-base)", fontSize: 14,
            overflow: "hidden"
          }}>
            {user?.avatar
              ? <img src={user.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : (user?.name?.[0] || "U").toUpperCase()
            }
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-1)", truncate: true, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.name || "User"}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-3)", textTransform: "capitalize" }}>
              {user?.role || "Member"}
            </div>
          </div>
        </div>

        <div className="cn-sidebar-divider" />

        {/* Nav links */}
        <span className="cn-sidebar-section">Navigation</span>
        {links.map(({ to, icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`cn-sidebar-item${isActive(to) ? " active" : ""}`}
            onClick={() => setMobileOpen(false)}
          >
            <span className="cn-sidebar-icon">{icon}</span>
            <span style={{ flex: 1 }}>{label}</span>
            {/* Notification badge on messages */}
            {to === "/student/messages" && notifCount > 0 && (
              <span style={{
                background: "var(--red)",
                color: "#fff",
                borderRadius: "50%",
                width: 18, height: 18,
                fontSize: 10, fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>{notifCount}</span>
            )}
          </Link>
        ))}

        <div className="cn-sidebar-divider" style={{ marginTop: "auto" }} />

        {/* Quick stats footer */}
        <div style={{ padding: "12px 14px" }}>
          <div style={{ fontSize: 11, color: "var(--text-4)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>
            CareerNest
          </div>
          <div style={{ fontSize: 12, color: "var(--text-3)" }}>
            {user?.role === "student" ? "Student Portal" : "Recruiter Hub"}
          </div>
        </div>
      </nav>

      <style>{`
        @media (max-width: 900px) {
          .sidebar-mobile-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
