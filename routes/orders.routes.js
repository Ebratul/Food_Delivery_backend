import { Router } from "express";
import * as orders from "../controllers/orders.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idParam } from "../validators/common.js";
import { createOrderSchema, listOrdersQuery } from "../validators/order.schema.js";

const router = Router();
router.use(authenticate);
router.post("/", validate({ body: createOrderSchema }), orders.createOrder);
router.get("/mine", validate({ query: listOrdersQuery }), orders.myOrders);
router.get("/:id", validate({ params: idParam }), orders.getOrder);
router.patch("/:id/cancel", validate({ params: idParam }), orders.cancelOrder);
export default router;
