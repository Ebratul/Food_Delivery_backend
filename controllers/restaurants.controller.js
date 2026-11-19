import { prisma } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { buildMeta, getPagination, getSort } from "../utils/pagination.js";
import { ok, created } from "../utils/response.js";
import { authorSummary } from "../utils/serializers.js";
import { uniqueSlug } from "../utils/slugify.js";

// fields needed to render a restaurant card
export const cardSelect = {
  id: true, name: true, slug: true, tagline: true, images: true, city: true, area: true,
  rating: true, reviewCount: true, avgMealPrice: true, priceLevel: true, deliveryFee: true,
  deliveryTimeMin: true, deliveryTimeMax: true, isVeganFriendly: true, isFeatured: true, status: true,
  createdAt: true,
  category: { select: { id: true, name: true, slug: true } },
};

const SORTS = {
  rating: (d) => [{ rating: d }, { reviewCount: "desc" }],
  price: (d) => [{ avgMealPrice: d }],
  deliveryTime: (d) => [{ deliveryTimeMin: d }],
  newest: (d) => [{ createdAt: d }],
  popular: (d) => [{ reviewCount: d }, { rating: "desc" }],
  name: (d) => [{ name: d }],
};

export const canManage = (user, restaurant) => user.role === "ADMIN" || restaurant.ownerId === user.id;

function searchFilter(search) {
  if (!search) return {};
  return {
    OR: [
      { name: { contains: search, mode: "insensitive" } },
      { tagline: { contains: search, mode: "insensitive" } },
      { area: { contains: search, mode: "insensitive" } },
      { category: { name: { contains: search, mode: "insensitive" } } },
      { menuItems: { some: { name: { contains: search, mode: "insensitive" } } } },
    ],
  };
}

/** GET /api/restaurants — public listing with search, filters, sorting and pagination. */
export async function listRestaurants(req, res) {
  const q = req.query;
  const pagination = getPagination(q, { defaultLimit: 12 });
  const where = {
    status: "APPROVED",
    ...searchFilter(q.search),
    ...(q.category && { category: { OR: [{ slug: q.category }, { id: q.category }] } }),
    ...(q.city && { city: q.city }),
    ...(q.minRating !== undefined && { rating: { gte: q.minRating } }),
    ...(q.priceLevel && { priceLevel: q.priceLevel }),
    ...(q.maxDeliveryTime && { deliveryTimeMax: { lte: q.maxDeliveryTime } }),
    ...(q.vegan === "true" && { isVeganFriendly: true }),
    ...(q.featured === "true" && { isFeatured: true }),
  };
  const [items, total] = await prisma.$transaction([
    prisma.restaurant.findMany({
      where, select: cardSelect, skip: pagination.skip, take: pagination.limit,
      orderBy: getSort(q.sort, SORTS, SORTS.rating("desc")),
    }),
    prisma.restaurant.count({ where }),
  ]);
  return ok(res, items, { meta: buildMeta(pagination, total) });
}

/** GET /api/restaurants/:slug — public details page payload. */
export async function getRestaurant(req, res) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: req.params.slug },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      owner: { select: { id: true, name: true, avatarId: true } },
      menuItems: { orderBy: [{ section: "asc" }, { isPopular: "desc" }, { name: "asc" }] },
      reviews: {
        orderBy: { createdAt: "desc" }, take: 6,
        include: { user: { select: { id: true, name: true, avatarId: true } } },
      },
    },
  });
  if (!restaurant) throw ApiError.notFound("Restaurant not found");

  // unapproved listings are only visible to their owner and admins
  if (restaurant.status !== "APPROVED" && !(req.user && canManage(req.user, restaurant))) {
    throw ApiError.notFound("Restaurant not found");
  }

  const [related, distribution] = await Promise.all([
    prisma.restaurant.findMany({
      where: { status: "APPROVED", categoryId: restaurant.categoryId, id: { not: restaurant.id } },
      select: cardSelect, orderBy: { rating: "desc" }, take: 4,
    }),
    prisma.review.groupBy({ by: ["rating"], where: { restaurantId: restaurant.id }, _count: { _all: true } }),
  ]);

  const { owner, reviews, ...rest } = restaurant;
  return ok(res, {
    ...rest,
    owner: authorSummary(owner),
    reviews: reviews.map(({ user, ...r }) => ({ ...r, user: authorSummary(user) })),
    ratingDistribution: [5, 4, 3, 2, 1].map((star) => ({ star, count: distribution.find((d) => d.rating === star)?._count._all ?? 0 })),
    related,
  });
}

