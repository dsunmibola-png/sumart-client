import {
  Heart,
  ShoppingCart,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

import type { Product } from "../../types/product";

import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist();

  const isOutOfStock = product.stock === 0;
  const wishlisted = isInWishlist(product._id);

  const handleAddToCart = () => {
    if (isOutOfStock) {
      return;
    }

    addToCart(product);
  };

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 sm:rounded-2xl sm:hover:-translate-y-1 sm:hover:shadow-xl">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-slate-50 sm:aspect-auto sm:h-64">
        {product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 sm:group-hover:scale-105"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center px-3 text-center text-xs text-slate-400 sm:text-sm">
            No image available
          </div>
        )}

        {/* Featured Badge */}
        {product.isFeatured && (
          <span className="absolute left-2 top-2 rounded-full bg-green-600 px-2 py-1 text-[9px] font-bold text-white shadow-sm sm:left-4 sm:top-4 sm:px-3 sm:text-xs">
            Featured
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          aria-label={
            wishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur-sm transition sm:right-4 sm:top-4 sm:h-10 sm:w-10 ${
            wishlisted
              ? "text-red-500"
              : "text-slate-600 hover:text-red-500"
          }`}
        >
          <Heart
            size={16}
            className={`sm:h-4.75 sm:w-4.75 ${
              wishlisted ? "fill-red-500" : ""
            }`}
          />
        </button>
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-3 sm:p-5">
        {/* Category */}
        <p className="mb-1 truncate text-[10px] font-semibold uppercase tracking-wide text-green-600 sm:text-sm sm:normal-case sm:tracking-normal">
          {product.category}
        </p>

        {/* Product Name */}
        <Link
          to={`/products/${product._id}`}
          className="line-clamp-2 min-h-10 text-sm font-bold leading-5 text-slate-900 transition hover:text-green-600 sm:min-h-0 sm:line-clamp-1 sm:text-lg sm:font-semibold"
        >
          {product.name}
        </Link>

        {/* Rating + Stock */}
        <div className="mt-2 flex min-w-0 items-center gap-1.5">
          <div className="flex shrink-0 items-center gap-1">
            <Star
              size={14}
              className="fill-yellow-400 text-yellow-400 sm:h-4 sm:w-4"
            />

            <span className="text-xs font-semibold text-slate-700 sm:text-sm">
              {product.ratings.toFixed(1)}
            </span>
          </div>

          <span className="text-[10px] text-slate-300">
            •
          </span>

          <span
            className={`truncate text-[10px] font-medium sm:text-xs ${
              isOutOfStock
                ? "text-red-500"
                : product.stock <= 5
                  ? "text-orange-500"
                  : "text-slate-500"
            }`}
          >
            {isOutOfStock
              ? "Out of stock"
              : product.stock <= 5
                ? `Only ${product.stock} left`
                : `${product.stock} in stock`}
          </span>
        </div>

        {/* Price */}
        <div className="mt-3 sm:mt-5">
          <p className="wrap-break-word text-base font-extrabold leading-tight text-slate-900 sm:text-xl">
            ₦{product.price.toLocaleString()}
          </p>

          <p className="mt-1 truncate text-[10px] text-slate-400 sm:text-xs">
            {product.brand}
          </p>
        </div>

        {/* Add To Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="mt-3 flex min-h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-green-600 px-2 py-2 text-xs font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:mt-5 sm:min-h-0 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm"
        >
          <ShoppingCart
            size={15}
            className="sm:h-4.25 sm:w-4.25"
          />

          {isOutOfStock ? "Sold Out" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;