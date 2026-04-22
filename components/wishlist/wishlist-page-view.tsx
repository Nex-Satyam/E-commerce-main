"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, ShoppingBag } from "lucide-react";

import { CtaButton } from "@/components/home/cta-button";
import { getProductBySlug } from "@/components/home/home-data";
import { useWishlist } from "@/components/wishlist/wishlist-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function WishlistPageView() {
  const { wishlistSlugs, toggleWishlist } = useWishlist();
  const items = wishlistSlugs
    .map((slug) => getProductBySlug(slug))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  return (
    <main className="wishlist-page">
      <div className="wishlist-breadcrumb">
        <Link href="/" className="wishlist-back-link">
          <ArrowLeft className="size-4" /> Continue Shopping
        </Link>
        <span>/</span>
        <strong>Wishlist</strong>
      </div>

      <section className="wishlist-shell">
        <div className="wishlist-head">
          <p className="eyebrow">Wishlist</p>
          <h1>Saved pieces to revisit.</h1>
          <p>
            Keep track of the pieces you love and move them into your cart when
            you are ready.
          </p>
        </div>

        {items.length > 0 ? (
          <div className="wishlist-grid">
            {items.map((product) => (
              <Card key={product.slug} className="wishlist-card py-0 shadow-none">
                <div className="wishlist-card-shell">
                  <Link href={`/products/${product.slug}`} className="wishlist-image-link">
                    <div className="wishlist-image-wrap">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 20vw"
                        className="wishlist-image"
                      />
                    </div>
                  </Link>
                  <CardContent className="wishlist-card-content">
                    <div className="wishlist-status-row">
                      <div className="wishlist-meta-stack">
                        <span className="wishlist-chip is-light">{product.tag}</span>
                        <h2>{product.name}</h2>
                      </div>
                      <div className="wishlist-card-tools">
                        <span className="wishlist-status-copy">
                          <Heart className="size-3.5 fill-current" /> Added to wishlist
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          className="wishlist-toggle-button is-active"
                          aria-label={`Remove ${product.name} from wishlist`}
                          aria-pressed="true"
                          onClick={() => toggleWishlist(product.slug)}
                        >
                          <Heart className="size-4 fill-current" />
                        </Button>
                      </div>
                    </div>

                    <p>{product.description}</p>

                    <div className="wishlist-meta-row">
                      <strong>{product.price}</strong>
                      <span>{product.rating.toFixed(1)} / 5</span>
                    </div>

                    <div className="wishlist-actions">
                      <CtaButton asChild className="wishlist-action-button">
                        <Link href="/cart">
                          <ShoppingBag className="size-4" /> Add to Cart
                        </Link>
                      </CtaButton>
                      <CtaButton tone="light" asChild className="wishlist-action-button">
                        <Link href={`/products/${product.slug}`}>View Product</Link>
                      </CtaButton>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="wishlist-empty-card py-0 shadow-none">
            <CardContent className="wishlist-empty-content">
              <p className="eyebrow">Wishlist Empty</p>
              <h2>No saved pieces right now.</h2>
              <p>Tap the heart on any product card to save it here for later.</p>
              <CtaButton asChild className="wishlist-action-button">
                <Link href="/#products">Browse Products</Link>
              </CtaButton>
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
}