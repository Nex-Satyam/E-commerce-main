"use client";

import ProductCard from "@/components/home/product-card";
import { ProductItem } from "@/components/home/home-data";
import { SectionHeading } from "@/components/home/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "@/lib/axios";
import { useEffect, useState } from "react";

function ProductCardSkeleton() {
  return (
    <Card className="product-card product-card-skeleton cursor-pointer py-0 shadow-none transition-shadow duration-300 hover:shadow-lg hover:shadow-gray-400">
      <div className="product-card-topbar">
        <Skeleton className="product-skeleton-pill" />
        <Skeleton className="product-skeleton-icon" />
      </div>
      <Skeleton className="product-skeleton-image" />
      <CardContent className="product-copy px-5 pb-5">
        <div className="product-skeleton-copy">
          <Skeleton className="product-skeleton-title" />
          <Skeleton className="product-skeleton-text" />
          <Skeleton className="product-skeleton-text short" />
        </div>
        <div className="product-meta">
          <Skeleton className="product-skeleton-price" />
          <Skeleton className="product-skeleton-button" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ProductsSection() {
  const [featuredProducts, setFeaturedProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get("/product");

        if (!ignore && response?.data?.success) {
          setFeaturedProducts(response.data.data || []);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        if (!ignore) setError("Failed to load products");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    void fetchFeaturedProducts();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="section-block" id="products">
      <SectionHeading
        eyebrow="Featured Products"
        title="Pieces designed to mix, layer, and last."
        // note="Neutral shades, breathable textures, and silhouettes that move across workdays, weekends, and evenings."
        split
      />

      {loading && (
        <div className="product-grid" aria-busy="true" aria-label="Loading featured products">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="product-grid">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))
          ) : (
            <p>No products found</p>
          )}
        </div>
      )}
    </section>
  );
}
