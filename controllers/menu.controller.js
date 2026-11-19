import { prisma } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { ok, created } from "../utils/response.js";
import { canManage } from "./restaurants.controller.js";

async function assertCanManageRestaurant(restaurantId, user) {
  const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId }, select: { id: true, ownerId: true } });
  if (!restaurant) throw ApiError.notFound("Restaurant not found");
  if (!canManage(user, restaurant)) throw ApiError.forbidden("You can only manage your own restaurants");
}

async function findManageableItem(id, user) {
  const item = await prisma.menuItem.findUnique({ where: { id }, include: { restaurant: { select: { ownerId: true } } } });
  if (!item) throw ApiError.notFound("Dish not found");
  if (!canManage(user, item.restaurant)) throw ApiError.forbidden("You can only manage your own menu");
  return item;
}

export async function createMenuItem(req, res) {
  await assertCanManageRestaurant(req.params.id, req.user);
  const item = await prisma.menuItem.create({ data: { ...req.body, restaurantId: req.params.id } });
  return created(res, item, "Dish added to the menu");
}

export async function updateMenuItem(req, res) {
  await findManageableItem(req.params.id, req.user);
  const item = await prisma.menuItem.update({ where: { id: req.params.id }, data: req.body });
  return ok(res, item, { message: "Dish updated" });
}

export async function deleteMenuItem(req, res) {
  await findManageableItem(req.params.id, req.user);
  await prisma.menuItem.delete({ where: { id: req.params.id } });
  return ok(res, null, { message: "Dish removed from the menu" });
}

/** GET /api/menu-items/popular — popular dishes from approved restaurants (home page). */
export async function popularDishes(req, res) {
  const limit = Math.min(12, Number(req.query.limit) || 8);
  const dishes = await prisma.menuItem.findMany({
    where: { isPopular: true, isAvailable: true, restaurant: { status: "APPROVED" } },
    orderBy: [{ orderItems: { _count: "desc" } }, { name: "asc" }],
    take: limit,
    include: { restaurant: { select: { name: true, slug: true, rating: true, category: { select: { name: true } } } } },
  });
  return ok(res, dishes);
}
