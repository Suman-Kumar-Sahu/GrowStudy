import express from "express";
import { getProfile, updateProfile, uploadResume,uploadAvatar , getProfileVisit} from "../controllers/userController.js";
import {protect} from "../middleares/authMiddleware.js"

import { uploadAvatars, uploadResumes} from "../middleares/multerMiddleware.js"

const router = express.Router();

router.get("/profile", protect, getProfile);
router.get("/profile/:id", protect, getProfileVisit);
router.put("/profile", protect, updateProfile);
router.post("/upload-resume", protect, uploadResumes.single("resume"), uploadResume);
router.post("/upload-avatar", protect, uploadAvatars.single("avatar"), uploadAvatar);

export default router;
