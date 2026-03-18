import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/Axios";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/user/login", form);
      setUser(res.data);

      if (res.data.role === "student") {
        navigate("/jobs");
      } else if (res.data.role === "recruiter") {
        navigate("/recruiter");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again!");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md">
        
        {/* Back link */}
        <div className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-2xl bg-white p-8 shadow-lg transition-transform duration-200 hover:-translate-y-1 sm:p-6"
        >
          <h2 className="text-center text-3xl font-bold text-indigo-600">
            Student Login
          </h2>

          {error && (
            <p className="text-center text-sm text-red-600">{error}</p>
          )}

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
            className="rounded-lg border border-gray-300 px-4 py-3 text-base outline-none transition focus:border-indigo-600"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
            className="rounded-lg border border-gray-300 px-4 py-3 text-base outline-none transition focus:border-indigo-600"
          />

          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            Login
          </button>

          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              to="/user/register"
              className="font-semibold text-indigo-600 hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
