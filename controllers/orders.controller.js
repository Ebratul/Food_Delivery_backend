import { prisma } from "../config/db.js";
import { NEXT_STATUS, placeOrder } from "../services/order.service.js";
import { ApiError } from "../utils/ApiError.js";
import { buildMeta, getPagination, getSort } from "../utils/pagination.js";
import { ok, created } from "../utils/response.js";

const SORTS = {
  date: (d) => [{ createdAt: d }],
  total: (d) => [{ total: d }],
  status: (d) => [{ status: d }],
  number: (d) => [{ orderNumber: d }],
};

const listInclude = {
  restaurant: { select: { id: true, name: true, slug: true, images: true } },
  user: { select: { id: true, name: true, email: true } },
  _count: { select: { items: true } },
};

export async function createOrder(req, res) {
  const order = await placeOrder(req.user.id, req.body);
  return created(res, order, `Order ${order.orderNumber} placed successfully`);
}

function listWhere(q, base) {
  return {
    ...base,
    ...(q.status && { status: q.status }),
    ...(q.search && {
      OR: [
        { orderNumber: { contains: q.search, mode: "insensitive" } },
        { restaurant: { name: { contains: q.search, mode: "insensitive" } } },
        { user: { name: { contains: q.search, mode: "insensitive" } } },
      ],
    }),
  };
}

async function paginatedOrders(req, res, baseWhere) {
  const pagination = getPagination(req.query, { defaultLimit: 10 });
  const where = listWhere(req.query, baseWhere);
  const [items, total] = await prisma.$transaction([
    prisma.order.findMany({ where, include: listInclude, orderBy: getSort(req.query.sort, SORTS, { createdAt: "desc" }), skip: pagination.skip, take: pagination.limit }),
    prisma.order.count({ where }),
  ]);
  return ok(res, items.map(({ _count, ...o }) => ({ ...o, itemCount: _count.items })), { meta: buildMeta(pagination, total) });
}

export const myOrders = (req, res) => paginatedOrders(req, res, { userId: req.user.id });
export const allOrders = (req, res) => paginatedOrders(req, res, {});

export async function getOrder(req, res) {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: {
      items: true,
      restaurant: { select: { id: true, name: true, slug: true, images: true, phone: true, ownerId: true, area: true, city: true } },
      user: { select: { id: true, name: true, email: true } },
    },
  });
  if (!order) throw ApiError.notFound("Order not found");
  const allowed = req.user.role === "ADMIN" || order.userId === req.user.id || order.restaurant.ownerId === req.user.id;
  if (!allowed) throw ApiError.forbidden("You are not allowed to view this order");
  return ok(res, order);
}

export async function cancelOrder(req, res) {
  const order = await prisma.order.findUnique({ where: { id: req.params.id } });
  if (!order || order.userId !== req.user.id) throw ApiError.notFound("Order not found");
  if (order.status !== "PENDING") throw ApiError.conflict("Only pending orders can be cancelled");
  const updated = await prisma.order.update({ where: { id: order.id }, data: { status: "CANCELLED" } });
  return ok(res, updated, { message: `Order ${order.orderNumber} cancelled` });
}

export async function updateOrderStatus(req, res) {
  const order = await prisma.order.findUnique({ where: { id: req.params.id } });
  if (!order) throw ApiError.notFound("Order not found");
  const { status } = req.body;
  if (!NEXT_STATUS[order.status].includes(status)) {
    throw ApiError.conflict(`Cannot change status from ${order.status.replaceAll("_", " ").toLowerCase()} to ${status.replaceAll("_", " ").toLowerCase()}`);
  }
  const updated = await prisma.order.update({ where: { id: order.id }, data: { status } });
  return ok(res, updated, { message: `Order ${order.orderNumber} is now ${status.replaceAll("_", " ").toLowerCase()}` });
}
