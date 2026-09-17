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

interface WishlistContextType {
  wishlistItems: Product[];
  wishlistCount: number;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext =
  createContext<
    WishlistContextType | undefined
  >(undefined);

interface WishlistProviderProps {
  children: ReactNode;
}

// ==========================================
// STORAGE
// ==========================================

const GUEST_WISHLIST_KEY =
  "sumart-wishlist-guest";

const getWishlistStorageKey = (
  userId?: string
) => {
  return userId
    ? `sumart-wishlist-${userId}`
    : GUEST_WISHLIST_KEY;
};

const getSavedWishlist = (
  storageKey: string
): Product[] => {
  try {
    const stored =
      localStorage.getItem(
        storageKey
      );

    if (!stored) {
      return [];
    }

    const parsed =
      JSON.parse(stored);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch {
    return [];
  }
};

export const WishlistProvider = ({
  children,
}: WishlistProviderProps) => {
  const { user } = useAuth();

  const userId = user?.id;

  const storageKey =
    getWishlistStorageKey(userId);

  const [
    wishlistItems,
    setWishlistItems,
  ] = useState<Product[]>(() =>
    getSavedWishlist(storageKey)
  );

  /*
   * Tracks which storage key the
   * current state was loaded from.
   *
   * This prevents Account A's wishlist
   * from accidentally being written
   * into Account B's storage during
   * an authentication change.
   */
  const loadedStorageKey =
    useRef(storageKey);

  // ==========================================
  // LOAD WISHLIST WHEN ACCOUNT CHANGES
  // ==========================================

  useEffect(() => {
    const nextWishlist =
      getSavedWishlist(storageKey);

    loadedStorageKey.current =
      storageKey;

    setWishlistItems(
      nextWishlist
    );
  }, [storageKey]);

  // ==========================================
  // SAVE CURRENT ACCOUNT'S WISHLIST
  // ==========================================

  useEffect(() => {
    if (
      loadedStorageKey.current !==
      storageKey
    ) {
      return;
    }

    localStorage.setItem(
      storageKey,
      JSON.stringify(
        wishlistItems
      )
    );
  }, [
    wishlistItems,
    storageKey,
  ]);

  // ==========================================
  // ADD TO WISHLIST
  // ==========================================

  const addToWishlist = (
    product: Product
  ) => {
    setWishlistItems(
      (current) => {
        const alreadyExists =
          current.some(
            (item) =>
              item._id ===
              product._id
          );

        if (alreadyExists) {
          return current;
        }

        return [
          product,
          ...current,
        ];
      }
    );
  };

  // ==========================================
  // REMOVE FROM WISHLIST
  // ==========================================

  const removeFromWishlist = (
    productId: string
  ) => {
    setWishlistItems(
      (current) =>
        current.filter(
          (item) =>
            item._id !==
            productId
        )
    );
  };

  // ==========================================
  // TOGGLE WISHLIST
  // ==========================================

  const toggleWishlist = (
    product: Product
  ) => {
    setWishlistItems(
      (current) => {
        const exists =
          current.some(
            (item) =>
              item._id ===
              product._id
          );

        if (exists) {
          return current.filter(
            (item) =>
              item._id !==
              product._id
          );
        }

        return [
          product,
          ...current,
        ];
      }
    );
  };

  // ==========================================
  // CHECK WISHLIST
  // ==========================================

  const isInWishlist = (
    productId: string
  ) => {
    return wishlistItems.some(
      (item) =>
        item._id === productId
    );
  };

  // ==========================================
  // CLEAR CURRENT WISHLIST
  // ==========================================

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount:
          wishlistItems.length,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context =
    useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside a WishlistProvider"
    );
  }

  return context;
};