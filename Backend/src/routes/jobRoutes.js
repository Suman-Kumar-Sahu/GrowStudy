import express from "express";
import { protect } from "../middleares/authMiddleware.js";
import { authorizeRoles } from "../middleares/roleMiddleware.js";
import {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  applyJob,
  getRecruiterJobs,
} from "../controllers/jobController.js";

const router = express.Router();
// Recruiter-specific routes

router.get("/recruiter", protect, authorizeRoles("recruiter"), getRecruiterJobs);

router.post("/", protect, authorizeRoles("recruiter"), createJob);

router.put("/:id", protect, authorizeRoles("recruiter"), updateJob);

router.delete("/:id", protect, authorizeRoles("recruiter"), deleteJob);


// Public / Student routes

router.get("/", getJobs);

router.get("/:id", getJob);

router.post("/:id/apply", protect, authorizeRoles("student"), applyJob);

export default router;
