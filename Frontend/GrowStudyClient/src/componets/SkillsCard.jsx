import React, { useState } from "react";
import api from "../api/Axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SkillsCard({ form, setForm, handleUpdate, setUser }) {
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const  handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarUpload = async () => {
  if (!avatarFile) {
    toast.warning("Please select an image first");
    return;
  }

  try {
    setLoading(true);

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    const res = await api.post("/users/upload-avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success("Avatar uploaded successfully!");

    const newAvatar = (res.data.avatar || res.data.avatarUrl) + `?t=${Date.now()}`;

    // ✅ Instantly update avatar in UI
    if (typeof setUser === "function") {
      setUser((prev) => ({
        ...prev,
        avatar:newAvatar
      }));
    }

    // ✅ Update form too (if needed)
    setForm((prev) => ({
      ...prev,
      avatar: res.data.avatar || res.data.avatarUrl || prev.avatar,
    }));

  } catch (error) {
    console.error("Avatar upload failed:", error);
    toast.error("Avatar upload failed. Please try again.");
  } finally {
    setLoading(false);
  }
  };


  // 🎓 Education handlers
  const addEducation = () =>
    setForm({
      ...form,
      education: [...(form.education || []), { college: "", degree: "", year: "" }],
    });

  const removeEducation = (index) => {
    const updated = [...(form.education || [])];
    updated.splice(index, 1);
    setForm({ ...form, education: updated });
  };

  const updateEducationField = (index, field, value) => {
    const updated = [...(form.education || [])];
    updated[index][field] = value;
    setForm({ ...form, education: updated });
  };

  // 💼 Experience handlers
  const addExperience = () =>
    setForm({
      ...form,
      experience: [...(form.experience || []), { company: "", role: "", duration: "" }],
    });

  const removeExperience = (index) => {
    const updated = [...(form.experience || [])];
    updated.splice(index, 1);
    setForm({ ...form, experience: updated });
  };

  const updateExperienceField = (index, field, value) => {
    const updated = [...(form.experience || [])];
    updated[index][field] = value;
    setForm({ ...form, experience: updated });
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 mt-6 sm:mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">🧠 Skills & Profile</h2>

      <form onSubmit={handleUpdate} className="space-y-6">
        {/* Avatar Section */}
        <div>
          <label className="block font-medium mb-2">Profile Avatar</label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="w-16 h-16 rounded-full object-cover border"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                👤
              </div>
            )}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="block text-sm text-gray-600"
              />
              <button
                onClick={handleAvatarUpload}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold shadow-md hover:scale-[1.02] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading   ? "Uploading..." : "Upload Avatar"}
              </button>
            </div>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block font-medium mb-1">Full Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full border border-gray-300 rounded-lg p-2 text-sm sm:text-base"
          />
        </div>

        {/* About */}
        <div>
          <label className="block font-medium mb-1">About</label>
          <textarea
            rows="3"
            value={form.about}
            onChange={(e) => setForm({ ...form, about: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm sm:text-base"
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block font-medium mb-1">Skills (comma separated)</label>
          <input
            type="text"
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm sm:text-base"
          />
        </div>

        {/* Education Section */}
        <div>
          <h3 className="font-semibold mb-3 text-lg">🎓 Education</h3>
          {(form.education || []).map((edu, idx) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3 relative">
              <input
                type="text"
                placeholder="College"
                value={edu.college}
                onChange={(e) => updateEducationField(idx, "college", e.target.value)}
                className="border border-gray-300 rounded-lg p-2 text-sm sm:text-base"
              />
              <input
                type="text"
                placeholder="Degree"
                value={edu.degree}
                onChange={(e) => updateEducationField(idx, "degree", e.target.value)}
                className="border border-gray-300 rounded-lg p-2 text-sm sm:text-base"
              />
              <input
                type="text"
                placeholder="Year"
                value={edu.year}
                onChange={(e) => updateEducationField(idx, "year", e.target.value)}
                className="border border-gray-300 rounded-lg p-2 text-sm sm:text-base"
              />
              {idx > 0 && (
                <button
                  type="button"
                  onClick={() => removeEducation(idx)}
                  className="absolute -right-4 sm:-right-6 top-2 text-red-500 hover:text-red-700"
                >
                  ❌
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addEducation}
            className="text-blue-600 font-medium hover:underline text-sm sm:text-base"
          >
            ➕ Add Education
          </button>
        </div>

        {/* Experience Section */}
        <div>
          <h3 className="font-semibold mb-3 text-lg">💼 Experience</h3>
          {(form.experience || []).map((exp, idx) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3 relative">
              <input
                type="text"
                placeholder="Company"
                value={exp.company}
                onChange={(e) => updateExperienceField(idx, "company", e.target.value)}
                className="border border-gray-300 rounded-lg p-2 text-sm sm:text-base"
              />
              <input
                type="text"
                placeholder="Role"
                value={exp.role}
                onChange={(e) => updateExperienceField(idx, "role", e.target.value)}
                className="border border-gray-300 rounded-lg p-2 text-sm sm:text-base"
              />
              <input
                type="text"
                placeholder="Duration"
                value={exp.duration}
                onChange={(e) => updateExperienceField(idx, "duration", e.target.value)}
                className="border border-gray-300 rounded-lg p-2 text-sm sm:text-base"
              />
              {idx > 0 && (
                <button
                  type="button"
                  onClick={() => removeExperience(idx)}
                  className="absolute -right-4 sm:-right-6 top-2 text-red-500 hover:text-red-700"
                >
                  ❌
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addExperience}
            className="text-blue-600 font-medium hover:underline text-sm sm:text-base"
          >
            ➕ Add Experience
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 sm:py-3 rounded-lg transition text-sm sm:text-base"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}
