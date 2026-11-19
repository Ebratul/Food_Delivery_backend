import app from "./app.js";
import { env } from "./config/env.js";

// On Vercel the exported app is invoked as a serverless function; locally we start an HTTP server.
if (!process.env.VERCEL) {
  app.listen(env.PORT, () => {
    if (!env.isProd) console.log(`FoodDash API running on http://localhost:${env.PORT}`);
  });
}

export default app;
