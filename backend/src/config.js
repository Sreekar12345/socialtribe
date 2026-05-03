import dotenv from "dotenv";

dotenv.config();

function getInteger(value, fallback) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const config = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: getInteger(process.env.PORT, 4000),
  logLevel: process.env.LOG_LEVEL ?? "info",
  corsOrigin: process.env.CORS_ORIGIN ?? "*",
  databaseUrl: process.env.DATABASE_URL ?? "",
  cacheTtlHours: getInteger(process.env.CACHE_TTL_HOURS, 24),
  scraperMode: process.env.SCRAPER_MODE === "http" ? "http" : "mock",
  scraperApiUrl: process.env.SCRAPER_API_URL ?? "",
  scraperApiToken: process.env.SCRAPER_API_TOKEN ?? "",
  sourceProvider: process.env.SOURCE_PROVIDER ?? "mock-instagram-provider",
};
