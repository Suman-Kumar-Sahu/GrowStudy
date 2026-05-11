import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Rocket, Users, Shield, Star } from "lucide-react";
import Footer from "../componets/Footer";

export default function Home() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{ position:"relative", zIndex:1 }}>
      {/* Landing Header */}
      <header style={{
        position:"sticky", top:0, zIndex:100,
        backdropFilter:"blur(20px)", background:"rgba(6,9,26,0.85)",
        borderBottom:"1px solid var(--border)"
      }}>
        <div style={{
          maxWidth:1280, margin:"0 auto", padding:"0 24px",
          height:64, display:"flex", alignItems:"center", justifyContent:"space-between"
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{
              width:32, height:32, borderRadius:8,
              background:"linear-gradient(135deg, var(--cyan), var(--cyan-d))",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontWeight:800, fontSize:13, color:"var(--bg-base)"
            }}>CN</div>
            <span style={{ fontFamily:"var(--font-serif)", fontSize:"1.4rem", fontStyle:"italic", color:"var(--text-1)" }}>
              CareerNest
            </span>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <Link to="/user/login" className="cn-btn cn-btn-ghost cn-btn-sm" style={{ textDecoration:"none" }}>Login</Link>
            <Link to="/user/register" className="cn-btn cn-btn-primary cn-btn-sm" style={{ textDecoration:"none" }}>Register Free</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        maxWidth:1280, margin:"0 auto", padding:"80px 24px 60px",
        display:"grid", gridTemplateColumns:"1fr 420px", gap:80, alignItems:"center",
        minHeight:"80vh"
      }} className="hero-grid">
        <div>
          {/* Live badge */}
          <div style={{
            display:"inline-flex", alignItems:"center", gap:8,
            padding:"6px 14px", borderRadius:100,
            border:"1px solid rgba(34,211,238,0.2)", background:"rgba(34,211,238,0.06)",
            fontSize:13, color:"var(--cyan)", fontWeight:500, marginBottom:28
          }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"var(--cyan)", animation:"cn-pulse 2s infinite", display:"block" }} />
            Now live in 12 cities across India
          </div>

          <h1 style={{
            fontFamily:"var(--font-serif)", fontStyle:"italic",
            fontSize:"clamp(3rem, 6vw, 5.5rem)", lineHeight:1.05,
            color:"var(--text-1)", fontWeight:400, marginBottom:24
          }}>
            Where talent<br/>meets{" "}
            <span style={{ color:"var(--cyan)", fontStyle:"normal" }}>opportunity</span>
          </h1>

          <p style={{ fontSize:18, color:"var(--text-2)", lineHeight:1.7, maxWidth:520, marginBottom:40 }}>
            CareerNest connects ambitious students with top recruiters. Build your profile,
            showcase your skills, and land your dream role — faster.
          </p>

          <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
            <button
              onClick={() => navigate("/user/register")}
              className="cn-btn cn-btn-primary cn-btn-lg"
            >
              Get Started Free →
            </button>
            <button
              onClick={() => navigate("/user/login")}
              className="cn-btn cn-btn-ghost cn-btn-lg"
            >
              Sign In
            </button>
          </div>

          {/* Stats */}
          <div style={{ display:"flex", gap:40, marginTop:64 }}>
            {[
              { num:"12k+", label:"Students placed" },
              { num:"840+", label:"Active jobs" },
              { num:"320+", label:"Companies hiring" },
            ].map(({ num, label }) => (
              <div key={label}>
                <div style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", fontSize:"2.2rem", color:"var(--text-1)", lineHeight:1 }}>
                  <span style={{ color:"var(--cyan)" }}>{num.replace(/\d+k?/,"")}</span>
                  {num}
                </div>
                <div style={{ fontSize:13, color:"var(--text-3)", marginTop:4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Visual */}
        <div style={{ position:"relative" }} className="hero-visual">
          {/* Main card */}
          <div style={{
            background:"var(--bg-surface)", border:"1px solid rgba(34,211,238,0.2)",
            borderRadius:"var(--r-xl)", padding:"24px",
            boxShadow:"0 0 32px rgba(34,211,238,0.18), 0 0 0 1px rgba(34,211,238,0.12)"
          }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontSize:13, color:"var(--text-3)" }}>Top match for you</span>
              <span className="cn-tag cn-tag-amber">🔥 Hot</span>
            </div>
            <div style={{ fontSize:18, fontWeight:700, color:"var(--text-1)", marginBottom:4 }}>Frontend Engineer</div>
            <div style={{ fontSize:14, color:"var(--text-2)", marginBottom:14 }}>Groww · Bangalore</div>
            <div style={{ display:"flex", gap:6, marginBottom:18, flexWrap:"wrap" }}>
              <span className="cn-tag cn-tag-cyan">React</span>
              <span className="cn-tag cn-tag-cyan">TypeScript</span>
              <span className="cn-tag cn-tag-cyan">Tailwind</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ fontSize:13, color:"var(--text-2)" }}>₹18,000/mo · Remote</div>
              <button className="cn-btn cn-btn-outline cn-btn-sm">Apply Now</button>
            </div>
          </div>

          {/* Float 1 */}
          <div style={{
            position:"absolute", top:-20, right:-40,
            background:"var(--bg-surface)", border:"1px solid var(--border)",
            borderRadius:"var(--r)", padding:"12px 16px",
            display:"flex", alignItems:"center", gap:12,
            animation:"cn-float1 4s ease-in-out infinite", boxShadow:"var(--shadow)"
          }}>
            <div style={{ width:32, height:32, borderRadius:8, background:"rgba(16,185,129,0.12)", border:"1px solid rgba(16,185,129,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>✓</div>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:"var(--green)" }}>Just hired!</div>
              <div style={{ fontSize:11, color:"var(--text-3)" }}>Ankit got selected at CRED</div>
            </div>
          </div>

          {/* Float 2 */}
          <div style={{
            position:"absolute", bottom:20, left:-50,
            background:"var(--bg-surface)", border:"1px solid var(--border)",
            borderRadius:"var(--r)", padding:"12px 16px",
            display:"flex", alignItems:"center", gap:12,
            animation:"cn-float2 5s ease-in-out infinite", boxShadow:"var(--shadow)"
          }}>
            <span style={{ fontSize:20 }}>⚡</span>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:"var(--amber)" }}>Quick Apply</div>
              <div style={{ fontSize:11, color:"var(--text-3)" }}>2-click application</div>
            </div>
          </div>
        </div>
      </section>

      {/* Companies */}
      <section style={{ borderTop:"1px solid var(--border)", padding:"48px 24px" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", textAlign:"center" }}>
          <p style={{ fontSize:11, letterSpacing:"2.5px", textTransform:"uppercase", color:"var(--text-3)", marginBottom:24 }}>Trusted by teams at</p>
          <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"24px 40px" }}>
            {["Razorpay","Groww","Meesho","Zepto","CRED","Postman","BrowserStack","Swiggy"].map(name => (
              <span key={name} style={{ fontSize:16, fontWeight:700, color:"var(--text-3)", letterSpacing:"-0.5px" }}>{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding:"80px 24px" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <span className="cn-section-label">Why CareerNest</span>
            <h2 className="cn-section-title" style={{ display:"block", marginTop:8 }}>
              Everything you need<br/>to land <em>the role</em>
            </h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:24 }}>
            {[
              { icon:"🎯", color:"cyan", title:"Smart Job Matching", desc:"Our algorithm surfaces roles that match your skills, education, and career goals — not just keyword hits." },
              { icon:"📄", color:"amber", title:"Resume Builder", desc:"Upload your resume and let recruiters discover you, or use your profile as your living digital CV." },
              { icon:"⚡", color:"green", title:"Real-time Updates", desc:"Track every application in real-time. Get notified the moment a recruiter reviews or shortlists you." },
            ].map(({ icon, color, title, desc }) => (
              <div key={title} className="cn-card" style={{ padding:28 }}>
                <div style={{
                  width:48, height:48, borderRadius:12, marginBottom:20,
                  background:`rgba(var(--${color === "cyan" ? "34,211,238" : color === "amber" ? "245,158,11" : "16,185,129"}),0.1)`,
                  border:`1px solid rgba(var(--${color === "cyan" ? "34,211,238" : color === "amber" ? "245,158,11" : "16,185,129"}),0.2)`,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:20
                }}>{icon}</div>
                <h3 style={{ fontSize:17, fontWeight:700, color:"var(--text-1)", marginBottom:8 }}>{title}</h3>
                <p style={{ fontSize:14, color:"var(--text-2)", lineHeight:1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding:"80px 24px", background:"linear-gradient(to bottom, transparent, rgba(34,211,238,0.02), transparent)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <span className="cn-section-label">Success stories</span>
            <h2 className="cn-section-title" style={{ display:"block", marginTop:8 }}>Students who made it</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:20 }}>
            {[
              { name:"Aisha K.", role:"Software Intern @ Groww", quote:"Found a great internship within weeks. The profile builder made me look so professional." },
              { name:"Rahul P.", role:"Data Analyst @ Zepto", quote:"The quick apply feature saved me so much time. Got my offer in under 2 weeks." },
              { name:"Maya R.", role:"UX Designer @ CRED", quote:"Recruiters reached out after I published my portfolio. CareerNest changed my career." },
            ].map((t, i) => (
              <div key={i} className="cn-card" style={{ padding:24 }}>
                <div style={{ display:"flex", gap:2, color:"var(--amber)", marginBottom:14 }}>
                  {[...Array(5)].map((_, s) => <span key={s}>★</span>)}
                </div>
                <p style={{ fontSize:14, color:"var(--text-2)", lineHeight:1.7, fontStyle:"italic", marginBottom:16 }}>
                  "{t.quote}"
                </p>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{
                    width:36, height:36, borderRadius:"50%",
                    background:"linear-gradient(135deg, var(--cyan), #6366f1)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontWeight:700, color:"var(--bg-base)", fontSize:13
                  }}>{t.name[0]}</div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700 }}>{t.name}</div>
                    <div style={{ fontSize:12, color:"var(--text-3)" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding:"80px 24px" }}>
        <div style={{ maxWidth:720, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:40 }}>
            <span className="cn-section-label">FAQ</span>
            <h2 className="cn-section-title" style={{ display:"block", marginTop:8 }}>Common questions</h2>
          </div>
          {[
            { q:"Is CareerNest free?", a:"Yes — the basic plan is completely free for students. Create a profile, upload your resume, and apply to jobs at no cost." },
            { q:"How do I get discovered by recruiters?", a:"Complete your profile with skills, education, and a resume. Recruiters actively search our talent pool." },
            { q:"How do recruiters contact me?", a:"Recruiters can shortlist your application and reach out through the platform's notification system." },
          ].map((f, idx) => (
            <div key={idx} style={{
              border:"1px solid var(--border)", borderRadius:"var(--r)",
              overflow:"hidden", marginBottom:8,
              background: openFaq === idx ? "var(--bg-surface)" : "transparent"
            }}>
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                style={{
                  width:"100%", textAlign:"left", padding:"16px 20px",
                  display:"flex", justifyContent:"space-between", alignItems:"center",
                  background:"none", border:"none", cursor:"pointer", fontFamily:"var(--font-ui)"
                }}
              >
                <span style={{ fontWeight:600, color:"var(--text-1)", fontSize:15 }}>{f.q}</span>
                <span style={{ color:"var(--text-3)", fontSize:18, transition:"transform 0.2s",
                  transform: openFaq === idx ? "rotate(45deg)" : "none" }}>+</span>
              </button>
              {openFaq === idx && (
                <div style={{ padding:"0 20px 16px", fontSize:14, color:"var(--text-2)", lineHeight:1.7 }}>{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:"0 24px 80px" }}>
        <div style={{
          maxWidth:1280, margin:"0 auto",
          background:"linear-gradient(135deg, rgba(34,211,238,0.08), rgba(99,102,241,0.06))",
          border:"1px solid rgba(34,211,238,0.15)", borderRadius:"var(--r-xl)",
          padding:64, textAlign:"center", position:"relative", overflow:"hidden"
        }}>
          <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at center, rgba(34,211,238,0.05) 0%, transparent 70%)", pointerEvents:"none" }} />
          <div style={{ position:"relative" }}>
            <span className="cn-section-label">Get started free</span>
            <h2 className="cn-section-title" style={{ display:"block", marginTop:8, marginBottom:16 }}>
              Your next role is<br/>one profile away
            </h2>
            <p style={{ color:"var(--text-2)", fontSize:16, marginBottom:36 }}>
              Join 12,000+ students who found their careers through CareerNest.
            </p>
            <button onClick={() => navigate("/user/register")} className="cn-btn cn-btn-primary cn-btn-lg">
              Create Your Profile — It's Free
            </button>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes cn-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.85)} }
        @keyframes cn-float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes cn-float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }
        @media (max-width:900px) { .hero-grid { grid-template-columns:1fr !important; } .hero-visual { display:none !important; } }
      `}</style>
    </div>
  );
}
