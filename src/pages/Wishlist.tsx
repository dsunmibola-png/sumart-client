import {
  ArrowRight,
  Heart,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const Wishlist = () => {
  const {
    wishlistItems,
    wishlistCount,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist();

  const { addToCart } = useCart();

  // ==========================================
  // EMPTY WISHLIST
  // ==========================================

  if (wishlistItems.length === 0) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-[#f7f9f8] px-4 py-10 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white px-5 py-12 text-center shadow-sm sm:rounded-4xl sm:px-6 sm:py-16">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500 sm:h-20 sm:w-20">
            <Heart
              size={28}
              className="sm:hidden"
            />

            <Heart
              size={34}
              className="hidden sm:block"
            />
          </div>

          <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-950 sm:mt-6 sm:text-3xl">
            Your wishlist is empty
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base sm:leading-7">
            Save products you love and come
            back to them whenever you're ready
            to shop.
          </p>

          <Link
            to="/shop"
            className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-700 sm:mt-8 sm:w-auto"
          >
            Explore Products
            <ArrowRight size={17} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9f8] px-4 py-7 sm:px-6 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-7xl">
        {/* ======================================
            HEADER
        ======================================= */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-600 sm:text-sm sm:tracking-[0.18em]">
              Saved Products
            </p>

            <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight text-slate-950 sm:mt-2 sm:text-4xl">
              My Wishlist
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:mt-3 sm:text-base">
              You have{" "}
              <span className="font-bold text-slate-900">
                {wishlistCount}
              </span>{" "}
              {wishlistCount === 1
                ? "product"
                : "products"}{" "}
              saved.
            </p>
          </div>

          <button
            type="button"
            onClick={clearWishlist}
            className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 sm:min-h-12 sm:py-3"
          >
            <Trash2 size={16} />
            Clear Wishlist
          </button>
        </div>

        {/* ======================================
            PRODUCTS
        ======================================= */}

        <div className="mt-7 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
          {wishlistItems.map((product) => {
            const outOfStock =
              product.stock === 0;

            return (
              <article
                key={product._id}
                className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-[26px]"
              >
                {/* PRODUCT IMAGE */}

                <Link
                  to={`/products/${product._id}`}
                  className="relative block aspect-square overflow-hidden bg-slate-100"
                >
                  {product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-3 text-center text-xs text-slate-400 sm:text-sm">
                      No image
                    </div>
                  )}

                  {product.isFeatured && (
                    <span className="absolute left-2 top-2 rounded-full bg-green-600 px-2 py-1 text-[10px] font-bold text-white sm:left-4 sm:top-4 sm:px-3 sm:text-xs">
                      Featured
                    </span>
                  )}

                  {/* Mobile remove button */}

                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();

                      removeFromWishlist(
                        product._id,
                      );
                    }}
                    aria-label={`Remove ${product.name} from wishlist`}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-red-500 shadow-sm transition hover:bg-red-50 sm:hidden"
                  >
                    <Trash2 size={14} />
                  </button>
                </Link>

                {/* PRODUCT INFORMATION */}

                <div className="flex flex-1 flex-col p-3 sm:p-5">
                  <p className="truncate text-[10px] font-bold uppercase tracking-wide text-green-600 sm:text-xs">
                    {product.category}
                  </p>

                  <Link
                    to={`/products/${product._id}`}
                    className="mt-1.5 line-clamp-2 min-h-10 text-sm font-bold leading-5 text-slate-900 transition hover:text-green-600 sm:mt-2 sm:min-h-0 sm:text-lg sm:leading-normal"
                  >
                    {product.name}
                  </Link>

                  <p className="mt-1 truncate text-xs text-slate-500 sm:text-sm">
                    {product.brand}
                  </p>

                  {/* PRICE */}

                  <div className="mt-3 sm:mt-5">
                    <p className="truncate text-base font-extrabold text-slate-950 sm:text-xl">
                      ₦
                      {product.price.toLocaleString()}
                    </p>

                    <p
                      className={`mt-1 text-[10px] font-bold sm:text-xs ${
                        outOfStock
                          ? "text-red-500"
                          : product.stock <= 5
                            ? "text-amber-500"
                            : "text-green-600"
                      }`}
                    >
                      {outOfStock
                        ? "Out of stock"
                        : product.stock <= 5
                          ? `${product.stock} left`
                          : "In stock"}
                    </p>
                  </div>

                  {/* ACTIONS */}

                  <div className="mt-auto pt-4 sm:pt-6">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          addToCart(product)
                        }
                        disabled={outOfStock}
                        className="flex min-h-10 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg bg-green-600 px-2 py-2 text-xs font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:min-h-11 sm:gap-2 sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm"
                      >
                        <ShoppingCart
                          size={15}
                          className="shrink-0 sm:hidden"
                        />

                        <ShoppingCart
                          size={17}
                          className="hidden shrink-0 sm:block"
                        />

                        <span className="truncate">
                          {outOfStock
                            ? "Sold Out"
                            : "Add to Cart"}
                        </span>
                      </button>

                      {/* Desktop/tablet remove button */}

                      <button
                        type="button"
                        onClick={() =>
                          removeFromWishlist(
                            product._id,
                          )
                        }
                        aria-label={`Remove ${product.name} from wishlist`}
                        className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-red-500 transition hover:border-red-200 hover:bg-red-50 sm:flex"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* ======================================
            BOTTOM SHOP CTA
        ======================================= */}

        <div className="mt-8 flex justify-center sm:mt-12">
          <Link
            to="/shop"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-green-200 hover:text-green-600 sm:w-auto"
          >
            Continue Shopping
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Wishlist;