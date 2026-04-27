"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CtaButton } from "@/components/home/cta-button";
import { ProductItem } from "@/components/home/home-data";
import { useWishlist } from "@/components/wishlist/wishlist-provider";

import { useToast } from "@/components/ui/toast-context";



type ProductCardProps = {
  product: ProductItem;
};

export default function ProductCard({ product }: ProductCardProps) {


  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.slug);
  const { showToast } = useToast();

  const handleWishlistClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    toggleWishlist(product.slug);
    if (showToast) {
      showToast(
        isWishlisted ? "Removed from wishlist" : "Added to wishlist!",
        isWishlisted ? "info" : "success"
      );
    }
  };

  function getImageUrl(product: ProductItem): string {
    const img = product.images?.[0];
    if (!img) return "/placeholder.png";
    if (typeof img === "string") return img;
    if (typeof img === "object" && "url" in img && typeof (img as any).url === "string") return (img as any).url;
    return "/placeholder.png";
  }
  function getImageAlt(product: ProductItem): string {
    const img = product.images?.[0];
    if (!img) return product.name;
    if (typeof img === "string") return product.name;
    if (typeof img === "object" && "altText" in img && typeof (img as any).altText === "string" && (img as any).altText) return (img as any).altText;
    return product.name;
  }

  return (
    <Card
      id={product.slug}
      className="product-card border-[color:var(--border)] bg-[rgba(255,252,247,0.9)] py-0 shadow-none"
    >
      <div className="product-card-topbar">
        <div className="product-tag">{product.tag}</div>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className={`product-wishlist-button${isWishlisted ? " is-active" : ""}`}
          aria-label={`${isWishlisted ? "Remove" : "Add"} ${product.name} ${isWishlisted ? "from" : "to"} wishlist`}
          aria-pressed={isWishlisted}
          onClick={handleWishlistClick}
        >
          <Heart className={`size-4${isWishlisted ? " fill-current" : ""}`} />
        </Button>
      </div>
      <Link href={`/products/${product.slug}`} className="product-card-link">
        <div className="product-image-wrap">
          <Image
            src={getImageUrl(product)}
            alt={getImageAlt(product)}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="product-image"
          />
        </div>
        <CardContent className="product-copy px-5 pb-5">
          <div>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
          </div>
          <div className="product-meta">
            <strong>{product.price}</strong>
            <CtaButton asChild size="sm">
              <span>View Details</span>
            </CtaButton>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
