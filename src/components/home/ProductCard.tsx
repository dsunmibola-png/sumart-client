import {
  Heart,
  ShoppingCart,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";

type Product = {
  name: string;
  category: string;
  price: number;
  oldPrice: number;
  rating: number;
  image: string;
};

type Props = {
  product: Product;
};

const ProductCard = ({
  product,
}: Props) => {
  const discount =
    product.oldPrice > product.price
      ? Math.round(
          ((product.oldPrice -
            product.price) /
            product.oldPrice) *
            100
        )
      : 0;

  return (
    <motion.article
      whileHover={{
        y: -6,
      }}
      transition={{
        duration: 0.25,
      }}
      className="group overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-[0_22px_60px_rgba(15,23,42,0.10)]"
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          {discount > 0 ? (
            <span className="rounded-full bg-slate-950 px-3 py-1.5 text-[11px] font-bold text-white shadow-md">
              -{discount}%
            </span>
          ) : (
            <span />
          )}

          <button
            type="button"
            aria-label={`Add ${product.name} to wishlist`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-600 shadow-md backdrop-blur transition hover:text-red-500"
          >
            <Heart size={18} />
          </button>
        </div>

        <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-green-600"
          >
            <ShoppingCart size={17} />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-wide text-green-600">
            {product.category}
          </span>

          <div className="flex items-center gap-1">
            <Star
              size={14}
              className="fill-amber-400 text-amber-400"
            />

            <span className="text-xs font-semibold text-slate-600">
              {product.rating}
            </span>
          </div>
        </div>

        <h3 className="mt-3 line-clamp-1 text-lg font-extrabold text-slate-900">
          {product.name}
        </h3>

        <div className="mt-5 flex items-end gap-2">
          <span className="text-xl font-extrabold text-slate-950">
            ₦{product.price.toLocaleString()}
          </span>

          {product.oldPrice >
            product.price && (
            <span className="pb-0.5 text-sm text-slate-400 line-through">
              ₦
              {product.oldPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;