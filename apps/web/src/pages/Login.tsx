import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sharedUiCopy } from "shared";
import { loginUser } from "shared/redux";
import { useAppDispatch, useAppSelector } from "shared/redux/hooks";
import RemoteImage from "../components/RemoteImage";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const status = useAppSelector((state) => state.auth.status);
  const error = useAppSelector((state) => state.auth.error);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [selectedOption, setSelectedOption] = useState(
    sharedUiCopy.auth.serviceOptions.patient[0],
  );
  const [username, setUsername] = useState(
    sharedUiCopy.auth.demoAccounts.patient.username,
  );
  const [password, setPassword] = useState(
    sharedUiCopy.auth.demoAccounts.patient.password,
  );

  const roleOptions = sharedUiCopy.auth.serviceOptions;

  const applyDemoCredentials = React.useCallback(
    (nextRole: "patient" | "doctor") => {
      setRole(nextRole);
      setSelectedOption(roleOptions[nextRole][0]);

      if (nextRole === "patient") {
        setUsername(sharedUiCopy.auth.demoAccounts.patient.username);
        setPassword(sharedUiCopy.auth.demoAccounts.patient.password);
        return;
      }

      setUsername(sharedUiCopy.auth.demoAccounts.admin.username);
      setPassword(sharedUiCopy.auth.demoAccounts.admin.password);
    },
    [roleOptions],
  );

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (trimmedUsername && trimmedPassword) {
      try {
        await dispatch(
          loginUser({ username: trimmedUsername, password: trimmedPassword }),
        ).unwrap();
        navigate("/dashboard");
      } catch {
        // Error is handled by Redux state.
      }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 pb-10 pt-32">
      <div className="absolute -left-20 top-36 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute -right-10 top-24 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.2fr_1fr]">
        <section className="glass-panel overflow-hidden border-indigo-300/35 p-7">
          <div className="rounded-xl bg-gradient-to-r from-teal-500/15 via-cyan-500/10 to-indigo-500/15 p-4">
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-200">
              {sharedUiCopy.navigation.brand}
            </p>
            <h1 className="mt-3 text-5xl font-extrabold leading-tight text-white">
              {sharedUiCopy.auth.heroTitle}
            </h1>
            <p className="mt-4 max-w-xl text-slate-200/90">
              {sharedUiCopy.auth.heroDescription}
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-cyan-300/20 bg-slate-900/60 p-4 text-center">
              <p className="text-2xl font-bold text-cyan-200">25k+</p>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-300">
                Monthly Consults
              </p>
            </div>
            <div className="rounded-xl border border-cyan-300/20 bg-slate-900/60 p-4 text-center">
              <p className="text-2xl font-bold text-cyan-200">900+</p>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-300">
                Verified Doctors
              </p>
            </div>
            <div className="rounded-xl border border-cyan-300/20 bg-slate-900/60 p-4 text-center">
              <p className="text-2xl font-bold text-cyan-200">4.8/5</p>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-300">
                Patient Rating
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-cyan-300/20 bg-slate-950/60 p-4">
            <p className="mb-2 text-sm font-semibold text-cyan-100">
              Popular services
            </p>
            <div className="flex flex-wrap gap-2">
              {sharedUiCopy.auth.highlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-cyan-300/20 px-3 py-1 text-xs text-slate-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <RemoteImage
            src="https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?auto=format&fit=crop&w=1800&q=80"
            alt="Doctor using digital healthcare tools"
            wrapperClassName="mt-6 h-56 w-full rounded-2xl border border-cyan-300/25"
            className="mt-6 h-56 w-full rounded-2xl border border-cyan-300/25 object-cover object-center"
          />
        </section>

        <section className="glass-panel p-8">
          <p className="mb-3 text-sm text-slate-300">
            {sharedUiCopy.auth.welcomeBack}
          </p>
          <p className="mb-4 rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs text-cyan-100">
            {sharedUiCopy.auth.demoBanner}
          </p>

          <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-900/60 p-1.5">
            <button
              type="button"
              onClick={() => applyDemoCredentials("patient")}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                role === "patient"
                  ? "bg-cyan-400 text-slate-950"
                  : "text-slate-200 hover:bg-white/10"
              }`}
            >
              {sharedUiCopy.auth.roles.patient}
            </button>
            <button
              type="button"
              onClick={() => applyDemoCredentials("doctor")}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                role === "doctor"
                  ? "bg-cyan-400 text-slate-950"
                  : "text-slate-200 hover:bg-white/10"
              }`}
            >
              {sharedUiCopy.auth.roles.doctor}
            </button>
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-cyan-100">
              {sharedUiCopy.auth.labels.service}
            </label>
            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="futuristic-input"
            >
              {roleOptions[role].map((option) => (
                <option
                  key={option}
                  value={option}
                  className="bg-slate-900 text-white"
                >
                  {option}
                </option>
              ))}
            </select>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-4"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-cyan-100">
                {sharedUiCopy.auth.labels.username}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="futuristic-input"
                placeholder={sharedUiCopy.auth.placeholders.username}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-cyan-100">
                {sharedUiCopy.auth.labels.password}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="futuristic-input"
                placeholder={sharedUiCopy.auth.placeholders.password}
              />
            </div>
            <button
              type="submit"
              className="neon-button w-full disabled:cursor-not-allowed disabled:opacity-60"
              disabled={
                status === "loading" || !username.trim() || !password.trim()
              }
            >
              {status === "loading"
                ? sharedUiCopy.auth.buttons.signingIn
                : role === "doctor"
                  ? sharedUiCopy.auth.buttons.continueAsDoctor
                  : sharedUiCopy.auth.buttons.continueAsPatient}
            </button>
            {error && <p className="text-sm text-rose-300">{error}</p>}
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => applyDemoCredentials("patient")}
              className="rounded-lg border border-cyan-300/25 bg-slate-900/60 px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:border-cyan-300/50"
            >
              {sharedUiCopy.auth.buttons.usePatientDemo}
            </button>
            <button
              type="button"
              onClick={() => applyDemoCredentials("doctor")}
              className="rounded-lg border border-cyan-300/25 bg-slate-900/60 px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:border-cyan-300/50"
            >
              {sharedUiCopy.auth.buttons.useDoctorAdminDemo}
            </button>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            {sharedUiCopy.auth.hints.registerAtCheckout}
          </p>
        </section>
      </div>
    </div>
  );
};

export default Login;
