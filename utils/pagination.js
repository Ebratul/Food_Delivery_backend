export function getPagination(query, { defaultLimit = 12, maxLimit = 50 } = {}) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(maxLimit, Math.max(1, Number.parseInt(query.limit, 10) || defaultLimit));
  return { page, limit, skip: (page - 1) * limit };
}

export const buildMeta = ({ page, limit }, total) => ({ page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) });

/** Turns "field:direction" into a Prisma orderBy, restricted to an allow-list. */
export function getSort(sort, allowed, fallback) {
  const [field, dir] = String(sort ?? "").split(":");
  if (!allowed[field]) return fallback;
  const direction = dir === "asc" ? "asc" : "desc";
  return allowed[field](direction);
}
