import type { Metadata } from "next";

import { SiteFooter } from "@/components/home/site-footer";
import { SiteHeader } from "@/components/home/site-header";
import { InformationPageView } from "@/components/site/information-page-view";

export const metadata: Metadata = {
  title: "Terms & Conditions | ASR Offwhite Atelier",
  description: "Review the core terms and conditions for using the ASR Offwhite Atelier storefront.",
};

export default function TermsAndConditionsPage() {
  return (
    <>
      <SiteHeader />
      <InformationPageView
        eyebrow="Legal"
        title="Terms & Conditions"
        description="These terms describe the basic expectations for using the storefront, placing orders, and interacting with our content and services."
        highlights={[
          "Storefront content is provided for personal shopping use",
          "Order acceptance depends on review and availability",
          "Support decisions may vary by product and request type",
        ]}
        sections={[
          {
            title: "Use of the Storefront",
            body: [
              "The storefront is intended for personal browsing, shopping, and customer-support interactions. Users should provide accurate account, contact, and delivery information when placing orders or requesting assistance.",
              "Any misuse of the storefront experience, including disruption of site behavior or false order activity, may lead to restricted access or order cancellation.",
            ],
          },
          {
            title: "Orders & Availability",
            body: [
              "Submitting an order request does not automatically guarantee final acceptance. Orders may still depend on product availability, payment confirmation, delivery review, and internal verification.",
              "Product imagery, editorial copy, and pricing are presented to support shopping decisions, but availability and support outcomes can change over time.",
            ],
          },
          {
            title: "Support, Updates & Changes",
            body: [
              "Policies, support flows, pricing details, and storefront experiences may evolve as the brand and service offering change. We may update site content and support guidance without prior notice.",
              "For any issue involving an order, account, or delivery concern, the recommended path is to contact client care directly so the request can be reviewed properly.",
            ],
          },
        ]}
      />
      <SiteFooter />
    </>
  );
}