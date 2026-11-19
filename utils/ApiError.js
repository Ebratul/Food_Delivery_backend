export class ApiError extends Error {
  constructor(status, message, { code, details } = {}) {
    super(message);
    this.status = status;
    this.code = code ?? defaultCode(status);
    this.details = details;
  }

  static badRequest(msg, details) { return new ApiError(400, msg, { details }); }
  static unauthorized(msg = "Authentication required", code) { return new ApiError(401, msg, { code }); }
  static forbidden(msg = "You do not have permission to perform this action") { return new ApiError(403, msg); }
  static notFound(msg = "Resource not found") { return new ApiError(404, msg); }
  static conflict(msg) { return new ApiError(409, msg); }
}

function defaultCode(status) {
  return { 400: "BAD_REQUEST", 401: "UNAUTHORIZED", 403: "FORBIDDEN", 404: "NOT_FOUND", 409: "CONFLICT", 422: "VALIDATION_ERROR", 429: "TOO_MANY_REQUESTS" }[status] ?? "INTERNAL_ERROR";
}
