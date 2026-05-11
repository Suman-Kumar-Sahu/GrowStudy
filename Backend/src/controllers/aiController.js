import { analyzeResume, recommendJobs, calculateMatchScore } from "../utils/aiService.js";
import User from "../models/User.models.js";
import Job from "../models/Job.models.js";
import Application from "../models/Application.models.js";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

// ─── Helper: Extract text from resume URL ──────────────────────────────────
const extractTextFromResumeUrl = async (resumeUrl) => {
  try {
    if (!resumeUrl || typeof resumeUrl !== "string") {
      throw new Error("Invalid resume URL");
    }

    const response = await axios.get(resumeUrl, {
      responseType: "arraybuffer",
      timeout: 15000,
    });

    if (!response.data) {
      throw new Error("Failed to fetch resume file");
    }

    const uint8Array = new Uint8Array(response.data);

    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
    });

    const pdf = await loadingTask.promise;

    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ");
      fullText += pageText + "\n";
    }

    if (!fullText || fullText.trim().length === 0) {
      throw new Error("Resume PDF is empty or unreadable");
    }

    return fullText.trim();
  } catch (error) {
    throw new Error(`Resume extraction failed: ${error.message}`);
  }
};

// ─── Helper: Build candidate profile ───────────────────────────────────────
const buildCandidateProfile = (user, resumeAnalysis) => ({
  name: user.name || "Unknown",
  email: user.email || "",
  skills: resumeAnalysis?.skills || user.skills || [],
  experienceLevel: resumeAnalysis?.experienceLevel || "Entry",
  totalExperienceYears: resumeAnalysis?.totalExperienceYears || 0,
  suggestedRoles: resumeAnalysis?.suggestedRoles || [],
  education: resumeAnalysis?.education || [],
  location: user.location || "",
});

// ─── Helper: Retry logic for AI API calls ──────────────────────────────────
const retryAICall = async (callbackFn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await callbackFn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

// ─── Helper: Get resume URL from user ──────────────────────────────────────
const getResumeUrl = (user) =>
  user.resume || user.resumeUrl || user.profile?.resume || null;

// ─── 1. Analyze Resume ─────────────────────────────────────────────────────
export const analyzeResumeController = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const resumeUrl = getResumeUrl(user);
    if (!resumeUrl) {
      return res.status(400).json({
        success: false,
        message: "No resume found. Please upload your resume first.",
      });
    }

    const resumeText = await extractTextFromResumeUrl(resumeUrl);

    if (resumeText.length < 50) {
      return res.status(400).json({
        success: false,
        message: "Resume text too short. Ensure it is a proper text-based PDF.",
      });
    }

    const analysis = await retryAICall(() => analyzeResume(resumeText));

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
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const resumeUrl = getResumeUrl(user);
    if (!resumeUrl) {
      return res.status(400).json({
        success: false,
        message: "No resume found. Please upload your resume first.",
      });
    }

    // const jobs = await Job.find({ status: "active" }).limit(50).lean();
    const jobs = await Job.find({}).limit(50).lean();
    console.log("Total jobs found:", jobs.length); 
    if (!jobs.length) {
      return res.status(404).json({
        success: false,
        message: "No active jobs available.",
      });
    }

    const resumeText = await extractTextFromResumeUrl(resumeUrl);
    const resumeAnalysis = await retryAICall(() => analyzeResume(resumeText));
    const candidateProfile = buildCandidateProfile(user, resumeAnalysis);

    const recommendations = await retryAICall(() =>
      recommendJobs(candidateProfile, jobs)
    );

    const enriched = recommendations
      .map((rec) => {
        const jobData = jobs.find((j) => String(j._id) === String(rec.jobId));
        return { ...rec, job: jobData || null };
      })
      .filter((r) => r.job !== null);

    return res.status(200).json({
      success: true,
      message: "Job recommendations generated",
      data: {
        candidateProfile,
        recommendations: enriched,
        totalRecommendations: enriched.length,
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
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (!jobId) {
      return res.status(400).json({ success: false, message: "Job ID is required" });
    }

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

    const resumeUrl = getResumeUrl(user);
    if (!resumeUrl) {
      return res.status(400).json({
        success: false,
        message: "No resume found. Please upload your resume first.",
      });
    }

    const resumeText = await extractTextFromResumeUrl(resumeUrl);
    const resumeAnalysis = await retryAICall(() => analyzeResume(resumeText));
    const candidateProfile = buildCandidateProfile(user, resumeAnalysis);
    const matchReport = await retryAICall(() =>
      calculateMatchScore(candidateProfile, job)
    );

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

// ─── 4. Batch Match Scores ─────────────────────────────────────────────────
export const getBatchMatchScores = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const resumeUrl = getResumeUrl(user);
    if (!resumeUrl) {
      return res.status(400).json({ success: false, message: "No resume found." });
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
    const resumeAnalysis = await retryAICall(() => analyzeResume(resumeText));
    const candidateProfile = buildCandidateProfile(user, resumeAnalysis);

    const results = [];
    let successCount = 0;
    let failureCount = 0;

    for (const app of applications) {
      if (!app.job) {
        failureCount++;
        continue;
      }

      try {
        const matchReport = await retryAICall(() =>
          calculateMatchScore(candidateProfile, app.job)
        );
        results.push({
          applicationId: app._id,
          job: {
            _id: app.job._id,
            title: app.job.title,
            company: app.job.company,
          },
          status: app.status,
          matchReport,
        });
        successCount++;
      } catch (e) {
        console.error(`Error scoring application ${app._id}:`, e.message);
        failureCount++;
        results.push({
          applicationId: app._id,
          error: "Failed to calculate match score",
          errorDetails: e.message,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Batch match scores calculated",
      data: {
        results,
        summary: {
          total: applications.length,
          succeeded: successCount,
          failed: failureCount,
        },
      },
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