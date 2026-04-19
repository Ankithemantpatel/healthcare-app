import React from "react";
import { fetchDoctors } from "shared/redux";
import { useAppDispatch, useAppSelector } from "shared/redux/hooks";

const DoctorList: React.FC = () => {
  const dispatch = useAppDispatch();
  const doctors = useAppSelector((state) => state.doctors.items);
  const status = useAppSelector((state) => state.doctors.status);

  React.useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDoctors());
    }
  }, [dispatch, status]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 pb-10 pt-32">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Available Doctors
        </h1>
        {status === "loading" && (
          <p className="mb-4 text-slate-300">Loading specialists...</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300"
            >
              <div className="flex gap-4">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-blue-600 mb-1">
                    {doctor.name}
                  </h2>
                  <p className="text-sm text-gray-500">{doctor.hospital}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
                <p>
                  <span className="font-semibold">Specialty:</span>{" "}
                  {doctor.specialty}
                </p>
                <p>
                  <span className="font-semibold">Experience:</span>{" "}
                  {doctor.experienceYears} yrs
                </p>
                <p>
                  <span className="font-semibold">Rating:</span> {doctor.rating}{" "}
                  / 5
                </p>
                <p>
                  <span className="font-semibold">Fee:</span> $
                  {doctor.consultationFee}
                </p>
              </div>
              <p className="text-gray-600 mt-3 mb-4 text-sm">
                <span className="font-semibold">Availability:</span>{" "}
                {doctor.availability}
              </p>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorList;
