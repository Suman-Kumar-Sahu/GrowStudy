import express from "express";
import {protect} from "../middleares/authMiddleware.js"
import {getStudentMessages,markRead,clearNotification,deleteNotification} from "../controllers/messageController.js";

const router = express.Router();

// Student routes
router.get("/student/messages", protect, getStudentMessages);
router.put("/mark-read",protect,markRead);
router.delete("/:id", protect, deleteNotification);
router.delete("/student/clear", protect, clearNotification);


export default router;

