import type {
  Action,
  AnyAction,
  PreloadedState,
  Reducer,
  ThunkDispatch,
} from "@reduxjs/toolkit";
import type { Store } from "redux";
import type {
  Appointment,
  CartItem,
  Doctor,
  Medicine,
  MedicineOrder,
  PrescriptionRecord,
  RegisterPayload,
  UserProfile,
} from "..";

export type AsyncStatus = "idle" | "loading" | "succeeded" | "failed";

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  status: AsyncStatus;
  error: string | null;
}

export interface DoctorsState {
  items: Doctor[];
  status: AsyncStatus;
  error: string | null;
}

export interface AppointmentsState {
  items: Appointment[];
  status: AsyncStatus;
  createStatus: AsyncStatus;
  error: string | null;
}

export interface ProfileState {
  data: UserProfile | null;
  status: AsyncStatus;
  saveStatus: AsyncStatus;
  error: string | null;
}

export interface MedicinesState {
  catalog: Medicine[];
  cart: CartItem[];
  status: AsyncStatus;
  error: string | null;
}

export interface HealthRecordsState {
  items: PrescriptionRecord[];
  status: AsyncStatus;
  error: string | null;
}

export interface OrdersState {
  items: MedicineOrder[];
  status: AsyncStatus;
  placeStatus: AsyncStatus;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  doctors: DoctorsState;
  appointments: AppointmentsState;
  profile: ProfileState;
  medicines: MedicinesState;
  healthRecords: HealthRecordsState;
  orders: OrdersState;
}

export interface SharedApi {
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

export interface AppStore extends Store<RootState, AnyAction> {
  dispatch: ThunkDispatch<RootState, { api: SharedApi }, AnyAction>;
}

export interface CreateAppStoreOptions {
  api: SharedApi;
  preloadedState?: PreloadedState<Partial<RootState>>;
}

export declare const createAppStore: (
  options: CreateAppStoreOptions,
) => AppStore;

export declare const authReducer: Reducer<AuthState>;
export declare const doctorsReducer: Reducer<DoctorsState>;
export declare const appointmentsReducer: Reducer<AppointmentsState>;
export declare const profileReducer: Reducer<ProfileState>;
export declare const medicinesReducer: Reducer<MedicinesState>;
export declare const healthRecordsReducer: Reducer<HealthRecordsState>;
export declare const ordersReducer: Reducer<OrdersState>;

export declare const reducer: {
  auth: Reducer<AuthState>;
  doctors: Reducer<DoctorsState>;
  appointments: Reducer<AppointmentsState>;
  profile: Reducer<ProfileState>;
  medicines: Reducer<MedicinesState>;
  healthRecords: Reducer<HealthRecordsState>;
  orders: Reducer<OrdersState>;
};

export declare const initializeAuth: any;
export declare const loginUser: any;
export declare const registerUser: any;
export declare const logoutUser: any;
export declare const fetchDoctors: any;
export declare const fetchAppointments: any;
export declare const createAppointment: any;
export declare const fetchProfile: any;
export declare const saveProfile: any;
export declare const fetchMedicines: any;
export declare const addToCart: (payload: Medicine) => any;
export declare const decrementCartItem: (payload: string) => any;
export declare const removeFromCart: (payload: string) => any;
export declare const clearCart: () => any;
export declare const fetchHealthRecords: any;
export declare const fetchOrders: any;
export declare const placeOrder: any;
