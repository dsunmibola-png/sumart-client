import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import {
  Check,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  ShoppingBag,
  User,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } =
      event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError(
        "Please fill in all fields.",
      );
      return;
    }

    if (
      formData.password.length < 6
    ) {
      setError(
        "Password must be at least 6 characters.",
      );
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError(
        "Passwords do not match.",
      );
      return;
    }

    try {
      setLoading(true);

      const data = await register(
        formData.name.trim(),
        formData.email
          .trim()
          .toLowerCase(),
        formData.password,
      );

      navigate(
        `/verify-email?email=${encodeURIComponent(
          data.email,
        )}`,
      );
    } catch (error) {
      if (
        axios.isAxiosError(error)
      ) {
        setError(
          error.response?.data
            ?.message ||
            "Unable to create your account.",
        );
      } else {
        setError(
          "Unable to create your account.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClassName =
    "w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3.5 pl-11 pr-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100/70 sm:text-sm";

  const passwordInputClassName =
    "w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3.5 pl-11 pr-14 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100/70 sm:text-sm";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f9f8] lg:px-8 lg:py-12">
      {/* Background decoration */}

      <div className="pointer-events-none absolute -left-32 top-20 hidden h-80 w-80 rounded-full bg-green-100/60 blur-3xl sm:block" />

      <div className="pointer-events-none absolute -right-32 bottom-10 hidden h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl sm:block" />

      <div className="relative mx-auto min-h-screen max-w-6xl overflow-hidden bg-white lg:grid lg:min-h-180 lg:grid-cols-[0.95fr_1.05fr] lg:rounded-4xl lg:border lg:border-slate-200/70 lg:shadow-[0_30px_80px_rgba(15,23,42,0.10)]">
        {/* =====================================
            DESKTOP BRANDING
        ====================================== */}

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
                Welcome to SUMART
              </p>

              <h1 className="text-4xl font-bold leading-[1.15] tracking-tight xl:text-5xl">
                Everything you need,

                <span className="block text-green-100">
                  all in one place.
                </span>
              </h1>

              <p className="mt-6 max-w-sm text-base leading-7 text-green-50/90">
                Create your account and
                enjoy a smarter, faster and
                more convenient way to shop.
              </p>
            </div>

            <div className="mt-10 space-y-4">
              {[
                "Fast and secure checkout",
                "Save your favourite products",
                "Track your orders easily",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                    <Check
                      size={14}
                    />
                  </div>

                  <span className="text-sm font-medium text-green-50">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 text-sm text-green-100">
            Smart Shopping Starts Here.
          </p>
        </section>

        {/* =====================================
            REGISTER FORM
        ====================================== */}

        <section className="flex min-h-screen items-start justify-center px-4 py-6 sm:px-8 sm:py-10 lg:min-h-0 lg:items-center lg:px-14 lg:py-12">
          <div className="w-full max-w-md">
            {/* Mobile branding */}

            <div className="mb-7 flex items-center justify-between lg:hidden">
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
                className="text-sm font-bold text-green-600"
              >
                Sign in
              </Link>
            </div>

            {/* Heading */}

            <div className="mb-6 sm:mb-8">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-600 sm:text-sm">
                Get Started
              </p>

              <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:mt-2 sm:text-3xl">
                Create your account
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500 sm:mt-3">
                Enter your details below to
                create your SUMART account.
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

            <form
              onSubmit={handleSubmit}
              className="space-y-4 sm:space-y-5"
            >
              {/* Name */}

              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-semibold text-slate-700 sm:mb-2"
                >
                  Full name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={
                      formData.name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter your full name"
                    autoComplete="name"
                    disabled={loading}
                    className={
                      inputClassName
                    }
                  />
                </div>
              </div>

              {/* Email */}

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
                    name="email"
                    type="email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={loading}
                    className={
                      inputClassName
                    }
                  />
                </div>
              </div>

              {/* Password */}

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-semibold text-slate-700 sm:mb-2"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      formData.password
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    disabled={loading}
                    className={
                      passwordInputClassName
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) =>
                          !current,
                      )
                    }
                    disabled={loading}
                    className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff
                        size={18}
                      />
                    ) : (
                      <Eye
                        size={18}
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block text-sm font-semibold text-slate-700 sm:mb-2"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      formData
                        .confirmPassword
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    disabled={loading}
                    className={
                      passwordInputClassName
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (current) =>
                          !current,
                      )
                    }
                    disabled={loading}
                    className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed"
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff
                        size={18}
                      />
                    ) : (
                      <Eye
                        size={18}
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms */}

              <p className="text-xs leading-5 text-slate-400">
                By creating an account, you
                agree to SUMART's Terms of
                Service and Privacy Policy.
              </p>

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

                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Login */}

            <div className="my-6 flex items-center gap-3 sm:my-7 sm:gap-4">
              <div className="h-px flex-1 bg-slate-200" />

              <span className="whitespace-nowrap text-[10px] font-medium uppercase tracking-wide text-slate-400 sm:text-xs">
                Already a member?
              </span>

              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <Link
              to="/login"
              className="flex min-h-12 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
            >
              Sign in to your account
            </Link>

            <p className="mt-6 text-center text-xs text-slate-400 lg:hidden">
              Smart Shopping Starts Here.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Register;