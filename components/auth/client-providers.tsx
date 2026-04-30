"use client";
import { AuthProvider } from "@/components/auth/auth-provider";
import { ToastProvider } from "@/components/ui/toast-provider";
import { SessionProvider } from "next-auth/react";
import { WishlistProvider } from "@/components/wishlist/wishlist-provider";
import { CartProvider } from "@/components/cart/cart-provider";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";

function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToastProvider />
      <SessionProvider>
        <ReactQueryProvider>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </SessionProvider>
    </>
  );
}

export default ClientProviders;
