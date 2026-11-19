export const slugify = (value) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** Appends a short suffix until the slug is unique for the given Prisma delegate. */
export async function uniqueSlug(delegate, base, excludeId) {
  const root = slugify(base) || "item";
  let slug = root;
  for (let i = 2; ; i++) {
    const existing = await delegate.findUnique({ where: { slug }, select: { id: true } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${root}-${i}`;
  }
}
