import { createAppStore, type RootState } from "shared/redux";
import type { CartItem } from "shared";
import { mockApi } from "../services/mockApi";

const CART_KEY = "mock_medicine_cart";

const loadCart = (): CartItem[] => {
  const raw = localStorage.getItem(CART_KEY);
  if (!raw) {
    return [];
  }

  // Keep app boot resilient if storage is manually edited or corrupted.
  try {
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
};

const store = createAppStore({
  api: mockApi,
  // Only cart data is hydrated on web; other slices initialize from reducers.
  preloadedState: {
    medicines: {
      catalog: [],
      cart: loadCart(),
      status: "idle",
      error: null,
    },
  },
});

// Persist cart changes without coupling shared reducers to browser storage APIs.
store.subscribe(() => {
  localStorage.setItem(
    CART_KEY,
    JSON.stringify(store.getState().medicines.cart),
  );
});

export type AppDispatch = typeof store.dispatch;
export type { RootState };
export default store;
