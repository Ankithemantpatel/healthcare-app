import { createAppStore, type RootState } from "shared/redux";
import { mockApi } from "../services/mockApi";

const store = createAppStore({ api: mockApi });

export type AppDispatch = typeof store.dispatch;
export type { RootState };
export default store;
