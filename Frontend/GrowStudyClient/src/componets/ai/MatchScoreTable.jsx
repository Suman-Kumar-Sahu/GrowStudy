import React from "react";
import { Link } from "react-router-dom";

const MatchScoreTable = React.memo(function MatchScoreTable({ scores, loading }) {
   if (loading && (!scores || scores.length === 0)) {
      return <div className="cn-card" style={{ padding: 24, animation: "cn-pulse 1.5s infinite" }}>Loading Application Matches...</div>;
   }

   if (!scores || scores.length === 0) {
      return null;
   }

   // Sort by highest match score
   const sorted = [...scores].sort((a, b) => {
      const scoreA = a.matchReport?.score || 0;
      const scoreB = b.matchReport?.score || 0;
      return scoreB - scoreA;
   });

   return (
      <div className="cn-card" style={{ padding: 24 }}>
         <h2 style={{ fontSize: "1.4rem", color: "var(--text-1)", marginBottom: 16 }}>
            📊 Matches for Applied Jobs
         </h2>

         <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
               <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-3)", fontSize: 13, textTransform: "uppercase" }}>
                     <th style={{ padding: "12px 16px" }}>Job</th>
                     <th style={{ padding: "12px 16px" }}>Status</th>
                     <th style={{ padding: "12px 16px" }}>Match Score</th>
                     <th style={{ padding: "12px 16px" }}>Action</th>
                  </tr>
               </thead>
               <tbody>
                  {sorted.map(item => {
                     if (item.error) {
                        return (
                           <tr key={item.applicationId} style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-surface)" }}>
                              <td style={{ padding: "16px", color: "var(--text-2)" }}>Application {item.applicationId.slice(-4)}</td>
                              <td colSpan={3} style={{ padding: "16px", color: "var(--red)", fontSize: 14 }}>{item.error}</td>
                           </tr>
                        );
                     }

                     const scoreColor = item.matchReport.score >= 80 ? "var(--green)" : item.matchReport.score >= 50 ? "var(--orange)" : "var(--red)";

                     return (
                        <tr key={item.applicationId} style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-surface)", transition: "background 0.2s" }} className="hover-row">
                           <td style={{ padding: "16px" }}>
                              <div style={{ fontWeight: 600, color: "var(--text-1)" }}>{item.job.title}</div>
                              <div style={{ fontSize: 13, color: "var(--text-2)" }}>{item.job.company}</div>
                           </td>
                           <td style={{ padding: "16px" }}>
                              <span style={{
                                 background: "var(--bg-raised)", color: "var(--text-1)",
                                 padding: "4px 8px", borderRadius: 4, fontSize: 12, textTransform: "capitalize"
                              }}>
                                 {item.status}
                              </span>
                           </td>
                           <td style={{ padding: "16px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                 <div style={{ width: 100, height: 6, background: "var(--bg-raised)", borderRadius: 3, overflow: "hidden" }}>
                                    <div style={{ width: `${item.matchReport.score}%`, height: "100%", background: scoreColor }}></div>
                                 </div>
                                 <span style={{ fontWeight: 700, color: scoreColor, width: 30 }}>{item.matchReport.score}%</span>
                              </div>
                           </td>
                           <td style={{ padding: "16px" }}>
                              <Link to={`/jobs/${item.job._id}`} className="cn-btn cn-btn-ghost cn-btn-sm" style={{ textDecoration: "none" }}>
                                 View Job
                              </Link>
                           </td>
                        </tr>
                     )
                  })}
               </tbody>
            </table>
         </div>
         <style>{`.hover-row:hover { background: var(--bg-raised) !important; }`}</style>
      </div>
   )
});

export default MatchScoreTable;
