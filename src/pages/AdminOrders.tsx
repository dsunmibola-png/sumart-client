import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axios from "axios";
import {
  CheckCircle2,
  Clock3,
  Filter,
  Package,
  RefreshCcw,
  RotateCcw,
  Search,
  Truck,
} from "lucide-react";

import API_BASE_URL from "../config/api";

import {
  Link,
  useLocation,
} from "react-router-dom";

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

interface AdminOrder {
  _id: string;

  user?: {
    _id: string;
    name: string;
    email: string;
  };

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

  paymentMethod:
    | "card"
    | "delivery";

  paymentStatus:
    PaymentStatus;

  orderStatus:
    OrderStatus;

  totalAmount: number;
  createdAt: string;
}

type OrderStatusFilter =
  | "all"
  | OrderStatus;

type PaymentStatusFilter =
  | "all"
  | PaymentStatus;

interface OrdersLocationState {
  restoreOrderId?: string;
}

const API_URL =
  `${API_BASE_URL}/api/orders/admin`;

const statusLabels: Record<
  OrderStatus,
  string
> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const getAvailableStatuses = (
  order: AdminOrder
): OrderStatus[] => {
  switch (order.orderStatus) {
    case "pending":
      return [
        "processing",
        "cancelled",
      ];

    case "processing":
      return [
        "shipped",
        "cancelled",
      ];

    case "shipped":
      return [
        "delivered",
      ];

    case "delivered":
    case "cancelled":
    default:
      return [];
  }
};

