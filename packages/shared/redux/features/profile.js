const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");
const {
  createAsyncState,
  createMutationState,
  getActionErrorMessage,
} = require("../core/stateHelpers");

const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (userId, { extra }) => extra.api.getProfile(userId),
);

const saveProfile = createAsyncThunk(
  "profile/saveProfile",
  async ({ userId, updates }, { extra }) =>
    extra.api.updateProfile(userId, updates),
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    data: null,
    ...createAsyncState(),
    ...createMutationState("saveStatus"),
  },
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
        state.error = getActionErrorMessage(action, "Failed to fetch profile");
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
        state.error = getActionErrorMessage(action, "Failed to save profile");
      });
  },
});

module.exports = {
  fetchProfile,
  profileReducer: profileSlice.reducer,
  saveProfile,
};
