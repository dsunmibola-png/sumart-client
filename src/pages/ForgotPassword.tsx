import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  KeyRound,
  Loader2,
  Mail,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

import { forgotPassword } from "../services/authService";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==========================================
  // HANDLE SUBMIT
  // ==========================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");

    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanEmail) {
      setError(
        "Please enter your email address.",
      );

      return;
    }

    try {
      setLoading(true);

      await forgotPassword(
        cleanEmail,
      );

      navigate(
        `/reset-password?email=${encodeURIComponent(
          cleanEmail,
        )}`,
      );
    } catch (error) {
      if (
        axios.isAxiosError(error)
      ) {
        setError(
          error.response?.data
            ?.message ||
            "Unable to send reset instructions.",
        );
      } else {
        setError(
          "Unable to send reset instructions.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f9f8] lg:px-8 lg:py-12">
      {/* ======================================
          BACKGROUND
      ======================================= */}

      <div className="pointer-events-none absolute -left-32 top-20 hidden h-80 w-80 rounded-full bg-green-100/60 blur-3xl sm:block" />

      <div className="pointer-events-none absolute -right-32 bottom-10 hidden h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl sm:block" />

      <div className="relative mx-auto min-h-screen max-w-6xl overflow-hidden bg-white lg:grid lg:min-h-170 lg:grid-cols-[0.95fr_1.05fr] lg:rounded-4xl lg:border lg:border-slate-200/70 lg:shadow-[0_30px_80px_rgba(15,23,42,0.10)]">
        {/* ======================================
            DESKTOP BRANDING
        ======================================= */}

        <section className="relative hidden overflow-hidden bg-linear-to-br from-green-700 via-green-600 to-emerald-500 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10" />

          <div className="absolute -right-6 top-16 h-44 w-44 rounded-full border border-white/10" />

          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/5" />

          <div className="relative z-10">
            <Link
              to="/"
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-green-600 shadow-lg">
                <ShoppingBag
                  size={22}
                />
              </div>

              <span className="text-2xl font-bold tracking-tight">
                SUMART
              </span>
            </Link>

            <div className="mt-20 max-w-md">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-green-100">
                Account Recovery
              </p>

              <h1 className="text-4xl font-bold leading-[1.15] tracking-tight xl:text-5xl">
                Forgot your password?

                <span className="block text-green-100">
                  We'll help you reset it.
                </span>
              </h1>

              <p className="mt-6 max-w-sm text-base leading-7 text-green-50/90">
                Enter the email connected
                to your SUMART account and
                we'll send you a secure
                reset code.
              </p>
            </div>

            <div className="mt-10 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                <ShieldCheck
                  size={16}
                />
              </div>

              <span className="text-sm font-medium text-green-50">
                Reset codes expire after
                15 minutes
              </span>
            </div>
          </div>

          <p className="relative z-10 text-sm text-green-100">
            Smart Shopping Starts Here.
          </p>
        </section>

        {/* ======================================
            FORM
        ======================================= */}

        <section className="flex min-h-screen items-start justify-center px-4 py-6 sm:px-8 sm:py-10 lg:min-h-0 lg:items-center lg:px-14 lg:py-12">
          <div className="w-full max-w-md">
            {/* Mobile header */}

            <div className="mb-8 flex items-center justify-between lg:hidden">
              <Link
                to="/"
                className="inline-flex items-center gap-2.5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white shadow-sm">
                  <ShoppingBag
                    size={20}
                  />
                </div>

                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  SUMART
                </span>
              </Link>

              <Link
                to="/login"
                className="text-sm font-bold text-green-600 transition hover:text-green-700"
              >
                Sign in
              </Link>
            </div>

            {/* Heading */}

            <div className="mb-6 sm:mb-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600 sm:mb-5 sm:rounded-2xl">
                <KeyRound
                  size={22}
                />
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-600 sm:text-sm">
                Password Recovery
              </p>

              <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:mt-2 sm:text-3xl">
                Forgot password?
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500 sm:mt-3">
                Enter your email address
                and we'll send you a
                6-digit password reset
                code.
              </p>
            </div>

            {/* Error */}

            {error && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-5 text-red-600"
              >
                {error}
              </div>
            )}

            {/* ==================================
                FORM
            =================================== */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-semibold text-slate-700 sm:mb-2"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(
                      event,
                    ) => {
                      setEmail(
                        event.target
                          .value,
                      );

                      if (error) {
                        setError("");
                      }
                    }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={loading}
                    autoFocus
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3.5 pl-11 pr-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100/70 disabled:cursor-not-allowed disabled:opacity-70 sm:text-sm"
                  />
                </div>
              </div>

              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/20 disabled:cursor-not-allowed disabled:bg-green-400"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />

                    Sending code...
                  </>
                ) : (
                  <>
                    <Mail size={17} />
                    Send Reset Code
                  </>
                )}
              </button>
            </form>

            {/* ==================================
                INFO
            =================================== */}

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={17}
                  className="mt-0.5 shrink-0 text-green-600"
                />

                <p className="text-xs leading-5 text-slate-500">
                  For security, we'll send
                  password reset
                  instructions to the email
                  associated with the
                  account.
                </p>
              </div>
            </div>

            {/* Back */}

            <div className="mt-6 flex justify-center sm:mt-7">
              <Link
                to="/login"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-green-600"
              >
                <ArrowLeft
                  size={16}
                />

                Back to sign in
              </Link>
            </div>

            <p className="mt-5 text-center text-xs text-slate-400 lg:hidden">
              Smart Shopping Starts Here.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ForgotPassword;