import React, { useState, useContext, useEffect } from "react";
import api from "../api/Axios";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import ProfileCard from "../componets/ProfileCard";
import SkillsCard from "../componets/SkillsCard";
import ResumeCard from "../componets/ResumeCard";

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const toast = useToast();
  const [isEditing,   setIsEditing]   = useState(false);
  const [resumeFile,  setResumeFile]  = useState(null);
  const [loadingMap, setLoadingMap]   = useState({ upload: false, update: false });

  const [form, setForm] = useState({
    name: "", about: "", skills: "",
    education: [{ college: "", degree: "", year: "" }],
    experience: [{ company: "", role: "", duration: "" }],
  });

  useEffect(() => {
    if (!user) return;
    setForm({
      name:       user.name || "",
      about:      user.about || "",
      skills:     (user.skills || []).join(", "),
      avatar:     user.avatar || "",
      education:  user.education?.length  ? user.education  : [{ college: "", degree: "", year: "" }],
      experience: user.experience?.length ? user.experience : [{ company: "", role: "", duration: "" }],
    });
  }, [user]);

  const handleUpload = async (e) => {
    e?.preventDefault();
    if (!resumeFile) { toast.warn("No file selected", "Choose a resume first."); return; }
    const allowed = ["application/pdf", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(resumeFile.type)) { toast.error("Invalid file type", "Only PDF, DOC, DOCX allowed."); return; }
    if (resumeFile.size > 5 * 1024 * 1024) { toast.error("File too large", "Max 5MB allowed."); return; }

    setLoadingMap(m => ({ ...m, upload: true }));
    const fd = new FormData();
    fd.append("resume", resumeFile);
    try {
      const res = await api.post("/users/upload-resume", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setUser(prev => ({ ...prev, resumeUrl: res.data.resumeUrl || "" }));
      setResumeFile(null);
      toast.success("Resume uploaded! ✅", "Recruiters can now view your resume.");
    } catch (err) {
      toast.error("Upload failed", err.response?.data?.message || "Please try again.");
    } finally {
      setLoadingMap(m => ({ ...m, upload: false }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoadingMap(m => ({ ...m, update: true }));
    try {
      const payload = {
        ...form,
        skills:     form.skills.split(",").map(s => s.trim()).filter(Boolean),
        education:  form.education.filter(e => e.college && e.degree && e.year),
        experience: form.experience.filter(e => e.company && e.role && e.duration),
      };
      const res = await api.put("/users/profile", payload);
      setUser(res.data.user);
      setIsEditing(false);
      toast.success("Profile saved! 🎉", "Your profile has been updated.");
    } catch (err) {
      toast.error("Save failed", err.response?.data?.message || "Please try again.");
    } finally {
      setLoadingMap(m => ({ ...m, update: false }));
    }
  };

  if (!user) return null;

  return (
    <div className="cn-page-sm">
      <div style={{ marginBottom: 24 }}>
        <span className="cn-section-label">Your Identity</span>
        <h1 style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 800, color: "var(--text-1)", marginTop: 4 }}>
          My Profile
        </h1>
      </div>

      {/* Profile card (view mode) */}
      <ProfileCard
        avatar={user.avatar}
        name={user.name}
        about={user.about}
        role={user.role}
        skills={user.skills || []}
        education={user.education || []}
        experience={user.experience || []}
        onEdit={() => setIsEditing(prev => !prev)}
      />

      {/* Resume (student only) */}
      {user.role === "student" && (
        <ResumeCard
          resumeUrl={user.resumeUrl || ""}
          resumeFile={resumeFile}
          setResumeFile={setResumeFile}
          handleUpload={handleUpload}
          loading={loadingMap.upload}
        />
      )}

      {/* Edit form */}
      {isEditing && (
        <SkillsCard
          form={form}
          setForm={setForm}
          handleUpdate={handleUpdate}
          loading={loadingMap.update}
          setUser={setUser}
        />
      )}
    </div>
  );
}