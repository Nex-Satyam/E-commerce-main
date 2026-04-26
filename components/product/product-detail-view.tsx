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

type ProductDetailViewProps = {
  product: ProductItem;
};

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name ?? "");

  const { showToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await api.post("/cart", {
        productSlug: product.slug,
        size: selectedSize,
        color: selectedColor,
        quantity: 1,
      });
      showToast(`${product.name} added to cart!`, "success");
    } catch (err: any) {
      showToast("Failed to add to cart.", "error");
    } finally {
      setIsAdding(false);
    }
  };

  const goToPrevious = () => {
    setActiveImageIndex((currentIndex) =>
      currentIndex === 0 ? product.images.length - 1 : currentIndex - 1,
    );
  };

  const goToNext = () => {
    setActiveImageIndex((currentIndex) => (currentIndex + 1) % product.images.length);
  };

  const activeImage = product.images[activeImageIndex];

  return (
    <main className="product-detail-page">
      <div className="product-detail-breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/#products">Products</Link>
        <span>/</span>
        <strong>{product.name}</strong>
      </div>

      <section className="product-detail-main">
        <div className="product-gallery">
          <div className="product-gallery-stage">
            <button
              type="button"
              className="product-gallery-arrow is-left"
              onClick={goToPrevious}
              aria-label="Previous product image"
            >
              <ArrowLeft className="size-4" />
            </button>

            <div className="product-gallery-image-wrap">
              <Image
                src={activeImage}
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
              aria-label="Next product image"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>

          <div className="product-gallery-thumbs">
            {product.images.map((image, index) => (
              <button
                key={`${product.slug}-${image}`}
                type="button"
                className={cn(
                  "product-gallery-thumb",
                  index === activeImageIndex && "is-active",
                )}
                onClick={() => setActiveImageIndex(index)}
                aria-label={`Show image ${index + 1}`}
              >
                <Image
                  src={image}
                  alt={`${product.name} preview ${index + 1}`}
                  fill
                  sizes="120px"
                  className="product-gallery-thumb-image"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="product-detail-panel">
          <div className="product-detail-head">
            <p className="eyebrow">{product.category}</p>
            <h1>{product.name}</h1>
            <div className="product-detail-rating">
              <span className="product-stars" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={`${product.slug}-star-${index}`}
                    className={cn(
                      "size-4",
                      index < Math.round(product.rating)
                        ? "fill-current text-[var(--text)]"
                        : "text-[rgba(79,59,39,0.2)]",
                    )}
                  />
                ))}
              </span>
              <span>
                {product.rating.toFixed(1)} rating · {product.reviewCount} reviews
              </span>
            </div>
          </div>

          <div className="product-detail-price-row">
            <strong>{product.price}</strong>
            <span>{product.tag}</span>
          </div>

          <p className="product-detail-description">{product.longDescription}</p>

          <div className="product-variation-group">
            <div className="product-variation-label-row">
              <span className="product-variation-label">Color</span>
              <strong>{selectedColor}</strong>
            </div>
            <div className="product-color-options">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  className={cn(
                    "product-color-chip",
                    selectedColor === color.name && "is-active",
                  )}
                  onClick={() => setSelectedColor(color.name)}
                  aria-label={`Select ${color.name}`}
                >
                  <span style={{ backgroundColor: color.swatch }} />
                  {color.name}
                </button>
              ))}
            </div>
          </div>

          <div className="product-variation-group">
            <div className="product-variation-label-row">
              <span className="product-variation-label">Size</span>
              <Link href="/#footer" className="product-size-guide">
                Size Guide
              </Link>
            </div>
            <div className="product-size-options">
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  type="button"
                  variant="outline"
                  className={cn(
                    "product-size-chip",
                    selectedSize === size && "is-active",
                  )}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          <div className="product-detail-spec-grid">
            <Card className="product-spec-card py-0 shadow-none">
              <CardContent className="product-spec-card-content">
                <span>SKU</span>
                <strong>{product.sku}</strong>
              </CardContent>
            </Card>
            <Card className="product-spec-card py-0 shadow-none">
              <CardContent className="product-spec-card-content">
                <span>Material</span>
                <strong>{product.material}</strong>
              </CardContent>
            </Card>
            <Card className="product-spec-card py-0 shadow-none">
              <CardContent className="product-spec-card-content">
                <span>Fit</span>
                <strong>{product.fit}</strong>
              </CardContent>
            </Card>
          </div>

          <div className="product-detail-actions">
            <CtaButton className="product-action-button" onClick={handleAddToCart} disabled={isAdding}>
              {isAdding ? "Adding..." : "Add to Cart"}
            </CtaButton>
            <CtaButton tone="light" className="product-action-button">
              Buy Now
            </CtaButton>
          </div>
        </div>
      </section>

      <section className="product-detail-section">
        <div className="product-detail-section-heading">
          <p className="eyebrow">Description</p>
          <h2>What makes it worth wearing.</h2>
        </div>
        <div className="product-detail-description-grid">
          <p>{product.longDescription}</p>
          <ul>
            {product.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="product-detail-section">
        <div className="product-detail-section-heading">
          <p className="eyebrow">Reviews</p>
          <h2>Customer impressions.</h2>
        </div>
        <div className="product-review-list">
          {product.reviews.map((review) => (
            <Card key={`${review.author}-${review.date}`} className="product-review-card py-0 shadow-none">
              <CardContent className="product-review-card-content">
                <div className="product-review-head">
                  <div>
                    <strong>{review.author}</strong>
                    <p>{review.date}</p>
                  </div>
                  <span>{review.rating}.0 / 5</span>
                </div>
                <h3>{review.title}</h3>
                <p>{review.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}