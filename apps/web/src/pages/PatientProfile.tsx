import React, { useState } from "react";
import { sharedUiCopy } from "shared";
import { fetchProfile, saveProfile } from "shared/redux";
import { useAppDispatch, useAppSelector } from "shared/redux/hooks";

const PatientProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const profile = useAppSelector((state) => state.profile.data);
  const status = useAppSelector((state) => state.profile.status);
  const saveStatus = useAppSelector((state) => state.profile.saveStatus);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [condition, setCondition] = useState("");
  const [message, setMessage] = useState<string | null>(null);

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
      setAddress(profile.address);
      setCondition(profile.condition);
    }
  }, [profile]);

  const trimmedProfile = React.useMemo(
    () => ({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      condition: condition.trim(),
    }),
    [address, condition, email, name, phone],
  );

  const hasIncompleteRequiredFields = Object.values(trimmedProfile).some(
    (value) => value.length === 0,
  );

  const isUnchanged =
    profile != null &&
    trimmedProfile.name === profile.name.trim() &&
    trimmedProfile.email === profile.email.trim() &&
    trimmedProfile.phone === profile.phone.trim() &&
    trimmedProfile.address === profile.address.trim() &&
    trimmedProfile.condition === profile.condition.trim();

  const isSaveDisabled =
    saveStatus === "loading" ||
    status === "loading" ||
    profile == null ||
    hasIncompleteRequiredFields ||
    isUnchanged;

  const handleSave = async () => {
    if (!user?.id || isSaveDisabled) {
      return;
    }

    await dispatch(
      saveProfile({
        userId: user.id,
        updates: {
          ...trimmedProfile,
        },
      }),
    );

    setMessage(sharedUiCopy.profile.messages.updatedInline);
  };

  if (!user) {
    return (
      <div className="px-6 pt-32 text-slate-200">
        {sharedUiCopy.profile.unauthenticatedMessage}
      </div>
    );
  }

  return (
    <main className="relative px-4 pb-10 pt-32">
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="glass-panel p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-200">
            {sharedUiCopy.profile.eyebrow}
          </p>
          <h1 className="mt-2 text-4xl font-extrabold text-white">
            {sharedUiCopy.profile.title}
          </h1>
          <p className="mt-3 max-w-2xl text-slate-200/90">
            {sharedUiCopy.profile.description}
          </p>
        </section>

        <section className="glass-panel p-8">
          <div className="mb-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-cyan-300/15 bg-slate-950/40 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                {sharedUiCopy.profile.labels.signedInAs}
              </p>
              <p className="mt-2 text-xl font-semibold text-white">
                {user.name}
              </p>
              <p className="text-sm text-slate-300">{user.username}</p>
            </div>
            <div className="rounded-xl border border-cyan-300/15 bg-slate-950/40 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                {sharedUiCopy.profile.labels.syncStatus}
              </p>
              <p className="mt-2 text-xl font-semibold text-white">
                {saveStatus === "loading"
                  ? sharedUiCopy.profile.messages.saving
                  : status === "loading"
                    ? sharedUiCopy.profile.messages.loading
                    : sharedUiCopy.profile.messages.ready}
              </p>
              <p className="text-sm text-slate-300">
                {sharedUiCopy.profile.messages.sharedData}
              </p>
            </div>
          </div>

          {message ? (
            <p className="mb-4 rounded-lg border border-emerald-400/25 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-100">
              {message}
            </p>
          ) : null}

          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-cyan-100">
              {sharedUiCopy.profile.labels.name}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setMessage(null);
              }}
              className="futuristic-input"
            />
          </div>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-cyan-100">
              {sharedUiCopy.profile.labels.email}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setMessage(null);
              }}
              className="futuristic-input"
            />
          </div>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-cyan-100">
              {sharedUiCopy.profile.labels.phone}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setMessage(null);
              }}
              className="futuristic-input"
            />
          </div>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-cyan-100">
              {sharedUiCopy.profile.labels.address}
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setMessage(null);
              }}
              className="futuristic-input"
            />
          </div>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-cyan-100">
              {sharedUiCopy.profile.labels.condition}
            </label>
            <input
              type="text"
              value={condition}
              onChange={(e) => {
                setCondition(e.target.value);
                setMessage(null);
              }}
              className="futuristic-input"
            />
          </div>
          <button
            onClick={handleSave}
            className="neon-button w-full disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSaveDisabled}
          >
            {saveStatus === "loading"
              ? sharedUiCopy.profile.buttons.saving
              : sharedUiCopy.profile.buttons.save}
          </button>
        </section>
      </div>
    </main>
  );
};

export default PatientProfile;
