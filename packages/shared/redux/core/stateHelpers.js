const createAsyncState = () => ({
  status: "idle",
  error: null,
});

const createMutationState = (fieldName) => ({
  [fieldName]: "idle",
  error: null,
});

const getActionErrorMessage = (action, fallbackMessage) =>
  action.error?.message ?? fallbackMessage;

module.exports = {
  createAsyncState,
  createMutationState,
  getActionErrorMessage,
};
