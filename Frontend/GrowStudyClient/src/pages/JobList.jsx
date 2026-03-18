import React, { useState, useEffect, useContext, useMemo } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../api/Axios";
import JobCard from "../componets/JobCard.jsx";
import { useDebounce } from "../hooks/debounce.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/JobList.css";

export default function JobList() {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs", { withCredentials: true });
        setJobs(res.data);
        setFilteredJobs(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch jobs");
      }
    };
    fetchJobs();
  }, []);


  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    let filtered = [...jobs];

    if (debouncedSearch) {
      const keyword = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        job =>
          job.title.toLowerCase().includes(keyword) ||
          job.company.toLowerCase().includes(keyword) ||
          job.location.toLowerCase().includes(keyword) || 
          job.skillsRequired?.some(skill => skill.toLowerCase().includes(keyword))
      );
    }

    setFilteredJobs(filtered);
  }, [debouncedSearch,jobs]);

  const handleApply = async (jobId) => {
    try {
      const res = await api.post(`/jobs/${jobId}/apply`, {}, { withCredentials: true });
      toast.success("Applied successfully ✅");

      const updatedJobs = jobs.map(job => {
        if (job._id === jobId) {
          return { ...job, applicants: [...(job.applicants || []), user._id] };
        }
        return job;
      });

      setJobs(updatedJobs);
      setFilteredJobs(updatedJobs);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to apply");
    }
  };

  return (
    <div className="job-list-container">
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />
      <h2 className="job-list-title">Explore Jobs</h2>

      {/* Filters */}
      <div className="job-filters">
        <input
          type="text"
          placeholder="Search by title, company, skills..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Job Grid */}
      <div className="jobs-grid">
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <JobCard
              key={job._id}
              job={job}
              currentUserId={user?._id}
              currentUserRole={user?.role}  
              onApply={user?.role === "student" ? handleApply : undefined} 
            />
          ))
        ) : (
          <p className="no-jobs">No jobs found matching your search.</p>
        )}
      </div>
    </div>
  );
}
