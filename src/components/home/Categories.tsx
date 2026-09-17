import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import { categories } from "../../data/categories";

const Categories = () => {
  return (
    <section className="bg-white py-10 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-700 sm:text-xs">
              Explore SUMART
            </p>

            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:mt-3 sm:text-4xl">
              Shop by category
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:mt-3 sm:text-base sm:leading-7">
              Browse our collections and find exactly what
              you're looking for.
            </p>
          </div>

          {/* Desktop link */}
          <Link
            to="/categories"
            className="group hidden shrink-0 items-center gap-2 text-sm font-bold text-slate-900 sm:inline-flex"
          >
            All categories

            <ArrowUpRight
              size={17}
              className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        {/* Category Grid */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 lg:mt-12 lg:grid-cols-3">
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.title}
                to={`/shop?category=${encodeURIComponent(
                  category.title,
                )}`}
                className={`group relative min-w-0 overflow-hidden rounded-2xl border p-4 transition duration-300 active:scale-[0.99] sm:min-h-52.5 sm:rounded-[28px] sm:p-7 sm:hover:-translate-y-1 sm:hover:shadow-xl ${
                  index === 0
                    ? "border-green-200 bg-green-50"
                    : "border-slate-200 bg-[#f8f8f6]"
                }`}
              >
                {/* Decoration */}
                <div className="pointer-events-none absolute -bottom-14 -right-10 h-32 w-32 rounded-full bg-white/70 transition duration-500 group-hover:scale-125 sm:h-40 sm:w-40" />

                <div className="relative flex h-full flex-col">
                  {/* Top */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-green-700 shadow-sm sm:h-12 sm:w-12 sm:rounded-2xl">
                      <Icon
                        size={20}
                        className="sm:h-5.75 sm:w-5.75"
                      />
                    </div>

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition group-hover:bg-slate-950 group-hover:text-white sm:h-9 sm:w-9">
                      <ArrowUpRight size={15} />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mt-5 sm:mt-auto sm:pt-10">
                    <h3 className="line-clamp-2 text-sm font-extrabold leading-5 text-slate-950 sm:text-xl">
                      {category.title}
                    </h3>

                    <p className="mt-1.5 line-clamp-2 text-[11px] leading-4 text-slate-500 sm:mt-2 sm:text-sm sm:leading-normal">
                      {category.products}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile All Categories */}
        <Link
          to="/categories"
          className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-800 transition active:bg-slate-100 sm:hidden"
        >
          View All Categories
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </section>
  );
};

export default Categories;