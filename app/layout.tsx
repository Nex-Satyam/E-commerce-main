import type { Metadata } from "next";
import {
  Playfair_Display,
  Geist,
  DM_Sans,
} from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";
import ClientLayout from "@/components/ClientLayout";
import { ClientProviders } from "@/components/auth/client-providers";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const displayFont = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexGen",
  description: "A refined off-white themed fashion storefront homepage.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        geist.variable,
        displayFont.variable,
        bodyFont.variable,
        "font-sans"
      )}
    >
      <body className="antialiased bg-[#F1EFE8] text-[#2C2C2A]">
        <ClientProviders>
          <ClientLayout>{children}</ClientLayout>
        </ClientProviders>
      </body>
    </html>
  );
}