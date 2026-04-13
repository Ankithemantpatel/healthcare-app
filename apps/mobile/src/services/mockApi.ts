import {
  generateMedicinesCatalog,
  seedAppointments,
  seedDoctors,
  seedOrders,
  seedPrescriptions,
  seedUsers,
} from "shared";
import type {
  Appointment,
  Doctor,
  MedicineOrder,
  Medicine,
  PrescriptionRecord,
  RegisterPayload,
  UserProfile,
  UserRecord,
} from "shared";

interface AuthSession {
  userId: string;
  token: string;
}

let users: UserRecord[] = seedUsers.map((user) => ({ ...user }));
let doctors: Doctor[] = seedDoctors.map((doctor) => ({ ...doctor }));
let appointments: Appointment[] = seedAppointments.map((appointment) => ({
  ...appointment,
}));
let medicines: Medicine[] = generateMedicinesCatalog();
let prescriptions: PrescriptionRecord[] = seedPrescriptions.map((item) => ({
  ...item,
}));
let orders: MedicineOrder[] = seedOrders.map((item) => ({ ...item }));
let session: AuthSession | null = null;

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

const stripUserSecrets = (user: UserRecord): UserProfile => ({
  id: user.id,
  username: user.username,
  name: user.name,
  email: user.email,
  phone: user.phone,
  address: user.address,
  condition: user.condition,
});

export const mockApi = {
  async initialize(): Promise<void> {
    await delay(80);
  },

  async login(
    username: string,
    password: string,
  ): Promise<{ token: string; user: UserProfile }> {
    await delay();
    const matched = users.find(
      (user) => user.username === username && user.password === password,
    );

    if (!matched) {
      throw new Error("Invalid username or password");
    }

    const token = `mobile-mock-token-${matched.id}`;
    session = { userId: matched.id, token };
    return { token, user: stripUserSecrets(matched) };
  },

  async register(
    payload: RegisterPayload,
  ): Promise<{ token: string; user: UserProfile }> {
    await delay();
    const exists = users.some(
      (user) => user.username.toLowerCase() === payload.username.toLowerCase(),
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

    users = [created, ...users];
    const token = `mobile-mock-token-${created.id}`;
    session = { userId: created.id, token };
    return { token, user: stripUserSecrets(created) };
  },

  async logout(): Promise<void> {
    await delay(100);
    session = null;
  },

  async getSession(): Promise<{ token: string; user: UserProfile } | null> {
    await delay(100);

    if (!session) {
      return null;
    }

    const matched = users.find((user) => user.id === session?.userId);
    if (!matched) {
      session = null;
      return null;
    }

    return { token: session.token, user: stripUserSecrets(matched) };
  },

  async getDoctors(): Promise<Doctor[]> {
    await delay(180);
    return doctors;
  },

  async getMedicines(): Promise<Medicine[]> {
    await delay(180);
    return medicines;
  },

  async getAppointments(userId: string): Promise<Appointment[]> {
    await delay(180);
    return appointments.filter((appointment) => appointment.userId === userId);
  },

  async createAppointment(
    payload: Omit<Appointment, "id" | "status">,
  ): Promise<Appointment> {
    await delay(220);
    const created: Appointment = {
      id: `a${Date.now()}`,
      ...payload,
      status: "Pending",
    };
    appointments = [created, ...appointments];
    return created;
  },

  async getProfile(userId: string): Promise<UserProfile> {
    await delay(180);
    const matched = users.find((user) => user.id === userId);

    if (!matched) {
      throw new Error("Profile not found");
    }

    return stripUserSecrets(matched);
  },

  async updateProfile(
    userId: string,
    updates: Partial<Omit<UserProfile, "id" | "username">>,
  ): Promise<UserProfile> {
    await delay(220);
    const index = users.findIndex((user) => user.id === userId);

    if (index === -1) {
      throw new Error("Profile not found");
    }

    users[index] = {
      ...users[index],
      ...updates,
    };

    return stripUserSecrets(users[index]);
  },

  async getHealthRecords(userId: string): Promise<PrescriptionRecord[]> {
    await delay(160);
    return prescriptions.filter((item) => item.userId === userId);
  },

  async getOrders(userId: string): Promise<MedicineOrder[]> {
    await delay(180);
    return orders.filter((item) => item.userId === userId);
  },

  async placeOrder(
    payload: Omit<MedicineOrder, "id" | "status" | "placedAt" | "eta">,
  ): Promise<MedicineOrder> {
    await delay(240);
    const created: MedicineOrder = {
      id: `ord${Date.now()}`,
      ...payload,
      status: "Order Placed",
      placedAt: new Date().toISOString(),
      eta: "Tomorrow, 7:00 PM",
    };
    orders = [created, ...orders];
    return created;
  },
};
