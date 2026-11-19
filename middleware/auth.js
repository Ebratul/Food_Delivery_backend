import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { verifyToken } from "../utils/jwt.js";

const readToken = (req) => {
  const header = req.headers.authorization ?? "";
  return header.startsWith("Bearer ") ? header.slice(7) : null;
};

async function resolveUser(token) {
  let payload;
  try {
    payload = verifyToken(token);
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) throw ApiError.unauthorized("Your session has expired. Please log in again.", "TOKEN_EXPIRED");
    throw ApiError.unauthorized("Invalid authentication token", "INVALID_TOKEN");
  }
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) throw ApiError.unauthorized("Account no longer exists", "INVALID_TOKEN");
  if (!user.isActive) throw ApiError.forbidden("Your account has been deactivated. Contact support for help.");
  return user;
}

/** Requires a valid JWT and attaches the user to req.user. */
export async function authenticate(req, _res, next) {
  const token = readToken(req);
  if (!token) throw ApiError.unauthorized();
  req.user = await resolveUser(token);
  next();
}

/** Attaches req.user when a valid token is present, but never blocks the request. */
export async function optionalAuth(req, _res, next) {
  const token = readToken(req);
  if (token) {
    try { req.user = await resolveUser(token); } catch { req.user = undefined; }
  }
  next();
}

/** Role-based access control. Use after authenticate. */
export const authorize = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) throw ApiError.forbidden();
  next();
};
