import { analyzeResume, recommendJobs, calculateMatchScore } from "../utils/aiService.js";
import User from "../models/User.models.js";
import Job from "../models/Job.models.js";
import Application from "../models/Application.models.js";
import cloudinary from "../utils/cloudinary.js";
import pdfParse from "pdf-parse";
import axios from "axios";

// ─── Helper: Extract text from resume URL ──────────────────────────────────
const extractTextFromResumeUrl = async (resumeUrl) => {
  const response = await axios.get(resumeUrl, { responseType: "arraybuffer" });
  const buffer = Buffer.from(response.data);
  const pdf = await pdfParse(buffer);
  return pdf.text;
};

// ─── Helper: Build candidate profile from user + resume text ───────────────
const buildCandidateProfile = (user, resumeAnalysis) => ({
  name: user.name,
  skills: resumeAnalysis?.skills || user.skills || [],
  experienceLevel: resumeAnalysis?.experienceLevel || "",
  totalExperienceYears: resumeAnalysis?.totalExperienceYears || 0,
  suggestedRoles: resumeAnalysis?.suggestedRoles || [],
  education: resumeAnalysis?.education || [],
});

// ─── 1. Analyze Resume ─────────────────────────────────────────────────────
export const analyzeResumeController = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const resumeUrl = user.resume || user.resumeUrl || user.profile?.resume;
    if (!resumeUrl) {
      return res.status(400).json({
        success: false,
        message: "No resume found. Please upload your resume first.",
      });
    }

    const resumeText = await extractTextFromResumeUrl(resumeUrl);
    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: "Could not extract text from resume. Ensure it is a text-based PDF.",
      });
    }

    const analysis = await analyzeResume(resumeText);

    return res.status(200).json({
      success: true,
      message: "Resume analyzed successfully",
      data: analysis,
    });
  } catch (error) {
    console.error("Resume Analysis Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to analyze resume",
      error: error.message,
    });
  }
};

// ─── 2. Job Recommendations ────────────────────────────────────────────────
export const getJobRecommendations = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const resumeUrl = user.resume || user.resumeUrl || user.profile?.resume;
    if (!resumeUrl) {
      return res.status(400).json({
        success: false,
        message: "No resume found. Please upload your resume first.",
      });
    }

    const jobs = await Job.find({ status: "active" }).limit(50).lean();
    if (!jobs.length) {
      return res.status(404).json({
        success: false,
        message: "No active jobs available.",
      });
    }

    const resumeText = await extractTextFromResumeUrl(resumeUrl);
    const resumeAnalysis = await analyzeResume(resumeText);
    const candidateProfile = buildCandidateProfile(user, resumeAnalysis);

    const recommendations = await recommendJobs(candidateProfile, jobs);

    const enriched = recommendations
      .map((rec) => {
        const jobData = jobs.find(
          (j) => String(j._id) === String(rec.jobId)
        );
        return { ...rec, job: jobData || null };
      })
      .filter((r) => r.job !== null);

    return res.status(200).json({
      success: true,
      message: "Job recommendations generated",
      data: {
        candidateProfile,
        recommendations: enriched,
      },
    });
  } catch (error) {
    console.error("Job Recommendation Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to generate recommendations",
      error: error.message,
    });
  }
};

// ─── 3. Match Score (Candidate vs Specific Job) ────────────────────────────
export const getMatchScore = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user._id || req.user.id;

    const [user, job] = await Promise.all([
      User.findById(userId),
      Job.findById(jobId).lean(),
    ]);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const resumeUrl = user.resume || user.resumeUrl || user.profile?.resume;
    if (!resumeUrl) {
      return res.status(400).json({
        success: false,
        message: "No resume found. Please upload your resume first.",
      });
    }

    const resumeText = await extractTextFromResumeUrl(resumeUrl);
    const resumeAnalysis = await analyzeResume(resumeText);
    const candidateProfile = buildCandidateProfile(user, resumeAnalysis);

    const matchReport = await calculateMatchScore(candidateProfile, job);

    return res.status(200).json({
      success: true,
      message: "Match score calculated",
      data: {
        job: { _id: job._id, title: job.title, company: job.company },
        candidateProfile,
        matchReport,
      },
    });
  } catch (error) {
    console.error("Match Score Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to calculate match score",
      error: error.message,
    });
  }
};

// ─── 4. Batch Match Score ─────────────────────────────────────────────────
export const getBatchMatchScores = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const resumeUrl = user.resume || user.resumeUrl || user.profile?.resume;
    if (!resumeUrl) {
      return res.status(400).json({
        success: false,
        message: "No resume found.",
      });
    }

    const applications = await Application.find({ applicant: userId })
      .populate("job")
      .lean();

    if (!applications.length) {
      return res.status(404).json({
        success: false,
        message: "No applications found.",
      });
    }

    const resumeText = await extractTextFromResumeUrl(resumeUrl);
    const resumeAnalysis = await analyzeResume(resumeText);
    const candidateProfile = buildCandidateProfile(user, resumeAnalysis);

    const results = [];

    for (const app of applications) {
      if (!app.job) continue;

      try {
        const matchReport = await calculateMatchScore(
          candidateProfile,
          app.job
        );

        results.push({
          applicationId: app._id,
          job: { _id: app.job._id, title: app.job.title },
          status: app.status,
          matchReport,
        });
      } catch (e) {
        results.push({
          applicationId: app._id,
          error: "Failed to score",
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Batch match scores calculated",
      data: results,
    });
  } catch (error) {
    console.error("Batch Match Score Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to calculate batch scores",
      error: error.message,
    });
  }
};