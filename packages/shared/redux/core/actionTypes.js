const REDUX_SLICES = Object.freeze({
  auth: "auth",
  doctors: "doctors",
  appointments: "appointments",
  medicines: "medicines",
  profile: "profile",
  healthRecords: "healthRecords",
  orders: "orders",
});

const createActionType = (sliceName, actionName) =>
  `${sliceName}/${actionName}`;

const REDUX_ACTION_TYPES = Object.freeze({
  auth: Object.freeze({
    initializeAuth: createActionType(REDUX_SLICES.auth, "initializeAuth"),
    loginUser: createActionType(REDUX_SLICES.auth, "loginUser"),
    registerUser: createActionType(REDUX_SLICES.auth, "registerUser"),
    logoutUser: createActionType(REDUX_SLICES.auth, "logoutUser"),
  }),
  doctors: Object.freeze({
    fetchDoctors: createActionType(REDUX_SLICES.doctors, "fetchDoctors"),
  }),
  appointments: Object.freeze({
    fetchAppointments: createActionType(
      REDUX_SLICES.appointments,
      "fetchAppointments",
    ),
    createAppointment: createActionType(
      REDUX_SLICES.appointments,
      "createAppointment",
    ),
  }),
  medicines: Object.freeze({
    fetchMedicines: createActionType(REDUX_SLICES.medicines, "fetchMedicines"),
  }),
  profile: Object.freeze({
    fetchProfile: createActionType(REDUX_SLICES.profile, "fetchProfile"),
    saveProfile: createActionType(REDUX_SLICES.profile, "saveProfile"),
  }),
  healthRecords: Object.freeze({
    fetchHealthRecords: createActionType(
      REDUX_SLICES.healthRecords,
      "fetchHealthRecords",
    ),
  }),
  orders: Object.freeze({
    fetchOrders: createActionType(REDUX_SLICES.orders, "fetchOrders"),
    placeOrder: createActionType(REDUX_SLICES.orders, "placeOrder"),
  }),
});

module.exports = {
  REDUX_ACTION_TYPES,
  REDUX_SLICES,
  createActionType,
};
