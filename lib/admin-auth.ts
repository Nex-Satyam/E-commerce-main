import { signOut } from "next-auth/react";

export async function adminLogout() {
  await signOut({ callbackUrl: "/admin/login" });
}
