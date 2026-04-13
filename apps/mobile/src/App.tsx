import React from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Provider } from "react-redux";
import {
  filterMedicinesCatalog,
  getMedicineCategories,
  type MedicineSortOption,
} from "shared";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import {
  initializeAuth,
  loginUser,
  logoutUser,
  registerUser,
} from "./redux/authSlice";
import { fetchDoctors } from "./redux/doctorsSlice";
import {
  createAppointment,
  fetchAppointments,
} from "./redux/appointmentsSlice";
import {
  addToCart,
  clearCart,
  decrementCartItem,
  fetchMedicines,
  removeFromCart,
} from "./redux/medicinesSlice";
import { fetchProfile, saveProfile } from "./redux/profileSlice";
import { fetchHealthRecords } from "./redux/healthRecordsSlice";
import { fetchOrders } from "./redux/ordersSlice";
import store from "./redux/store";
import type { Doctor, Medicine, UserProfile } from "shared";
import {
  AppointmentsScreenView,
  CheckoutScreenView,
  DashboardScreenView,
  DoctorsScreenView,
  LoginScreenView,
  MedicinesScreenView,
  OrdersScreenView,
  ProfileScreenView,
  HealthRecordsScreenView,
} from "./screens";

type RouteKey =
  | "login"
  | "dashboard"
  | "doctors"
  | "appointments"
  | "medicines"
  | "checkout"
  | "profile"
  | "healthRecords"
  | "orders";

const routes: Array<{ key: RouteKey; label: string; protected?: boolean }> = [
  { key: "login", label: "Home" },
  { key: "dashboard", label: "Dashboard", protected: true },
  { key: "doctors", label: "Doctors" },
  { key: "appointments", label: "Appointments" },
  { key: "medicines", label: "Medicines" },
  { key: "healthRecords", label: "Health Records", protected: true },
  { key: "orders", label: "Orders", protected: true },
  { key: "profile", label: "Profile", protected: true },
];

