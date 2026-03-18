import api from "../api/Axios";

export const jobService = {
  // Get recruiter's jobs
  getMyJobs: async () => {
    const response = await api.get("/jobs/recruiter", { withCredentials: true });
    return response.data;
  },

  // Get all jobs
  getAllJobs: async () => {
    const response = await api.get("/jobs", { withCredentials: true });
    return response.data;
  },

  // Create new job
  createJob: async (jobData) => {
    const response = await api.post("/jobs", jobData, { withCredentials: true });
    return response.data;
  },

  // Delete job
  deleteJob: async (jobId) => {
    await api.delete(`/jobs/${jobId}`, { withCredentials: true });
    return jobId;
  }
};