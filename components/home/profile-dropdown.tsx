"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  BadgeCheck,
  ChevronDown,
  CircleUserRound,
  Heart,
  LogIn,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
  Sparkles,
  UserRound,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type HeaderSessionUser = {
  name?: string | null;
  email?: string | null;
  role?: string;
};

function getInitials(name: string, email: string) {
  const source = name || email.split("@")[0] || "ASR";

  return source
    .split(/[ ._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment.charAt(0).toUpperCase())
    .join("");
}

export function ProfileDropdown() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);
  const sessionUser = session?.user as HeaderSessionUser | undefined;

  let isLoggedIn = status === "authenticated";
  let name = sessionUser?.name || "";
  let email = sessionUser?.email || "";
  let role = sessionUser?.role || "";

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
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleOpen = () => {
    clearCloseTimeout();
    setOpen(true);
  };

  const handleClose = () => {
    clearCloseTimeout();
    closeTimeoutRef.current = window.setTimeout(() => setOpen(false), 120);
  };

  const closeMenu = () => setOpen(false);
  const displayName = name || (role === "ADMIN" ? "Admin" : "Style Client");
  const initials = getInitials(displayName, email);
  const roleLabel = role === "ADMIN" ? "Admin access" : "Customer account";

  const accountLinks = [
    { href: "/profile", label: "My Profile", icon: UserRound, authOnly: true },
    { href: "/orders", label: "Orders", icon: Package },
    { href: "/wishlist", label: "Wishlist", icon: Heart },
    { href: "/cart", label: "Shopping Bag", icon: ShoppingBag },
  ];

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="profile-trigger profile-pill profile-dropdown-trigger"
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
        >
          <span className="profile-trigger-avatar">
            {isLoggedIn ? initials || "AS" : <CircleUserRound className="size-4" />}
          </span>
          <span className="profile-trigger-copy">{isLoggedIn ? "Profile" : "Login"}</span>
          <ChevronDown className="profile-trigger-chevron size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={12}
        className="profile-dropdown-content"
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
      >
        <div className="profile-menu-card">
          <div className="profile-menu-identity">
            <div className="profile-menu-avatar">
              {isLoggedIn ? initials || "AS" : <CircleUserRound className="size-6" />}
            </div>

            <div className="profile-menu-copy">
              <strong>{isLoggedIn ? displayName : "Your account"}</strong>
              <span>{isLoggedIn ? email || roleLabel : "Login to manage orders and wishlist"}</span>
            </div>
          </div>

          <div className="profile-menu-pill-row">
            <span>
              {isLoggedIn ? <BadgeCheck className="size-3" /> : <Sparkles className="size-3" />}
              {roleLabel}
            </span>
          </div>
        </div>

        <DropdownMenuSeparator className="profile-menu-separator" />

        <DropdownMenuGroup className="profile-menu-list">
          {accountLinks
            .filter((item) => !item.authOnly || isLoggedIn)
            .map((item) => {
              const Icon = item.icon;

              return (
                <DropdownMenuItem key={item.href} asChild className="profile-menu-item">
                  <Link href={item.href} onClick={closeMenu}>
                    <span className="profile-menu-item-icon">
                      <Icon className="size-4" />
                    </span>
                    <span>{item.label}</span>
                    <ChevronDown className="profile-menu-item-arrow size-4" />
                  </Link>
                </DropdownMenuItem>
              );
            })}

          <DropdownMenuItem className="profile-menu-item">
            <span className="profile-menu-item-icon">
              <Settings className="size-4" />
            </span>
            <span>Settings</span>
            <span className="profile-menu-soon">Soon</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {isLoggedIn ? (
          <DropdownMenuItem
            variant="destructive"
            className="profile-menu-item profile-menu-logout"
            onSelect={async () => {
              setOpen(false);
              await signOut({ callbackUrl: "/login" });
            }}
          >
            <span className="profile-menu-item-icon">
              <LogOut className="size-4" />
            </span>
            Logout
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild className="profile-menu-item profile-menu-login">
            <Link href="/login" onClick={closeMenu}>
              <span className="profile-menu-item-icon">
                <LogIn className="size-4" />
              </span>
              Login / Signup
              <ChevronDown className="profile-menu-item-arrow size-4" />
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
