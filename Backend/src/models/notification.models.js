import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId, ref: "User", required: true 
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true 
    },
    message: {
        type: String, required: true 
    },
    read: {
        type: Boolean, default: false 
    }
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);
