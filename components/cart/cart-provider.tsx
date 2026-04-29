"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";

import api from "@/lib/axios";

export type CartItem = {
  productSlug: string;
  size: string;
  color: string;
  quantity: number;
};

interface CartContextType {
  cartItems: CartItem[];
  cartItemCount: number;
  refreshCart: () => Promise<void>;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productSlug: string, size: string, color: string) => void;
  clearCart: () => void;
  getCartItemCount: () => number;
}

type CartApiItem = {
  quantity?: number | null;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartItemCount, setCartItemCount] = useState(0);

  const refreshCart = useCallback(async () => {
    if (status === "loading") return;

    if (status !== "authenticated") {
      setCartItems([]);
      setCartItemCount(0);
      return;
    }

    try {
      const res = await api.get("/cart");
      const apiCartItems: CartApiItem[] = Array.isArray(res.data.cart)
        ? res.data.cart
        : [];
      const nextCount = apiCartItems.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
      );

      setCartItemCount(nextCount);
    } catch {
      setCartItemCount(0);
    }
  }, [status]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void refreshCart();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [refreshCart]);

  const addToCart = useCallback((item: CartItem) => {
    setCartItems((prev) => {
      // If same product/size/color exists, increment quantity
      const idx = prev.findIndex(
        (i) =>
          i.productSlug === item.productSlug &&
          i.size === item.size &&
          i.color === item.color
      );
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx].quantity += item.quantity;
        return updated;
      }
      return [...prev, item];
    });
    setCartItemCount((count) => count + item.quantity);
  }, []);

  const removeFromCart = useCallback(
    (productSlug: string, size: string, color: string) => {
      const removedQuantity =
        cartItems.find(
          (i) =>
            i.productSlug === productSlug && i.size === size && i.color === color
        )?.quantity || 0;

      setCartItems((prev) =>
        prev.filter(
          (i) =>
            i.productSlug !== productSlug || i.size !== size || i.color !== color
        )
      );
      setCartItemCount((count) => Math.max(0, count - removedQuantity));
    },
    [cartItems]
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
    setCartItemCount(0);
  }, []);

  const getCartItemCount = useCallback(() => cartItemCount, [cartItemCount]);

  const value = useMemo(
    () => ({
      cartItems,
      cartItemCount,
      refreshCart,
      addToCart,
      removeFromCart,
      clearCart,
      getCartItemCount,
    }),
    [
      cartItems,
      cartItemCount,
      refreshCart,
      addToCart,
      removeFromCart,
      clearCart,
      getCartItemCount,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
