import type { Metadata } from "next";
import { Playfair_Display, Manrope, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import ClientLayout from "@/components/ClientLayout";
import ClientProviders from "@/components/auth/client-providers";
import Script from "next/script";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={cn(displayFont.variable, bodyFont.variable, "font-sans", geist.variable)}
    >
      <body className="antialiased">
        <ClientProviders>
          <ClientLayout>{children}</ClientLayout>
          <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        </ClientProviders>
      </body>
    </html>
  );
}
