const { configureStore } = require("@reduxjs/toolkit");
const { reducer } = require("../rootReducer");

const createAppStore = ({ api, preloadedState } = {}) => {
  // Each app (web/mobile) injects its own API adapter while reusing shared thunks.
  if (!api) {
    throw new Error("createAppStore requires an api implementation");
  }

  return configureStore({
    reducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        // Thunks read `extra.api` instead of importing app-specific services directly.
        thunk: {
          extraArgument: { api },
        },
      }),
  });
};

module.exports = {
  createAppStore,
};
