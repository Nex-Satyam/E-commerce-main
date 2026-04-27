"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import api from "@/lib/axios";
import { useToast } from "@/components/ui/toast-context";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { CtaButton } from "@/components/home/cta-button";
import { ProductItem } from "@/components/home/home-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { sl } from "zod/v4/locales";
type ProductDetailViewProps = {
  product: ProductItem;
};

export function ProductDetailView({ product }: ProductDetailViewProps) {
  // Guard: If product is missing or invalid, show a fallback UI
  if (!product || typeof product !== "object" || !product.name) {
    return (
      <main className="product-detail-page">
        <div className="product-detail-breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/#products">Products</Link>
          <span>/</span>
          <strong>Product Not Found</strong>
        </div>
        <section className="product-detail-main">
          <div className="product-detail-panel">
            <h1>Product Not Found</h1>
            <p>Sorry, the product you are looking for does not exist or could not be loaded.</p>
            <Link href="/products">
              <CtaButton>Back to Products</CtaButton>
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0] || null
  );
  console.log("Rendering ProductDetailView with product:", product);

  const { showToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);

    try {
      await api.post("/cart", {
        variantId: selectedVariant?.id,
        quantity: 1,
      });
      console.log("Added to cart:", selectedVariant);

      showToast(`${product.name} added to cart!`, "success");

    } catch (err: any) {
      if (err.response?.status === 401) {
        showToast("Please login first", "error");
      } else {
        showToast("Failed to add to cart", "error");
      }
    } finally {
      setIsAdding(false);
    }
  };

  const goToPrevious = () => {
    setActiveImageIndex((currentIndex) =>
      currentIndex === 0
        ? (product.images?.length || 1) - 1
        : currentIndex - 1
    );
  };

  const goToNext = () => {
    setActiveImageIndex(
      (currentIndex) => (currentIndex + 1) % (product.images?.length || 1)
    );
  };

  const variant = selectedVariant;

  const activeImage = product.images?.[activeImageIndex];
  const activeImageUrl =
    typeof activeImage === "string"
      ? activeImage
      : (activeImage && typeof activeImage === "object" && "url" in activeImage && typeof (activeImage as any).url === "string")
        ? (activeImage as any).url
        : "/placeholder.png";

  return (
    <main className="product-detail-page">
      {/* Breadcrumb */}
      <div className="product-detail-breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/#products">Products</Link>
        <span>/</span>
        <strong>{product.name}</strong>
      </div>

      <section className="product-detail-main">
        {/* Image Gallery */}
        <div className="product-gallery">
          <div className="product-gallery-stage">
            <button
              type="button"
              className="product-gallery-arrow is-left"
              onClick={goToPrevious}
            >
              <ArrowLeft className="size-4" />
            </button>

            <div className="product-gallery-image-wrap">
              <Image
                src={activeImageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                className="product-gallery-image"
                priority
              />
            </div>

            <button
              type="button"
              className="product-gallery-arrow is-right"
              onClick={goToNext}
            >
              <ArrowRight className="size-4" />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="product-gallery-thumbs">
            {product.images?.map((image: any, index: number) => {
              // Determine key, src, and alt safely
              let key = `${product.slug}-`;
              if (typeof image === "object" && image && "id" in image) {
                key += image.id ?? index;
              } else {
                key += index;
              }
              let src = "/placeholder.png";
              if (typeof image === "string") {
                src = image;
              } else if (image && typeof image === "object" && "url" in image && typeof image.url === "string") {
                src = image.url;
              }
              let alt = `${product.name} preview ${index + 1}`;
              if (typeof image === "object" && image && "altText" in image && typeof image.altText === "string" && image.altText) {
                alt = image.altText;
              }
              return (
                <button
                  key={key}
                  className={cn(
                    "product-gallery-thumb",
                    index === activeImageIndex && "is-active"
                  )}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes="120px"
                    className="product-gallery-thumb-image"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-detail-panel">
          <div className="product-detail-head">
            <p className="eyebrow">{typeof product.category === "object" && product.category && "name" in product.category ? (product.category as any).name : ""}</p>
            <h1>{product.name}</h1>

            <div className="product-detail-rating">
              <span className="product-stars">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={cn(
                      "size-4",
                      index < 4
                        ? "fill-current text-[var(--text)]"
                        : "text-[rgba(79,59,39,0.2)]"
                    )}
                  />
                ))}
              </span>
              <span>
                {/* {product.rating.toFixed(1)} rating ·{" "} */}
                {product.reviews?.length || 0} reviews
              </span>
            </div>
          </div>

          <div className="product-detail-price-row">
            <strong>
              ₹ {variant?.price ? variant.price / 100 : "N/A"}
            </strong>
            <span>{product.tag}</span>
          </div>

          <p className="product-detail-description">
            {product.description || "No description available"}
          </p>

          <div className="product-variation-group">
            <span>Size: {selectedVariant?.name}</span>

            <div className="product-size-options">
              {Array.isArray(product.variants) && product.variants.map((variant: any) => (
                <Button
                  key={variant.sku}
                  variant="outline"
                  className={cn(
                    "product-size-chip",
                    selectedVariant?.sku === variant.sku && "is-active"
                  )}
                  onClick={() => setSelectedVariant(variant)}
                  disabled={variant.stock === 0}
                >
                  {variant.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Specs */}
          <div className="product-detail-spec-grid">
            <Card>
              <CardContent>
                <span>SKU</span>
                <strong>{variant?.sku || "N/A"}</strong>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <span>Material</span>
                <strong>{product.material || "N/A"}</strong>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <span>Fit</span>
                <strong>{product.fit || "Standard"}</strong>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="product-detail-actions">
            <CtaButton
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              {isAdding ? "Adding..." : "Add to Cart"}
            </CtaButton>

            <CtaButton tone="light">
              Buy Now
            </CtaButton>
          </div>
        </div>
      </section>
    </main>
  );
}