import type {
  Appointment,
  Doctor,
  Medicine,
  MedicineOrder,
  PrescriptionRecord,
  RegisterPayload,
  UserProfile,
} from "shared";

export interface ApiClientOptions {
  baseUrl: string;
  getToken: () => string | null | Promise<string | null>;
  setToken: (token: string) => void | Promise<void>;
  clearToken: () => void | Promise<void>;
}

export interface ApiClient {
  initialize(): Promise<void>;
  login(
    username: string,
    password: string,
  ): Promise<{ token: string; user: UserProfile }>;
  register(
    payload: RegisterPayload,
  ): Promise<{ token: string; user: UserProfile }>;
  logout(): Promise<void>;
  getSession(): Promise<{ token: string; user: UserProfile } | null>;
  getDoctors(): Promise<Doctor[]>;
  getMedicines(): Promise<Medicine[]>;
  getAppointments(userId: string): Promise<Appointment[]>;
  createAppointment(
    payload: Omit<Appointment, "id" | "status">,
  ): Promise<Appointment>;
  getProfile(userId: string): Promise<UserProfile>;
  updateProfile(
    userId: string,
    updates: Partial<Omit<UserProfile, "id" | "username">>,
  ): Promise<UserProfile>;
  getHealthRecords(userId: string): Promise<PrescriptionRecord[]>;
  getOrders(userId: string): Promise<MedicineOrder[]>;
  placeOrder(
    payload: Omit<MedicineOrder, "id" | "status" | "placedAt" | "eta">,
  ): Promise<MedicineOrder>;
}

export declare const createApiClient: (options: ApiClientOptions) => ApiClient;
