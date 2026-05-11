import React, { useState, useEffect, useContext, useMemo } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../api/Axios.js";
import JobCard from "../componets/JobCard.jsx";
import { useDebounce } from "../hooks/debounce.js";
import { useToast } from "../context/ToastContext.jsx";
import { SkeletonJobCard } from "../componets/ui/Loader.jsx";
import EmptyState from "../componets/ui/EmptyState.jsx";

const JOBS_PER_PAGE = 9;

export default function JobList() {
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);
  const debouncedLocation = useDebounce(location, 300);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await api.get("/jobs", { withCredentials: true });
        setJobs(res.data);
      } catch {
        toast.error("Failed to load jobs", "Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Reset page when filters change
  useEffect(() => setPage(1), [debouncedSearch, debouncedLocation, jobType, sortBy]);

  const filtered = useMemo(() => {
    let list = [...jobs];
    const kw = debouncedSearch.toLowerCase();
    const loc = debouncedLocation.toLowerCase();

    if (kw) list = list.filter(j =>
      j.title?.toLowerCase().includes(kw) ||
      j.company?.toLowerCase().includes(kw) ||
      j.skillsRequired?.some(s => s.toLowerCase().includes(kw))
    );
    if (loc) list = list.filter(j => j.location?.toLowerCase().includes(loc));
    if (jobType) list = list.filter(j => (j.type || "internship").toLowerCase() === jobType);

    if (sortBy === "newest") list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === "applicants") list.sort((a, b) => (b.applicants?.length || 0) - (a.applicants?.length || 0));
    if (sortBy === "stipend") list.sort((a, b) => (b.stipend || "").localeCompare(a.stipend || ""));

    return list;
  }, [jobs, debouncedSearch, debouncedLocation, jobType, sortBy]);

  const totalPages = Math.ceil(filtered.length / JOBS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * JOBS_PER_PAGE, page * JOBS_PER_PAGE);

  const handleApply = async (jobId) => {
    try {
      await api.post(`/jobs/${jobId}/apply`, {}, { withCredentials: true });
      toast.success("Application sent! ✅", "The recruiter will review your profile.");
      setJobs(prev => prev.map(j =>
        j._id === jobId ? { ...j, applicants: [...(j.applicants || []), user._id] } : j
      ));
    } catch (err) {
      toast.error("Could not apply", err.response?.data?.message || "Please try again.");
    }
  };

  const hasFilters = debouncedSearch || debouncedLocation || jobType;

  return (
    <div className="cn-page">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <span className="cn-section-label">Browse Opportunities</span>
        <h1 style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 800, color: "var(--text-1)", marginTop: 6 }}>
          Explore Jobs
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-3)", marginTop: 4 }}>
          {loading ? "Loading…" : `${filtered.length} positions available`}
        </p>
      </div>

      {/* Filters */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 200px 160px 160px",
        gap: 12, marginBottom: 28,
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--r-lg)", padding: "16px 20px"
      }} className="job-filters-bar">

        {/* Search */}
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", pointerEvents: "none" }}>🔍</span>
          <input
            id="job-search"
            type="text"
            className="cn-input"
            placeholder="Job title, company, skills…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 36 }}
          />
        </div>

        {/* Location */}
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", pointerEvents: "none" }}>📍</span>
          <input
            id="job-location-filter"
            type="text"
            className="cn-input"
            placeholder="Location"
            value={location}
            onChange={e => setLocation(e.target.value)}
            style={{ paddingLeft: 32 }}
          />
        </div>

        {/* Type */}
        <select
          id="job-type-filter"
          className="cn-input cn-select"
          value={jobType}
          onChange={e => setJobType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="internship">Internship</option>
          <option value="full-time">Full Time</option>
          <option value="part-time">Part Time</option>
          <option value="remote">Remote</option>
        </select>

        {/* Sort */}
        <select
          id="job-sort"
          className="cn-input cn-select"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="applicants">Most Applied</option>
          <option value="stipend">Stipend</option>
        </select>
      </div>

      {/* Active filters badges */}
      {hasFilters && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {debouncedSearch && <span className="cn-tag cn-tag-cyan">"{debouncedSearch}" <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", marginLeft: 4, padding: 0 }}>✕</button></span>}
          {debouncedLocation && <span className="cn-tag cn-tag-amber">📍 {debouncedLocation} <button onClick={() => setLocation("")} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", marginLeft: 4, padding: 0 }}>✕</button></span>}
          {jobType && <span className="cn-tag cn-tag-purple">{jobType} <button onClick={() => setJobType("")} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", marginLeft: 4, padding: 0 }}>✕</button></span>}
          <button onClick={() => { setSearch(""); setLocation(""); setJobType(""); }}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", fontSize: 13, fontFamily: "var(--font-ui)", padding: 0 }}>
            Clear all
          </button>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {Array.from({ length: 6 }).map((_, i) => <SkeletonJobCard key={i} />)}
        </div>
      ) : paginated.length === 0 ? (
        <div style={{
          background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)"
        }}>
          <EmptyState
            icon="🔍"
            title={hasFilters ? "No jobs match your filters" : "No jobs available"}
            description={hasFilters ? "Try adjusting your filters or search term." : "Check back soon — new jobs are added daily."}
            action={hasFilters
              ? <button onClick={() => { setSearch(""); setLocation(""); setJobType(""); }} className="cn-btn cn-btn-outline cn-btn-sm">Clear Filters</button>
              : null
            }
          />
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {paginated.map(job => (
            <JobCard
              key={job._id}
              job={job}
              currentUserId={user?._id}
              currentUserRole={user?.role}
              onApply={user?.role === "student" ? handleApply : undefined}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="cn-pagination">
          <button
            className="cn-page-btn"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous page"
          >←</button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;
            if (totalPages > 7 && Math.abs(p - page) > 2 && p !== 1 && p !== totalPages) {
              if (p === 2 || p === totalPages - 1) return <span key={p} style={{ color: "var(--text-3)", padding: "0 4px" }}>…</span>;
              return null;
            }
            return (
              <button key={p} className={`cn-page-btn${page === p ? " active" : ""}`} onClick={() => setPage(p)}>
                {p}
              </button>
            );
          })}

          <button
            className="cn-page-btn"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            aria-label="Next page"
          >→</button>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) { .job-filters-bar { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 600px) { .job-filters-bar { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
