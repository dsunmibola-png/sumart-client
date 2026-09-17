import {
  ArrowRight,
  Check,
  LogIn,
  PackageCheck,
  ShoppingBag,
  Star,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const Hero = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative overflow-hidden bg-[#f6f7f3]">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:min-h-162.5 lg:grid-cols-[1fr_0.95fr] lg:gap-12 lg:py-20">
        {/* Left */}
        <div className="relative z-10 max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-3 py-2 text-[10px] font-bold tracking-wide text-green-700 shadow-sm sm:px-3.5 sm:text-xs">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100">
              <ShoppingBag size={13} />
            </span>

            SMART SHOPPING STARTS HERE
          </div>

          {/* Heading */}
          <h1 className="mt-5 max-w-xl text-[38px] font-extrabold leading-[1.04] tracking-[-0.04em] text-slate-950 sm:mt-7 sm:text-6xl lg:text-[68px]">
            Everything you need,
            <span className="text-green-700">
              {" "}
              all in one place.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8">
            Shop quality products across your favourite
            categories with secure payments, reliable delivery
            and a shopping experience built to be simple.
          </p>

          {/* Main Actions */}
          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-8 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
            <Link
              to="/shop"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition duration-200 hover:bg-green-700 sm:rounded-full sm:px-7 sm:py-3.5"
            >
              Start Shopping

              <ArrowRight
                size={16}
                className="hidden xs:block sm:block"
              />
            </Link>

            <Link
              to="/categories"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-3 text-center text-sm font-bold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 sm:rounded-full sm:px-7 sm:py-3.5"
            >
              Browse Categories
            </Link>
          </div>

          {/* Guest Authentication */}
          {!isAuthenticated && (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm sm:mt-5 sm:max-w-md sm:p-4">
              <p className="mb-3 text-xs font-medium text-slate-500">
                Already shopping with SUMART or joining us?
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  to="/login"
                  className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 transition hover:border-green-300 hover:text-green-700"
                >
                  <LogIn size={16} />
                  Log In
                </Link>

                <Link
                  to="/register"
                  className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-green-600 px-3 text-sm font-bold text-white transition hover:bg-green-700"
                >
                  <UserPlus size={16} />
                  Sign Up
                </Link>
              </div>
            </div>
          )}

          {/* Benefits */}
          <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-3 sm:mt-9 sm:flex sm:flex-wrap sm:gap-x-6 sm:gap-y-3">
            <div className="flex items-center gap-2 text-xs text-slate-600 sm:text-sm">
              <Check
                size={15}
                strokeWidth={3}
                className="shrink-0 text-green-700"
              />
              Secure checkout
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600 sm:text-sm">
              <Check
                size={15}
                strokeWidth={3}
                className="shrink-0 text-green-700"
              />
              Easy ordering
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600 sm:text-sm">
              <Check
                size={15}
                strokeWidth={3}
                className="shrink-0 text-green-700"
              />
              Order tracking
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="relative mx-auto w-full max-w-135">
          {/* Background decorations */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-green-200/50 blur-3xl sm:h-72 sm:w-72" />

          <div className="pointer-events-none absolute -bottom-16 -left-16 h-52 w-52 rounded-full bg-amber-100/60 blur-3xl sm:h-64 sm:w-64" />

          {/* Product Showcase */}
          <div className="relative overflow-hidden rounded-3xl bg-[#dfe8d9] p-5 shadow-[0_20px_60px_rgba(15,23,42,0.10)] sm:rounded-[36px] sm:p-9 sm:shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
            {/* Top */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-green-800 sm:text-xs">
                  SUMART PICKS
                </p>

                <h2 className="mt-2 max-w-62.5 text-xl font-extrabold leading-tight text-slate-950 sm:text-2xl">
                  Everyday essentials, carefully selected.
                </h2>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-green-700 shadow-sm sm:h-12 sm:w-12">
                <ShoppingBag
                  size={19}
                  className="sm:h-5.25 sm:w-5.25"
                />
              </div>
            </div>

            {/* Main Visual */}
            <div className="relative mt-5 flex h-56 items-center justify-center overflow-hidden rounded-2xl bg-white/70 sm:mt-8 sm:h-75 sm:rounded-[28px]">
              <div className="absolute left-5 top-5 h-16 w-16 rounded-full bg-green-100 sm:left-8 sm:top-8 sm:h-24 sm:w-24" />

              <div className="absolute bottom-5 right-5 h-24 w-24 rounded-full bg-amber-100/70 sm:h-36 sm:w-36" />

              <div className="relative flex h-32 w-32 items-center justify-center rounded-[30px] bg-green-700 text-white shadow-[0_20px_40px_rgba(21,128,61,0.25)] sm:h-44 sm:w-44 sm:rounded-[40px] sm:shadow-[0_25px_50px_rgba(21,128,61,0.25)]">
                <ShoppingBag
                  size={58}
                  strokeWidth={1.4}
                  className="sm:h-20.5 sm:w-20.5"
                />
              </div>

              {/* Rating */}
              <div className="absolute bottom-3 left-3 rounded-xl bg-white px-3 py-2 shadow-lg sm:bottom-5 sm:left-5 sm:rounded-2xl sm:px-4 sm:py-3">
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      size={11}
                      className="fill-amber-400 text-amber-400 sm:h-3.25 sm:w-3.25"
                    />
                  ))}
                </div>

                <p className="mt-1 text-[10px] font-bold text-slate-900 sm:text-xs">
                  Shop with confidence
                </p>
              </div>
            </div>

            {/* Bottom */}
            <div className="mt-5 flex items-center justify-between gap-3 sm:mt-6">
              <div className="min-w-0">
                <p className="text-[10px] text-slate-600 sm:text-xs">
                  Simple shopping
                </p>

                <p className="mt-1 truncate text-sm font-bold text-slate-950 sm:text-base">
                  From cart to doorstep
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-slate-950 px-3 py-2 text-[10px] font-bold text-white sm:gap-2 sm:px-4 sm:text-xs">
                <PackageCheck size={14} />
                Reliable
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;