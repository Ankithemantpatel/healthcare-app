const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");
const { sharedUiCopy } = require("../../uiText");
const { REDUX_ACTION_TYPES, REDUX_SLICES } = require("../core/actionTypes");
const {
  createAsyncState,
  getActionErrorMessage,
} = require("../core/stateHelpers");

const fetchDoctors = createAsyncThunk(
  REDUX_ACTION_TYPES.doctors.fetchDoctors,
  async (_, { extra }) => extra.api.getDoctors(),
);

const doctorsSlice = createSlice({
  name: REDUX_SLICES.doctors,
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
        state.error = getActionErrorMessage(
          action,
          sharedUiCopy.feedback.errors.doctors.fetch,
        );
      });
  },
});

module.exports = {
  doctorsReducer: doctorsSlice.reducer,
  fetchDoctors,
};
