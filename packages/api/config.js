const path = require("path");

const apiConfig = Object.freeze({
  port: Number(process.env.PORT || 4000),
  dbProvider: process.env.API_DB_PROVIDER || "json",
  dataDir: process.env.API_DATA_DIR || path.resolve(__dirname, "./data"),
  authSecret:
    process.env.API_AUTH_SECRET || "carebridge-local-dev-secret-change-me",
  tokenTtlSeconds: Number(
    process.env.API_TOKEN_TTL_SECONDS || 60 * 60 * 24 * 7,
  ),
  corsOrigin: process.env.API_CORS_ORIGIN || "*",
});

module.exports = {
  apiConfig,
};
