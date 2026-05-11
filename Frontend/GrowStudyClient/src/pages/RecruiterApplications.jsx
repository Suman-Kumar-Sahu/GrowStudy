import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/Axios";
import { AuthContext } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { Spinner } from "../componets/ui/Loader.jsx";
import EmptyState from "../componets/ui/EmptyState.jsx";
import Sidebar from "../componets/Sidebar.jsx";

const STATUS_CFG = {
  pending:  { label: "Pending",      color: "var(--amber)", bg: "var(--amber-muted)" },
  reviewed: { label: "Under Review", color: "var(--cyan)",  bg: "var(--cyan-muted)"  },
  selected: { label: "Shortlisted",  color: "var(--green)", bg: "var(--green-muted)" },
  rejected: { label: "Rejected",     color: "var(--red)",   bg: "var(--red-muted)"   },
};

const ACTION_BTNS = [
  { status: "reviewed", label: "Review",     icon: "👁️" },
  { status: "selected", label: "Shortlist",  icon: "✅" },
  { status: "rejected", label: "Reject",     icon: "❌" },
];

export default function RecruiterApplications() {
  const [applications, setApplications] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search,       setSearch]       = useState("");
  const { user } = useContext(AuthContext);
  const toast    = useToast();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get("/applications/recruiter", { withCredentials: true });
        setApplications(res.data);
      } catch {
        toast.error("Could not load", "Failed to fetch applications.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const updateStatus = async (appId, status) => {
    try {
      const res = await api.put(`/applications/${appId}/status`, { status }, { withCredentials: true });
      toast.success(
        status === "selected" ? "Candidate shortlisted! ✅" : `Status updated to ${status}`,
        status === "rejected" ? "The candidate has been notified." : ""
      );
      setApplications(prev =>
        prev.map(app => app._id === appId ? { ...app, status: res.data.status || status } : app)
      );
    } catch {
      toast.error("Failed to update", "Please try again.");
    }
  };

  const keyword = search.toLowerCase();
  const displayed = applications.filter(app => {
    const matchStatus = filterStatus === "all" || app.status === filterStatus;
    const matchSearch = !keyword ||
      app.studentId?.name?.toLowerCase().includes(keyword) ||
      app.jobId?.title?.toLowerCase().includes(keyword);
    return matchStatus && matchSearch;
  });

  const counts = {
    total:    applications.length,
    pending:  applications.filter(a => a.status === "pending").length,
    reviewed: applications.filter(a => a.status === "reviewed").length,
    selected: applications.filter(a => a.status === "selected").length,
  };

  return (
    <div className="cn-layout-with-sidebar">
      <Sidebar />

      <main className="cn-main-content">
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <span className="cn-section-label">Talent Review</span>
          <h1 style={{ marginTop: 4, fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 800, color: "var(--text-1)" }}>
            Applications
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-3)", marginTop: 4 }}>
            {applications.length} total · {counts.pending} pending review
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }} className="stats-grid">
          {[
            { label: "Total",        num: counts.total,    color: "var(--text-1)" },
            { label: "Pending",      num: counts.pending,  color: "var(--amber)" },
            { label: "Under Review", num: counts.reviewed, color: "var(--cyan)"  },
            { label: "Shortlisted",  num: counts.selected, color: "var(--green)" },
          ].map(({ label, num, color }) => (
            <div key={label} style={{
              background: "var(--bg-surface)", border: "1px solid var(--border)",
              borderRadius: "var(--r-lg)", padding: "18px 20px"
            }}>
              <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "1.8rem", color, lineHeight: 1 }}>{num}</div>
              <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 6 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div style={{
          display: "flex", gap: 12, flexWrap: "wrap",
          background: "var(--bg-surface)", border: "1px solid var(--border)",
          borderRadius: "var(--r-lg)", padding: "14px 20px", marginBottom: 20,
          alignItems: "center"
        }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)" }}>🔍</span>
            <input
              type="text"
              className="cn-input"
              placeholder="Search by name or job title…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 36 }}
            />
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["all", "pending", "reviewed", "selected", "rejected"].map(f => (
              <button key={f} onClick={() => setFilterStatus(f)} style={{
                padding: "6px 12px", borderRadius: 6, border: "1px solid",
                fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                background: filterStatus === f ? "var(--cyan)" : "transparent",
                color:      filterStatus === f ? "var(--bg-base)" : "var(--text-3)",
                borderColor: filterStatus === f ? "var(--cyan)" : "var(--border)"
              }}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
            <Spinner size="lg" />
          </div>
        ) : displayed.length === 0 ? (
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)" }}>
            <EmptyState
              icon="📭"
              title={filterStatus === "all" && !search ? "No applications yet" : "No matches found"}
              description={filterStatus === "all" && !search ? "Applications will appear here once students apply to your jobs." : "Try adjusting your filters."}
            />
          </div>
        ) : (
          <div style={{
            background: "var(--bg-surface)", border: "1px solid var(--border)",
            borderRadius: "var(--r-lg)", overflow: "hidden"
          }}>
            <div style={{ overflowX: "auto" }}>
              <table className="cn-table">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Applied For</th>
                    <th>Status</th>
                    <th>Resume</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayed.map(app => {
                    const s = (app.status || "pending").toLowerCase();
                    const cfg = STATUS_CFG[s] || STATUS_CFG.pending;
                    return (
                      <tr key={app._id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                              background: "linear-gradient(135deg, var(--cyan), #6366f1)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontWeight: 800, color: "var(--bg-base)", fontSize: 14, overflow: "hidden"
                            }}>
                              {app.studentId?.avatar
                                ? <img src={app.studentId.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                : (app.studentId?.name?.[0] || "?").toUpperCase()
                              }
                            </div>
                            <div>
                              <Link to={`/profile/${app.studentId?._id}`} style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)", textDecoration: "none" }}
                                onMouseEnter={e => e.currentTarget.style.color = "var(--cyan)"}
                                onMouseLeave={e => e.currentTarget.style.color = "var(--text-1)"}
                              >
                                {app.studentId?.name || "Unknown"}
                              </Link>
                              <div style={{ fontSize: 12, color: "var(--text-3)" }}>{app.studentId?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ color: "var(--text-1)", fontWeight: 600 }}>
                          {app.jobId?.title || "N/A"}
                          <div style={{ fontSize: 12, color: "var(--text-3)", fontWeight: 400 }}>{app.jobId?.company}</div>
                        </td>
                        <td>
                          <span style={{
                            display: "inline-flex", alignItems: "center", gap: 5,
                            padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700,
                            background: cfg.bg, color: cfg.color
                          }}>
                            <span style={{ width: 5, height: 5, borderRadius: "50%", background: cfg.color, display: "block" }} />
                            {cfg.label}
                          </span>
                        </td>
                        <td>
                          {app.studentId?.resumeUrl
                            ? <a href={app.studentId.resumeUrl} target="_blank" rel="noopener noreferrer"
                                className="cn-btn cn-btn-ghost cn-btn-xs">
                                📄 View
                              </a>
                            : <span style={{ fontSize: 12, color: "var(--text-4)" }}>No resume</span>
                          }
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: 6 }}>
                            {ACTION_BTNS.filter(b => b.status !== app.status).map(({ status, label, icon }) => (
                              <button
                                key={status}
                                onClick={() => updateStatus(app._id, status)}
                                className="cn-btn cn-btn-ghost cn-btn-xs"
                                title={label}
                              >
                                {icon} {label}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <style>{`
          @media (max-width: 900px) { .stats-grid { grid-template-columns: 1fr 1fr !important; } }
          @media (max-width: 480px) { .stats-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </main>
    </div>
  );
}
