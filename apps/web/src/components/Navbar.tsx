import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "shared/redux";
import { useAppDispatch, useAppSelector } from "shared/redux/hooks";

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const links = [
    { to: "/login", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/doctors", label: "Doctors" },
    { to: "/appointments", label: "Appointments" },
    { to: "/medicines", label: "Medicines" },
    { to: "/profile", label: "Profile" },
  ];

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <nav
      aria-label="Primary"
      className="fixed left-1/2 top-4 z-50 w-[95%] max-w-6xl -translate-x-1/2 rounded-2xl border border-cyan-300/20 bg-slate-950/80 px-4 py-3 shadow-2xl backdrop-blur-xl"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          aria-label="CareBridge 24x7 home"
          className="flex items-center gap-2 rounded-xl border border-cyan-300/40 bg-cyan-300/10 px-3 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200"
        >
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-cyan-300" />
          CareBridge 24x7
        </div>
        <ul className="flex flex-wrap items-center gap-2">
          {links
            .filter((link) =>
              isAuthenticated
                ? true
                : link.to !== "/profile" && link.to !== "/dashboard",
            )
            .map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-cyan-300/20 text-cyan-200"
                        : "text-slate-200 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          {isAuthenticated && (
            <li>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg px-3 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-400/20 hover:text-white"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
