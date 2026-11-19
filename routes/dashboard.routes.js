import { Router } from "express";
import { adminDashboard, userDashboard } from "../controllers/stats.controller.js";
import { uploadImage } from "../controllers/uploads.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { imageUpload } from "../middleware/upload.js";

const router = Router();
router.get("/dashboard/user", authenticate, userDashboard);
router.get("/dashboard/admin", authenticate, authorize("ADMIN"), adminDashboard);
router.post("/uploads", authenticate, imageUpload, uploadImage);
export default router;
