import { Router } from "express";
import * as menu from "../controllers/menu.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idParam } from "../validators/common.js";
import { menuItemSchema } from "../validators/restaurant.schema.js";

const router = Router();
router.get("/popular", menu.popularDishes);
router.patch("/:id", authenticate, validate({ params: idParam, body: menuItemSchema.partial() }), menu.updateMenuItem);
router.delete("/:id", authenticate, validate({ params: idParam }), menu.deleteMenuItem);
export default router;
