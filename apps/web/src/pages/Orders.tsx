import React from "react";
import { sharedUiCopy as CONSTANTS } from "shared";
import { useAppSelector } from "shared/redux/hooks";

const Orders: React.FC = () => {
  const orders = useAppSelector((state) => state.orders.items);
  const status = useAppSelector((state) => state.orders.status);
  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return (
      <div className="px-4 pb-10 pt-32 text-slate-200">
        {CONSTANTS.orders.unauthenticatedMessage}
      </div>
    );
  }

  return (
    <main className="relative px-4 pb-10 pt-32">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="glass-panel p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-200">
            {CONSTANTS.orders.eyebrow}
          </p>
          <h1 className="mt-2 text-4xl font-extrabold text-white">
            {CONSTANTS.orders.title}
          </h1>
          <p className="mt-3 max-w-2xl text-slate-200/90">
            {CONSTANTS.orders.description}
          </p>
        </section>

        {status === "loading" ? (
          <section className="glass-panel p-6 text-slate-200">
            {CONSTANTS.orders.loading}
          </section>
        ) : null}

        {status !== "loading" && orders.length === 0 ? (
          <section className="glass-panel p-6 text-slate-300">
            {CONSTANTS.orders.empty}
          </section>
        ) : null}

        <section className="grid gap-4">
          {orders.map((order) => (
            <article key={order.id} className="glass-panel p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">
                    {CONSTANTS.orders.orderPrefix}
                    {order.id}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    {order.status}
                  </h2>
                  <p className="mt-2 text-sm text-slate-300">
                    {CONSTANTS.orders.placedLabel}:{" "}
                    {new Date(order.placedAt).toLocaleString()}
                  </p>
                </div>
                <div className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100">
                  {CONSTANTS.orders.etaLabel}: {order.eta}
                </div>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    {CONSTANTS.orders.itemsLabel}
                  </p>
                  <ul className="mt-3 space-y-2 text-slate-200">
                    {order.items.map((item) => (
                      <li
                        key={`${order.id}-${item.medicine.id}`}
                        className="rounded-lg border border-cyan-300/15 bg-slate-950/40 px-3 py-2"
                      >
                        {item.medicine.name} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-cyan-300/15 bg-slate-950/40 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    {CONSTANTS.orders.summaryLabel}
                  </p>
                  <div className="mt-3 space-y-2 text-sm text-slate-200">
                    <div className="flex items-center justify-between">
                      <span>{CONSTANTS.orders.itemsLabel}</span>
                      <span>
                        {order.items.reduce(
                          (sum, item) => sum + item.quantity,
                          0,
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-cyan-300/10 pt-2 text-base font-semibold text-white">
                      <span>{CONSTANTS.orders.totalLabel}</span>
                      <span>${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
};

export default Orders;
