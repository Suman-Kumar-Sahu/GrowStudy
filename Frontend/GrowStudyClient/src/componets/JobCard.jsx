import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import JobDetailModal from "./JobDetailModal";

const TAG_COLORS = {
  React:"cyan", TypeScript:"cyan", JavaScript:"cyan", "Next.js":"cyan", Tailwind:"cyan",
  "Node.js":"purple", Express:"purple", MongoDB:"purple", PostgreSQL:"purple", Redis:"purple",
  Python:"amber", "Machine Learning":"amber", "Data Science":"amber", SQL:"amber",
  Docker:"red", Kubernetes:"red", AWS:"red", DevOps:"red",
  Figma:"green", "UI/UX":"green", Design:"green", Prototyping:"green",
};

function getTagColor(skill) {
  return TAG_COLORS[skill] || "gray";
}

const LOGO_COLORS = [
  { bg:"rgba(34,211,238,0.1)", color:"var(--cyan)" },
  { bg:"rgba(167,139,250,0.1)", color:"var(--purple)" },
  { bg:"rgba(245,158,11,0.1)", color:"var(--amber)" },
  { bg:"rgba(16,185,129,0.1)", color:"var(--green)" },
  { bg:"rgba(244,63,94,0.1)", color:"var(--red)" },
];

function hashColor(str) {
  let h = 0;
  for (let i = 0; i < str?.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xffffffff;
  return LOGO_COLORS[Math.abs(h) % LOGO_COLORS.length];
}

function daysAgo(dateStr) {
  if (!dateStr) return null;
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "1 day ago";
  return `${diff} days ago`;
}

export default function JobCard({ job, onApply, currentUserId, currentUserRole }) {
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);

  const applied = currentUserId && Array.isArray(job.applicants)
    ? job.applicants.includes(currentUserId) : false;
  const logoColor = hashColor(job.company);
  const initials = (job.company || "Co").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

  const handleApply = (e) => {
    e.stopPropagation();
    if (!user) { toast.error("Please log in to apply"); return; }
    if (currentUserRole !== "student") { toast.error("Only students can apply"); return; }
    if (!user.resumeUrl) { toast.error("Upload a resume first to apply"); return; }
    if (applied) { toast.info("Already applied!"); return; }
    onApply?.(job._id);
  };

  return (
    <>
      <div onClick={() => setShowModal(true)} style={{
        background:"var(--bg-surface)", border:"1px solid var(--border)",
        borderRadius:"var(--r-lg)", padding:"24px", cursor:"pointer",
        transition:"all 0.25s", position:"relative", overflow:"hidden"
      }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = "var(--border-glow)";
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 0 32px rgba(34,211,238,0.18), 0 0 0 1px rgba(34,211,238,0.12), 0 4px 40px rgba(0,0,0,0.45)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* Company row */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
          <div style={{
            width:44, height:44, borderRadius:10,
            background:logoColor.bg, border:`1px solid ${logoColor.color}33`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:15, fontWeight:800, color:logoColor.color,
            fontFamily:"var(--font-serif)", fontStyle:"italic"
          }}>{initials}</div>
          <span style={{ fontSize:12, color:"var(--text-3)" }}>
            {daysAgo(job.createdAt) || "Recently"}
          </span>
        </div>

        <div style={{ fontSize:18, fontWeight:700, color:"var(--text-1)", marginBottom:4, lineHeight:1.3 }}>
          {job.title || "Untitled Role"}
        </div>
        <div style={{ fontSize:14, color:"var(--text-2)", marginBottom:14 }}>
          {job.company || "Company"} · {job.location || "Remote"}
        </div>

        {/* Tags */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:18 }}>
          {job.skillsRequired?.slice(0, 3).map((skill, i) => (
            <span key={i} className={`cn-tag cn-tag-${getTagColor(skill)}`}>{skill}</span>
          ))}
          {job.applicants?.length > 30 && (
            <span className="cn-tag cn-tag-amber">🔥 Hot</span>
          )}
        </div>

        {/* Footer */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          paddingTop:16, borderTop:"1px solid var(--border)"
        }}>
          <div style={{ fontSize:13, color:"var(--text-3)" }}>
            <div>💰 {job.stipend || "Negotiable"}</div>
            <div style={{ marginTop:3 }}>👥 {job.applicants?.length || 0} applicants</div>
          </div>
          {currentUserRole === "student" && onApply && (
            <button
              onClick={handleApply}
              style={{
                padding:"8px 18px", borderRadius:8, fontSize:13, fontWeight:600,
                cursor: applied ? "default" : "pointer",
                background: applied
                  ? "rgba(16,185,129,0.1)" : "linear-gradient(135deg, rgba(34,211,238,0.12), rgba(34,211,238,0.06))",
                border: applied
                  ? "1px solid rgba(16,185,129,0.2)" : "1px solid rgba(34,211,238,0.2)",
                color: applied ? "var(--green)" : "var(--cyan)",
                transition:"all 0.2s"
              }}
            >
              {applied ? "Applied ✓" : "Apply Now"}
            </button>
          )}
        </div>
      </div>

      {showModal && (
        <JobDetailModal
          job={job}
          onClose={() => setShowModal(false)}
          onApply={onApply}
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
        />
      )}
    </>
  );
}
