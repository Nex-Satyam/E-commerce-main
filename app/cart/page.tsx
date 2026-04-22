import type { Metadata } from "next";

import { CartPageView } from "@/components/cart/cart-page-view";
import { SiteFooter } from "@/components/home/site-footer";
import { SiteHeader } from "@/components/home/site-header";

export const metadata: Metadata = {
  title: "Cart | ASR Offwhite Atelier",
  description: "Review your selected products, quantities, and order summary.",
};

export default function CartPage() {
  return (
    <>
      <SiteHeader />
      <CartPageView />
      <SiteFooter />
    </>
  );
}