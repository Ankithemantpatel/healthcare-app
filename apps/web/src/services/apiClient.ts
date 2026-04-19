import { createApiClient } from "api";

const SESSION_KEY = "mock_auth_session";

const API_BASE_URL = "http://127.0.0.1:4000";

export const apiClient = createApiClient({
  baseUrl: API_BASE_URL,
  getToken: () => localStorage.getItem(SESSION_KEY),
  setToken: (token: string) => {
    localStorage.setItem(SESSION_KEY, token);
  },
  clearToken: () => {
    localStorage.removeItem(SESSION_KEY);
  },
});