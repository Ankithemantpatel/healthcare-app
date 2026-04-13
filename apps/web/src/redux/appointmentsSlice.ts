import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Appointment, mockApi } from "../services/mockApi";

interface AppointmentsState {
  items: Appointment[];
  status: "idle" | "loading" | "succeeded" | "failed";
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AppointmentsState = {
  items: [],
  status: "idle",
  createStatus: "idle",
  error: null,
};

export const fetchAppointments = createAsyncThunk(
  "appointments/fetchAppointments",
  async (userId: string) => mockApi.getAppointments(userId),
);

export const createAppointment = createAsyncThunk(
  "appointments/createAppointment",
  async (payload: Omit<Appointment, "id" | "status">) =>
    mockApi.createAppointment(payload),
);

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
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
        state.error = action.error.message ?? "Failed to fetch appointments";
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
        state.error = action.error.message ?? "Failed to create appointment";
      });
  },
});

export default appointmentsSlice.reducer;
