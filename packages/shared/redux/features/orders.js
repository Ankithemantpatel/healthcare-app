const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");
const { sharedUiCopy: CONSTANTS } = require("../../uiText");
const { REDUX_ACTION_TYPES, REDUX_SLICES } = require("../core/actionTypes");
const {
  createAsyncState,
  createMutationState,
  getActionErrorMessage,
} = require("../core/stateHelpers");

const fetchOrders = createAsyncThunk(
  REDUX_ACTION_TYPES.orders.fetchOrders,
  async (userId, { extra }) => extra.api.getOrders(userId),
);

const placeOrder = createAsyncThunk(
  REDUX_ACTION_TYPES.orders.placeOrder,
  async (payload, { extra }) => extra.api.placeOrder(payload),
);

const ordersSlice = createSlice({
  name: REDUX_SLICES.orders,
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
        state.error = getActionErrorMessage(
          action,
          CONSTANTS.feedback.errors.orders.fetch,
        );
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
        state.error = getActionErrorMessage(
          action,
          CONSTANTS.feedback.errors.orders.place,
        );
      });
  },
});

module.exports = {
  fetchOrders,
  ordersReducer: ordersSlice.reducer,
  placeOrder,
};
