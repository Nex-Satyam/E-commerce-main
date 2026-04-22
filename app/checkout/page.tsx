import type { Metadata } from "next";

import { CheckoutPageView } from "@/components/checkout/checkout-page-view";
import { SiteFooter } from "@/components/home/site-footer";
import { SiteHeader } from "@/components/home/site-header";

export const metadata: Metadata = {
  title: "Checkout | ASR Offwhite Atelier",
  description: "Review delivery details and place your order.",
};

export default function CheckoutPage() {
  return (
    <>
      <SiteHeader />
      <CheckoutPageView />
      <SiteFooter />
    </>
  );
}