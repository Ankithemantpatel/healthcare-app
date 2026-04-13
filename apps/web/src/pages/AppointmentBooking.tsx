import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchDoctors } from "../redux/doctorsSlice";
import {
  createAppointment,
  fetchAppointments,
} from "../redux/appointmentsSlice";
import { loginUser, registerUser } from "../redux/authSlice";

const AppointmentBooking: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const doctors = useAppSelector((state) => state.doctors.items);
  const appointments = useAppSelector((state) => state.appointments.items);
  const createStatus = useAppSelector(
    (state) => state.appointments.createStatus,
  );
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [doctor, setDoctor] = useState("");
  const [type, setType] = useState("Consultation");
  const [reason, setReason] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPhone, setAuthPhone] = useState("");
  const [modalError, setModalError] = useState<string | null>(null);

  React.useEffect(() => {
    dispatch(fetchDoctors());
    if (user?.id) {
      dispatch(fetchAppointments(user.id));
    }
  }, [dispatch, user?.id]);

  const bookForUser = async (userId: string) => {
    await dispatch(
      createAppointment({
        userId,
        doctor,
        date,
        time,
        type,
        reason,
      }),
    );
    setDate("");
    setTime("");
    setDoctor("");
    setReason("");
  };

  const handleProceedToPayment = async () => {
    if (!(date && time && doctor && reason)) {
      setModalError("Please complete all appointment details before payment.");
      return;
    }

    if (!user?.id) {
      setModalError(null);
      setShowAuthModal(true);
      return;
    }

    await bookForUser(user.id);
  };

  const handleModalAuth = async () => {
    try {
      setModalError(null);

      if (authMode === "login") {
        const result = await dispatch(
          loginUser({ username: authUsername, password: authPassword }),
        ).unwrap();
        await bookForUser(result.user.id);
      } else {
        const result = await dispatch(
          registerUser({
            username: authUsername,
            password: authPassword,
            name: authName,
            email: authEmail,
            phone: authPhone,
          }),
        ).unwrap();
        await bookForUser(result.user.id);
      }

      setShowAuthModal(false);
      setAuthUsername("");
      setAuthPassword("");
      setAuthName("");
      setAuthEmail("");
      setAuthPhone("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Authentication failed";
      setModalError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 pb-10 pt-32">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Book an Appointment
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          You can continue as guest. Login or create account is required only at
          payment confirmation.
        </p>
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Select Doctor
            </label>
            <select
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select a Doctor --</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Appointment Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Consultation">Consultation</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Routine Check">Routine Check</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Select Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Reason for Visit
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe symptoms or consultation purpose"
            />
          </div>
          <button
            onClick={handleProceedToPayment}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-900 transition duration-300"
          >
            {createStatus === "loading"
              ? "Processing..."
              : "Proceed to Payment"}
          </button>
          {modalError && (
            <p className="mt-3 text-sm text-rose-600">{modalError}</p>
          )}
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">
            My Appointments
          </h2>
          {appointments.length === 0 ? (
            <p className="text-gray-600">No appointments yet.</p>
          ) : (
            <ul className="space-y-2">
              {appointments.map((item) => (
                <li
                  key={item.id}
                  className="rounded-lg border border-gray-200 p-3 text-gray-700"
                >
                  <p className="font-semibold">{item.doctor}</p>
                  <p className="text-sm">
                    {item.type} on {item.date} at {item.time}
                  </p>
                  <p className="text-sm text-gray-500">Reason: {item.reason}</p>
                  <span
                    className={`mt-2 inline-block rounded-full px-2 py-1 text-xs font-medium ${item.status === "Confirmed" ? "bg-green-100 text-green-700" : item.status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700"}`}
                  >
                    {item.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {showAuthModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-800">
                {authMode === "login" ? "Login to Continue" : "Create Account"}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Complete authentication to confirm payment and finalize booking.
              </p>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className={`rounded-lg px-3 py-2 text-sm ${authMode === "login" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode("register")}
                  className={`rounded-lg px-3 py-2 text-sm ${authMode === "register" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}
                >
                  Create Account
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {authMode === "register" && (
                  <>
                    <input
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="Full name"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    />
                    <input
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="Email"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    />
                    <input
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                      placeholder="Phone"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    />
                  </>
                )}
                <input
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>

              {modalError && (
                <p className="mt-3 text-sm text-rose-600">{modalError}</p>
              )}

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleModalAuth}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white"
                >
                  Confirm & Pay
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentBooking;
