const createNotImplementedMethod = (methodName) => async () => {
  throw new Error(
    `API_DB_PROVIDER=postgres is wired, but ${methodName} is not implemented yet. Add your database client and implement packages/api/repositories/postgresRepository.js.`,
  );
};

const createPostgresRepository = () => ({
  initialize: createNotImplementedMethod("initialize"),
  getUsers: createNotImplementedMethod("getUsers"),
  saveUsers: createNotImplementedMethod("saveUsers"),
  getDoctors: createNotImplementedMethod("getDoctors"),
  getMedicines: createNotImplementedMethod("getMedicines"),
  getAppointments: createNotImplementedMethod("getAppointments"),
  saveAppointments: createNotImplementedMethod("saveAppointments"),
  getPrescriptions: createNotImplementedMethod("getPrescriptions"),
  getOrders: createNotImplementedMethod("getOrders"),
  saveOrders: createNotImplementedMethod("saveOrders"),
});

module.exports = {
  createPostgresRepository,
};
