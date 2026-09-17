import { NavLink as RouterNavLink } from "react-router-dom";

type NavItemProps = {
  to: string;
  children: React.ReactNode;
};

const NavLink = ({ to, children }: NavItemProps) => {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        `relative text-sm font-medium transition-colors duration-200 ${
          isActive
            ? "text-green-600"
            : "text-slate-700 hover:text-green-600"
        }`
      }
    >
      {({ isActive }) => (
        <span className="relative">
          {children}
          {isActive && (
            <span className="absolute -bottom-2 left-0 h-0.5 w-full rounded-full bg-green-600" />
          )}
        </span>
      )}
    </RouterNavLink>
  );
};

export default NavLink;