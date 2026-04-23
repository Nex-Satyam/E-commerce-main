import { signOut } from "next-auth/react";

export async function adminLogout() {
  await signOut({ callbackUrl: "/admin/login" });
}

export function getAdminSession() {
  // TODO: replace with useSession() from next-auth/react
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem("admin_mock_session");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
