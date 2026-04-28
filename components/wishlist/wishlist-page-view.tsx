"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, ShoppingBag } from "lucide-react";

import { CtaButton } from "@/components/home/cta-button";
import { useEffect, useState } from "react";
import { useWishlist } from "@/components/wishlist/wishlist-provider";
import api from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";


export default function WishlistPageView() {
  const [wishlist, setWishlist] = useState<any[]>([]);
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
    fetchWishlist();
  }, []);

  const handleRemove = async (productId: string) => {
    setRemoving(productId);
    try {
      await api.delete(`/wishlist?productId=${productId}`);
      setWishlist((prev) => prev.filter((item) => item.productId !== productId));
      refreshWishlistCount();
    } catch {}
    setRemoving(null);
  };

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
            Keep track of the pieces you love and move them into your cart when you are ready.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-lg text-gray-500">Loading your wishlist...</div>
        ) : wishlist.length > 0 ? (
          <div className="wishlist-grid">
            {wishlist.map((item) => {
              const product = item.product;
              const image = product?.images?.[0]?.url || "/placeholder.png";
              return (
                <Card key={product.id} className="wishlist-card py-0 shadow-none border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="wishlist-card-shell">
                    <Link href={`/products/${product.slug}`} className="wishlist-image-link">
                      <div className="wishlist-image-wrap rounded-2xl overflow-hidden border border-gray-100 bg-white">
                        <Image
                          src={image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 20vw"
                          className="wishlist-image object-cover"
                        />
                      </div>
                    </Link>
                    <CardContent className="wishlist-card-content">
                      <div className="wishlist-status-row flex items-center justify-between">
                        <div className="wishlist-meta-stack">
                          <span className="wishlist-chip is-light bg-gray-100 text-xs px-2 py-1 rounded-full">{product.category?.name || "-"}</span>
                          <h2 className="font-semibold text-lg mt-1">{product.name}</h2>
                        </div>
                        <div className="wishlist-card-tools flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon-sm"
                            className="wishlist-toggle-button is-active border-red-200 text-red-500 hover:bg-red-50"
                            aria-label={`Remove ${product.name} from wishlist`}
                            aria-pressed="true"
                            onClick={() => handleRemove(product.id)}
                            disabled={removing === product.id}
                          >
                            <Heart className="size-4 fill-current" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mt-2 mb-3 line-clamp-2">{product.description}</p>

                      <div className="wishlist-meta-row flex items-center justify-between text-sm mb-3">
                        <strong className="text-lg text-[#253a33]">₹{(product.variants?.[0]?.price/100).toLocaleString("en-IN") || "-"}</strong>
                        <span className="text-yellow-600 flex items-center gap-1">★ {product.reviews?.length || 0} reviews</span>
                      </div>

                      <div className="wishlist-actions flex gap-2">
                        <CtaButton asChild className="wishlist-action-button">
                          <Link href={`/products/${product.slug}`}>View Product</Link>
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
            <CardContent className="wishlist-empty-content text-center py-12">
              <p className="eyebrow">Wishlist Empty</p>
              <h2 className="text-2xl font-semibold mb-2">No saved pieces right now.</h2>
              <p className="mb-4">Tap the heart on any product card to save it here for later.</p>
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
