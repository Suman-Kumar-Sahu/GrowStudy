import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"
import authRoutes from "./src/routes/authRoutes.js"
import userRoutes from "./src/routes/userRoutes.js"
import jobRoutes from "./src/routes/jobRoutes.js"
import applicationRoutes from "./src/routes/applicationRoutes.js"
import messageRoutes from "./src/routes/messageRoutes.js"
import aiRoutes from "./src/routes/aiRoutes.js";

import rateLimit from "express-rate-limit";

const app = express();

app.set("trust proxy", 1);

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 150,
    message: { message: "Too many requests from this IP, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 15,
    message: { message: "Too many login or registration attempts. Please try again in an hour." },
    standardHeaders: true,
    legacyHeaders: false,
});

const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: { message: "AI request limit reached. Please try again in an hour." },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());


app.use("/api/users", generalLimiter, userRoutes);
app.use("/api/jobs", generalLimiter, jobRoutes);
app.use("/api/applications", generalLimiter, applicationRoutes);
app.use("/api/notify", generalLimiter, messageRoutes);

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/ai", aiLimiter, aiRoutes);



export { app }