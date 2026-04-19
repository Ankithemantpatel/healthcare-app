import React from "react";
import { useNavigate } from "react-router-dom";
import {
  filterMedicinesCatalog,
  getMedicineCategories,
  type MedicineSortOption,
} from "shared";
import { addToCart, decrementCartItem, fetchMedicines } from "shared/redux";
import { useAppDispatch, useAppSelector } from "shared/redux/hooks";
import RemoteImage from "../components/RemoteImage";

const Medicines: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const medicines = useAppSelector((state) => state.medicines.catalog);
  const cart = useAppSelector((state) => state.medicines.cart);
  const status = useAppSelector((state) => state.medicines.status);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState("All");
  const [sortBy, setSortBy] = React.useState<MedicineSortOption>("popular");
  const searchInputId = "medicine-search";
  const sortSelectId = "medicine-sort";

  React.useEffect(() => {
    if (status === "idle") {
      dispatch(fetchMedicines());
    }
  }, [dispatch, status]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.quantity * item.medicine.price,
    0,
  );
  const totalAmountLabel = `$${totalAmount.toFixed(2)}`;
  const cartQuantityByMedicineId = React.useMemo(
    () =>
      Object.fromEntries(cart.map((item) => [item.medicine.id, item.quantity])),
    [cart],
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

  return (
    <main id="main-content" className="relative px-4 pb-10 pt-32">
      <div className="mx-auto max-w-6xl">
        <header className="mb-5 rounded-2xl border border-cyan-300/25 bg-gradient-to-r from-slate-950/80 via-slate-900/80 to-cyan-950/70 p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">
              Online Pharmacy
            </p>
            <h1 className="mt-1 text-4xl font-bold text-white">
              Medicines & Essentials
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              Search by medicine name, brand, or condition and place your order
              in minutes.
            </p>
          </div>
        </header>

        <section
          aria-label="Cart summary"
          className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cyan-300/20 bg-slate-950/65 px-4 py-3"
        >
          <div
            className="text-sm text-slate-200"
            role="status"
            aria-live="polite"
          >
            <span className="font-semibold text-cyan-200">Cart:</span>{" "}
            {totalItems} items • {totalAmountLabel}
          </div>
          <button
            type="button"
            onClick={() => navigate("/medicines/checkout")}
            className="rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 font-semibold text-slate-950"
            aria-label={`Go to checkout with ${totalItems} items in cart`}
          >
            Go to Checkout
          </button>
        </section>

        <section
          aria-label="Medicine filters"
          className="mb-5 rounded-xl border border-cyan-300/20 bg-slate-950/55 p-4"
        >
          <div className="flex flex-wrap items-end gap-3">
            <label className="block min-w-0" style={{ flex: "1 1 640px" }}>
              <span className="mb-1 block text-xs uppercase tracking-[0.2em] text-cyan-200">
                Search Medicines
              </span>
              <input
                id={searchInputId}
                name="medicineSearch"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Try Paracetamol, Azee, Fever..."
                className="h-14 w-full rounded-lg border border-cyan-300/25 bg-white px-6 text-lg text-slate-900 placeholder:text-slate-500 placeholder:opacity-70 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                style={{ color: "#0f172a", WebkitTextFillColor: "#0f172a" }}
                aria-describedby="medicine-results-status"
              />
            </label>

            <label className="block" style={{ flex: "0 0 220px" }}>
              <span className="mb-1 block text-xs uppercase tracking-[0.2em] text-cyan-200">
                Sort By
              </span>
              <select
                id={sortSelectId}
                name="medicineSort"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as "popular" | "priceAsc" | "priceDesc",
                  )
                }
                className="h-11 w-full rounded-lg border border-cyan-300/25 bg-white px-4 text-sm text-slate-900 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                style={{ color: "#0f172a", WebkitTextFillColor: "#0f172a" }}
                aria-label="Sort medicine results"
              >
                <option value="popular">Most Relevant</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
            </label>
          </div>

          <div
            className="mt-4 flex flex-wrap gap-2"
            aria-label="Filter by category"
            role="toolbar"
          >
            {categories.map((category) => {
              const isActive = category === activeCategory;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={isActive}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    isActive
                      ? "border-cyan-300 bg-cyan-300/20 text-cyan-100"
                      : "border-slate-600 bg-slate-900/60 text-slate-300 hover:border-cyan-300/50"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </section>

        {status === "loading" && (
          <p className="mb-4 text-slate-300" role="status" aria-live="polite">
            Loading medicines...
          </p>
        )}

        <div
          id="medicine-results-status"
          className="mb-3 text-sm text-slate-300"
          role="status"
          aria-live="polite"
        >
          Showing{" "}
          <span className="font-semibold text-cyan-200">
            {filteredMedicines.length}
          </span>{" "}
          medicine results
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMedicines.map((medicine) => {
            const quantityInCart = cartQuantityByMedicineId[medicine.id] ?? 0;

            return (
              <article
                key={medicine.id}
                className="glass-panel overflow-hidden p-0"
                aria-label={`${medicine.name}, ${medicine.category}, price $${medicine.price.toFixed(2)}`}
              >
                <RemoteImage
                  src={medicine.image}
                  alt={`${medicine.name} product pack`}
                  wrapperClassName="h-40 w-full"
                  className="h-40 w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold text-cyan-200">
                        {medicine.name}
                      </h2>
                      <p className="text-sm text-slate-300">
                        {medicine.brand} • {medicine.category}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-white">
                      ${medicine.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm text-slate-200">
                    <span>{medicine.packSize}</span>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        medicine.requiresPrescription
                          ? "bg-amber-300/20 text-amber-200"
                          : "bg-emerald-300/20 text-emerald-200"
                      }`}
                    >
                      {medicine.requiresPrescription ? "Rx Required" : "OTC"}
                    </span>
                  </div>

                  {quantityInCart === 0 ? (
                    <button
                      type="button"
                      onClick={() => dispatch(addToCart(medicine))}
                      className="mt-4 w-full rounded-lg bg-cyan-400 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-300"
                      aria-label={`Add ${medicine.name} to cart`}
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <div
                      className="mt-4 flex justify-center"
                      role="group"
                      aria-label={`${medicine.name} quantity controls`}
                    >
                      <div
                        className="overflow-hidden rounded-2xl border border-cyan-300/30 bg-slate-950/75 shadow-[0_10px_24px_rgba(6,10,26,0.28)]"
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          flexWrap: "nowrap",
                          alignItems: "stretch",
                          width: "100%",
                          maxWidth: "18rem",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(decrementCartItem(medicine.id))
                          }
                          className="flex h-14 shrink-0 items-center justify-center bg-slate-800 text-4xl font-bold leading-none text-cyan-100 transition hover:bg-slate-700"
                          style={{ width: "4.75rem" }}
                          aria-label={`Decrease ${medicine.name} quantity`}
                        >
                          -
                        </button>
                        <div
                          className="flex h-14 items-center justify-center border-x border-cyan-300/20 bg-slate-100 px-5 text-slate-900"
                          style={{ flex: "1 1 auto", minWidth: "0" }}
                        >
                          <p
                            className="text-2xl font-bold leading-none"
                            aria-live="polite"
                          >
                            {quantityInCart}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => dispatch(addToCart(medicine))}
                          className="flex h-14 shrink-0 items-center justify-center bg-cyan-400 text-4xl font-bold leading-none text-slate-950 transition hover:bg-cyan-300"
                          style={{ width: "4.75rem" }}
                          aria-label={`Increase ${medicine.name} quantity`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {status !== "loading" && filteredMedicines.length === 0 && (
          <div className="mt-6 rounded-xl border border-cyan-300/20 bg-slate-950/55 p-6 text-center">
            <p className="text-lg font-semibold text-cyan-100">
              No medicines found
            </p>
            <p className="mt-2 text-sm text-slate-300">
              Try a different name, brand, or category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
                setSortBy("popular");
              }}
              className="mt-4 rounded-lg border border-cyan-300/40 px-4 py-2 text-sm text-cyan-200"
              aria-label="Reset all medicine filters"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Medicines;
