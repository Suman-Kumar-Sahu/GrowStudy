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
import { tokenBucket } from "./src/middleares/TBRateLimiter.js"

const app = express();

app.set("trust proxy", 1);

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

const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:5174",
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin) return callback(null, true);

        const isAllowed = allowedOrigins.includes(origin) ||
                          (origin.startsWith("https://growstudyclient") && origin.endsWith(".vercel.app"));

        if (isAllowed) {
            callback(null, true);
        } else {
            callback(new Error(`CORS policy blocked access from origin: ${origin}`));
        }
    },
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());


app.use("/api/users", tokenBucket, userRoutes);
app.use("/api/jobs", tokenBucket, jobRoutes);
app.use("/api/applications", tokenBucket, applicationRoutes);
app.use("/api/notify", tokenBucket, messageRoutes);

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/ai", aiLimiter, aiRoutes);



export { app }