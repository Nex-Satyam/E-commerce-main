import type { Metadata } from "next";

import { LoginView } from "@/components/auth/login-view";

export const metadata: Metadata = {
  title: "Login | ASR Offwhite Atelier",
  description: "Login page for both user and admin access with automatic role detection.",
};

export default function LoginPage() {
  return <LoginView />;
}