import { ApiError } from "../utils/ApiError.js";

/**
 * Validates and coerces req.body / req.query / req.params with zod schemas.
 * Parsed values replace the originals (req.query is redefined because it is a getter in Express 5).
 */
export const validate = (schemas) => (req, _res, next) => {
  const details = [];
  for (const key of ["params", "query", "body"]) {
    if (!schemas[key]) continue;
    const result = schemas[key].safeParse(req[key] ?? {});
    if (!result.success) {
      for (const issue of result.error.issues) details.push({ field: issue.path.join(".") || key, message: issue.message });
    } else if (key === "query") {
      Object.defineProperty(req, "query", { value: result.data, writable: true, configurable: true });
    } else {
      req[key] = result.data;
    }
  }
  if (details.length) throw new ApiError(422, "Please correct the highlighted fields", { details });
  next();
};
