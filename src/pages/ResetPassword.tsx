import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
  Mail,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

import {
  forgotPassword,
  resetPassword,
} from "../services/authService";

const RESEND_SECONDS = 60;

const ResetPassword = () => {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const queryEmail =
    searchParams.get("email") || "";

  const redirectTimerRef =
    useRef<number | null>(null);

  const [email, setEmail] =
    useState(queryEmail);

  const [code, setCode] =
    useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

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

  const [
    resending,
    setResending,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [
    resendSeconds,
    setResendSeconds,
  ] = useState(RESEND_SECONDS);

  // ==========================================
  // RESEND COUNTDOWN
  // ==========================================

  useEffect(() => {
    if (resendSeconds <= 0) {
      return;
    }

    const timer =
      window.setTimeout(() => {
        setResendSeconds(
          (current) =>
            Math.max(
              current - 1,
              0,
            ),
        );
      }, 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [resendSeconds]);

  // ==========================================
  // CLEAN UP REDIRECT TIMER
  // ==========================================

  useEffect(() => {
    return () => {
      if (
        redirectTimerRef.current !==
        null
      ) {
        window.clearTimeout(
          redirectTimerRef.current,
        );
      }
    };
  }, []);

  // ==========================================
  // HANDLE RESET
  // ==========================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanEmail =
      email.trim().toLowerCase();

    const cleanCode =
      code.trim();

    if (!cleanEmail) {
      setError(
        "Please enter your email address.",
      );
      return;
    }

    if (
      !/^\d{6}$/.test(cleanCode)
    ) {
      setError(
        "Please enter the 6-digit reset code.",
      );
      return;
    }

    if (
      newPassword.length < 6
    ) {
      setError(
        "Password must be at least 6 characters long.",
      );
      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match.",
      );
      return;
    }

    try {
      setLoading(true);

      const response =
        await resetPassword(
          cleanEmail,
          cleanCode,
          newPassword,
        );

      setSuccess(
        response.message,
      );

      redirectTimerRef.current =
        window.setTimeout(() => {
          navigate("/login", {
            replace: true,
          });
        }, 1800);
    } catch (error) {
      if (
        axios.isAxiosError(error)
      ) {
        setError(
          error.response?.data
            ?.message ||
            "Unable to reset password.",
        );
      } else {
        setError(
          "Unable to reset password.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RESEND RESET CODE
  // ==========================================

  const handleResend =
    async () => {
      const cleanEmail =
        email.trim().toLowerCase();

      if (!cleanEmail) {
        setError(
          "Please enter your email address.",
        );
        return;
      }

      if (
        resendSeconds > 0 ||
        resending
      ) {
        return;
      }

      setError("");
      setSuccess("");

      try {
        setResending(true);

        const response =
          await forgotPassword(
            cleanEmail,
          );

        setSuccess(
          response.message,
        );

        setCode("");

        setResendSeconds(
          RESEND_SECONDS,
        );
      } catch (error) {
        if (
          axios.isAxiosError(error)
        ) {
          setError(
            error.response?.data
              ?.message ||
              "Unable to resend reset code.",
          );
        } else {
          setError(
            "Unable to resend reset code.",
          );
        }
      } finally {
        setResending(false);
      }
    };

  const clearMessages = () => {
    if (error) {
      setError("");
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
                Secure Reset
              </p>

              <h1 className="text-4xl font-bold leading-[1.15] tracking-tight xl:text-5xl">
                Create a new

                <span className="block text-green-100">
                  secure password.
                </span>
              </h1>

              <p className="mt-6 max-w-sm text-base leading-7 text-green-50/90">
                Enter the code sent to
                your email and choose a
                new password for your
                SUMART account.
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
            RESET FORM
        ======================================= */}

        <section className="flex min-h-screen items-start justify-center px-4 py-6 sm:px-8 sm:py-10 lg:min-h-0 lg:items-center lg:px-14 lg:py-12">
          <div className="w-full max-w-md">
            {/* Mobile header */}

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
                className="text-sm font-bold text-green-600 transition hover:text-green-700"
              >
                Sign in
              </Link>
            </div>

            {/* ==================================
                HEADING
            =================================== */}

            <div className="mb-6 sm:mb-7">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600 sm:mb-5 sm:rounded-2xl">
                <KeyRound
                  size={22}
                />
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-600 sm:text-sm">
                Reset Password
              </p>

              <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:mt-2 sm:text-3xl">
                Choose a new password
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500 sm:mt-3">
                Enter your reset code
                and create a new password
                for your account.
              </p>
            </div>

            {/* ==================================
                ERROR
            =================================== */}

            {error && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-5 text-red-600"
              >
                {error}
              </div>
            )}

            {/* ==================================
                SUCCESS
            =================================== */}

            {success && (
              <div
                role="status"
                className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium leading-5 text-green-700"
              >
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <span>
                  {success}
                </span>
              </div>
            )}

            {/* ==================================
                FORM
            =================================== */}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
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
                    type="email"
                    value={email}
                    onChange={(
                      event,
                    ) => {
                      setEmail(
                        event.target
                          .value,
                      );

                      clearMessages();
                    }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={
                      loading ||
                      Boolean(success)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3.5 pl-11 pr-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100/70 disabled:cursor-not-allowed disabled:opacity-70 sm:text-sm"
                  />
                </div>
              </div>

              {/* ==================================
                  RESET CODE
              =================================== */}

              <div>
                <div className="mb-1.5 flex items-center justify-between gap-3 sm:mb-2">
                  <label
                    htmlFor="code"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Reset code
                  </label>

                  <button
                    type="button"
                    onClick={
                      handleResend
                    }
                    disabled={
                      resendSeconds >
                        0 ||
                      resending ||
                      loading ||
                      Boolean(success)
                    }
                    className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-green-600 transition hover:text-green-700 disabled:cursor-not-allowed disabled:text-slate-400"
                  >
                    <RefreshCw
                      size={13}
                      className={
                        resending
                          ? "animate-spin"
                          : ""
                      }
                    />

                    {resending
                      ? "Sending..."
                      : resendSeconds >
                          0
                        ? `Resend in ${resendSeconds}s`
                        : "Resend code"}
                  </button>
                </div>

                <input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(
                    event,
                  ) => {
                    const value =
                      event.target.value
                        .replace(
                          /\D/g,
                          "",
                        )
                        .slice(0, 6);

                    setCode(value);
                    clearMessages();
                  }}
                  placeholder="000000"
                  autoComplete="one-time-code"
                  disabled={
                    loading ||
                    Boolean(success)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-3.5 text-center text-xl font-bold tracking-[0.28em] text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100/70 disabled:cursor-not-allowed disabled:opacity-70 sm:px-4 sm:text-lg sm:tracking-[0.45em]"
                />
              </div>

              {/* ==================================
                  NEW PASSWORD
              =================================== */}

              <div>
                <label
                  htmlFor="new-password"
                  className="mb-1.5 block text-sm font-semibold text-slate-700 sm:mb-2"
                >
                  New password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="new-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      newPassword
                    }
                    onChange={(
                      event,
                    ) => {
                      setNewPassword(
                        event.target
                          .value,
                      );

                      clearMessages();
                    }}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    disabled={
                      loading ||
                      Boolean(success)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3.5 pl-11 pr-14 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100/70 disabled:cursor-not-allowed disabled:opacity-70 sm:text-sm"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) =>
                          !current,
                      )
                    }
                    disabled={
                      loading ||
                      Boolean(success)
                    }
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

              {/* ==================================
                  CONFIRM PASSWORD
              =================================== */}

              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-1.5 block text-sm font-semibold text-slate-700 sm:mb-2"
                >
                  Confirm new password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="confirm-password"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      confirmPassword
                    }
                    onChange={(
                      event,
                    ) => {
                      setConfirmPassword(
                        event.target
                          .value,
                      );

                      clearMessages();
                    }}
                    placeholder="Repeat your new password"
                    autoComplete="new-password"
                    disabled={
                      loading ||
                      Boolean(success)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3.5 pl-11 pr-14 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100/70 disabled:cursor-not-allowed disabled:opacity-70 sm:text-sm"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (current) =>
                          !current,
                      )
                    }
                    disabled={
                      loading ||
                      Boolean(success)
                    }
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

              {/* ==================================
                  SUBMIT
              =================================== */}

              <button
                type="submit"
                disabled={
                  loading ||
                  Boolean(success)
                }
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/20 disabled:cursor-not-allowed disabled:bg-green-400"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />

                    Resetting password...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2
                      size={17}
                    />

                    Password Reset
                  </>
                ) : (
                  <>
                    <KeyRound
                      size={17}
                    />

                    Reset Password
                  </>
                )}
              </button>
            </form>

            {/* ==================================
                SECURITY NOTE
            =================================== */}

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={17}
                  className="mt-0.5 shrink-0 text-green-600"
                />

                <p className="text-xs leading-5 text-slate-500">
                  After your password is
                  changed, existing SUMART
                  sessions using the old
                  credentials may need to
                  sign in again.
                </p>
              </div>
            </div>

            {/* Back to login */}

            <div className="mt-6 flex justify-center">
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

export default ResetPassword;