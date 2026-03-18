import mongoose from "mongoose";
import Message from "../models/notification.models.js"; 

export const getStudentMessages = async (req, res) => {
  try {
    const messages = await Message.find({ studentId: req.user._id })
      .sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

export const markRead = async (req, res) => {
  try {
    const studentId = req.user._id;

    const response = await Message.updateMany(
      { studentId, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({
      message: "All messages marked as read",
      modifiedCount: response.modifiedCount,
    });
  } catch (err) {
    console.error("Mark read error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid message ID" });
    }

    const deleted = await Message.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error("Delete message error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const clearNotification = async (req, res) => {
  try {
    const studentId = req.user?._id;

    if (!studentId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await Message.deleteMany({ studentId });

    res.status(200).json({
      message: "All messages cleared successfully",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error("Clear messages error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
