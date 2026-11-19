import { prisma } from "../config/db.js";
import { buildMeta, getPagination } from "../utils/pagination.js";
import { ok, created } from "../utils/response.js";

export async function sendMessage(req, res) {
  const message = await prisma.contactMessage.create({ data: req.body, select: { id: true, createdAt: true } });
  return created(res, message, "Thanks for reaching out! Our support team will reply within 24 hours.");
}

export async function subscribe(req, res) {
  const existing = await prisma.newsletterSubscriber.findUnique({ where: { email: req.body.email } });
  if (existing) return ok(res, null, { message: "You're already subscribed. Thanks for staying with us!" });
  await prisma.newsletterSubscriber.create({ data: { email: req.body.email } });
  return created(res, null, "Subscribed! Watch your inbox for weekly deals.");
}

export async function listMessages(req, res) {
  const pagination = getPagination(req.query, { defaultLimit: 10 });
  const where = {
    ...(req.query.status && { status: req.query.status }),
    ...(req.query.search && { OR: ["name", "email", "subject"].map((f) => ({ [f]: { contains: req.query.search, mode: "insensitive" } })) }),
  };
  const dir = req.query.sort === "date:asc" ? "asc" : "desc";
  const [items, total] = await prisma.$transaction([
    prisma.contactMessage.findMany({ where, orderBy: { createdAt: dir }, skip: pagination.skip, take: pagination.limit }),
    prisma.contactMessage.count({ where }),
  ]);
  return ok(res, items, { meta: buildMeta(pagination, total) });
}

export async function updateMessage(req, res) {
  const message = await prisma.contactMessage.update({ where: { id: req.params.id }, data: { status: req.body.status } });
  return ok(res, message, { message: "Message updated" });
}

export async function deleteMessage(req, res) {
  await prisma.contactMessage.delete({ where: { id: req.params.id } });
  return ok(res, null, { message: "Message deleted" });
}
