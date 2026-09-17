import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import API_BASE_URL from "../config/api";

import { useAuth } from "../context/AuthContext";

type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

type PaymentStatus =
  | "pending"
  | "paid"
  | "failed";

interface Order {
  _id: string;

  items: {
    product: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }[];

  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
  };

  paymentMethod: "card" | "delivery";
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;

  totalAmount: number;

  paymentReference?: string;

  paidAt?: string;
  processedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;

  createdAt: string;
}

const API_URL = `${API_BASE_URL}/api/orders`;

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (value?: string) => {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleString(
    "en-NG",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
};

const OrderDetails = () => {
  const { id } = useParams<{
    id: string;
  }>();

  const { token } = useAuth();

  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!token || !id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await axios.get<{
          order: Order;
        }>(`${API_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrder(response.data.order);
      } catch (error) {
        console.error(
          "Unable to load order:",
          error,
        );

        if (axios.isAxiosError(error)) {
          setError(
            error.response?.data?.message ||
              "Unable to load this order.",
          );
        } else {
          setError(
            "Unable to load this order.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, token]);

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />

          <div className="mt-7 h-8 w-56 animate-pulse rounded bg-slate-200" />

          <div className="mt-3 h-4 w-48 animate-pulse rounded bg-slate-200" />

          <div className="mt-8 h-64 animate-pulse rounded-2xl bg-white shadow-sm" />

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.45fr_0.75fr]">
            <div className="h-80 animate-pulse rounded-2xl bg-white shadow-sm" />
            <div className="h-64 animate-pulse rounded-2xl bg-white shadow-sm" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-8 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-100 bg-white px-5 py-12 text-center shadow-sm sm:rounded-3xl sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <XCircle
              size={32}
              className="text-red-500"
            />
          </div>

          <h1 className="mt-5 text-xl font-bold text-slate-900 sm:text-2xl">
            Unable to load order
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
            {error ||
              "This order could not be found."}
          </p>

          <Link
            to="/orders"
            className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700"
          >
            <ArrowLeft size={17} />
            Back to My Orders
          </Link>
        </div>
      </main>
    );
  }

  const itemCount = order.items.reduce(
    (total, item) =>
      total + item.quantity,
    0,
  );

  const statusSteps = [
    {
      key: "pending",
      label: "Order placed",
      date: order.createdAt,
    },
    {
      key: "processing",
      label: "Processing",
      date: order.processedAt,
    },
    {
      key: "shipped",
      label: "Shipped",
      date: order.shippedAt,
    },
    {
      key: "delivered",
      label: "Delivered",
      date: order.deliveredAt,
    },
  ];

  const statusOrder: Record<
    Exclude<OrderStatus, "cancelled">,
    number
  > = {
    pending: 0,
    processing: 1,
    shipped: 2,
    delivered: 3,
  };

  const currentStep =
    order.orderStatus === "cancelled"
      ? -1
      : statusOrder[order.orderStatus];

  const orderStatusStyle: Record<
    OrderStatus,
    string
  > = {
    pending:
      "bg-amber-50 text-amber-700",
    processing:
      "bg-blue-50 text-blue-700",
    shipped:
      "bg-purple-50 text-purple-700",
    delivered:
      "bg-green-50 text-green-700",
    cancelled:
      "bg-red-50 text-red-700",
  };

  const paymentStatusStyle: Record<
    PaymentStatus,
    string
  > = {
    pending:
      "bg-slate-100 text-slate-600",
    paid:
      "bg-green-50 text-green-700",
    failed:
      "bg-red-50 text-red-700",
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-7 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-6xl">
        {/* Back */}
        <Link
          to="/orders"
          className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-green-600"
        >
          <ArrowLeft size={17} />
          Back to My Orders
        </Link>

        {/* Header */}
        <div className="mt-4 sm:mt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-600 sm:text-sm">
                Order Details
              </p>

              <h1 className="mt-1.5 wrap-break-word text-2xl font-bold tracking-tight text-slate-900 sm:mt-2 sm:text-3xl">
                Order #
                {order._id
                  .slice(-8)
                  .toUpperCase()}
              </h1>

              <p className="mt-2 text-xs leading-5 text-slate-500 sm:text-sm">
                Placed{" "}
                {formatDate(
                  order.createdAt,
                )}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize sm:px-4 sm:py-2 sm:text-sm ${
                  orderStatusStyle[
                    order.orderStatus
                  ]
                }`}
              >
                {order.orderStatus}
              </span>

              <span
                className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize sm:px-4 sm:py-2 sm:text-sm ${
                  paymentStatusStyle[
                    order.paymentStatus
                  ]
                }`}
              >
                Payment{" "}
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Cancelled */}
        {order.orderStatus ===
          "cancelled" && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 sm:mt-7 sm:p-5">
            <div className="flex items-start gap-3">
              <XCircle
                size={20}
                className="mt-0.5 shrink-0 text-red-500"
              />

              <div>
                <p className="text-sm font-bold text-red-700 sm:text-base">
                  This order was cancelled
                </p>

                {order.cancelledAt && (
                  <p className="mt-1 text-xs leading-5 text-red-600 sm:text-sm">
                    Cancelled{" "}
                    {formatDate(
                      order.cancelledAt,
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Order Progress */}
        {order.orderStatus !==
          "cancelled" && (
          <section className="mt-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:mt-8 sm:rounded-3xl sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <Truck size={20} />
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                  Order Progress
                </h2>

                <p className="mt-0.5 text-xs text-slate-500 sm:hidden">
                  Follow your order status
                </p>
              </div>
            </div>

            {/* Mobile Vertical Timeline */}
            <div className="mt-6 md:hidden">
              {statusSteps.map(
                (step, index) => {
                  const complete =
                    index <= currentStep;

                  const isLast =
                    index ===
                    statusSteps.length -
                      1;

                  return (
                    <div
                      key={step.key}
                      className="relative flex gap-3"
                    >
                      {/* Line + Circle */}
                      <div className="flex w-10 shrink-0 flex-col items-center">
                        <div
                          className={`z-10 flex h-9 w-9 items-center justify-center rounded-full ${
                            complete
                              ? "bg-green-600 text-white"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {complete ? (
                            <CheckCircle2
                              size={17}
                            />
                          ) : (
                            <Clock3
                              size={16}
                            />
                          )}
                        </div>

                        {!isLast && (
                          <div
                            className={`min-h-12 w-0.5 flex-1 ${
                              index <
                              currentStep
                                ? "bg-green-500"
                                : "bg-slate-200"
                            }`}
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div
                        className={`min-w-0 flex-1 ${
                          !isLast
                            ? "pb-6"
                            : ""
                        }`}
                      >
                        <p
                          className={`pt-2 text-sm font-bold ${
                            complete
                              ? "text-slate-900"
                              : "text-slate-400"
                          }`}
                        >
                          {step.label}
                        </p>

                        {step.date ? (
                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {formatDate(
                              step.date,
                            )}
                          </p>
                        ) : (
                          <p className="mt-1 text-xs text-slate-400">
                            Pending
                          </p>
                        )}
                      </div>
                    </div>
                  );
                },
              )}
            </div>

            {/* Desktop Timeline */}
            <div className="mt-7 hidden grid-cols-4 gap-5 md:grid">
              {statusSteps.map(
                (step, index) => {
                  const complete =
                    index <= currentStep;

                  return (
                    <div
                      key={step.key}
                      className="relative"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                            complete
                              ? "bg-green-600 text-white"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {complete ? (
                            <CheckCircle2
                              size={19}
                            />
                          ) : (
                            <Clock3
                              size={18}
                            />
                          )}
                        </div>

                        <div>
                          <p
                            className={`text-sm font-semibold ${
                              complete
                                ? "text-slate-900"
                                : "text-slate-400"
                            }`}
                          >
                            {step.label}
                          </p>

                          {step.date && (
                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              {formatDate(
                                step.date,
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </section>
        )}

        {/* Main Content */}
        <div className="mt-6 grid gap-5 sm:mt-7 sm:gap-7 lg:grid-cols-[1.45fr_0.75fr]">
          <div className="min-w-0 space-y-5 sm:space-y-7">
            {/* Products */}
            <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm sm:rounded-3xl">
              <div className="border-b border-slate-100 px-4 py-4 sm:px-7 sm:py-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Package
                      size={19}
                      className="text-green-600"
                    />

                    <h2 className="font-bold text-slate-900">
                      Items
                    </h2>
                  </div>

                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                    {itemCount}{" "}
                    {itemCount === 1
                      ? "item"
                      : "items"}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {order.items.map(
                  (item) => (
                    <div
                      key={
                        item.product
                      }
                      className="p-4 sm:p-7"
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        {/* Image */}
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:rounded-2xl">
                          {item.image ? (
                            <img
                              src={
                                item.image
                              }
                              alt={
                                item.name
                              }
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Package
                                size={24}
                                className="text-slate-400"
                              />
                            </div>
                          )}
                        </div>

                        {/* Information */}
                        <div className="min-w-0 flex-1">
                          <h3 className="line-clamp-2 text-sm font-bold leading-5 text-slate-900 sm:text-base">
                            {item.name}
                          </h3>

                          <p className="mt-1.5 text-xs text-slate-500 sm:text-sm">
                            Qty:{" "}
                            {item.quantity}
                          </p>

                          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                            {formatCurrency(
                              item.price,
                            )}{" "}
                            each
                          </p>

                          <p className="mt-2 text-sm font-extrabold text-slate-900 sm:hidden">
                            {formatCurrency(
                              item.price *
                                item.quantity,
                            )}
                          </p>
                        </div>

                        {/* Desktop Total */}
                        <p className="hidden shrink-0 font-bold text-slate-900 sm:block">
                          {formatCurrency(
                            item.price *
                              item.quantity,
                          )}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </section>

            {/* Shipping */}
            <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <MapPin size={19} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Delivery Information
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Shipping destination
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                <p className="font-bold text-slate-900">
                  {
                    order.shippingAddress
                      .fullName
                  }
                </p>

                <p className="mt-1">
                  {
                    order.shippingAddress
                      .address
                  }
                </p>

                <p>
                  {
                    order.shippingAddress
                      .city
                  }
                  ,{" "}
                  {
                    order.shippingAddress
                      .state
                  }
                </p>

                <div className="my-3 border-t border-slate-200" />

                <p className="wrap-break-word">
                  {
                    order.shippingAddress
                      .phone
                  }
                </p>

                <p className="break-all">
                  {
                    order.shippingAddress
                      .email
                  }
                </p>
              </div>
            </section>
          </div>

          {/* Right */}
          <div className="min-w-0 space-y-5 sm:space-y-7">
            {/* Payment */}
            <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <CreditCard
                    size={19}
                  />
                </div>

                <h2 className="font-bold text-slate-900">
                  Payment
                </h2>
              </div>

              <div className="mt-5 space-y-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">
                    Method
                  </span>

                  <span className="text-right font-semibold text-slate-900">
                    {order.paymentMethod ===
                    "card"
                      ? "Card"
                      : "Pay on Delivery"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">
                    Status
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${
                      paymentStatusStyle[
                        order.paymentStatus
                      ]
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>

                {order.paidAt && (
                  <div className="flex items-start justify-between gap-4 border-t border-slate-100 pt-4">
                    <span className="shrink-0 text-slate-500">
                      Paid
                    </span>

                    <span className="text-right text-xs font-medium leading-5 text-slate-700 sm:text-sm">
                      {formatDate(
                        order.paidAt,
                      )}
                    </span>
                  </div>
                )}

                {order.paymentReference && (
                  <div className="flex items-start justify-between gap-4 border-t border-slate-100 pt-4">
                    <span className="shrink-0 text-slate-500">
                      Reference
                    </span>

                    <span className="max-w-[65%] break-all text-right text-xs font-medium text-slate-700">
                      {
                        order.paymentReference
                      }
                    </span>
                  </div>
                )}
              </div>
            </section>

            {/* Summary */}
            <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
              <div className="flex items-center gap-3">
                <ShoppingBag
                  size={19}
                  className="text-green-600"
                />

                <h2 className="font-bold text-slate-900">
                  Order Summary
                </h2>
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">
                    Items
                  </span>

                  <span className="font-semibold text-slate-700">
                    {itemCount}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">
                    Delivery
                  </span>

                  <span className="font-semibold text-green-600">
                    Free
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-end justify-between gap-4">
                    <span className="font-bold text-slate-700">
                      Total
                    </span>

                    <span className="text-xl font-extrabold text-green-600 sm:text-2xl">
                      {formatCurrency(
                        order.totalAmount,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Continue Shopping */}
            <Link
              to="/shop"
              className="flex min-h-12 w-full items-center justify-center rounded-xl bg-green-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-green-700 hover:shadow-md"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderDetails;