"use client";
import { AuthProvider } from "@/components/auth/auth-provider";
import { ToastProvider } from "@/components/ui/toast-provider";
import { SessionProvider } from "next-auth/react";
import { WishlistProvider } from "@/components/wishlist/wishlist-provider";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToastProvider />
      <SessionProvider>
        <AuthProvider>
          <WishlistProvider>
            {children}
          </WishlistProvider>
        </AuthProvider>
      </SessionProvider>
    </>
  );
}
