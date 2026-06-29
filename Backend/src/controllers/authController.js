import uploadOnCloudinary from "../utils/cloudinary.js"
import User from "../models/User.models.js";
import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    let avatarUrl = "";
    if (req.file) {
      const result = await uploadOnCloudinary(req.file.path, {
        folder: "avatars",
        transformation: [{ width: 200, height: 200, crop: "thumb", gravity: "face" }],
      });
      avatarUrl = result.secure_url;
    }

    const user = await User.create({ name, email, password, role, avatar: avatarUrl });

    generateToken(user._id, res);

    res.status(201).json({
      user,
      message: "Registration Successful"
    });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);
    res.json(user);
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });
    res.json({
      message: "Logged out successfully"
    });
  } catch (err) {
    console.error("Logout Error:", err);
    res.status(500).json({ message: "Logout failed" });
  }
};

export const getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    console.error("GetMe Error:", err);
    res.status(500).json({ message: "Failed to fetch user session" });
  }
};
