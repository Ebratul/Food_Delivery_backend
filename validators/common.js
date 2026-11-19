import { z } from "zod";

export const idParam = z.object({ id: z.string().min(1, "Invalid id") });
export const slugParam = z.object({ slug: z.string().min(1).max(160) });

export const pageQuery = {
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
  sort: z.string().max(40).optional(),
  search: z.string().trim().max(100).optional(),
};

export const email = z.string().trim().toLowerCase().email("Enter a valid email address").max(120);

export const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be at most 72 characters")
  .regex(/[a-z]/, "Password needs a lowercase letter")
  .regex(/[A-Z]/, "Password needs an uppercase letter")
  .regex(/[0-9]/, "Password needs a number");

export const phone = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s-]{8,20}$/, "Enter a valid phone number");

// Accepts absolute http(s) URLs or images uploaded to this API.
export const imageUrl = z
  .string()
  .trim()
  .refine((v) => /^https?:\/\/.+/i.test(v) || /^\/api\/images\/[a-z0-9]+$/i.test(v), "Must be an image URL or an uploaded image");

export const optionalText = (max) => z.string().trim().max(max).optional().or(z.literal("").transform(() => undefined));
