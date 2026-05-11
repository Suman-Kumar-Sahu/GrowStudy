import express from "express";
import { analyzeResumeController, getJobRecommendations, getMatchScore, getBatchMatchScores, } from "../controllers/aiController.js";
import { protect } from "../middleares/authMiddleware.js";
import { authorizeRoles } from "../middleares/roleMiddleware.js";

const router = express.Router();

// GET /api/ai/analyze-resume → Analyze logged-in user's resume
router.get("/analyze-resume", protect, authorizeRoles("student"), analyzeResumeController);

// GET /api/ai/recommend-jobs → Get AI job recommendations
router.get("/recommend-jobs", protect, authorizeRoles("student"), getJobRecommendations);

// GET /api/ai/match-score/:jobId → Match score for a specific job
router.get("/match-score/:jobId", protect, authorizeRoles("student"), getMatchScore);

// GET /api/ai/batch-match-scores → Match scores for all applications
router.get("/batch-match-scores", protect, authorizeRoles("student"), getBatchMatchScores);

export default router;