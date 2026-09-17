import {
  Boxes,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  Store,
  Users,
  X,
} from "lucide-react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  useEffect,
  useState,
} from "react";

import { useAuth } from "../../context/AuthContext";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();

  const [isOpen, setIsOpen] =
    useState(false);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate("/login");
  };

  // ==========================================
  // CLOSE DRAWER AFTER NAVIGATION
  // ==========================================

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // ==========================================
  // MOBILE DRAWER BEHAVIOUR
  // ==========================================

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow =
        "";

      return;
    }

    document.body.style.overflow =
      "hidden";

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        "";

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isOpen]);

  // ==========================================
  // NAVIGATION STYLES
  // ==========================================

  const navItemClass = ({
    isActive,
  }: {
    isActive: boolean;
  }) =>
    `flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
      isActive
        ? "bg-green-500 text-slate-950"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`;

  // ==========================================
  // SIDEBAR CONTENT
  // ==========================================

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Brand */}

      <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-800 px-5 lg:h-24 lg:px-6">
        <Link
          to="/admin"
          className="flex min-w-0 items-center gap-3"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500 text-slate-950 lg:h-11 lg:w-11 lg:rounded-2xl">
            <ShoppingBag
              size={21}
              strokeWidth={2.5}
            />
          </div>

          <div className="min-w-0">
            <p className="text-lg font-extrabold tracking-tight text-white">
              SUMART
            </p>

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-green-400 lg:text-xs">
              Admin
            </p>
          </div>
        </Link>

        {/* Mobile close */}

        <button
          type="button"
          onClick={() =>
            setIsOpen(false)
          }
          aria-label="Close admin menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
        >
          <X size={21} />
        </button>
      </div>

      {/* Admin info */}

      <div className="shrink-0 border-b border-slate-800 px-5 py-4 lg:px-6 lg:py-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600 lg:text-xs">
          Signed in as
        </p>

        <p className="mt-2 truncate text-sm font-semibold text-white">
          {user?.name}
        </p>

        <p className="mt-1 truncate text-xs text-slate-500">
          {user?.email}
        </p>

        <span className="mt-3 inline-flex rounded-full bg-green-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-green-400 lg:text-[11px]">
          Administrator
        </span>
      </div>

      {/* Navigation */}

      <nav className="flex-1 overflow-y-auto px-4 py-4 lg:py-5">
        <p className="mb-3 px-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600 lg:text-[11px]">
          Management
        </p>

        <div className="space-y-1">
          <NavLink
            to="/admin"
            end
            className={navItemClass}
          >
            <LayoutDashboard
              size={18}
              className="shrink-0"
            />

            Dashboard
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={navItemClass}
          >
            <Package
              size={18}
              className="shrink-0"
            />

            Orders
          </NavLink>

          <NavLink
            to="/admin/products"
            className={navItemClass}
          >
            <Boxes
              size={18}
              className="shrink-0"
            />

            Products
          </NavLink>

          <NavLink
            to="/admin/customers"
            className={navItemClass}
          >
            <Users
              size={18}
              className="shrink-0"
            />

            Customers
          </NavLink>
        </div>

        <div className="my-5 border-t border-slate-800" />

        <p className="mb-3 px-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600 lg:text-[11px]">
          Store
        </p>

        <Link
          to="/"
          className="flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          <Store
            size={18}
            className="shrink-0"
          />

          View Storefront
        </Link>
      </nav>

      {/* Logout */}

      <div className="shrink-0 border-t border-slate-800 p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex min-h-12 w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut
            size={18}
            className="shrink-0"
          />

          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ======================================
          MOBILE ADMIN HEADER
      ======================================= */}

      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/95 px-4 backdrop-blur lg:hidden">
        <Link
          to="/admin"
          className="flex min-w-0 items-center gap-2.5"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-500 text-slate-950">
            <ShoppingBag
              size={19}
              strokeWidth={2.5}
            />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-extrabold tracking-tight text-white">
              SUMART
            </p>

            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-green-400">
              Admin
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() =>
            setIsOpen(true)
          }
          aria-label="Open admin menu"
          aria-expanded={isOpen}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 transition hover:border-slate-600 hover:text-white"
        >
          <Menu size={21} />
        </button>
      </header>

      {/* ======================================
          MOBILE OVERLAY
      ======================================= */}

      <button
        type="button"
        aria-label="Close admin menu"
        onClick={() =>
          setIsOpen(false)
        }
        className={`fixed inset-0 z-40 bg-slate-950/75 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* ======================================
          MOBILE DRAWER
      ======================================= */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[85%] max-w-[320px] border-r border-slate-800 bg-slate-900 shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* ======================================
          DESKTOP SIDEBAR
      ======================================= */}

      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-slate-800 bg-slate-900 lg:block">
        {sidebarContent}
      </aside>
    </>
  );
};

export default AdminSidebar;