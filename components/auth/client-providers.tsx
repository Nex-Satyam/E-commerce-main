"use client";

<<<<<<< HEAD
=======
import { AuthProvider } from "@/components/auth/auth-provider";
>>>>>>> origin/main
import { ToastProvider } from "@/components/ui/toast-provider";
import { SessionProvider } from "next-auth/react";
import { WishlistProvider } from "@/components/wishlist/wishlist-provider";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToastProvider />
      <SessionProvider>
<<<<<<< HEAD
        <WishlistProvider>
          {children}
        </WishlistProvider>
=======
        <AuthProvider>
          <WishlistProvider>
            {children}
          </WishlistProvider>
        </AuthProvider>
>>>>>>> origin/main
      </SessionProvider>
    </>
  );
}
