import React, { useState } from "react";
import api from "../api/Axios";
import { useToast } from "../context/ToastContext";
import { Spinner } from "./ui/Loader";

export default function SkillsCard({ form, setForm, handleUpdate, loading, setUser }) {
  const toast = useToast();
  const [avatarFile,    setAvatarFile]    = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);

  /* ─── Avatar ─── */
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) { toast.warn("No file selected", "Please select an image first"); return; }
    setAvatarLoading(true);
    try {
      const fd = new FormData();
      fd.append("avatar", avatarFile);
      const res = await api.post("/users/upload-avatar", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const newAvatar = (res.data.avatar || res.data.avatarUrl) + `?t=${Date.now()}`;
      if (typeof setUser === "function") setUser(prev => ({ ...prev, avatar: newAvatar }));
      setForm(prev => ({ ...prev, avatar: newAvatar }));
      toast.success("Avatar updated!", "Your profile picture has been changed.");
    } catch {
      toast.error("Upload failed", "Please try again.");
    } finally {
      setAvatarLoading(false);
    }
  };

  /* ─── Education ─── */
  const addEdu    = () => setForm(f => ({ ...f, education: [...f.education, { college: "", degree: "", year: "" }] }));
  const removeEdu = (i) => setForm(f => ({ ...f, education: f.education.filter((_, idx) => idx !== i) }));
  const updateEdu = (i, field, val) => setForm(f => {
    const ed = [...f.education]; ed[i] = { ...ed[i], [field]: val }; return { ...f, education: ed };
  });

  /* ─── Experience ─── */
  const addExp    = () => setForm(f => ({ ...f, experience: [...f.experience, { company: "", role: "", duration: "" }] }));
  const removeExp = (i) => setForm(f => ({ ...f, experience: f.experience.filter((_, idx) => idx !== i) }));
  const updateExp = (i, field, val) => setForm(f => {
    const ex = [...f.experience]; ex[i] = { ...ex[i], [field]: val }; return { ...f, experience: ex };
  });

  const sectionTitle = (label) => (
    <div style={{
      fontSize: 12, fontWeight: 700, textTransform: "uppercase",
      letterSpacing: "1.5px", color: "var(--text-3)", marginBottom: 14
    }}>{label}</div>
  );

  return (
    <div style={{
      background: "var(--bg-surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--r-xl)",
      padding: 28, marginTop: 24
    }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-1)", marginBottom: 24 }}>Edit Profile</h2>

      <form onSubmit={handleUpdate}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Avatar */}
          <div>
            {sectionTitle("Profile Picture")}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%", overflow: "hidden", flexShrink: 0,
                border: "2px solid var(--border-glow)", boxShadow: "var(--glow-cyan)"
              }}>
                {avatarPreview || form.avatar
                  ? <img src={avatarPreview || form.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, var(--cyan), #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 22, color: "var(--bg-base)" }}>
                      {(form.name?.[0] || "U").toUpperCase()}
                    </div>
                }
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{
                  padding: "7px 14px", borderRadius: "var(--r-sm)", border: "1px solid var(--border)",
                  background: "var(--bg-raised)", color: "var(--text-2)", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", transition: "all 0.2s"
                }}>
                  Choose Image
                  <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />
                </label>
                <button type="button" onClick={handleAvatarUpload} disabled={!avatarFile || avatarLoading}
                  className="cn-btn cn-btn-primary cn-btn-sm">
                  {avatarLoading ? <><Spinner size="sm" /> Uploading…</> : "Upload"}
                </button>
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="cn-label">Full Name</label>
            <input type="text" className="cn-input"
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>

          {/* About */}
          <div>
            <label className="cn-label">About / Bio</label>
            <textarea className="cn-input cn-textarea" rows={3}
              placeholder="Tell recruiters about yourself…"
              value={form.about} onChange={e => setForm(f => ({ ...f, about: e.target.value }))} />
          </div>

          {/* Skills */}
          <div>
            <label className="cn-label">Skills <span style={{ color: "var(--text-3)", fontWeight: 400 }}>(comma separated)</span></label>
            <input type="text" className="cn-input"
              placeholder="React, Node.js, Python, Figma"
              value={form.skills} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))} />
          </div>

          {/* Education */}
          <div>
            {sectionTitle("🎓 Education")}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {(form.education || []).map((edu, idx) => (
                <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 120px auto", gap: 10, alignItems: "end" }}>
                  <div>
                    {idx === 0 && <label className="cn-label">College</label>}
                    <input type="text" className="cn-input" placeholder="University" value={edu.college}
                      onChange={e => updateEdu(idx, "college", e.target.value)} />
                  </div>
                  <div>
                    {idx === 0 && <label className="cn-label">Degree</label>}
                    <input type="text" className="cn-input" placeholder="B.Tech CSE" value={edu.degree}
                      onChange={e => updateEdu(idx, "degree", e.target.value)} />
                  </div>
                  <div>
                    {idx === 0 && <label className="cn-label">Year</label>}
                    <input type="text" className="cn-input" placeholder="2024" value={edu.year}
                      onChange={e => updateEdu(idx, "year", e.target.value)} />
                  </div>
                  <button type="button" onClick={() => removeEdu(idx)}
                    style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", fontSize: 16, padding: "10px 4px", marginTop: idx === 0 ? 22 : 0 }}>
                    ✕
                  </button>
                </div>
              ))}
              <button type="button" onClick={addEdu}
                style={{ background: "none", border: "none", color: "var(--cyan)", cursor: "pointer", fontSize: 13, fontWeight: 600, textAlign: "left", padding: 0, fontFamily: "var(--font-ui)" }}>
                + Add Education
              </button>
            </div>
          </div>

          {/* Experience */}
          <div>
            {sectionTitle("💼 Experience")}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {(form.experience || []).map((exp, idx) => (
                <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 140px auto", gap: 10, alignItems: "end" }}>
                  <div>
                    {idx === 0 && <label className="cn-label">Company</label>}
                    <input type="text" className="cn-input" placeholder="Company" value={exp.company}
                      onChange={e => updateExp(idx, "company", e.target.value)} />
                  </div>
                  <div>
                    {idx === 0 && <label className="cn-label">Role</label>}
                    <input type="text" className="cn-input" placeholder="Software Intern" value={exp.role}
                      onChange={e => updateExp(idx, "role", e.target.value)} />
                  </div>
                  <div>
                    {idx === 0 && <label className="cn-label">Duration</label>}
                    <input type="text" className="cn-input" placeholder="Jan–Jun 2024" value={exp.duration}
                      onChange={e => updateExp(idx, "duration", e.target.value)} />
                  </div>
                  <button type="button" onClick={() => removeExp(idx)}
                    style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", fontSize: 16, padding: "10px 4px", marginTop: idx === 0 ? 22 : 0 }}>
                    ✕
                  </button>
                </div>
              ))}
              <button type="button" onClick={addExp}
                style={{ background: "none", border: "none", color: "var(--cyan)", cursor: "pointer", fontSize: 13, fontWeight: 600, textAlign: "left", padding: 0, fontFamily: "var(--font-ui)" }}>
                + Add Experience
              </button>
            </div>
          </div>

          {/* Submit */}
          <div style={{ display: "flex", gap: 12 }}>
            <button type="submit" disabled={loading} className="cn-btn cn-btn-primary" style={{ padding: "12px 32px" }}>
              {loading ? <><Spinner size="sm" /> Saving…</> : "✓ Save Profile"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
