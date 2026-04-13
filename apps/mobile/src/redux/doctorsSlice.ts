import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Doctor } from "shared";
import { mockApi } from "../services/mockApi";

interface DoctorsState {
  items: Doctor[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: DoctorsState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchDoctors = createAsyncThunk(
  "doctors/fetchDoctors",
  async () => {
    return mockApi.getDoctors();
  },
);

const doctorsSlice = createSlice({
  name: "doctors",
  initialState,
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
        state.error = action.error.message ?? "Failed to fetch doctors";
      });
  },
});

export default doctorsSlice.reducer;
