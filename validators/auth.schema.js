import { z } from "zod";
import { email, password, phone, optionalText } from "./common.js";

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
    email,
    password,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match" });

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
});

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  phone: phone.optional().or(z.literal("").transform(() => undefined)),
  city: optionalText(60),
  address: optionalText(200),
  bio: optionalText(300),
});

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: password,
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match" })
  .refine((d) => d.newPassword !== d.currentPassword, { path: ["newPassword"], message: "New password must be different" });
