"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  Heart,
  Loader2,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { CtaButton } from "@/components/home/cta-button";
import { useWishlist } from "@/components/wishlist/wishlist-provider";
import api from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type WishlistProduct = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  category?: { name?: string | null } | null;
  images?: { url?: string | null }[];
  variants?: {
    id?: string;
    name?: string;
    price?: number;
    stock?: number;
  }[];
  reviews?: unknown[];
};

type WishlistItem = {
  id?: string;
  productId: string;
  product: WishlistProduct;
};

function formatCurrency(value?: number) {
  if (!value) return "Price unavailable";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value / 100);
}

function WishlistLoadingSkeleton() {
  return (
    <>
      <div className="wishlist-stat-grid" aria-hidden="true">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="wishlist-stat-card">
            <Skeleton className="h-9 w-14 bg-neutral-200" />
            <Skeleton className="h-4 w-24 bg-neutral-200" />
          </div>
        ))}
      </div>

      <div className="wishlist-grid" aria-busy="true" aria-label="Loading wishlist">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="wishlist-card py-0 shadow-none">
            <div className="wishlist-card-shell">
              <Skeleton className="min-h-[260px] w-full bg-neutral-200" />
              <CardContent className="wishlist-card-content">
                <div className="wishlist-status-row">
                  <div className="wishlist-meta-stack">
                    <Skeleton className="h-8 w-32 rounded-full bg-neutral-200" />
                    <Skeleton className="h-7 w-48 bg-neutral-200" />
                  </div>
                  <Skeleton className="size-9 rounded-full bg-neutral-200" />
                </div>
                <Skeleton className="h-4 w-full bg-neutral-200" />
                <Skeleton className="h-4 w-4/5 bg-neutral-200" />
                <div className="wishlist-meta-row">
                  <Skeleton className="h-6 w-24 bg-neutral-200" />
                  <Skeleton className="h-6 w-28 bg-neutral-200" />
                </div>
                <div className="wishlist-card-footer">
                  <Skeleton className="h-9 w-32 rounded-full bg-neutral-200" />
                  <Skeleton className="h-11 w-36 rounded-full bg-neutral-800" />
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

