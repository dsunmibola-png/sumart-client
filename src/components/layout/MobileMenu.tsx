import { useState } from "react";
import {
  ChevronDown,
  Heart,
  LogOut,
  Package,
  ShoppingCart,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { cartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const firstName = user?.name?.split(" ")[0];

  const handleLogout = () => {
    logout();
    setShowAccountMenu(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-green-600"
        >
          <ShoppingCart size={27} strokeWidth={2.5} />
          <span>SUMART</span>
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-8 font-medium md:flex">
          <Link
            to="/"
            className="transition-colors hover:text-green-600"
          >
            Home
          </Link>

          <Link
            to="/shop"
            className="transition-colors hover:text-green-600"
          >
            Shop
          </Link>

          <Link
            to="/categories"
            className="transition-colors hover:text-green-600"
          >
            Categories
          </Link>

          <Link
            to="/about"
            className="transition-colors hover:text-green-600"
          >
            About
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Wishlist */}
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="rounded-full p-2 text-slate-700 transition-all duration-200 hover:bg-green-50 hover:text-green-600"
          >
            <Heart size={21} strokeWidth={2} />
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            aria-label="Shopping cart"
            className="relative rounded-full p-2 text-slate-700 transition-all duration-200 hover:bg-green-50 hover:text-green-600"
          >
            <ShoppingCart size={21} strokeWidth={2} />

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-green-600 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="hidden px-2 text-sm font-semibold text-slate-700 transition hover:text-green-600 sm:block"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-green-700 hover:shadow-md"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setShowAccountMenu((current) => !current)
                }
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <User size={17} />
                </div>

                <span className="hidden sm:block">
                  Hi, {firstName}
                </span>

                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    showAccountMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showAccountMenu && (
                <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                  <div className="border-b border-slate-100 px-3 py-3">
                    <p className="text-sm font-semibold text-slate-900">
                      {user?.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {user?.email}
                    </p>
                  </div>

                  <div className="py-2">
                    <Link
                      to="/account"
                      onClick={() => setShowAccountMenu(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-green-600"
                    >
                      <User size={17} />
                      My Account
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setShowAccountMenu(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-green-600"
                    >
                      <Package size={17} />
                      My Orders
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 pt-2">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
                    >
                      <LogOut size={17} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;