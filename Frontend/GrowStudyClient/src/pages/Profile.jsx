import React, { useState, useContext, useEffect } from "react";
import api from "../api/Axios";
import { AuthContext } from "../context/AuthContext";
import ProfileCard from "../componets/ProfileCard";
import SkillsCard from "../componets/SkillsCard";
import ResumeCard from "../componets/ResumeCard";
import "../styles/Profile.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  const [form, setForm] = useState({
    name: "",
    about: "",
    skills: "",
    education: [{ college: "", degree: "", year: "" }],
    experience: [{ company: "", role: "", duration: "" }],
  });

  const [loading, setLoading] = useState({
    upload: false,
    update: false,
  });

  // 🔁 Sync form when user loads/updates
  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name || "",
      about: user.about || "",
      skills: (user.skills || []).join(", "),
      education:
        user.education?.length > 0
          ? user.education
          : [{ college: "", degree: "", year: "" }],
      experience:
        user.experience?.length > 0
          ? user.experience
          : [{ company: "", role: "", duration: "" }],
    });
  }, [user]);

  // 📄 Upload Resume
  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!resumeFile) {
      toast.warning("Please select a resume file");
      return;
    }

    // Validate file type
    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(resumeFile.type)) {
      toast.error("Only PDF, DOC, and DOCX files are allowed");
      return;
    }

    // Validate file size (5MB max)
    if (resumeFile.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setLoading((prev) => ({ ...prev, upload: true }));

    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      const res = await api.post("/users/upload-resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update user context with new resume URL
      setUser((prev) => ({ 
        ...prev, 
        resumeUrl: res.data.resumeUrl || "" 
      }));

      setResumeFile(null); // Clear file input
      toast.success("Resume uploaded successfully ✅");
    } catch (err) {
      console.error("Resume upload error:", err);
      const errorMsg = err.response?.data?.message || "Resume upload failed";
      toast.error(errorMsg + " ❌");
    } finally {
      setLoading((prev) => ({ ...prev, upload: false }));
    }
  };

  // 📝 Update Profile
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, update: true }));

    try {
      const payload = {
        ...form,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        education: form.education.filter(
          (e) => e.college && e.degree && e.year
        ),
        experience: form.experience.filter(
          (e) => e.company && e.role && e.duration
        ),
      };

      const res = await api.put("/users/profile", payload);

      setUser(res.data);
      setIsEditing(false);
      toast.success("Profile updated successfully 🎉");
    } catch (err) {
      console.error("Profile update error:", err);
      const errorMsg = err.response?.data?.message || "Failed to update profile";
      toast.error(errorMsg + " ❌");
    } finally {
      setLoading((prev) => ({ ...prev, update: false }));
    }
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />

      <h1 className="profile-title">My Profile</h1>

      <ProfileCard
        avatar={user.avatar}
        name={user.name}
        about={user.about}
        role={user.role}
        skills={user.skills || []}
        education={user.education || []}
        experience={user.experience || []}
        onEdit={() => setIsEditing((prev) => !prev)}
      />

      {user.role === "student" && (
            <ResumeCard
              resumeUrl={user.resumeUrl || ""}
              resumeFile={resumeFile}
              setResumeFile={setResumeFile}
              handleUpload={handleUpload}
              loading={loading.upload}
            />
      )}

      {isEditing && (
        <>
          <SkillsCard
            form={form}
            setForm={setForm}
            handleUpdate={handleUpdate}
            loading={loading.update}
          />
        </>
      )}
    </div>
  );
} 