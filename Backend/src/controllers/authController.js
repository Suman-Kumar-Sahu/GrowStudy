import uploadOnCloudinary from "../utils/cloudinary.js"
import User from "../models/User.models.js";
import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,         // prevent JS access
    secure: false,          // set true if using https
    sameSite: "lax",        // allow cookie in local dev
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password ,role} = req.body;

    let avatarUrl = "";
    if (req.file) {
      const result = await uploadOnCloudinary(req.file.path, {
        folder: "avatars",
        transformation: [{ width: 200, height: 200, crop: "thumb", gravity: "face" }],
      });
      avatarUrl = result.secure_url;
    }

    const user = await User.create({ name, email, password, role,avatar: avatarUrl });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, {
      httpOnly: true, 
      secure: false,    
    });

    res.status(201).json({
      user,
      message:"Registration SuccessFull"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password)))
    return res
    .status(400)
    .json({
        message: "Invalid credentials" 
    });

  generateToken(user._id, res);
  res.json(user);
};

export const logoutUser = async (req, res) => {
  res.clearCookie("token","",{
    httpOnly:true,
    expires: new Date(0),
  });
  res.json({
    message: "Logged out successfully"
 });
};

export const getMe = async(req,res)=>{
    res.json(req.user);
}
