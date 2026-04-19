const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");
const {
  createAsyncState,
  getActionErrorMessage,
} = require("../core/stateHelpers");

const fetchMedicines = createAsyncThunk(
  "medicines/fetchMedicines",
  async (_, { extra }) => extra.api.getMedicines(),
);

const medicinesSlice = createSlice({
  name: "medicines",
  initialState: {
    catalog: [],
    cart: [],
    ...createAsyncState(),
  },
  reducers: {
    addToCart(state, action) {
      const existing = state.cart.find(
        (item) => item.medicine.id === action.payload.id,
      );

      if (existing) {
        existing.quantity += 1;
        return;
      }

      state.cart.push({ medicine: action.payload, quantity: 1 });
    },
    decrementCartItem(state, action) {
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
        return;
      }

      existing.quantity -= 1;
    },
    removeFromCart(state, action) {
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
        state.error = getActionErrorMessage(action, "Failed to load medicines");
      });
  },
});

const { addToCart, clearCart, decrementCartItem, removeFromCart } =
  medicinesSlice.actions;

module.exports = {
  addToCart,
  clearCart,
  decrementCartItem,
  fetchMedicines,
  medicinesReducer: medicinesSlice.reducer,
  removeFromCart,
};
