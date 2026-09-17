import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";

import type { Product } from "../types/product";
import { useAuth } from "./AuthContext";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext =
  createContext<
    CartContextType | undefined
  >(undefined);

interface CartProviderProps {
  children: ReactNode;
}

const GUEST_CART_KEY =
  "sumart-cart-guest";

const getCartStorageKey = (
  userId?: string
) => {
  return userId
    ? `sumart-cart-${userId}`
    : GUEST_CART_KEY;
};

const getSavedCart = (
  storageKey: string
): CartItem[] => {
  try {
    const savedCart =
      localStorage.getItem(
        storageKey
      );

    if (!savedCart) {
      return [];
    }

    const parsedCart =
      JSON.parse(savedCart);

    return Array.isArray(
      parsedCart
    )
      ? parsedCart
      : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({
  children,
}: CartProviderProps) => {
  const { user } = useAuth();

  const userId = user?.id;

  const storageKey =
    getCartStorageKey(userId);

  const [cartItems, setCartItems] =
    useState<CartItem[]>(() =>
      getSavedCart(storageKey)
    );

  /*
   * Track which account/storage key
   * the currently loaded cart belongs to.
   */
  const loadedStorageKey =
    useRef(storageKey);

  // ==========================================
  // LOAD CART WHEN ACCOUNT CHANGES
  // ==========================================

  useEffect(() => {
    const nextCart =
      getSavedCart(storageKey);

    loadedStorageKey.current =
      storageKey;

    setCartItems(nextCart);
  }, [storageKey]);

  // ==========================================
  // SAVE CURRENT ACCOUNT'S CART
  // ==========================================

  useEffect(() => {
    /*
     * If authentication changed but
     * React has not loaded the new
     * account's cart yet, don't save
     * the previous account's cart
     * under the new storage key.
     */
    if (
      loadedStorageKey.current !==
      storageKey
    ) {
      return;
    }

    localStorage.setItem(
      storageKey,
      JSON.stringify(cartItems)
    );
  }, [cartItems, storageKey]);

  // ==========================================
  // ADD TO CART
  // ==========================================

  const addToCart = useCallback(
    (product: Product) => {
      setCartItems(
        (currentItems) => {
          const existingItem =
            currentItems.find(
              (item) =>
                item.product._id ===
                product._id
            );

          if (existingItem) {
            return currentItems.map(
              (item) =>
                item.product._id ===
                product._id
                  ? {
                      ...item,
                      quantity:
                        item.quantity +
                        1,
                    }
                  : item
            );
          }

          return [
            ...currentItems,
            {
              product,
              quantity: 1,
            },
          ];
        }
      );
    },
    []
  );

  // ==========================================
  // REMOVE FROM CART
  // ==========================================

  const removeFromCart =
    useCallback(
      (productId: string) => {
        setCartItems(
          (currentItems) =>
            currentItems.filter(
              (item) =>
                item.product._id !==
                productId
            )
        );
      },
      []
    );

  // ==========================================
  // UPDATE QUANTITY
  // ==========================================

  const updateQuantity =
    useCallback(
      (
        productId: string,
        quantity: number
      ) => {
        if (quantity <= 0) {
          setCartItems(
            (currentItems) =>
              currentItems.filter(
                (item) =>
                  item.product._id !==
                  productId
              )
          );

          return;
        }

        setCartItems(
          (currentItems) =>
            currentItems.map(
              (item) =>
                item.product._id ===
                productId
                  ? {
                      ...item,
                      quantity,
                    }
                  : item
            )
        );
      },
      []
    );

  // ==========================================
  // CLEAR CURRENT CART
  // ==========================================

  /*
   * useCallback keeps clearCart's
   * function identity stable.
   *
   * This is important for pages such
   * as PaymentCallback that use
   * clearCart inside a useEffect.
   */
  const clearCart =
    useCallback(() => {
      setCartItems([]);
    }, []);

  // ==========================================
  // TOTALS
  // ==========================================

  const cartCount =
    cartItems.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  const cartTotal =
    cartItems.reduce(
      (total, item) =>
        total +
        item.product.price *
          item.quantity,
      0
    );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside a CartProvider"
    );
  }

  return context;
};