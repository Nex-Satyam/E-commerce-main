import type { Metadata } from "next";
import { Playfair_Display, Manrope, Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import { cn } from "@/lib/utils";
import { ToastProvider } from "@/components/ui/toast-provider";

import { WishlistProvider } from "@/components/wishlist/wishlist-provider";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const displayFont = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Offwhite Atelier | Clothing Store",
  description: "A refined off-white themed fashion storefront homepage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(displayFont.variable, bodyFont.variable, "font-sans", geist.variable)}>
      <body>
        <AuthProvider>
          <WishlistProvider>
            <ToastProvider />
            {children}
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}