const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");
const { sharedUiCopy } = require("../../uiText");
const { REDUX_ACTION_TYPES, REDUX_SLICES } = require("../core/actionTypes");
const { getActionErrorMessage } = require("../core/stateHelpers");

const initializeAuth = createAsyncThunk(
  REDUX_ACTION_TYPES.auth.initializeAuth,
  async (_, { extra }) => extra.api.getSession(),
);

const loginUser = createAsyncThunk(
  REDUX_ACTION_TYPES.auth.loginUser,
  async ({ username, password }, { extra }) =>
    extra.api.login(username, password),
);

const registerUser = createAsyncThunk(
  REDUX_ACTION_TYPES.auth.registerUser,
  async (payload, { extra }) => extra.api.register(payload),
);

const logoutUser = createAsyncThunk(
  REDUX_ACTION_TYPES.auth.logoutUser,
  async (_, { extra }) => {
    await extra.api.logout();
  },
);

const authSlice = createSlice({
  name: REDUX_SLICES.auth,
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.status = "failed";
        state.error = getActionErrorMessage(
          action,
          sharedUiCopy.feedback.errors.auth.initialize,
        );
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = getActionErrorMessage(
          action,
          sharedUiCopy.feedback.errors.auth.login,
        );
        state.isAuthenticated = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = getActionErrorMessage(
          action,
          sharedUiCopy.feedback.errors.auth.register,
        );
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.status = "idle";
      });
  },
});

module.exports = {
  authReducer: authSlice.reducer,
  initializeAuth,
  loginUser,
  logoutUser,
  registerUser,
};
