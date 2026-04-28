import type { Metadata } from "next";

import { SiteFooter } from "@/components/home/site-footer";
import { SiteHeader } from "@/components/home/site-header";
import WishlistPageView from "@/components/wishlist/wishlist-page-view";
export const metadata: Metadata = {
  title: "Wishlist | ASR Offwhite Atelier",
  description: "Review the products you have saved to your wishlist.",
};

export default function WishlistPage() {
  return (
    <>
      <SiteHeader />
      <WishlistPageView />
      <SiteFooter />
    </>
  );
}