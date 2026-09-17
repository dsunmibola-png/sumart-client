import {
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  ShoppingCart,
} from "lucide-react";
import { Link } from "react-router-dom";

const SUPPORT_EMAIL =
  "shopsumart1@gmail.com";

/*
 * Add your WhatsApp/customer support number here.
 *
 * IMPORTANT:
 * Use international format without:
 * +, spaces, brackets or dashes.
 *
 * Nigerian example format:
 * 2348012345678
 */
const WHATSAPP_NUMBER = "2347035548371";

const Footer = () => {
  const currentYear =
    new Date().getFullYear();

  // ==========================================
  // CONTACT LINKS
  // ==========================================

  const emailLink = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
    "SUMART Customer Support",
  )}`;

  const mapsLink =
    "https://www.google.com/maps/search/?api=1&query=Lagos%2C%20Nigeria";

  const whatsappLink =
    WHATSAPP_NUMBER
      ? `https://wa.me/${WHATSAPP_NUMBER }?text=${encodeURIComponent(
          "Hello SUMART, I need help with my order.",
        )}`
      : "";

  // ==========================================
  // SHARE WEBSITE
  // ==========================================

  const handleShare = async () => {
    const shareData = {
      title: "SUMART",
      text: "Smart Shopping Starts Here.",
      url: window.location.origin,
    };

    try {
      if (navigator.share) {
        await navigator.share(
          shareData,
        );

        return;
      }

      if (
        navigator.clipboard &&
        window.isSecureContext
      ) {
        await navigator.clipboard.writeText(
          window.location.origin,
        );
      }
    } catch (error) {
      /*
       * Ignore AbortError because it simply
       * means the customer closed the native
       * share dialog without sharing.
       */
      if (
        error instanceof Error &&
        error.name !== "AbortError"
      ) {
        console.error(
          "Unable to share SUMART:",
          error,
        );
      }
    }
  };

  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* ======================================
            MAIN FOOTER
        ======================================= */}

        <div className="grid gap-x-8 gap-y-10 py-10 sm:grid-cols-2 sm:py-14 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-12 lg:py-16">
          {/* ==================================
              BRAND
          =================================== */}

          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xl font-extrabold text-green-500 transition hover:text-green-400 sm:text-2xl"
            >
              <ShoppingCart
                size={25}
                strokeWidth={2.5}
              />

              SUMART
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400 sm:mt-5 sm:leading-7">
              Smart Shopping Starts Here.
              Discover quality products,
              secure payments and a
              shopping experience designed
              around you.
            </p>

            {/* Quick actions */}

            <div className="mt-5 flex items-center gap-3 sm:mt-6">
              <Link
                to="/"
                aria-label="Visit SUMART home page"
                title="Home"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-slate-400 transition hover:bg-green-500 hover:text-slate-950"
              >
                <Globe2 size={18} />
              </Link>

              <a
                href={emailLink}
                aria-label="Email SUMART support"
                title="Email SUMART"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-slate-400 transition hover:bg-green-500 hover:text-slate-950"
              >
                <MessageCircle
                  size={18}
                />
              </a>

              <button
                type="button"
                onClick={handleShare}
                aria-label="Share SUMART"
                title="Share SUMART"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-slate-400 transition hover:bg-green-500 hover:text-slate-950"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>

          {/* ==================================
              SHOP
          =================================== */}

          <div>
            <h3 className="text-sm font-bold text-white sm:text-base">
              Shop
            </h3>

            <div className="mt-4 space-y-3 text-sm text-slate-400 sm:mt-5">
              <Link
                to="/shop"
                className="block w-fit transition hover:text-green-400"
              >
                All Products
              </Link>

              <Link
                to="/categories"
                className="block w-fit transition hover:text-green-400"
              >
                Categories
              </Link>

              <Link
                to="/wishlist"
                className="block w-fit transition hover:text-green-400"
              >
                Wishlist
              </Link>

              <Link
                to="/cart"
                className="block w-fit transition hover:text-green-400"
              >
                Shopping Cart
              </Link>
            </div>
          </div>

          {/* ==================================
              COMPANY
          =================================== */}

          <div>
            <h3 className="text-sm font-bold text-white sm:text-base">
              Company
            </h3>

            <div className="mt-4 space-y-3 text-sm text-slate-400 sm:mt-5">
              <Link
                to="/about"
                className="block w-fit transition hover:text-green-400"
              >
                About SUMART
              </Link>

              <Link
                to="/account"
                className="block w-fit transition hover:text-green-400"
              >
                My Account
              </Link>

              <Link
                to="/orders"
                className="block w-fit transition hover:text-green-400"
              >
                My Orders
              </Link>

              <Link
                to="/login"
                className="block w-fit transition hover:text-green-400"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* ==================================
              CONTACT
          =================================== */}

          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-sm font-bold text-white sm:text-base">
              Get in touch
            </h3>

            <div className="mt-4 space-y-3 sm:mt-5 sm:space-y-4">
              {/* Location */}

              <a
                href={mapsLink}
                target="_blank"
                rel="noreferrer"
                className="group flex w-fit items-start gap-3 rounded-lg py-1 text-sm text-slate-400 transition hover:text-white"
              >
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-green-500 transition group-hover:text-green-400"
                />

                <span>
                  Lagos, Nigeria
                </span>
              </a>

              {/* Email */}

              <a
                href={emailLink}
                className="group flex w-fit max-w-full items-start gap-3 rounded-lg py-1 text-sm text-slate-400 transition hover:text-white"
              >
                <Mail
                  size={18}
                  className="mt-0.5 shrink-0 text-green-500 transition group-hover:text-green-400"
                />

                <span className="break-all sm:break-normal">
                  {SUPPORT_EMAIL}
                </span>
              </a>

              {/* WhatsApp / Support */}

              {WHATSAPP_NUMBER ? (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex w-fit items-center gap-3 rounded-lg py-1 text-sm text-slate-400 transition hover:text-white"
                >
                  <Phone
                    size={18}
                    className="shrink-0 text-green-500 transition group-hover:text-green-400"
                  />

                  <span>
                    Customer Support
                  </span>
                </a>
              ) : (
                <a
                  href={emailLink}
                  className="group flex w-fit items-center gap-3 rounded-lg py-1 text-sm text-slate-400 transition hover:text-white"
                >
                  <Phone
                    size={18}
                    className="shrink-0 text-green-500 transition group-hover:text-green-400"
                  />

                  <span>
                    Customer Support
                  </span>
                </a>
              )}
            </div>

            <p className="mt-4 max-w-xs text-xs leading-5 text-slate-500">
              Need help with an order?
              Contact SUMART support and
              we'll assist you.
            </p>
          </div>
        </div>

        {/* ======================================
            BOTTOM
        ======================================= */}

        <div className="flex flex-col gap-2 border-t border-slate-800 py-6 text-center text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-7 sm:text-left sm:text-sm">
          <p>
            © {currentYear} SUMART.
            All rights reserved.
          </p>

          <p>
            Smart Shopping Starts Here.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;