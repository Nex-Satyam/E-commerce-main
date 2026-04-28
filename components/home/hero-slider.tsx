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
  const [typedName, setTypedName] = useState("");
  const [typedDescription, setTypedDescription] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const router = useRouter();
  const activeProduct = products[activeIndex];

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

  useEffect(() => {
    if (!activeProduct) {
      setTypedName("");
      setTypedDescription("");
      setIsTyping(false);
      return;
    }

    const name = activeProduct.name || "";
    const description = activeProduct.description || "No description available.";
    const fullText = `${name}\n${description}`;
    let characterIndex = 0;
    let timeoutId: number;

    setTypedName("");
    setTypedDescription("");
    setIsTyping(true);

    const typeNextCharacter = () => {
      characterIndex += 1;
      const visibleText = fullText.slice(0, characterIndex);
      const [nextName = "", nextDescription = ""] = visibleText.split("\n");

      setTypedName(nextName);
      setTypedDescription(nextDescription);

      if (characterIndex >= fullText.length) {
        setIsTyping(false);
        return;
      }

      const currentCharacter = fullText[characterIndex - 1];
      const nextDelay =
        currentCharacter === "\n" ? 180 : currentCharacter === " " ? 34 : 22;

      timeoutId = window.setTimeout(typeNextCharacter, nextDelay);
    };

    timeoutId = window.setTimeout(typeNextCharacter, 120);

    return () => window.clearTimeout(timeoutId);
  }, [activeProduct]);

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
        {activeProduct ? (
          <>
            <p className="eyebrow">Featured Product</p>
            <div className={isTyping ? "typing-block is-typing" : "typing-block"}>
              <h2 className="typing-text">{typedName}</h2>
              <p className="typing-text">{typedDescription}</p>
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
