import { jobService } from "../services/jobService.js";
import { toast } from "react-toastify";

export const useJobActions = (myJobs, setMyJobs, allJobs, setAllJobs) => {
  const createJob = async (processedFormData) => {
    try {
      const newJob = await jobService.createJob(processedFormData);
      setMyJobs([...myJobs, newJob]);
      setAllJobs([...allJobs, newJob]);
      toast.success("Job Created successfully ✅");
      return { success: true };
    } catch (err) {
      console.error(err);
      toast.error("Failed to create job ❌");
      return { success: false, error: err };
    }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) {
      return { success: false };
    }

    try {
      await jobService.deleteJob(jobId);
      setMyJobs(myJobs.filter(j => j._id !== jobId));
      setAllJobs(allJobs.filter(j => j._id !== jobId));
      toast.success("Job deleted successfully ✅");
      return { success: true };
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete job ❌");
      return { success: false, error: err };
    }
  };

  return { createJob, deleteJob };
};