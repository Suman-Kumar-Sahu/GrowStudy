import React, { useState, useEffect, useContext } from "react";
import api from "../api/Axios";
import JobCard from "../componets/JobCard.jsx";
import JobForm from "../componets/Jobform.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RecruiterDashboard() {
  const { user } = useContext(AuthContext);
  const [myJobs, setMyJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [activeTab, setActiveTab] = useState("myJobs");
  const [showJobForm, setShowJobForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    company: "",
    description: "",
    skillsRequired: "",
    location: "",
    stipend: "",
    responsibilities: "",
    requirements: ""
  });

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const res = await api.get("/jobs/recruiter", { withCredentials: true });
        setMyJobs(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchAllJobs = async () => {
      try {
        const res = await api.get("/jobs", { withCredentials: true });
        setAllJobs(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMyJobs();
    fetchAllJobs();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const skillsArray = form.skillsRequired.split(",").map(s => s.trim());
    
    // Process responsibilities and requirements
    const responsibilitiesArray = form.responsibilities
      .split("\n")
      .map(r => r.trim())
      .filter(r => r.length > 0)
      .map(r => r.replace(/^-\s*/, ""));
    
    const requirementsArray = form.requirements.split("\n").map(r => r.trim()).filter(r => r.length > 0).map(r => r.replace(/^-\s*/, ""));
    
    try {
      const res = await api.post(
        "/jobs",{
          ...form,
          skillsRequired: skillsArray,
          responsibilities: responsibilitiesArray,
          requirements: requirementsArray
        },
        { withCredentials: true }
      );
      toast.success("Job Created successfully ✅");
      setMyJobs([...myJobs, res.data]);
      setAllJobs([...allJobs, res.data]);
      setForm({
        title: "",
        company: "",
        description: "",
        skillsRequired: "",
        location: "",
        stipend: "",
        responsibilities: "",
        requirements: ""
      });
      setShowJobForm(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create job ❌");
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) {
      return;
    }

    try {
      await api.delete(`/jobs/${jobId}`, { withCredentials: true });
      toast.success("Job deleted successfully ✅");
      setMyJobs(myJobs.filter(j => j._id !== jobId));
      setAllJobs(allJobs.filter(j => j._id !== jobId));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete job ❌");
    }
  };

  return (
    <div className="recruiter-dashboard max-w-6xl mx-auto mt-10 p-6">
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />

      {/* Header with Create Job Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-3xl font-bold text-blue-900">Recruiter Dashboard</h2>
        <button
          onClick={() => setShowJobForm(!showJobForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 flex items-center gap-2 whitespace-nowrap"
        >
          <span className="text-xl">{showJobForm ? "✕" : "+"}</span>
          {showJobForm ? "Cancel" : "Create New Job"}
        </button>
      </div>

      {/* Show ONLY Job Form when creating */}
      {showJobForm ? (
        <div className="transition-all duration-300 ease-in-out">
          <JobForm form={form} setForm={setForm} handleCreate={handleCreate} />
        </div>
      ) : (
        <>
          {/* Tabs Navigation */}
          <div className="flex gap-4 mb-6 border-b-2 border-gray-200">
            <button
              onClick={() => setActiveTab("myJobs")}
              className={`pb-3 px-6 font-semibold text-lg transition-all duration-200 relative ${
                activeTab === "myJobs"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              My Jobs
              <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-bold">
                {myJobs.length}
              </span>
              {activeTab === "myJobs" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("allJobs")}
              className={`pb-3 px-6 font-semibold text-lg transition-all duration-200 relative ${
                activeTab === "allJobs"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              All Jobs
              <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-bold">
                {allJobs.length}
              </span>
              {activeTab === "allJobs" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
          </div>

          {/* My Jobs Tab Content */}
          {activeTab === "myJobs" && (
            <div className="transition-all duration-300">
              {myJobs.length === 0 ? (
                <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-dashed border-blue-300">
                  <div className="text-7xl mb-4">📋</div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    No Jobs Posted Yet
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Start by creating your first job posting to attract talented candidates
                  </p>
                  <button
                    onClick={() => setShowJobForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    Create Your First Job
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myJobs.map((job) => (
                    <div key={job._id} className="relative group">
                      <JobCard
                        job={job}
                        currentUserId={user?._id}
                        currentUserRole={user?.role}
                      />
                      <button
                        onClick={() => handleDelete(job._id)}
                        className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-2 opacity-0 group-hover:opacity-100"
                      >
                        <span>🗑️</span>
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* All Jobs Tab Content */}
          {activeTab === "allJobs" && (
            <div className="transition-all duration-300">
              {allJobs.length === 0 ? (
                <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border-2 border-dashed border-gray-300">
                  <div className="text-7xl mb-4">🔍</div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    No Jobs Available
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    There are currently no job postings in the system
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {allJobs.map((job) => (
                    <JobCard
                      key={job._id}
                      job={job}
                      currentUserId={user?._id}
                      currentUserRole={user?.role}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}