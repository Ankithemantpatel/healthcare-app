const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");
const {
  createAsyncState,
  getActionErrorMessage,
} = require("../core/stateHelpers");

const fetchHealthRecords = createAsyncThunk(
  "healthRecords/fetchHealthRecords",
  async (userId, { extra }) => extra.api.getHealthRecords(userId),
);

const healthRecordsSlice = createSlice({
  name: "healthRecords",
  initialState: {
    items: [],
    ...createAsyncState(),
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHealthRecords.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchHealthRecords.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchHealthRecords.rejected, (state, action) => {
        state.status = "failed";
        state.error = getActionErrorMessage(
          action,
          "Failed to fetch health records",
        );
      });
  },
});

module.exports = {
  fetchHealthRecords,
  healthRecordsReducer: healthRecordsSlice.reducer,
};
