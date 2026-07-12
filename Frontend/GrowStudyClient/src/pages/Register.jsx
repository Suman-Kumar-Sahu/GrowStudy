import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/Axios";
import { compressImage } from "../helper/compressedImage"
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Spinner } from "../componets/ui/Loader";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pwStrength, setPwStrength] = useState(0);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const toast = useToast();

  const getStrength = (pw) => {
    let s = 0;
    if (pw.length >= 6) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };

  const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];
  const STRENGTH_COLORS = ["", "var(--red)", "var(--amber)", "var(--cyan)", "var(--green)"];

  const handlePw = (val) => {
    setForm(f => ({ ...f, password: val }));
    setPwStrength(getStrength(val));
  };

  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file, 400, 400, 0.8);
      setAvatarFile(compressed);
      setAvatarPreview(URL.createObjectURL(compressed));
    } catch (error) {
      toast.error("Error", "Please select a valid image file");
      e.target.value = "";
      return;
    }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password too short", "Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("password", form.password);
      fd.append("role", form.role);
      if (avatarFile) fd.append("avatar", avatarFile);

      const res = await api.post("/auth/user/register", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data) setUser(res.data);
      toast.success("Welcome to CareerNest! 🎉", "Your account has been created.");
      setTimeout(() => navigate(form.role === "student" ? "/jobs" : "/recruiter"), 800);
    } catch (err) {
      toast.error("Registration failed", err.response?.data?.message || "Please try again.");
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
            fontSize: "clamp(1.8rem,3.5vw,2.8rem)", color: "var(--text-1)", lineHeight: 1.25, maxWidth: 420
          }}>
            "Start your career<br />journey{" "}
            <span style={{ color: "var(--cyan)" }}>today.</span>"
          </h2>
          <p style={{ marginTop: 16, fontSize: 15, color: "var(--text-3)", maxWidth: 380 }}>
            Join 12,000+ students who found their first role through CareerNest.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { num: "12k+", label: "Students placed" },
            { num: "840+", label: "Active jobs" },
            { num: "320+", label: "Companies" },
          ].map(({ num, label }) => (
            <div key={label} style={{
              padding: "16px", borderRadius: "var(--r)",
              background: "var(--bg-raised)", border: "1px solid var(--border)", textAlign: "center"
            }}>
              <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "1.6rem", color: "var(--cyan)" }}>{num}</div>
              <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div style={{
        width: 480, flexShrink: 0, display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "40px 48px"
      }} className="auth-right-panel">

        <Link to="/" style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: 13, color: "var(--text-3)", textDecoration: "none", marginBottom: 36, transition: "color 0.2s"
        }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--text-1)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text-3)"}
        >← Back to home</Link>

        <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-1)", marginBottom: 4 }}>Create your account</h1>
        <p style={{ fontSize: 14, color: "var(--text-2)", marginBottom: 28 }}>Start your journey — it's completely free</p>

        {/* Role toggle */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 24,
          background: "var(--bg-raised)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: 4
        }}>
          {[
            { val: "student", icon: "🎓", label: "Student" },
            { val: "recruiter", icon: "🏢", label: "Recruiter" }
          ].map(({ val, icon, label }) => (
            <button
              key={val}
              type="button"
              onClick={() => setForm(f => ({ ...f, role: val }))}
              style={{
                padding: "9px 12px", borderRadius: 8, cursor: "pointer",
                background: form.role === val ? "var(--cyan)" : "transparent",
                color: form.role === val ? "var(--bg-base)" : "var(--text-2)",
                border: "none", fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 700,
                transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 6
              }}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Avatar upload */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
              overflow: "hidden", border: "2px solid var(--border)",
              background: "var(--bg-raised)", display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              {avatarPreview
                ? <img src={avatarPreview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ fontSize: 20 }}>👤</span>
              }
            </div>
            <label style={{
              padding: "7px 14px", borderRadius: "var(--r-sm)",
              border: "1px solid var(--border)", background: "var(--bg-raised)",
              color: "var(--text-2)", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
            }}>
              Upload photo (optional)
              <input type="file" accept="image/*" onChange={handleAvatar} style={{ display: "none" }} />
            </label>
          </div>

          <div className="cn-form-group">
            <label className="cn-label">Full Name</label>
            <input type="text" className="cn-input" placeholder="Rahul Kumar"
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required minLength={2} />
          </div>

          <div className="cn-form-group">
            <label className="cn-label">Email Address</label>
            <input type="email" className="cn-input" placeholder="you@email.com"
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>

          <div className="cn-form-group">
            <label className="cn-label">Password</label>
            <input type="password" className="cn-input" placeholder="Min. 6 characters"
              value={form.password} onChange={e => handlePw(e.target.value)} required minLength={6} />
            {/* Strength bar */}
            {form.password.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", gap: 4, height: 3, borderRadius: 3, overflow: "hidden" }}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                      flex: 1, borderRadius: 3,
                      background: i <= pwStrength ? STRENGTH_COLORS[pwStrength] : "var(--bg-raised)",
                      transition: "background 0.3s"
                    }} />
                  ))}
                </div>
                <div style={{ fontSize: 11, color: STRENGTH_COLORS[pwStrength], marginTop: 4, fontWeight: 600 }}>
                  {STRENGTH_LABELS[pwStrength]}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="cn-btn cn-btn-primary cn-btn-block"
            style={{ padding: 13, fontSize: 15, marginTop: 8 }}
          >
            {loading ? <><Spinner size="sm" /> Creating account…</> : "Create Account →"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-3)", marginTop: 24 }}>
          Already have an account?{" "}
          <Link to="/user/login" style={{ color: "var(--cyan)", fontWeight: 600, textDecoration: "none" }}>
            Sign in →
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