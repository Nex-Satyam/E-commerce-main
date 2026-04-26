import { signOut } from "next-auth/react";

export async function adminLogout() {
  await signOut({ callbackUrl: "/admin/login" });
}
<<<<<<< HEAD
=======

export function getAdminSession() {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem("admin_mock_session");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
>>>>>>> origin/main
