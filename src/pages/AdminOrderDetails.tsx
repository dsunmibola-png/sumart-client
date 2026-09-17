import {
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  Package,
  Phone,
  Truck,
  User,
} from "lucide-react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

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

  paymentReference?: string;
  paidAt?: string;

  processedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;

  createdAt: string;
  updatedAt: string;
}

const API_URL = `${API_BASE_URL}/api/orders/admin`;

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

const formatDateTime = (
  value?: string
) => {
  if (!value) {
    return null;
  }

  return new Date(
    value
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
};

const AdminOrderDetails = () => {
  const { id } =
    useParams<{
      id: string;
    }>();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const { token } =
    useAuth();

  const [order, setOrder] =
    useState<AdminOrder | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [
    updating,
    setUpdating,
  ] = useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [id]);

  useEffect(() => {
    const fetchOrder =
      async () => {
        if (!token || !id) {
          setLoading(false);
          return;
        }

        try {
          setLoading(true);
          setError("");

          const response =
            await axios.get<{
              order: AdminOrder;
            }>(
              `${API_URL}/${id}`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          setOrder(
            response.data.order
          );
        } catch (error) {
          console.error(
            "Unable to load admin order:",
            error
          );

          setOrder(null);

          if (
            axios.isAxiosError(
              error
            )
          ) {
            setError(
              error.response
                ?.data?.message ||
                "Unable to load order."
            );
          } else {
            setError(
              "Unable to load order."
            );
          }
        } finally {
          setLoading(false);
        }
      };

    fetchOrder();
  }, [id, token]);

  const availableStatuses =
    useMemo<OrderStatus[]>(
      () => {
        if (!order) {
          return [];
        }

        switch (
          order.orderStatus
        ) {
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
      },
      [order]
    );

  const handleBackToOrders =
    () => {
      const state =
        location.state as
          | {
              fromOrders?: boolean;
              orderId?: string;
            }
          | null;

      if (
        state?.fromOrders &&
        state.orderId
      ) {
        navigate(
          "/admin/orders",
          {
            state: {
              restoreOrderId:
                state.orderId,
            },
          }
        );

        return;
      }

      navigate(
        "/admin/orders"
      );
    };

  const handleStatusChange =
    async (
      status: OrderStatus
    ) => {
      if (
        !token ||
        !order
      ) {
        return;
      }

      if (
        status ===
        order.orderStatus
      ) {
        return;
      }

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
        setUpdating(true);
        setError("");

        const response =
          await axios.patch<{
            message: string;
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

        setOrder(
          response.data.order
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
        setUpdating(false);
      }
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
            Loading order details...
          </p>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-slate-950 px-4 py-8 text-white sm:px-6 sm:py-12 lg:min-h-screen">
        <div className="mx-auto max-w-xl rounded-2xl border border-slate-800 bg-slate-900 px-5 py-8 text-center sm:rounded-3xl sm:p-10">
          <Package
            size={40}
            className="mx-auto text-slate-600 sm:h-11 sm:w-11"
          />

          <h1 className="mt-5 text-xl font-bold sm:text-2xl">
            Order not found
          </h1>

          <p className="mt-3 wrap-break-word text-sm leading-6 text-slate-500 sm:text-base">
            {error ||
              "This order could not be found."}
          </p>

          <button
            type="button"
            onClick={handleBackToOrders}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-green-400 sm:mt-7 sm:w-auto"
          >
            <ArrowLeft size={17} />

            Back to Orders
          </button>
        </div>
      </main>
    );
  }

  const createdDate =
    formatDateTime(
      order.createdAt
    );

  const paidDate =
    formatDateTime(
      order.paidAt
    );

  const processedDate =
    formatDateTime(
      order.processedAt
    );

  const shippedDate =
    formatDateTime(
      order.shippedAt
    );

  const deliveredDate =
    formatDateTime(
      order.deliveredAt
    );

  const cancelledDate =
    formatDateTime(
      order.cancelledAt
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
    order.shippingAddress
      .fullName;

  const customerEmail =
    order.user?.email ||
    order.shippingAddress
      .email;

  const isFinalStatus =
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

  const stages: {
    status: Exclude<
      OrderStatus,
      "cancelled"
    >;
    label: string;
    date: string | null;
    description: string;
  }[] = [
    {
      status: "pending",
      label: "Order Placed",
      date: createdDate,
      description:
        "Customer placed the order.",
    },
    {
      status: "processing",
      label: "Processing",
      date: processedDate,
      description:
        "Order preparation started.",
    },
    {
      status: "shipped",
      label: "Shipped",
      date: shippedDate,
      description:
        "Order was handed over for delivery.",
    },
    {
      status: "delivered",
      label: "Delivered",
      date: deliveredDate,
      description:
        "Order successfully reached the customer.",
    },
  ];

  const currentStageIndex =
    stages.findIndex(
      (stage) =>
        stage.status ===
        order.orderStatus
    );

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-white sm:px-6 sm:py-7 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl">
        {/* ======================================
            BACK BUTTON
        ======================================= */}

        <button
          type="button"
          onClick={handleBackToOrders}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg pr-3 text-sm font-semibold text-slate-400 transition hover:text-green-400"
        >
          <ArrowLeft size={17} />

          Back to Orders
        </button>

        {/* ======================================
            HEADER
        ======================================= */}

        <div className="mt-4 flex flex-col gap-5 sm:mt-6 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-green-400 sm:text-sm">
              Order Details
            </p>

            <div className="mt-2">
              <h1 className="wrap-break-word text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Order #
                {order._id
                  .slice(-8)
                  .toUpperCase()}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-2">
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
            </div>

            <p className="mt-3 text-xs leading-5 text-slate-500 sm:text-sm">
              Placed {createdDate}
            </p>
          </div>

          {/* ==================================
              STATUS ACTIONS
          =================================== */}

          <div className="w-full lg:max-w-sm">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
              Order Actions
            </p>

            {isFinalStatus ? (
              <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
                <p className="text-sm font-semibold text-slate-300">
                  {order.orderStatus ===
                  "delivered"
                    ? "Order completed"
                    : "Order cancelled"}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  No further status
                  updates are available.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {availableStatuses.map(
                  (status) => {
                    const isCancel =
                      status ===
                      "cancelled";

                    const blocked =
                      status ===
                        "processing" &&
                      cardPaymentBlocked;

                    return (
                      <button
                        key={status}
                        type="button"
                        disabled={
                          updating ||
                          blocked
                        }
                        onClick={() =>
                          handleStatusChange(
                            status
                          )
                        }
                        className={`flex min-h-12 w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                          isCancel
                            ? "border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/15"
                            : "bg-green-500 text-slate-950 hover:bg-green-400"
                        }`}
                      >
                        {updating
                          ? "Updating..."
                          : isCancel
                            ? "Cancel Order"
                            : `Mark as ${statusLabels[status]}`}
                      </button>
                    );
                  }
                )}

                {cardPaymentBlocked && (
                  <p className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs leading-5 text-amber-300">
                    This card order
                    cannot move to
                    processing until
                    payment has been
                    confirmed.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ======================================
            ERROR
        ======================================= */}

        {error && (
          <div
            role="alert"
            className="mt-5 wrap-break-word rounded-2xl border border-red-900/60 bg-red-950/40 px-4 py-4 text-sm leading-6 text-red-300 sm:mt-6 sm:px-5"
          >
            {error}
          </div>
        )}

        {/* ======================================
            OVERVIEW
        ======================================= */}

        <section className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-5 xl:grid-cols-4">
          {/* Status */}

          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
            <Clock3
              size={19}
              className="text-amber-400 sm:h-5 sm:w-5"
            />

            <p className="mt-3 text-[9px] font-semibold uppercase tracking-wide text-slate-500 sm:mt-4 sm:text-xs">
              Order Status
            </p>

            <p className="mt-1 truncate text-sm font-bold capitalize sm:text-base">
              {
                order.orderStatus
              }
            </p>
          </article>

          {/* Payment */}

          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
            <CheckCircle2
              size={19}
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

            <p className="mt-3 text-[9px] font-semibold uppercase tracking-wide text-slate-500 sm:mt-4 sm:text-xs">
              Payment
            </p>

            <p className="mt-1 text-sm font-bold capitalize sm:text-base">
              {
                order.paymentStatus
              }
            </p>
          </article>

          {/* Items */}

          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
            <Package
              size={19}
              className="text-blue-400 sm:h-5 sm:w-5"
            />

            <p className="mt-3 text-[9px] font-semibold uppercase tracking-wide text-slate-500 sm:mt-4 sm:text-xs">
              Items
            </p>

            <p className="mt-1 text-sm font-bold sm:text-base">
              {itemCount}
            </p>
          </article>

          {/* Total */}

          <article className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
            <CreditCard
              size={19}
              className="text-purple-400 sm:h-5 sm:w-5"
            />

            <p className="mt-3 text-[9px] font-semibold uppercase tracking-wide text-slate-500 sm:mt-4 sm:text-xs">
              Total
            </p>

            <p className="mt-1 wrap-break-word text-sm font-bold sm:text-xl">
              ₦
              {order.totalAmount.toLocaleString()}
            </p>
          </article>
        </section>

        {/* ======================================
            MAIN CONTENT
        ======================================= */}

        <section className="mt-6 grid gap-5 sm:mt-8 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0 space-y-5 sm:space-y-6">
            {/* ==================================
                ORDER ITEMS
            =================================== */}

            <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
              <div className="border-b border-slate-800 px-4 py-4 sm:px-6 sm:py-5">
                <h2 className="text-lg font-bold sm:text-xl">
                  Order Items
                </h2>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Products included in
                  this order.
                </p>
              </div>

              <div className="divide-y divide-slate-800">
                {order.items.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={`${item.product}-${index}`}
                      className="p-4 sm:p-6"
                    >
                      <div className="flex items-start gap-3 sm:items-center sm:gap-4">
                        {/* Image */}

                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-800 sm:h-20 sm:w-20">
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
                            <Package
                              size={22}
                              className="text-slate-600"
                            />
                          )}
                        </div>

                        {/* Details */}

                        <div className="min-w-0 flex-1">
                          <h3 className="line-clamp-2 text-sm font-bold leading-5 text-white sm:text-base">
                            {
                              item.name
                            }
                          </h3>

                          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                            ₦
                            {item.price.toLocaleString()}{" "}
                            each
                          </p>

                          <p className="mt-1 text-[11px] text-slate-600 sm:text-xs">
                            Quantity:{" "}
                            {
                              item.quantity
                            }
                          </p>
                        </div>

                        {/* Desktop subtotal */}

                        <p className="hidden shrink-0 text-right text-lg font-bold sm:block">
                          ₦
                          {(
                            item.price *
                            item.quantity
                          ).toLocaleString()}
                        </p>
                      </div>

                      {/* Mobile subtotal */}

                      <div className="mt-3 flex items-center justify-between border-t border-slate-800/70 pt-3 sm:hidden">
                        <span className="text-xs text-slate-500">
                          Subtotal
                        </span>

                        <span className="text-sm font-bold text-white">
                          ₦
                          {(
                            item.price *
                            item.quantity
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>

            {/* ==================================
                CUSTOMER
            =================================== */}

            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <User
                  size={20}
                  className="shrink-0 text-green-400"
                />

                <h2 className="text-lg font-bold sm:text-xl">
                  Customer
                </h2>
              </div>

              <div className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2 sm:gap-4">
                <div className="min-w-0 rounded-xl bg-slate-950/60 p-4">
                  <p className="text-[10px] uppercase tracking-wide text-slate-600 sm:text-xs">
                    Name
                  </p>

                  <p className="mt-1 wrap-break-word text-sm font-semibold sm:text-base">
                    {
                      customerName
                    }
                  </p>
                </div>

                <div className="min-w-0 rounded-xl bg-slate-950/60 p-4">
                  <p className="text-[10px] uppercase tracking-wide text-slate-600 sm:text-xs">
                    Email
                  </p>

                  <p className="mt-1 break-all text-sm font-semibold sm:text-base">
                    {
                      customerEmail
                    }
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* ====================================
              RIGHT COLUMN
          ===================================== */}

          <aside className="min-w-0 space-y-5 sm:space-y-6">
            {/* ==================================
                DELIVERY DETAILS
            =================================== */}

            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <MapPin
                  size={20}
                  className="shrink-0 text-green-400"
                />

                <h2 className="text-lg font-bold">
                  Delivery Details
                </h2>
              </div>

              <div className="mt-5 space-y-4 text-sm">
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-600 sm:text-xs">
                    Recipient
                  </p>

                  <p className="mt-1 wrap-break-word font-semibold">
                    {
                      order
                        .shippingAddress
                        .fullName
                    }
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-600 sm:text-xs">
                    Phone
                  </p>

                  <p className="mt-1 flex min-w-0 items-center gap-2 font-semibold">
                    <Phone
                      size={14}
                      className="shrink-0"
                    />

                    <span className="break-all">
                      {
                        order
                          .shippingAddress
                          .phone
                      }
                    </span>
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-600 sm:text-xs">
                    Address
                  </p>

                  <p className="mt-1 wrap-break-word leading-6 text-slate-300">
                    {
                      order
                        .shippingAddress
                        .address
                    }
                    ,{" "}
                    {
                      order
                        .shippingAddress
                        .city
                    }
                    ,{" "}
                    {
                      order
                        .shippingAddress
                        .state
                    }
                  </p>
                </div>
              </div>
            </section>

            {/* ==================================
                PAYMENT DETAILS
            =================================== */}

            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <CreditCard
                  size={20}
                  className="shrink-0 text-purple-400"
                />

                <h2 className="text-lg font-bold">
                  Payment Details
                </h2>
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <span className="shrink-0 text-sm text-slate-500">
                    Method
                  </span>

                  <span className="min-w-0 text-right text-sm font-semibold">
                    {order.paymentMethod ===
                    "card"
                      ? "Card / Paystack"
                      : "Pay on Delivery"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">
                    Status
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${
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

                {order.paymentReference && (
                  <div>
                    <p className="text-sm text-slate-500">
                      Reference
                    </p>

                    <p className="mt-1 break-all rounded-lg bg-slate-950 px-3 py-2 font-mono text-xs leading-5 text-slate-300">
                      {
                        order.paymentReference
                      }
                    </p>
                  </div>
                )}

                {paidDate && (
                  <div className="flex items-start justify-between gap-4">
                    <span className="shrink-0 text-sm text-slate-500">
                      Paid
                    </span>

                    <span className="min-w-0 text-right text-xs font-semibold leading-5 sm:text-sm">
                      {paidDate}
                    </span>
                  </div>
                )}

                <div className="border-t border-slate-800 pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-bold">
                      Total
                    </span>

                    <span className="min-w-0 wrap-break-word text-right text-lg font-bold text-green-400 sm:text-xl">
                      ₦
                      {order.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* ==================================
                DELIVERY PROGRESS
            =================================== */}

            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
              <div className="flex items-start gap-3">
                <Truck
                  size={20}
                  className="mt-0.5 shrink-0 text-blue-400"
                />

                <div className="min-w-0">
                  <h2 className="text-lg font-bold">
                    Delivery Progress
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Complete order
                    fulfilment history.
                  </p>
                </div>
              </div>

              <div className="mt-6 sm:mt-7">
                {stages.map(
                  (
                    stage,
                    index
                  ) => {
                    const complete =
                      order.orderStatus !==
                        "cancelled" &&
                      index <=
                        currentStageIndex;

                    const active =
                      order.orderStatus ===
                      stage.status;

                    const occurred =
                      Boolean(
                        stage.date
                      );

                    return (
                      <div
                        key={
                          stage.status
                        }
                        className="relative flex gap-3 pb-7 last:pb-0 sm:gap-4 sm:pb-8"
                      >
                        {index <
                          stages.length -
                            1 && (
                          <div
                            className={`absolute left-1.75 top-5 h-full w-px ${
                              occurred &&
                              stages[
                                index +
                                  1
                              ]?.date
                                ? "bg-green-500"
                                : "bg-slate-700"
                            }`}
                          />
                        )}

                        <div
                          className={`relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border-2 ${
                            active
                              ? "border-green-300 bg-green-500 ring-4 ring-green-500/10"
                              : occurred ||
                                  complete
                                ? "border-green-500 bg-green-500"
                                : "border-slate-700 bg-slate-900"
                          }`}
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                            <p
                              className={`text-sm font-semibold ${
                                occurred ||
                                complete
                                  ? "text-slate-200"
                                  : "text-slate-600"
                              }`}
                            >
                              {
                                stage.label
                              }
                            </p>

                            {stage.date && (
                              <p className="text-[11px] font-medium leading-5 text-slate-500 sm:text-right sm:text-xs">
                                {
                                  stage.date
                                }
                              </p>
                            )}
                          </div>

                          <p
                            className={`mt-1 text-xs leading-5 ${
                              occurred
                                ? "text-slate-500"
                                : "text-slate-700"
                            }`}
                          >
                            {
                              stage.description
                            }
                          </p>

                          {active &&
                            order.orderStatus !==
                              "delivered" && (
                              <span className="mt-2 inline-flex rounded-full bg-green-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-green-400 sm:text-[10px]">
                                Current status
                              </span>
                            )}

                          {!occurred &&
                            !active && (
                              <p className="mt-2 text-[11px] text-slate-700 sm:text-xs">
                                Not reached yet
                              </p>
                            )}
                        </div>
                      </div>
                    );
                  }
                )}

                {order.orderStatus ===
                  "cancelled" && (
                  <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-red-500" />

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-red-400">
                          Order Cancelled
                        </p>

                        {cancelledDate && (
                          <p className="mt-1 text-xs font-medium leading-5 text-red-300/80">
                            {
                              cancelledDate
                            }
                          </p>
                        )}

                        <p className="mt-2 text-xs leading-5 text-red-300/70">
                          Reserved product
                          quantities have
                          been restored to
                          inventory.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
};

export default AdminOrderDetails;