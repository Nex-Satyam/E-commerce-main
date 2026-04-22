"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { CtaButton } from "@/components/home/cta-button";
import { slides } from "@/components/home/home-data";
import { Button } from "@/components/ui/button";

export function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
    }, 4000);

    return () => window.clearInterval(intervalId);
  }, []);

  const goToPrevious = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? slides.length - 1 : currentIndex - 1,
    );
  };

  const goToNext = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
  };

  return (
    <section className="hero-shell" id="slider">
      <div className="hero-copy">
        <p className="eyebrow">Fresh Collection 2026</p>
        <h2>Minimal clothing, elevated for real wardrobes.</h2>
        <p>
          Explore a home page built around a soft off-white theme with curated
          collections, product highlights, and an editorial storefront feel.
        </p>
        <div className="hero-actions">
          <CtaButton asChild>
            <a href="#categories">Browse Categories</a>
          </CtaButton>
          <CtaButton tone="light" asChild>
            <a href="#products">View Products</a>
          </CtaButton>
        </div>
      </div>

      <div className="slider-shell">
        <div className="slider" aria-label="Featured clothing banners">
          <div
            className="slider-track"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <a
                key={slide.title}
                href={slide.href}
                className="slide-link"
                aria-label={`${slide.title} - open product`}
              >
                <div className="slide-image-wrap slide-image-only">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 900px) 100vw, 50vw"
                    className="slide-image"
                  />
                </div>
              </a>
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
            {slides.map((slide, index) => (
              <button
                key={slide.title}
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