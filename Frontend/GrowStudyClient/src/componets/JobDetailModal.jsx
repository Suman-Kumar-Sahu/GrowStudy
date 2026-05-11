import React, { useEffect } from "react";

export default function JobDetailModal({ job, onClose, onApply, currentUserId, currentUserRole }) {
  const applied = currentUserId && Array.isArray(job?.applicants)
    ? job.applicants.includes(currentUserId) : false;

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!job) return null;

  const initials = (job.company || "Co").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position:"fixed", inset:0, zIndex:200,
        background:"rgba(6,9,26,0.85)", backdropFilter:"blur(8px)",
        display:"flex", alignItems:"flex-start", justifyContent:"center",
        padding:"40px 20px", overflowY:"auto"
      }}
    >
      <div style={{
        width:"100%", maxWidth:860,
        background:"var(--bg-surface)", border:"1px solid var(--border)",
        borderRadius:"var(--r-xl)", overflow:"hidden",
        animation:"cn-slide-up 0.25s ease"
      }}>
        {/* Header */}
        <div style={{
          padding:"28px 32px", borderBottom:"1px solid var(--border)",
          background:"linear-gradient(to right, rgba(34,211,238,0.04), transparent)",
          display:"flex", alignItems:"flex-start", justifyContent:"space-between"
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:20 }}>
            <div style={{
              width:64, height:64, borderRadius:14,
              background:"var(--bg-hover)", border:"1px solid var(--border)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:22, fontWeight:800, color:"var(--text-1)",
              fontFamily:"var(--font-serif)", fontStyle:"italic", flexShrink:0
            }}>{initials}</div>
            <div>
              <h2 style={{ fontSize:24, fontWeight:800, color:"var(--text-1)" }}>{job.title}</h2>
              <p style={{ fontSize:15, color:"var(--text-2)", marginTop:4 }}>
                {job.company} · {job.location || "Remote"}
              </p>
              <div style={{ display:"flex", gap:8, marginTop:10, flexWrap:"wrap" }}>
                {job.skillsRequired?.slice(0, 4).map((s, i) => (
                  <span key={i} className="cn-tag cn-tag-cyan">{s}</span>
                ))}
                {job.stipend && <span className="cn-tag cn-tag-green">💰 {job.stipend}</span>}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background:"var(--bg-hover)", border:"1px solid var(--border)",
              borderRadius:8, color:"var(--text-2)", padding:"8px 12px",
              cursor:"pointer", fontSize:16, lineHeight:1, flexShrink:0
            }}
          >✕</button>
        </div>

        {/* Body */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 260px" }} className="modal-body-grid">
          {/* Main */}
          <div style={{ padding:"28px 32px", borderRight:"1px solid var(--border)" }}>
            <SectionTitle>About the Role</SectionTitle>
            <p style={{ fontSize:15, color:"var(--text-2)", lineHeight:1.75, marginBottom:28, whiteSpace:"pre-line" }}>
              {job.description || "No description provided."}
            </p>

            {job.responsibilities?.length > 0 && (<>
              <SectionTitle>Key Responsibilities</SectionTitle>
              <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:10, marginBottom:28 }}>
                {job.responsibilities.map((r, i) => (
                  <li key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, fontSize:14, color:"var(--text-2)" }}>
                    <span style={{ color:"var(--cyan)", fontWeight:700, flexShrink:0 }}>→</span>
                    {r}
                  </li>
                ))}
              </ul>
            </>)}

            {job.requirements?.length > 0 && (<>
              <SectionTitle>Requirements</SectionTitle>
              <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:10 }}>
                {job.requirements.map((r, i) => (
                  <li key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, fontSize:14, color:"var(--text-2)" }}>
                    <span style={{ color:"var(--green)", fontWeight:700, flexShrink:0 }}>✓</span>
                    {r}
                  </li>
                ))}
              </ul>
            </>)}
          </div>

          {/* Sidebar */}
          <div style={{ padding:"28px" }}>
            <SectionTitle>Job Details</SectionTitle>
            {[
              ["Type", job.type || "Internship"],
              ["Stipend", job.stipend || "Negotiable"],
              ["Location", job.location || "Remote"],
              ["Applicants", `${job.applicants?.length || 0} applied`],
            ].map(([k, v]) => (
              <div key={k} style={{
                display:"flex", justifyContent:"space-between", alignItems:"center",
                padding:"12px 0", borderBottom:"1px solid var(--border)", fontSize:14
              }}>
                <span style={{ color:"var(--text-3)", fontSize:12, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.5px" }}>{k}</span>
                <span style={{ color:"var(--text-1)", fontWeight:600 }}>{v}</span>
              </div>
            ))}

            {/* Recruiter */}
            <div style={{
              marginTop:20, padding:16, background:"var(--bg-raised)",
              borderRadius:"var(--r)", border:"1px solid var(--border)"
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{
                  width:36, height:36, borderRadius:"50%", flexShrink:0,
                  background:"linear-gradient(135deg, var(--cyan), #6366f1)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontWeight:700, color:"var(--bg-base)", fontSize:13
                }}>
                  {(job.recruiter?.name || "R")[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:"var(--text-1)" }}>
                    {job.recruiter?.name || "Recruiter"}
                  </div>
                  <div style={{ fontSize:12, color:"var(--text-3)" }}>Talent Team</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            {currentUserRole === "student" ? (
              <button
                onClick={() => onApply?.(job._id)}
                disabled={applied}
                style={{
                  width:"100%", marginTop:20, padding:13, border:"none",
                  borderRadius:"var(--r-sm)", fontFamily:"var(--font-ui)",
                  fontSize:15, fontWeight:700, cursor: applied ? "default" : "pointer",
                  background: applied ? "var(--bg-raised)" : "var(--cyan)",
                  color: applied ? "var(--text-3)" : "var(--bg-base)",
                  transition:"all 0.2s",
                  boxShadow: applied ? "none" : "0 0 20px rgba(34,211,238,0.3)"
                }}
              >
                {applied ? "Applied ✓" : "Apply Now →"}
              </button>
            ) : (
              <button disabled style={{
                width:"100%", marginTop:20, padding:13, border:"none",
                borderRadius:"var(--r-sm)", background:"var(--bg-raised)",
                color:"var(--text-3)", fontFamily:"var(--font-ui)", fontSize:15
              }}>
                Only students can apply
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cn-slide-up { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @media (max-width:700px) { .modal-body-grid { grid-template-columns:1fr !important; } }
      `}</style>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <p style={{
      fontSize:11, letterSpacing:"2px", textTransform:"uppercase",
      color:"var(--text-3)", fontWeight:700, marginBottom:14
    }}>{children}</p>
  );
}
