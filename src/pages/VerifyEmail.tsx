import {
  useEffect,
  useState,
} from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import axios from "axios";
import {
  CheckCircle2,
  Loader2,
  MailCheck,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

import {
  resendVerification,
  verifyEmail,
} from "../services/authService";

const RESEND_COOLDOWN = 60;

const VerifyEmail = () => {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const email =
    searchParams.get("email")?.trim() ??
    "";

  const [code, setCode] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [
    resending,
    setResending,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [verified, setVerified] =
    useState(false);

  const [cooldown, setCooldown] =
    useState(RESEND_COOLDOWN);

  // ========================================
  // RESEND COUNTDOWN
  // ========================================

  useEffect(() => {
    if (
      cooldown <= 0 ||
      verified
    ) {
      return;
    }

    const timer =
      window.setInterval(() => {
        setCooldown((current) =>
          Math.max(
            current - 1,
            0,
          ),
        );
      }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [cooldown, verified]);

  // ========================================
  // CODE INPUT
  // ========================================

  const handleCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value =
      event.target.value
        .replace(/\D/g, "")
        .slice(0, 6);

    setCode(value);

    if (error) {
      setError("");
    }
  };

  // ========================================
  // VERIFY
  // ========================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!email) {
      setError(
        "Your email address is missing. Please register again.",
      );
      return;
    }

    if (code.length !== 6) {
      setError(
        "Please enter the 6-digit verification code.",
      );
      return;
    }

    try {
      setLoading(true);

      const data =
        await verifyEmail(
          email,
          code,
        );

      setVerified(true);
      setMessage(data.message);
    } catch (error) {
      if (
        axios.isAxiosError(error)
      ) {
        setError(
          error.response?.data
            ?.message ||
            "Unable to verify your email.",
        );
      } else {
        setError(
          "Unable to verify your email.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // RESEND CODE
  // ========================================

  const handleResend =
    async () => {
      if (
        !email ||
        cooldown > 0 ||
        resending
      ) {
        return;
      }

      setError("");
      setMessage("");

      try {
        setResending(true);

        const data =
          await resendVerification(
            email,
          );

        setMessage(data.message);
        setCode("");
        setCooldown(
          RESEND_COOLDOWN,
        );
      } catch (error) {
        if (
          axios.isAxiosError(error)
        ) {
          setError(
            error.response?.data
              ?.message ||
              "Unable to resend the verification code.",
          );
        } else {
          setError(
            "Unable to resend the verification code.",
          );
        }
      } finally {
        setResending(false);
      }
    };

  // ========================================
  // SUCCESS SCREEN
  // ========================================

  if (verified) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f9f8] px-4 py-8 sm:px-6 sm:py-12">
        {/* Background */}

        <div className="pointer-events-none absolute -left-32 top-20 hidden h-80 w-80 rounded-full bg-green-100/60 blur-3xl sm:block" />

        <div className="pointer-events-none absolute -right-32 bottom-10 hidden h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl sm:block" />

        {/* Success card */}

        <div className="relative w-full max-w-lg rounded-2xl border border-slate-200/70 bg-white px-5 py-8 text-center shadow-sm sm:rounded-4xl sm:px-12 sm:py-12 sm:shadow-[0_30px_80px_rgba(15,23,42,0.10)]">
          <Link
            to="/"
            className="mx-auto mb-8 inline-flex items-center gap-2.5 sm:hidden"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white">
              <ShoppingBag
                size={20}
              />
            </div>

            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              SUMART
            </span>
          </Link>

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 sm:h-20 sm:w-20">
            <CheckCircle2
              size={34}
              className="text-green-600 sm:hidden"
            />

            <CheckCircle2
              size={40}
              className="hidden text-green-600 sm:block"
            />
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-green-600 sm:mt-7 sm:text-sm sm:tracking-[0.2em]">
            Verification complete
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:mt-3 sm:text-3xl">
            Email verified
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500 sm:mt-4">
            {message ||
              "Your email has been verified successfully. You can now sign in to your SUMART account."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/login",
                {
                  replace: true,
                },
              )
            }
            className="mt-7 flex min-h-12 w-full items-center justify-center rounded-xl bg-green-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/20 sm:mt-8"
          >
            Continue to Sign In
          </button>

          <Link
            to="/"
            className="mt-5 inline-block text-sm font-semibold text-slate-500 transition hover:text-green-600"
          >
            Return to SUMART
          </Link>
        </div>
      </main>
    );
  }

  // ========================================
  // VERIFICATION SCREEN
  // ========================================

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f9f8] lg:px-8 lg:py-12">
      {/* Background */}

      <div className="pointer-events-none absolute -left-32 top-20 hidden h-80 w-80 rounded-full bg-green-100/60 blur-3xl sm:block" />

      <div className="pointer-events-none absolute -right-32 bottom-10 hidden h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl sm:block" />

      <div className="relative mx-auto min-h-screen max-w-6xl overflow-hidden bg-white lg:grid lg:min-h-165 lg:grid-cols-[0.95fr_1.05fr] lg:rounded-4xl lg:border lg:border-slate-200/70 lg:shadow-[0_30px_80px_rgba(15,23,42,0.10)]">
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
                One last step
              </p>

              <h1 className="text-4xl font-bold leading-[1.15] tracking-tight xl:text-5xl">
                Let's confirm

                <span className="block text-green-100">
                  it's really you.
                </span>
              </h1>

              <p className="mt-6 max-w-sm text-base leading-7 text-green-50/90">
                We've sent a secure
                verification code to your
                email address.
              </p>
            </div>

            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                  <ShieldCheck
                    size={16}
                  />
                </div>

                <span className="text-sm font-medium text-green-50">
                  Helps protect your SUMART
                  account
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                  <MailCheck
                    size={16}
                  />
                </div>

                <span className="text-sm font-medium text-green-50">
                  Verification code expires
                  after 15 minutes
                </span>
              </div>
            </div>
          </div>

          <p className="relative z-10 text-sm text-green-100">
            Smart Shopping Starts Here.
          </p>
        </section>

        {/* =====================================
            VERIFICATION FORM
        ====================================== */}

        <section className="flex min-h-screen items-start justify-center px-4 py-6 sm:px-8 sm:py-10 lg:min-h-0 lg:items-center lg:px-14 lg:py-12">
          <div className="w-full max-w-md">
            {/* Mobile branding */}

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
                className="text-sm font-bold text-green-600"
              >
                Sign in
              </Link>
            </div>

            {/* Heading */}

            <div className="mb-6 sm:mb-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600 sm:mb-5 sm:h-14 sm:w-14 sm:rounded-2xl">
                <MailCheck
                  size={24}
                  className="sm:hidden"
                />

                <MailCheck
                  size={27}
                  className="hidden sm:block"
                />
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-600 sm:text-sm">
                Verify your email
              </p>

              <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:mt-2 sm:text-3xl">
                Check your inbox
              </h1>

              {email ? (
                <p className="mt-2 text-sm leading-6 text-slate-500 sm:mt-3">
                  We sent a 6-digit code to{" "}
                  <span className="break-all font-semibold text-slate-700">
                    {email}
                  </span>
                  .
                </p>
              ) : (
                <p className="mt-2 text-sm leading-6 text-red-500 sm:mt-3">
                  No email address was
                  provided.
                </p>
              )}
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

            {/* Success/info message */}

            {message && (
              <div
                role="status"
                className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium leading-5 text-green-700"
              >
                {message}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="verification-code"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Verification code
                </label>

                <input
                  id="verification-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={
                    handleCodeChange
                  }
                  placeholder="000000"
                  maxLength={6}
                  autoFocus
                  disabled={loading}
                  aria-label="6-digit verification code"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-4 text-center text-2xl font-bold tracking-[0.28em] text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100/70 sm:px-4 sm:tracking-[0.45em]"
                />

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Enter the code exactly as
                  it appears in your SUMART
                  email.
                </p>
              </div>

              <button
                type="submit"
                disabled={
                  loading ||
                  code.length !== 6 ||
                  !email
                }
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/20 disabled:cursor-not-allowed disabled:bg-green-400"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Verifying...
                  </>
                ) : (
                  "Verify Email"
                )}
              </button>
            </form>

            {/* Resend */}

            <div className="mt-6 border-t border-slate-100 pt-5 text-center sm:mt-7 sm:pt-6">
              <p className="text-sm text-slate-500">
                Didn't receive the email?
              </p>

              <button
                type="button"
                onClick={
                  handleResend
                }
                disabled={
                  cooldown > 0 ||
                  resending ||
                  !email
                }
                className="mt-2 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-bold text-green-600 transition hover:bg-green-50 hover:text-green-700 disabled:cursor-not-allowed disabled:bg-transparent disabled:text-slate-400 sm:mt-3"
              >
                <RefreshCw
                  size={15}
                  className={
                    resending
                      ? "animate-spin"
                      : ""
                  }
                />

                {resending
                  ? "Sending..."
                  : cooldown > 0
                    ? `Resend code in ${cooldown}s`
                    : "Resend verification code"}
              </button>
            </div>

            {/* Wrong email */}

            <div className="mt-6 text-center sm:mt-8">
              <Link
                to="/register"
                className="inline-flex min-h-10 items-center justify-center rounded-lg px-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-green-600"
              >
                Wrong email? Create your
                account again
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

export default VerifyEmail;