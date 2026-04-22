"use client";

import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";

import { getCartItemCount } from "@/components/home/home-data";
import { ProfileDropdown } from "@/components/home/profile-dropdown";
import { useWishlist } from "@/components/wishlist/wishlist-provider";
import { Button } from "@/components/ui/button";

export function HeaderActions() {
  const cartItemCount = getCartItemCount();
  const { wishlistCount } = useWishlist();

  return (
    <div className="header-tools">
      <Button
        asChild
        variant="outline"
        size="icon"
        className="header-icon-button header-icon-badge-wrap rounded-full border-[color:var(--border)] bg-[rgba(255,250,242,0.72)] text-[var(--text)] shadow-none"
        aria-label="Wishlist"
      >
        <Link href="/wishlist">
          <Heart className="size-4" />
          <span className="header-badge-count">{wishlistCount}</span>
        </Link>
      </Button>
      <Button
        asChild
        variant="outline"
        size="icon"
        className="header-icon-button header-icon-badge-wrap rounded-full border-[color:var(--border)] bg-[rgba(255,250,242,0.72)] text-[var(--text)] shadow-none"
        aria-label="Shopping bag"
      >
        <Link href="/cart">
          <ShoppingBag className="size-4" />
          <span className="header-badge-count">{cartItemCount}</span>
        </Link>
      </Button>
      <ProfileDropdown />
    </div>
  );
}