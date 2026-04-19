import { seedOrders, seedPrescriptions } from "shared";

export interface UserRecord {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  condition: string;
}

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  condition: string;
}

export interface RegisterPayload {
  username: string;
  password: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  condition?: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  availability: string;
  experienceYears: number;
  rating: number;
  consultationFee: number;
  hospital: string;
  image: string;
}

export interface Appointment {
  id: string;
  userId: string;
  doctor: string;
  date: string;
  time: string;
  type: string;
  reason: string;
  status: "Confirmed" | "Pending" | "Completed" | "Cancelled";
}

export interface Medicine {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  packSize: string;
  requiresPrescription: boolean;
  inStock: boolean;
  image: string;
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

export interface PrescriptionRecord {
  id: string;
  userId: string;
  doctor: string;
  date: string;
  diagnosis: string;
  medicines: string[];
  notes: string;
}

export interface MedicineOrder {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status:
    | "Order Placed"
    | "Confirmed"
    | "Packed"
    | "Out for Delivery"
    | "Delivered"
    | "Cancelled";
  placedAt: string;
  eta: string;
}

interface AuthSession {
  userId: string;
  token: string;
}

const USERS_KEY = "mock_users";
const DOCTORS_KEY = "mock_doctors";
const APPOINTMENTS_KEY = "mock_appointments";
const MEDICINES_KEY = "mock_medicines";
const PRESCRIPTIONS_KEY = "mock_prescriptions";
const ORDERS_KEY = "mock_orders";
const SESSION_KEY = "mock_auth_session";

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

const readStorage = <T>(key: string): T | null => {
  const raw = localStorage.getItem(key);
  if (!raw) {
    return null;
  }

  return JSON.parse(raw) as T;
};

const writeStorage = (key: string, value: unknown): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

const stripUserSecrets = (user: UserRecord): UserProfile => ({
  id: user.id,
  username: user.username,
  name: user.name,
  email: user.email,
  phone: user.phone,
  address: user.address,
  condition: user.condition,
});

const seedDataIfNeeded = async (): Promise<void> => {
  const users = readStorage<UserRecord[]>(USERS_KEY);
  const doctors = readStorage<Doctor[]>(DOCTORS_KEY);
  const appointments = readStorage<Appointment[]>(APPOINTMENTS_KEY);
  const medicines = readStorage<Medicine[]>(MEDICINES_KEY);
  const prescriptions = readStorage<PrescriptionRecord[]>(PRESCRIPTIONS_KEY);
  const orders = readStorage<MedicineOrder[]>(ORDERS_KEY);

  if (
    users &&
    doctors &&
    appointments &&
    medicines &&
    prescriptions &&
    orders
  ) {
    // Keep medicines synced with public mock JSON so dataset updates are reflected.
    const medicinesRes = await fetch("/mock/medicines.json");
    const medicinesData = (await medicinesRes.json()) as Medicine[];
    writeStorage(MEDICINES_KEY, medicinesData);
    return;
  }

  const [usersRes, doctorsRes, appointmentsRes, medicinesRes] =
    await Promise.all([
      fetch("/mock/users.json"),
      fetch("/mock/doctors.json"),
      fetch("/mock/appointments.json"),
      fetch("/mock/medicines.json"),
    ]);

  const [usersData, doctorsData, appointmentsData, medicinesData] =
    await Promise.all([
      usersRes.json() as Promise<UserRecord[]>,
      doctorsRes.json() as Promise<Doctor[]>,
      appointmentsRes.json() as Promise<Appointment[]>,
      medicinesRes.json() as Promise<Medicine[]>,
    ]);

  writeStorage(USERS_KEY, usersData);
  writeStorage(DOCTORS_KEY, doctorsData);
  writeStorage(APPOINTMENTS_KEY, appointmentsData);
  writeStorage(MEDICINES_KEY, medicinesData);
  writeStorage(PRESCRIPTIONS_KEY, seedPrescriptions);
  writeStorage(ORDERS_KEY, seedOrders);
};

export const mockApi = {
  async initialize(): Promise<void> {
    await seedDataIfNeeded();
  },

  async login(
    username: string,
    password: string,
  ): Promise<{ token: string; user: UserProfile }> {
    await seedDataIfNeeded();
    await delay();

    const users = readStorage<UserRecord[]>(USERS_KEY) ?? [];
    const matched = users.find(
      (u) => u.username === username && u.password === password,
    );

    if (!matched) {
      throw new Error("Invalid username or password");
    }

    const token = `mock-token-${matched.id}`;
    writeStorage(SESSION_KEY, { userId: matched.id, token } as AuthSession);

    return { token, user: stripUserSecrets(matched) };
  },

  async register(
    payload: RegisterPayload,
  ): Promise<{ token: string; user: UserProfile }> {
    await seedDataIfNeeded();
    await delay(320);

    const users = readStorage<UserRecord[]>(USERS_KEY) ?? [];
    const exists = users.some(
      (u) => u.username.toLowerCase() === payload.username.toLowerCase(),
    );

    if (exists) {
      throw new Error("Username already exists");
    }

    const created: UserRecord = {
      id: `u${Date.now()}`,
      username: payload.username,
      password: payload.password,
      name: payload.name,
      email: payload.email,
      phone: payload.phone ?? "",
      address: payload.address ?? "",
      condition: payload.condition ?? "N/A",
    };

    writeStorage(USERS_KEY, [created, ...users]);
    const token = `mock-token-${created.id}`;
    writeStorage(SESSION_KEY, { userId: created.id, token } as AuthSession);
    return { token, user: stripUserSecrets(created) };
  },

  async logout(): Promise<void> {
    await delay(100);
    localStorage.removeItem(SESSION_KEY);
  },

  async getSession(): Promise<{ token: string; user: UserProfile } | null> {
    await seedDataIfNeeded();
    await delay(120);

    const session = readStorage<AuthSession>(SESSION_KEY);
    if (!session) {
      return null;
    }

    const users = readStorage<UserRecord[]>(USERS_KEY) ?? [];
    const matched = users.find((u) => u.id === session.userId);
    if (!matched) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }

    return { token: session.token, user: stripUserSecrets(matched) };
  },

