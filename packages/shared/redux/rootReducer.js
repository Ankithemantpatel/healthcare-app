const { appointmentsReducer } = require("./features/appointments");
const { authReducer } = require("./features/auth");
const { doctorsReducer } = require("./features/doctors");
const { healthRecordsReducer } = require("./features/healthRecords");
const { medicinesReducer } = require("./features/medicines");
const { ordersReducer } = require("./features/orders");
const { profileReducer } = require("./features/profile");

const reducer = {
  auth: authReducer,
  doctors: doctorsReducer,
  appointments: appointmentsReducer,
  profile: profileReducer,
  medicines: medicinesReducer,
  healthRecords: healthRecordsReducer,
  orders: ordersReducer,
};

module.exports = {
  reducer,
};
