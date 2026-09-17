import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

const Logo = () => {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 transition-opacity hover:opacity-90"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white shadow-sm">
        <ShoppingCart size={20} />
      </div>

      <div className="flex flex-col">
        <span className="text-xl font-extrabold tracking-tight text-slate-900">
          SUMART
        </span>

        <span className="text-xs text-slate-500">
          Smart Shopping Starts Here
        </span>
      </div>
    </Link>
  );
};

export default Logo;