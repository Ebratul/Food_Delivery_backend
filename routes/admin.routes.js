import { Router } from "express";
import * as admin from "../controllers/admin.controller.js";
import * as categories from "../controllers/categories.controller.js";
import * as contact from "../controllers/contact.controller.js";
import * as orders from "../controllers/orders.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idParam } from "../validators/common.js";
import {
  adminRestaurantsQuery, adminUserUpdate, adminUsersQuery, categorySchema, messageStatusSchema, messagesQuery, restaurantStatusSchema,
} from "../validators/misc.schema.js";
import { listOrdersQuery, orderStatusSchema } from "../validators/order.schema.js";

const router = Router();
router.use(authenticate, authorize("ADMIN"));

router.get("/users", validate({ query: adminUsersQuery }), admin.listUsers);
router.patch("/users/:id", validate({ params: idParam, body: adminUserUpdate }), admin.updateUser);
router.delete("/users/:id", validate({ params: idParam }), admin.deleteUser);

router.get("/restaurants", validate({ query: adminRestaurantsQuery }), admin.listAllRestaurants);
router.patch("/restaurants/:id/status", validate({ params: idParam, body: restaurantStatusSchema }), admin.setRestaurantStatus);

router.get("/orders", validate({ query: listOrdersQuery }), orders.allOrders);
router.patch("/orders/:id/status", validate({ params: idParam, body: orderStatusSchema }), orders.updateOrderStatus);

router.post("/categories", validate({ body: categorySchema }), categories.createCategory);
router.patch("/categories/:id", validate({ params: idParam, body: categorySchema.partial() }), categories.updateCategory);
router.delete("/categories/:id", validate({ params: idParam }), categories.deleteCategory);

router.get("/messages", validate({ query: messagesQuery }), contact.listMessages);
router.patch("/messages/:id", validate({ params: idParam, body: messageStatusSchema }), contact.updateMessage);
router.delete("/messages/:id", validate({ params: idParam }), contact.deleteMessage);

export default router;
