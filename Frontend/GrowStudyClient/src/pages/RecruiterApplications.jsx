import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/Axios";
import "../styles/dashboardRecruiter.css";
import { AuthContext } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";

export default function RecruiterApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get("/applications/recruiter", { withCredentials: true });
        setApplications(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch applications. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const updateStatus = async (appId, status) => {
    try {
      const res = await api.put(`/applications/${appId}/status`,{ status},{ withCredentials: true});

      toast.success(
        status === "rejected"
          ? "Application rejected and removed"
          : `Application status updated to ${status}`
      );

      setApplications((prev) =>
        prev
          .map((app) => {
            if (app._id === appId) {
              if (status === "rejected") return null;
              return { ...app, status: res.data.status || status };
            }
            return app;
          })
          .filter(Boolean)
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  if (loading) return <p className="text-gray-500">Loading applications...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!applications.length) return <p className="text-gray-500">No applications yet.</p>;

  return (
    <div className="dashboard-page">
      <h2 className="dashboard-title">Applicants</h2>

      {applications.map((app) => {
        const appKey =
          app._id ||
          `${app.jobId?._id || Math.random()}-${app.studentId?._id || Math.random()}`;

        return (
          <div key={appKey}
            className="dashboard-card flex-between bg-white rounded-2xl shadow-md p-4 mb-4 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div>
              <Link to={`/profile/${app.studentId?._id}`} className="profile-link hover:no-underline text-blue-600">
                <p className="capitalize font-semibold text-lg">{app.studentId?.name}</p>
              </Link>

              <p>
                <strong>Email:</strong> {app.studentId?.email || "N/A"}
              </p>
              <p>
                <strong>Job:</strong> {app.jobId?.title || "N/A"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`status-badge status-${app.status?.toLowerCase() || "pending"}`}
                >
                  {app.status || "Pending"}
                </span>
              </p>

              {app.studentId?.resumeUrl && (
                <a
                  href={app.studentId.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-dashboard btn-resume bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-all inline-block mt-2"
                >
                  View Resume
                </a>
              )}
            </div>

            <div className="flex-gap card-footer flex items-center gap-2">
              {["reviewed", "selected", "rejected"].map((status) => (
                <button
                  key={`${app._id}-${status}`}
                  className="btn-dashboard btn-action border border-gray-300 rounded-md px-3 py-1 hover:bg-gray-100 transition-all"
                  onClick={() => updateStatus(app._id, status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
