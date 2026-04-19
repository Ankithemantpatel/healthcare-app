import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { sharedUiCopy } from "shared";
import {
  createAppointment,
  fetchAppointments,
  fetchDoctors,
  loginUser,
  registerUser,
} from "shared/redux";
import { useAppDispatch, useAppSelector } from "shared/redux/hooks";

const AppointmentBooking: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const user = useAppSelector((state) => state.auth.user);
  const doctors = useAppSelector((state) => state.doctors.items);
  const appointments = useAppSelector((state) => state.appointments.items);
  const createStatus = useAppSelector(
    (state) => state.appointments.createStatus,
  );
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [doctor, setDoctor] = useState("");
  const [type, setType] = useState(sharedUiCopy.appointments.types[0]);
  const [reason, setReason] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPhone, setAuthPhone] = useState("");
  const [modalError, setModalError] = useState<string | null>(null);
  const locationDoctor =
    typeof location.state === "object" && location.state !== null
      ? ((location.state as { selectedDoctor?: string }).selectedDoctor ?? "")
      : "";

  React.useEffect(() => {
    dispatch(fetchDoctors());
    if (user?.id) {
      dispatch(fetchAppointments(user.id));
    }
  }, [dispatch, user?.id]);

  React.useEffect(() => {
    if (!locationDoctor) {
      return;
    }

    setDoctor(locationDoctor);
  }, [locationDoctor]);

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
    setModalError(null);
  };

  const handleConfirmAppointment = async () => {
    if (!(date && time && doctor && reason)) {
      setModalError(sharedUiCopy.appointments.errors.incompleteDetails);
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
        error instanceof Error
          ? error.message
          : sharedUiCopy.appointments.errors.authenticationFailed;
      setModalError(message);
    }
  };

  return (
    <main id="main-content" className="relative px-4 pb-10 pt-32">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 rounded-2xl border border-cyan-300/25 bg-gradient-to-r from-slate-950/80 via-slate-900/80 to-cyan-950/70 p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">
            {sharedUiCopy.appointments.eyebrow}
          </p>
          <h1 className="mt-1 text-4xl font-bold text-white">
            {sharedUiCopy.appointments.title}
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            {sharedUiCopy.appointments.description}
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="glass-panel p-8">
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-cyan-100">
                {sharedUiCopy.appointments.labels.selectDoctor}
              </label>
              <select
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                className="w-full rounded-lg border border-cyan-300/25 bg-white px-4 py-2 text-slate-900 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
              >
                <option value="">
                  {sharedUiCopy.appointments.placeholders.doctorSelect}
                </option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-cyan-100">
                {sharedUiCopy.appointments.labels.appointmentType}
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-lg border border-cyan-300/25 bg-white px-4 py-2 text-slate-900 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
              >
                {sharedUiCopy.appointments.types.map((appointmentType) => (
                  <option key={appointmentType} value={appointmentType}>
                    {appointmentType}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-cyan-100">
                {sharedUiCopy.appointments.labels.selectDate}
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-cyan-300/25 bg-white px-4 py-2 text-slate-900 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
              />
            </div>
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-cyan-100">
                {sharedUiCopy.appointments.labels.selectTime}
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-lg border border-cyan-300/25 bg-white px-4 py-2 text-slate-900 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
              />
            </div>
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-cyan-100">
                {sharedUiCopy.appointments.labels.reason}
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-cyan-300/25 bg-white px-4 py-2 text-slate-900 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                placeholder={sharedUiCopy.appointments.placeholders.reason}
              />
            </div>
            <button
              onClick={handleConfirmAppointment}
              className="w-full rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 font-semibold text-slate-950 transition hover:from-cyan-300 hover:to-blue-400"
            >
              {createStatus === "loading"
                ? sharedUiCopy.appointments.buttons.processing
                : sharedUiCopy.appointments.buttons.proceedToPayment}
            </button>
            {modalError && (
              <p className="mt-3 text-sm text-rose-300">{modalError}</p>
            )}
          </section>

          <section className="glass-panel p-6">
            <h2 className="mb-4 text-xl font-semibold text-cyan-200">
              {sharedUiCopy.appointments.labels.myAppointments}
            </h2>
            {appointments.length === 0 ? (
              <p className="text-slate-300">
                {sharedUiCopy.appointments.modal.emptyAppointments}
              </p>
            ) : (
              <ul className="space-y-2">
                {appointments.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-lg border border-cyan-300/15 bg-slate-950/45 p-3 text-slate-200"
                  >
                    <p className="font-semibold text-cyan-100">{item.doctor}</p>
                    <p className="text-sm">
                      {item.type} on {item.date} at {item.time}
                    </p>
                    <p className="text-sm text-slate-400">
                      {sharedUiCopy.appointments.labels.reasonPrefix}:{" "}
                      {item.reason}
                    </p>
                    <span
                      className={`mt-2 inline-block rounded-full px-2 py-1 text-xs font-medium ${item.status === "Confirmed" ? "bg-emerald-300/20 text-emerald-200" : item.status === "Pending" ? "bg-amber-300/20 text-amber-200" : "bg-slate-700/40 text-slate-200"}`}
                    >
                      {item.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {showAuthModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-md rounded-2xl border border-cyan-300/20 bg-slate-950 p-6 shadow-2xl">
              <h3 className="text-2xl font-bold text-white">
                {authMode === "login"
                  ? sharedUiCopy.appointments.buttons.loginToContinue
                  : sharedUiCopy.appointments.buttons.createAccount}
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                {sharedUiCopy.appointments.modal.description}
              </p>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className={`rounded-lg px-3 py-2 text-sm ${authMode === "login" ? "bg-cyan-300/20 text-cyan-100" : "bg-slate-800 text-slate-300"}`}
                >
                  {sharedUiCopy.auth.tabs.login}
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode("register")}
                  className={`rounded-lg px-3 py-2 text-sm ${authMode === "register" ? "bg-cyan-300/20 text-cyan-100" : "bg-slate-800 text-slate-300"}`}
                >
                  {sharedUiCopy.auth.tabs.register}
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {authMode === "register" && (
                  <>
                    <input
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder={
                        sharedUiCopy.appointments.placeholders.authName
                      }
                      className="w-full rounded-lg border border-cyan-300/25 bg-white px-3 py-2 text-slate-900"
                    />
                    <input
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder={
                        sharedUiCopy.appointments.placeholders.authEmail
                      }
                      className="w-full rounded-lg border border-cyan-300/25 bg-white px-3 py-2 text-slate-900"
                    />
                    <input
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                      placeholder={
                        sharedUiCopy.appointments.placeholders.authPhone
                      }
                      className="w-full rounded-lg border border-cyan-300/25 bg-white px-3 py-2 text-slate-900"
                    />
                  </>
                )}
                <input
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  placeholder={
                    sharedUiCopy.appointments.placeholders.authUsername
                  }
                  className="w-full rounded-lg border border-cyan-300/25 bg-white px-3 py-2 text-slate-900"
                />
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder={
                    sharedUiCopy.appointments.placeholders.authPassword
                  }
                  className="w-full rounded-lg border border-cyan-300/25 bg-white px-3 py-2 text-slate-900"
                />
              </div>

              {modalError && (
                <p className="mt-3 text-sm text-rose-300">{modalError}</p>
              )}

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="flex-1 rounded-lg border border-slate-700 px-4 py-2 text-slate-200"
                >
                  {sharedUiCopy.appointments.buttons.cancel}
                </button>
                <button
                  type="button"
                  onClick={handleModalAuth}
                  className="flex-1 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 font-semibold text-slate-950"
                >
                  {sharedUiCopy.appointments.buttons.confirmAndPay}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default AppointmentBooking;
