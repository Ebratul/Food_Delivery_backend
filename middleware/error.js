import multer from "multer";
import { Prisma } from "@prisma/client";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

export const notFound = (req, _res, next) => next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));

// Central error handler: every thrown error ends up here and is returned in one consistent shape.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  let error = err;

  if (err instanceof multer.MulterError) {
    error = ApiError.badRequest(err.code === "LIMIT_FILE_SIZE" ? "Image must be 4 MB or smaller" : err.message);
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") error = ApiError.conflict(`A record with this ${err.meta?.target?.join?.(", ") ?? "value"} already exists`);
    else if (err.code === "P2025") error = ApiError.notFound();
    else if (err.code === "P2003") error = ApiError.badRequest("This record is linked to other data and cannot be changed");
  } else if (err?.type === "entity.parse.failed") {
    error = ApiError.badRequest("Malformed JSON body");
  } else if (err?.type === "entity.too.large") {
    error = new ApiError(413, "Request body is too large");
  }

  const status = error instanceof ApiError ? error.status : 500;
  if (status >= 500 && !env.isProd) console.error(err); // dev diagnostics only

  res.status(status).json({
    success: false,
    error: {
      code: error.code ?? "INTERNAL_ERROR",
      message: status >= 500 ? "Something went wrong on our side. Please try again." : error.message,
      ...(error.details && { details: error.details }),
    },
  });
}
