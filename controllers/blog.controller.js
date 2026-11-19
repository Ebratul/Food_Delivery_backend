import { prisma } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { buildMeta, getPagination } from "../utils/pagination.js";
import { ok } from "../utils/response.js";
import { authorSummary } from "../utils/serializers.js";

const author = { select: { id: true, name: true, avatarId: true } };

export async function listPosts(req, res) {
  const pagination = getPagination(req.query, { defaultLimit: 6 });
  const where = {
    ...(req.query.tag && { tags: { has: req.query.tag } }),
    ...(req.query.search && { OR: [{ title: { contains: req.query.search, mode: "insensitive" } }, { excerpt: { contains: req.query.search, mode: "insensitive" } }] }),
  };
  const [items, total, tagRows] = await prisma.$transaction([
    prisma.blogPost.findMany({ where, omit: { content: true }, include: { author }, orderBy: { publishedAt: "desc" }, skip: pagination.skip, take: pagination.limit }),
    prisma.blogPost.count({ where }),
    prisma.blogPost.findMany({ select: { tags: true } }),
  ]);
  const tags = [...new Set(tagRows.flatMap((r) => r.tags))].sort();
  return ok(res, items.map((p) => ({ ...p, author: authorSummary(p.author) })), { meta: { ...buildMeta(pagination, total), tags } });
}

export async function getPost(req, res) {
  const post = await prisma.blogPost.findUnique({ where: { slug: req.params.slug }, include: { author } });
  if (!post) throw ApiError.notFound("Article not found");
  const related = await prisma.blogPost.findMany({
    where: { id: { not: post.id }, tags: { hasSome: post.tags } }, omit: { content: true }, orderBy: { publishedAt: "desc" }, take: 3,
  });
  return ok(res, { ...post, author: authorSummary(post.author), related });
}
