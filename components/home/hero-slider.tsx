"use client";


import Image from "next/image";
import { memo, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CtaButton } from "@/components/home/cta-button";
import { Button } from "@/components/ui/button";
import { products as fallbackProducts } from "@/components/home/home-data";

const HOME_FETCH_TIMEOUT_MS = 3000;

type HeroProduct = Omit<(typeof fallbackProducts)[number], "images"> & {
  id?: string;
  images?: Array<string | { url?: string | null; altText?: string | null }>;
};

function getProductImage(product: HeroProduct) {
  const firstImage = product.images?.[0];

  if (!firstImage) return "/placeholder.png";
  if (typeof firstImage === "string") return firstImage;
  if (typeof firstImage === "object" && "url" in firstImage && typeof firstImage.url === "string") {
    return firstImage.url;
  }

  return "/placeholder.png";
}

const HeroSlides = memo(function HeroSlides({
  products,
  activeIndex,
  onOpenProduct,
}: {
  products: HeroProduct[];
  activeIndex: number;
  onOpenProduct: (product: HeroProduct) => void;
}) {
  return (
    <div
      className="slider-track"
      style={{ transform: `translateX(-${activeIndex * 100}%)` }}
    >
      {products.map((product, index) => (
        <div
          key={`${product.id ?? product.slug}-${index}`}
          className="slide-link cursor-pointer"
          aria-label={`${product.name} - open product`}
          onClick={() => onOpenProduct(product)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onOpenProduct(product);
            }
          }}
        >
          <div className="slide-image-wrap slide-image-only">
            <Image
              src={getProductImage(product)}
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
  );
});

export function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [products, setProducts] = useState<HeroProduct[]>(fallbackProducts);
  const router = useRouter();
  const activeProduct = products[activeIndex];
  const activeDescription = activeProduct?.description || "No description available.";

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), HOME_FETCH_TIMEOUT_MS);

    async function fetchProducts() {
      try {
        const res = await fetch("/api/product/random", {
          signal: controller.signal,
          cache: "no-store",
        });
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
          setActiveIndex(0);
        }
      } catch {
        // Keep the local fallback products if the database is slow or offline.
      } finally {
        window.clearTimeout(timeoutId);
      }
    }

    fetchProducts();

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
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

  const openProduct = useCallback(
    (product: HeroProduct) => {
      router.push(`/products/${product.slug}`);
    },
    [router],
  );

  return (
    <section className="hero-shell" id="slider">
      <div className="hero-copy">
        {activeProduct ? (
          <>
            <p className="eyebrow">Featured Product</p>
            <div className="typing-block" key={activeProduct.slug}>
              <h2 className="typing-text">{activeProduct.name}</h2>
              <p className="typing-text">{activeDescription}</p>
            </div>
            <div className="hero-actions">
              <CtaButton asChild>
                <a className="bg-amber-50 hover:bg-white" href={`#products`}>View All Products</a>
              </CtaButton>
              <CtaButton tone="light" asChild>
                <a  href={`/products/${activeProduct.slug}`}>View Details</a>
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
          <HeroSlides products={products} activeIndex={activeIndex} onOpenProduct={openProduct} />
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
                key={`${product.id ?? product.slug}-dot-${index}`}
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
