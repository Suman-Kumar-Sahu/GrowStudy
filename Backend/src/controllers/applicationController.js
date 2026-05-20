import Application from "../models/Application.models.js";
import Job from "../models/Job.models.js";
import User from "../models/User.models.js";
import mongoose from "mongoose";
import { sendStatusEmail } from "../utils/emailService.js";

// Student: Get applied jobs
export const getStudentApplications = async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user._id })
      .populate("jobId");
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// Recruiter: Get applicants for jobs
export const getRecruiterApplications = async (req, res) => {
  try {
    const recruiterJobs = await Job.find({ recruiterId: req.user.id }).select("_id");

    if (!recruiterJobs.length) {
      return res.status(200).json([]); 
    }

    const jobIds = recruiterJobs.map(job => job._id);

    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate("jobId", "title company skillsRequired")
      .populate("studentId", "name email skills resumeUrl")
      .sort({ createdAt: -1 }); 

    res.status(200).json(applications);

  } catch (err) {
    console.error("Error fetching recruiter applications:", err);
    res.status(500).json({ message: "Failed to fetch recruiter applications" });
  }
};


export const updateApplicationStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!status) return res.status(400).json({ message: "Status is required" });
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid application ID" });

  try {
    
    const app = await Application.findById(id)
      .populate("studentId", "name email skills resumeUrl")
      .populate("jobId", "title company");

    if (!app) return res.status(404).json({ message: "Application not found" });

    const studentEmail = app.studentId?.email;
    const studentName = app.studentId?.name || "Applicant";
    const jobTitle = app.jobId?.title || "the position";
    console.log("Email sending to:", studentEmail);


    if (studentEmail) {
      await sendStatusEmail(studentEmail, studentName, jobTitle, status);
    }
    if (status.toLowerCase() === "rejected") {
      await Application.deleteOne({ _id: id });
      return res.status(200).json({ message: "Application rejected, email sent, and record deleted" });
    }

    app.status = status;
    await app.save();

    res.status(200).json({
      message: `Application status updated to "${status}" and email sent`,
      application: app,
    });

  } catch (err) {
    console.error("Update Application Status Error:", err);
    res.status(500).json({ message: "Failed to update application status" });
  }
};

