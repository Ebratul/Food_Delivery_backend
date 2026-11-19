import { Router } from "express";
import * as restaurants from "../controllers/restaurants.controller.js";
import * as menu from "../controllers/menu.controller.js";
import * as reviews from "../controllers/reviews.controller.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idParam, slugParam } from "../validators/common.js";
import { reviewsQuery } from "../validators/misc.schema.js";
import {
  createRestaurantSchema, listRestaurantsQuery, menuItemSchema, myRestaurantsQuery, reviewSchema, updateRestaurantSchema,
} from "../validators/restaurant.schema.js";

const router = Router();

// owner routes (declared before "/:slug" so they are not captured by it)
router.get("/mine", authenticate, validate({ query: myRestaurantsQuery }), restaurants.myRestaurants);
router.get("/manage/:id", authenticate, validate({ params: idParam }), restaurants.getManageableRestaurant);

router.get("/", validate({ query: listRestaurantsQuery }), restaurants.listRestaurants);
router.get("/:slug", optionalAuth, validate({ params: slugParam }), restaurants.getRestaurant);
router.post("/", authenticate, validate({ body: createRestaurantSchema }), restaurants.createRestaurant);
router.patch("/:id", authenticate, validate({ params: idParam, body: updateRestaurantSchema }), restaurants.updateRestaurant);
router.delete("/:id", authenticate, validate({ params: idParam }), restaurants.deleteRestaurant);

router.post("/:id/menu-items", authenticate, validate({ params: idParam, body: menuItemSchema }), menu.createMenuItem);

router.get("/:id/reviews", validate({ params: idParam, query: reviewsQuery }), reviews.listReviews);
router.post("/:id/reviews", authenticate, validate({ params: idParam, body: reviewSchema }), reviews.createReview);

export default router;
