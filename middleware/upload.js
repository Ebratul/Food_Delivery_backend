import multer from "multer";
import sharp from "sharp";
import { prisma } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024, files: 1 },
  fileFilter(_req, file, cb) {
    if (!ALLOWED.includes(file.mimetype)) return cb(ApiError.badRequest("Only JPG, PNG, WebP or AVIF images are allowed"));
    cb(null, true);
  },
}).single("image");

/** Resizes to WebP and stores the image in the database. Returns the saved Image row. */
export async function storeImage(file, { ownerId, square = false } = {}) {
  if (!file) throw ApiError.badRequest("Please choose an image to upload");
  let pipeline = sharp(file.buffer).rotate();
  pipeline = square
    ? pipeline.resize(400, 400, { fit: "cover" })
    : pipeline.resize(1400, 1000, { fit: "inside", withoutEnlargement: true });
  const { data, info } = await pipeline.webp({ quality: 80 }).toBuffer({ resolveWithObject: true });
  return prisma.image.create({
    data: { mimeType: "image/webp", data, width: info.width, height: info.height, size: info.size, ownerId },
    select: { id: true, width: true, height: true, size: true },
  });
}
