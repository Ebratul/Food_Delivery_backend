import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";
import { storeImage } from "../middleware/upload.js";
import { ApiError } from "../utils/ApiError.js";
import { ok } from "../utils/response.js";
import { publicUser } from "../utils/serializers.js";

export async function updateProfile(req, res) {
  const { name, phone, city, address, bio } = req.body;
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { name, phone: phone ?? null, city: city ?? null, address: address ?? null, bio: bio ?? null },
  });
  return ok(res, publicUser(user), { message: "Profile updated successfully" });
}

export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  const valid = await bcrypt.compare(currentPassword, req.user.passwordHash);
  if (!valid) throw new ApiError(422, "Current password is incorrect", { details: [{ field: "currentPassword", message: "Current password is incorrect" }] });
  await prisma.user.update({ where: { id: req.user.id }, data: { passwordHash: await bcrypt.hash(newPassword, 12) } });
  return ok(res, null, { message: "Password updated successfully" });
}

export async function uploadAvatar(req, res) {
  const image = await storeImage(req.file, { ownerId: req.user.id, square: true });
  const previous = req.user.avatarId;
  const user = await prisma.user.update({ where: { id: req.user.id }, data: { avatarId: image.id } });
  if (previous) await prisma.image.delete({ where: { id: previous } }).catch(() => {});
  return ok(res, publicUser(user), { message: "Profile photo updated" });
}
