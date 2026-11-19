import { z } from "zod";
import { pageQuery, phone } from "./common.js";

export const ORDER_STATUSES = ["PENDING", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

export const createOrderSchema = z.object({
  restaurantId: z.string().min(1),
  items: z
    .array(z.object({ menuItemId: z.string().min(1), quantity: z.coerce.number().int().min(1).max(20) }))
    .min(1, "Your cart is empty")
    .max(30),
  deliveryAddress: z.string().trim().min(8, "Enter your full delivery address").max(200),
  phone,
  note: z.string().trim().max(250).optional(),
  paymentMethod: z.enum(["CASH_ON_DELIVERY", "CARD", "MOBILE_WALLET"]).default("CASH_ON_DELIVERY"),
});

export const listOrdersQuery = z.object({ ...pageQuery, status: z.enum(ORDER_STATUSES).optional() });

export const orderStatusSchema = z.object({ status: z.enum(ORDER_STATUSES) });
