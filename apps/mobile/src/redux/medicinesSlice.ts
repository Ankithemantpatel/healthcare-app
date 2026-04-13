import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { CartItem, Medicine } from "shared";
import { mockApi } from "../services/mockApi";

interface MedicinesState {
  catalog: Medicine[];
  cart: CartItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: MedicinesState = {
  catalog: [],
  cart: [],
  status: "idle",
  error: null,
};

export const fetchMedicines = createAsyncThunk(
  "medicines/fetchMedicines",
  async () => mockApi.getMedicines(),
);

const medicinesSlice = createSlice({
  name: "medicines",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Medicine>) {
      const existing = state.cart.find(
        (item) => item.medicine.id === action.payload.id,
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.cart.push({ medicine: action.payload, quantity: 1 });
      }
    },
    decrementCartItem(state, action: PayloadAction<string>) {
      const existing = state.cart.find(
        (item) => item.medicine.id === action.payload,
      );
      if (!existing) {
        return;
      }
      if (existing.quantity <= 1) {
        state.cart = state.cart.filter(
          (item) => item.medicine.id !== action.payload,
        );
      } else {
        existing.quantity -= 1;
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.cart = state.cart.filter(
        (item) => item.medicine.id !== action.payload,
      );
    },
    clearCart(state) {
      state.cart = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicines.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMedicines.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.catalog = action.payload;
      })
      .addCase(fetchMedicines.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to load medicines";
      });
  },
});

export const { addToCart, decrementCartItem, removeFromCart, clearCart } =
  medicinesSlice.actions;

export default medicinesSlice.reducer;
