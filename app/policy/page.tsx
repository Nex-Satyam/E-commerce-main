import type { Metadata } from "next";

import { SiteFooter } from "@/components/home/site-footer";
import { SiteHeader } from "@/components/home/site-header";
import { InformationPageView } from "@/components/site/information-page-view";

export const metadata: Metadata = {
  title: "Policy | ASR Offwhite Atelier",
  description: "Read the privacy, shipping, returns, and customer policy information for ASR Offwhite Atelier.",
};

export default function PolicyPage() {
  return (
    <>
      <SiteHeader />
      <InformationPageView
        eyebrow="Store Policy"
        title="Policy"
        description="This page explains how we handle customer information, deliveries, returns, and account support across the store."
        highlights={[
          "Privacy-first customer handling",
          "14-day return support window",
          "Delivery guidance from client care",
        ]}
        sections={[
          {
            title: "Privacy & Account Information",
            body: [
              "We only collect the details needed to support your account, fulfill orders, and provide client-care assistance. This can include your name, email address, phone number, delivery address, and order preferences.",
              "Customer details are used for order communication, support, and storefront improvements. We do not position your personal details as public information within the storefront experience.",
            ],
          },
          {
            title: "Shipping & Delivery",
            body: [
              "Orders are reviewed and prepared with care before dispatch. Delivery timelines can vary depending on location, product availability, and seasonal demand.",
              "If you need delivery clarification, address support, or appointment-based pickup guidance, client care is available through the contact details listed in the footer.",
            ],
          },
          {
            title: "Returns & Support",
            body: [
              "Eligible orders may be supported through a 14-day return window, provided items are in an appropriate condition for review. Final approval may depend on product category and wear status.",
              "We recommend contacting client care first for sizing issues, exchange guidance, or any concern before raising a return request so the fastest resolution can be offered.",
            ],
          },
        ]}
      />
      <SiteFooter />
    </>
  );
}