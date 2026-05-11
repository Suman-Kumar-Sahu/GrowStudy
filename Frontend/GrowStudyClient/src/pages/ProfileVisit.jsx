import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ProfileCard from "../componets/ProfileCard";
import api from "../api/Axios";
import { Spinner } from "../componets/ui/Loader";

export default function ProfileVisit() {
  const { id }    = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/users/profile/${id}`);
        setProfile(res.data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return (
    <div className="cn-loading-screen">
      <Spinner size="lg" />
      <p style={{ color: "var(--text-3)", fontSize: 14 }}>Loading profile…</p>
    </div>
  );

  if (error || !profile) return (
    <div className="cn-loading-screen">
      <div style={{ fontSize: 48, marginBottom: 16 }}>🤷</div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-1)", marginBottom: 8 }}>User not found</h2>
      <p style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 24 }}>This profile doesn't exist or isn't available.</p>
      <Link to="/" className="cn-btn cn-btn-outline">← Go Home</Link>
    </div>
  );

  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100vh" }}>
      {/* Cover banner */}
      <div style={{
        height: 200,
        background: "linear-gradient(135deg, rgba(34,211,238,0.12) 0%, rgba(99,102,241,0.08) 50%, rgba(16,185,129,0.06) 100%)",
        borderBottom: "1px solid var(--border)",
        position: "relative", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(34,211,238,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.03) 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        }} />
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 64px" }}>
        {/* Two-column layout */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 280px", gap: 24,
          alignItems: "flex-start", marginTop: -64
        }} className="profile-visit-grid">

          {/* Left: Profile card */}
          <ProfileCard
            avatar={profile.avatar}
            name={profile.name}
            about={profile.about}
            role={profile.role}
            skills={profile.skills || []}
            education={profile.education || []}
            experience={profile.experience || []}
            publicView={true}
          />

          {/* Right: Sidebar info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Contact info */}
            <div style={{
              background: "var(--bg-surface)", border: "1px solid var(--border)",
              borderRadius: "var(--r-xl)", padding: 24, marginTop: 64
            }}>
              <div style={{
                fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "1.5px", color: "var(--text-3)", marginBottom: 16
              }}>Contact</div>

              {[
                { icon: "✉️", label: "Email",  value: profile.email || "N/A" },
                { icon: "📞", label: "Phone",  value: profile.phone || "Not shared" },
                { icon: "🌐", label: "Role",   value: profile.role, cap: true },
              ].map(({ icon, label, value, cap }) => (
                <div key={label} style={{
                  display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12
                }}>
                  <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
                    <div style={{ fontSize: 14, color: "var(--text-1)", marginTop: 2, textTransform: cap ? "capitalize" : "none" }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{
              background: "var(--bg-surface)", border: "1px solid var(--border)",
              borderRadius: "var(--r-xl)", padding: 20,
              display: "flex", flexDirection: "column", gap: 10
            }}>
              {profile.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cn-btn cn-btn-primary cn-btn-block"
                  style={{ textDecoration: "none" }}
                >
                  📄 View Resume
                </a>
              )}
              <button className="cn-btn cn-btn-ghost cn-btn-block">
                👋 Connect
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .profile-visit-grid { grid-template-columns: 1fr !important; margin-top: -32px !important; }
          .profile-visit-grid > div:last-child > div { margin-top: 0 !important; }
        }
      `}</style>
    </div>
  );
}
