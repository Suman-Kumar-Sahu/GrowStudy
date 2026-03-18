import express from "express";
import {
  analyzeResumeController,
  getJobRecommendations,
  getMatchScore,
  getBatchMatchScores,
} from "../controllers/aiController.js";
import { protect } from "../middleares/authMiddleware.js";

const router = express.Router();

// GET /api/ai/analyze-resume → Analyze logged-in user's resume
router.get("/analyze-resume", protect, analyzeResumeController);

// GET /api/ai/recommend-jobs → Get AI job recommendations
// router.get("/recommend-jobs", protect, getJobRecommendations);

// GET /api/ai/match-score/:jobId → Match score for a specific job
// router.get("/match-score/:jobId", protect, getMatchScore);

// GET /api/ai/batch-match-scores → Match scores for all applications
// router.get("/batch-match-scores", protect, getBatchMatchScores);

export default router;