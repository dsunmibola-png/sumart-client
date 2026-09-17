import {
  useEffect,
  useState,
} from "react";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  Mail,
  Search,
  User,
  Users,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../config/api";

interface Customer {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  totalUsers: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface CustomersResponse {
  users: Customer[];
  pagination: Pagination;
}

const API_URL = `${API_BASE_URL}/api/users`;

const PAGE_SIZE = 20;

const initialPagination: Pagination = {
  page: 1,
  limit: PAGE_SIZE,
  totalUsers: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

const AdminCustomers = () => {
  const { token } = useAuth();

  const [
    customers,
    setCustomers,
  ] = useState<Customer[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const [
    debouncedSearch,
    setDebouncedSearch,
  ] = useState("");

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    pagination,
    setPagination,
  ] = useState<Pagination>(
    initialPagination
  );

  // Debounce search so we don't
  // request the server on every keypress.
  useEffect(() => {
    const timeout =
      window.setTimeout(() => {
        setDebouncedSearch(
          searchQuery.trim()
        );
      }, 400);

    return () => {
      window.clearTimeout(
        timeout
      );
    };
  }, [searchQuery]);

  // Start again from page 1
  // whenever search changes.
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Fetch customers from server
  useEffect(() => {
    const fetchCustomers =
      async () => {
        if (!token) {
          return;
        }

        try {
          setLoading(true);
          setError("");

          const response =
            await axios.get<CustomersResponse>(
              API_URL,
              {
                params: {
                  page:
                    currentPage,
                  limit:
                    PAGE_SIZE,

                  search:
                    debouncedSearch ||
                    undefined,
                },

                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          setCustomers(
            response.data.users
          );

          setPagination(
            response.data
              .pagination
          );
        } catch (error) {
          console.error(
            error
          );

          setCustomers([]);

          setPagination(
            initialPagination
          );

          if (
            axios.isAxiosError(
              error
            )
          ) {
            setError(
              error.response
                ?.data
                ?.message ||
                "Unable to load customers."
            );
          } else {
            setError(
              "Unable to load customers."
            );
          }
        } finally {
          setLoading(false);
        }
      };

    fetchCustomers();
  }, [
    token,
    currentPage,
    debouncedSearch,
  ]);

  const totalPages =
    pagination.totalPages;

  const firstResult =
    pagination.totalUsers ===
    0
      ? 0
      : (pagination.page - 1) *
          pagination.limit +
        1;

  const lastResult =
    Math.min(
      pagination.page *
        pagination.limit,
      pagination.totalUsers
    );

  const goToPage = (
    page: number
  ) => {
    const nextPage =
      Math.min(
        Math.max(
          page,
          1
        ),
        totalPages
      );

    if (
      nextPage ===
      currentPage
    ) {
      return;
    }

    setCurrentPage(
      nextPage
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const clearSearch = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setCurrentPage(1);
  };

    if (
    loading &&
    customers.length === 0
  ) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950 px-4 lg:min-h-screen">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-green-500" />

          <p className="mt-4 text-sm text-slate-400">
            Loading customers...
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

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-green-400 sm:text-sm">
            Accounts
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Customer Management
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:mt-3 sm:text-base">
            Review registered SUMART customer
            accounts.
          </p>
        </div>

        {/* ======================================
            STATS
        ======================================= */}

        <section className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4">
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-slate-500 sm:text-sm">
                  Total Customers
                </p>

                <p className="mt-2 text-2xl font-bold sm:text-3xl">
                  {
                    pagination.totalUsers
                  }
                </p>
              </div>

              <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-400 sm:flex">
                <Users size={20} />
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-slate-500 sm:text-sm">
                  Current Page
                </p>

                <div className="mt-2 flex flex-wrap items-baseline gap-1.5">
                  <p className="text-2xl font-bold text-blue-400 sm:text-3xl">
                    {
                      pagination.page
                    }
                  </p>

                  <span className="text-xs font-semibold text-slate-500 sm:text-base">
                    of{" "}
                    {
                      pagination.totalPages
                    }
                  </span>
                </div>
              </div>
            </div>
          </article>
        </section>

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
            SEARCH
        ======================================= */}

        <div className="mt-6 flex min-h-12 min-w-0 items-center rounded-2xl border border-slate-800 bg-slate-900 px-3 transition focus-within:border-green-500 sm:mt-8 sm:px-4">
          <Search
            size={19}
            className="shrink-0 text-slate-500"
          />

          <input
            type="text"
            value={
              searchQuery
            }
            onChange={(
              event
            ) =>
              setSearchQuery(
                event.target
                  .value
              )
            }
            placeholder="Search by name or email..."
            className="min-w-0 w-full bg-transparent px-3 py-3.5 text-base text-white outline-none placeholder:text-slate-600 sm:py-4 sm:text-sm"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={
                clearSearch
              }
              className="shrink-0 rounded-lg px-2 py-2 text-xs font-bold text-green-400 transition hover:text-green-300"
            >
              Clear
            </button>
          )}
        </div>

        {/* ======================================
            RESULTS INFO
        ======================================= */}

        {!error &&
          pagination.totalUsers >
            0 && (
            <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-500 sm:mt-5 sm:text-sm">
              <p className="min-w-0">
                Showing{" "}
                <span className="font-semibold text-slate-300">
                  {
                    firstResult
                  }
                  –
                  {
                    lastResult
                  }
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-300">
                  {
                    pagination.totalUsers
                  }
                </span>
              </p>

              {loading && (
                <div className="flex shrink-0 items-center gap-2 text-green-400">
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-green-500/30 border-t-green-400" />

                  <span className="hidden sm:inline">
                    Updating...
                  </span>
                </div>
              )}
            </div>
          )}

        {/* ======================================
            CUSTOMER LIST
        ======================================= */}

        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 sm:mt-6">
          {!loading &&
          customers.length ===
            0 ? (
            <div className="px-4 py-10 text-center sm:p-14">
              <Users
                size={40}
                className="mx-auto text-slate-700 sm:h-10.5 sm:w-10.5"
              />

              <h2 className="mt-4 text-lg font-bold sm:text-xl">
                No customers found
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {debouncedSearch
                  ? "Try changing your search."
                  : "No customer accounts have been registered yet."}
              </p>

              {debouncedSearch && (
                <button
                  type="button"
                  onClick={
                    clearSearch
                  }
                  className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-green-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-green-400"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {customers.map(
                (
                  customer
                ) => {
                  const joinedDate =
                    new Date(
                      customer.createdAt
                    ).toLocaleDateString(
                      "en-NG",
                      {
                        day: "numeric",
                        month:
                          "short",
                        year: "numeric",
                      }
                    );

                  return (
                    <article
                      key={
                        customer._id
                      }
                      className="p-4 transition hover:bg-slate-800/40 sm:p-5"
                    >
                      <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
                        {/* Avatar */}

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-400 sm:h-12 sm:w-12 sm:rounded-2xl">
                          <User
                            size={20}
                          />
                        </div>

                        {/* Main information */}

                        <div className="min-w-0 flex-1">
                          <div className="flex min-w-0 flex-wrap items-center gap-1.5 sm:gap-2">
                            <h2 className="max-w-full truncate text-sm font-bold text-white sm:text-base">
                              {
                                customer.name
                              }
                            </h2>

                            <span className="shrink-0 rounded-full bg-blue-500/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-blue-400 sm:px-2.5 sm:text-[11px]">
                              Customer
                            </span>
                          </div>

                          <div className="mt-1.5 flex min-w-0 items-start gap-1.5 text-xs text-slate-500 sm:text-sm">
                            <Mail
                              size={14}
                              className="mt-0.5 shrink-0"
                            />

                            <span className="min-w-0 break-all">
                              {
                                customer.email
                              }
                            </span>
                          </div>
                        </div>

                        {/* Desktop joined date */}

                        <div className="hidden shrink-0 text-right sm:block">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                            Joined
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-300">
                            {
                              joinedDate
                            }
                          </p>
                        </div>
                      </div>

                      {/* Mobile joined date */}

                      <div className="mt-3 flex items-center justify-between border-t border-slate-800/70 pt-3 sm:hidden">
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                          Joined
                        </span>

                        <span className="text-xs font-semibold text-slate-300">
                          {
                            joinedDate
                          }
                        </span>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )}
        </section>

        {/* ======================================
            PAGINATION
        ======================================= */}

        {!error &&
          pagination.totalUsers >
            0 &&
          totalPages > 1 && (
            <section className="mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-3 sm:mt-8 sm:p-4">
              <div className="mb-3 flex items-center justify-center sm:hidden">
                <p className="text-xs text-slate-500">
                  Page{" "}
                  <span className="font-bold text-white">
                    {
                      pagination.page
                    }
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-white">
                    {
                      pagination.totalPages
                    }
                  </span>
                </p>
              </div>

              <div className="flex items-center justify-between gap-2">
                <p className="hidden text-sm text-slate-500 sm:block">
                  Page{" "}
                  <span className="font-bold text-white">
                    {
                      pagination.page
                    }
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-white">
                    {
                      pagination.totalPages
                    }
                  </span>
                </p>

                <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2 sm:flex sm:w-auto">
                  {/* Previous */}

                  <button
                    type="button"
                    onClick={() =>
                      goToPage(
                        currentPage -
                          1
                      )
                    }
                    disabled={
                      !pagination.hasPreviousPage ||
                      loading
                    }
                    className="inline-flex min-h-11 min-w-0 items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-800 px-2.5 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-slate-600 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40 sm:gap-1.5 sm:px-4 sm:text-sm"
                  >
                    <ChevronLeft
                      size={17}
                      className="shrink-0"
                    />

                    <span>
                      Previous
                    </span>
                  </button>

                  {/* Current page */}

                  <span className="flex h-11 min-w-11 items-center justify-center rounded-xl bg-green-500 px-3 text-sm font-bold text-slate-950">
                    {
                      pagination.page
                    }
                  </span>

                  {/* Next */}

                  <button
                    type="button"
                    onClick={() =>
                      goToPage(
                        currentPage +
                          1
                      )
                    }
                    disabled={
                      !pagination.hasNextPage ||
                      loading
                    }
                    className="inline-flex min-h-11 min-w-0 items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-800 px-2.5 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-slate-600 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40 sm:gap-1.5 sm:px-4 sm:text-sm"
                  >
                    <span>
                      Next
                    </span>

                    <ChevronRight
                      size={17}
                      className="shrink-0"
                    />
                  </button>
                </div>
              </div>
            </section>
          )}
      </div>
    </main>
  );
};

export default AdminCustomers; 