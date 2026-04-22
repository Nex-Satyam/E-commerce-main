import type { Metadata } from "next";

import { SignupView } from "@/components/auth/signup-view";

export const metadata: Metadata = {
  title: "Signup | ASR Offwhite Atelier",
  description: "Customer signup page for creating a user account.",
};

export default function SignupPage() {
  return <SignupView />;
}