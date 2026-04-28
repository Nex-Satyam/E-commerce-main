"use client";

import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CtaButton } from "@/components/home/cta-button";
import { ProductItem } from "@/components/home/home-data";
import { useWishlist } from "@/components/wishlist/wishlist-provider";

import { useToast } from "@/components/ui/toast-context";



type ProductCardProps = {
  product: Pick<ProductItem, "slug" | "name"> &
    Partial<Omit<ProductItem, "images" | "price">> & {
    price?: string | number;
    images?: Array<string | { url?: string | null; altText?: string | null }>;
  };
  priority?: boolean;
};

function getImageUrl(product: ProductCardProps["product"]): string {
  const img = product.images?.[0];

  if (!img) return "/placeholder.png";
  if (typeof img === "string") return img;
  if (typeof img === "object" && typeof img.url === "string") return img.url;

  return "/placeholder.png";
}

function getImageAlt(product: ProductCardProps["product"]): string {
  const img = product.images?.[0];

  if (!img) return product.name;
  if (typeof img === "string") return product.name;
  if (typeof img === "object" && typeof img.altText === "string" && img.altText) return img.altText;

  return product.name;
}

function formatPrice(price: ProductCardProps["product"]["price"]) {
  if (typeof price === "number") return `₹${price}`;
  return price;
}

function ProductCard({ product, priority = false }: ProductCardProps) {


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
            priority={priority}
            className="product-image"
          />
        </div>
        <CardContent className="product-copy px-2 pb-2">
          <div>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
          </div>
          <div className="product-meta">
            <strong>{formatPrice(product.price)}</strong>
            <CtaButton asChild size="sm">
              <span>View Details</span>
            </CtaButton>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

export default memo(ProductCard);
