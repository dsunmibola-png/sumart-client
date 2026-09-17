import {
  createContext,
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
   * Prevent the save effect from
   * writing the previous user's cart
   * into the new user's storage key
   * during an account switch.
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
     * account's cart yet, do not save
     * the previous cart under the new
     * account.
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

  const addToCart = (
    product: Product
  ) => {
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
  };

  // ==========================================
  // REMOVE FROM CART
  // ==========================================

  const removeFromCart = (
    productId: string
  ) => {
    setCartItems(
      (currentItems) =>
        currentItems.filter(
          (item) =>
            item.product._id !==
            productId
        )
    );
  };

  // ==========================================
  // UPDATE QUANTITY
  // ==========================================

  const updateQuantity = (
    productId: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId);
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
  };

  // ==========================================
  // CLEAR CURRENT CART
  // ==========================================

  const clearCart = () => {
    setCartItems([]);
  };

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