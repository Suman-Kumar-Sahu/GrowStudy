import express from "express";
import {protect} from "../middleares/authMiddleware.js"
import { getStudentApplications, getRecruiterApplications, updateApplicationStatus} from "../controllers/applicationController.js";

const router = express.Router();

// Student routes
router.get("/student", protect, getStudentApplications);
// router.get("/student/messages", protect, getStudentMessages);
// router.put("/mark-read",protect,markRead);
// router.delete("/:id", protect, deleteNotification);
// router.delete("/student/clear", protect, clearNotification);

// Recruiter routes
router.get("/recruiter", protect, getRecruiterApplications);
router.put("/:id/status", protect, updateApplicationStatus);


export default router;

