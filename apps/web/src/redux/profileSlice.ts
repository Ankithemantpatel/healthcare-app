import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserProfile, mockApi } from "../services/mockApi";

interface ProfileState {
  data: UserProfile | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  saveStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProfileState = {
  data: null,
  status: "idle",
  saveStatus: "idle",
  error: null,
};

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (userId: string) => {
    return mockApi.getProfile(userId);
  },
);

export const saveProfile = createAsyncThunk(
  "profile/saveProfile",
  async ({
    userId,
    updates,
  }: {
    userId: string;
    updates: Partial<Omit<UserProfile, "id" | "username">>;
  }) => {
    return mockApi.updateProfile(userId, updates);
  },
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch profile";
      })
      .addCase(saveProfile.pending, (state) => {
        state.saveStatus = "loading";
        state.error = null;
      })
      .addCase(saveProfile.fulfilled, (state, action) => {
        state.saveStatus = "succeeded";
        state.data = action.payload;
      })
      .addCase(saveProfile.rejected, (state, action) => {
        state.saveStatus = "failed";
        state.error = action.error.message ?? "Failed to save profile";
      });
  },
});

export default profileSlice.reducer;
