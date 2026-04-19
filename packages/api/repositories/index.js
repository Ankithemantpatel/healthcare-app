const { apiConfig } = require("../config");
const { createJsonRepository } = require("./jsonRepository");
const { createPostgresRepository } = require("./postgresRepository");

const createRepository = () => {
  if (apiConfig.dbProvider === "json") {
    return createJsonRepository({ dataDir: apiConfig.dataDir });
  }

  if (apiConfig.dbProvider === "postgres") {
    return createPostgresRepository();
  }

  throw new Error(
    `Unsupported API_DB_PROVIDER '${apiConfig.dbProvider}'. Implement a repository for this provider and register it in packages/api/repositories/index.js.`,
  );
};

module.exports = {
  createRepository,
};
