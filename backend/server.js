const http = require("http");
const app = require("./app");
const { env } = require("./config/env");

const server = http.createServer(app);

server.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`AI Content Studio server running on port ${env.PORT}`);
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