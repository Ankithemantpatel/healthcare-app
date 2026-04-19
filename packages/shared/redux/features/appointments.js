const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");
const { sharedUiCopy } = require("../../uiText");
const { REDUX_ACTION_TYPES, REDUX_SLICES } = require("../core/actionTypes");
const {
  createAsyncState,
  createMutationState,
  getActionErrorMessage,
} = require("../core/stateHelpers");

const fetchAppointments = createAsyncThunk(
  REDUX_ACTION_TYPES.appointments.fetchAppointments,
  async (userId, { extra }) => extra.api.getAppointments(userId),
);

const createAppointment = createAsyncThunk(
  REDUX_ACTION_TYPES.appointments.createAppointment,
  async (payload, { extra }) => extra.api.createAppointment(payload),
);

const appointmentsSlice = createSlice({
  name: REDUX_SLICES.appointments,
  initialState: {
    items: [],
    ...createAsyncState(),
    // Dedicated mutation state keeps form-submit UX independent from list loading.
    ...createMutationState("createStatus"),
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.status = "failed";
        state.error = getActionErrorMessage(
          action,
          sharedUiCopy.feedback.errors.appointments.fetch,
        );
      })
      .addCase(createAppointment.pending, (state) => {
        state.createStatus = "loading";
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.items = [action.payload, ...state.items];
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error = getActionErrorMessage(
          action,
          sharedUiCopy.feedback.errors.appointments.create,
        );
      });
  },
});

module.exports = {
  appointmentsReducer: appointmentsSlice.reducer,
  createAppointment,
  fetchAppointments,
};
