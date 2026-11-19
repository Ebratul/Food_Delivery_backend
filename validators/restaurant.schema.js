import { z } from "zod";
import { pageQuery, imageUrl, phone } from "./common.js";

export const CITIES = ["Dhaka", "Chattogram", "Sylhet"];

export const listRestaurantsQuery = z.object({
  ...pageQuery,
  category: z.string().trim().max(60).optional(),
  city: z.enum(CITIES).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  priceLevel: z.coerce.number().int().min(1).max(3).optional(),
  maxDeliveryTime: z.coerce.number().int().min(10).max(120).optional(),
  vegan: z.enum(["true", "false"]).optional(),
  featured: z.enum(["true", "false"]).optional(),
});

const base = {
  name: z.string().trim().min(3, "Name must be at least 3 characters").max(80),
  tagline: z.string().trim().min(5, "Tagline must be at least 5 characters").max(90),
  description: z.string().trim().min(60, "Description should be at least 60 characters").max(1200),
  categoryId: z.string().min(1, "Choose a cuisine"),
  city: z.enum(CITIES, { message: "Choose a city" }),
  area: z.string().trim().min(2, "Area is required").max(60),
  address: z.string().trim().min(5, "Address is required").max(160),
  phone,
  openingHours: z.string().trim().min(5, "Opening hours are required").max(60),
  priceLevel: z.coerce.number().int().min(1).max(3),
  avgMealPrice: z.coerce.number().int().min(50, "Average price must be at least ৳50").max(10000),
  deliveryFee: z.coerce.number().int().min(0).max(500),
  minOrder: z.coerce.number().int().min(0).max(5000),
  deliveryTimeMin: z.coerce.number().int().min(10).max(120),
  deliveryTimeMax: z.coerce.number().int().min(10).max(150),
  isVeganFriendly: z.coerce.boolean().default(false),
  images: z.array(imageUrl).min(1, "Add at least one image").max(8, "You can add up to 8 images"),
};

export const createRestaurantSchema = z
  .object(base)
  .refine((d) => d.deliveryTimeMax >= d.deliveryTimeMin, { path: ["deliveryTimeMax"], message: "Max time must be greater than min time" });

export const updateRestaurantSchema = z
  .object(base)
  .partial()
  .refine((d) => !d.deliveryTimeMin || !d.deliveryTimeMax || d.deliveryTimeMax >= d.deliveryTimeMin, {
    path: ["deliveryTimeMax"], message: "Max time must be greater than min time",
  });

export const myRestaurantsQuery = z.object({ ...pageQuery, status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional() });

export const menuItemSchema = z.object({
  name: z.string().trim().min(2, "Dish name is required").max(80),
  description: z.string().trim().min(10, "Description should be at least 10 characters").max(300),
  price: z.coerce.number().int().min(10, "Price must be at least ৳10").max(20000),
  image: imageUrl,
  section: z.string().trim().min(2).max(40).default("Mains"),
  isAvailable: z.coerce.boolean().default(true),
  isPopular: z.coerce.boolean().default(false),
});

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1, "Choose a rating").max(5),
  comment: z.string().trim().min(10, "Review should be at least 10 characters").max(600),
});
