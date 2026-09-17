import {
  ArrowRight,
  Package,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import { Link } from "react-router-dom";

import ProductCard from "../shop/ProductCard";
import {
  getProducts,
} from "../../services/productService";

import type {
  Product,
} from "../../types/product";

const FeaturedProducts = () => {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getProducts({
            page: 1,
            limit: 4,
            sort: "featured",
            inStock: false,
          });

        setProducts(
          response.products,
        );
      } catch (error) {
        console.error(
          "Unable to load featured products:",
          error,
        );

        setProducts([]);
        setError(
          "Unable to load featured products.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <section className="bg-[#f7f7f5] py-10 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-700 sm:text-xs">
              Selected for you
            </p>

            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:mt-3 sm:text-4xl">
              Featured products
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:mt-3 sm:text-base sm:leading-7">
              Discover some of the best products available
              on SUMART right now.
            </p>
          </div>

          {/* Desktop Shop Link */}
          <Link
            to="/shop"
            className="group hidden shrink-0 items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-900 transition hover:border-slate-950 sm:inline-flex"
          >
            Shop all products

            <ArrowRight
              size={16}
              className="transition group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 lg:mt-12 lg:grid-cols-4 lg:gap-6">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white sm:rounded-2xl"
              >
                <div className="aspect-square animate-pulse bg-slate-200 sm:aspect-auto sm:h-64" />

                <div className="space-y-2.5 p-3 sm:space-y-3 sm:p-5">
                  <div className="h-3 w-14 animate-pulse rounded bg-slate-200 sm:w-20" />

                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 sm:h-5" />

                  <div className="h-4 w-20 animate-pulse rounded bg-slate-200 sm:h-5 sm:w-28" />

                  <div className="h-10 w-full animate-pulse rounded-lg bg-slate-200 sm:rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-8 text-center sm:mt-12">
            <Package
              size={30}
              className="mx-auto text-red-300"
            />

            <p className="mt-3 text-sm font-bold text-red-600">
              {error}
            </p>

            <Link
              to="/shop"
              className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-green-700"
            >
              Visit the shop
              <ArrowRight size={15} />
            </Link>
          </div>
        )}

        {/* No Products */}
        {!loading &&
          !error &&
          products.length === 0 && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center sm:mt-12 sm:rounded-[28px] sm:py-16">
              <Package
                size={32}
                className="mx-auto text-slate-300"
              />

              <p className="mt-4 font-bold text-slate-900">
                Products coming soon
              </p>

              <p className="mt-2 text-sm text-slate-500">
                We're preparing something good for you.
              </p>
            </div>
          )}

        {/* Products */}
        {!loading &&
          !error &&
          products.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 lg:mt-12 lg:grid-cols-4 lg:gap-6">
              {products.map(
                (product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                ),
              )}
            </div>
          )}

        {/* Mobile Shop Link */}
        {!loading &&
          !error &&
          products.length > 0 && (
            <Link
              to="/shop"
              className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition active:bg-green-700 sm:hidden"
            >
              Shop All Products

              <ArrowRight size={16} />
            </Link>
          )}
      </div>
    </section>
  );
};

export default FeaturedProducts;