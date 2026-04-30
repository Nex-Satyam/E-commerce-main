"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import api from "@/lib/axios";
import { queryKeys } from "@/lib/query-keys";

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
  const queryClient = useQueryClient();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const cartCountQuery = useQuery({
    queryKey: queryKeys.cart.count,
    queryFn: async () => {
      const res = await api.get("/cart");
      const apiCartItems: CartApiItem[] = Array.isArray(res.data.cart)
        ? res.data.cart
        : [];

      return apiCartItems.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
      );
    },
    enabled: status === "authenticated",
    placeholderData: 0,
  });

  const cartItemCount =
    status === "authenticated" ? cartCountQuery.data ?? 0 : 0;

  const refreshCart = useCallback(async () => {
    if (status !== "authenticated") {
      setCartItems([]);
      queryClient.setQueryData(queryKeys.cart.count, 0);
      return;
    }

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.count }),
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.items }),
    ]);
  }, [queryClient, status]);

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
    queryClient.setQueryData<number>(
      queryKeys.cart.count,
      (count = 0) => count + item.quantity
    );
  }, [queryClient]);

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
      queryClient.setQueryData<number>(queryKeys.cart.count, (count = 0) =>
        Math.max(0, count - removedQuantity)
      );
    },
    [cartItems, queryClient]
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
    queryClient.setQueryData(queryKeys.cart.count, 0);
  }, [queryClient]);

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
