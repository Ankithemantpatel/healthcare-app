import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApiClient } from "api";

const API_BASE_URL = "http://127.0.0.1:4000";
const SESSION_KEY = "mock_auth_session";

let sessionToken: string | null = null;
let tokenHydrationPromise: Promise<string | null> | null = null;

const hydrateSessionToken = async () => {
  if (sessionToken) {
    return sessionToken;
  }

  if (!tokenHydrationPromise) {
    tokenHydrationPromise = AsyncStorage.getItem(SESSION_KEY)
      .then((storedToken) => {
        sessionToken = storedToken;
        return storedToken;
      })
      .finally(() => {
        tokenHydrationPromise = null;
      });
  }

  return tokenHydrationPromise;
};

export const apiClient = createApiClient({
  baseUrl: API_BASE_URL,
  getToken: async () => sessionToken ?? hydrateSessionToken(),
  setToken: async (token: string) => {
    sessionToken = token;
    await AsyncStorage.setItem(SESSION_KEY, token);
  },
  clearToken: async () => {
    sessionToken = null;
    await AsyncStorage.removeItem(SESSION_KEY);
  },
});
