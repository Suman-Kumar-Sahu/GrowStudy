import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const educationSchema = new mongoose.Schema({
    college: { type: String, trim: true },
    degree: { type: String, trim: true },
    year: { type: String,  trim: true },
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema({
    company: { type: String, trim: true },
    role: { type: String,  trim: true },
    duration: { type: String, trim: true },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required:true
  },
  email: { 
    type: String,
    unique: true,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  role: {
    type: String,
    enum: ["student", "recruiter"],
    default: "student" 
  },
  avatar:{
    type: String,
  },
  skills: {
    type: [String],
  },
  about: String,
  education: {
    type: [educationSchema],
    default: [],
  },
  experience: {
    type: [experienceSchema],
    default: [],
  },
  resumeUrl: { 
    type: String ,
    default:""
  },
  
},{
  timestamps:true
});

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);
