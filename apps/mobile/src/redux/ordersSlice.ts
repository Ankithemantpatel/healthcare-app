import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { MedicineOrder } from "shared";
import { mockApi } from "../services/mockApi";

interface OrdersState {
  items: MedicineOrder[];
  status: "idle" | "loading" | "succeeded" | "failed";
  placeStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: OrdersState = {
  items: [],
  status: "idle",
  placeStatus: "idle",
  error: null,
};

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (userId: string) => mockApi.getOrders(userId),
);

export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async (payload: Omit<MedicineOrder, "id" | "status" | "placedAt" | "eta">) =>
    mockApi.placeOrder(payload),
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch orders";
      })
      .addCase(placeOrder.pending, (state) => {
        state.placeStatus = "loading";
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.placeStatus = "succeeded";
        state.items = [action.payload, ...state.items];
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.placeStatus = "failed";
        state.error = action.error.message ?? "Failed to place order";
      });
  },
});

export default ordersSlice.reducer;
