import React from "react";
import { Spinner } from "./ui/Loader";

export default function JobForm({ form, setForm, handleCreate, loading }) {
  const F = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

  const inputStyle = { marginBottom: 0 };

  return (
    <form onSubmit={handleCreate}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="cn-form-group" style={{ marginBottom: 0 }}>
            <label className="cn-label">Job Title *</label>
            <input
              type="text"
              className="cn-input"
              placeholder="e.g. Frontend Developer"
              value={form.title}
              onChange={e => F("title", e.target.value)}
              required
            />
          </div>
          <div className="cn-form-group" style={{ marginBottom: 0 }}>
            <label className="cn-label">Company *</label>
            <input
              type="text"
              className="cn-input"
              placeholder="e.g. OpenAI"
              value={form.company}
              onChange={e => F("company", e.target.value)}
              required
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="cn-form-group" style={{ marginBottom: 0 }}>
            <label className="cn-label">Location</label>
            <input
              type="text"
              className="cn-input"
              placeholder="Remote / Bangalore"
              value={form.location}
              onChange={e => F("location", e.target.value)}
            />
          </div>
          <div className="cn-form-group" style={{ marginBottom: 0 }}>
            <label className="cn-label">Stipend / Salary</label>
            <input
              type="text"
              className="cn-input"
              placeholder="₹15,000/month"
              value={form.stipend}
              onChange={e => F("stipend", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="cn-label">Required Skills <span style={{ color: "var(--text-3)", fontWeight: 400 }}>(comma separated)</span></label>
          <input
            type="text"
            className="cn-input"
            placeholder="React, Node.js, MongoDB"
            value={form.skillsRequired}
            onChange={e => F("skillsRequired", e.target.value)}
          />
        </div>

        <div>
          <label className="cn-label">Job Description</label>
          <textarea
            className="cn-input cn-textarea"
            placeholder="Describe the role, responsibilities, and company culture…"
            value={form.description}
            onChange={e => F("description", e.target.value)}
            rows={4}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label className="cn-label">Responsibilities <span style={{ color: "var(--text-3)", fontWeight: 400 }}>(one per line)</span></label>
            <textarea
              className="cn-input cn-textarea"
              placeholder={"- Build scalable features\n- Code reviews\n- Deploy to production"}
              value={form.responsibilities}
              onChange={e => F("responsibilities", e.target.value)}
              rows={5}
            />
          </div>
          <div>
            <label className="cn-label">Requirements <span style={{ color: "var(--text-3)", fontWeight: 400 }}>(one per line)</span></label>
            <textarea
              className="cn-input cn-textarea"
              placeholder={"- 2+ years React experience\n- Strong JS skills\n- REST API knowledge"}
              value={form.requirements}
              onChange={e => F("requirements", e.target.value)}
              rows={5}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="cn-btn cn-btn-primary cn-btn-block"
          style={{ padding: 13, fontSize: 15 }}
        >
          {loading ? <><Spinner size="sm" /> Posting…</> : "📤 Post Job"}
        </button>
      </div>
    </form>
  );
}