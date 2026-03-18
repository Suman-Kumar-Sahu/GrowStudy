import React, { useState, useEffect } from "react";
import api from "../api/Axios";
import "../styles/dashboard.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function StudentDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch applications
  const fetchApplications = async () => {
    try {
      const res = await api.get("/applications/student", { withCredentials: true });
      const apps = res.data.applications || res.data;

      // Check for status changes and show toast
      apps.forEach((app) => {
        const oldApp = applications.find(a => a._id === app._id);
        if (oldApp && oldApp.status !== app.status) {
          toast.info(`Your application for "${app.jobId?.title}" is now "${app.status}"`);
        }
      });

      setApplications(apps);
    } catch (err) {
      console.error("❌ Error fetching applications:", err);
      setError("Failed to load applications. Please log in again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();

    // Optional: Poll every 10 seconds to get updates
    const interval = setInterval(fetchApplications, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p className="text-gray-500">Loading applications...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "status-pending";
      case "reviewed":
        return "status-reviewed";
      case "selected":
        return "status-selected";
      case "rejected":
        return "status-rejected";
      default:
        return "status-pending";
    }
  };

  return (
    <div className="dashboard-page">
      <h2 className="dashboard-title">Your Applications</h2>

      {applications.length === 0 ? (
        <p className="text-gray-500">You haven’t applied for any jobs yet.</p>
      ) : (
        applications.map((app) => (
          <div key={app._id} className="dashboard-card">
            <h3>{app.jobId?.title || "Untitled Job"}</h3>
            <p><strong>Company:</strong> {app.jobId?.company || "N/A"}</p>
            <p><strong>Skills:</strong> {app.jobId?.skillsRequired?.join(", ") || "N/A"}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`status-badge ${getStatusClass(app.status)}`}>
                {app.status || "Pending"}
              </span>
            </p>
          </div>
        ))
      )}
    </div>
  );
}
