import React from "react";
import { Link } from "react-router-dom";

const JobRecommendationList = React.memo(function JobRecommendationList({ recommendations, loading, onScoreClick }) {
  if (loading && recommendations.length === 0) {
    return (
      <div className="cn-card" style={{ padding: 24, animation: "cn-pulse 1.5s infinite", gridColumn: "1/-1" }}>
        <div style={{ height: 24, width: 200, background: "var(--bg-raised)", borderRadius: 4, marginBottom: 16 }}></div>
        <div style={{ display: "flex", gap: 16, flexDirection: "column" }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: 80, width: "100%", background: "var(--bg-surface)", borderRadius: 8 }}></div>
          ))}
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="cn-card" style={{ padding: 24, textAlign: "center", gridColumn: "1/-1" }}>
        <h3 style={{ fontSize: "1.2rem", color: "var(--text-1)", marginBottom: 8 }}>No Recommendations</h3>
        <p style={{ color: "var(--text-2)" }}>Upload a resume or update your profile skills to get matches.</p>
      </div>
    );
  }

  return (
    <div className="cn-card" style={{ padding: 24, gridColumn: "1/-1" }}>
      <h2 style={{ fontSize: "1.4rem", color: "var(--text-1)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        💼 AI Recommended Jobs
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        {recommendations.slice(0, 6).map((rec, idx) => {
          const job = rec.job;
          if (!job) return null;
          const matchPerc = Math.round((rec.score || 0) * 100) || rec.matchPercentage;
          const matchColor = matchPerc >= 80 ? "var(--green)" : matchPerc >= 50 ? "var(--orange)" : "var(--red)";

          return (
            <div key={job._id || idx} style={{
              background: "var(--bg-surface)", border: "1px solid var(--border)",
              borderRadius: 12, padding: 16, display: "flex", flexDirection: "column",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
              className="hover-lift"
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <Link to={`/jobs/${job._id}`} style={{ color: "var(--text-1)", textDecoration: "none", fontSize: "1.1rem", fontWeight: 700, display: "block" }}>
                    {job.title}
                  </Link>
                  <div style={{ color: "var(--text-2)", fontSize: 13, marginTop: 4 }}>
                    {job.company} • {job.location || "Remote"}
                  </div>
                </div>

                <div style={{
                  background: `color-mix(in srgb, ${matchColor} 15%, transparent)`,
                  color: matchColor, padding: "4px 8px", borderRadius: 16, fontSize: 12, fontWeight: 700, border: `1px solid ${matchColor}`
                }}>
                  {matchPerc}% Match
                </div>
              </div>

              <p style={{ color: "var(--text-3)", fontSize: 13, marginTop: 12, lineHeight: 1.5, flex: 1 }}>
                "{rec.reason || "Good fit based on your profile."}"
              </p>

              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
                <button className="cn-btn cn-btn-ghost cn-btn-sm" onClick={() => onScoreClick(job._id)} style={{ flex: 1, justifyContent: "center" }}>
                  🎯 Deep Match Analysis
                </button>
              </div>
            </div>
          )
        })}
      </div>
      <style>{`.hover-lift:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }`}</style>
    </div>
  )
});

export default JobRecommendationList;
