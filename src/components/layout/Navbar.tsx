import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Heart,
  Home,
  Info,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Package,
  ShoppingCart,
  Store,
  Tags,
  User,
  UserPlus,
  X,
} from "lucide-react";
import {
  Link,
  NavLink,
  useLocation,
} from "react-router-dom";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";

const Navbar = () => {
  const { cartCount } = useCart();

  const { wishlistCount } =
    useWishlist();

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  const location = useLocation();

  const [
    showAccountMenu,
    setShowAccountMenu,
  ] = useState(false);

  const [
    showMobileMenu,
    setShowMobileMenu,
  ] = useState(false);

  const accountMenuRef =
    useRef<HTMLDivElement>(null);

  const firstName =
    user?.name?.split(" ")[0];

  const isAdmin =
    isAuthenticated &&
    user?.role === "admin";

  const handleLogout = () => {
    logout();
    setShowAccountMenu(false);
    setShowMobileMenu(false);
  };

  // Close menus whenever customer navigates
  useEffect(() => {
    setShowMobileMenu(false);
    setShowAccountMenu(false);
  }, [location.pathname]);

  // Prevent page scrolling while mobile menu is open
  useEffect(() => {
    if (!showMobileMenu) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [showMobileMenu]);

  // Close desktop account dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent,
    ) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(
          event.target as Node,
        )
      ) {
        setShowAccountMenu(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  const mobileNavigation = [
    {
      name: "Home",
      description:
        "Back to the homepage",
      to: "/",
      icon: Home,
      end: true,
    },
    {
      name: "Shop",
      description:
        "Browse all products",
      to: "/shop",
      icon: Store,
      end: false,
    },
    {
      name: "Categories",
      description:
        "Shop by category",
      to: "/categories",
      icon: Tags,
      end: false,
    },
    {
      name: "About",
      description:
        "Learn more about SUMART",
      to: "/about",
      icon: Info,
      end: false,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:h-24">
          {/* Logo */}
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 text-xl font-extrabold tracking-tight text-green-600 sm:text-2xl"
          >
            <ShoppingCart
              size={24}
              strokeWidth={2.5}
              className="sm:h-6.75 sm:w-6.75"
            />

            <span>SUMART</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 font-medium md:flex">
            <NavLink
              to="/"
              end
              className={({
                isActive,
              }) =>
                `transition-colors ${
                  isActive
                    ? "text-green-600"
                    : "text-slate-700 hover:text-green-600"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/shop"
              className={({
                isActive,
              }) =>
                `transition-colors ${
                  isActive
                    ? "text-green-600"
                    : "text-slate-700 hover:text-green-600"
                }`
              }
            >
              Shop
            </NavLink>

            <NavLink
              to="/categories"
              className={({
                isActive,
              }) =>
                `transition-colors ${
                  isActive
                    ? "text-green-600"
                    : "text-slate-700 hover:text-green-600"
                }`
              }
            >
              Categories
            </NavLink>

            <NavLink
              to="/about"
              className={({
                isActive,
              }) =>
                `transition-colors ${
                  isActive
                    ? "text-green-600"
                    : "text-slate-700 hover:text-green-600"
                }`
              }
            >
              About
            </NavLink>
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 md:flex lg:gap-3">
            {/* Desktop Wishlist */}
            <Link
              to="/wishlist"
              aria-label={
                wishlistCount > 0
                  ? `Wishlist with ${wishlistCount} items`
                  : "Wishlist"
              }
              className="relative rounded-full p-2 text-slate-700 transition hover:bg-green-50 hover:text-green-600"
            >
              <Heart size={21} />

              {wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {wishlistCount > 99
                    ? "99+"
                    : wishlistCount}
                </span>
              )}
            </Link>

            {/* Desktop Cart */}
            <Link
              to="/cart"
              aria-label="Shopping cart"
              className="relative rounded-full p-2 text-slate-700 transition hover:bg-green-50 hover:text-green-600"
            >
              <ShoppingCart
                size={21}
              />

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-green-600 px-1 text-[10px] font-bold text-white">
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}
            </Link>

            {/* Guest Actions */}
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="px-2 text-sm font-semibold text-slate-700 transition hover:text-green-600"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 hover:shadow-md lg:px-5"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div
                ref={accountMenuRef}
                className="relative"
              >
                {/* Account Button */}
                <button
                  type="button"
                  onClick={() =>
                    setShowAccountMenu(
                      (current) =>
                        !current,
                    )
                  }
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-green-100 text-green-700">
                    {user?.avatar ? (
                      <img
                        src={
                          user.avatar
                        }
                        alt={
                          user.name
                        }
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User
                        size={17}
                      />
                    )}
                  </div>

                  <span className="hidden lg:block">
                    Hi, {firstName}
                  </span>

                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      showAccountMenu
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                {/* Desktop Account Dropdown */}
                {showAccountMenu && (
                  <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                    <div className="border-b border-slate-100 px-3 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-green-100 text-green-700">
                          {user?.avatar ? (
                            <img
                              src={
                                user.avatar
                              }
                              alt={
                                user.name
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User
                              size={
                                21
                              }
                            />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {
                              user?.name
                            }
                          </p>

                          <p className="mt-0.5 truncate text-xs text-slate-500">
                            {
                              user?.email
                            }
                          </p>

                          {isAdmin && (
                            <span className="mt-2 inline-flex rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-green-700">
                              Admin
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="mb-1 flex items-center gap-3 rounded-xl bg-green-50 px-3 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-100"
                        >
                          <LayoutDashboard
                            size={
                              17
                            }
                          />

                          Admin
                          Dashboard
                        </Link>
                      )}

                      <Link
                        to="/account"
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-green-600"
                      >
                        <User
                          size={17}
                        />

                        My Profile
                      </Link>

                      <Link
                        to="/orders"
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-green-600"
                      >
                        <Package
                          size={17}
                        />

                        My Orders
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-2">
                      <button
                        type="button"
                        onClick={
                          handleLogout
                        }
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
                      >
                        <LogOut
                          size={17}
                        />

                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-0.5 md:hidden">
            {/* Mobile Wishlist */}
            <Link
              to="/wishlist"
              aria-label={
                wishlistCount > 0
                  ? `Wishlist with ${wishlistCount} items`
                  : "Wishlist"
              }
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-700 transition active:bg-red-50 active:text-red-500"
            >
              <Heart
                size={21}
                className={
                  wishlistCount > 0
                    ? "fill-red-500 text-red-500"
                    : ""
                }
              />

              {wishlistCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow-sm">
                  {wishlistCount > 99
                    ? "99+"
                    : wishlistCount}
                </span>
              )}
            </Link>

            {/* Mobile Cart */}
            <Link
              to="/cart"
              aria-label={
                cartCount > 0
                  ? `Shopping cart with ${cartCount} items`
                  : "Shopping cart"
              }
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-700 transition active:bg-green-50 active:text-green-600"
            >
              <ShoppingCart
                size={21}
              />

              {cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-green-600 px-1 text-[9px] font-bold text-white shadow-sm">
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}
            </Link>

            {/* Hamburger */}
            <button
              type="button"
              onClick={() =>
                setShowMobileMenu(
                  (current) =>
                    !current,
                )
              }
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                showMobileMenu
                  ? "bg-green-600 text-white"
                  : "border border-slate-200 bg-white text-slate-800 active:bg-slate-100"
              }`}
              aria-label={
                showMobileMenu
                  ? "Close menu"
                  : "Open menu"
              }
              aria-expanded={
                showMobileMenu
              }
            >
              {showMobileMenu ? (
                <X size={23} />
              ) : (
                <Menu size={23} />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 top-16 z-40 md:hidden">
          {/* Backdrop */}
          <button
            type="button"
            onClick={() =>
              setShowMobileMenu(
                false,
              )
            }
            aria-label="Close menu"
            className="absolute inset-0 bg-slate-950/30 backdrop-blur-[2px]"
          />

          {/* Menu Panel */}
          <div className="absolute left-0 right-0 top-0 max-h-[calc(100dvh-4rem)] overflow-y-auto rounded-b-3xl border-b border-slate-200 bg-white shadow-2xl">
            <div className="mx-auto max-w-7xl px-4 pb-6 pt-5 sm:px-6">
              {/* Logged In User */}
              {isAuthenticated && (
                <div className="mb-5 flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-green-100 text-green-700">
                    {user?.avatar ? (
                      <img
                        src={
                          user.avatar
                        }
                        alt={
                          user.name
                        }
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User
                        size={21}
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {user?.name}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {user?.email}
                    </p>
                  </div>

                  {isAdmin && (
                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-green-700">
                      Admin
                    </span>
                  )}
                </div>
              )}

              <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Browse
              </p>

              {/* Main Mobile Navigation */}
              <nav className="space-y-1">
                {mobileNavigation.map(
                  ({
                    name,
                    description,
                    to,
                    icon: Icon,
                    end,
                  }) => (
                    <NavLink
                      key={to}
                      to={to}
                      end={end}
                      className={({
                        isActive,
                      }) =>
                        `flex min-h-16 items-center gap-3 rounded-2xl px-3 py-2.5 transition ${
                          isActive
                            ? "bg-green-50 text-green-700"
                            : "text-slate-700 active:bg-slate-50"
                        }`
                      }
                    >
                      {({
                        isActive,
                      }) => (
                        <>
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                              isActive
                                ? "bg-green-600 text-white"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            <Icon
                              size={
                                19
                              }
                            />
                          </span>

                          <span className="min-w-0">
                            <span className="block text-sm font-bold">
                              {
                                name
                              }
                            </span>

                            <span className="mt-0.5 block text-xs font-normal text-slate-500">
                              {
                                description
                              }
                            </span>
                          </span>
                        </>
                      )}
                    </NavLink>
                  ),
                )}
              </nav>

              <div className="my-4 border-t border-slate-100" />

              <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Your SUMART
              </p>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="flex min-h-14 items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition active:bg-slate-50"
              >
                <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <Heart
                    size={19}
                    className={
                      wishlistCount >
                      0
                        ? "fill-red-500 text-red-500"
                        : ""
                    }
                  />

                  {wishlistCount >
                    0 && (
                    <span className="absolute -right-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                      {wishlistCount >
                      99
                        ? "99+"
                        : wishlistCount}
                    </span>
                  )}
                </span>

                <span>
                  Wishlist
                </span>

                {wishlistCount >
                  0 && (
                  <span className="ml-auto rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-500">
                    {
                      wishlistCount
                    }
                  </span>
                )}
              </Link>

              {/* Authenticated Menu */}
              {isAuthenticated ? (
                <>
                  <Link
                    to="/account"
                    className="flex min-h-14 items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition active:bg-slate-50"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                      <User
                        size={19}
                      />
                    </span>

                    My Account
                  </Link>

                  <Link
                    to="/orders"
                    className="flex min-h-14 items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition active:bg-slate-50"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                      <Package
                        size={19}
                      />
                    </span>

                    My Orders
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="mt-2 flex min-h-14 items-center gap-3 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
                    >
                      <LayoutDashboard
                        size={19}
                      />

                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={
                      handleLogout
                    }
                    className="mt-2 flex min-h-14 w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-semibold text-red-500 transition active:bg-red-50"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                      <LogOut
                        size={19}
                      />
                    </span>

                    Logout
                  </button>
                </>
              ) : (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700"
                  >
                    <LogIn
                      size={17}
                    />

                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white"
                  >
                    <UserPlus
                      size={17}
                    />

                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;