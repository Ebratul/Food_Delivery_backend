import { prisma } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { buildMeta, getPagination } from "../utils/pagination.js";
import { ok, created } from "../utils/response.js";
import { authorSummary } from "../utils/serializers.js";

const userSelect = { select: { id: true, name: true, avatarId: true, city: true } };

export async function listReviews(req, res) {
  const pagination = getPagination(req.query, { defaultLimit: 6 });
  const where = { restaurantId: req.params.id };
  const [items, total] = await prisma.$transaction([
    prisma.review.findMany({ where, include: { user: userSelect }, orderBy: { createdAt: "desc" }, skip: pagination.skip, take: pagination.limit }),
    prisma.review.count({ where }),
  ]);
  return ok(res, items.map(({ user, ...r }) => ({ ...r, user: authorSummary(user) })), { meta: buildMeta(pagination, total) });
}

/** Recalculates the cached rating on the restaurant after a review changes. */
async function refreshRating(tx, restaurantId) {
  const agg = await tx.review.aggregate({ where: { restaurantId }, _avg: { rating: true }, _count: { _all: true } });
  await tx.restaurant.update({
    where: { id: restaurantId },
    data: { rating: Math.round((agg._avg.rating ?? 0) * 10) / 10, reviewCount: agg._count._all },
  });
}

export async function createReview(req, res) {
  const restaurant = await prisma.restaurant.findUnique({ where: { id: req.params.id }, select: { id: true, status: true, ownerId: true } });
  if (!restaurant || restaurant.status !== "APPROVED") throw ApiError.notFound("Restaurant not found");
  if (restaurant.ownerId === req.user.id) throw ApiError.forbidden("You cannot review your own restaurant");
  const existing = await prisma.review.findUnique({ where: { userId_restaurantId: { userId: req.user.id, restaurantId: restaurant.id } } });
  if (existing) throw ApiError.conflict("You have already reviewed this restaurant");

  const review = await prisma.$transaction(async (tx) => {
    const r = await tx.review.create({ data: { ...req.body, userId: req.user.id, restaurantId: restaurant.id }, include: { user: userSelect } });
    await refreshRating(tx, restaurant.id);
    return r;
  });
  const { user, ...rest } = review;
  return created(res, { ...rest, user: authorSummary(user) }, "Thanks for your review!");
}

/** GET /api/reviews/top — highest-rated recent reviews for the testimonials section. */
export async function topReviews(_req, res) {
  const reviews = await prisma.review.findMany({
    where: { rating: 5, restaurant: { status: "APPROVED" } },
    orderBy: { createdAt: "desc" },
    take: 9,
    include: { user: userSelect, restaurant: { select: { name: true, slug: true } } },
  });
  return ok(res, reviews.map(({ user, ...r }) => ({ ...r, user: { ...authorSummary(user), city: user.city } })));
}

export async function myReviews(req, res) {
  const reviews = await prisma.review.findMany({
    where: { userId: req.user.id }, orderBy: { createdAt: "desc" },
    include: { restaurant: { select: { name: true, slug: true, images: true } } },
  });
  return ok(res, reviews);
}
