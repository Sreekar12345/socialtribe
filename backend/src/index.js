import { config } from "./config.js";
import { buildServer } from "./server.js";

const server = buildServer(config);

try {
  await server.listen({ port: config.port, host: "0.0.0.0" });
  server.log.info(`verification backend listening on port ${config.port}`);
} catch (error) {
  server.log.error(error, "failed to start verification backend");
  process.exit(1);
}
