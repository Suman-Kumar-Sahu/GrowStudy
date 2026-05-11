import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{ borderTop:"1px solid var(--border)", background:"var(--bg-surface)" }}>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"56px 24px 32px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1.5fr", gap:48, marginBottom:48 }} className="footer-grid">
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <div style={{
                width:32, height:32, borderRadius:8,
                background:"linear-gradient(135deg, var(--cyan), var(--cyan-d))",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontWeight:800, fontSize:13, color:"var(--bg-base)"
              }}>CN</div>
              <span style={{ fontFamily:"var(--font-serif)", fontSize:"1.3rem", fontStyle:"italic", color:"var(--text-1)" }}>
                CareerNest
              </span>
            </div>
            <p style={{ fontSize:14, color:"var(--text-3)", lineHeight:1.7, maxWidth:260 }}>
              Connecting ambitious students with top companies. Build your career identity and grow faster.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize:13, fontWeight:700, color:"var(--text-2)", marginBottom:16, letterSpacing:"1px", textTransform:"uppercase" }}>Platform</h4>
            <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:10 }}>
              {[["Jobs", "/jobs"], ["Student Dashboard", "/student/dashboard"], ["Recruiter Dashboard", "/recruiter"], ["Profile", "/profile"]].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} style={{ fontSize:14, color:"var(--text-3)", textDecoration:"none", transition:"color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = "var(--text-1)"}
                    onMouseLeave={e => e.target.style.color = "var(--text-3)"}
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize:13, fontWeight:700, color:"var(--text-2)", marginBottom:16, letterSpacing:"1px", textTransform:"uppercase" }}>Company</h4>
            <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:10 }}>
              {["About", "Blog", "Careers", "Privacy", "Terms"].map(item => (
                <li key={item}>
                  <a href="#" style={{ fontSize:14, color:"var(--text-3)", textDecoration:"none" }}>{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize:13, fontWeight:700, color:"var(--text-2)", marginBottom:16, letterSpacing:"1px", textTransform:"uppercase" }}>Stay Updated</h4>
            <p style={{ fontSize:14, color:"var(--text-3)", marginBottom:14 }}>Get new job alerts and career tips weekly.</p>
            <div style={{ display:"flex", gap:8 }}>
              <input
                type="email"
                placeholder="your@email.com"
                className="cn-input"
                style={{ flex:1 }}
              />
              <button className="cn-btn cn-btn-primary cn-btn-sm">→</button>
            </div>
            <div style={{ display:"flex", gap:16, marginTop:20 }}>
              {["𝕏","in","𝗳"].map(icon => (
                <a key={icon} href="#" style={{
                  width:34, height:34, borderRadius:8,
                  background:"var(--bg-raised)", border:"1px solid var(--border)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color:"var(--text-3)", textDecoration:"none", fontSize:14,
                  transition:"all 0.2s"
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-glow)"; e.currentTarget.style.color = "var(--cyan)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-3)"; }}
                >{icon}</a>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop:"1px solid var(--border)", paddingTop:24, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <p style={{ fontSize:13, color:"var(--text-3)" }}>© {new Date().getFullYear()} CareerNest. All rights reserved.</p>
          <div style={{ display:"flex", gap:20 }}>
            {["Privacy Policy","Terms of Service","Cookie Policy"].map(item => (
              <a key={item} href="#" style={{ fontSize:13, color:"var(--text-3)", textDecoration:"none" }}>{item}</a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width:900px) { .footer-grid { grid-template-columns:1fr 1fr !important; } }
        @media (max-width:600px) { .footer-grid { grid-template-columns:1fr !important; } }
      `}</style>
    </footer>
  );
}
