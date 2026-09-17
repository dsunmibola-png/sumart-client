import {
  useEffect,
  useState,
} from "react";
import {
  CheckCircle2,
  LoaderCircle,
  ReceiptText,
  ShieldCheck,
  ShoppingBag,
  XCircle,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { verifyPayment } from "../services/PaymentService";

const PaymentCallback = () => {
  const [searchParams] =
    useSearchParams();

  const navigate = useNavigate();

  const { token } = useAuth();
  const { clearCart } = useCart();

  const [status, setStatus] =
    useState<
      "verifying" | "success" | "error"
    >("verifying");

  const [error, setError] =
    useState("");

  // ==========================================
  // VERIFY PAYMENT
  // ==========================================

  useEffect(() => {
    let redirectTimer:
      | number
      | undefined;

    let cancelled = false;

    const verify = async () => {
      const reference =
        searchParams.get(
          "reference"
        ) ||
        searchParams.get(
          "trxref"
        );

      if (
        !reference ||
        !token
      ) {
        if (!cancelled) {
          setError(
            "Unable to verify this payment."
          );

          setStatus("error");
        }

        return;
      }

      try {
        const data =
          await verifyPayment(
            reference,
            token
          );

        if (cancelled) {
          return;
        }

        /*
         * Only clear the cart after
         * SUMART has successfully
         * verified the payment.
         */
        clearCart();

        setStatus("success");

        redirectTimer =
          window.setTimeout(
            () => {
              navigate(
                `/orders/${data.order._id}`,
                {
                  replace: true,
                  state: {
                    orderPlaced:
                      true,
                  },
                }
              );
            },
            1500
          );
      } catch (error) {
        console.error(error);

        if (cancelled) {
          return;
        }

        setError(
          "Payment could not be verified."
        );

        setStatus("error");
      }
    };

    verify();

    return () => {
      cancelled = true;

      if (
        redirectTimer !==
        undefined
      ) {
        window.clearTimeout(
          redirectTimer
        );
      }
    };
  }, [
    searchParams,
    token,
    clearCart,
    navigate,
  ]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">
      {/* Background */}

      <div className="pointer-events-none absolute -left-32 top-16 hidden h-80 w-80 rounded-full bg-green-100/70 blur-3xl sm:block" />

      <div className="pointer-events-none absolute -right-32 bottom-10 hidden h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl sm:block" />

      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:rounded-3xl">
        {/* ======================================
            BRAND
        ======================================= */}

        <div className="border-b border-slate-100 px-5 py-4 sm:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-600 text-white">
              <ShoppingBag
                size={18}
              />
            </div>

            <span className="text-lg font-extrabold tracking-tight text-slate-900">
              SUMART
            </span>
          </Link>
        </div>

        {/* ======================================
            STATUS CONTENT
        ======================================= */}

        <div className="px-5 py-10 text-center sm:px-10 sm:py-12">
          {/* VERIFYING */}

          {status ===
            "verifying" && (
            <>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 sm:h-24 sm:w-24">
                <LoaderCircle
                  size={42}
                  className="animate-spin text-green-600 sm:h-12 sm:w-12"
                />
              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-green-600">
                Secure Payment
              </p>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Verifying your
                payment
              </h1>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500 sm:text-base">
                Please wait while
                SUMART confirms your
                payment. Don't close
                this page yet.
              </p>

              <div className="mx-auto mt-7 flex max-w-xs items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-xs font-medium text-slate-500">
                <ShieldCheck
                  size={16}
                  className="shrink-0 text-green-600"
                />

                Secure payment
                verification in
                progress
              </div>
            </>
          )}

          {/* SUCCESS */}

          {status ===
            "success" && (
            <>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 sm:h-24 sm:w-24">
                <CheckCircle2
                  size={48}
                  className="text-green-600 sm:h-14 sm:w-14"
                />
              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-green-600">
                Payment Confirmed
              </p>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Payment successful
              </h1>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500 sm:text-base">
                Your payment has
                been confirmed
                successfully.
                Redirecting you to
                your order...
              </p>

              <div
                role="status"
                className="mx-auto mt-7 flex max-w-xs items-center justify-center gap-2 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-xs font-semibold text-green-700"
              >
                <ReceiptText
                  size={16}
                />

                Preparing your
                order details
              </div>
            </>
          )}

          {/* ERROR */}

          {status ===
            "error" && (
            <>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 sm:h-24 sm:w-24">
                <XCircle
                  size={48}
                  className="text-red-500 sm:h-14 sm:w-14"
                />
              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-red-500">
                Verification Issue
              </p>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Payment
                verification failed
              </h1>

              <p
                role="alert"
                className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500 sm:text-base"
              >
                {error}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  to="/orders"
                  className="flex min-h-12 w-full items-center justify-center rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-700 sm:w-auto"
                >
                  View My Orders
                </Link>

                <Link
                  to="/shop"
                  className="flex min-h-12 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700 sm:w-auto"
                >
                  Return to Shop
                </Link>
              </div>
            </>
          )}
        </div>

        {/* ======================================
            FOOTER
        ======================================= */}

        <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck
              size={14}
            />

            Secure checkout by
            SUMART
          </div>
        </div>
      </div>
    </main>
  );
};

export default PaymentCallback;