import { prisma } from "../config/db.js";
import { countBy, monthStart, monthlySeries } from "../services/analytics.service.js";
import { ok } from "../utils/response.js";

const humanStatus = (s) => s.charAt(0) + s.slice(1).toLowerCase().replaceAll("_", " ");

/** GET /api/stats — public platform numbers for the landing page. */
export async function publicStats(_req, res) {
  const [restaurants, dishes, customers, delivered, ratingAgg, cities] = await Promise.all([
    prisma.restaurant.count({ where: { status: "APPROVED" } }),
    prisma.menuItem.count({ where: { restaurant: { status: "APPROVED" } } }),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.order.count({ where: { status: "DELIVERED" } }),
    prisma.review.aggregate({ _avg: { rating: true }, _count: { _all: true } }),
    prisma.restaurant.findMany({ where: { status: "APPROVED" }, distinct: ["city"], select: { city: true } }),
  ]);
  return ok(res, {
    restaurants, dishes, customers, ordersDelivered: delivered,
    averageRating: Math.round((ratingAgg._avg.rating ?? 0) * 10) / 10, reviews: ratingAgg._count._all,
    cities: cities.map((c) => c.city),
  });
}

/** GET /api/dashboard/user — personal overview for a signed-in user. */
export async function userDashboard(req, res) {
  const userId = req.user.id;
  const since = monthStart(6);
  const [orders, myRestaurants, reviewsWritten, restaurantOrders] = await Promise.all([
    prisma.order.findMany({
      where: { userId }, orderBy: { createdAt: "desc" },
      select: { id: true, orderNumber: true, status: true, total: true, createdAt: true, restaurant: { select: { name: true, slug: true, category: { select: { name: true } } } } },
    }),
    prisma.restaurant.findMany({ where: { ownerId: userId }, select: { id: true, name: true, status: true } }),
    prisma.review.count({ where: { userId } }),
    prisma.order.findMany({
      where: { restaurant: { ownerId: userId }, createdAt: { gte: since } },
      select: { total: true, status: true, createdAt: true, restaurant: { select: { name: true } } },
    }),
  ]);

  const nonCancelled = orders.filter((o) => o.status !== "CANCELLED");
  const active = orders.filter((o) => !["DELIVERED", "CANCELLED"].includes(o.status));
  const partnerRevenue = restaurantOrders.filter((o) => o.status !== "CANCELLED").reduce((s, o) => s + o.total, 0);

  return ok(res, {
    cards: {
      totalOrders: orders.length,
      totalSpent: nonCancelled.reduce((s, o) => s + o.total, 0),
      activeOrders: active.length,
      myRestaurants: myRestaurants.length,
      pendingRestaurants: myRestaurants.filter((r) => r.status === "PENDING").length,
      reviewsWritten,
      partnerRevenue,
    },
    charts: {
      spending: monthlySeries(orders.filter((o) => o.createdAt >= since)),
      cuisines: countBy(orders, (o) => o.restaurant.category.name),
      restaurantOrders: countBy(restaurantOrders, (o) => o.restaurant.name).map(({ name, value }) => ({
        name, orders: value,
        revenue: restaurantOrders.filter((o) => o.restaurant.name === name && o.status !== "CANCELLED").reduce((s, o) => s + o.total, 0),
      })),
    },
    recentOrders: orders.slice(0, 5),
  });
}

/** GET /api/dashboard/admin — platform-wide overview. */
export async function adminDashboard(_req, res) {
  const since = monthStart(6);
  const [users, newUsers, restaurants, pending, ordersAll, recent, categories, newMessages, ratingAgg, topRaw] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: new Date(Date.now() - 30 * 86400000) } } }),
    prisma.restaurant.count({ where: { status: "APPROVED" } }),
    prisma.restaurant.count({ where: { status: "PENDING" } }),
    prisma.order.findMany({ where: { createdAt: { gte: since } }, select: { total: true, status: true, createdAt: true } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" }, take: 6,
      select: { id: true, orderNumber: true, status: true, total: true, createdAt: true, user: { select: { name: true } }, restaurant: { select: { name: true } } },
    }),
    prisma.category.findMany({ select: { name: true, _count: { select: { restaurants: { where: { status: "APPROVED" } } } } } }),
    prisma.contactMessage.count({ where: { status: "NEW" } }),
    prisma.review.aggregate({ _avg: { rating: true } }),
    prisma.order.groupBy({ by: ["restaurantId"], where: { status: { not: "CANCELLED" } }, _sum: { total: true }, _count: { _all: true }, orderBy: { _sum: { total: "desc" } }, take: 5 }),
  ]);
  const [totalOrders, revenueAgg] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ where: { status: { not: "CANCELLED" } }, _sum: { total: true } }),
  ]);
  const topNames = await prisma.restaurant.findMany({ where: { id: { in: topRaw.map((t) => t.restaurantId) } }, select: { id: true, name: true, slug: true, rating: true } });

  return ok(res, {
    cards: {
      users, newUsers, restaurants, pendingRestaurants: pending, totalOrders,
      revenue: revenueAgg._sum.total ?? 0, newMessages, averageRating: Math.round((ratingAgg._avg.rating ?? 0) * 10) / 10,
    },
    charts: {
      monthly: monthlySeries(ordersAll),
      orderStatus: countBy(ordersAll, (o) => humanStatus(o.status)),
      cuisines: categories.map((c) => ({ name: c.name, restaurants: c._count.restaurants })).sort((a, b) => b.restaurants - a.restaurants),
    },
    topRestaurants: topRaw.map((t) => ({ ...topNames.find((n) => n.id === t.restaurantId), orders: t._count._all, revenue: t._sum.total })),
    recentOrders: recent,
  });
}
