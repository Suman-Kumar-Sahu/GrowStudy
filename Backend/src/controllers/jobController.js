import Job from "../models/Job.models.js";
import User from "../models/User.models.js";
import Application from "../models/Application.models.js";

export const createJob = async (req, res) => {
  try {
    const { title, company, description, skillsRequired, location, stipend, responsibilities, requirements } = req.body;
    const job = await Job.create({
      title,
      company,
      description,
      skillsRequired,
      location,
      stipend,
      responsibilities,
      requirements,
      recruiterId: req.user.id
    });
    res.status(201).json(job);
  } catch (err) {
    console.error("Job Creation Error:", err);
    res.status(500).json({ message: "Failed to create job" });
  }
};

// Get all jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("recruiterId", "name email");
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

export const getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user.id }).populate("recruiterId", "name email");
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch your jobs" });
  }
};

// Get job by ID
export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("recruiterId", "name email");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch job" });
  }
};

// Update job (recruiter only)
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.recruiterId.toString() !== req.user.id)
      return res.status(403).json({ message: "You are not authorized to update this job" });

    const { title, company, description, skillsRequired, location, stipend, status, responsibilities, requirements } = req.body;
    
    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (company !== undefined) updateFields.company = company;
    if (description !== undefined) updateFields.description = description;
    if (skillsRequired !== undefined) updateFields.skillsRequired = skillsRequired;
    if (location !== undefined) updateFields.location = location;
    if (stipend !== undefined) updateFields.stipend = stipend;
    if (status !== undefined) updateFields.status = status;
    if (responsibilities !== undefined) updateFields.responsibilities = responsibilities;
    if (requirements !== undefined) updateFields.requirements = requirements;

    Object.assign(job, updateFields);
    await job.save();
    res.json(job);
  } catch (err) {
    console.error("Job Update Error:", err);
    res.status(500).json({ message: "Failed to update job" });
  }
};

// Delete job (recruiter only)
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.recruiterId.toString() !== req.user.id)
      return res.status(403).json({ message: "You are not authorized to delete this job" });

    await job.deleteOne();
    res.json({ message: "Job deleted successfully ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete job" });
  }
};

// Apply for job (student)
export const applyJob = async (req, res) => {
  try {
    // Fetch student
    const student = await User.findById(req.user._id);
    if (!student.resumeUrl) {
      return res.status(400).json({ message: "You must upload a resume before applying." });
    }

    // Fetch job
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const existingApp = await Application.findOne({
      studentId: req.user._id,
      jobId: job._id,
    });
    if (existingApp) {
      return res.status(400).json({ message: "Already applied to this job" });
    }

    // ✅ Create new application with resume URL
    const application = await Application.create({
      studentId: req.user._id,
      jobId: job._id,
      status: "Pending",
    });

    if (!job.applicants.includes(req.user._id)) {
      job.applicants.push(req.user._id);
      await job.save();
    }

    res.status(201).json({
      message: "Applied successfully ✅",
      application,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to apply for job" });
  }
};

