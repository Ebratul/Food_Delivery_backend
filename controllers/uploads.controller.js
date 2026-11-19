import { prisma } from "../config/db.js";
import { storeImage } from "../middleware/upload.js";
import { ApiError } from "../utils/ApiError.js";
import { created } from "../utils/response.js";

export async function uploadImage(req, res) {
  const image = await storeImage(req.file, { ownerId: req.user.id });
  return created(res, { ...image, url: `/api/images/${image.id}` }, "Image uploaded");
}

export async function getImage(req, res) {
  const image = await prisma.image.findUnique({ where: { id: req.params.id }, select: { data: true, mimeType: true } });
  if (!image) throw ApiError.notFound("Image not found");
  res.set({ "Content-Type": image.mimeType, "Cache-Control": "public, max-age=31536000, immutable", "Cross-Origin-Resource-Policy": "cross-origin" });
  res.send(Buffer.from(image.data));
}
