const { createAppStore } = require("./core/createAppStore");
const { reducer } = require("./rootReducer");
const appointments = require("./features/appointments");
const auth = require("./features/auth");
const doctors = require("./features/doctors");
const healthRecords = require("./features/healthRecords");
const medicines = require("./features/medicines");
const orders = require("./features/orders");
const profile = require("./features/profile");

module.exports = {
  createAppStore,
  reducer,
  ...auth,
  ...doctors,
  ...appointments,
  ...profile,
  ...medicines,
  ...healthRecords,
  ...orders,
};
