import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
  } = useCart();

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  if (cartItems.length === 0) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-8 sm:px-6 sm:py-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white px-5 py-14 text-center shadow-sm sm:rounded-3xl sm:px-6 sm:py-20">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 sm:mb-6 sm:h-20 sm:w-20">
            <ShoppingBag
              size={30}
              className="text-green-600 sm:h-9 sm:w-9"
            />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Your cart is empty
          </h1>

          <p className="mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
            Looks like you haven't added anything
            to your cart yet. Start shopping and
            find something you love.
          </p>

          <Link
            to="/shop"
            className="mt-7 w-full max-w-xs rounded-xl bg-green-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-green-700 sm:mt-8 sm:w-auto sm:text-base"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-7 sm:px-6 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-600 sm:text-sm">
                SUMART Cart
              </p>

              <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:mt-2 sm:text-3xl lg:text-4xl">
                Your Shopping Cart
              </h1>
            </div>

            {/* Mobile Item Count */}
            <span className="shrink-0 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700 sm:hidden">
              {totalItems}{" "}
              {totalItems === 1 ? "item" : "items"}
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Review your items before checkout.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
          {/* Cart Items */}
          <section className="min-w-0 space-y-3 sm:space-y-4">
            {cartItems.map((item) => {
              const { product, quantity } = item;

              const itemTotal =
                product.price * quantity;

              const canDecrease = quantity > 1;
              const canIncrease =
                quantity < product.stock;

              return (
                <article
                  key={product._id}
                  className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm sm:p-5"
                >
                  {/* Mobile Layout */}
                  <div className="flex gap-3 sm:hidden">
                    {/* Product Image */}
                    <Link
                      to={`/products/${product._id}`}
                      className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-50"
                    >
                      {product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-2 text-center text-[10px] text-slate-400">
                          No image
                        </div>
                      )}
                    </Link>

                    {/* Product Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-green-600">
                            {product.category}
                          </p>

                          <Link
                            to={`/products/${product._id}`}
                            className="mt-1 block"
                          >
                            <h2 className="line-clamp-2 text-sm font-bold leading-5 text-slate-900">
                              {product.name}
                            </h2>
                          </Link>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(product._id)
                          }
                          aria-label={`Remove ${product.name} from cart`}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500 transition active:bg-red-100"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <p className="mt-1.5 text-xs text-slate-500">
                        ₦
                        {product.price.toLocaleString()}{" "}
                        each
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-900">
                        ₦{itemTotal.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Controls */}
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 sm:hidden">
                    <span className="text-xs font-medium text-slate-500">
                      Quantity
                    </span>

                    <div className="flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            product._id,
                            quantity - 1,
                          )
                        }
                        disabled={!canDecrease}
                        aria-label="Decrease quantity"
                        className="flex h-9 w-9 items-center justify-center text-slate-600 transition active:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
                      >
                        <Minus size={15} />
                      </button>

                      <span className="min-w-9 text-center text-sm font-bold text-slate-900">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            product._id,
                            quantity + 1,
                          )
                        }
                        disabled={!canIncrease}
                        aria-label="Increase quantity"
                        className="flex h-9 w-9 items-center justify-center text-slate-600 transition active:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Desktop / Tablet Layout */}
                  <div className="hidden items-center gap-5 sm:flex">
                    {/* Image */}
                    <Link
                      to={`/products/${product._id}`}
                      className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-50"
                    >
                      {product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-slate-400">
                          No image
                        </div>
                      )}
                    </Link>

                    {/* Product Info */}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-green-600">
                        {product.category}
                      </p>

                      <Link
                        to={`/products/${product._id}`}
                      >
                        <h2 className="mt-1 truncate text-lg font-semibold text-slate-900 transition hover:text-green-600">
                          {product.name}
                        </h2>
                      </Link>

                      <p className="mt-1 text-sm text-slate-500">
                        ₦
                        {product.price.toLocaleString()}{" "}
                        each
                      </p>
                    </div>

                    {/* Quantity */}
                    <div className="flex shrink-0 items-center overflow-hidden rounded-xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            product._id,
                            quantity - 1,
                          )
                        }
                        disabled={!canDecrease}
                        aria-label="Decrease quantity"
                        className="p-2.5 text-slate-600 transition hover:bg-slate-50 hover:text-green-600 disabled:cursor-not-allowed disabled:text-slate-300"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="min-w-10 text-center text-sm font-semibold text-slate-900">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            product._id,
                            quantity + 1,
                          )
                        }
                        disabled={!canIncrease}
                        aria-label="Increase quantity"
                        className="p-2.5 text-slate-600 transition hover:bg-slate-50 hover:text-green-600 disabled:cursor-not-allowed disabled:text-slate-300"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="w-32 shrink-0 text-right">
                      <p className="font-bold text-slate-900">
                        ₦{itemTotal.toLocaleString()}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(product._id)
                        }
                        className="mt-2 inline-flex items-center gap-1 text-sm text-red-500 transition hover:text-red-600"
                      >
                        <Trash2 size={15} />
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          {/* Order Summary */}
          <aside className="h-fit rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-28">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                Order Summary
              </h2>

              <span className="text-xs font-medium text-slate-500">
                {totalItems}{" "}
                {totalItems === 1 ? "item" : "items"}
              </span>
            </div>

            <div className="my-5 border-t border-slate-100 sm:my-6" />

            <div className="flex items-center justify-between gap-4 text-sm text-slate-600 sm:text-base">
              <span>Subtotal</span>

              <span className="font-semibold text-slate-900">
                ₦{cartTotal.toLocaleString()}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4 text-sm text-slate-600 sm:text-base">
              <span>Delivery</span>

              <span className="font-semibold text-green-600">
                Free
              </span>
            </div>

            <div className="my-5 border-t border-slate-100 sm:my-6" />

            <div className="flex items-end justify-between gap-4">
              <span className="font-bold text-slate-900 sm:text-lg">
                Total
              </span>

              <span className="text-xl font-extrabold text-green-600 sm:text-2xl">
                ₦{cartTotal.toLocaleString()}
              </span>
            </div>

            <Link
              to="/checkout"
              className="mt-5 flex min-h-12 w-full items-center justify-center rounded-xl bg-green-600 px-5 py-3.5 text-center text-sm font-bold text-white transition hover:bg-green-700 hover:shadow-md sm:mt-6 sm:text-base"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/shop"
              className="mt-3 flex min-h-10 items-center justify-center text-center text-sm font-medium text-slate-500 transition hover:text-green-600"
            >
              Continue Shopping
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Cart;