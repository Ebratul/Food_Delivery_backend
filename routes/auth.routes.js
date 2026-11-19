import { Router } from "express";
import * as auth from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimit.js";
import { validate } from "../middleware/validate.js";
import { loginSchema, registerSchema } from "../validators/auth.schema.js";

const router = Router();
router.post("/register", authLimiter, validate({ body: registerSchema }), auth.register);
router.post("/login", authLimiter, validate({ body: loginSchema }), auth.login);
router.get("/me", authenticate, auth.me);
export default router;
