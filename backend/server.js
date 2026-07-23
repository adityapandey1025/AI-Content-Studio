const http = require("http");
const app = require("./app");
const { env } = require("./config/env");

// eslint-disable-next-line no-console
console.log("=== ENVIRONMENT ===");
// eslint-disable-next-line no-console
console.log("PORT:", env.PORT);
// eslint-disable-next-line no-console
console.log("NODE_ENV:", env.NODE_ENV);
// eslint-disable-next-line no-console
console.log("CORS_ORIGIN:", env.CORS_ORIGIN);
// eslint-disable-next-line no-console
console.log("OPENROUTER_BASE_URL:", env.OPENROUTER_BASE_URL);
// eslint-disable-next-line no-console
console.log("OPENROUTER_APP_URL:", env.OPENROUTER_APP_URL);
// eslint-disable-next-line no-console
console.log("===================");

const server = http.createServer(app);

server.on("error", (err) => {
  // eslint-disable-next-line no-console
  console.error("SERVER ERROR:", err.message);
  if (err.code === "EADDRINUSE") {
    // eslint-disable-next-line no-console
    console.error(`Port ${env.PORT} is already in use`);
  }
});

server.listen(env.PORT, "0.0.0.0", () => {
  // eslint-disable-next-line no-console
  console.log(`AI Content Studio server running on port ${env.PORT}`);
  // eslint-disable-next-line no-console
  console.log(`Listening on 0.0.0.0:${env.PORT}`);
  // eslint-disable-next-line no-console
  console.log(`Health check: http://localhost:${env.PORT}/api/health`);
});

const gracefulShutdown = (signal) => {
  // eslint-disable-next-line no-console
  console.log(`Received ${signal}. Closing server gracefully...`);
  server.close((error) => {
    if (error) {
      // eslint-disable-next-line no-console
      console.error("Error during server shutdown:", error);
      process.exit(1);
    }
    process.exit(0);
  });
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED:", err);
});