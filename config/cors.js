import { env } from "./env.js";

// Allow configured frontend origins plus Vercel preview deployments of the frontend project.
const previewPattern = /^https:\/\/food-delivery-frontend[a-z0-9-]*\.vercel\.app$/;

export const corsOptions = {
  origin(origin, callback) {
    if (!origin || env.clientUrls.includes(origin) || previewPattern.test(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400,
};
