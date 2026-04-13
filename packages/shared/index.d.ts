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

export type AppointmentStatus =
  | "Confirmed"
  | "Pending"
  | "Completed"
  | "Cancelled";

export interface Appointment {
  id: string;
  userId: string;
  doctor: string;
  date: string;
  time: string;
  type: string;
  reason: string;
  status: AppointmentStatus;
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

export type OrderStatus =
  | "Order Placed"
  | "Confirmed"
  | "Packed"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export interface MedicineOrder {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  placedAt: string;
  eta: string;
}

export type MedicineSortOption = "popular" | "priceAsc" | "priceDesc";

export declare const seedUsers: UserRecord[];
export declare const seedDoctors: Doctor[];
export declare const seedAppointments: Appointment[];
export declare const seedPrescriptions: PrescriptionRecord[];
export declare const seedOrders: MedicineOrder[];
export declare const generateMedicinesCatalog: () => Medicine[];
export declare const getMedicineCategories: (medicines: Medicine[]) => string[];
export declare const filterMedicinesCatalog: (
  medicines: Medicine[],
  searchQuery: string,
  activeCategory: string,
  sortBy: MedicineSortOption,
) => Medicine[];
