import React from "react";

const ResumeAnalysisCard = React.memo(function ResumeAnalysisCard({ analysis, loading, onReanalyze }) {
   if (loading && !analysis) {
      return (
         <div className="cn-card" style={{ padding: 24, animation: "cn-pulse 1.5s infinite" }}>
            <div style={{ height: 24, width: 150, background: "var(--bg-raised)", borderRadius: 4, marginBottom: 16 }}></div>
            <div style={{ height: 16, width: "100%", background: "var(--bg-raised)", borderRadius: 4, marginBottom: 8 }}></div>
            <div style={{ height: 16, width: "80%", background: "var(--bg-raised)", borderRadius: 4 }}></div>
         </div>
      );
   }

   if (!analysis) {
      return (
         <div className="cn-card" style={{ padding: 24, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📄</div>
            <h3 style={{ fontSize: "1.2rem", color: "var(--text-1)", marginBottom: 8 }}>No Resume Analysis</h3>
            <p style={{ color: "var(--text-2)", marginBottom: 16 }}>Upload a resume from your profile to get AI-powered feedback.</p>
         </div>
      );
   }

   const displayScore = analysis.atsScore || 0;
   const scoreColor = displayScore >= 80 ? "var(--green)" : displayScore >= 50 ? "var(--orange)" : "var(--red)";

   return (
      <div className="cn-card" style={{ padding: 24, position: "relative", overflow: "hidden", opacity: loading ? 0.7 : 1, transition: "opacity 0.3s" }}>
         <div style={{ position: "absolute", top: -50, right: -50, width: 150, height: 150, background: "var(--cyan)", filter: "blur(60px)", opacity: 0.15, borderRadius: "50%" }}></div>

         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
               <h2 style={{ fontSize: "1.4rem", color: "var(--text-1)", display: "flex", alignItems: "center", gap: 8 }}>
                  Resume Analysis
                  {loading && <span style={{ fontSize: 14, animation: "cn-pulse 1.5s infinite" }}>🔄 Updating...</span>}
               </h2>
               <p style={{ color: "var(--text-2)", fontSize: 14, marginTop: 4 }}>Based on your latest uploaded resume.</p>
            </div>

            <div style={{ textAlign: "right" }}>
               <div style={{ fontSize: "2rem", fontWeight: 800, color: scoreColor, transition: "color 0.5s ease" }}>
                  {displayScore}/100
               </div>
               <div style={{ fontSize: 12, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: 1 }}>Overall Score</div>
            </div>
         </div>

         <div style={{ width: "100%", height: 8, background: "var(--bg-raised)", borderRadius: 4, marginTop: 16, overflow: "hidden" }}>
            <div style={{
               height: "100%", width: `${displayScore}%`,
               background: scoreColor, transition: "width 1s cubic-bezier(0.16, 1, 0.3, 1), background 1s ease"
            }}></div>
         </div>

         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 24, marginTop: 24 }}>
            <div style={{ background: "var(--bg-surface)", padding: 16, borderRadius: 12, border: "1px solid var(--border)" }}>
               <h4 style={{ color: "var(--green)", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                  ✅ Key Strengths
               </h4>
               <ul style={{ paddingLeft: 20, color: "var(--text-2)", fontSize: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                  {analysis.strengths?.map((s, i) => <li key={i}>{s}</li>)}
               </ul>
            </div>

            <div style={{ background: "var(--bg-surface)", padding: 16, borderRadius: 12, border: "1px solid var(--border)" }}>
               <h4 style={{ color: "var(--orange)", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                  ⚡ Areas for Improvement
               </h4>
               <ul style={{ paddingLeft: 20, color: "var(--text-2)", fontSize: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                  {analysis.weaknesses?.map((w, i) => <li key={i}>{w}</li>)}
               </ul>
            </div>
         </div>

         {analysis.suggestions && analysis.suggestions.length > 0 && (
            <div style={{ marginTop: 24, background: "var(--bg-raised)", padding: 16, borderRadius: 12 }}>
               <h4 style={{ color: "var(--cyan)", marginBottom: 8, fontSize: 14 }}>💡 AI Suggestions</h4>
               <p style={{ color: "var(--text-2)", fontSize: 14, lineHeight: 1.6 }}>{analysis.suggestions.join(" ")}</p>
            </div>
         )}

         <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
            <button className="cn-btn cn-btn-ghost cn-btn-sm" onClick={onReanalyze} disabled={loading}>
               {loading ? "Analyzing..." : "🔄 Re-analyze Resume"}
            </button>
         </div>
      </div>
   );
});

export default ResumeAnalysisCard;