/** POST /api/restaurants — any signed-in user can list a restaurant; admins publish instantly. */
export async function createRestaurant(req, res) {
  const category = await prisma.category.findUnique({ where: { id: req.body.categoryId }, select: { id: true } });
  if (!category) throw ApiError.badRequest("Selected cuisine does not exist");
  const slug = await uniqueSlug(prisma.restaurant, req.body.name);
  const restaurant = await prisma.restaurant.create({
    data: { ...req.body, slug, ownerId: req.user.id, status: req.user.role === "ADMIN" ? "APPROVED" : "PENDING" },
    select: cardSelect,
  });
  const message = restaurant.status === "APPROVED"
    ? "Restaurant published successfully"
    : "Restaurant submitted! Our team will review it, usually within one working day.";
  return created(res, restaurant, message);
}

async function findManageable(id, user) {
  const restaurant = await prisma.restaurant.findUnique({ where: { id } });
  if (!restaurant) throw ApiError.notFound("Restaurant not found");
  if (!canManage(user, restaurant)) throw ApiError.forbidden("You can only manage your own restaurants");
  return restaurant;
}

/** GET /api/restaurants/manage/:id — full record (incl. menu) for the edit form. */
export async function getManageableRestaurant(req, res) {
  await findManageable(req.params.id, req.user);
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: req.params.id },
    include: { category: { select: { id: true, name: true } }, menuItems: { orderBy: [{ section: "asc" }, { name: "asc" }] } },
  });
  return ok(res, restaurant);
}

export async function updateRestaurant(req, res) {
  const current = await findManageable(req.params.id, req.user);
  const data = { ...req.body };
  if (data.categoryId) {
    const exists = await prisma.category.findUnique({ where: { id: data.categoryId }, select: { id: true } });
    if (!exists) throw ApiError.badRequest("Selected cuisine does not exist");
  }
  if (data.name && data.name !== current.name) data.slug = await uniqueSlug(prisma.restaurant, data.name, current.id);
  // a rejected listing goes back to review once the owner edits it
  if (req.user.role !== "ADMIN" && current.status === "REJECTED") data.status = "PENDING";
  const restaurant = await prisma.restaurant.update({ where: { id: current.id }, data, select: cardSelect });
  return ok(res, restaurant, { message: "Restaurant updated successfully" });
}

export async function deleteRestaurant(req, res) {
  const current = await findManageable(req.params.id, req.user);
  await prisma.restaurant.delete({ where: { id: current.id } });
  return ok(res, null, { message: `${current.name} was deleted` });
}

const MINE_SORTS = { ...SORTS, status: (d) => [{ status: d }], orders: (d) => [{ orders: { _count: d } }] };

/** GET /api/restaurants/mine — restaurants owned by the signed-in user. */
export async function myRestaurants(req, res) {
  const q = req.query;
  const pagination = getPagination(q, { defaultLimit: 10 });
  const where = {
    ownerId: req.user.id,
    ...(q.status && { status: q.status }),
    ...(q.search && { name: { contains: q.search, mode: "insensitive" } }),
  };
  const [items, total] = await prisma.$transaction([
    prisma.restaurant.findMany({
      where, skip: pagination.skip, take: pagination.limit, orderBy: getSort(q.sort, MINE_SORTS, { createdAt: "desc" }),
      select: { ...cardSelect, _count: { select: { orders: true, menuItems: true } } },
    }),
    prisma.restaurant.count({ where }),
  ]);
  return ok(res, items.map(({ _count, ...r }) => ({ ...r, orderCount: _count.orders, menuCount: _count.menuItems })), { meta: buildMeta(pagination, total) });
}