export default function WishlistPageView() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);
  const { refreshWishlistCount } = useWishlist();

  useEffect(() => {
    async function fetchWishlist() {
      setLoading(true);
      try {
        const res = await api.get("/wishlist");
        setWishlist(res.data?.wishlist || []);
      } catch {
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    }

    void fetchWishlist();
  }, []);

  const handleRemove = async (productId: string) => {
    setRemoving(productId);
    try {
      await api.delete(`/wishlist?productId=${productId}`);
      setWishlist((prev) => prev.filter((item) => item.productId !== productId));
      refreshWishlistCount();
    } catch {
      // Keep the item visible if the request fails.
    } finally {
      setRemoving(null);
    }
  };

  const wishlistStats = useMemo(() => {
    const inStock = wishlist.filter(
      (item) => (item.product.variants?.[0]?.stock || 0) > 0
    ).length;

    return [
      { label: "Saved items", value: wishlist.length },
      { label: "Ready to ship", value: inStock },
      { label: "Need review", value: Math.max(wishlist.length - inStock, 0) },
    ];
  }, [wishlist]);

  return (
    <main className="wishlist-page">
      <div className="wishlist-breadcrumb">
        <Link href="/" className="wishlist-back-link">
          <ArrowLeft className="size-4" /> Continue Shopping
        </Link>
        <span>/</span>
        <strong>Wishlist</strong>
      </div>

      <section className="wishlist-hero">
        <div>
          <p className="eyebrow">Wishlist</p>
          <h1>Saved pieces, ready when you are.</h1>
          <p>
            Review favourites, compare availability, and jump back into product
            details with a cleaner shopping flow.
          </p>
        </div>

        <div className="wishlist-hero-panel">
          <span>
            <Heart className="size-4 fill-current" />
            Curated by you
          </span>
          <span>
            <ShieldCheck className="size-4" />
            Secure checkout ready
          </span>
        </div>
      </section>

      <section className="wishlist-shell">
        {loading ? (
          <WishlistLoadingSkeleton />
        ) : (
          <>
            <div className="wishlist-stat-grid">
              {wishlistStats.map((stat) => (
                <div key={stat.label} className="wishlist-stat-card">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>

            {wishlist.length > 0 ? (
              <div className="wishlist-grid">
                {wishlist.map((item) => {
              const product = item.product;
              const image = product.images?.[0]?.url || "/placeholder.png";
              const firstVariant = product.variants?.[0];
              const isAvailable = (firstVariant?.stock || 0) > 0;

              return (
                <Card
                  key={product.id}
                  className="wishlist-card py-0 shadow-none"
                >
                  <div className="wishlist-card-shell">
                    <Link
                      href={`/products/${product.slug}`}
                      className="wishlist-image-link"
                    >
                      <div className="wishlist-image-wrap">
                        <Image
                          src={image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 28vw"
                          className="wishlist-image"
                        />
                        <div className="wishlist-image-overlay">
                          <span>Open details</span>
                          <ArrowUpRight className="size-4" />
                        </div>
                      </div>
                    </Link>

                    <CardContent className="wishlist-card-content">
                      <div className="wishlist-status-row">
                        <div className="wishlist-meta-stack">
                          <span className="wishlist-chip is-light">
                            <Sparkles className="size-3.5" />
                            {product.category?.name || "Collection"}
                          </span>
                          <h2>{product.name}</h2>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          className="wishlist-toggle-button is-active"
                          aria-label={`Remove ${product.name} from wishlist`}
                          aria-pressed="true"
                          onClick={() => handleRemove(product.id)}
                          disabled={removing === product.id}
                        >
                          {removing === product.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <X className="size-4" />
                          )}
                        </Button>
                      </div>

                      <p className="line-clamp-2">{product.description}</p>

                      <div className="wishlist-meta-row">
                        <strong>{formatCurrency(firstVariant?.price)}</strong>
                        <span>
                          <Star className="size-4 fill-current" />
                          {product.reviews?.length || 0} reviews
                        </span>
                      </div>

                      <div className="wishlist-card-footer">
                        <span
                          className={
                            isAvailable
                              ? "wishlist-availability"
                              : "wishlist-availability is-muted"
                          }
                        >
                          <BadgeCheck className="size-4" />
                          {isAvailable
                            ? `${firstVariant?.stock} in stock`
                            : "Currently unavailable"}
                        </span>

                        <CtaButton asChild className="wishlist-action-button">
                          <Link href={`/products/${product.slug}`}>
                            View Product
                          </Link>
                        </CtaButton>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              );
                })}
              </div>
            ) : (
              <Card className="wishlist-empty-card py-0 shadow-none">
                <CardContent className="wishlist-empty-content">
                  <div className="wishlist-empty-icon">
                    <ShoppingBag className="size-7" />
                  </div>
                  <p className="eyebrow">Wishlist Empty</p>
                  <h2>No saved pieces right now.</h2>
                  <p>Tap the heart on any product card to save it here for later.</p>
                  <CtaButton asChild className="wishlist-action-button">
                    <Link href="/#products">Browse Products</Link>
                  </CtaButton>
                </CardContent>
              </Card>
            )}
          </>
        )}

        <div className="wishlist-feature-grid">
          <div>
            <Truck className="size-5" />
            <strong>Fast dispatch</strong>
            <span>Saved products show live stock before checkout.</span>
          </div>
          <div>
            <PackageCheck className="size-5" />
            <strong>Quality checked</strong>
            <span>Every order is inspected before shipping.</span>
          </div>
          <div>
            <ShieldCheck className="size-5" />
            <strong>Protected checkout</strong>
            <span>Your payment and order details stay secure.</span>
          </div>
        </div>
      </section>
    </main>
  );
}
