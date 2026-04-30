"use client";

import { createContext, useCallback, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { queryKeys } from "@/lib/query-keys";

type WishlistContextValue = {
  wishlistCount: number;
  refreshWishlistCount: () => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const wishlistQuery = useQuery({
    queryKey: queryKeys.wishlist,
    queryFn: async () => {
      const res = await api.get("/wishlist");
      return Array.isArray(res.data?.wishlist) ? res.data.wishlist : [];
    },
    placeholderData: [],
  });

  const refreshWishlistCount = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.wishlist });
  }, [queryClient]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistCount: wishlistQuery.data?.length ?? 0,
        refreshWishlistCount,
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
