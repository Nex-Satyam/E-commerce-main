
"use client";
// Notification modal/context removed for clean slate.
import ClientProviders from "@/components/auth/client-providers";
import { ToastProvider } from "@/components/ui/toast-context";
// import { useEffect } from "react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ClientProviders>
        {children}
      </ClientProviders>
    </ToastProvider>
  );
}
