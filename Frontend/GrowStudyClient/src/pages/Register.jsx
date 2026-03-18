import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/Axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("role", form.role);
      if (avatarFile) formData.append("avatar", avatarFile);

      await api.post("/auth/user/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("🎉 Registration successful!", {
        style: { backgroundColor: "#e8f0ff", color: "#003366", fontWeight: 600 },
      });

      setTimeout(() => {
        navigate(form.role === "student" ? "/jobs" : "/recruiter");
      }, 1200);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "❌ Registration failed", {
        style: { backgroundColor: "#ffe6e6", color: "#7a0000", fontWeight: 600 },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-100 to-purple-50 p-6">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-indigo-700 font-medium">
            ← Back to Home
          </Link>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-md border border-white/30 shadow-2xl rounded-3xl px-8 py-10"
        >
          <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-blue-700 to-indigo-600 text-transparent bg-clip-text mb-8">
            Create Your Account
          </h2>

          <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-3 border border-gray-200 rounded-xl mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            required
          />

          <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-3 border border-gray-200 rounded-xl mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            required
          />

          <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
          <input
            type="password"
            placeholder="Create a password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-3 border border-gray-200 rounded-xl mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            required
          />

          <label className="block text-sm font-semibold text-gray-700 mb-1">Select Role</label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full p-3 border border-gray-200 rounded-xl mb-4 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            required
          >
            <option value="student">Student</option>
            <option value="recruiter">Recruiter</option>
          </select>

          <label className="block text-sm font-semibold text-gray-700 mb-1">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files[0])}
            className="w-full mb-5 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition"
          />

          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all hover:scale-[1.02] disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>

          <p className="text-center text-sm mt-6 text-gray-600">
            Already have an account?{" "}
            <Link to="/user/login" className="text-blue-600 font-medium hover:underline hover:text-indigo-700 transition">
              Login here
            </Link>
          </p>
        </form>

        <ToastContainer position="top-right" autoClose={2500} theme="colored" />
      </div>
    </div>
  );
}
