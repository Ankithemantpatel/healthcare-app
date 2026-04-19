import React from "react";
import { useNavigate } from "react-router-dom";
import { sharedUiCopy } from "shared";
import { fetchDoctors } from "shared/redux";
import { useAppDispatch, useAppSelector } from "shared/redux/hooks";
import RemoteImage from "../components/RemoteImage";

const DoctorList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const doctors = useAppSelector((state) => state.doctors.items);
  const status = useAppSelector((state) => state.doctors.status);

  React.useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDoctors());
    }
  }, [dispatch, status]);

  return (
    <main id="main-content" className="relative px-4 pb-10 pt-32">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 rounded-2xl border border-cyan-300/25 bg-gradient-to-r from-slate-950/80 via-slate-900/80 to-cyan-950/70 p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">
            {sharedUiCopy.doctors.eyebrow}
          </p>
          <h1 className="mt-1 text-4xl font-bold text-white">
            {sharedUiCopy.doctors.title}
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            {sharedUiCopy.doctors.description}
          </p>
        </header>
        {status === "loading" && (
          <p className="mb-4 text-slate-300">{sharedUiCopy.doctors.loading}</p>
        )}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {doctors.map((doctor) => (
            <article
              key={doctor.id}
              className="glass-panel p-6 transition duration-300 hover:border-cyan-300/40"
            >
              <div className="flex gap-4">
                <RemoteImage
                  src={doctor.image}
                  alt={doctor.name}
                  wrapperClassName="h-16 w-16 shrink-0 rounded-full"
                  className="h-16 w-16 rounded-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="flex-1">
                  <h2 className="mb-1 text-xl font-semibold text-cyan-200">
                    {doctor.name}
                  </h2>
                  <p className="text-sm text-slate-400">{doctor.hospital}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-300">
                <p>
                  <span className="font-semibold">
                    {sharedUiCopy.doctors.fields.specialty}:
                  </span>{" "}
                  {doctor.specialty}
                </p>
                <p>
                  <span className="font-semibold">
                    {sharedUiCopy.doctors.fields.experience}:
                  </span>{" "}
                  {doctor.experienceYears}{" "}
                  {sharedUiCopy.doctors.fields.yearsSuffix}
                </p>
                <p>
                  <span className="font-semibold">
                    {sharedUiCopy.doctors.fields.rating}:
                  </span>{" "}
                  {doctor.rating} {sharedUiCopy.doctors.fields.ratingSuffix}
                </p>
                <p>
                  <span className="font-semibold">
                    {sharedUiCopy.doctors.fields.fee}:
                  </span>{" "}
                  ${doctor.consultationFee}
                </p>
              </div>
              <p className="mb-4 mt-3 text-sm text-slate-300">
                <span className="font-semibold">
                  {sharedUiCopy.doctors.fields.availability}:
                </span>{" "}
                {doctor.availability}
              </p>
              <button
                type="button"
                onClick={() =>
                  navigate("/appointments", {
                    state: { selectedDoctor: doctor.name },
                  })
                }
                className="w-full rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 font-semibold text-slate-950 transition hover:from-cyan-300 hover:to-blue-400"
              >
                {sharedUiCopy.doctors.bookButton}
              </button>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
};

export default DoctorList;
