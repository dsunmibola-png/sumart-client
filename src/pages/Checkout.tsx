import { useState } from "react";
import {
  CreditCard,
  MapPin,
  Package,
  ShieldCheck,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../services/orderService";
import { initializePayment } from "../services/PaymentService";

const Checkout = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    cartTotal,
    clearCart,
  } = useCart();

  const { user, token } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });

  const [paymentMethod, setPaymentMethod] =
    useState<"card" | "delivery">("card");

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const totalItems = cartItems.reduce(
    (total, item) =>
      total + item.quantity,
    0,
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const getAxiosErrorMessage = (
    err: unknown,
    fallback: string,
  ) => {
    if (axios.isAxiosError(err)) {
      const backendMessage =
        err.response?.data?.message;

      if (
        typeof backendMessage === "string" &&
        backendMessage.trim()
      ) {
        return backendMessage;
      }

      return err.message || fallback;
    }

    if (err instanceof Error) {
      return err.message;
    }

    return fallback;
  };

  const handlePlaceOrder = async () => {
    setError("");

    if (!token) {
      setError(
        "You must be logged in to place an order.",
      );
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.state.trim()
    ) {
      setError(
        "Please complete all delivery information.",
      );
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        items: cartItems.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),

        shippingAddress: {
          fullName:
            formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address:
            formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
        },

        paymentMethod,
      };

      /*
       * STEP 1
       * Create the order in SUMART.
       */
      let orderData;

      try {
        console.log(
          "Creating SUMART order...",
        );

        orderData = await createOrder(
          payload,
          token,
        );

        console.log(
          "Order created successfully:",
          orderData,
        );
      } catch (orderError) {
        console.error(
          "Order creation failed:",
          orderError,
        );

        if (
          axios.isAxiosError(orderError)
        ) {
          console.error(
            "Order backend response:",
            orderError.response?.data,
          );
        }

        setError(
          getAxiosErrorMessage(
            orderError,
            "Unable to create your order.",
          ),
        );

        return;
      }

      /*
       * STEP 2
       * Card payments go through Paystack.
       */
      if (paymentMethod === "card") {
        try {
          console.log(
            "Initializing Paystack payment for order:",
            orderData.order._id,
          );

          const paymentData =
            await initializePayment(
              orderData.order._id,
              token,
            );

          console.log(
            "Paystack initialization response:",
            paymentData,
          );

          const authorizationUrl =
            paymentData?.payment
              ?.authorizationUrl;

          if (!authorizationUrl) {
            console.error(
              "Missing authorization URL:",
              paymentData,
            );

            setError(
              "Paystack did not return a payment URL.",
            );

            return;
          }

          /*
           * Do NOT clear the cart yet.
           * Clear it after Paystack confirms
           * payment on the callback page.
           */
          window.location.assign(
            authorizationUrl,
          );

          return;
        } catch (paymentError) {
          console.error(
            "Paystack initialization failed:",
            paymentError,
          );

          if (
            axios.isAxiosError(
              paymentError,
            )
          ) {
            console.error(
              "Payment backend response:",
              paymentError.response
                ?.data,
            );
          }

          const message =
            getAxiosErrorMessage(
              paymentError,
              "Unable to initialize card payment.",
            );

          setError(
            `Payment initialization failed: ${message}`,
          );

          return;
        }
      }

      /*
       * STEP 3
       * Pay on Delivery requires no Paystack redirect.
       */
      clearCart();

      navigate(
        `/orders/${orderData.order._id}`,
        {
          state: {
            orderPlaced: true,
          },
        },
      );
    } catch (unexpectedError) {
      console.error(
        "Unexpected checkout error:",
        unexpectedError,
      );

      setError(
        getAxiosErrorMessage(
          unexpectedError,
          "Unable to place your order.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClassName =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100/70 sm:text-sm";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-7 sm:px-6 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-600 sm:text-sm">
            Secure Checkout
          </p>

          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:mt-2 sm:text-3xl lg:text-4xl">
            Complete Your Order
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:mt-3 sm:text-base">
            Enter your delivery details and
            choose your preferred payment
            method.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-8">
          {/* Left Column */}
          <div className="min-w-0 space-y-5 sm:space-y-6">
            {/* Delivery Information */}
            <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3 sm:mb-6 sm:items-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600 sm:h-11 sm:w-11">
                  <MapPin size={20} />
                </div>

                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                    Delivery Information
                  </h2>

                  <p className="mt-0.5 text-xs leading-5 text-slate-500 sm:text-sm">
                    Where should we deliver
                    your order?
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-1.5 block text-sm font-semibold text-slate-700 sm:mb-2"
                  >
                    Full name
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    value={
                      formData.fullName
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className={
                      inputClassName
                    }
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-semibold text-slate-700 sm:mb-2"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={
                      handleChange
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    inputMode="email"
                    className={
                      inputClassName
                    }
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-1.5 block text-sm font-semibold text-slate-700 sm:mb-2"
                  >
                    Phone number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={
                      handleChange
                    }
                    placeholder="+234..."
                    autoComplete="tel"
                    inputMode="tel"
                    className={
                      inputClassName
                    }
                  />
                </div>

                {/* City */}
                <div>
                  <label
                    htmlFor="city"
                    className="mb-1.5 block text-sm font-semibold text-slate-700 sm:mb-2"
                  >
                    City
                  </label>

                  <input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={
                      handleChange
                    }
                    placeholder="Enter your city"
                    autoComplete="address-level2"
                    className={
                      inputClassName
                    }
                  />
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="mb-1.5 block text-sm font-semibold text-slate-700 sm:mb-2"
                  >
                    Delivery address
                  </label>

                  <input
                    id="address"
                    name="address"
                    value={
                      formData.address
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="House number, street, area"
                    autoComplete="street-address"
                    className={
                      inputClassName
                    }
                  />
                </div>

                {/* State */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="state"
                    className="mb-1.5 block text-sm font-semibold text-slate-700 sm:mb-2"
                  >
                    State
                  </label>

                  <input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={
                      handleChange
                    }
                    placeholder="Enter your state"
                    autoComplete="address-level1"
                    className={
                      inputClassName
                    }
                  />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3 sm:mb-6 sm:items-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600 sm:h-11 sm:w-11">
                  <CreditCard
                    size={20}
                  />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                    Payment Method
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                    Choose how you want to pay.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Card */}
                <label
                  className={`flex min-h-20 cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition sm:p-4 ${
                    paymentMethod ===
                    "card"
                      ? "border-green-500 bg-green-50/60 ring-1 ring-green-500/10"
                      : "border-slate-200 hover:border-green-300"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      paymentMethod ===
                      "card"
                        ? "bg-green-600 text-white"
                        : "bg-green-50 text-green-600"
                    }`}
                  >
                    <CreditCard
                      size={19}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-800 sm:text-base">
                      Debit / Credit Card
                    </p>

                    <p className="mt-0.5 text-xs leading-5 text-slate-500 sm:text-sm">
                      Pay securely online with
                      Paystack
                    </p>
                  </div>

                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={
                      paymentMethod ===
                      "card"
                    }
                    onChange={() =>
                      setPaymentMethod(
                        "card",
                      )
                    }
                    className="h-5 w-5 shrink-0 accent-green-600"
                  />
                </label>

                {/* Pay on Delivery */}
                <label
                  className={`flex min-h-20 cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition sm:p-4 ${
                    paymentMethod ===
                    "delivery"
                      ? "border-green-500 bg-green-50/60 ring-1 ring-green-500/10"
                      : "border-slate-200 hover:border-green-300"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      paymentMethod ===
                      "delivery"
                        ? "bg-green-600 text-white"
                        : "bg-green-50 text-green-600"
                    }`}
                  >
                    <Package
                      size={19}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-800 sm:text-base">
                      Pay on Delivery
                    </p>

                    <p className="mt-0.5 text-xs leading-5 text-slate-500 sm:text-sm">
                      Pay when your order
                      arrives
                    </p>
                  </div>

                  <input
                    type="radio"
                    name="payment"
                    value="delivery"
                    checked={
                      paymentMethod ===
                      "delivery"
                    }
                    onChange={() =>
                      setPaymentMethod(
                        "delivery",
                      )
                    }
                    className="h-5 w-5 shrink-0 accent-green-600"
                  />
                </label>
              </div>
            </section>
          </div>

          {/* Order Summary */}
          <aside className="h-fit overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm lg:sticky lg:top-32">
            {/* Summary Header */}
            <div className="border-b border-slate-100 p-4 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                    Order Summary
                  </h2>

                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    {totalItems}{" "}
                    {totalItems === 1
                      ? "item"
                      : "items"}{" "}
                    in your order
                  </p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <Package size={19} />
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="max-h-80 space-y-4 overflow-y-auto p-4 sm:p-6">
              {cartItems.map(
                ({
                  product,
                  quantity,
                }) => (
                  <div
                    key={product._id}
                    className="flex items-center gap-3"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-16 sm:w-16">
                      {product.images[0] ? (
                        <img
                          src={
                            product
                              .images[0]
                          }
                          alt={
                            product.name
                          }
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-2 text-center text-[9px] text-slate-400">
                          No image
                        </div>
                      )}

                      <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-900/90 px-1 text-[9px] font-bold text-white">
                        {quantity}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-semibold leading-5 text-slate-800">
                        {product.name}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        ₦
                        {product.price.toLocaleString()}{" "}
                        each
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-bold text-slate-800">
                      ₦
                      {(
                        product.price *
                        quantity
                      ).toLocaleString()}
                    </p>
                  </div>
                ),
              )}
            </div>

            {/* Totals */}
            <div className="border-t border-slate-100 p-4 sm:p-6">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-4 text-slate-600">
                  <span>Subtotal</span>

                  <span className="font-semibold text-slate-800">
                    ₦
                    {cartTotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-slate-600">
                  <span>Delivery</span>

                  <span className="font-semibold text-green-600">
                    Free
                  </span>
                </div>
              </div>

              <div className="my-5 border-t border-slate-100" />

              <div className="flex items-end justify-between gap-4">
                <span className="font-bold text-slate-900 sm:text-lg">
                  Total
                </span>

                <span className="text-xl font-extrabold text-green-600 sm:text-2xl">
                  ₦
                  {cartTotal.toLocaleString()}
                </span>
              </div>

              {/* Checkout Error */}
              {error && (
                <div
                  role="alert"
                  className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-600"
                >
                  {error}
                </div>
              )}

              {/* Place Order */}
              <button
                type="button"
                onClick={
                  handlePlaceOrder
                }
                disabled={
                  submitting ||
                  cartItems.length === 0
                }
                className="mt-5 flex min-h-12 w-full items-center justify-center rounded-xl bg-green-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-green-700 hover:shadow-md disabled:cursor-not-allowed disabled:bg-green-400 sm:mt-6 sm:text-base"
              >
                {submitting
                  ? paymentMethod ===
                    "card"
                    ? "Preparing Payment..."
                    : "Placing Order..."
                  : paymentMethod ===
                      "card"
                    ? "Proceed to Payment"
                    : "Place Order"}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                <ShieldCheck
                  size={15}
                />

                <span>
                  Secure checkout
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Checkout;