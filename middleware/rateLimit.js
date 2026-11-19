import rateLimit from "express-rate-limit";

const handler = (_req, res) =>
  res.status(429).json({ success: false, error: { code: "TOO_MANY_REQUESTS", message: "Too many attempts. Please wait a few minutes and try again." } });

export const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: "draft-8", legacyHeaders: false, handler });
export const formLimiter = rateLimit({ windowMs: 10 * 60 * 1000, limit: 20, standardHeaders: "draft-8", legacyHeaders: false, handler });
export const apiLimiter = rateLimit({ windowMs: 60 * 1000, limit: 300, standardHeaders: "draft-8", legacyHeaders: false, handler });