const AdminOrders = () => {
  const { token } = useAuth();

  const location =
    useLocation();

  const restoreHandled =
    useRef(false);

  const [orders, setOrders] =
    useState<AdminOrder[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    updatingId,
    setUpdatingId,
  ] =
    useState<string | null>(
      null
    );

  const [error, setError] =
    useState("");

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const [
    orderStatusFilter,
    setOrderStatusFilter,
  ] =
    useState<OrderStatusFilter>(
      "all"
    );

  const [
    paymentStatusFilter,
    setPaymentStatusFilter,
  ] =
    useState<PaymentStatusFilter>(
      "all"
    );

  const fetchOrders =
    async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setError("");
        setLoading(true);

        const response =
          await axios.get<{
            orders: AdminOrder[];
          }>(
            `${API_URL}/all`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setOrders(
          response.data.orders
        );
      } catch (error) {
        console.error(
          "Unable to fetch orders:",
          error
        );

        if (
          axios.isAxiosError(
            error
          )
        ) {
          setError(
            error.response
              ?.data?.message ||
              "Unable to load orders."
          );
        } else {
          setError(
            "Unable to load orders."
          );
        }
      } finally {
        setLoading(false);
      }
    };

  // Load orders
  useEffect(() => {
    fetchOrders();
  }, [token]);

  // Restore exact order after returning
  // from the View Details page.
  useEffect(() => {
    if (
      loading ||
      restoreHandled.current
    ) {
      return;
    }

    const state =
      location.state as
        | OrdersLocationState
        | null;

    if (
      !state?.restoreOrderId
    ) {
      return;
    }

    restoreHandled.current =
      true;

    const timer =
      window.setTimeout(
        () => {
          const element =
            document.getElementById(
              `order-${state.restoreOrderId}`
            );

          if (!element) {
            return;
          }

          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        },
        100
      );

    return () => {
      window.clearTimeout(
        timer
      );
    };
  }, [
    loading,
    location.state,
  ]);

  const handleStatusChange =
    async (
      order: AdminOrder,
      status: OrderStatus
    ) => {
      if (!token) {
        return;
      }

      if (
        order.orderStatus ===
        status
      ) {
        return;
      }

      // Prevent unpaid card orders
      // from entering processing.
      if (
        status ===
          "processing" &&
        order.paymentMethod ===
          "card" &&
        order.paymentStatus !==
          "paid"
      ) {
        setError(
          "This card order cannot be processed until payment has been confirmed."
        );

        return;
      }

      // Cancellation restores stock,
      // so confirm first.
      if (
        status ===
        "cancelled"
      ) {
        const confirmed =
          window.confirm(
            "Are you sure you want to cancel this order? The reserved product stock will be restored."
          );

        if (!confirmed) {
          return;
        }
      }

      try {
        setUpdatingId(
          order._id
        );

        setError("");

        const response =
          await axios.patch<{
            order: AdminOrder;
          }>(
            `${API_URL}/${order._id}/status`,
            {
              status,
            },
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setOrders(
          (current) =>
            current.map(
              (currentOrder) =>
                currentOrder._id ===
                order._id
                  ? {
                      ...currentOrder,
                      ...response
                        .data
                        .order,
                    }
                  : currentOrder
            )
        );
      } catch (error) {
        console.error(
          "Unable to update order:",
          error
        );

        if (
          axios.isAxiosError(
            error
          )
        ) {
          setError(
            error.response
              ?.data?.message ||
              "Unable to update order status."
          );
        } else {
          setError(
            "Unable to update order status."
          );
        }
      } finally {
        setUpdatingId(
          null
        );
      }
    };

  // Search + filters
  const filteredOrders =
    useMemo(() => {
      const query =
        searchQuery
          .trim()
          .toLowerCase();

      return orders.filter(
        (order) => {
          const customerName =
            order.user?.name ||
            order
              .shippingAddress
              .fullName ||
            "";

          const customerEmail =
            order.user?.email ||
            order
              .shippingAddress
              .email ||
            "";

          const matchesSearch =
            !query ||
            order._id
              .toLowerCase()
              .includes(
                query
              ) ||
            customerName
              .toLowerCase()
              .includes(
                query
              ) ||
            customerEmail
              .toLowerCase()
              .includes(
                query
              ) ||
            order
              .shippingAddress
              .phone
              .toLowerCase()
              .includes(
                query
              );

          const matchesOrderStatus =
            orderStatusFilter ===
              "all" ||
            order.orderStatus ===
              orderStatusFilter;

          const matchesPaymentStatus =
            paymentStatusFilter ===
              "all" ||
            order.paymentStatus ===
              paymentStatusFilter;

          return (
            matchesSearch &&
            matchesOrderStatus &&
            matchesPaymentStatus
          );
        }
      );
    }, [
      orders,
      searchQuery,
      orderStatusFilter,
      paymentStatusFilter,
    ]);

  // Dashboard statistics
  const stats =
    useMemo(() => {
      const totalRevenue =
        orders
          .filter(
            (order) =>
              order.paymentStatus ===
                "paid" &&
              order.orderStatus !==
                "cancelled"
          )
          .reduce(
            (
              total,
              order
            ) =>
              total +
              order.totalAmount,
            0
          );

      const pending =
        orders.filter(
          (order) =>
            order.orderStatus ===
            "pending"
        ).length;

      const processing =
        orders.filter(
          (order) =>
            order.orderStatus ===
            "processing"
        ).length;

      const delivered =
        orders.filter(
          (order) =>
            order.orderStatus ===
            "delivered"
        ).length;

      return {
        total:
          orders.length,

        totalRevenue,

        pending,

        processing,

        delivered,
      };
    }, [orders]);

  const filtersActive =
    searchQuery.trim() !==
      "" ||
    orderStatusFilter !==
      "all" ||
    paymentStatusFilter !==
      "all";

  const clearFilters =
    () => {
      setSearchQuery("");

      setOrderStatusFilter(
        "all"
      );

      setPaymentStatusFilter(
        "all"
      );
    };

  const orderStatusStyle: Record<
    OrderStatus,
    string
  > = {
    pending:
      "bg-amber-500/10 text-amber-400 border border-amber-500/20",

    processing:
      "bg-blue-500/10 text-blue-400 border border-blue-500/20",

    shipped:
      "bg-purple-500/10 text-purple-400 border border-purple-500/20",

    delivered:
      "bg-green-500/10 text-green-400 border border-green-500/20",

    cancelled:
      "bg-red-500/10 text-red-400 border border-red-500/20",
  };

  const paymentStatusStyle: Record<
    PaymentStatus,
    string
  > = {
    pending:
      "bg-slate-700/50 text-slate-300 border border-slate-600",

    paid:
      "bg-green-500/10 text-green-400 border border-green-500/20",

    failed:
      "bg-red-500/10 text-red-400 border border-red-500/20",
  };
  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950 px-4 lg:min-h-screen">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-green-500" />

          <p className="mt-4 text-sm text-slate-400">
            Loading admin orders...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-white sm:px-6 sm:py-7 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl">
        {/* ======================================
            HEADER
        ======================================= */}

        <div className="flex flex-col gap-4 sm:gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-green-400 sm:text-sm">
              SUMART Admin
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              Order Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:mt-3 sm:text-base">
              Search, filter and manage customer
              orders and delivery progress.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchOrders}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-green-500/50 hover:text-green-400 sm:w-fit"
          >
            <RefreshCcw size={17} />

            Refresh
          </button>
        </div>

        {/* ======================================
            ERROR
        ======================================= */}

        {error && (
          <div
            role="alert"
            className="mt-5 wrap-break-word rounded-2xl border border-red-900/60 bg-red-950/40 px-4 py-4 text-sm font-medium leading-6 text-red-300 sm:mt-6 sm:px-5"
          >
            {error}
          </div>
        )}

        {/* ======================================
            STATISTICS
        ======================================= */}

        <section className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 xl:grid-cols-5">
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
            <p className="text-xs text-slate-500 sm:text-sm">
              Total Orders
            </p>

            <p className="mt-2 text-2xl font-bold sm:text-3xl">
              {stats.total}
            </p>
          </article>

          <article className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
            <p className="text-xs text-slate-500 sm:text-sm">
              Revenue
            </p>

            <p className="mt-2 wrap-break-word text-lg font-bold text-green-400 sm:text-2xl">
              ₦
              {stats.totalRevenue.toLocaleString()}
            </p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
            <p className="text-xs text-slate-500 sm:text-sm">
              Pending
            </p>

            <p className="mt-2 text-2xl font-bold text-amber-400 sm:text-3xl">
              {stats.pending}
            </p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
            <p className="text-xs text-slate-500 sm:text-sm">
              Processing
            </p>

            <p className="mt-2 text-2xl font-bold text-blue-400 sm:text-3xl">
              {stats.processing}
            </p>
          </article>

          <article className="col-span-2 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:col-span-1 sm:p-5">
            <p className="text-xs text-slate-500 sm:text-sm">
              Delivered
            </p>

            <p className="mt-2 text-2xl font-bold text-green-400 sm:text-3xl">
              {stats.delivered}
            </p>
          </article>
        </section>

        {/* ======================================
            SEARCH + FILTERS
        ======================================= */}

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:mt-8 sm:p-5">
          <div className="flex items-center gap-2">
            <Filter
              size={18}
              className="text-green-400"
            />

            <h2 className="font-bold">
              Find Orders
            </h2>
          </div>

          <div className="mt-4 grid gap-3 sm:mt-5 sm:gap-4 lg:grid-cols-[1fr_220px_220px_auto]">
            {/* Search */}

            <div className="flex min-h-12 min-w-0 items-center rounded-xl border border-slate-700 bg-slate-950 px-3 transition focus-within:border-green-500 sm:px-4">
              <Search
                size={18}
                className="shrink-0 text-slate-500"
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value
                  )
                }
                placeholder="Order ID, customer, email or phone..."
                className="min-w-0 w-full bg-transparent px-3 py-3 text-base text-white outline-none placeholder:text-slate-600 sm:text-sm"
              />
            </div>

            {/* Order status */}

            <select
              value={orderStatusFilter}
              onChange={(event) =>
                setOrderStatusFilter(
                  event.target
                    .value as OrderStatusFilter
                )
              }
              className="min-h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base font-semibold text-slate-300 outline-none transition focus:border-green-500 sm:text-sm"
            >
              <option value="all">
                All Order Statuses
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="processing">
                Processing
              </option>

              <option value="shipped">
                Shipped
              </option>

              <option value="delivered">
                Delivered
              </option>

              <option value="cancelled">
                Cancelled
              </option>
            </select>

            {/* Payment status */}

            <select
              value={paymentStatusFilter}
              onChange={(event) =>
                setPaymentStatusFilter(
                  event.target
                    .value as PaymentStatusFilter
                )
              }
              className="min-h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base font-semibold text-slate-300 outline-none transition focus:border-green-500 sm:text-sm"
            >
              <option value="all">
                All Payments
              </option>

              <option value="paid">
                Paid
              </option>

              <option value="pending">
                Payment Pending
              </option>

              <option value="failed">
                Failed
              </option>
            </select>

            <button
              type="button"
              onClick={clearFilters}
              disabled={!filtersActive}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-red-500/40 hover:bg-red-500/5 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40 lg:w-auto"
            >
              <RotateCcw size={16} />

              Clear
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-4">
            <p className="text-xs text-slate-500 sm:text-sm">
              Showing{" "}
              <span className="font-semibold text-white">
                {filteredOrders.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-white">
                {orders.length}
              </span>{" "}
              orders
            </p>

            {filtersActive && (
              <p className="text-xs font-medium text-green-400">
                Filters active
              </p>
            )}
          </div>
        </section>

        {/* ======================================
            EMPTY STATE
        ======================================= */}

        {filteredOrders.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-10 text-center sm:mt-6 sm:p-14">
            <Package
              size={40}
              className="mx-auto text-slate-700 sm:h-11 sm:w-11"
            />

            <h2 className="mt-4 text-lg font-bold sm:mt-5 sm:text-xl">
              {orders.length === 0
                ? "No orders yet"
                : "No matching orders"}
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              {orders.length === 0
                ? "Customer orders will appear here."
                : "Try changing your search or filters."}
            </p>

            {filtersActive &&
              orders.length > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-green-400"
                >
                  <RotateCcw
                    size={16}
                  />

                  Clear Filters
                </button>
              )}
          </div>
        ) : (
          /* ====================================
             ORDER CARDS
          ===================================== */

          <div className="mt-5 space-y-4 sm:mt-6 sm:space-y-5">
            {filteredOrders.map(
              (order) => {
                const createdDate =
                  new Date(
                    order.createdAt
                  ).toLocaleString(
                    "en-NG",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  );

                const itemCount =
                  order.items.reduce(
                    (
                      total,
                      item
                    ) =>
                      total +
                      item.quantity,
                    0
                  );

                const customerName =
                  order.user?.name ||
                  order
                    .shippingAddress
                    .fullName;

                const customerEmail =
                  order.user?.email ||
                  order
                    .shippingAddress
                    .email;

                const availableStatuses =
                  getAvailableStatuses(
                    order
                  );

                const isFinal =
                  order.orderStatus ===
                    "delivered" ||
                  order.orderStatus ===
                    "cancelled";

                const cardPaymentBlocked =
                  order.orderStatus ===
                    "pending" &&
                  order.paymentMethod ===
                    "card" &&
                  order.paymentStatus !==
                    "paid";

                return (
                  <article
                    key={order._id}
                    id={`order-${order._id}`}
                    className="scroll-mt-24 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg transition hover:border-slate-700 lg:scroll-mt-6"
                  >
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between xl:gap-6">
                        {/* ======================
                            ORDER INFORMATION
                        ======================= */}

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-sm font-bold text-white sm:text-base">
                              Order #
                              {order._id
                                .slice(-8)
                                .toUpperCase()}
                            </h2>

                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize sm:px-3 sm:text-xs ${
                                orderStatusStyle[
                                  order.orderStatus
                                ]
                              }`}
                            >
                              {
                                order.orderStatus
                              }
                            </span>

                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize sm:px-3 sm:text-xs ${
                                paymentStatusStyle[
                                  order.paymentStatus
                                ]
                              }`}
                            >
                              {
                                order.paymentStatus
                              }
                            </span>
                          </div>

                          {/* Order metadata */}

                          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500 sm:flex sm:flex-wrap sm:gap-x-5 sm:gap-y-2 sm:text-sm">
                            <span className="col-span-2 inline-flex min-w-0 items-center gap-1.5 sm:col-span-1">
                              <Clock3
                                size={14}
                                className="shrink-0"
                              />

                              <span className="truncate">
                                {
                                  createdDate
                                }
                              </span>
                            </span>

                            <span>
                              {
                                itemCount
                              }{" "}
                              {itemCount === 1
                                ? "item"
                                : "items"}
                            </span>

                            <span className="text-right sm:text-left">
                              {order.paymentMethod ===
                              "delivery"
                                ? "Pay on Delivery"
                                : "Card Payment"}
                            </span>
                          </div>

                          {/* Customer */}

                          <div className="mt-4 rounded-xl bg-slate-950/50 p-3 sm:bg-transparent sm:p-0">
                            <p className="truncate text-sm font-semibold text-white">
                              {
                                customerName
                              }
                            </p>

                            <p className="mt-1 break-all text-xs text-slate-500 sm:break-normal sm:text-sm">
                              {
                                customerEmail
                              }
                            </p>

                            <p className="mt-1 text-xs text-slate-600">
                              {
                                order
                                  .shippingAddress
                                  .phone
                              }
                            </p>
                          </div>
                        </div>

                        {/* ======================
                            TOTAL + ACTIONS
                        ======================= */}

                        <div className="border-t border-slate-800 pt-4 xl:min-w-55 xl:border-0 xl:pt-0">
                          <div className="flex items-center justify-between gap-3 xl:block xl:text-right">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                              Total
                            </p>

                            <p className="text-lg font-bold text-white sm:text-xl xl:mt-1">
                              ₦
                              {order.totalAmount.toLocaleString()}
                            </p>
                          </div>

                          {/* Actions */}

                          <div className="mt-4">
                            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
                              Order Actions
                            </p>

                            {isFinal ? (
                              <div className="flex min-h-11 items-center rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-400">
                                {order.orderStatus ===
                                "delivered"
                                  ? "Order completed"
                                  : "Order cancelled"}
                              </div>
                            ) : (
                              <div className="flex flex-col gap-2">
                                {availableStatuses.map(
                                  (
                                    status
                                  ) => {
                                    const isCancel =
                                      status ===
                                      "cancelled";

                                    const blocked =
                                      status ===
                                        "processing" &&
                                      cardPaymentBlocked;

                                    return (
                                      <button
                                        key={
                                          status
                                        }
                                        type="button"
                                        disabled={
                                          updatingId ===
                                            order._id ||
                                          blocked
                                        }
                                        onClick={() =>
                                          handleStatusChange(
                                            order,
                                            status
                                          )
                                        }
                                        className={`min-h-11 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                                          isCancel
                                            ? "border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/15"
                                            : "bg-green-500 text-slate-950 hover:bg-green-400"
                                        }`}
                                      >
                                        {updatingId ===
                                        order._id
                                          ? "Updating..."
                                          : isCancel
                                            ? "Cancel Order"
                                            : `Mark as ${statusLabels[status]}`}
                                      </button>
                                    );
                                  }
                                )}

                                {cardPaymentBlocked && (
                                  <p className="rounded-lg bg-amber-500/5 px-3 py-2 text-xs leading-5 text-amber-400">
                                    Payment must be
                                    confirmed before
                                    processing.
                                  </p>
                                )}
                              </div>
                            )}

                            <Link
                              to={`/admin/orders/${order._id}`}
                              state={{
                                fromOrders:
                                  true,
                                orderId:
                                  order._id,
                              }}
                              className="mt-2 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-green-500/50 hover:bg-green-500/5 hover:text-green-400"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ==========================
                        BOTTOM INFORMATION
                    =========================== */}

                    <div className="grid grid-cols-3 gap-2 border-t border-slate-800 bg-slate-950/40 px-3 py-4 sm:gap-4 sm:px-6 sm:py-5">
                      {/* Products */}

                      <div className="flex min-w-0 flex-col items-center text-center sm:flex-row sm:items-center sm:gap-3 sm:text-left">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 sm:h-9 sm:w-9">
                          <Package
                            size={16}
                            className="text-slate-400"
                          />
                        </div>

                        <div className="mt-1.5 min-w-0 sm:mt-0">
                          <p className="text-[9px] text-slate-500 sm:text-xs">
                            Products
                          </p>

                          <p className="truncate text-[11px] font-semibold text-slate-300 sm:text-sm">
                            {
                              itemCount
                            }{" "}
                            {itemCount === 1
                              ? "item"
                              : "items"}
                          </p>
                        </div>
                      </div>

                      {/* Payment */}

                      <div className="flex min-w-0 flex-col items-center text-center sm:flex-row sm:items-center sm:gap-3 sm:text-left">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 sm:h-9 sm:w-9">
                          <CheckCircle2
                            size={16}
                            className={
                              order.paymentStatus ===
                              "paid"
                                ? "text-green-400"
                                : order.paymentStatus ===
                                    "failed"
                                  ? "text-red-400"
                                  : "text-slate-400"
                            }
                          />
                        </div>

                        <div className="mt-1.5 min-w-0 sm:mt-0">
                          <p className="text-[9px] text-slate-500 sm:text-xs">
                            Payment
                          </p>

                          <p className="truncate text-[11px] font-semibold capitalize text-slate-300 sm:text-sm">
                            {
                              order.paymentStatus
                            }
                          </p>
                        </div>
                      </div>

                      {/* Delivery */}

                      <div className="flex min-w-0 flex-col items-center text-center sm:flex-row sm:items-center sm:gap-3 sm:text-left">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 sm:h-9 sm:w-9">
                          <Truck
                            size={16}
                            className="text-slate-400"
                          />
                        </div>

                        <div className="mt-1.5 min-w-0 sm:mt-0">
                          <p className="text-[9px] text-slate-500 sm:text-xs">
                            Delivery
                          </p>

                          <p className="truncate text-[11px] font-semibold capitalize text-slate-300 sm:text-sm">
                            {
                              order.orderStatus
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminOrders;