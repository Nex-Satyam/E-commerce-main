"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type CartItem = {
  productSlug: string;
  size: string;
  color: string;
  quantity: number;
};

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productSlug: string, size: string, color: string) => void;
  clearCart: () => void;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
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
  };

  const removeFromCart = (productSlug: string, size: string, color: string) => {
    setCartItems((prev) =>
      prev.filter(
        (i) =>
          i.productSlug !== productSlug || i.size !== size || i.color !== color
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const getCartItemCount = () => cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, getCartItemCount }}>
      {children}
    </CartContext.Provider>
  );
}
