const path = require("path");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");

const { env } = require("./config/env");
const { apiRateLimiter } = require("./middleware/rateLimiter");
const generateRoutes = require("./routes/generateRoutes");
const { notFoundHandler } = require("./middleware/notFound");
const { globalErrorHandler } = require("./middleware/errorHandler");

const app = express();

app.use((_req, _res, next) => {
  // eslint-disable-next-line no-console
  console.log(`[${new Date().toISOString()}] ${_req.method} ${_req.url} - ${_req.ip}`);
  next();
});

app.disable("x-powered-by");
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: []
      }
    }
  })
);
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST"],
    credentials: false
  })
);
app.use(compression());
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Content Studio API is healthy",
    timestamp: new Date().toISOString()
  });
});

app.use("/api", apiRateLimiter);
app.use("/api", generateRoutes);

const frontendPath = path.resolve(__dirname, "../frontend");
app.use(express.static(frontendPath));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  return res.sendFile(path.join(frontendPath, "index.html"));
});

app.use(notFoundHandler);
app.use(globalErrorHandler);

module.exports = app;
