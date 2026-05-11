import React, { useState, useRef } from "react";
import { Spinner } from "./ui/Loader";

export default function ResumeCard({ resumeUrl, resumeFile, setResumeFile, handleUpload, loading }) {
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const ALLOWED = ["application/pdf", "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

  const selectFile = (file) => {
    if (!file) return;
    if (!ALLOWED.includes(file.type)) {
      alert("Only PDF, DOC, DOCX files allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File must be under 5MB");
      return;
    }
    setResumeFile(file);
    setFileName(file.name);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    selectFile(e.dataTransfer.files[0]);
  };

  return (
    <div style={{
      background: "var(--bg-surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--r-xl)",
      padding: 28,
      marginTop: 24
    }}>
      <div style={{
        fontSize: 11, fontWeight: 700, textTransform: "uppercase",
        letterSpacing: "1.5px", color: "var(--text-3)", marginBottom: 16
      }}>📄 Resume</div>

      {/* Current resume */}
      {resumeUrl && (
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "12px 16px", borderRadius: "var(--r)",
          background: "var(--green-muted)", border: "1px solid rgba(16,185,129,0.2)",
          marginBottom: 20
        }}>
          <span style={{ fontSize: 20 }}>📄</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--green)" }}>Resume uploaded</div>
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 12, color: "var(--text-2)", textDecoration: "none" }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--cyan)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--text-2)"}
            >View resume →</a>
          </div>
        </div>
      )}

      {/* Drop zone */}
      <div
        className={`cn-file-drop${dragging ? " dragover" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="Upload resume"
        onKeyDown={e => e.key === "Enter" && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={e => selectFile(e.target.files[0])}
          disabled={loading}
          style={{ display: "none" }}
        />
        <div style={{ fontSize: 32, marginBottom: 12 }}>⬆️</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)", marginBottom: 4 }}>
          {fileName || (dragging ? "Drop your file here" : "Click or drag resume here")}
        </div>
        <div style={{ fontSize: 12, color: "var(--text-3)" }}>PDF, DOC, DOCX · Max 5MB</div>
      </div>

      <button
        onClick={handleUpload}
        disabled={loading || !resumeFile}
        className="cn-btn cn-btn-primary cn-btn-block"
        style={{ marginTop: 16, padding: 12 }}
      >
        {loading ? <><Spinner size="sm" /> Uploading…</> : "Upload Resume"}
      </button>
    </div>
  );
}