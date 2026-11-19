// Seeds FoodDash with realistic data: users, cuisines, restaurants, menus, orders, reviews, blog posts.
// Deterministic (seeded PRNG) so every run produces the same dataset.
import "dotenv/config";
import { readFile } from "node:fs/promises";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  EXCLUDED_DISHES, CATEGORIES, RESTAURANTS, ADMIN, DEMO_USER, CUSTOMERS,
  REVIEW_COMMENTS, BLOG_POSTS, CONTACT_MESSAGES,
} from "./data/content.js";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

// ---------- helpers ----------
function mulberry32(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20261119);
const int = (min, max) => Math.floor(rand() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const shuffle = (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const slugify = (s) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const emailFor = (name) => `${slugify(name).replace(/-/g, ".")}@example.com`;
const titleCase = (s) => s.replace(/\b\w/g, (c) => c.toUpperCase());
const roundTo = (n, step) => Math.round(n / step) * step;
const DAY = 24 * 60 * 60 * 1000;

function sectionFor(meal) {
  if (meal.category === "Dessert") return "Desserts";
  if (["Starter", "Side"].includes(meal.category)) return "Starters & Sides";
  if (meal.category === "Breakfast") return "Breakfast";
  if (/soup|broth|chowder|corba|congee|pho/i.test(meal.name)) return "Soups";
  if (/salad|cacik|ezme|hummus/i.test(meal.name)) return "Starters & Sides";
  return "Mains";
}

function describe(meal) {
  const main = meal.ingredients.filter((i) => !/^(salt|pepper|water|oil|olive oil|vegetable oil|sugar|black pepper)$/.test(i)).slice(0, 4);
  if (main.length === 0) return `A ${meal.category?.toLowerCase() ?? "house"} favourite, cooked fresh to order.`;
  const list = main.length > 1 ? `${main.slice(0, -1).join(", ")} and ${main.at(-1)}` : main[0];
  return `${titleCase(meal.name)} made with ${list}. Cooked fresh to order.`;
}

function priceFor(level, section) {
  const ranges = { 1: [160, 360], 2: [280, 620], 3: [480, 980] };
  let [lo, hi] = ranges[level];
  if (section === "Desserts") { lo *= 0.55; hi *= 0.6; }
  if (section === "Starters & Sides" || section === "Soups") { lo *= 0.6; hi *= 0.7; }
  return roundTo(int(Math.round(lo), Math.round(hi)), 10);
}

async function main() {
  const meals = JSON.parse(await readFile(new URL("./data/meals.json", import.meta.url), "utf8"));
  for (const k of Object.keys(meals)) meals[k] = meals[k].filter((m) => !EXCLUDED_DISHES.includes(m.name.trim()));

  console.log("Clearing existing data…");
  await prisma.$transaction([
    prisma.orderItem.deleteMany(), prisma.order.deleteMany(), prisma.review.deleteMany(),
    prisma.menuItem.deleteMany(), prisma.restaurant.deleteMany(), prisma.category.deleteMany(),
    prisma.blogPost.deleteMany(), prisma.contactMessage.deleteMany(), prisma.newsletterSubscriber.deleteMany(),
    prisma.user.deleteMany(), prisma.image.deleteMany(),
  ]);

  // ---------- users ----------
  console.log("Creating users…");
  const hash = (pw) => bcrypt.hash(pw, 10);
  const customerPw = await hash("Customer@1234");
  const now = Date.now();

  const admin = await prisma.user.create({
    data: { name: ADMIN.name, email: ADMIN.email, passwordHash: await hash(ADMIN.password), role: "ADMIN", phone: ADMIN.phone, city: ADMIN.city, address: ADMIN.address, bio: ADMIN.bio, createdAt: new Date(now - 240 * DAY) },
  });
  const demo = await prisma.user.create({
    data: { name: DEMO_USER.name, email: DEMO_USER.email, passwordHash: await hash(DEMO_USER.password), phone: DEMO_USER.phone, city: DEMO_USER.city, address: DEMO_USER.address, bio: DEMO_USER.bio, createdAt: new Date(now - 200 * DAY) },
  });
  const partnerNames = ["Mahmudul Hasan", "Ayesha Siddiqua", "Jamal Uddin", "Priya Das"];
  const partners = [];
  for (const [i, name] of partnerNames.entries()) {
    partners.push(await prisma.user.create({
      data: { name, email: emailFor(name), passwordHash: customerPw, city: "Dhaka", phone: `+880 1811-0003${String(i).padStart(2, "0")}`, createdAt: new Date(now - int(150, 230) * DAY) },
    }));
  }
  const customers = [];
  for (const [i, [name, city]] of CUSTOMERS.entries()) {
    customers.push(await prisma.user.create({
      data: { name, email: emailFor(name), passwordHash: customerPw, city, phone: `+880 1911-0004${String(i).padStart(2, "0")}`, address: `House ${int(3, 60)}, Road ${int(1, 27)}, ${city}`, createdAt: new Date(now - int(5, 190) * DAY) },
    }));
  }
  const buyers = [demo, ...customers];

  // ---------- categories ----------
  console.log("Creating categories…");
  const categories = {};
  for (const c of CATEGORIES) {
    categories[c.name] = await prisma.category.create({
      data: { name: c.name, slug: slugify(c.name), description: c.description, image: meals[c.name][0].image },
    });
  }

  // ---------- restaurants + menus ----------
  console.log("Creating restaurants and menus…");
  const ownerFor = (name) => {
    if (["Masala Junction House", "Banh Mi Corner", "Sweet Hollow Bakehouse"].includes(name)) return demo;
    return partners[RESTAURANTS.findIndex((r) => r.name === name) % partners.length];
  };
  const restaurants = [];
  for (const [idx, r] of RESTAURANTS.entries()) {
    const pool = meals[r.cuisine];
    const text = `${r.description} ${r.tagline}`.toLowerCase();
    // dishes mentioned in the description first, then fill from the cuisine pool
    const scored = pool.map((m) => {
      const words = m.name.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 3);
      return { m, score: words.filter((w) => text.includes(w)).length };
    });
    const mentioned = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score).map((s) => s.m);
    let rest = pool.filter((m) => !mentioned.includes(m));
    rest = [...rest.slice((idx * 3) % rest.length), ...rest.slice(0, (idx * 3) % rest.length)];
    const menuMeals = [...mentioned, ...rest].slice(0, r.name === "Sweet Hollow Bakehouse" ? 8 : 9);
    if (r.name === "Sweet Hollow Bakehouse") {
      const desserts = pool.filter((m) => m.category === "Dessert" || /pie|brownie|tart|pastr|pancake|fudge/i.test(m.name));
      menuMeals.splice(0, menuMeals.length, ...desserts, ...menuMeals.filter((m) => !desserts.includes(m)).slice(0, 2));
    }
    const status = r.name === "Sakura Bento Bar" ? "PENDING" : "APPROVED";
    const created = new Date(now - int(120, 220) * DAY);
    const restaurant = await prisma.restaurant.create({
      data: {
        name: r.name, slug: slugify(r.name), tagline: r.tagline, description: r.description,
        images: menuMeals.slice(0, 4).map((m) => m.image),
        city: r.city, area: r.area, address: `${int(5, 120)} ${pick(["Main Road", "Lake Road", "Avenue", "Kemal Ataturk Avenue", "Station Road"])}, ${r.area}, ${r.city}`,
        phone: `+880 1611-00${String(idx).padStart(4, "0")}`, openingHours: r.hours,
        priceLevel: r.priceLevel, avgMealPrice: r.avgMealPrice, deliveryFee: r.deliveryFee, minOrder: r.minOrder,
        deliveryTimeMin: r.time[0], deliveryTimeMax: r.time[1], isVeganFriendly: r.vegan, isFeatured: r.featured,
        status, categoryId: categories[r.cuisine].id, ownerId: ownerFor(r.name).id, createdAt: created,
        menuItems: {
          create: menuMeals.map((m, i) => {
            const section = sectionFor(m);
            return {
              name: titleCase(m.name.trim()), description: describe(m), image: m.image, section,
              price: priceFor(r.priceLevel, section), isPopular: i < 3, isAvailable: rand() > 0.06, createdAt: created,
            };
          }),
        },
      },
      include: { menuItems: true },
    });
    restaurants.push(restaurant);
  }
  const live = restaurants.filter((r) => r.status === "APPROVED");

  // ---------- orders ----------
  console.log("Creating orders…");
  const statusFor = (ageDays) => {
    if (ageDays > 2) return rand() < 0.93 ? "DELIVERED" : "CANCELLED";
    return pick(["PENDING", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"]);
  };
  let orderSeq = 1;
  const orderTotals = [];
  for (let n = 0; n < 260; n++) {
    // more orders in recent months (growth trend)
    const ageDays = Math.floor(Math.pow(rand(), 1.6) * 178);
    const restaurant = n % 7 === 0 ? pick(live.filter((r) => r.ownerId === demo.id)) : pick(live);
    const eligible = buyers.filter((u) => u.id !== restaurant.ownerId);
    const buyer = n % 9 === 0 && restaurant.ownerId !== demo.id ? demo : pick(eligible);
    const available = restaurant.menuItems.filter((m) => m.isAvailable);
    const chosen = shuffle(available).slice(0, int(1, 3));
    const items = chosen.map((m) => { const q = int(1, 3); return { menuItemId: m.id, name: m.name, unitPrice: m.price, quantity: q, lineTotal: m.price * q }; });
    let subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
    if (subtotal < restaurant.minOrder) { items[0].quantity += 1; items[0].lineTotal += items[0].unitPrice; subtotal += items[0].unitPrice; }
    const createdAt = new Date(now - ageDays * DAY - int(0, 12) * 3600 * 1000);
    const ymd = createdAt.toISOString().slice(0, 10).replace(/-/g, "");
    await prisma.order.create({
      data: {
        orderNumber: `FD-${ymd}-${String(orderSeq++).padStart(4, "0")}`,
        status: statusFor(ageDays), paymentMethod: pick(["CASH_ON_DELIVERY", "CASH_ON_DELIVERY", "CARD", "MOBILE_WALLET"]),
        subtotal, deliveryFee: restaurant.deliveryFee, total: subtotal + restaurant.deliveryFee,
        deliveryAddress: buyer.address ?? `${buyer.city}`, phone: buyer.phone ?? "+880 1711-000000",
        userId: buyer.id, restaurantId: restaurant.id, createdAt, updatedAt: createdAt,
        items: { create: items },
      },
    });
    orderTotals.push(subtotal);
  }

  // ---------- reviews ----------
  console.log("Creating reviews…");
  for (const r of live) {
    const reviewers = shuffle(buyers).slice(0, int(3, 7));
    let sum = 0;
    for (const u of reviewers) {
      const rating = rand() < 0.55 ? 5 : rand() < 0.8 ? 4 : 3;
      const dish = pick(r.menuItems).name;
      const comment = pick(REVIEW_COMMENTS[rating]).replace("{dish}", dish.toLowerCase());
      await prisma.review.create({ data: { rating, comment, userId: u.id, restaurantId: r.id, createdAt: new Date(now - int(1, 150) * DAY) } });
      sum += rating;
    }
    await prisma.restaurant.update({ where: { id: r.id }, data: { rating: Math.round((sum / reviewers.length) * 10) / 10, reviewCount: reviewers.length } });
  }

  // ---------- blog ----------
  console.log("Creating blog posts…");
  const allMeals = Object.values(meals).flat();
  for (const [i, p] of BLOG_POSTS.entries()) {
    const cover = allMeals.find((m) => m.name.trim().toLowerCase() === p.coverDish.toLowerCase())?.image ?? allMeals[i * 7].image;
    await prisma.blogPost.create({
      data: { title: p.title, slug: slugify(p.title), excerpt: p.excerpt, content: p.content, coverImage: cover, tags: p.tags, readMinutes: p.readMinutes, authorId: admin.id, publishedAt: new Date(now - (i * 11 + 3) * DAY) },
    });
  }

  // ---------- contact + newsletter ----------
  for (const [i, m] of CONTACT_MESSAGES.entries()) {
    await prisma.contactMessage.create({ data: { ...m, createdAt: new Date(now - (i * 4 + 1) * DAY) } });
  }
  for (const c of customers.slice(0, 7)) {
    await prisma.newsletterSubscriber.create({ data: { email: c.email } });
  }

  const counts = {
    users: await prisma.user.count(), restaurants: await prisma.restaurant.count(), menuItems: await prisma.menuItem.count(),
    orders: await prisma.order.count(), reviews: await prisma.review.count(), posts: await prisma.blogPost.count(),
  };
  console.log("Seed complete:", counts);
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
