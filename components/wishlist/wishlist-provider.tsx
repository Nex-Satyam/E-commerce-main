"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "@/lib/axios";

type WishlistContextValue = {
  wishlistCount: number;
  refreshWishlistCount: () => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistCount, setWishlistCount] = useState(0);

  const fetchWishlistCount = useCallback(async () => {
    try {
      const res = await api.get("/wishlist");
      setWishlistCount(Array.isArray(res.data?.wishlist) ? res.data.wishlist.length : 0);
    } catch {
      setWishlistCount(0);
    }
  }, []);

  useEffect(() => {
    fetchWishlistCount();
  }, [fetchWishlistCount]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistCount,
        refreshWishlistCount: fetchWishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }
  return context;
}