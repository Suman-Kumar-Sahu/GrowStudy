import React, { useContext, useState } from "react";
import "../styles/JobCard.css";
import { MapPin, Users, Sparkles } from "lucide-react";
import { AuthContext } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";
import JobDetailModal from "./JobDetailModal.jsx";

export default function JobCard({ job, onApply, currentUserId, currentUserRole }) {
  const { user } = useContext(AuthContext);
  const [showDetail, setShowDetail] = useState(false);

  // Check if the current user has already applied
  const applied = currentUserId && Array.isArray(job.applicants)
    ? job.applicants.includes(currentUserId)
    : false;

  const handleApplyClick = (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error("You must log in first.");
      return;
    }

    if (currentUserRole !== "student") {
      toast.error("Only students can apply for jobs.");
      return;
    }

    if (!user.resumeUrl) {
      toast.error("You must upload a resume before applying.");
      return;
    }

    if (applied) {
      toast.info("You have already applied to this job.");
      return;
    }

    onApply && onApply(job._id);
  };

  return (
    <>
      <div className="job-card" onClick={() => setShowDetail(true)} style={{ cursor: "pointer" }}>
      <div className="job-header">
        <h3 className="job-title">{job.title || "Untitled Job"}</h3>
        <p className="job-company">{job.company || "Unknown Company"}</p>
      </div>

      <div className="job-info">
        <div className="job-info-item">
          <Sparkles size={16} /> Skills: {job.skillsRequired?.join(", ") || "N/A"}
        </div>
        <div className="job-info-item">
          <MapPin size={16} /> Location: {job.location || "Remote"}
        </div>
        <div className="job-info-item">
          <Users size={16} /> Applicants: {job.applicants?.length || 0}
        </div>
      </div>

      {/* Apply button: only show for students */}
      {currentUserRole === "student" && onApply && (
        <button
          onClick={(e) => handleApplyClick(e)}
          className={`apply-btn ${applied ? "applied" : ""}`}
          disabled={applied}
        >
          {applied ? "Applied ✅" : "Apply Now"}
        </button>
      )}
      </div>

      {showDetail && (
        <JobDetailModal
          job={job}
          onClose={() => setShowDetail(false)}
          onApply={(jobId) => { onApply && onApply(jobId); }}
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
        />
      )}
    </>
  );
}
