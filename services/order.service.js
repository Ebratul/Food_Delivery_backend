import { prisma } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";

const pad = (n, len) => String(n).padStart(len, "0");

function makeOrderNumber() {
  const d = new Date();
  const ymd = `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1, 2)}${pad(d.getUTCDate(), 2)}`;
  return `FD-${ymd}-${pad(Math.floor(Math.random() * 1e6), 6)}`;
}

/**
 * Places an order. Prices always come from the database (never from the client),
 * and the order with its items is written in a single transaction.
 */
export async function placeOrder(userId, input) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: input.restaurantId },
    select: { id: true, name: true, status: true, deliveryFee: true, minOrder: true, ownerId: true },
  });
  if (!restaurant || restaurant.status !== "APPROVED") throw ApiError.notFound("Restaurant not found");
  if (restaurant.ownerId === userId) throw ApiError.badRequest("You cannot order from your own restaurant");

  const ids = [...new Set(input.items.map((i) => i.menuItemId))];
  const menuItems = await prisma.menuItem.findMany({ where: { id: { in: ids }, restaurantId: restaurant.id } });
  const byId = new Map(menuItems.map((m) => [m.id, m]));

  const lines = input.items.map(({ menuItemId, quantity }) => {
    const item = byId.get(menuItemId);
    if (!item) throw ApiError.badRequest("One of the dishes is not on this restaurant's menu");
    if (!item.isAvailable) throw new ApiError(422, `${item.name} is currently unavailable`, { code: "ITEM_UNAVAILABLE" });
    return { menuItemId, name: item.name, unitPrice: item.price, quantity, lineTotal: item.price * quantity };
  });

  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  if (subtotal < restaurant.minOrder) {
    throw new ApiError(422, `Minimum order for ${restaurant.name} is ৳${restaurant.minOrder}`, { code: "BELOW_MIN_ORDER" });
  }

  return prisma.order.create({
    data: {
      orderNumber: makeOrderNumber(),
      userId,
      restaurantId: restaurant.id,
      subtotal,
      deliveryFee: restaurant.deliveryFee,
      total: subtotal + restaurant.deliveryFee,
      deliveryAddress: input.deliveryAddress,
      phone: input.phone,
      note: input.note,
      paymentMethod: input.paymentMethod,
      items: { create: lines },
    },
    include: { items: true, restaurant: { select: { name: true, slug: true } } },
  });
}

// allowed forward transitions for the order lifecycle
export const NEXT_STATUS = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["OUT_FOR_DELIVERY"],
  OUT_FOR_DELIVERY: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};
