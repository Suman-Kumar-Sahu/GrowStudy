import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  const [count, setCount] = useState(10);

  useEffect(() => {
    const t = setInterval(() => setCount(c => c - 1), 1000);
    const r = setTimeout(() => navigate("/"), 10000);
    return () => { clearInterval(t); clearTimeout(r); };
  }, [navigate]);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "var(--bg-base)", padding: 24,
      textAlign: "center"
    }}>
      {/* Animated 404 */}
      <div style={{ position: "relative", marginBottom: 40 }}>
        <div style={{
          fontFamily: "var(--font-serif)", fontStyle: "italic",
          fontSize: "clamp(7rem, 20vw, 14rem)", fontWeight: 400,
          color: "transparent",
          WebkitTextStroke: "2px var(--border-glow)",
          lineHeight: 1, userSelect: "none",
          animation: "cn-float1 4s ease-in-out infinite",
          position: "relative", zIndex: 1
        }}>404</div>
        {/* Glow */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300, height: 200,
          background: "radial-gradient(ellipse, rgba(34,211,238,0.12) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />
      </div>

      {/* Text */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, color: "var(--text-1)", marginBottom: 12 }}>
          Page Not Found
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-2)", maxWidth: 420, lineHeight: 1.7, margin: "0 auto" }}>
          The page you're looking for doesn't exist or has been moved.
          {" "}We'll redirect you to the homepage in{" "}
          <span style={{ color: "var(--cyan)", fontWeight: 700 }}>{count}s</span>.
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 48 }}>
        <Link to="/" className="cn-btn cn-btn-primary cn-btn-lg">
          ← Go Home
        </Link>
        <button onClick={() => window.history.back()} className="cn-btn cn-btn-ghost cn-btn-lg">
          Go Back
        </button>
        <Link to="/jobs" className="cn-btn cn-btn-outline cn-btn-lg">
          Browse Jobs
        </Link>
      </div>

      {/* Quick links */}
      <div style={{
        display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center",
        fontSize: 13, color: "var(--text-3)"
      }}>
        {[
          ["/user/login",     "Login"],
          ["/user/register",  "Register"],
          ["/jobs",           "Jobs"],
          ["/profile",        "Profile"],
        ].map(([to, label]) => (
          <Link key={to} to={to} style={{
            color: "var(--text-3)", textDecoration: "none", transition: "color 0.2s"
          }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--cyan)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-3)"}
          >{label}</Link>
        ))}
      </div>
    </div>
  );
}
