import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/Axios";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Spinner } from "../componets/ui/Loader";

export default function Login() {
  const [form,    setForm]    = useState({ email: "", password: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw,  setShowPw]  = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/user/login", form);
      setUser(res.data);
      toast.success("Welcome back!", `Signed in as ${res.data.name?.split(" ")[0]}`);
      navigate(res.data.role === "student" ? "/jobs" : "/recruiter");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "stretch" }}>
      {/* ── Left panel ── */}
      <div style={{
        flex: 1, background: "linear-gradient(135deg, var(--bg-surface), var(--bg-base))",
        borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: 48, position: "relative", overflow: "hidden"
      }} className="auth-left-panel">
        <div style={{
          position: "absolute", top: -100, left: -100, width: 500, height: 500,
          background: "radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 64 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: "linear-gradient(135deg, var(--cyan), var(--cyan-d))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: 14, color: "var(--bg-base)"
            }}>CN</div>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontStyle: "italic", color: "var(--text-1)" }}>
              CareerNest
            </span>
          </div>
          <h2 style={{
            fontFamily: "var(--font-serif)", fontStyle: "italic",
            fontSize: "clamp(2rem,4vw,3rem)", color: "var(--text-1)", lineHeight: 1.25, maxWidth: 480
          }}>
            "The best time to start<br/>your career is{" "}
            <span style={{ color: "var(--cyan)" }}>right now.</span>"
          </h2>
          <p style={{ marginTop: 16, fontSize: 15, color: "var(--text-3)", maxWidth: 400 }}>
            Thousands of students have found their first role through CareerNest.
          </p>
        </div>

        <div>
          <p style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 14 }}>
            Companies that hire through us
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["Groww", "CRED", "Razorpay", "Zepto", "Meesho", "Postman"].map(c => (
              <span key={c} style={{
                padding: "6px 14px", borderRadius: 8,
                background: "var(--bg-raised)", border: "1px solid var(--border)",
                fontSize: 13, color: "var(--text-2)", fontWeight: 500
              }}>{c}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div style={{
        width: 480, flexShrink: 0, display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "40px 48px"
      }} className="auth-right-panel">
        <Link to="/" style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: 13, color: "var(--text-3)", textDecoration: "none", marginBottom: 40, transition: "color 0.2s"
        }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--text-1)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text-3)"}
        >← Back to home</Link>

        <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text-1)", marginBottom: 6 }}>Welcome back</h1>
        <p style={{ fontSize: 15, color: "var(--text-2)", marginBottom: 32 }}>Sign in to continue your career journey</p>

        {error && (
          <div className="cn-alert cn-alert-error" style={{ marginBottom: 20 }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="cn-form-group">
            <label className="cn-label">Email address</label>
            <div className="cn-input-icon">
              <span className="cn-icon">✉</span>
              <input
                id="login-email"
                className="cn-input"
                type="email"
                placeholder="you@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="cn-form-group" style={{ marginBottom: 8 }}>
            <label className="cn-label">Password</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", fontSize: 15, pointerEvents: "none" }}>🔒</span>
              <input
                id="login-password"
                className="cn-input"
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                style={{ paddingLeft: 38, paddingRight: 44 }}
                required
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowPw(p => !p)} style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", fontSize: 16, padding: 0
              }}>{showPw ? "🙈" : "👁️"}</button>
            </div>
          </div>

          <div style={{ textAlign: "right", marginBottom: 24 }}>
            <a href="#" style={{ fontSize: 13, color: "var(--cyan)", textDecoration: "none" }}>Forgot password?</a>
          </div>

          <button
            type="submit"
            id="login-submit"
            disabled={loading}
            className="cn-btn cn-btn-primary cn-btn-block"
            style={{ padding: 13, fontSize: 15 }}
          >
            {loading ? <><Spinner size="sm" /> Signing in…</> : "Sign In →"}
          </button>
        </form>

        <div className="cn-divider"><span>or</span></div>

        <button className="cn-btn cn-btn-ghost cn-btn-block" style={{ padding: 13, fontSize: 14 }}>
          <span style={{ fontWeight: 900, fontSize: 15 }}>G</span> Continue with Google
        </button>

        <p style={{ textAlign: "center", fontSize: 14, color: "var(--text-3)", marginTop: 28 }}>
          Don't have an account?{" "}
          <Link to="/user/register" style={{ color: "var(--cyan)", fontWeight: 600, textDecoration: "none" }}>
            Register free →
          </Link>
        </p>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .auth-left-panel  { display: none !important; }
          .auth-right-panel { width: 100% !important; padding: 32px 24px !important; }
        }
      `}</style>
    </div>
  );
}
