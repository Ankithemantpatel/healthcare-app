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

export interface SharedUiCopy {
  navigation: {
    brand: string;
    brandAriaLabel: string;
    primaryAriaLabel: string;
    routes: Record<string, string>;
    logout: string;
  };
  session: {
    restoring: string;
  };
  auth: {
    heroEyebrow: string;
    heroTitle: string;
    heroDescription: string;
    welcomeBack: string;
    demoBanner: string;
    tabs: Record<string, string>;
    roles: Record<string, string>;
    labels: Record<string, string>;
    placeholders: Record<string, string>;
    serviceOptions: Record<string, string[]>;
    highlights: string[];
    buttons: Record<string, string>;
    hints: Record<string, string>;
    demoAccounts: {
      admin: { username: string; password: string };
      patient: { username: string; password: string };
    };
  };
  doctors: {
    eyebrow: string;
    title: string;
    description: string;
    loading: string;
    fields: Record<string, string>;
    bookButton: string;
  };
  appointments: {
    eyebrow: string;
    title: string;
    description: string;
    labels: Record<string, string>;
    placeholders: Record<string, string>;
    types: string[];
    errors: Record<string, string>;
    buttons: Record<string, string>;
    modal: Record<string, string>;
  };
  checkout: {
    title: string;
    description: string;
    backToMedicines: string;
    cartItems: string;
    clearCart: string;
    emptyCart: string;
    remove: string;
    orderSummary: string;
    subtotal: string;
    delivery: string;
    freeDelivery: string;
    total: string;
    placeOrderLoading: string;
    loginToPlaceOrder: string;
    placeOrder: string;
  };
  healthRecords: {
    eyebrow: string;
    title: string;
    description: string;
    unauthenticatedMessage: string;
    loading: string;
    empty: string;
    downloadAll: string;
    downloadOne: string;
    prescribedMedicines: string;
    doctorNotes: string;
    consultantLabel: string;
    exportFailureTitle: string;
    exportSingleFailurePrefix: string;
    exportAllFailurePrefix: string;
    shareMessage: string;
    shareTitle: string;
    document: Record<string, string>;
  };
  orders: {
    eyebrow: string;
    title: string;
    description: string;
    loading: string;
    empty: string;
    unauthenticatedMessage: string;
    orderPrefix: string;
    placedLabel: string;
    etaLabel: string;
    itemsLabel: string;
    summaryLabel: string;
    totalLabel: string;
  };
  profile: {
    eyebrow: string;
    title: string;
    description: string;
    unauthenticatedMessage: string;
    labels: Record<string, string>;
    placeholders: Record<string, string>;
    buttons: Record<string, string>;
    messages: Record<string, string>;
  };
  feedback: {
    errors: Record<string, Record<string, string>>;
  };
}

export declare const seedUsers: UserRecord[];
export declare const seedDoctors: Doctor[];
export declare const seedAppointments: Appointment[];
export declare const seedPrescriptions: PrescriptionRecord[];
export declare const seedOrders: MedicineOrder[];
export declare const sharedUiCopy: SharedUiCopy;
export declare const generateMedicinesCatalog: () => Medicine[];
export declare const getMedicineCategories: (medicines: Medicine[]) => string[];
export declare const filterMedicinesCatalog: (
  medicines: Medicine[],
  searchQuery: string,
  activeCategory: string,
  sortBy: MedicineSortOption,
) => Medicine[];
