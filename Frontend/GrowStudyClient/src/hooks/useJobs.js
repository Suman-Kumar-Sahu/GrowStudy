import { useState, useEffect } from "react";
import { jobService } from "../services/jobService.js";
import { toast } from "react-toastify";

export const useJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const [myJobsData, allJobsData] = await Promise.all([
        jobService.getMyJobs(),
        jobService.getAllJobs()
      ]);
      setMyJobs(myJobsData);
      setAllJobs(allJobsData);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  return { myJobs, allJobs, loading, error, setMyJobs, setAllJobs, refetch: fetchJobs };
};