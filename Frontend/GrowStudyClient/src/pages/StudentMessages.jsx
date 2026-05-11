import React, { useState, useEffect, useContext } from "react";
import api from "../api/Axios";
import { AuthContext } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { Spinner } from "../componets/ui/Loader.jsx";
import EmptyState from "../componets/ui/EmptyState.jsx";

const STATUS_CFG = {
  pending:  { icon: "⏳", label: "Pending",      color: "var(--text-3)",  bg: "var(--bg-raised)" },
  reviewed: { icon: "👁️", label: "Under Review", color: "var(--cyan)",   bg: "var(--cyan-muted)" },
  selected: { icon: "🎉", label: "Shortlisted",  color: "var(--green)",  bg: "var(--green-muted)" },
  rejected: { icon: "😔", label: "Not Selected", color: "var(--red)",    bg: "var(--red-muted)" },
};

function buildMessage(status, jobTitle) {
  switch ((status || "").toLowerCase()) {
    case "pending":  return `Your application for "${jobTitle}" is pending review.`;
    case "reviewed": return `Your application for "${jobTitle}" is currently being reviewed.`;
    case "selected": return `🎉 Congratulations! You've been shortlisted for "${jobTitle}"!`;
    case "rejected": return `We're sorry. Your application for "${jobTitle}" was not selected this time.`;
    default:         return `Update on your application for "${jobTitle}".`;
  }
}

export default function StudentMessages() {
  const { user }   = useContext(AuthContext);
  const toast      = useToast();
  const [messages, setMessages] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get("/notify/student/messages", { withCredentials: true });
        setMessages(res.data.map(msg => ({
          id:       msg._id,
          jobTitle: msg.jobId?.title || "Untitled Job",
          company:  msg.jobId?.company || "Unknown",
          status:   (msg.status || "pending").toLowerCase(),
          date:     msg.createdAt,
          text:     buildMessage(msg.status, msg.jobId?.title),
        })));
      } catch {
        toast.error("Could not load", "Failed to fetch notifications.");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const handleRemove = async (id) => {
    try {
      await api.delete(`/notify/${id}`, { withCredentials: true });
      setMessages(prev => prev.filter(m => m.id !== id));
    } catch {
      toast.error("Failed", "Could not remove notification.");
    }
  };

  const handleClearAll = async () => {
    if (!messages.length) return;
    try {
      await api.delete("/notify/student/clear", { withCredentials: true });
      setMessages([]);
      toast.success("Cleared", "All notifications removed.");
    } catch {
      toast.error("Failed", "Could not clear all notifications.");
    }
  };

  const formatDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  return (
    <div className="cn-page-sm">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <span className="cn-section-label">Inbox</span>
          <h1 style={{ marginTop: 4, fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 800, color: "var(--text-1)" }}>
            Notifications
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-3)", marginTop: 4 }}>
            {messages.length} notification{messages.length !== 1 ? "s" : ""}
          </p>
        </div>
        {messages.length > 0 && (
          <button onClick={handleClearAll} className="cn-btn cn-btn-ghost cn-btn-sm">
            Clear All
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
          <Spinner size="lg" />
        </div>
      ) : messages.length === 0 ? (
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)" }}>
          <EmptyState
            icon="🔔"
            title="No notifications yet"
            description="You'll see updates here when recruiters review or respond to your applications."
          />
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {messages.map(msg => {
            const cfg = STATUS_CFG[msg.status] || STATUS_CFG.pending;
            return (
              <div key={msg.id} style={{
                display: "flex", alignItems: "flex-start", gap: 16,
                padding: "18px 20px", borderRadius: "var(--r-lg)",
                background: "var(--bg-surface)", border: `1px solid var(--border)`,
                transition: "all 0.2s",
                animation: "cn-slide-up 0.3s ease",
                borderLeft: `3px solid ${cfg.color}`
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = cfg.color; e.currentTarget.style.background = cfg.bg; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-surface)"; }}
              >
                {/* Icon */}
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: cfg.bg, border: `1px solid ${cfg.color}22`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20
                }}>
                  {cfg.icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-1)", marginBottom: 2 }}>
                        {msg.jobTitle}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 6 }}>
                        {msg.company}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <span style={{
                        padding: "3px 8px", borderRadius: 5, fontSize: 11, fontWeight: 700,
                        background: cfg.bg, color: cfg.color
                      }}>{cfg.label}</span>
                      {msg.date && <span style={{ fontSize: 11, color: "var(--text-4)" }}>{formatDate(msg.date)}</span>}
                    </div>
                  </div>
                  <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.6 }}>{msg.text}</p>
                </div>

                {/* Dismiss */}
                <button
                  onClick={() => handleRemove(msg.id)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--text-4)", fontSize: 16, padding: "4px 6px",
                    borderRadius: 6, transition: "all 0.15s", flexShrink: 0
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--red-muted)"; e.currentTarget.style.color = "var(--red)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--text-4)"; }}
                  aria-label="Dismiss notification"
                >✕</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
