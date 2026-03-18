import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"
import authRoutes from "./src/routes/authRoutes.js"
import userRoutes from "./src/routes/userRoutes.js"
import jobRoutes from "./src/routes/jobRoutes.js"
import applicationRoutes from "./src/routes/applicationRoutes.js"
import messageRoutes from "./src/routes/messageRoutes.js"
import aiRoutes from "./src/routes/aiRoutes.js";

const app = express();
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/notify",messageRoutes)
// app.use("/api/ai", aiRoutes);


export {app}