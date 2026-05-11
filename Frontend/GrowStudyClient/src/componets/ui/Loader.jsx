import React from "react";

/** Full-page loading screen */
export function PageLoader({ text = "Loading…" }) {
  return (
    <div className="cn-loading-screen">
      <div className="cn-spinner cn-spinner-lg" />
      <p style={{ color: "var(--text-3)", fontSize: 14, marginTop: 8 }}>{text}</p>
    </div>
  );
}

/** Inline spinner */
export function Spinner({ size = "md", className = "" }) {
  const cls = size === "sm" ? "cn-spinner cn-spinner-sm" : size === "lg" ? "cn-spinner cn-spinner-lg" : "cn-spinner";
  return <span className={`${cls} ${className}`} role="status" aria-label="Loading" />;
}

/** Single skeleton line */
export function SkeletonLine({ width = "100%", height = "14px" }) {
  return (
    <div className="cn-skeleton" style={{ width, height, borderRadius: 6 }} />
  );
}

/** Skeleton for a job card */
export function SkeletonJobCard() {
  return (
    <div style={{
      background: "var(--bg-surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--r-lg)",
      padding: 24
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <div className="cn-skeleton" style={{ width: 44, height: 44, borderRadius: 10 }} />
        <div className="cn-skeleton" style={{ width: 60, height: 14, borderRadius: 6 }} />
      </div>
      <div className="cn-skeleton" style={{ width: "70%", height: 18, borderRadius: 6, marginBottom: 8 }} />
      <div className="cn-skeleton" style={{ width: "50%", height: 14, borderRadius: 6, marginBottom: 16 }} />
      <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
        {[60, 80, 50].map((w, i) => (
          <div key={i} className="cn-skeleton" style={{ width: w, height: 22, borderRadius: 5 }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 16, borderTop: "1px solid var(--border)" }}>
        <div className="cn-skeleton" style={{ width: 80, height: 14, borderRadius: 6 }} />
        <div className="cn-skeleton" style={{ width: 80, height: 32, borderRadius: 8 }} />
      </div>
    </div>
  );
}

/** Generic skeleton card */
export function SkeletonCard({ lines = 4 }) {
  return (
    <div style={{
      background: "var(--bg-surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--r-lg)",
      padding: 24,
      display: "flex",
      flexDirection: "column",
      gap: 12
    }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="cn-skeleton" style={{ width: i === 0 ? "60%" : i === lines - 1 ? "40%" : "100%", height: 14, borderRadius: 6 }} />
      ))}
    </div>
  );
}

export default PageLoader;
