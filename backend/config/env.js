const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config();

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const required = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: toNumber(process.env.PORT, 3000),
  OPENROUTER_API_KEY: required("OPENROUTER_API_KEY"),
  OPENROUTER_MODEL:
    process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat-v3-0324:free",
  OPENROUTER_BASE_URL:
    process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
  OPENROUTER_APP_NAME: process.env.OPENROUTER_APP_NAME || "AI Content Studio",
  OPENROUTER_APP_URL: process.env.OPENROUTER_APP_URL || "http://localhost:3000",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",
  RATE_LIMIT_WINDOW_MS: toNumber(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  RATE_LIMIT_MAX: toNumber(process.env.RATE_LIMIT_MAX, 60)
};

module.exports = { env };

