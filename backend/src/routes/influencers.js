function toPositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

export async function registerInfluencerRoutes(app) {
  app.post("/api/v1/verify-influencer", async (request, reply) => {
    const username = request.body?.username;
    const forceRefresh = request.body?.forceRefresh === true;

    if (typeof username !== "string" || username.trim().length === 0) {
      return reply.code(400).send({ message: "username is required" });
    }

    const result = await app.services.verification.verifyInfluencer({
      username,
      forceRefresh,
    });

    return reply.code(result.source === "cache" ? 200 : 201).send(result);
  });

  app.get("/api/v1/influencers/:username", async (request, reply) => {
    const record = await app.services.verification.getInfluencerByUsername(
      request.params.username,
    );

    if (!record) {
      return reply.code(404).send({ message: "Influencer not found" });
    }

    return reply.send(record);
  });

  app.post("/api/v1/influencers/:username/reverify", async (request) => {
    return app.services.verification.verifyInfluencer({
      username: request.params.username,
      forceRefresh: true,
    });
  });

  app.get("/api/v1/influencers", async (request) => {
    const limit = toPositiveInteger(request.query.limit, 20);
    const offset = toPositiveInteger(request.query.offset, 0);

    return app.services.verification.listInfluencers({
      category: request.query.category,
      status: request.query.status,
      limit,
      offset,
    });
  });
}
