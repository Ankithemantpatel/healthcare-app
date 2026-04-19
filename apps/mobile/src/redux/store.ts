import { createAppStore, type RootState } from "shared/redux";
import { apiClient } from "../services/apiClient";

const store = createAppStore({ api: apiClient });

export type AppDispatch = typeof store.dispatch;
export type { RootState };
export default store;
