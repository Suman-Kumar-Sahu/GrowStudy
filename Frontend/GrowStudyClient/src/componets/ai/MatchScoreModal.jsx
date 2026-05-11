import React, { useState, useEffect } from "react";
import api from "../../api/Axios";

export default function MatchScoreModal({ jobId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    if (!jobId) return;

    const fetchScore = async () => {
       setLoading(true);
       try {
         const res = await api.get(`/ai/match-score/${jobId}`);
         if (active) setData(res.data.data);
       } catch (err) {
         if (active) setError(err.response?.data?.message || "Failed to load matching details");
       } finally {
         if (active) setLoading(false);
       }
    };
    fetchScore();
    return () => { active = false; };
  }, [jobId]);

  return (
    <div style={{ 
       position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
       background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
       zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
       padding: 24, animation: "cn-fade-in 0.2s ease"
    }}>
       <div className="cn-card" style={{ 
          width: "100%", maxWidth: 600, maxHeight: "90vh", overflowY: "auto", 
          padding: 32, position: "relative",
          animation: "cn-slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
       }}>
          <button onClick={onClose} aria-label="Close" style={{
             position: "absolute", top: 16, right: 16, background: "var(--bg-raised)",
             border: "none", width: 32, height: 32, borderRadius: "50%",
             display: "flex", alignItems: "center", justifyContent: "center",
             cursor: "pointer", color: "var(--text-1)", fontSize: 16
          }} className="hover-bg-surface">✕</button>

          {loading ? (
             <div style={{ padding: "40px 0", textAlign: "center" }}>
                <div style={{ fontSize: 32, animation: "cn-pulse 1.5s infinite" }}>🤖</div>
                <div style={{ color: "var(--text-2)", marginTop: 16 }}>Analyzing fit...</div>
             </div>
          ) : error ? (
             <div style={{ padding: "20px 0", textAlign: "center", color: "var(--red)" }}>
                <h3 style={{ marginBottom: 8 }}>Analysis Error</h3>
                <p>{error}</p>
             </div>
          ) : data && data.matchReport ? (
             <div>
                <h2 style={{ fontSize: "1.4rem", color: "var(--text-1)", marginBottom: 4 }}>
                   Job Match Analysis
                </h2>
                <div style={{ fontSize: 14, color: "var(--text-2)", marginBottom: 24 }}>
                   {data.job.title} @ {data.job.company}
                </div>

                {/* Score */}
                <div style={{ 
                   background: "var(--bg-surface)", padding: 24, borderRadius: 12, border: "1px solid var(--border)",
                   display: "flex", alignItems: "center", gap: 24, marginBottom: 24
                }}>
                   <div style={{ 
                      width: 80, height: 80, borderRadius: "50%", 
                      border: `4px solid ${data.matchReport.score >= 80 ? "var(--green)" : data.matchReport.score >= 50 ? "var(--orange)" : "var(--red)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "1.8rem", fontWeight: 800, color: "var(--text-1)"
                   }}>
                      {data.matchReport.score}
                   </div>
                   <div>
                      <h3 style={{ fontSize: "1.1rem", color: "var(--text-1)" }}>Match Score</h3>
                      <p style={{ color: "var(--text-3)", fontSize: 13, marginTop: 4 }}>Based on your skills and experience vs the job requirements.</p>
                   </div>
                </div>

                <div style={{ display: "grid", gap: 16 }}>
                   <div style={{ background: "color-mix(in srgb, var(--green) 10%, transparent)", padding: 16, borderRadius: 8, border: "1px solid color-mix(in srgb, var(--green) 30%, transparent)" }}>
                      <h4 style={{ color: "var(--green)", marginBottom: 8, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                         ✅ Matching Skills
                      </h4>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                         {data.matchReport.matchingSkills?.length ? data.matchReport.matchingSkills.map((s, i) => (
                           <span key={i} style={{ background: "var(--bg-base)", padding: "4px 8px", borderRadius: 4, fontSize: 12, color: "var(--text-1)" }}>{s}</span>
                         )) : <span style={{ color: "var(--text-3)", fontSize: 13 }}>None detected.</span>}
                      </div>
                   </div>

                   <div style={{ background: "color-mix(in srgb, var(--red) 10%, transparent)", padding: 16, borderRadius: 8, border: "1px solid color-mix(in srgb, var(--red) 30%, transparent)" }}>
                      <h4 style={{ color: "var(--red)", marginBottom: 8, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                         ⚠️ Skill Gaps
                      </h4>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                         {data.matchReport.missingSkills?.length ? data.matchReport.missingSkills.map((s, i) => (
                           <span key={i} style={{ background: "var(--bg-base)", padding: "4px 8px", borderRadius: 4, fontSize: 12, color: "var(--text-1)" }}>{s}</span>
                         )) : <span style={{ color: "var(--text-3)", fontSize: 13 }}>None detected! You meet the core requirements.</span>}
                      </div>
                   </div>
                </div>

                {data.matchReport.explanation && (
                  <div style={{ marginTop: 24 }}>
                     <h4 style={{ color: "var(--text-1)", marginBottom: 8, fontSize: 14 }}>AI Insight</h4>
                     <p style={{ color: "var(--text-2)", fontSize: 14, lineHeight: 1.6, background: "var(--bg-surface)", padding: 16, borderRadius: 8, border: "1px solid var(--border)" }}>
                        {data.matchReport.explanation}
                     </p>
                  </div>
                )}
             </div>
          ) : null}
       </div>
       <style>{`.hover-bg-surface:hover { background: var(--bg-surface) !important; }`}</style>
    </div>
  );
}
