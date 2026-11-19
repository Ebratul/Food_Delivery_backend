import { prisma } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { buildMeta, getPagination, getSort } from "../utils/pagination.js";
import { ok } from "../utils/response.js";
import { publicUser } from "../utils/serializers.js";
import { cardSelect } from "./restaurants.controller.js";

const USER_SORTS = {
  name: (d) => [{ name: d }],
  email: (d) => [{ email: d }],
  joined: (d) => [{ createdAt: d }],
  role: (d) => [{ role: d }],
  orders: (d) => [{ orders: { _count: d } }],
};

export async function listUsers(req, res) {
  const q = req.query;
  const pagination = getPagination(q, { defaultLimit: 10 });
  const where = {
    ...(q.role && { role: q.role }),
    ...(q.status && { isActive: q.status === "active" }),
    ...(q.search && { OR: [{ name: { contains: q.search, mode: "insensitive" } }, { email: { contains: q.search, mode: "insensitive" } }] }),
  };
  const [items, total] = await prisma.$transaction([
    prisma.user.findMany({
      where, skip: pagination.skip, take: pagination.limit, orderBy: getSort(q.sort, USER_SORTS, { createdAt: "desc" }),
      include: { _count: { select: { orders: true, restaurants: true } } },
    }),
    prisma.user.count({ where }),
  ]);
  return ok(res, items.map((u) => ({ ...publicUser(u), orderCount: u._count.orders, restaurantCount: u._count.restaurants })), { meta: buildMeta(pagination, total) });
}

export async function updateUser(req, res) {
  if (req.params.id === req.user.id) throw ApiError.badRequest("You cannot change your own role or status");
  const user = await prisma.user.update({ where: { id: req.params.id }, data: req.body });
  return ok(res, publicUser(user), { message: `${user.name} updated` });
}

export async function deleteUser(req, res) {
  if (req.params.id === req.user.id) throw ApiError.badRequest("You cannot delete your own account");
  const user = await prisma.user.delete({ where: { id: req.params.id } });
  return ok(res, null, { message: `${user.name} was deleted` });
}

const RESTAURANT_SORTS = {
  name: (d) => [{ name: d }],
  rating: (d) => [{ rating: d }],
  status: (d) => [{ status: d }],
  newest: (d) => [{ createdAt: d }],
  orders: (d) => [{ orders: { _count: d } }],
};

export async function listAllRestaurants(req, res) {
  const q = req.query;
  const pagination = getPagination(q, { defaultLimit: 10 });
  const where = {
    ...(q.status && { status: q.status }),
    ...(q.category && { category: { slug: q.category } }),
    ...(q.search && { OR: [{ name: { contains: q.search, mode: "insensitive" } }, { owner: { name: { contains: q.search, mode: "insensitive" } } }] }),
  };
  const [items, total] = await prisma.$transaction([
    prisma.restaurant.findMany({
      where, skip: pagination.skip, take: pagination.limit, orderBy: getSort(q.sort, RESTAURANT_SORTS, { createdAt: "desc" }),
      select: { ...cardSelect, owner: { select: { id: true, name: true } }, _count: { select: { orders: true } } },
    }),
    prisma.restaurant.count({ where }),
  ]);
  return ok(res, items.map(({ _count, ...r }) => ({ ...r, orderCount: _count.orders })), { meta: buildMeta(pagination, total) });
}

export async function setRestaurantStatus(req, res) {
  const restaurant = await prisma.restaurant.update({ where: { id: req.params.id }, data: req.body, select: { id: true, name: true, status: true, isFeatured: true } });
  return ok(res, restaurant, { message: `${restaurant.name} is now ${restaurant.status.toLowerCase()}` });
}
