export async function registerInstagramAuthRoutes(app) {
  app.get("/api/v1/auth/instagram/start", async (_request, reply) => {
    const redirectUrl = await app.services.instagramAuth.beginAuth();
    return reply.redirect(redirectUrl);
  });

  app.get("/api/v1/auth/instagram/callback", async (request, reply) => {
    const redirectUrl = await app.services.instagramAuth.handleCallback({
      code: request.query.code,
      state: request.query.state,
      error: request.query.error,
      errorReason: request.query.error_description ?? request.query.error_reason,
    });

    return reply.redirect(redirectUrl);
  });

  app.get("/api/v1/auth/instagram/sessions/:sessionId", async (request, reply) => {
    const session = app.services.instagramAuth.getSession(request.params.sessionId);

    if (!session) {
      return reply.code(404).send({ message: "Signup session not found." });
    }

    return reply.send(session);
  });

  app.post("/api/v1/auth/instagram/complete", async (request, reply) => {
    const sessionId = request.body?.sessionId;
    const email = request.body?.email;
    const password = request.body?.password;

    if (typeof sessionId !== "string" || sessionId.trim().length === 0) {
      return reply.code(400).send({ message: "sessionId is required" });
    }

    if (typeof email !== "string" || email.trim().length === 0) {
      return reply.code(400).send({ message: "email is required" });
    }

    if (typeof password !== "string" || password.length < 8) {
      return reply
        .code(400)
        .send({ message: "password must be at least 8 characters" });
    }

    const result = await app.services.instagramAuth.completeSignup({
      sessionId,
      email,
      password,
    });

    return reply.code(201).send(result);
  });
}
