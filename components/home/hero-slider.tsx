"use client";


import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CtaButton } from "@/components/home/cta-button";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type SliderProduct = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  images?: { url?: string | null }[];
};

export function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [products, setProducts] = useState<SliderProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  useEffect(() => {
    let ignore = false;

    async function fetchProducts() {
      try {
        const res = await fetch("/api/product/random");
        const data = await res.json();

        if (!ignore) {
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch {
        if (!ignore) setProducts([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    void fetchProducts();

    return () => {
      ignore = true;
    };
  }, []);

  const goToPrevious = () => {
    if (products.length <= 1) return;

    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? products.length - 1 : currentIndex - 1,
    );
  };

  const goToNext = () => {
    if (products.length <= 1) return;

    setActiveIndex((currentIndex) => (currentIndex + 1) % products.length);
  };

  return (
    <section className="hero-shell" id="slider">
      <div className="hero-copy">
        {products[activeIndex] ? (
          <>
            <p className="eyebrow">Featured Product</p>
            <h2>{products[activeIndex].name}</h2>
            <p>{products[activeIndex].description || "No description available."}</p>
            <div className="hero-actions">
              <CtaButton asChild>
                <a href={`#products`}>View All Products</a>
              </CtaButton>
              <CtaButton tone="light" asChild>
                <a href={`/products/${products[activeIndex].slug}`}>View Details</a>
              </CtaButton>
            </div>
          </>
        ) : (
          <div className="hero-copy-skeleton" aria-busy={loading}>
            <Skeleton className="hero-skeleton-eyebrow" />
            <Skeleton className="hero-skeleton-title" />
            <Skeleton className="hero-skeleton-text" />
            <Skeleton className="hero-skeleton-text short" />
            <div className="hero-actions">
              <Skeleton className="hero-skeleton-button" />
              <Skeleton className="hero-skeleton-button light" />
            </div>
          </div>
        )}
      </div>

      <div className="slider-shell">
        <div className="slider" aria-label="Featured clothing banners">
          <div
            className="slider-track"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {products.length === 0 && loading ? (
              <div className="slide-link">
                <div className="slide-image-wrap slide-image-only">
                  <Skeleton className="hero-skeleton-image" />
                </div>
              </div>
            ) : null}
            {products.map((product, index) => (
              <div
                key={product.id}
                className="slide-link cursor-pointer"
                aria-label={`${product.name} - open product`}
                onClick={async () => {
                  try {
                    const res = await fetch(`/api/product/slug/${product.slug}`);
                    const data = await res.json();
                    if (data && data.success !== false) {
                      router.push(`/products/${product.slug}`);
                    } else {
                      alert("Product not found or unavailable.");
                    }
                  } catch {
                    alert("Error loading product details.");
                  }
                }}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") {
                    (e.target as HTMLElement).click();
                  }
                }}
              >
                <div className="slide-image-wrap slide-image-only">
                  <Image
                    src={product.images?.[0]?.url || "/placeholder.png"}
                    alt={product.name}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 900px) 100vw, 50vw"
                    className="slide-image"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="slider-controls">
          <div className="slider-arrows">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="slider-arrow"
              onClick={goToPrevious}
              disabled={products.length <= 1}
              aria-label="Previous slide"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="slider-arrow"
              onClick={goToNext}
              disabled={products.length <= 1}
              aria-label="Next slide"
            >
              <ArrowRight className="size-4" />
            </Button>
          </div>
          <div className="slider-dots" aria-label="Choose slide">
            {products.map((product, index) => (
              <button
                key={product.id}
                type="button"
                className={index === activeIndex ? "slider-dot is-active" : "slider-dot"}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-pressed={index === activeIndex}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