  async getDoctors(): Promise<Doctor[]> {
    await seedDataIfNeeded();
    await delay(220);
    return readStorage<Doctor[]>(DOCTORS_KEY) ?? [];
  },

  async getMedicines(): Promise<Medicine[]> {
    await seedDataIfNeeded();
    await delay(180);
    return readStorage<Medicine[]>(MEDICINES_KEY) ?? [];
  },

  async getAppointments(userId: string): Promise<Appointment[]> {
    await seedDataIfNeeded();
    await delay(220);
    const appointments = readStorage<Appointment[]>(APPOINTMENTS_KEY) ?? [];
    return appointments.filter((a) => a.userId === userId);
  },

  async createAppointment(
    payload: Omit<Appointment, "id" | "status">,
  ): Promise<Appointment> {
    await seedDataIfNeeded();
    await delay(250);

    const appointments = readStorage<Appointment[]>(APPOINTMENTS_KEY) ?? [];
    const created: Appointment = {
      id: `a${Date.now()}`,
      ...payload,
      status: "Pending",
    };

    writeStorage(APPOINTMENTS_KEY, [created, ...appointments]);
    return created;
  },

  async getProfile(userId: string): Promise<UserProfile> {
    await seedDataIfNeeded();
    await delay(180);

    const users = readStorage<UserRecord[]>(USERS_KEY) ?? [];
    const matched = users.find((u) => u.id === userId);

    if (!matched) {
      throw new Error("Profile not found");
    }

    return stripUserSecrets(matched);
  },

  async updateProfile(
    userId: string,
    updates: Partial<Omit<UserProfile, "id" | "username">>,
  ): Promise<UserProfile> {
    await seedDataIfNeeded();
    await delay(240);

    const users = readStorage<UserRecord[]>(USERS_KEY) ?? [];
    const index = users.findIndex((u) => u.id === userId);

    if (index === -1) {
      throw new Error("Profile not found");
    }

    users[index] = {
      ...users[index],
      ...updates,
    };

    writeStorage(USERS_KEY, users);
    return stripUserSecrets(users[index]);
  },

  async getHealthRecords(userId: string): Promise<PrescriptionRecord[]> {
    await seedDataIfNeeded();
    await delay(180);
    const prescriptions =
      readStorage<PrescriptionRecord[]>(PRESCRIPTIONS_KEY) ?? [];
    return prescriptions.filter((item) => item.userId === userId);
  },

  async getOrders(userId: string): Promise<MedicineOrder[]> {
    await seedDataIfNeeded();
    await delay(180);
    const orders = readStorage<MedicineOrder[]>(ORDERS_KEY) ?? [];
    return orders.filter((item) => item.userId === userId);
  },

  async placeOrder(
    payload: Omit<MedicineOrder, "id" | "status" | "placedAt" | "eta">,
  ): Promise<MedicineOrder> {
    await seedDataIfNeeded();
    await delay(240);

    const orders = readStorage<MedicineOrder[]>(ORDERS_KEY) ?? [];
    const created: MedicineOrder = {
      id: `ord${Date.now()}`,
      ...payload,
      status: "Order Placed",
      placedAt: new Date().toISOString(),
      eta: "Tomorrow, 7:00 PM",
    };

    writeStorage(ORDERS_KEY, [created, ...orders]);
    return created;
  },
};
