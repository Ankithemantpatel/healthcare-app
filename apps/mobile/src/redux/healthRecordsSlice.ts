import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PrescriptionRecord } from "shared";
import { mockApi } from "../services/mockApi";

interface HealthRecordsState {
  items: PrescriptionRecord[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: HealthRecordsState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchHealthRecords = createAsyncThunk(
  "healthRecords/fetchHealthRecords",
  async (userId: string) => mockApi.getHealthRecords(userId),
);

const healthRecordsSlice = createSlice({
  name: "healthRecords",
  initialState,
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
        state.error = action.error.message ?? "Failed to fetch health records";
      });
  },
});

export default healthRecordsSlice.reducer;
