"use client";


import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CtaButton } from "@/components/home/cta-button";
import { Button } from "@/components/ui/button";

export function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("/api/product/random");
      const data = await res.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length === 0) return;
    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % products.length);
    }, 4000);
    return () => window.clearInterval(intervalId);
  }, [products]);

  const goToPrevious = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? products.length - 1 : currentIndex - 1,
    );
  };

  const goToNext = () => {
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
          <>
            <p className="eyebrow">Loading...</p>
            <h2>Loading product...</h2>
            <p>Please wait while we load the product details.</p>
          </>
        )}
      </div>

      <div className="slider-shell">
        <div className="slider" aria-label="Featured clothing banners">
          <div
            className="slider-track"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
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
                  } catch (e) {
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
