const crypto = require("crypto");

const base64UrlEncode = (value) =>
  Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

const base64UrlDecode = (value) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding =
    normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));

  return Buffer.from(`${normalized}${padding}`, "base64").toString("utf8");
};

const createTokenService = ({ secret, ttlSeconds, now = () => Date.now() }) => {
  const sign = (payloadSegment) =>
    base64UrlEncode(
      crypto.createHmac("sha256", secret).update(payloadSegment).digest(),
    );

  return {
    createToken(userId) {
      const payload = {
        sub: userId,
        exp: Math.floor(now() / 1000) + ttlSeconds,
      };
      const payloadSegment = base64UrlEncode(JSON.stringify(payload));
      return `${payloadSegment}.${sign(payloadSegment)}`;
    },

    verifyToken(token) {
      if (!token || typeof token !== "string") {
        return null;
      }

      const [payloadSegment, signature] = token.split(".");
      if (!payloadSegment || !signature || sign(payloadSegment) !== signature) {
        return null;
      }

      try {
        const payload = JSON.parse(base64UrlDecode(payloadSegment));
        if (!payload.sub || !payload.exp) {
          return null;
        }

        if (payload.exp < Math.floor(now() / 1000)) {
          return null;
        }

        return payload;
      } catch {
        return null;
      }
    },
  };
};

module.exports = {
  createTokenService,
};
