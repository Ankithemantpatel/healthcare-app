import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { sharedUiCopy } from "shared";
import {
  addToCart,
  clearCart,
  decrementCartItem,
  placeOrder,
  removeFromCart,
} from "shared/redux";
import { useAppDispatch, useAppSelector } from "shared/redux/hooks";

const MedicinesCheckout: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cart = useAppSelector((state) => state.medicines.cart);
  const user = useAppSelector((state) => state.auth.user);
  const placeStatus = useAppSelector((state) => state.orders.placeStatus);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.quantity * item.medicine.price,
    0,
  );
  const deliveryCharge = subtotal > 49 ? 0 : subtotal > 0 ? 4.99 : 0;
  const total = subtotal + deliveryCharge;

  const handlePlaceOrder = async () => {
    if (!user?.id) {
      navigate("/login", { replace: true });
      return;
    }

    if (cart.length === 0) {
      return;
    }

    await dispatch(
      placeOrder({ userId: user.id, items: cart, totalAmount: total }),
    ).unwrap();
    dispatch(clearCart());
    navigate("/orders");
  };

  return (
    <main id="main-content" className="relative px-4 pb-10 pt-32">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">
              {sharedUiCopy.checkout.title}
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              {sharedUiCopy.checkout.description}
            </p>
          </div>
          <Link
            to="/medicines"
            className="rounded-lg border border-cyan-300/30 px-4 py-2 text-sm text-cyan-200"
            aria-label={sharedUiCopy.checkout.backToMedicines}
          >
            {sharedUiCopy.checkout.backToMedicines}
          </Link>
        </header>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <section
            className="glass-panel p-5"
            aria-labelledby="cart-items-heading"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2
                id="cart-items-heading"
                className="text-xl font-semibold text-white"
              >
                {sharedUiCopy.checkout.cartItems} ({totalItems})
              </h2>
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={() => dispatch(clearCart())}
                  className="text-xs text-rose-300 hover:text-rose-200"
                  aria-label={sharedUiCopy.checkout.clearCart}
                >
                  {sharedUiCopy.checkout.clearCart}
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <p className="text-slate-300">
                {sharedUiCopy.checkout.emptyCart}
              </p>
            ) : (
              <ul className="space-y-3">
                {cart.map((item) => (
                  <li
                    key={item.medicine.id}
                    className="rounded-lg border border-cyan-300/20 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-cyan-100">
                          {item.medicine.name}
                        </p>
                        <p className="text-xs text-slate-300">
                          {item.medicine.brand} • {item.medicine.packSize}
                        </p>
                        <p className="mt-1 text-sm text-white">
                          ${item.medicine.price.toFixed(2)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(removeFromCart(item.medicine.id))
                        }
                        className="text-xs text-rose-300"
                        aria-label={`Remove ${item.medicine.name} from cart`}
                      >
                        {sharedUiCopy.checkout.remove}
                      </button>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(decrementCartItem(item.medicine.id))
                        }
                        className="h-8 w-8 rounded bg-slate-800 text-white"
                        aria-label={`Decrease ${item.medicine.name} quantity`}
                      >
                        -
                      </button>
                      <span
                        className="w-8 text-center text-white"
                        aria-live="polite"
                      >
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => dispatch(addToCart(item.medicine))}
                        className="h-8 w-8 rounded bg-slate-800 text-white"
                        aria-label={`Increase ${item.medicine.name} quantity`}
                      >
                        +
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <aside
            className="glass-panel h-fit p-5"
            aria-labelledby="order-summary-heading"
          >
            <h3
              id="order-summary-heading"
              className="text-xl font-semibold text-white"
            >
              {sharedUiCopy.checkout.orderSummary}
            </h3>
            <div
              className="mt-4 space-y-2 text-sm text-slate-300"
              role="status"
              aria-live="polite"
            >
              <div className="flex justify-between">
                <span>{sharedUiCopy.checkout.subtotal}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{sharedUiCopy.checkout.delivery}</span>
                <span>
                  {deliveryCharge === 0
                    ? sharedUiCopy.checkout.freeDelivery
                    : `$${deliveryCharge.toFixed(2)}`}
                </span>
              </div>
              <div className="mt-2 border-t border-cyan-300/20 pt-2 text-base font-semibold text-white">
                <div className="flex justify-between">
                  <span>{sharedUiCopy.checkout.total}</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={cart.length === 0}
              onClick={handlePlaceOrder}
              className="mt-5 w-full rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={
                cart.length === 0
                  ? "Place medicine order unavailable because cart is empty"
                  : `Place medicine order for ${totalItems} items totaling $${total.toFixed(2)}`
              }
            >
              {placeStatus === "loading"
                ? sharedUiCopy.checkout.placeOrderLoading
                : !user
                  ? sharedUiCopy.checkout.loginToPlaceOrder
                  : sharedUiCopy.checkout.placeOrder}
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default MedicinesCheckout;
