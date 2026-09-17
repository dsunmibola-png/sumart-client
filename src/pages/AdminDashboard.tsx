import {
  useEffect,
  useState,
} from "react";
import axios from "axios";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Package,
  ShoppingBag,
  Star,
  Truck,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config/api";

import { useAuth } from "../context/AuthContext";
import type { Product } from "../types/product";

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
    | "pending"
    | "paid"
    | "failed";

  orderStatus:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";

  totalAmount: number;
  createdAt: string;
}

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  customers: number;
  totalProducts: number;
  featuredProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
}

interface DashboardResponse {
  stats: DashboardStats;
  recentOrders: AdminOrder[];
  inventoryAlerts: Product[];
}

const DASHBOARD_URL = `${API_BASE_URL}/api/admin/dashboard`;

const initialStats: DashboardStats = {
  totalRevenue: 0,
  totalOrders: 0,
  paidOrders: 0,
  pendingOrders: 0,
  processingOrders: 0,
  shippedOrders: 0,
  deliveredOrders: 0,
  cancelledOrders: 0,
  customers: 0,
  totalProducts: 0,
  featuredProducts: 0,
  lowStockProducts: 0,
  outOfStockProducts: 0,
};

const AdminDashboard = () => {
  const { token, user } =
    useAuth();

  const [stats, setStats] =
    useState<DashboardStats>(
      initialStats
    );

  const [
    recentOrders,
    setRecentOrders,
  ] = useState<AdminOrder[]>([]);

  const [
    inventoryAlerts,
    setInventoryAlerts,
  ] = useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================
  // DASHBOARD DATA
  // ==========================================

  useEffect(() => {
    const fetchDashboard =
      async () => {
        if (!token) {
          setLoading(false);
          return;
        }

        try {
          setLoading(true);
          setError("");

          const response =
            await axios.get<DashboardResponse>(
              DASHBOARD_URL,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          setStats(
            response.data.stats
          );

          setRecentOrders(
            response.data
              .recentOrders
          );

          setInventoryAlerts(
            response.data
              .inventoryAlerts
          );
        } catch (error) {
          console.error(
            "Dashboard request failed:",
            error
          );

          setError(
            "Unable to load dashboard data."
          );
        } finally {
          setLoading(false);
        }
      };

    fetchDashboard();
  }, [token]);

  // ==========================================
  // STATUS STYLES
  // ==========================================

  const orderStatusStyle: Record<
    AdminOrder["orderStatus"],
    string
  > = {
    pending:
      "bg-amber-500/10 text-amber-400",

    processing:
      "bg-blue-500/10 text-blue-400",

    shipped:
      "bg-purple-500/10 text-purple-400",

    delivered:
      "bg-green-500/10 text-green-400",

    cancelled:
      "bg-red-500/10 text-red-400",
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950 px-4 lg:min-h-screen">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-green-500" />

          <p className="mt-4 text-sm text-slate-400">
            Loading SUMART Admin...
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

        <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl sm:rounded-[28px] sm:p-7 lg:p-9">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-green-500/10 blur-3xl sm:h-72 sm:w-72" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-green-400 sm:text-sm sm:tracking-[0.25em]">
                SUMART Admin
              </p>

              <h1 className="mt-2 wrap-break-word text-2xl font-bold tracking-tight sm:mt-3 sm:text-3xl lg:text-4xl">
                Welcome back,{" "}
                {user?.name?.split(
                  " "
                )[0]}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:mt-3 sm:text-base">
                Monitor revenue,
                customers, inventory
                and customer orders
                from one place.
              </p>
            </div>

            <Link
              to="/admin/orders"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-green-400 sm:w-fit"
            >
              Manage Orders

              <ArrowRight
                size={17}
              />
            </Link>
          </div>
        </section>

        {/* ======================================
            ERROR
        ======================================= */}

        {error && (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-900/50 bg-red-950/30 px-4 py-4 text-sm text-red-300 sm:mt-6 sm:px-5">
            <AlertTriangle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <div className="min-w-0">
              <p className="font-semibold">
                Dashboard data
                unavailable
              </p>

              <p className="mt-1 wrap-break-word text-red-400/80">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* ======================================
            MAIN KPI CARDS
        ======================================= */}

        <section className="mt-5 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-5 xl:grid-cols-4">
          {/* Revenue */}

          <article className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg sm:p-6">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-400 sm:text-sm">
                  Total Revenue
                </p>

                <p className="mt-2 wrap-break-word text-lg font-bold tracking-tight sm:mt-3 sm:text-3xl">
                  ₦
                  {stats.totalRevenue.toLocaleString()}
                </p>
              </div>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-400 sm:h-11 sm:w-11">
                <CircleDollarSign
                  size={19}
                  className="sm:h-5.5 sm:w-5.5"
                />
              </div>
            </div>

            <p className="mt-4 text-[10px] leading-4 text-slate-500 sm:mt-5 sm:text-xs">
              Paid, non-cancelled
              orders
            </p>
          </article>

          {/* Orders */}

          <article className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg sm:p-6">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-medium text-slate-400 sm:text-sm">
                  Total Orders
                </p>

                <p className="mt-2 text-xl font-bold tracking-tight sm:mt-3 sm:text-3xl">
                  {stats.totalOrders}
                </p>
              </div>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 sm:h-11 sm:w-11">
                <ShoppingBag
                  size={19}
                  className="sm:h-5.5 sm:w-5.5"
                />
              </div>
            </div>

            <p className="mt-4 text-[10px] leading-4 text-slate-500 sm:mt-5 sm:text-xs">
              {stats.paidOrders}{" "}
              paid orders
            </p>
          </article>

          {/* Customers */}

          <article className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg sm:p-6">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-medium text-slate-400 sm:text-sm">
                  Customers
                </p>

                <p className="mt-2 text-xl font-bold tracking-tight sm:mt-3 sm:text-3xl">
                  {stats.customers}
                </p>
              </div>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 sm:h-11 sm:w-11">
                <Users
                  size={19}
                  className="sm:h-5.5 sm:w-5.5"
                />
              </div>
            </div>

            <p className="mt-4 text-[10px] leading-4 text-slate-500 sm:mt-5 sm:text-xs">
              Registered customer
              accounts
            </p>
          </article>

          {/* Products */}

          <article className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg sm:p-6">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-medium text-slate-400 sm:text-sm">
                  Products
                </p>

                <p className="mt-2 text-xl font-bold tracking-tight sm:mt-3 sm:text-3xl">
                  {stats.totalProducts}
                </p>
              </div>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 sm:h-11 sm:w-11">
                <Boxes
                  size={19}
                  className="sm:h-5.5 sm:w-5.5"
                />
              </div>
            </div>

            <p className="mt-4 text-[10px] leading-4 text-slate-500 sm:mt-5 sm:text-xs">
              {
                stats.featuredProducts
              }{" "}
              featured
            </p>
          </article>
        </section>

        {/* ======================================
            SECONDARY KPI
        ======================================= */}

        <section className="mt-3 grid grid-cols-2 gap-3 sm:mt-5 sm:gap-4 xl:grid-cols-4">
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
              Pending
            </p>

            <p className="mt-2 text-xl font-bold text-amber-400 sm:text-2xl">
              {
                stats.pendingOrders
              }
            </p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
              Processing
            </p>

            <p className="mt-2 text-xl font-bold text-blue-400 sm:text-2xl">
              {
                stats.processingOrders
              }
            </p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
              Low Stock
            </p>

            <p className="mt-2 text-xl font-bold text-amber-400 sm:text-2xl">
              {
                stats.lowStockProducts
              }
            </p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
              Out of Stock
            </p>

            <p className="mt-2 text-xl font-bold text-red-400 sm:text-2xl">
              {
                stats.outOfStockProducts
              }
            </p>
          </article>
        </section>

        {/* ======================================
            PIPELINE + RECENT ORDERS
        ======================================= */}

        <section className="mt-6 grid gap-5 sm:mt-8 sm:gap-6 xl:grid-cols-[360px_1fr]">
          {/* Pipeline */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
            <p className="text-xs font-semibold text-green-400 sm:text-sm">
              Order Pipeline
            </p>

            <h2 className="mt-1 text-lg font-bold sm:mt-2 sm:text-xl">
              Order Status
            </h2>

            <div className="mt-5 space-y-2.5 sm:mt-6 sm:space-y-3">
              {/* Pending */}

              <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-950/70 p-3.5 sm:p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                    <Clock3
                      size={18}
                    />
                  </div>

                  <span className="truncate text-sm font-medium text-slate-300">
                    Pending
                  </span>
                </div>

                <span className="shrink-0 font-bold">
                  {
                    stats.pendingOrders
                  }
                </span>
              </div>

              {/* Processing */}

              <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-950/70 p-3.5 sm:p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    <Package
                      size={18}
                    />
                  </div>

                  <span className="truncate text-sm font-medium text-slate-300">
                    Processing
                  </span>
                </div>

                <span className="shrink-0 font-bold">
                  {
                    stats.processingOrders
                  }
                </span>
              </div>

              {/* Shipped */}

              <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-950/70 p-3.5 sm:p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                    <Truck
                      size={18}
                    />
                  </div>

                  <span className="truncate text-sm font-medium text-slate-300">
                    Shipped
                  </span>
                </div>

                <span className="shrink-0 font-bold">
                  {
                    stats.shippedOrders
                  }
                </span>
              </div>

              {/* Delivered */}

              <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-950/70 p-3.5 sm:p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                    <CheckCircle2
                      size={18}
                    />
                  </div>

                  <span className="truncate text-sm font-medium text-slate-300">
                    Delivered
                  </span>
                </div>

                <span className="shrink-0 font-bold">
                  {
                    stats.deliveredOrders
                  }
                </span>
              </div>
            </div>

            <Link
              to="/admin/orders"
              className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-green-500/50 hover:bg-green-500/5 hover:text-green-400 sm:mt-6"
            >
              Manage Orders

              <ArrowRight
                size={16}
              />
            </Link>
          </div>

          {/* ==================================
              RECENT ORDERS
          =================================== */}

          <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-4 py-4 sm:px-6 sm:py-5">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-green-400 sm:text-sm">
                  Latest Activity
                </p>

                <h2 className="mt-1 text-lg font-bold sm:text-xl">
                  Recent Orders
                </h2>
              </div>

              <ShoppingBag
                size={21}
                className="shrink-0 text-slate-500 sm:h-5.75 sm:w-5.75"
              />
            </div>

            {recentOrders.length ===
            0 ? (
              <div className="px-4 py-10 text-center sm:p-10">
                <Package
                  size={38}
                  className="mx-auto text-slate-700"
                />

                <p className="mt-4 text-sm text-slate-500">
                  No recent orders
                  yet.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {recentOrders.map(
                  (order) => {
                    const createdDate =
                      new Date(
                        order.createdAt
                      ).toLocaleDateString(
                        "en-NG",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      );

                    return (
                      <div
                        key={
                          order._id
                        }
                        className="px-4 py-4 transition hover:bg-slate-800/40 sm:px-6 sm:py-5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-white sm:text-base">
                              Order #
                              {order._id
                                .slice(
                                  -8
                                )
                                .toUpperCase()}
                            </p>

                            <p className="mt-1.5 truncate text-xs text-slate-400 sm:text-sm">
                              {order.user
                                ?.name ||
                                order
                                  .shippingAddress
                                  .fullName}
                            </p>

                            <p className="mt-1 text-[11px] text-slate-600 sm:text-xs">
                              {
                                createdDate
                              }
                            </p>
                          </div>

                          <div className="shrink-0 text-right">
                            <p className="text-sm font-bold text-white sm:text-base">
                              ₦
                              {order.totalAmount.toLocaleString()}
                            </p>

                            <p
                              className={`mt-1 text-[10px] font-semibold sm:text-xs ${
                                order.paymentStatus ===
                                "paid"
                                  ? "text-green-400"
                                  : order.paymentStatus ===
                                      "failed"
                                    ? "text-red-400"
                                    : "text-slate-500"
                              }`}
                            >
                              {order.paymentStatus ===
                              "paid"
                                ? "Paid"
                                : order.paymentStatus ===
                                    "failed"
                                  ? "Payment failed"
                                  : "Payment pending"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize sm:text-[11px] ${
                              orderStatusStyle[
                                order
                                  .orderStatus
                              ]
                            }`}
                          >
                            {
                              order.orderStatus
                            }
                          </span>

                          <Link
                            to={`/admin/orders/${order._id}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-green-400 transition hover:text-green-300"
                          >
                            View

                            <ArrowRight
                              size={13}
                            />
                          </Link>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>
        </section>

        {/* ======================================
            INVENTORY ALERTS
        ======================================= */}

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 sm:mt-8">
          <div className="flex flex-col gap-3 border-b border-slate-800 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <p className="text-xs font-semibold text-amber-400 sm:text-sm">
                Inventory Alerts
              </p>

              <h2 className="mt-1 text-lg font-bold sm:text-xl">
                Products Running Low
              </h2>
            </div>

            <Link
              to="/admin/products"
              className="inline-flex min-h-10 w-fit items-center gap-2 text-sm font-semibold text-green-400 transition hover:text-green-300"
            >
              Manage inventory

              <ArrowRight
                size={15}
              />
            </Link>
          </div>

          {inventoryAlerts.length ===
          0 ? (
            <div className="px-4 py-10 text-center sm:p-10">
              <CheckCircle2
                size={38}
                className="mx-auto text-green-500"
              />

              <p className="mt-4 font-semibold text-slate-300">
                Inventory looks
                healthy
              </p>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                No products
                currently have low
                stock.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {inventoryAlerts.map(
                (product) => (
                  <div
                    key={product._id}
                    className="px-4 py-4 sm:px-6 sm:py-5"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Image */}

                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-800 sm:h-16 sm:w-16">
                        {product
                          .images[0] ? (
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
                          <Boxes
                            size={21}
                            className="text-slate-600"
                          />
                        )}
                      </div>

                      {/* Details */}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
                          <p className="line-clamp-2 text-sm font-semibold text-white sm:text-base">
                            {
                              product.name
                            }
                          </p>

                          {product.isFeatured && (
                            <span className="inline-flex w-fit items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-[9px] font-semibold uppercase text-green-400 sm:text-[10px]">
                              <Star
                                size={
                                  10
                                }
                              />

                              Featured
                            </span>
                          )}
                        </div>

                        <p className="mt-1 truncate text-xs text-slate-500 sm:text-sm">
                          {
                            product.category
                          }{" "}
                          •{" "}
                          {
                            product.brand
                          }
                        </p>

                        {/* Mobile stock */}

                        <div className="mt-3 flex items-center justify-between gap-3 sm:hidden">
                          <div className="flex items-center gap-2">
                            <AlertTriangle
                              size={15}
                              className={
                                product.stock ===
                                0
                                  ? "text-red-400"
                                  : "text-amber-400"
                              }
                            />

                            <p
                              className={`text-xs font-bold ${
                                product.stock ===
                                0
                                  ? "text-red-400"
                                  : "text-amber-400"
                              }`}
                            >
                              {product.stock ===
                              0
                                ? "Out of stock"
                                : `${product.stock} left`}
                            </p>
                          </div>

                          <p className="shrink-0 text-xs text-slate-500">
                            ₦
                            {product.price.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Desktop stock */}

                      <div className="hidden shrink-0 items-center gap-3 sm:flex">
                        <AlertTriangle
                          size={18}
                          className={
                            product.stock ===
                            0
                              ? "text-red-400"
                              : "text-amber-400"
                          }
                        />

                        <div className="text-right">
                          <p
                            className={`font-bold ${
                              product.stock ===
                              0
                                ? "text-red-400"
                                : "text-amber-400"
                            }`}
                          >
                            {product.stock ===
                            0
                              ? "Out of stock"
                              : `${product.stock} left`}
                          </p>

                          <p className="text-xs text-slate-600">
                            ₦
                            {product.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        {/* ======================================
            QUICK ACTIONS
        ======================================= */}

        <section className="mt-6 pb-4 sm:mt-8">
          <p className="text-xs font-semibold text-green-400 sm:text-sm">
            Quick Actions
          </p>

          <h2 className="mt-1 text-lg font-bold sm:text-xl">
            Manage SUMART
          </h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
            {/* Orders */}

            <Link
              to="/admin/orders"
              className="group rounded-2xl border border-slate-800 bg-slate-900 p-4 transition hover:border-green-500/40 hover:bg-slate-800 sm:p-5"
            >
              <Package
                size={21}
                className="text-green-400"
              />

              <h3 className="mt-3 font-bold sm:mt-4">
                Orders
              </h3>

              <p className="mt-1.5 text-sm leading-6 text-slate-500 sm:mt-2">
                Review payments and
                manage customer
                deliveries.
              </p>

              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-green-400 sm:mt-4">
                Manage orders

                <ArrowRight
                  size={15}
                  className="transition group-hover:translate-x-1"
                />
              </span>
            </Link>

            {/* Products */}

            <Link
              to="/admin/products"
              className="group rounded-2xl border border-slate-800 bg-slate-900 p-4 transition hover:border-blue-500/40 hover:bg-slate-800 sm:p-5"
            >
              <Boxes
                size={21}
                className="text-blue-400"
              />

              <h3 className="mt-3 font-bold sm:mt-4">
                Products
              </h3>

              <p className="mt-1.5 text-sm leading-6 text-slate-500 sm:mt-2">
                Add products,
                upload images and
                manage inventory.
              </p>

              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 sm:mt-4">
                Manage products

                <ArrowRight
                  size={15}
                  className="transition group-hover:translate-x-1"
                />
              </span>
            </Link>

            {/* Customers */}

            <Link
              to="/admin/customers"
              className="group rounded-2xl border border-slate-800 bg-slate-900 p-4 transition hover:border-purple-500/40 hover:bg-slate-800 sm:col-span-2 sm:p-5 xl:col-span-1"
            >
              <Users
                size={21}
                className="text-purple-400"
              />

              <h3 className="mt-3 font-bold sm:mt-4">
                Customers
              </h3>

              <p className="mt-1.5 text-sm leading-6 text-slate-500 sm:mt-2">
                Review registered
                customer accounts.
              </p>

              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-purple-400 sm:mt-4">
                View customers

                <ArrowRight
                  size={15}
                  className="transition group-hover:translate-x-1"
                />
              </span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminDashboard;