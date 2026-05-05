import dotenv from "dotenv";

dotenv.config();

function getInteger(value, fallback) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getFrontendBaseUrl() {
  if (process.env.FRONTEND_BASE_URL) {
    return process.env.FRONTEND_BASE_URL;
  }

  if (process.env.CORS_ORIGIN && process.env.CORS_ORIGIN !== "*") {
    return process.env.CORS_ORIGIN;
  }

  return "http://localhost:5173";
}

export const config = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: getInteger(process.env.PORT, 4000),
  logLevel: process.env.LOG_LEVEL ?? "info",
  corsOrigin: process.env.CORS_ORIGIN ?? "*",
  frontendBaseUrl: getFrontendBaseUrl(),
  databaseUrl: process.env.DATABASE_URL ?? "",
  cacheTtlHours: getInteger(process.env.CACHE_TTL_HOURS, 24),
  scraperMode: process.env.SCRAPER_MODE === "http" ? "http" : "mock",
  scraperApiUrl: process.env.SCRAPER_API_URL ?? "",
  scraperApiToken: process.env.SCRAPER_API_TOKEN ?? "",
  sourceProvider: process.env.SOURCE_PROVIDER ?? "mock-instagram-provider",
  instagramOauthMode:
    process.env.INSTAGRAM_OAUTH_MODE === "live" ? "live" : "mock",
  instagramAppId: process.env.INSTAGRAM_APP_ID ?? "",
  instagramAppSecret: process.env.INSTAGRAM_APP_SECRET ?? "",
  instagramRedirectUri:
    process.env.INSTAGRAM_REDIRECT_URI ??
    "http://localhost:4000/api/v1/auth/instagram/callback",
  instagramAuthorizeUrl:
    process.env.INSTAGRAM_AUTHORIZE_URL ??
    "https://www.instagram.com/oauth/authorize",
  instagramTokenUrl:
    process.env.INSTAGRAM_TOKEN_URL ??
    "https://api.instagram.com/oauth/access_token",
  instagramGraphBaseUrl:
    process.env.INSTAGRAM_GRAPH_BASE_URL ?? "https://graph.instagram.com/v21.0",
  instagramOauthScopes:
    process.env.INSTAGRAM_OAUTH_SCOPES ?? "instagram_business_basic",
  instagramMockUsername: process.env.INSTAGRAM_MOCK_USERNAME ?? "example_user",
};