const AppShell = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const doctors = useAppSelector((state) => state.doctors.items);
  const doctorsStatus = useAppSelector((state) => state.doctors.status);
  const appointments = useAppSelector((state) => state.appointments.items);
  const appointmentsStatus = useAppSelector(
    (state) => state.appointments.status,
  );
  const createAppointmentStatus = useAppSelector(
    (state) => state.appointments.createStatus,
  );
  const medicines = useAppSelector((state) => state.medicines.catalog);
  const medicinesStatus = useAppSelector((state) => state.medicines.status);
  const cart = useAppSelector((state) => state.medicines.cart);
  const profile = useAppSelector((state) => state.profile.data);
  const profileStatus = useAppSelector((state) => state.profile.status);
  const profileSaveStatus = useAppSelector((state) => state.profile.saveStatus);
  const healthRecords = useAppSelector((state) => state.healthRecords.items);
  const healthRecordsStatus = useAppSelector(
    (state) => state.healthRecords.status,
  );
  const orders = useAppSelector((state) => state.orders.items);
  const ordersStatus = useAppSelector((state) => state.orders.status);

  const [route, setRoute] = React.useState<RouteKey>("login");
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [prefilledDoctor, setPrefilledDoctor] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState("All");
  const [sortBy, setSortBy] = React.useState<MedicineSortOption>("popular");

  React.useEffect(() => {
    dispatch(initializeAuth());
    dispatch(fetchDoctors());
    dispatch(fetchMedicines());
  }, [dispatch]);

  React.useEffect(() => {
    if (auth.user?.id) {
      dispatch(fetchAppointments(auth.user.id));
      dispatch(fetchProfile(auth.user.id));
      dispatch(fetchHealthRecords(auth.user.id));
      dispatch(fetchOrders(auth.user.id));
      if (route === "login") {
        setRoute("dashboard");
      }
    }
  }, [auth.user?.id, dispatch, route]);

  const navRoutes = React.useMemo(
    () =>
      auth.isAuthenticated
        ? routes
            .filter((item) => item.key !== "login")
            .map((item) =>
              item.key === "dashboard" ? { ...item, label: "Home" } : item,
            )
        : routes.filter((item) => !item.protected),
    [auth.isAuthenticated],
  );

  const navigate = React.useCallback(
    (nextRoute: RouteKey) => {
      setMenuOpen(false);
      if (nextRoute === "login" && auth.isAuthenticated) {
        setRoute("dashboard");
        return;
      }
      const routeMeta = routes.find((candidate) => candidate.key === nextRoute);
      if (routeMeta?.protected && !auth.isAuthenticated) {
        setRoute("login");
        return;
      }
      setRoute(nextRoute);
    },
    [auth.isAuthenticated],
  );

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartAmount = cart.reduce(
    (sum, item) => sum + item.quantity * item.medicine.price,
    0,
  );
  const categories = React.useMemo(
    () => getMedicineCategories(medicines),
    [medicines],
  );
  const filteredMedicines = React.useMemo(
    () =>
      filterMedicinesCatalog(medicines, searchQuery, activeCategory, sortBy),
    [activeCategory, medicines, searchQuery, sortBy],
  );
  const cartQuantityById = React.useMemo(
    () =>
      Object.fromEntries(cart.map((item) => [item.medicine.id, item.quantity])),
    [cart],
  );

  const handleDoctorBooking = (doctorName: string) => {
    setPrefilledDoctor(doctorName);
    navigate("appointments");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.appShell}>
        <View style={styles.brandRow}>
          <View style={styles.brandLeft}>
            <Pressable
              onPress={() => setMenuOpen(true)}
              style={styles.menuButton}
            >
              <Text style={styles.menuButtonText}>☰</Text>
            </Pressable>
            <View>
              <Text style={styles.brandEyebrow}>CareBridge 24x7</Text>
              <Text style={styles.brandTitle}>Mobile Health Hub</Text>
            </View>
          </View>
        </View>

        {menuOpen ? (
          <>
            <Pressable
              onPress={() => setMenuOpen(false)}
              style={styles.drawerBackdrop}
            />
            <View style={styles.drawerPanel}>
              <Text style={styles.drawerTitle}>Navigation</Text>
              {navRoutes.map((item) => (
                <Pressable
                  key={item.key}
                  onPress={() => navigate(item.key)}
                  style={[
                    styles.drawerNavItem,
                    route === item.key && styles.drawerNavItemActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.drawerNavText,
                      route === item.key && styles.drawerNavTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              ))}
              {auth.isAuthenticated ? (
                <>
                  <View style={styles.drawerDivider} />
                  <Pressable
                    onPress={() => {
                      dispatch(logoutUser());
                      setRoute("login");
                      setMenuOpen(false);
                    }}
                    style={styles.drawerLogoutItem}
                  >
                    <Text style={styles.drawerLogoutText}>Logout</Text>
                  </Pressable>
                </>
              ) : null}
            </View>
          </>
        ) : null}

        {route === "login" && (
          <LoginScreenView
            authStatus={auth.status}
            authError={auth.error}
            onLoggedIn={() => navigate("dashboard")}
            styles={styles}
          />
        )}
        {route === "dashboard" && (
          <DashboardScreenView
            userName={auth.user?.name ?? "Guest"}
            doctorCount={doctors.length}
            appointmentsCount={appointments.length}
            pendingCount={
              appointments.filter((item) => item.status === "Pending").length
            }
            nextAppointment={appointments[0] ?? null}
            onOpenDoctors={() => navigate("doctors")}
            onOpenAppointments={() => navigate("appointments")}
            onOpenMedicines={() => navigate("medicines")}
            onOpenProfile={() => navigate("profile")}
            styles={styles}
          />
        )}
        {route === "doctors" && (
          <DoctorsScreenView
            doctors={doctors}
            status={doctorsStatus}
            onBook={handleDoctorBooking}
            styles={styles}
          />
        )}
        {route === "appointments" && (
          <AppointmentsScreenView
            doctors={doctors}
            userId={auth.user?.id ?? null}
            appointments={appointments}
            createStatus={createAppointmentStatus}
            prefilledDoctor={prefilledDoctor}
            onRequireAuth={() => navigate("login")}
            styles={styles}
          />
        )}
        {route === "medicines" && (
          <MedicinesScreenView
            medicines={filteredMedicines}
            allMedicines={medicines}
            status={medicinesStatus}
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            cartQuantityById={cartQuantityById}
            totalCartItems={totalCartItems}
            totalCartAmount={totalCartAmount}
            onCheckout={() => navigate("checkout")}
            styles={styles}
          />
        )}
        {route === "checkout" && (
          <CheckoutScreenView
            userId={auth.user?.id ?? null}
            cart={cart}
            totalItems={totalCartItems}
            totalAmount={totalCartAmount}
            onBack={() => navigate("medicines")}
            onOrderPlaced={() => navigate("orders")}
            styles={styles}
          />
        )}
        {route === "healthRecords" && (
          <HealthRecordsScreenView
            records={healthRecords}
            status={healthRecordsStatus}
            styles={styles}
          />
        )}
        {route === "orders" && (
          <OrdersScreenView
            orders={orders}
            status={ordersStatus}
            styles={styles}
          />
        )}
        {route === "profile" && (
          <ProfileScreenView
            user={auth.user}
            profile={profile}
            status={profileStatus}
            saveStatus={profileSaveStatus}
            styles={styles}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const LoginScreen = ({
  authStatus,
  authError,
  onLoggedIn,
}: {
  authStatus: string;
  authError: string | null;
  onLoggedIn: () => void;
}) => {
  const dispatch = useAppDispatch();
  const [mode, setMode] = React.useState<"login" | "register">("login");
  const [username, setUsername] = React.useState("admin");
  const [password, setPassword] = React.useState("admin123");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");

  const handleSubmit = async () => {
    try {
      if (mode === "login") {
        await dispatch(loginUser({ username, password })).unwrap();
      } else {
        await dispatch(
          registerUser({ username, password, name, email, phone, address }),
        ).unwrap();
      }
      onLoggedIn();
    } catch {
      // slice already stores error
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.screenContent}
    >
      <View style={styles.heroCard}>
        <Text style={styles.heroEyebrow}>Unified care, wherever you are</Text>
        <Text style={styles.heroTitle}>
          CareBridge mobile carries the full web experience.
        </Text>
        <Text style={styles.heroCopy}>
          Sign in to book visits, browse doctors, manage your medicines, and
          keep your profile synced.
        </Text>
      </View>

      <View style={styles.panel}>
        <View style={styles.segmentRow}>
          <Pressable
            onPress={() => setMode("login")}
            style={[
              styles.segmentButton,
              mode === "login" && styles.segmentButtonActive,
            ]}
          >
            <Text
              style={[
                styles.segmentButtonText,
                mode === "login" && styles.segmentButtonTextActive,
              ]}
            >
              Login
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setMode("register")}
            style={[
              styles.segmentButton,
              mode === "register" && styles.segmentButtonActive,
            ]}
          >
            <Text
              style={[
                styles.segmentButtonText,
                mode === "register" && styles.segmentButtonTextActive,
              ]}
            >
              Register
            </Text>
          </Pressable>
        </View>

        <InputField
          label="Username"
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
        />
        <InputField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
        />

        {mode === "register" ? (
          <>
            <InputField
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="Full name"
            />
            <InputField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
            />
            <InputField
              label="Phone"
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone"
            />
            <InputField
              label="Address"
              value={address}
              onChangeText={setAddress}
              placeholder="Street, city, state"
              multiline
            />
          </>
        ) : null}

        {authError ? <Text style={styles.errorText}>{authError}</Text> : null}

        <PrimaryButton
          label={
            authStatus === "loading"
              ? "Please wait..."
              : mode === "login"
                ? "Login"
                : "Create Account"
          }
          onPress={handleSubmit}
        />

        <View style={styles.quickAccessRow}>
          <Pressable
            onPress={() => {
              setMode("login");
              setUsername("admin");
              setPassword("admin123");
            }}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>Use admin demo</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setMode("login");
              setUsername("patient1");
              setPassword("patient123");
            }}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>Use patient demo</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

const DashboardScreen = ({
  userName,
  doctorCount,
  appointmentsCount,
  pendingCount,
  nextAppointment,
  onOpenDoctors,
  onOpenAppointments,
  onOpenMedicines,
  onOpenProfile,
}: {
  userName: string;
  doctorCount: number;
  appointmentsCount: number;
  pendingCount: number;
  nextAppointment: {
    doctor: string;
    date: string;
    time: string;
    type: string;
  } | null;
  onOpenDoctors: () => void;
  onOpenAppointments: () => void;
  onOpenMedicines: () => void;
  onOpenProfile: () => void;
}) => (
  <ScrollView
    style={styles.screen}
    contentContainerStyle={styles.screenContent}
  >
    <View style={styles.heroCard}>
      <Text style={styles.heroEyebrow}>Dashboard</Text>
      <Text style={styles.heroTitle}>Welcome back, {userName}</Text>
      <Text style={styles.heroCopy}>
        Track appointments, specialists, and your current care activity in one
        place.
      </Text>
    </View>

    <View style={styles.statsGrid}>
      <StatCard
        label="Specialists"
        value={`${doctorCount}`}
        caption="Available now"
      />
      <StatCard
        label="Appointments"
        value={`${appointmentsCount}`}
        caption={`${pendingCount} pending`}
      />
    </View>

    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>Services</Text>
      <Text style={styles.sectionCopy}>
        Quick shortcuts to core services available in the app.
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.serviceCarousel}
      >
        <Pressable
          style={[styles.serviceCard, styles.serviceCardDoctors]}
          onPress={onOpenDoctors}
        >
          <Text style={styles.serviceTitle}>Find Doctors</Text>
          <Text style={styles.serviceCopy}>
            Browse specialists and availability.
          </Text>
        </Pressable>
        <Pressable
          style={[styles.serviceCard, styles.serviceCardAppointments]}
          onPress={onOpenAppointments}
        >
          <Text style={styles.serviceTitle}>Book Visits</Text>
          <Text style={styles.serviceCopy}>
            Schedule consultations and follow-ups.
          </Text>
        </Pressable>
        <Pressable
          style={[styles.serviceCard, styles.serviceCardMedicines]}
          onPress={onOpenMedicines}
        >
          <Text style={styles.serviceTitle}>Order Medicines</Text>
          <Text style={styles.serviceCopy}>
            Search catalog and checkout quickly.
          </Text>
        </Pressable>
        <Pressable
          style={[styles.serviceCard, styles.serviceCardProfile]}
          onPress={onOpenProfile}
        >
          <Text style={styles.serviceTitle}>Profile</Text>
          <Text style={styles.serviceCopy}>
            Keep contact details and address updated.
          </Text>
        </Pressable>
      </ScrollView>
    </View>

    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>Next visit</Text>
      {nextAppointment ? (
        <>
          <Text style={styles.sectionHeadline}>{nextAppointment.doctor}</Text>
          <Text style={styles.sectionCopy}>
            {nextAppointment.type} on {nextAppointment.date} at{" "}
            {nextAppointment.time}
          </Text>
        </>
      ) : (
        <Text style={styles.sectionCopy}>No upcoming appointment yet.</Text>
      )}
    </View>
  </ScrollView>
);

const DoctorsScreen = ({
  doctors,
  status,
  onBook,
}: {
  doctors: Doctor[];
  status: string;
  onBook: (doctorName: string) => void;
}) => (
  <ScrollView
    style={styles.screen}
    contentContainerStyle={styles.screenContent}
  >
    <View style={styles.panelHeader}>
      <Text style={styles.sectionTitle}>Doctors</Text>
      <Text style={styles.sectionCopy}>
        Browse the same specialist directory available on the web app.
      </Text>
    </View>
    {status === "loading" ? <ActivityIndicator color="#67e8f9" /> : null}
    {doctors.map((doctor) => (
      <View key={doctor.id} style={styles.doctorCard}>
        <Image source={{ uri: doctor.image }} style={styles.doctorAvatar} />
        <View style={styles.doctorBody}>
          <Text style={styles.doctorName}>{doctor.name}</Text>
          <Text style={styles.doctorMeta}>
            {doctor.specialty} • {doctor.hospital}
          </Text>
          <Text style={styles.doctorMeta}>
            Fee ${doctor.consultationFee} • {doctor.experienceYears} yrs •{" "}
            {doctor.rating}/5
          </Text>
          <Text style={styles.doctorMeta}>
            Availability: {doctor.availability}
          </Text>
          <PrimaryButton
            label="Book Appointment"
            onPress={() => onBook(doctor.name)}
            compact
          />
        </View>
      </View>
    ))}
  </ScrollView>
);

const AppointmentsScreen = ({
  doctors,
  userId,
  appointments,
  createStatus,
  prefilledDoctor,
  onRequireAuth,
}: {
  doctors: Doctor[];
  userId: string | null;
  appointments: Array<{
    id: string;
    doctor: string;
    date: string;
    time: string;
    type: string;
    reason: string;
    status: string;
  }>;
  createStatus: string;
  prefilledDoctor: string;
  onRequireAuth: () => void;
}) => {
  const dispatch = useAppDispatch();
  const [doctor, setDoctor] = React.useState(prefilledDoctor);
  const [type, setType] = React.useState("Consultation");
  const [date, setDate] = React.useState("2026-04-25");
  const [time, setTime] = React.useState("11:00");
  const [reason, setReason] = React.useState("");

  React.useEffect(() => {
    if (prefilledDoctor) {
      setDoctor(prefilledDoctor);
    }
  }, [prefilledDoctor]);

  const handleSubmit = async () => {
    if (!userId) {
      Alert.alert(
        "Login required",
        "Please login to confirm your appointment.",
      );
      onRequireAuth();
      return;
    }
    if (!(doctor && date && time && reason)) {
      Alert.alert("Missing details", "Complete all appointment details first.");
      return;
    }

    await dispatch(
      createAppointment({ userId, doctor, date, time, type, reason }),
    ).unwrap();
    setReason("");
    Alert.alert(
      "Appointment created",
      "Your appointment request has been saved.",
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.screenContent}
    >
      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>Book appointment</Text>
        <Text style={styles.sectionCopy}>
          You can browse as guest, but login is required to confirm the booking.
        </Text>

        <Text style={styles.fieldLabel}>Select doctor</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillRow}
        >
          {doctors.map((item) => (
            <Pill
              key={item.id}
              label={item.name}
              active={doctor === item.name}
              onPress={() => setDoctor(item.name)}
            />
          ))}
        </ScrollView>

        <Text style={styles.fieldLabel}>Appointment type</Text>
        <View style={styles.inlineRow}>
          {["Consultation", "Follow-up", "Routine Check"].map((item) => (
            <Pill
              key={item}
              label={item}
              active={type === item}
              onPress={() => setType(item)}
            />
          ))}
        </View>

        <InputField
          label="Date"
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
        />
        <InputField
          label="Time"
          value={time}
          onChangeText={setTime}
          placeholder="HH:MM"
        />
        <InputField
          label="Reason"
          value={reason}
          onChangeText={setReason}
          placeholder="Describe symptoms or consultation purpose"
          multiline
        />

        <PrimaryButton
          label={
            createStatus === "loading"
              ? "Submitting..."
              : userId
                ? "Confirm Appointment"
                : "Login to Confirm"
          }
          onPress={handleSubmit}
        />
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>My appointments</Text>
        {appointments.length === 0 ? (
          <Text style={styles.sectionCopy}>No appointments yet.</Text>
        ) : (
          appointments.map((appointment) => (
            <View key={appointment.id} style={styles.appointmentCard}>
              <Text style={styles.sectionHeadline}>{appointment.doctor}</Text>
              <Text style={styles.sectionCopy}>
                {appointment.type} on {appointment.date} at {appointment.time}
              </Text>
              <Text style={styles.sectionCopy}>
                Reason: {appointment.reason}
              </Text>
              <Text style={styles.statusBadge}>{appointment.status}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const MedicinesScreen = ({
  medicines,
  allMedicines,
  status,
  categories,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  cartQuantityById,
  totalCartItems,
  totalCartAmount,
  onCheckout,
}: {
  medicines: Medicine[];
  allMedicines: Medicine[];
  status: string;
  categories: string[];
  activeCategory: string;
  setActiveCategory: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  sortBy: MedicineSortOption;
  setSortBy: (value: MedicineSortOption) => void;
  cartQuantityById: Record<string, number>;
  totalCartItems: number;
  totalCartAmount: number;
  onCheckout: () => void;
}) => {
  const dispatch = useAppDispatch();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.screenContent}
    >
      <View style={styles.heroCard}>
        <Text style={styles.heroEyebrow}>Online Pharmacy</Text>
        <Text style={styles.heroTitle}>Medicines & Essentials</Text>
        <Text style={styles.heroCopy}>
          Search, filter, and order the same 200-item catalog available on web.
        </Text>
      </View>

      <View style={styles.cartSummaryCard}>
        <View>
          <Text style={styles.cartSummaryTitle}>Cart</Text>
          <Text style={styles.cartSummaryCopy}>
            {totalCartItems} items • ${totalCartAmount.toFixed(2)}
          </Text>
        </View>
        <PrimaryButton label="Checkout" onPress={onCheckout} compact />
      </View>

      <View style={styles.panel}>
        <Text style={styles.fieldLabel}>Search medicines</Text>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Try Paracetamol, Azee, Fever..."
          placeholderTextColor="#64748b"
          style={styles.searchInput}
        />

        <Text style={styles.fieldLabel}>Sort by</Text>
        <View style={styles.inlineRow}>
          <Pill
            label="Relevant"
            active={sortBy === "popular"}
            onPress={() => setSortBy("popular")}
          />
          <Pill
            label="Low to High"
            active={sortBy === "priceAsc"}
            onPress={() => setSortBy("priceAsc")}
          />
          <Pill
            label="High to Low"
            active={sortBy === "priceDesc"}
            onPress={() => setSortBy("priceDesc")}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillRow}
        >
          {categories.map((category) => (
            <Pill
              key={category}
              label={category}
              active={activeCategory === category}
              onPress={() => setActiveCategory(category)}
            />
          ))}
        </ScrollView>
      </View>

      <Text style={styles.resultsText}>
        Showing {medicines.length} of {allMedicines.length} medicines
      </Text>
      {status === "loading" ? <ActivityIndicator color="#67e8f9" /> : null}
      {medicines.map((medicine) => {
        const quantity = cartQuantityById[medicine.id] ?? 0;
        return (
          <View key={medicine.id} style={styles.medicineCard}>
            <Image
              source={{ uri: medicine.image }}
              style={styles.medicineImage}
            />
            <View style={styles.medicineBody}>
              <View style={styles.rowBetween}>
                <Text style={styles.medicineName}>{medicine.name}</Text>
                <Text style={styles.medicinePrice}>
                  ${medicine.price.toFixed(2)}
                </Text>
              </View>
              <Text style={styles.medicineMeta}>
                {medicine.brand} • {medicine.category}
              </Text>
              <View style={styles.rowBetween}>
                <Text style={styles.medicineMeta}>{medicine.packSize}</Text>
                <View
                  style={[
                    styles.badge,
                    medicine.requiresPrescription
                      ? styles.badgeWarning
                      : styles.badgeSuccess,
                  ]}
                >
                  <Text style={styles.badgeText}>
                    {medicine.requiresPrescription ? "Rx Required" : "OTC"}
                  </Text>
                </View>
              </View>

              {quantity === 0 ? (
                <PrimaryButton
                  label="Add to Cart"
                  onPress={() => dispatch(addToCart(medicine))}
                />
              ) : (
                <View style={styles.stepperWrap}>
                  <Pressable
                    onPress={() => dispatch(decrementCartItem(medicine.id))}
                    style={[styles.stepperButton, styles.stepperButtonDark]}
                  >
                    <Text style={styles.stepperSymbol}>-</Text>
                  </Pressable>
                  <View style={styles.stepperCountWrap}>
                    <Text style={styles.stepperCount}>{quantity}</Text>
                  </View>
                  <Pressable
                    onPress={() => dispatch(addToCart(medicine))}
                    style={[styles.stepperButton, styles.stepperButtonAccent]}
                  >
                    <Text style={styles.stepperSymbolDark}>+</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

const CheckoutScreen = ({
  totalItems,
  totalAmount,
  onBack,
}: {
  totalItems: number;
  totalAmount: number;
  onBack: () => void;
}) => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.medicines.cart);
  const delivery = totalAmount > 49 ? 0 : totalAmount > 0 ? 4.99 : 0;
  const grandTotal = totalAmount + delivery;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.screenContent}
    >
      <View style={styles.panelHeaderInline}>
        <View>
          <Text style={styles.sectionTitle}>Medicine checkout</Text>
          <Text style={styles.sectionCopy}>
            Review items before placing the order.
          </Text>
        </View>
        <Pressable onPress={onBack} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Back</Text>
        </Pressable>
      </View>

      <View style={styles.panel}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Cart items ({totalItems})</Text>
          <Pressable onPress={() => dispatch(clearCart())}>
            <Text style={styles.linkText}>Clear Cart</Text>
          </Pressable>
        </View>

        {cart.length === 0 ? (
          <Text style={styles.sectionCopy}>Your cart is empty.</Text>
        ) : (
          cart.map((item) => (
            <View key={item.medicine.id} style={styles.checkoutItem}>
              <View style={styles.rowBetween}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionHeadline}>
                    {item.medicine.name}
                  </Text>
                  <Text style={styles.sectionCopy}>
                    {item.medicine.brand} • {item.medicine.packSize}
                  </Text>
                </View>
                <Text style={styles.medicinePrice}>
                  ${item.medicine.price.toFixed(2)}
                </Text>
              </View>
              <View style={styles.rowBetween}>
                <View style={styles.stepperWrapCompact}>
                  <Pressable
                    onPress={() =>
                      dispatch(decrementCartItem(item.medicine.id))
                    }
                    style={[
                      styles.stepperButtonSmall,
                      styles.stepperButtonDark,
                    ]}
                  >
                    <Text style={styles.stepperSmallSymbol}>-</Text>
                  </Pressable>
                  <View style={styles.stepperCountWrapSmall}>
                    <Text style={styles.stepperCountSmall}>
                      {item.quantity}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => dispatch(addToCart(item.medicine))}
                    style={[
                      styles.stepperButtonSmall,
                      styles.stepperButtonAccent,
                    ]}
                  >
                    <Text style={styles.stepperSmallSymbolDark}>+</Text>
                  </Pressable>
                </View>
                <Pressable
                  onPress={() => dispatch(removeFromCart(item.medicine.id))}
                >
                  <Text style={styles.linkText}>Remove</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>Order summary</Text>
        <SummaryRow label="Subtotal" value={`$${totalAmount.toFixed(2)}`} />
        <SummaryRow
          label="Delivery"
          value={delivery === 0 ? "FREE" : `$${delivery.toFixed(2)}`}
        />
        <SummaryRow label="Total" value={`$${grandTotal.toFixed(2)}`} strong />
        <PrimaryButton
          label={
            cart.length === 0 ? "Add items to continue" : "Place Medicine Order"
          }
          disabled={cart.length === 0}
          onPress={() =>
            Alert.alert(
              "Order placed",
              "Your medicine order has been placed successfully.",
            )
          }
        />
      </View>
    </ScrollView>
  );
};

const ProfileScreen = ({
  user,
  profile,
  status,
  saveStatus,
}: {
  user: UserProfile | null;
  profile: UserProfile | null;
  status: string;
  saveStatus: string;
}) => {
  const dispatch = useAppDispatch();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [condition, setCondition] = React.useState("");

  React.useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
      setPhone(profile.phone);
      setAddress(profile.address);
      setCondition(profile.condition);
    }
  }, [profile]);

  if (!user) {
    return (
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.screenContent}
      >
        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <Text style={styles.sectionCopy}>Login to manage your profile.</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.screenContent}
    >
      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>Patient profile</Text>
        <Text style={styles.sectionCopy}>
          Keep your contact details, address, and health condition current.
        </Text>
        {status === "loading" ? <ActivityIndicator color="#67e8f9" /> : null}
        <InputField
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder="Full name"
        />
        <InputField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
        />
        <InputField
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone"
        />
        <InputField
          label="Address"
          value={address}
          onChangeText={setAddress}
          placeholder="Street, city, state"
          multiline
        />
        <InputField
          label="Condition"
          value={condition}
          onChangeText={setCondition}
          placeholder="Condition"
        />
        <PrimaryButton
          label={saveStatus === "loading" ? "Saving..." : "Save Profile"}
          onPress={async () => {
            await dispatch(
              saveProfile({
                userId: user.id,
                updates: { name, email, phone, address, condition },
              }),
            ).unwrap();
            Alert.alert("Profile updated", "Your profile has been saved.");
          }}
        />
      </View>
    </ScrollView>
  );
};

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
}) => (
  <View style={styles.inputBlock}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#7c8aa5"
      secureTextEntry={secureTextEntry}
      multiline={multiline}
      style={[styles.textInput, multiline && styles.textArea]}
    />
  </View>
);

const PrimaryButton = ({
  label,
  onPress,
  compact,
  disabled,
}: {
  label: string;
  onPress: () => void;
  compact?: boolean;
  disabled?: boolean;
}) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    style={[
      styles.primaryButton,
      compact && styles.primaryButtonCompact,
      disabled && styles.primaryButtonDisabled,
    ]}
  >
    <Text style={styles.primaryButtonText}>{label}</Text>
  </Pressable>
);

const Pill = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    style={[styles.pill, active && styles.pillActive]}
  >
    <Text style={[styles.pillText, active && styles.pillTextActive]}>
      {label}
    </Text>
  </Pressable>
);

const StatCard = ({
  label,
  value,
  caption,
}: {
  label: string;
  value: string;
  caption: string;
}) => (
  <View style={styles.statCard}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statCaption}>{caption}</Text>
  </View>
);

const SummaryRow = ({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) => (
  <View style={styles.summaryRow}>
    <Text style={[styles.summaryLabel, strong && styles.summaryLabelStrong]}>
      {label}
    </Text>
    <Text style={[styles.summaryValue, strong && styles.summaryValueStrong]}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0a1730",
  },
  appShell: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: "#0a1730",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  brandLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(103,232,249,0.3)",
    backgroundColor: "rgba(15,23,42,0.7)",
  },
  menuButtonText: {
    color: "#cffafe",
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 22,
  },
  brandEyebrow: {
    color: "#7dd3fc",
    textTransform: "uppercase",
    letterSpacing: 2,
    fontSize: 11,
    fontWeight: "700",
  },
  brandTitle: {
    color: "#f8fafc",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 2,
  },
  drawerBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(2,6,23,0.55)",
    zIndex: 20,
  },
  drawerPanel: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: "#0f1f3d",
    borderRightWidth: 1,
    borderRightColor: "rgba(103,232,249,0.22)",
    paddingTop: 28,
    paddingHorizontal: 14,
    gap: 10,
    zIndex: 30,
  },
  drawerTitle: {
    color: "#a5f3fc",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 6,
  },
  drawerNavItem: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(103,232,249,0.16)",
    backgroundColor: "rgba(15,23,42,0.55)",
  },
  drawerNavItemActive: {
    borderColor: "rgba(34,211,238,0.5)",
    backgroundColor: "rgba(34,211,238,0.18)",
  },
  drawerNavText: {
    color: "#cbd5e1",
    fontWeight: "700",
    fontSize: 15,
  },
  drawerNavTextActive: {
    color: "#ecfeff",
  },
  drawerDivider: {
    height: 1,
    backgroundColor: "rgba(103,232,249,0.2)",
    marginVertical: 6,
  },
  drawerLogoutItem: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.4)",
    backgroundColor: "rgba(248,113,113,0.14)",
  },
  drawerLogoutText: {
    color: "#fecaca",
    fontWeight: "800",
    fontSize: 15,
  },
  screen: {
    flex: 1,
  },
  screenContent: {
    paddingBottom: 40,
    gap: 14,
  },
  heroCard: {
    backgroundColor: "rgba(15,23,42,0.72)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(103,232,249,0.22)",
    padding: 20,
  },
  heroEyebrow: {
    color: "#7dd3fc",
    textTransform: "uppercase",
    letterSpacing: 2.5,
    fontWeight: "700",
    fontSize: 11,
  },
  heroTitle: {
    color: "#f8fafc",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 8,
    lineHeight: 34,
  },
  heroCopy: {
    color: "#cbd5e1",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  panel: {
    backgroundColor: "rgba(15,23,42,0.72)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(103,232,249,0.18)",
    padding: 18,
    gap: 12,
  },
  panelHeader: {
    marginBottom: 4,
  },
  panelHeaderInline: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    color: "#f8fafc",
    fontSize: 21,
    fontWeight: "800",
  },
  sectionHeadline: {
    color: "#e2f8ff",
    fontSize: 17,
    fontWeight: "700",
  },
  sectionCopy: {
    color: "#cbd5e1",
    fontSize: 14,
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.72)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(103,232,249,0.18)",
    padding: 16,
  },
  statLabel: {
    color: "#94a3b8",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    fontWeight: "700",
  },
  statValue: {
    color: "#67e8f9",
    fontSize: 26,
    fontWeight: "800",
    marginTop: 6,
  },
  statCaption: {
    color: "#cbd5e1",
    fontSize: 13,
    marginTop: 4,
  },
  serviceCarousel: {
    gap: 12,
    paddingRight: 8,
  },
  serviceCard: {
    width: 220,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    gap: 8,
  },
  serviceCardDoctors: {
    backgroundColor: "rgba(14,116,144,0.26)",
    borderColor: "rgba(103,232,249,0.35)",
  },
  serviceCardAppointments: {
    backgroundColor: "rgba(30,64,175,0.28)",
    borderColor: "rgba(147,197,253,0.38)",
  },
  serviceCardMedicines: {
    backgroundColor: "rgba(15,118,110,0.26)",
    borderColor: "rgba(94,234,212,0.35)",
  },
  serviceCardProfile: {
    backgroundColor: "rgba(67,56,202,0.25)",
    borderColor: "rgba(165,180,252,0.4)",
  },
  serviceTitle: {
    color: "#ecfeff",
    fontWeight: "800",
    fontSize: 16,
  },
  serviceCopy: {
    color: "#dbeafe",
    fontSize: 13,
    lineHeight: 18,
  },
  segmentRow: {
    flexDirection: "row",
    gap: 10,
  },
  segmentButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    backgroundColor: "rgba(30,41,59,0.92)",
    alignItems: "center",
  },
  segmentButtonActive: {
    backgroundColor: "#22d3ee",
  },
  segmentButtonText: {
    color: "#cbd5e1",
    fontWeight: "700",
  },
  segmentButtonTextActive: {
    color: "#082f49",
  },
  inputBlock: {
    gap: 6,
  },
  fieldLabel: {
    color: "#a5f3fc",
    textTransform: "uppercase",
    letterSpacing: 2,
    fontSize: 11,
    fontWeight: "700",
  },
  textInput: {
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: "#eef2ff",
    paddingHorizontal: 16,
    color: "#0f172a",
    fontSize: 16,
  },
  textArea: {
    minHeight: 110,
    paddingTop: 14,
    textAlignVertical: "top",
  },
  searchInput: {
    minHeight: 56,
    borderRadius: 18,
    backgroundColor: "#ffffff",
    paddingHorizontal: 18,
    color: "#0f172a",
    fontSize: 18,
    marginBottom: 4,
  },
  primaryButton: {
    backgroundColor: "#22d3ee",
    minHeight: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  primaryButtonCompact: {
    minHeight: 42,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: "#082f49",
    fontSize: 17,
    fontWeight: "800",
  },
  secondaryButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(103,232,249,0.25)",
  },
  secondaryButtonText: {
    color: "#cffafe",
    fontWeight: "700",
  },
  quickAccessRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  errorText: {
    color: "#fda4af",
    fontWeight: "600",
  },
  doctorCard: {
    flexDirection: "row",
    gap: 14,
    backgroundColor: "rgba(15,23,42,0.72)",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(103,232,249,0.18)",
    padding: 14,
  },
  doctorAvatar: {
    width: 88,
    height: 88,
    borderRadius: 18,
  },
  doctorBody: {
    flex: 1,
    gap: 4,
  },
  doctorName: {
    color: "#e2f8ff",
    fontWeight: "800",
    fontSize: 18,
  },
  doctorMeta: {
    color: "#cbd5e1",
    fontSize: 13,
  },
  pillRow: {
    gap: 10,
    paddingBottom: 4,
  },
  inlineRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    backgroundColor: "rgba(15,23,42,0.5)",
  },
  pillActive: {
    backgroundColor: "rgba(34,211,238,0.22)",
    borderColor: "rgba(103,232,249,0.65)",
  },
  pillText: {
    color: "#e2e8f0",
    fontWeight: "700",
  },
  pillTextActive: {
    color: "#ecfeff",
  },
  appointmentCard: {
    borderRadius: 18,
    padding: 14,
    backgroundColor: "rgba(30,41,59,0.85)",
    gap: 4,
  },
  statusBadge: {
    color: "#67e8f9",
    fontWeight: "700",
    marginTop: 8,
  },
  cartSummaryCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(15,23,42,0.8)",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(103,232,249,0.18)",
    padding: 16,
    gap: 12,
  },
  cartSummaryTitle: {
    color: "#e2f8ff",
    fontSize: 16,
    fontWeight: "800",
  },
  cartSummaryCopy: {
    color: "#cbd5e1",
    fontSize: 14,
    marginTop: 2,
  },
  resultsText: {
    color: "#cbd5e1",
    fontSize: 14,
    fontWeight: "600",
  },
  medicineCard: {
    backgroundColor: "rgba(15,23,42,0.75)",
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "rgba(103,232,249,0.18)",
    overflow: "hidden",
    marginBottom: 14,
  },
  medicineImage: {
    width: "100%",
    height: 220,
  },
  medicineBody: {
    padding: 18,
    gap: 10,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  medicineName: {
    color: "#a5f3fc",
    fontSize: 18,
    fontWeight: "800",
    flex: 1,
  },
  medicinePrice: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
  },
  medicineMeta: {
    color: "#d7e2f0",
    fontSize: 14,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  badgeWarning: {
    backgroundColor: "rgba(250,204,21,0.22)",
  },
  badgeSuccess: {
    backgroundColor: "rgba(52,211,153,0.22)",
  },
  badgeText: {
    color: "#ecfeff",
    fontWeight: "700",
    fontSize: 12,
  },
  stepperWrap: {
    marginTop: 4,
    flexDirection: "row",
    alignSelf: "center",
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(103,232,249,0.28)",
  },
  stepperWrapCompact: {
    flexDirection: "row",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(103,232,249,0.28)",
  },
  stepperButton: {
    width: 64,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperButtonSmall: {
    width: 42,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperButtonDark: {
    backgroundColor: "#243247",
  },
  stepperButtonAccent: {
    backgroundColor: "#5ad6ea",
  },
  stepperCountWrap: {
    minWidth: 82,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eef2ff",
    paddingHorizontal: 18,
  },
  stepperCountWrapSmall: {
    minWidth: 48,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eef2ff",
    paddingHorizontal: 12,
  },
  stepperSymbol: {
    color: "#cffafe",
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 36,
  },
  stepperSymbolDark: {
    color: "#082f49",
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 36,
  },
  stepperSmallSymbol: {
    color: "#cffafe",
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 28,
  },
  stepperSmallSymbolDark: {
    color: "#082f49",
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 28,
  },
  stepperCount: {
    color: "#0f172a",
    fontSize: 24,
    fontWeight: "800",
  },
  stepperCountSmall: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "800",
  },
  checkoutItem: {
    borderRadius: 18,
    padding: 14,
    backgroundColor: "rgba(30,41,59,0.85)",
    gap: 10,
  },
  linkText: {
    color: "#93c5fd",
    fontWeight: "700",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    color: "#cbd5e1",
    fontSize: 15,
  },
  summaryValue: {
    color: "#f8fafc",
    fontSize: 15,
  },
  summaryLabelStrong: {
    fontWeight: "800",
  },
  summaryValueStrong: {
    fontWeight: "800",
    fontSize: 18,
  },
});

export default function App() {
  return (
    <Provider store={store}>
      <AppShell />
    </Provider>
  );
}
