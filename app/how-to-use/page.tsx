import type { Metadata } from "next";

import { SiteFooter } from "@/components/home/site-footer";
import { SiteHeader } from "@/components/home/site-header";
import { InformationPageView } from "@/components/site/information-page-view";

export const metadata: Metadata = {
  title: "How To Use | ASR Offwhite Atelier",
  description: "Learn how to browse, save, order, and manage your experience on ASR Offwhite Atelier.",
};

export default function HowToUsePage() {
  return (
    <>
      <SiteHeader />
      <InformationPageView
        eyebrow="Guide"
        title="How To Use"
        description="A quick guide to browsing collections, saving wishlist items, managing your cart, and completing checkout across the storefront."
        highlights={[
          "Browse product details from the homepage",
          "Use wishlist and cart from the header",
          "Complete checkout in guided steps",
        ]}
        sections={[
          {
            title: "Browse & Discover",
            body: [
              "Start from the homepage to explore featured products, categories, and editorial highlights. Product cards open into dedicated detail pages with images, variations, descriptions, and reviews.",
              "Use the brand links, collections, and featured sections to move through the catalog and reach the styles that best fit your needs.",
            ],
          },
          {
            title: "Save, Compare & Plan",
            body: [
              "Use the heart icon on product cards to add items to your wishlist. Wishlist and cart counters in the header help you keep track of saved and selected products while browsing.",
              "Inside the cart you can update quantities, remove items, and review totals before moving toward checkout and payment.",
            ],
          },
          {
            title: "Checkout & Account",
            body: [
              "Login from the profile menu to access your account, update your saved details, and make checkout faster with profile information already filled in.",
              "Follow the checkout flow step by step, confirm your address and delivery details, then move to payment and review your confirmation after the order is placed.",
            ],
          },
        ]}
      />
      <SiteFooter />
    </>
  );
}