import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { signToken } from "../utils/jwt.js";
import { ok, created } from "../utils/response.js";
import { publicUser } from "../utils/serializers.js";

const session = (user) => ({ token: signToken(user), user: publicUser(user) });

export async function register(req, res) {
  const { name, email, password } = req.body;
  const exists = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (exists) throw ApiError.conflict("An account with this email already exists");
  const user = await prisma.user.create({ data: { name, email, passwordHash: await bcrypt.hash(password, 12) } });
  return created(res, session(user), "Account created successfully. Welcome to FoodDash!");
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  // same message for unknown email and wrong password, so accounts cannot be enumerated
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw ApiError.unauthorized("Incorrect email or password", "INVALID_CREDENTIALS");
  if (!user.isActive) throw ApiError.forbidden("Your account has been deactivated. Contact support for help.");
  return ok(res, session(user), { message: `Welcome back, ${user.name.split(" ")[0]}!` });
}

export const me = (req, res) => ok(res, publicUser(req.user));
