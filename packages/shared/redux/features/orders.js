const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");
const {
  createAsyncState,
  createMutationState,
  getActionErrorMessage,
} = require("../core/stateHelpers");

const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (userId, { extra }) => extra.api.getOrders(userId),
);

const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async (payload, { extra }) => extra.api.placeOrder(payload),
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    items: [],
    ...createAsyncState(),
    ...createMutationState("placeStatus"),
  },
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
        state.error = getActionErrorMessage(action, "Failed to fetch orders");
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
        state.error = getActionErrorMessage(action, "Failed to place order");
      });
  },
});

module.exports = {
  fetchOrders,
  ordersReducer: ordersSlice.reducer,
  placeOrder,
};
