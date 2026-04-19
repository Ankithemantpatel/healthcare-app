const path = require("path");
const { access, readFile, writeFile } = require("fs/promises");
const {
  generateMedicinesCatalog,
  seedAppointments,
  seedDoctors,
  seedOrders,
  seedPrescriptions,
  seedUsers,
} = require("shared");

const clone = (value) => JSON.parse(JSON.stringify(value));

const buildDatasets = () => ({
  users: { fileName: "users.json", fallback: seedUsers },
  doctors: { fileName: "doctors.json", fallback: seedDoctors },
  appointments: { fileName: "appointments.json", fallback: seedAppointments },
  medicines: {
    fileName: "medicines.json",
    fallback: generateMedicinesCatalog(),
  },
  prescriptions: {
    fileName: "prescriptions.json",
    fallback: seedPrescriptions,
  },
  orders: { fileName: "orders.json", fallback: seedOrders },
});

const createJsonRepository = ({ dataDir }) => {
  const datasets = buildDatasets();

  const getDatasetPath = (datasetName) =>
    path.join(dataDir, datasets[datasetName].fileName);

  const ensureDataset = async (datasetName) => {
    const filePath = getDatasetPath(datasetName);

    try {
      await access(filePath);
    } catch {
      await writeFile(
        filePath,
        JSON.stringify(clone(datasets[datasetName].fallback), null, 2),
      );
    }
  };

  const readDataset = async (datasetName) => {
    await ensureDataset(datasetName);
    const raw = await readFile(getDatasetPath(datasetName), "utf8");
    return JSON.parse(raw);
  };

  const writeDataset = async (datasetName, data) => {
    await writeFile(getDatasetPath(datasetName), JSON.stringify(data, null, 2));
  };

  return {
    async initialize() {
      await Promise.all(
        Object.keys(datasets).map((dataset) => ensureDataset(dataset)),
      );
    },
    getUsers: () => readDataset("users"),
    saveUsers: (users) => writeDataset("users", users),
    getDoctors: () => readDataset("doctors"),
    getMedicines: () => readDataset("medicines"),
    getAppointments: () => readDataset("appointments"),
    saveAppointments: (appointments) =>
      writeDataset("appointments", appointments),
    getPrescriptions: () => readDataset("prescriptions"),
    getOrders: () => readDataset("orders"),
    saveOrders: (orders) => writeDataset("orders", orders),
  };
};

module.exports = {
  createJsonRepository,
};
