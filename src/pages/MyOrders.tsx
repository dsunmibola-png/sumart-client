import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  CreditCard,
  Package,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import {
  getMyOrders,
  type Order,
} from "../services/orderService";

const MyOrders = () => {
  const { token } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setError(
          "You must be logged in to view your orders.",
        );
        setLoading(false);
        return;
      }

      try {
        const data = await getMyOrders(token);
        setOrders(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const orderStatusStyle: Record<
    Order["orderStatus"],
    string
  > = {
    pending: "bg-amber-50 text-amber-700",
    processing: "bg-blue-50 text-blue-700",
    shipped: "bg-purple-50 text-purple-700",
    delivered: "bg-green-50 text-green-700",
    cancelled: "bg-red-50 text-red-700",
  };

  const paymentStatusStyle: Record<
    Order["paymentStatus"],
    string
  > = {
    pending: "bg-slate-100 text-slate-600",
    paid: "bg-green-50 text-green-700",
    failed: "bg-red-50 text-red-700",
  };

  // Loading
  if (loading) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 sm:mb-10">
            <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
            <div className="mt-3 h-8 w-44 animate-pulse rounded bg-slate-200 sm:h-10" />
            <div className="mt-3 h-4 w-72 max-w-full animate-pulse rounded bg-slate-200" />
          </div>

          <div className="space-y-3 sm:space-y-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6"
              >
                <div className="flex gap-3">
                  <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-slate-100" />

                  <div className="flex-1">
                    <div className="h-4 w-36 animate-pulse rounded bg-slate-100" />
                    <div className="mt-3 h-3 w-52 max-w-full animate-pulse rounded bg-slate-100" />
                  </div>
                </div>

                <div className="mt-5 h-12 animate-pulse rounded-xl bg-slate-50" />
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Error
  if (error) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-8 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-xl rounded-2xl border border-slate-100 bg-white px-5 py-12 text-center shadow-sm sm:rounded-3xl sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
            <Package
              size={30}
              className="text-slate-300"
            />
          </div>

          <h1 className="mt-5 text-xl font-bold text-slate-900 sm:text-2xl">
            Unable to load orders
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500 sm:text-base">
            {error}
          </p>
        </div>
      </main>
    );
  }

  // Empty
  if (orders.length === 0) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-8 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-100 bg-white px-5 py-14 text-center shadow-sm sm:rounded-3xl sm:px-6 sm:py-16">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600 sm:h-20 sm:w-20">
            <ShoppingBag
              size={30}
              className="sm:h-9 sm:w-9"
            />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900 sm:mt-6 sm:text-3xl">
            No orders yet
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
            When you place an order on SUMART,
            it will appear here.
          </p>

          <Link
            to="/shop"
            className="mt-7 inline-flex min-h-12 w-full max-w-xs items-center justify-center rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-700 sm:mt-8 sm:w-auto sm:text-base"
          >
            Start Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-7 sm:px-6 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-600 sm:text-sm">
                SUMART Account
              </p>

              <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:mt-2 sm:text-3xl lg:text-4xl">
                My Orders
              </h1>
            </div>

            {/* Mobile Order Count */}
            <span className="shrink-0 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700 sm:hidden">
              {orders.length}{" "}
              {orders.length === 1
                ? "order"
                : "orders"}
            </span>
          </div>

          <p className="mt-2 text-sm leading-6 text-slate-500 sm:mt-3 sm:text-base">
            Track your purchases, payments and
            delivery status.
          </p>
        </div>

        {/* Orders */}
        <div className="space-y-3 sm:space-y-5">
          {orders.map((order) => {
            const createdDate = new Date(
              order.createdAt,
            ).toLocaleDateString("en-NG", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            const itemCount =
              order.items.reduce(
                (total, item) =>
                  total + item.quantity,
                0,
              );

            const paymentLabel =
              order.paymentStatus === "paid"
                ? "Paid"
                : order.paymentStatus ===
                    "failed"
                  ? "Payment Failed"
                  : "Payment Pending";

            return (
              <Link
                key={order._id}
                to={`/orders/${order._id}`}
                className="group block overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-200 hover:border-green-200 hover:shadow-lg"
              >
                {/* Main Card */}
                <div className="p-4 sm:p-6">
                  {/* Top */}
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600 sm:h-12 sm:w-12">
                      <Package size={20} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 sm:hidden">
                            Order
                          </p>

                          <h2 className="truncate text-sm font-bold text-slate-900 sm:text-base">
                            #{order._id.slice(-8)}
                          </h2>
                        </div>

                        <div className="text-right sm:hidden">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                            Total
                          </p>

                          <p className="mt-0.5 text-base font-extrabold text-slate-900">
                            ₦
                            {order.totalAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div className="mt-2.5 flex flex-wrap gap-1.5 sm:mt-2 sm:gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold capitalize sm:px-3 sm:text-xs ${
                            orderStatusStyle[
                              order.orderStatus
                            ]
                          }`}
                        >
                          {order.orderStatus}
                        </span>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold sm:px-3 sm:text-xs ${
                            paymentStatusStyle[
                              order.paymentStatus
                            ]
                          }`}
                        >
                          {paymentLabel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Details */}
                  <div className="mt-4 grid grid-cols-2 gap-2 sm:hidden">
                    <div className="rounded-xl bg-slate-50 px-3 py-2.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        <Clock3 size={12} />
                        Date
                      </div>

                      <p className="mt-1 text-xs font-semibold text-slate-700">
                        {createdDate}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 px-3 py-2.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        <ShoppingBag size={12} />
                        Items
                      </div>

                      <p className="mt-1 text-xs font-semibold text-slate-700">
                        {itemCount}{" "}
                        {itemCount === 1
                          ? "item"
                          : "items"}
                      </p>
                    </div>

                    <div className="col-span-2 rounded-xl bg-slate-50 px-3 py-2.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        <CreditCard size={12} />
                        Payment Method
                      </div>

                      <p className="mt-1 text-xs font-semibold text-slate-700">
                        {order.paymentMethod ===
                        "delivery"
                          ? "Pay on Delivery"
                          : "Card Payment"}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Payment Confirmation */}
                  {order.paymentStatus ===
                    "paid" && (
                    <div className="mt-3 flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2.5 text-xs font-semibold text-green-700 sm:hidden">
                      <CheckCircle2
                        size={15}
                      />
                      Payment confirmed
                    </div>
                  )}

                  {/* Desktop */}
                  <div className="mt-4 hidden items-end justify-between gap-6 sm:flex">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 size={15} />
                        {createdDate}
                      </span>

                      <span>
                        {itemCount}{" "}
                        {itemCount === 1
                          ? "item"
                          : "items"}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <CreditCard
                          size={15}
                        />

                        {order.paymentMethod ===
                        "delivery"
                          ? "Pay on Delivery"
                          : "Card Payment"}
                      </span>

                      {order.paymentStatus ===
                        "paid" && (
                        <span className="inline-flex items-center gap-1.5 font-medium text-green-600">
                          <CheckCircle2
                            size={15}
                          />
                          Payment confirmed
                        </span>
                      )}
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Total
                      </p>

                      <p className="mt-1 text-xl font-bold text-slate-900">
                        ₦
                        {order.totalAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mobile View Details */}
                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-4 py-3 text-sm font-bold text-green-700 sm:hidden">
                  <span>
                    View order details
                  </span>

                  <ArrowRight
                    size={17}
                  />
                </div>

                {/* Desktop Arrow */}
                <div className="hidden border-t border-slate-100 px-6 py-3 sm:flex sm:justify-end">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition group-hover:text-green-600">
                    View details
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default MyOrders;