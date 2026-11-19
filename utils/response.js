export const ok = (res, data, { message, meta, status = 200 } = {}) =>
  res.status(status).json({ success: true, ...(message && { message }), data, ...(meta && { meta }) });

export const created = (res, data, message = "Created successfully") => ok(res, data, { message, status: 201 });
