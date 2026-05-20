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

import { validateBody } from "../middleares/validationMiddleware.js";
import { jobSchema } from "../validation/schemas.js";

const router = express.Router();
// Recruiter-specific routes

router.get("/recruiter", protect, authorizeRoles("recruiter"), getRecruiterJobs);

router.post("/", protect, authorizeRoles("recruiter"), validateBody(jobSchema), createJob);

router.put("/:id", protect, authorizeRoles("recruiter"), validateBody(jobSchema.partial()), updateJob);

router.delete("/:id", protect, authorizeRoles("recruiter"), deleteJob);


// Public / Student routes

router.get("/", getJobs);

router.get("/:id", getJob);

router.post("/:id/apply", protect, authorizeRoles("student"), applyJob);

export default router;
