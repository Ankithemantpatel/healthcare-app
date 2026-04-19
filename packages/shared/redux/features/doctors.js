const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");
const {
  createAsyncState,
  getActionErrorMessage,
} = require("../core/stateHelpers");

const fetchDoctors = createAsyncThunk(
  "doctors/fetchDoctors",
  async (_, { extra }) => extra.api.getDoctors(),
);

const doctorsSlice = createSlice({
  name: "doctors",
  initialState: {
    items: [],
    ...createAsyncState(),
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.status = "failed";
        state.error = getActionErrorMessage(action, "Failed to fetch doctors");
      });
  },
});

module.exports = {
  doctorsReducer: doctorsSlice.reducer,
  fetchDoctors,
};
