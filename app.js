import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { corsOptions } from "./config/cors.js";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/error.js";
import { apiLimiter } from "./middleware/rateLimit.js";
import routes from "./routes/index.js";

const app = express();

app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors(corsOptions));
app.use(compression());
app.use(express.json({ limit: "200kb" }));
if (!env.isProd) app.use(morgan("dev"));

app.get("/", (_req, res) =>
  res.json({ success: true, data: { name: "FoodDash API", version: "1.0.0", docs: "https://github.com/Ebratul/Food_Delivery_backend#api-reference" } }),
);
app.use("/api", apiLimiter, routes);

app.use(notFound);
app.use(errorHandler);

export default app;
