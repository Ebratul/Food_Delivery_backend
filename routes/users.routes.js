import { Router } from "express";
import * as users from "../controllers/users.controller.js";
import { myReviews } from "../controllers/reviews.controller.js";
import { authenticate } from "../middleware/auth.js";
import { imageUpload } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";
import { passwordSchema, profileSchema } from "../validators/auth.schema.js";

const router = Router();
router.use(authenticate);
router.patch("/me", validate({ body: profileSchema }), users.updateProfile);
router.patch("/me/password", validate({ body: passwordSchema }), users.changePassword);
router.post("/me/avatar", imageUpload, users.uploadAvatar);
router.get("/me/reviews", myReviews);
export default router;
