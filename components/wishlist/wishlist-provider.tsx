"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react";

import { wishlistItems } from "@/components/home/home-data";

const WISHLIST_STORAGE_KEY = "asr-wishlist-items";
const defaultWishlistSlugs = wishlistItems.map((item) => item.productSlug);
const defaultWishlistSnapshot = JSON.stringify(defaultWishlistSlugs);

const wishlistListeners = new Set<() => void>();

function parseWishlistSnapshot(snapshot: string) {
  try {
    const parsedWishlist = JSON.parse(snapshot);

    if (Array.isArray(parsedWishlist)) {
      return parsedWishlist.filter((slug): slug is string => typeof slug === "string");
    }
  } catch {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(WISHLIST_STORAGE_KEY);
    }
  }

  return defaultWishlistSlugs;
}

function getStoredWishlistSnapshot() {
  if (typeof window === "undefined") {
    return defaultWishlistSnapshot;
  }

  const storedWishlist = window.localStorage.getItem(WISHLIST_STORAGE_KEY);

  if (!storedWishlist) {
    return defaultWishlistSnapshot;
  }

  return storedWishlist;
}

function subscribeToWishlistStore(listener: () => void) {
  wishlistListeners.add(listener);

  if (typeof window !== "undefined") {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === WISHLIST_STORAGE_KEY) {
        listener();
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      wishlistListeners.delete(listener);
      window.removeEventListener("storage", handleStorage);
    };
  }

  return () => {
    wishlistListeners.delete(listener);
  };
}

function emitWishlistStoreChange() {
  wishlistListeners.forEach((listener) => listener());
}

function saveWishlistSlugs(nextWishlistSlugs: string[]) {
  window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(nextWishlistSlugs));
  emitWishlistStoreChange();
}

type WishlistContextValue = {
  wishlistSlugs: string[];
  wishlistCount: number;
  isInWishlist: (slug: string) => boolean;
  toggleWishlist: (slug: string) => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const wishlistSnapshot = useSyncExternalStore(
    subscribeToWishlistStore,
    getStoredWishlistSnapshot,
    () => defaultWishlistSnapshot,
  );
  const wishlistSlugs = useMemo(
    () => parseWishlistSnapshot(wishlistSnapshot),
    [wishlistSnapshot],
  );

  useEffect(() => {
    if (!window.localStorage.getItem(WISHLIST_STORAGE_KEY)) {
      window.localStorage.setItem(WISHLIST_STORAGE_KEY, defaultWishlistSnapshot);
    }
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlistSlugs,
        wishlistCount: wishlistSlugs.length,
        isInWishlist: (slug) => wishlistSlugs.includes(slug),
        toggleWishlist: (slug) => {
          const nextWishlistSlugs = wishlistSlugs.includes(slug)
            ? wishlistSlugs.filter((currentSlug) => currentSlug !== slug)
            : [...wishlistSlugs, slug];

          saveWishlistSlugs(nextWishlistSlugs);
        },
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