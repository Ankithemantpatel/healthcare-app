import { type FC, useEffect } from "react";
import { fetchAppointments, fetchDoctors } from "shared/redux";
import { useAppDispatch, useAppSelector } from "shared/redux/hooks";

const Dashboard: FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const doctorsCount = useAppSelector((state) => state.doctors.items.length);
  const appointmentsCount = useAppSelector(
    (state) => state.appointments.items.length,
  );
  const pendingAppointments = useAppSelector(
    (state) =>
      state.appointments.items.filter((a) => a.status === "Pending").length,
  );
  const nextAppointment = useAppSelector((state) => {
    const sorted = [...state.appointments.items].sort((a, b) =>
      `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`),
    );
    return sorted[0] ?? null;
  });

  useEffect(() => {
    dispatch(fetchDoctors());
    if (user?.id) {
      dispatch(fetchAppointments(user.id));
    }
  }, [dispatch, user?.id]);

  const tiles = [
    {
      title: "Welcome User",
      value: user?.name ?? "N/A",
      hint: user?.username ?? "guest",
    },
    {
      title: "Active Specialists",
      value: `${doctorsCount}`,
      hint: "Loaded from mock API",
    },
    {
      title: "Appointments",
      value: `${appointmentsCount}`,
      hint: `${pendingAppointments} pending confirmation`,
    },
  ];

  return (
    <div className="relative px-4 pb-10 pt-32">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="glass-panel p-8">
          <p className="mb-2 text-xs uppercase tracking-[0.28em] text-cyan-200">
            Command Console
          </p>
          <h1 className="neon-title text-4xl md:text-5xl">
            Clinical Operations Dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-slate-200/90">
            Monitor your full healthcare graph with adaptive AI recommendations
            and uninterrupted telemetry.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {tiles.map((tile) => (
            <article key={tile.title} className="glass-panel p-5">
              <p className="text-sm text-slate-300">{tile.title}</p>
              <p className="mt-2 text-3xl font-bold text-cyan-200">
                {tile.value}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.15em] text-slate-400">
                {tile.hint}
              </p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="glass-panel p-6">
            <h2 className="text-2xl font-semibold text-white">Next Visit</h2>
            {nextAppointment ? (
              <div className="mt-3 text-slate-300">
                <p className="text-lg font-semibold text-cyan-200">
                  {nextAppointment.doctor}
                </p>
                <p>
                  {nextAppointment.type} • {nextAppointment.date} at{" "}
                  {nextAppointment.time}
                </p>
                <p className="text-sm mt-1">Reason: {nextAppointment.reason}</p>
                <span className="mt-3 inline-block rounded-full bg-cyan-300/20 px-3 py-1 text-xs uppercase tracking-wide text-cyan-200">
                  {nextAppointment.status}
                </span>
              </div>
            ) : (
              <p className="mt-3 text-slate-400">
                No upcoming appointment found.
              </p>
            )}
          </article>

          <article className="glass-panel overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1300&q=80"
              alt="Futuristic medical workstation"
              className="h-52 w-full object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-white">
                Autonomous Triage
              </h2>
              <p className="mt-2 text-slate-300">
                Priority routing identifies high-risk cases before manual
                review.
              </p>
            </div>
          </article>

          <article className="glass-panel overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1300&q=80"
              alt="Healthcare data visualization"
              className="h-52 w-full object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-white">
                Predictive Insights
              </h2>
              <p className="mt-2 text-slate-300">
                Machine learning forecasts capacity, demand, and patient flow in
                real-time.
              </p>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
