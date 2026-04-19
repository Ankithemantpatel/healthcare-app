import React from "react";
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Provider } from "react-redux";
import {
  filterMedicinesCatalog,
  getMedicineCategories,
  sharedUiCopy as CONSTANTS,
  type MedicineSortOption,
} from "shared";
import { useAppDispatch, useAppSelector } from "shared/redux/hooks";
import {
  initializeAuth,
  logoutUser,
  fetchDoctors,
  fetchAppointments,
  fetchMedicines,
  fetchProfile,
  fetchHealthRecords,
  fetchOrders,
} from "shared/redux";
import store from "./redux/store";
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
  { key: "login", label: CONSTANTS.navigation.routes.login },
  {
    key: "dashboard",
    label: CONSTANTS.navigation.routes.dashboard,
    protected: true,
  },
  { key: "doctors", label: CONSTANTS.navigation.routes.doctors },
  {
    key: "appointments",
    label: CONSTANTS.navigation.routes.appointments,
  },
  { key: "medicines", label: CONSTANTS.navigation.routes.medicines },
  {
    key: "healthRecords",
    label: CONSTANTS.navigation.routes.healthRecords,
    protected: true,
  },
  {
    key: "orders",
    label: CONSTANTS.navigation.routes.orders,
    protected: true,
  },
  {
    key: "profile",
    label: CONSTANTS.navigation.routes.profile,
    protected: true,
  },
];

const AppShell = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const doctors = useAppSelector((state) => state.doctors.items);
  const doctorsStatus = useAppSelector((state) => state.doctors.status);
  const appointments = useAppSelector((state) => state.appointments.items);
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
              item.key === "dashboard"
                ? { ...item, label: CONSTANTS.navigation.routes.login }
                : item,
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
                    <Text style={styles.drawerLogoutText}>
                      {CONSTANTS.navigation.logout}
                    </Text>
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0a1730",
  },
  appShell: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 12,
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
    paddingHorizontal: 8,
    paddingBottom: 50,
    gap: 28,
  },
  heroCard: {
    backgroundColor: "rgba(15,23,42,0.72)",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(103,232,249,0.22)",
    padding: 28,
    marginBottom: 8,
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
    fontSize: 32,
    fontWeight: "800",
    marginTop: 12,
    lineHeight: 38,
  },
  heroCopy: {
    color: "#cbd5e1",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 14,
  },
  panel: {
    backgroundColor: "rgba(15,23,42,0.72)",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(103,232,249,0.18)",
    padding: 28,
    gap: 24,
    marginBottom: 8,
  },
  orderCard: {
    backgroundColor: "rgba(15,23,42,0.72)",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(103,232,249,0.18)",
    padding: 28,
    gap: 20,
    marginBottom: 8,
  },
  orderHeader: {
    gap: 12,
  },
  orderHeaderCopy: {
    gap: 8,
  },
  orderEyebrow: {
    color: "#a5f3fc",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    fontSize: 11,
    fontWeight: "700",
  },
  orderTitle: {
    color: "#67e8f9",
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 31,
  },
  orderEtaBadge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(103,232,249,0.25)",
    backgroundColor: "rgba(34,211,238,0.12)",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  orderEtaBadgeText: {
    color: "#a5f3fc",
    fontSize: 13,
    fontWeight: "700",
  },
  orderBody: {
    gap: 16,
  },
  orderItemsCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(103,232,249,0.12)",
    backgroundColor: "rgba(2,6,23,0.18)",
    padding: 16,
    gap: 10,
  },
  orderItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  orderItemText: {
    flex: 1,
    color: "#cbd5e1",
    fontSize: 15,
    lineHeight: 22,
  },
  orderItemQuantity: {
    color: "#e2f8ff",
    fontSize: 15,
    fontWeight: "700",
  },
  orderSummaryCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(103,232,249,0.12)",
    backgroundColor: "rgba(2,6,23,0.18)",
    padding: 16,
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
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 12,
  },
  textInput: {
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: "#eef2ff",
    paddingHorizontal: 16,
    color: "#0f172a",
    fontSize: 16,
  },
  pickerTrigger: {
    minHeight: 58,
    borderRadius: 16,
    backgroundColor: "#eef2ff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "center",
    gap: 4,
  },
  pickerTriggerValue: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "700",
  },
  pickerTriggerMeta: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "600",
  },
  pickerSurface: {
    marginTop: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.26)",
    backgroundColor: "#ffffff",
    paddingHorizontal: 0,
    paddingVertical: 0,
    overflow: "hidden",
    shadowColor: "#020617",
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  pickerControl: {
    backgroundColor: "#ffffff",
    alignSelf: "stretch",
  },
  pickerBackdrop: {
    flex: 1,
    backgroundColor: "rgba(2,6,23,0.45)",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  pickerModalCard: {
    borderRadius: 24,
    backgroundColor: "#ffffff",
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  pickerModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  pickerModalTitle: {
    color: "#0f172a",
    fontSize: 17,
    fontWeight: "800",
  },
  pickerModalDone: {
    color: "#0284c7",
    fontSize: 15,
    fontWeight: "700",
  },
  textArea: {
    minHeight: 110,
    paddingTop: 14,
    textAlignVertical: "top",
  },
  searchInput: {
    minHeight: 58,
    borderRadius: 18,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    color: "#0f172a",
    fontSize: 18,
    marginBottom: 8,
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
    gap: 14,
    paddingBottom: 8,
  },
  inlineRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginBottom: 12,
  },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: "rgba(15,23,42,0.4)",
  },
  pillActive: {
    backgroundColor: "rgba(34,211,238,0.28)",
    borderColor: "rgba(103,232,249,0.8)",
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
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(103,232,249,0.18)",
    padding: 24,
    gap: 18,
    marginBottom: 8,
  },
  cartSummaryTitle: {
    color: "#e2f8ff",
    fontSize: 18,
    fontWeight: "800",
  },
  cartSummaryCopy: {
    color: "#cbd5e1",
    fontSize: 14,
    marginTop: 2,
  },
  resultsText: {
    color: "#cbd5e1",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  medicineCard: {
    backgroundColor: "rgba(15,23,42,0.75)",
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "rgba(103,232,249,0.18)",
    overflow: "hidden",
    marginBottom: 18,
    marginHorizontal: 8,
  },
  medicineImage: {
    width: "100%",
    height: 240,
  },
  medicineBody: {
    padding: 22,
    gap: 16,
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
