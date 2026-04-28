"use client";

import { products } from "@/components/home/home-data";
import ProductCard from "@/components/home/product-card";
import { SectionHeading } from "@/components/home/section-heading";
import { useEffect, useState } from "react";

const HOME_FETCH_TIMEOUT_MS = 3000;

export function ProductsSection() {
  const [featuredProducts, setFeaturedProducts] = useState(products);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), HOME_FETCH_TIMEOUT_MS);

    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch("/api/product?view=card", {
          signal: controller.signal,
          cache: "no-store",
        });
        const data = await response.json();

        if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
          setFeaturedProducts(data.data.slice(0, 12));
        }
      } catch {
        if (!controller.signal.aborted) {
          setError("Showing saved products while live products load.");
        }
      } finally {
        window.clearTimeout(timeoutId);
      }
    };

    fetchFeaturedProducts();

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  return (
    <section className="section-block" id="products">
      <SectionHeading
        eyebrow="Featured Products"
        title="Pieces designed to mix, layer, and last."
        note="Neutral shades, breathable textures, and silhouettes that move across workdays, weekends, and evenings."
        split
      />

      {error && <p className="text-red-500">{error}</p>}

      <div className="product-grid">
        {featuredProducts.length > 0 ? (
          featuredProducts.map((product, index) => (
            <ProductCard key={product.slug} product={product} priority={index < 4} />
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </section>
  );
}
