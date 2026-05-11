import React, { useState, useEffect, useContext } from "react";
import api from "../api/Axios";
import JobCard from "../componets/JobCard.jsx";
import JobForm from "../componets/Jobform.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { Spinner, SkeletonJobCard } from "../componets/ui/Loader.jsx";
import EmptyState from "../componets/ui/EmptyState.jsx";
import Modal from "../componets/ui/Modal.jsx";
import Sidebar from "../componets/Sidebar.jsx";

const EMPTY_FORM = {
  title: "", company: "", description: "", skillsRequired: "",
  location: "", stipend: "", responsibilities: "", requirements: ""
};

export default function RecruiterDashboard() {
  const { user } = useContext(AuthContext);
  const toast    = useToast();
  const [myJobs,       setMyJobs]      = useState([]);
  const [allJobs,      setAllJobs]     = useState([]);
  const [activeTab,    setActiveTab]   = useState("myJobs");
  const [showModal,    setShowModal]   = useState(false);
  const [form,         setForm]        = useState(EMPTY_FORM);
  const [loading,      setLoading]     = useState(true);
  const [creating,     setCreating]    = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // jobId to confirm delete

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [myRes, allRes] = await Promise.all([
          api.get("/jobs/recruiter", { withCredentials: true }),
          api.get("/jobs",           { withCredentials: true })
        ]);
        setMyJobs(myRes.data);
        setAllJobs(allRes.data);
      } catch {
        toast.error("Could not load jobs", "Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const skillsArray = form.skillsRequired.split(",").map(s => s.trim()).filter(Boolean);
      const split = (text) => text.split("\n").map(r => r.trim().replace(/^-\s*/, "")).filter(Boolean);
      const res = await api.post("/jobs", {
        ...form,
        skillsRequired:   skillsArray,
        responsibilities: split(form.responsibilities),
        requirements:     split(form.requirements),
      }, { withCredentials: true });

      toast.success("Job posted! 🎉", `"${res.data.title}" is now live.`);
      setMyJobs(prev => [res.data, ...prev]);
      setAllJobs(prev => [res.data, ...prev]);
      setForm(EMPTY_FORM);
      setShowModal(false);
    } catch {
      toast.error("Failed to post", "Please check the form and try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (jobId) => {
    try {
      await api.delete(`/jobs/${jobId}`, { withCredentials: true });
      toast.success("Job deleted", "The posting has been removed.");
      setMyJobs(prev  => prev.filter(j => j._id !== jobId));
      setAllJobs(prev => prev.filter(j => j._id !== jobId));
      setDeleteConfirm(null);
    } catch (err) {
      toast.error("Delete failed", err.response?.data?.message || "Try again.");
    }
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="cn-layout-with-sidebar">
      <Sidebar />

      <main className="cn-main-content">
        {/* Page header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
          <div>
            <span className="cn-section-label">Recruiter Hub</span>
            <h1 style={{ marginTop: 4, fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 800, color: "var(--text-1)" }}>
              {greeting}, <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}>{user?.name?.split(" ")[0] || "there"}</em> 👋
            </h1>
          </div>
          <button id="post-job-btn" onClick={() => setShowModal(true)} className="cn-btn cn-btn-primary">
            + Post a Job
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }} className="stats-grid-3">
          {[
            { icon: "📋", num: myJobs.length,  label: "Jobs posted",   color: "var(--cyan)" },
            { icon: "👥", num: allJobs.length, label: "Total in system",color: "var(--amber)" },
            { icon: "📊", num: myJobs.reduce((a, j) => a + (j.applicants?.length || 0), 0), label: "Total applicants", color: "var(--green)" },
          ].map(({ icon, num, label, color }) => (
            <div key={label} style={{
              background: "var(--bg-surface)", border: "1px solid var(--border)",
              borderRadius: "var(--r-lg)", padding: "20px 22px"
            }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "2rem", color, lineHeight: 1 }}>{num}</div>
              <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 6 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="cn-tabs">
          <button id="tab-my-jobs" className={`cn-tab${activeTab === "myJobs" ? " active" : ""}`} onClick={() => setActiveTab("myJobs")}>
            My Jobs <span className="cn-tab-badge">{myJobs.length}</span>
          </button>
          <button id="tab-all-jobs" className={`cn-tab${activeTab === "allJobs" ? " active" : ""}`} onClick={() => setActiveTab("allJobs")}>
            All Jobs <span className="cn-tab-badge">{allJobs.length}</span>
          </button>
        </div>

        {/* Job grids */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {Array.from({ length: 4 }).map((_, i) => <SkeletonJobCard key={i} />)}
          </div>
        ) : activeTab === "myJobs" ? (
          myJobs.length === 0 ? (
            <EmptyState
              icon="📋"
              title="No jobs posted yet"
              description="Post your first job to start receiving applications from top students."
              action={<button onClick={() => setShowModal(true)} className="cn-btn cn-btn-primary">Post Your First Job</button>}
            />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
              {myJobs.map(job => (
                <div key={job._id} style={{ position: "relative" }}>
                  <JobCard job={job} currentUserId={user?._id} currentUserRole={user?.role} />
                  <button
                    onClick={() => setDeleteConfirm(job._id)}
                    className="cn-btn cn-btn-danger cn-btn-sm"
                    style={{ position: "absolute", top: 12, right: 12 }}
                    aria-label="Delete job"
                  >🗑</button>
                </div>
              ))}
            </div>
          )
        ) : (
          allJobs.length === 0 ? (
            <EmptyState icon="🔍" title="No jobs available" description="No jobs have been posted yet." />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
              {allJobs.map(job => (
                <JobCard key={job._id} job={job} currentUserId={user?._id} currentUserRole={user?.role} />
              ))}
            </div>
          )
        )}
      </main>

      {/* Create Job Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setForm(EMPTY_FORM); }}
        title="Post a New Job"
        maxWidth={760}
      >
        <JobForm form={form} setForm={setForm} handleCreate={handleCreate} loading={creating} />
      </Modal>

      {/* Delete confirm modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Job Posting"
        footer={
          <>
            <button className="cn-btn cn-btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
            <button className="cn-btn cn-btn-danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
          </>
        }
      >
        <p style={{ fontSize: 15, color: "var(--text-2)" }}>
          Are you sure you want to delete this job? This action cannot be undone and will remove all applications associated with it.
        </p>
      </Modal>

      <style>{`
        @media (max-width: 700px) { .stats-grid-3 { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 480px) { .stats-grid-3 { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}