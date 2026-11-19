// Aggregation helpers for dashboard charts.

/** Returns the last `count` months as { key: "2026-07", label: "Jul" } (oldest first). */
export function lastMonths(count = 6) {
  const out = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    out.push({ key: d.toISOString().slice(0, 7), label: d.toLocaleString("en-US", { month: "short", timeZone: "UTC" }) });
  }
  return out;
}

export const monthStart = (count = 6) => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (count - 1), 1));
};

/** Buckets orders by month: { month, orders, revenue }. Cancelled orders don't count as revenue. */
export function monthlySeries(orders, count = 6) {
  const months = lastMonths(count);
  const map = new Map(months.map((m) => [m.key, { month: m.label, orders: 0, revenue: 0 }]));
  for (const o of orders) {
    const row = map.get(o.createdAt.toISOString().slice(0, 7));
    if (!row) continue;
    row.orders += 1;
    if (o.status !== "CANCELLED") row.revenue += o.total;
  }
  return [...map.values()];
}

export function countBy(items, keyFn) {
  const map = new Map();
  for (const item of items) {
    const key = keyFn(item);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}
