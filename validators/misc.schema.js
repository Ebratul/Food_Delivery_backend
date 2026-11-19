import { z } from "zod";
import { email, pageQuery, optionalText } from "./common.js";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  email,
  subject: z.string().trim().min(3, "Subject must be at least 3 characters").max(120),
  message: z.string().trim().min(20, "Message should be at least 20 characters").max(2000),
});

export const newsletterSchema = z.object({ email });

export const blogQuery = z.object({ ...pageQuery, tag: z.string().trim().max(40).optional() });

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(40),
  description: z.string().trim().min(10, "Description should be at least 10 characters").max(300),
  image: z.string().trim().url("Enter a valid image URL").or(z.string().regex(/^\/api\/images\/[a-z0-9]+$/i)),
});

export const adminUsersQuery = z.object({
  ...pageQuery,
  role: z.enum(["USER", "ADMIN"]).optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export const adminUserUpdate = z
  .object({ role: z.enum(["USER", "ADMIN"]).optional(), isActive: z.boolean().optional() })
  .refine((d) => d.role !== undefined || d.isActive !== undefined, "Nothing to update");

export const adminRestaurantsQuery = z.object({
  ...pageQuery,
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  category: z.string().max(60).optional(),
});

export const restaurantStatusSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  isFeatured: z.boolean().optional(),
});

export const messagesQuery = z.object({ ...pageQuery, status: z.enum(["NEW", "READ", "RESOLVED"]).optional() });
export const messageStatusSchema = z.object({ status: z.enum(["NEW", "READ", "RESOLVED"]) });

export const reviewsQuery = z.object({ ...pageQuery });

export { optionalText };
