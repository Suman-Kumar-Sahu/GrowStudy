import React, { memo } from "react";

const SKILL_COLORS = ["cyan", "green", "amber", "purple", "red"];

export default memo(function ProfileCard({
  avatar, name, about, role, skills = [],
  education = [], experience = [], onEdit, publicView = false
}) {
  const initials = (name || "U").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div style={{
      background: "var(--bg-surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--r-xl)",
      padding: 32,
      animation: "cn-slide-up 0.3s ease"
    }}>
      {/* Top row: avatar + meta + edit */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 24, marginBottom: 24 }}>
        {/* Avatar */}
        <div style={{
          width: 88, height: 88, borderRadius: "50%", flexShrink: 0,
          overflow: "hidden",
          border: "3px solid var(--border-glow)",
          boxShadow: "var(--glow-cyan)"
        }}>
          {avatar
            ? <img src={avatar} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <div style={{
                width: "100%", height: "100%",
                background: "linear-gradient(135deg, var(--cyan), #6366f1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 800, fontSize: 28, color: "var(--bg-base)",
                fontFamily: "var(--font-serif)"
              }}>{initials}</div>
          }
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-1)", marginBottom: 4 }}>
            {name || "Your Name"}
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              padding: "3px 10px", borderRadius: 6,
              background: "var(--cyan-muted)", border: "1px solid rgba(34,211,238,0.2)",
              fontSize: 12, fontWeight: 700, color: "var(--cyan)", textTransform: "capitalize"
            }}>
              {role || "Student"}
            </span>
          </div>
          {about && (
            <p style={{ fontSize: 14, color: "var(--text-2)", marginTop: 10, lineHeight: 1.65, maxWidth: 520 }}>
              {about}
            </p>
          )}
        </div>

        {/* Edit button */}
        {onEdit && !publicView && (
          <button
            id="profile-edit-btn"
            onClick={onEdit}
            className="cn-btn cn-btn-ghost cn-btn-sm"
            aria-label="Edit profile"
          >
            ✏️ Edit Profile
          </button>
        )}
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "1.5px", color: "var(--text-3)", marginBottom: 12
          }}>Skills</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className={`cn-tag cn-tag-${SKILL_COLORS[idx % SKILL_COLORS.length]}`}
                style={{ fontSize: 13, padding: "5px 12px" }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Education and Experience side by side */}
      <div style={{ display: "grid", gridTemplateColumns: education.length > 0 && experience.length > 0 ? "1fr 1fr" : "1fr", gap: 24 }}
        className="profile-card-grid">

        {education.length > 0 && (
          <div>
            <div style={{
              fontSize: 11, fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "1.5px", color: "var(--text-3)", marginBottom: 12
            }}>🎓 Education</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {education.map((edu, idx) => (
                <div key={idx} style={{
                  padding: "12px 16px", borderRadius: "var(--r)",
                  background: "var(--bg-raised)", border: "1px solid var(--border)"
                }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-1)" }}>{edu.college}</div>
                  <div style={{ fontSize: 13, color: "var(--text-2)", marginTop: 2 }}>
                    {edu.degree} · <span style={{ color: "var(--text-3)" }}>{edu.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {experience.length > 0 && (
          <div>
            <div style={{
              fontSize: 11, fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "1.5px", color: "var(--text-3)", marginBottom: 12
            }}>💼 Experience</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {experience.map((exp, idx) => (
                <div key={idx} style={{
                  padding: "12px 16px", borderRadius: "var(--r)",
                  background: "var(--bg-raised)", border: "1px solid var(--border)"
                }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-1)" }}>{exp.company}</div>
                  <div style={{ fontSize: 13, color: "var(--text-2)", marginTop: 2 }}>
                    {exp.role} · <span style={{ color: "var(--text-3)" }}>{exp.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 600px) { .profile-card-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
});
