import React, { useState, useEffect, useRef, useContext } from "react";
import api from "../api/Axios";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Spinner } from "../componets/ui/Loader";
import EmptyState from "../componets/ui/EmptyState";
import Sidebar from "../componets/Sidebar";
import { Link } from "react-router-dom";

const STATUS_CFG = {
  pending:  { label: "Pending",     color: "var(--amber)", bg: "var(--amber-muted)",  border: "rgba(245,158,11,0.2)" },
  reviewed: { label: "Under Review",color: "var(--cyan)",  bg: "var(--cyan-muted)",   border: "rgba(34,211,238,0.2)" },
  selected: { label: "Shortlisted", color: "var(--green)", bg: "var(--green-muted)",  border: "rgba(16,185,129,0.2)" },
  rejected: { label: "Not Selected",color: "var(--red)",   bg: "var(--red-muted)",    border: "rgba(244,63,94,0.2)"  },
};

function StatusBadge({ status }) {
  const s = status?.toLowerCase() || "pending";
  const cfg = STATUS_CFG[s] || STATUS_CFG.pending;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "4px 10px", borderRadius: 6,
      background: cfg.bg, border: `1px solid ${cfg.border}`,
      fontSize: 12, fontWeight: 700, color: cfg.color
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: cfg.color, display: "block", flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}

function calcCompletion(user) {
  const fields = [user?.name, user?.about, user?.skills?.length, user?.education?.length,
    user?.experience?.length, user?.resumeUrl, user?.avatar];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}

export default function StudentDashboard() {
  const { user }  = useContext(AuthContext);
  const toast     = useToast();
  const [applications, setApplications] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [filter,       setFilter]       = useState("all");
  const prevAppsRef = useRef([]);

  const profilePct = calcCompletion(user);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/applications/student");
      const apps = res.data.applications || res.data;
      apps.forEach(app => {
        const old = prevAppsRef.current.find(a => a._id === app._id);
        if (old && old.status !== app.status)
          toast.info("Status changed!", `"${app.jobId?.title}" → ${app.status}`);
      });
      prevAppsRef.current = apps;
      setApplications(apps);
    } catch {
      toast.error("Could not load", "Failed to load your applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    const interval = setInterval(fetchApplications, 15000);
    return () => clearInterval(interval);
  }, []);

  const counts = {
    total:    applications.length,
    pending:  applications.filter(a => a.status === "pending").length,
    reviewed: applications.filter(a => a.status === "reviewed").length,
    selected: applications.filter(a => a.status === "selected").length,
    rejected: applications.filter(a => a.status === "rejected").length,
  };

  const displayed = filter === "all" ? applications : applications.filter(a => a.status === filter);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="cn-layout-with-sidebar">
      <Sidebar />

      <main className="cn-main-content">
        {/* Page header */}
        <div style={{ marginBottom: 28 }}>
          <span className="cn-section-label">Your activity</span>
          <h1 style={{ marginTop: 4, fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 800, color: "var(--text-1)" }}>
            {greeting}, <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}>{user?.name?.split(" ")[0] || "there"}</em> 👋
          </h1>
        </div>

        {/* Profile completion */}
        {profilePct < 100 && (
          <div style={{
            background: "var(--bg-surface)", border: "1px solid var(--border)",
            borderRadius: "var(--r-lg)", padding: "20px 24px", marginBottom: 24,
            display: "flex", alignItems: "center", gap: 20
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)" }}>Profile Completion</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: "var(--cyan)" }}>{profilePct}%</span>
              </div>
              <div className="cn-progress">
                <div className="cn-progress-bar" style={{ width: `${profilePct}%` }} />
              </div>
              <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 8 }}>
                {profilePct < 60 ? "Complete your profile to stand out to recruiters" : "Almost there! A complete profile gets 3x more views."}
              </p>
            </div>
            <Link to="/profile" className="cn-btn cn-btn-outline cn-btn-sm" style={{ flexShrink: 0 }}>
              Complete →
            </Link>
          </div>
        )}

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }} className="stats-grid">
          {[
            { icon: "📩", num: counts.total,    label: "Total Applied",   color: "var(--cyan)" },
            { icon: "👁️", num: counts.reviewed, label: "Under Review",    color: "var(--amber)" },
            { icon: "🏆", num: counts.selected, label: "Shortlisted",     color: "var(--green)" },
            { icon: "⏳", num: counts.pending,  label: "Awaiting",        color: "var(--text-3)" },
          ].map(({ icon, num, label, color }) => (
            <div key={label} style={{
              background: "var(--bg-surface)", border: "1px solid var(--border)",
              borderRadius: "var(--r-lg)", padding: "20px 22px",
              animation: "cn-count-up 0.4s ease"
            }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "2rem", color, lineHeight: 1 }}>{num}</div>
              <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 6 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Applications panel */}
        <div style={{
          background: "var(--bg-surface)", border: "1px solid var(--border)",
          borderRadius: "var(--r-lg)", overflow: "hidden"
        }}>
          {/* Panel header */}
          <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>My Applications</h2>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["all", "pending", "reviewed", "selected", "rejected"].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: "4px 12px", borderRadius: 6, border: "1px solid",
                    fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                    background: filter === f ? "var(--cyan)" : "transparent",
                    color: filter === f ? "var(--bg-base)" : "var(--text-3)",
                    borderColor: filter === f ? "var(--cyan)" : "var(--border)"
                  }}
                >
                  {f === "all" ? `All (${counts.total})` : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div style={{ padding: 40, display: "flex", justifyContent: "center" }}>
              <Spinner size="lg" />
            </div>
          ) : displayed.length === 0 ? (
            <EmptyState
              icon="📭"
              title={filter === "all" ? "No applications yet" : `No ${filter} applications`}
              description={filter === "all"
                ? "Start applying to jobs to track your progress here."
                : `You have no applications with "${filter}" status.`}
              action={filter === "all"
                ? <Link to="/jobs" className="cn-btn cn-btn-primary cn-btn-sm">Browse Jobs →</Link>
                : <button onClick={() => setFilter("all")} className="cn-btn cn-btn-ghost cn-btn-sm">View all</button>
              }
            />
          ) : (
            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              {displayed.map(app => (
                <div key={app._id} style={{
                  display: "flex", alignItems: "center", gap: 16,
                  padding: "16px 20px", borderRadius: "var(--r)",
                  background: "var(--bg-raised)", border: "1px solid var(--border)",
                  transition: "all 0.2s"
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-glow)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
                >
                  <div style={{
                    width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                    background: "var(--cyan-muted)", border: "1px solid rgba(34,211,238,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, color: "var(--cyan)", fontSize: 16
                  }}>
                    {(app.jobId?.company || "?")[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {app.jobId?.title || "Untitled Job"}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-3)", marginTop: 2 }}>
                      {app.jobId?.company || "N/A"} · {app.jobId?.location || "Remote"}
                    </div>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <style>{`
          @media (max-width: 900px) { .stats-grid { grid-template-columns: 1fr 1fr !important; } }
          @media (max-width: 480px) { .stats-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </main>
    </div>
  );
}
