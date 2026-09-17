import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Star,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { getProductById } from "../services/productService";

import type { Product } from "../types/product";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist();

  const [product, setProduct] =
    useState<Product | null>(null);

  const [quantity, setQuantity] =
    useState(1);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Product not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data =
          await getProductById(id);

        setProduct(data);
        setQuantity(1);
      } catch (err) {
        console.error(err);

        setError(
          "Unable to load this product.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    for (
      let i = 0;
      i < quantity;
      i++
    ) {
      addToCart(product);
    }
  };

  /* ---------------- Loading ---------------- */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 h-5 w-20 animate-pulse rounded bg-slate-200" />

          <div className="grid gap-6 overflow-hidden rounded-2xl bg-white p-4 shadow-sm sm:p-6 md:grid-cols-2 md:gap-10 md:rounded-3xl md:p-10">
            <div className="aspect-square animate-pulse rounded-2xl bg-slate-200" />

            <div className="flex flex-col justify-center">
              <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />

              <div className="mt-4 h-8 w-4/5 animate-pulse rounded bg-slate-200" />

              <div className="mt-3 h-8 w-2/3 animate-pulse rounded bg-slate-200" />

              <div className="mt-5 h-5 w-32 animate-pulse rounded bg-slate-200" />

              <div className="mt-6 h-8 w-28 animate-pulse rounded bg-slate-200" />

              <div className="mt-6 space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ---------------- Error ---------------- */

  if (error || !product) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-10 sm:px-6">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-sm">
          <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
            Product not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error ||
              "This product doesn't exist."}
          </p>

          <Link
            to="/shop"
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 text-sm font-bold text-white transition hover:bg-green-700 sm:w-auto"
          >
            <ArrowLeft size={17} />
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  const isOutOfStock =
    product.stock === 0;

  const wishlisted =
    isInWishlist(product._id);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-7xl">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-5 flex min-h-10 items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-green-600 sm:mb-8"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        {/* Product */}
        <div className="grid gap-6 overflow-hidden rounded-2xl bg-white p-4 shadow-sm sm:p-6 md:grid-cols-2 md:gap-10 md:rounded-3xl md:p-10">
          {/* Product Image */}
          <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-slate-50 md:aspect-auto md:min-h-105">
            {product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-contain p-3 sm:p-5 md:max-h-125"
              />
            ) : (
              <div className="flex flex-col items-center justify-center px-4 text-center">
                <ShoppingCart
                  size={30}
                  className="text-slate-300"
                />

                <p className="mt-2 text-sm text-slate-400">
                  No image available
                </p>
              </div>
            )}

            {/* Featured */}
            {product.isFeatured && (
              <span className="absolute left-3 top-3 rounded-full bg-green-600 px-3 py-1.5 text-[10px] font-bold text-white shadow-sm sm:left-5 sm:top-5 sm:px-4 sm:py-2 sm:text-sm">
                Featured
              </span>
            )}

            {/* Wishlist */}
            <button
              type="button"
              onClick={() =>
                toggleWishlist(product)
              }
              aria-label={
                wishlisted
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
              className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition sm:right-5 sm:top-5 sm:h-11 sm:w-11 ${
                wishlisted
                  ? "text-red-500"
                  : "text-slate-600 hover:text-red-500"
              }`}
            >
              <Heart
                size={19}
                className={
                  wishlisted
                    ? "fill-red-500"
                    : ""
                }
              />
            </button>
          </div>

          {/* Product Information */}
          <div className="flex min-w-0 flex-col justify-center pb-1 sm:pb-0">
            {/* Category */}
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-green-600 sm:text-sm sm:tracking-wide">
              {product.category}
            </p>

            {/* Name */}
            <h1 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:mt-3 sm:text-4xl">
              {product.name}
            </h1>

            {/* Rating / Brand */}
            <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-4">
              <div className="flex items-center gap-1.5">
                <Star
                  size={16}
                  className="fill-amber-400 text-amber-400 sm:h-4.5 sm:w-4.5"
                />

                <span className="text-sm font-bold text-slate-700">
                  {product.ratings.toFixed(
                    1,
                  )}
                </span>
              </div>

              <span className="text-slate-300">
                •
              </span>

              <span className="text-xs font-medium text-slate-500 sm:text-sm">
                {product.brand}
              </span>
            </div>

            {/* Price */}
            <p className="mt-5 text-2xl font-extrabold text-green-600 sm:mt-6 sm:text-3xl">
              ₦
              {product.price.toLocaleString()}
            </p>

            {/* Description */}
            <p className="mt-4 text-sm leading-6 text-slate-600 sm:mt-6 sm:text-base sm:leading-7">
              {product.description}
            </p>

            {/* Stock */}
            <div className="mt-5 sm:mt-6">
              <span
                className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${
                  isOutOfStock
                    ? "bg-red-50 text-red-600"
                    : product.stock <= 5
                      ? "bg-orange-50 text-orange-600"
                      : "bg-green-50 text-green-700"
                }`}
              >
                {isOutOfStock
                  ? "Out of stock"
                  : product.stock <= 5
                    ? `Only ${product.stock} left in stock`
                    : `${product.stock} items available`}
              </span>
            </div>

            {/* Quantity + Add */}
            {!isOutOfStock && (
              <div className="mt-6 border-t border-slate-100 pt-6 sm:mt-8 sm:flex sm:items-stretch sm:gap-3 sm:pt-8">
                {/* Quantity */}
                <div className="flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-white sm:w-36">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(
                        (current) =>
                          Math.max(
                            1,
                            current - 1,
                          ),
                      )
                    }
                    disabled={
                      quantity <= 1
                    }
                    aria-label="Decrease quantity"
                    className="flex h-full w-12 items-center justify-center text-slate-600 transition hover:text-green-600 disabled:cursor-not-allowed disabled:text-slate-300"
                  >
                    <Minus size={17} />
                  </button>

                  <span className="min-w-10 text-center text-sm font-bold text-slate-900">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(
                        (current) =>
                          Math.min(
                            product.stock,
                            current + 1,
                          ),
                      )
                    }
                    disabled={
                      quantity >=
                      product.stock
                    }
                    aria-label="Increase quantity"
                    className="flex h-full w-12 items-center justify-center text-slate-600 transition hover:text-green-600 disabled:cursor-not-allowed disabled:text-slate-300"
                  >
                    <Plus size={17} />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  type="button"
                  onClick={
                    handleAddToCart
                  }
                  className="mt-3 flex min-h-12 w-full flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 text-sm font-bold text-white transition hover:bg-green-700 hover:shadow-md sm:mt-0"
                >
                  <ShoppingCart
                    size={18}
                  />

                  Add {quantity > 1
                    ? `${quantity} to Cart`
                    : "to Cart"}
                </button>
              </div>
            )}

            {/* Sold Out */}
            {isOutOfStock && (
              <button
                type="button"
                disabled
                className="mt-6 min-h-12 w-full cursor-not-allowed rounded-xl bg-slate-200 px-6 text-sm font-bold text-slate-500 sm:mt-8"
              >
                Sold Out
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;