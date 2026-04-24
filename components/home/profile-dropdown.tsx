"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { CircleUserRound, Heart, LogIn, LogOut, Package, Settings, ShieldCheck, UserRound } from "lucide-react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type User = { role?: string; [key: string]: any };
type Session = { user?: User; [key: string]: any };

export function ProfileDropdown() {
  const sessionResult = useSession();
  const { data: session, status } = (sessionResult || { data: null, status: "loading" }) as { data: Session | null; status: "authenticated" | "unauthenticated" | "loading" };
  const [open, setOpen] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);

  let isLoggedIn = status === "authenticated";
  let name = session?.user?.name || "";
  let email = session?.user?.email || "";
  let role = session?.user?.role || "";

  try {
    const auth = useAuth();
    if (auth && auth.isLoggedIn) {
      isLoggedIn = true;
      name = auth.profile?.name || "";
      email = auth.profile?.email || "";
      role = (auth.role as string | undefined) || role;
    }
  } catch {}

  if (status === "loading") return null;

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current !== null) { window.clearTimeout(closeTimeoutRef.current); closeTimeoutRef.current = null; }
  };
  const handleOpen = () => { clearCloseTimeout(); setOpen(true); };
  const handleClose = () => { clearCloseTimeout(); closeTimeoutRef.current = window.setTimeout(() => setOpen(false), 120); };
  const closeMenu = () => setOpen(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="profile-trigger profile-pill rounded-full border-(--border) bg-[rgba(255,250,242,0.72)] px-4 text-(--text) shadow-none" onMouseEnter={handleOpen} onMouseLeave={handleClose}>
          <CircleUserRound className="size-4" /> Profile
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-2xl border border-(--border) bg-[rgba(255,250,242,0.98)] p-2 text-(--text) shadow-(--shadow)" onMouseEnter={handleOpen} onMouseLeave={handleClose}>
        <DropdownMenuLabel className="text-(--muted-foreground) flex flex-col">
          {isLoggedIn ? (<><span className="font-semibold">{name || (role === "ADMIN" ? "Admin" : "User")}</span>{email && <span className="text-xs opacity-80">{email}</span>}</>) : "My Account"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {isLoggedIn ? (
            <DropdownMenuItem asChild>
              <Link href="/profile" onClick={closeMenu}><UserRound className="size-4" />My Profile</Link>
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem><Package className="size-4" />Orders</DropdownMenuItem>
          <DropdownMenuItem asChild><Link href="/wishlist" onClick={closeMenu}><Heart className="size-4" />Wishlist</Link></DropdownMenuItem>
          <DropdownMenuItem><Settings className="size-4" />Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {isLoggedIn ? (
          <DropdownMenuItem variant="destructive" onSelect={async () => { setOpen(false); await signOut({ callbackUrl: "/login" }); }}>
            <LogOut className="size-4" />Logout
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <Link href="/login" onClick={closeMenu}>
              <LogIn className="size-4" />Login
              {isLoggedIn && (role === "ADMIN" ? <ShieldCheck className="ml-auto size-4" /> : <UserRound className="ml-auto size-4" />)}
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}