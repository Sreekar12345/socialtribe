export async function registerHealthRoutes(app) {
  app.get("/health", async () => ({
    ok: true,
    service: "socialtribe-verification-backend",
    timestamp: new Date().toISOString(),
  }));

  app.get("/api/v1/health", async () => ({
    ok: true,
    service: "socialtribe-verification-backend",
    timestamp: new Date().toISOString(),
  }));
}
