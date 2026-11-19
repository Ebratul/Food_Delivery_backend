import { prisma } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { ok, created } from "../utils/response.js";
import { uniqueSlug } from "../utils/slugify.js";

export async function listCategories(_req, res) {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { restaurants: { where: { status: "APPROVED" } } } } },
  });
  return ok(res, categories.map(({ _count, ...c }) => ({ ...c, restaurantCount: _count.restaurants })));
}

export async function createCategory(req, res) {
  const slug = await uniqueSlug(prisma.category, req.body.name);
  const category = await prisma.category.create({ data: { ...req.body, slug } });
  return created(res, category, "Category created");
}

export async function updateCategory(req, res) {
  const slug = req.body.name ? await uniqueSlug(prisma.category, req.body.name, req.params.id) : undefined;
  const category = await prisma.category.update({ where: { id: req.params.id }, data: { ...req.body, slug } });
  return ok(res, category, { message: "Category updated" });
}

export async function deleteCategory(req, res) {
  const inUse = await prisma.restaurant.count({ where: { categoryId: req.params.id } });
  if (inUse) throw ApiError.conflict(`This cuisine is used by ${inUse} restaurant(s). Move them to another cuisine first.`);
  await prisma.category.delete({ where: { id: req.params.id } });
  return ok(res, null, { message: "Category deleted" });
}
