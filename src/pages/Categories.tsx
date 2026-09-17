import { motion } from "framer-motion";
import {
  ArrowRight,
  Grid3X3,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

import { categories } from "../data/categories";

const Categories = () => {
  return (
    <main className="min-h-screen bg-[#f7f9f8]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="pointer-events-none absolute -left-24 top-0 h-60 w-60 rounded-full bg-green-200/30 blur-3xl sm:h-72 sm:w-72" />

        <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-emerald-100/40 blur-3xl sm:h-80 sm:w-80" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-2 text-xs font-bold text-green-700 sm:px-4 sm:text-sm">
              <Grid3X3 size={15} />
              Browse Collections
            </div>

            <h1 className="mt-5 text-3xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Shop by category.
              <span className="mt-1 block text-green-600 sm:mt-2">
                Find what fits your lifestyle.
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8">
              Explore curated product collections designed to make
              finding what you need faster, easier and more enjoyable.
            </p>

            <Link
              to="/shop"
              className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 sm:mt-8 sm:px-6 sm:py-3.5"
            >
              Browse All Products
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-10 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Section Header */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-green-600 sm:text-sm sm:tracking-[0.18em]">
                <Sparkles size={15} />
                Explore SUMART
              </div>

              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-950 sm:mt-4 sm:text-4xl">
                Discover our categories
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:mt-4 sm:text-base sm:leading-7">
                Choose a category and start exploring products selected
                for quality, convenience and value.
              </p>
            </div>

            <Link
              to="/shop"
              className="hidden shrink-0 items-center gap-2 text-sm font-bold text-green-700 transition hover:text-green-800 sm:flex"
            >
              View all products
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Category Grid */}
          <div className="mt-7 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;

              return (
                <motion.div
                  key={category.title}
                  initial={{
                    opacity: 0,
                    y: 18,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.15,
                  }}
                  transition={{
                    duration: 0.35,
                    delay: Math.min(index * 0.05, 0.2),
                  }}
                >
                  <Link
                    to={`/shop?category=${encodeURIComponent(
                      category.title,
                    )}`}
                    className="group relative block h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 active:scale-[0.99] sm:rounded-[26px] sm:p-6 sm:hover:-translate-y-1 sm:hover:border-green-200 sm:hover:shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:p-7"
                  >
                    {/* Decorative background */}
                    <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-green-100/70 transition duration-500 group-hover:scale-150 sm:h-36 sm:w-36" />

                    <div className="relative">
                      {/* Mobile layout */}
                      <div className="flex items-center gap-4 sm:block">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600 transition group-hover:bg-green-600 group-hover:text-white sm:h-14 sm:w-14 sm:rounded-2xl">
                          <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                        </div>

                        <div className="min-w-0 flex-1 sm:mt-7">
                          <h3 className="truncate text-base font-extrabold text-slate-900 sm:text-xl">
                            {category.title}
                          </h3>

                          <p className="mt-1 truncate text-xs text-slate-500 sm:mt-2 sm:text-sm">
                            {category.products}
                          </p>
                        </div>

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition group-hover:border-green-200 group-hover:text-green-600 sm:absolute sm:right-0 sm:top-0 sm:h-10 sm:w-10">
                          <ArrowRight size={17} />
                        </div>
                      </div>

                      {/* Desktop / Tablet footer */}
                      <div className="mt-5 hidden border-t border-slate-100 pt-4 sm:block">
                        <p className="text-sm font-semibold text-slate-600 transition group-hover:text-green-600">
                          Explore collection
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile All Products CTA */}
          <Link
            to="/shop"
            className="mt-5 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 text-sm font-bold text-green-700 sm:hidden"
          >
            <ShoppingBag size={18} />
            Browse All Products
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Categories;