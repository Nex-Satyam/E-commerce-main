import type { Metadata } from "next";

import { SiteFooter } from "@/components/home/site-footer";
import { SiteHeader } from "@/components/home/site-header";

import { ProfilePageView } from "@/components/profile/profile-page-view";

export const metadata: Metadata = {
  title: "My Profile | ASR Offwhite Atelier",
  description: "Review and edit your saved account details from a dedicated profile page.",
};

export default function ProfilePage() {
  return (
    <>
      <SiteHeader />
      <ProfilePageView />
      <SiteFooter />
    </>
  );
}