import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import ProductCard from "../components/shop/ProductCard";

import {
  getAllProducts,
  getProducts,
} from "../services/productService";

import type { ProductPagination } from "../services/productService";
import type { Product } from "../types/product";

const PRODUCTS_PER_PAGE = 16;

const initialPagination: ProductPagination = {
  page: 1,
  limit: PRODUCTS_PER_PAGE,
  totalProducts: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [pagination, setPagination] =
    useState<ProductPagination>(initialPagination);

  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const categoryFromUrl = searchParams.get("category") || "All";

  const [selectedCategory, setSelectedCategory] =
    useState(categoryFromUrl);

  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);

  // Keep category synced with URL
  useEffect(() => {
    const category = searchParams.get("category") || "All";
    setSelectedCategory(category);
  }, [searchParams]);

  // Debounce search
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 400);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [searchQuery]);

  // Load all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const allProducts = await getAllProducts();

        const uniqueCategories = Array.from(
          new Set(
            allProducts.map((product) => product.category),
          ),
        ).sort();

        setCategories(["All", ...uniqueCategories]);
      } catch (err) {
        console.error(
          "Unable to load product categories:",
          err,
        );
      }
    };

    fetchCategories();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedCategory, sortBy]);

  // Fetch server-side paginated products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProducts({
          page: currentPage,
          limit: PRODUCTS_PER_PAGE,
          search: debouncedSearch || undefined,
          category:
            selectedCategory === "All"
              ? undefined
              : selectedCategory,
          sort: sortBy,
          inStock: false,
        });

        setProducts(response.products);
        setPagination(response.pagination);
      } catch (err) {
        console.error("Unable to fetch products:", err);

        setProducts([]);
        setPagination(initialPagination);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    currentPage,
    debouncedSearch,
    selectedCategory,
    sortBy,
  ]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);

    const params = new URLSearchParams(searchParams);

    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setSelectedCategory("All");
    setSortBy("featured");
    setCurrentPage(1);

    const params = new URLSearchParams(searchParams);
    params.delete("category");

    setSearchParams(params);
  };

  const hasFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== "All" ||
    sortBy !== "featured";

  const totalPages = pagination.totalPages;

  const goToPage = (page: number) => {
    const nextPage = Math.min(
      Math.max(page, 1),
      totalPages,
    );

    if (nextPage === currentPage) {
      return;
    }

    setCurrentPage(nextPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const paginationNumbers = useMemo(() => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let page = 1; page <= totalPages; page++) {
        pages.push(page);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage > 4) {
      pages.push("start-ellipsis");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(
      totalPages - 1,
      currentPage + 1,
    );

    for (let page = start; page <= end; page++) {
      pages.push(page);
    }

    if (currentPage < totalPages - 3) {
      pages.push("end-ellipsis");
    }

    pages.push(totalPages);

    return pages;
  }, [currentPage, totalPages]);

  const firstResult =
    pagination.totalProducts === 0
      ? 0
      : (pagination.page - 1) * pagination.limit + 1;

  const lastResult = Math.min(
    pagination.page * pagination.limit,
    pagination.totalProducts,
  );

  return (
    <main className="min-h-screen bg-[#f7f8f6]">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:py-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-green-700 sm:text-xs">
            SUMART Store
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:mt-3 sm:text-5xl">
            Shop
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:mt-3 sm:text-base sm:leading-7">
            Browse quality products across categories and find
            what works for you.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
        {/* Search + Sort */}
        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
            {/* Search */}
            <div className="relative w-full lg:max-w-xl">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 sm:left-4"
              />

              <input
                type="search"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search products or brands..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100 sm:pl-11 sm:pr-11"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={17} />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="flex w-full items-center gap-2 lg:w-auto">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                <SlidersHorizontal size={18} />
              </div>

              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value)
                }
                aria-label="Sort products"
                className="h-12 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-green-500 lg:w-auto lg:flex-none lg:px-4"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">
                  Price: Low to High
                </option>
                <option value="price-high">
                  Price: High to Low
                </option>
              </select>
            </div>
          </div>
        </section>

        {/* Category heading */}
        <div className="mt-5 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
            Categories
          </p>

          {selectedCategory !== "All" && (
            <button
              type="button"
              onClick={() => handleCategoryChange("All")}
              className="text-xs font-bold text-green-700"
            >
              View all
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="-mx-4 mt-3 overflow-hidden sm:mx-0">
          <div className="flex gap-2 overflow-x-auto px-4 pb-2 sm:px-0">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() =>
                  handleCategoryChange(category)
                }
                className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                  selectedCategory === category
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-green-300 hover:text-green-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-7 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
            {Array.from({
              length: PRODUCTS_PER_PAGE,
            }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="aspect-square animate-pulse bg-slate-200 sm:aspect-auto sm:h-64" />

                <div className="space-y-2.5 p-3 sm:space-y-3 sm:p-5">
                  <div className="h-3 w-16 animate-pulse rounded bg-slate-200 sm:w-20" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 sm:h-5" />
                  <div className="h-4 w-20 animate-pulse rounded bg-slate-200 sm:h-5 sm:w-28" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-7 rounded-2xl border border-red-200 bg-red-50 p-6 text-center sm:mt-8 sm:p-8">
            <p className="font-semibold text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && products.length === 0 && (
          <div className="mt-7 rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center sm:mt-8 sm:p-14">
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              No products found
            </h2>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Try another search or change your filters.
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-green-700 sm:mt-6"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Results */}
        {!loading && !error && products.length > 0 && (
          <>
            <div className="mt-6 flex items-center justify-between gap-3 sm:mt-8">
              <p className="min-w-0 text-xs text-slate-500 sm:text-sm">
                Showing{" "}
                <span className="font-bold text-slate-900">
                  {firstResult}–{lastResult}
                </span>{" "}
                of{" "}
                <span className="font-bold text-slate-900">
                  {pagination.totalProducts}
                </span>
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="shrink-0 text-xs font-bold text-green-700 transition hover:text-green-800 sm:text-sm"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Products */}
            <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                aria-label="Product pagination"
                className="mt-10 sm:mt-14"
              >
                {/* Mobile Pagination */}
                <div className="flex items-center justify-between gap-3 sm:hidden">
                  <button
                    type="button"
                    onClick={() =>
                      goToPage(currentPage - 1)
                    }
                    disabled={!pagination.hasPreviousPage}
                    className="flex h-11 flex-1 items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={17} />
                    Previous
                  </button>

                  <div className="shrink-0 text-center">
                    <span className="block text-xs text-slate-400">
                      Page
                    </span>

                    <span className="text-sm font-bold text-slate-900">
                      {currentPage} / {totalPages}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      goToPage(currentPage + 1)
                    }
                    disabled={!pagination.hasNextPage}
                    className="flex h-11 flex-1 items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight size={17} />
                  </button>
                </div>

                {/* Tablet / Desktop Pagination */}
                <div className="hidden flex-wrap items-center justify-center gap-2 sm:flex">
                  <button
                    type="button"
                    onClick={() =>
                      goToPage(currentPage - 1)
                    }
                    disabled={!pagination.hasPreviousPage}
                    className="flex h-10 items-center gap-1 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>

                  {paginationNumbers.map((page, index) => {
                    if (typeof page === "string") {
                      return (
                        <span
                          key={`${page}-${index}`}
                          className="flex h-10 w-8 items-center justify-center text-slate-400"
                        >
                          …
                        </span>
                      );
                    }

                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => goToPage(page)}
                        aria-current={
                          currentPage === page
                            ? "page"
                            : undefined
                        }
                        className={`flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-bold transition ${
                          currentPage === page
                            ? "bg-slate-950 text-white"
                            : "border border-slate-200 bg-white text-slate-600 hover:border-green-300 hover:text-green-700"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() =>
                      goToPage(currentPage + 1)
                    }
                    disabled={!pagination.hasNextPage}
                    className="flex h-10 items-center gap-1 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </nav>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Shop;