import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  description: String,
  skillsRequired: [String],
  location: String,
  stipend: String,
  status: {
    type: String,
    enum: ["active", "closed"],
    default: "active",          
  },
  recruiterId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" , 
    required: true
  },
  applicants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  responsibilities: [String], 
  requirements: [String],
  
},{ timestamps: true});

export default mongoose.model("Job", jobSchema);
