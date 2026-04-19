const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");
const { sharedUiCopy: CONSTANTS } = require("../../uiText");
const { REDUX_ACTION_TYPES, REDUX_SLICES } = require("../core/actionTypes");
const {
  createAsyncState,
  getActionErrorMessage,
} = require("../core/stateHelpers");

const fetchHealthRecords = createAsyncThunk(
  REDUX_ACTION_TYPES.healthRecords.fetchHealthRecords,
  async (userId, { extra }) => extra.api.getHealthRecords(userId),
);

const healthRecordsSlice = createSlice({
  name: REDUX_SLICES.healthRecords,
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
          CONSTANTS.feedback.errors.healthRecords.fetch,
        );
      });
  },
});

module.exports = {
  fetchHealthRecords,
  healthRecordsReducer: healthRecordsSlice.reducer,
};
