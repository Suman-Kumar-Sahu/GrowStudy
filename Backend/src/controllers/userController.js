import User from "../models/User.models.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

// Get user profile
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
};

export const getProfileVisit = async (req, res) => {
  const user = await User.findById( req.params.id);
  res.json(user);
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { name, skills, about, education, experience } = req.body;

    // Parse JSON strings safely if sent from frontend as text
    let parsedEducation = [];
    let parsedExperience = [];
    try {
      parsedEducation =
        typeof education === "string" ? JSON.parse(education) : education || [];
      parsedExperience =
        typeof experience === "string" ? JSON.parse(experience) : experience || [];
    } catch (err) {
      return res.status(400).json({ message: "Invalid education/experience format" });
    }

    const skillsArray =
      typeof skills === "string"
        ? skills.split(",").map((s) => s.trim()).filter(Boolean)
        : skills;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        about,
        skills: skillsArray,
        education: parsedEducation,
        experience: parsedExperience,
      },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.json({
      message: "Profile updated successfully ✅",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Profile Update Error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};


// Upload resume
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Upload new file to Cloudinary
    const result = await uploadOnCloudinary(req.file.path, "resumes");
    if (!result) {
      return res.status(500).json({ message: "Failed to upload to Cloudinary" });
    }

    // 🗑️ Delete old resume if present
    if (user.resumeUrl) {
      const oldPublicId = user.resumeUrl.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`resumes/${oldPublicId}`, {
          resource_type: "raw",
        });
      } catch (deleteErr) {
        console.warn("Old resume deletion failed:", deleteErr.message);
      }
    }

    user.resumeUrl = result.secure_url;
    await user.save();

    res.json({
      message: "Resume uploaded successfully ✅",
      resumeUrl: user.resumeUrl,
    });
  } catch (err) {
    console.error("Resume Upload Error:", err);
    res.status(500).json({ message: "Failed to upload resume" });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const result = await uploadOnCloudinary(req.file.path, {
      folder: "avatars",
      transformation: [{ width: 200, height: 200, crop: "thumb", gravity: "face" }],
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: result.secure_url },
      { new: true }
    );

    res.json({
      message: "Avatar upload Successfully ",
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Avatar upload failed" });
  }
};
