import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env.js";

// Reuse one client per process (important on serverless where modules stay warm between requests).
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.__prisma ??
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: env.DATABASE_URL, max: env.isProd ? 5 : 10 }),
  });

if (!env.isProd) globalForPrisma.__prisma = prisma;
