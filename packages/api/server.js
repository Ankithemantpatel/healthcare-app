const http = require("http");
const { apiConfig } = require("./config");
const { createRepository } = require("./repositories");
const { createAppService } = require("./services/appService");
const { createTokenService } = require("./services/tokenService");

const json = (statusCode, data) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": apiConfig.corsOrigin,
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
  },
  body: JSON.stringify(data),
});

const parseBody = async (request) =>
  new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });

const getBearerToken = (request) => {
  const header = request.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return null;
  }

  return header.slice("Bearer ".length);
};

const notFound = () => json(404, { error: "Not found" });

const repository = createRepository();
const tokenService = createTokenService({
  secret: apiConfig.authSecret,
  ttlSeconds: apiConfig.tokenTtlSeconds,
});
const appService = createAppService({ repository, tokenService });

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);

    if (request.method === "OPTIONS") {
      const payload = json(204, {});
      response.writeHead(payload.statusCode, payload.headers);
      response.end();
      return;
    }

    if (request.method === "GET" && url.pathname === "/health") {
      await appService.initialize();
      const payload = json(200, { ok: true });
      response.writeHead(payload.statusCode, payload.headers);
      response.end(payload.body);
      return;
    }

    if (request.method === "POST" && url.pathname === "/auth/login") {
      const body = await parseBody(request);

      try {
        const payload = json(
          200,
          await appService.login(body.username, body.password),
        );
        response.writeHead(payload.statusCode, payload.headers);
        response.end(payload.body);
      } catch {
        const payload = json(401, { error: "Invalid username or password" });
        response.writeHead(payload.statusCode, payload.headers);
        response.end(payload.body);
      }
      return;
    }

    if (request.method === "POST" && url.pathname === "/auth/register") {
      const body = await parseBody(request);

      try {
        const payload = json(200, await appService.register(body));
        response.writeHead(payload.statusCode, payload.headers);
        response.end(payload.body);
      } catch {
        const payload = json(409, { error: "Username already exists" });
        response.writeHead(payload.statusCode, payload.headers);
        response.end(payload.body);
      }
      return;
    }

    if (request.method === "POST" && url.pathname === "/auth/logout") {
      const payload = json(200, { ok: true });
      response.writeHead(payload.statusCode, payload.headers);
      response.end(payload.body);
      return;
    }

    if (request.method === "GET" && url.pathname === "/auth/session") {
      const session = await appService.getSession(getBearerToken(request));

      if (!session) {
        const payload = json(401, { error: "Unauthorized" });
        response.writeHead(payload.statusCode, payload.headers);
        response.end(payload.body);
        return;
      }

      const payload = json(200, session);
      response.writeHead(payload.statusCode, payload.headers);
      response.end(payload.body);
      return;
    }

    if (request.method === "GET" && url.pathname === "/doctors") {
      const payload = json(200, await appService.getDoctors());
      response.writeHead(payload.statusCode, payload.headers);
      response.end(payload.body);
      return;
    }

    if (request.method === "GET" && url.pathname === "/medicines") {
      const payload = json(200, await appService.getMedicines());
      response.writeHead(payload.statusCode, payload.headers);
      response.end(payload.body);
      return;
    }

    if (request.method === "GET" && url.pathname === "/appointments") {
      const payload = json(
        200,
        await appService.getAppointments(url.searchParams.get("userId")),
      );
      response.writeHead(payload.statusCode, payload.headers);
      response.end(payload.body);
      return;
    }

    if (request.method === "POST" && url.pathname === "/appointments") {
      const body = await parseBody(request);
      const payload = json(200, await appService.createAppointment(body));
      response.writeHead(payload.statusCode, payload.headers);
      response.end(payload.body);
      return;
    }

    if (request.method === "GET" && url.pathname.startsWith("/profiles/")) {
      const userId = decodeURIComponent(url.pathname.replace("/profiles/", ""));

      try {
        const payload = json(200, await appService.getProfile(userId));
        response.writeHead(payload.statusCode, payload.headers);
        response.end(payload.body);
      } catch {
        const payload = json(404, { error: "Profile not found" });
        response.writeHead(payload.statusCode, payload.headers);
        response.end(payload.body);
      }
      return;
    }

    if (request.method === "PATCH" && url.pathname.startsWith("/profiles/")) {
      const userId = decodeURIComponent(url.pathname.replace("/profiles/", ""));
      const body = await parseBody(request);

      try {
        const payload = json(200, await appService.updateProfile(userId, body));
        response.writeHead(payload.statusCode, payload.headers);
        response.end(payload.body);
      } catch {
        const payload = json(404, { error: "Profile not found" });
        response.writeHead(payload.statusCode, payload.headers);
        response.end(payload.body);
      }
      return;
    }

    if (request.method === "GET" && url.pathname === "/health-records") {
      const payload = json(
        200,
        await appService.getHealthRecords(url.searchParams.get("userId")),
      );
      response.writeHead(payload.statusCode, payload.headers);
      response.end(payload.body);
      return;
    }

    if (request.method === "GET" && url.pathname === "/orders") {
      const payload = json(
        200,
        await appService.getOrders(url.searchParams.get("userId")),
      );
      response.writeHead(payload.statusCode, payload.headers);
      response.end(payload.body);
      return;
    }

    if (request.method === "POST" && url.pathname === "/orders") {
      const body = await parseBody(request);
      const payload = json(200, await appService.placeOrder(body));
      response.writeHead(payload.statusCode, payload.headers);
      response.end(payload.body);
      return;
    }

    const payload = notFound();
    response.writeHead(payload.statusCode, payload.headers);
    response.end(payload.body);
  } catch (error) {
    const payload = json(500, {
      error: error instanceof Error ? error.message : "Internal server error",
    });
    response.writeHead(payload.statusCode, payload.headers);
    response.end(payload.body);
  }
});

server.listen(apiConfig.port, () => {
  console.log(
    `Local API server listening on http://127.0.0.1:${apiConfig.port}`,
  );
});
