import Fastify from "fastify";
import cors from "@fastify/cors";
import { registerHealthRoutes } from "./routes/health.js";
import { registerInfluencerRoutes } from "./routes/influencers.js";
import { createVerificationService } from "./services/verification-service.js";
import { createMemoryInfluencerRepository } from "./storage/memory-influencer-repository.js";
import { createPostgresInfluencerRepository } from "./storage/postgres-influencer-repository.js";
import { createHttpInstagramProvider } from "./providers/http-instagram-provider.js";
import { createMockInstagramProvider } from "./providers/mock-instagram-provider.js";

export function buildServer(config) {
  const app = Fastify({
    logger: {
      level: config.logLevel,
    },
  });

  const repository = config.databaseUrl
    ? createPostgresInfluencerRepository({ connectionString: config.databaseUrl })
    : createMemoryInfluencerRepository();

  const provider =
    config.scraperMode === "http"
      ? createHttpInstagramProvider(config)
      : createMockInstagramProvider();

  const verificationService = createVerificationService({
    repository,
    provider,
    cacheTtlHours: config.cacheTtlHours,
    sourceProvider: config.sourceProvider,
  });

  app.decorate("services", {
    verification: verificationService,
  });

  app.register(cors, {
    origin: config.corsOrigin,
  });

  app.register(registerHealthRoutes);
  app.register(registerInfluencerRoutes);

  app.setErrorHandler((error, _request, reply) => {
    app.log.error(error);
    reply.code(error.statusCode ?? 500).send({
      message: error.message ?? "Internal server error",
    });
  });

  app.addHook("onClose", async () => {
    if (typeof repository.close === "function") {
      await repository.close();
    }
  });

  return app;
}
