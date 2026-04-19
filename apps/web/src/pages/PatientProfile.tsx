import React, { useState } from "react";
import { fetchProfile, saveProfile } from "shared/redux";
import { useAppDispatch, useAppSelector } from "shared/redux/hooks";

const PatientProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const profile = useAppSelector((state) => state.profile.data);
  const saveStatus = useAppSelector((state) => state.profile.saveStatus);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [disease, setDisease] = useState("");

  React.useEffect(() => {
    if (user?.id) {
      dispatch(fetchProfile(user.id));
    }
  }, [dispatch, user?.id]);

  React.useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
      setPhone(profile.phone);
      setDisease(profile.condition);
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user?.id) {
      return;
    }

    await dispatch(
      saveProfile({
        userId: user.id,
        updates: {
          name,
          email,
          phone,
          condition: disease,
        },
      }),
    );
  };

  if (!user) {
    return (
      <div className="px-6 pt-32 text-slate-200">
        Please login to manage profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Patient Profile
        </h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Disease/Condition
            </label>
            <input
              type="text"
              value={disease}
              onChange={(e) => setDisease(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-900 transition duration-300"
          >
            {saveStatus === "loading" ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
