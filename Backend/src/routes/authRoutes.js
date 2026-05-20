import express from "express"
import multer from "multer";
import { getMe, loginUser, logoutUser, registerUser } from "../controllers/authController.js";
import { uploadAvatars } from "../middleares/multerMiddleware.js";
import { protect } from "../middleares/authMiddleware.js";

import { validateBody } from "../middleares/validationMiddleware.js";
import { registerSchema, loginSchema } from "../validation/schemas.js";

const router = express.Router();

router.post("/user/register", uploadAvatars.single("avatar"), validateBody(registerSchema), registerUser);
router.post("/user/login", validateBody(loginSchema), loginUser);
router.post("/user/logout", logoutUser);

router.get("/user/me",protect,getMe)

export default router;