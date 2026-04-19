const resolveValue = async (maybePromise) => maybePromise;

const createApiClient = ({ baseUrl, getToken, setToken, clearToken }) => {
  const request = async (path, options = {}) => {
    const token = await resolveValue(getToken());
    const headers = {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers,
    });

    const text = await response.text();
    const payload = text ? JSON.parse(text) : null;

    if (!response.ok) {
      throw new Error(
        payload?.error || `Request failed with ${response.status}`,
      );
    }

    return payload;
  };

  return {
    async initialize() {
      await request("/health");
    },

    async login(username, password) {
      const payload = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      await resolveValue(setToken(payload.token));
      return payload;
    },

    async register(registerPayload) {
      const payload = await request("/auth/register", {
        method: "POST",
        body: JSON.stringify(registerPayload),
      });
      await resolveValue(setToken(payload.token));
      return payload;
    },

    async logout() {
      try {
        await request("/auth/logout", { method: "POST" });
      } finally {
        await resolveValue(clearToken());
      }
    },

    async getSession() {
      const token = await resolveValue(getToken());
      if (!token) {
        return null;
      }

      try {
        return await request("/auth/session");
      } catch {
        await resolveValue(clearToken());
        return null;
      }
    },

    async getDoctors() {
      return request("/doctors");
    },

    async getMedicines() {
      return request("/medicines");
    },

    async getAppointments(userId) {
      return request(`/appointments?userId=${encodeURIComponent(userId)}`);
    },

    async createAppointment(appointmentPayload) {
      return request("/appointments", {
        method: "POST",
        body: JSON.stringify(appointmentPayload),
      });
    },

    async getProfile(userId) {
      return request(`/profiles/${encodeURIComponent(userId)}`);
    },

    async updateProfile(userId, updates) {
      return request(`/profiles/${encodeURIComponent(userId)}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
    },

    async getHealthRecords(userId) {
      return request(`/health-records?userId=${encodeURIComponent(userId)}`);
    },

    async getOrders(userId) {
      return request(`/orders?userId=${encodeURIComponent(userId)}`);
    },

    async placeOrder(orderPayload) {
      return request("/orders", {
        method: "POST",
        body: JSON.stringify(orderPayload),
      });
    },
  };
};

module.exports = {
  createApiClient,
};
