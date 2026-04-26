"use client";

import { ToastProvider } from "@/components/ui/toast-provider";
import { SessionProvider } from "next-auth/react";
import { WishlistProvider } from "@/components/wishlist/wishlist-provider";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToastProvider />
      <SessionProvider>
        <WishlistProvider>
          {children}
        </WishlistProvider>
      </SessionProvider>
    </>
  );
}
