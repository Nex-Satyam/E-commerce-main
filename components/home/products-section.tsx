"use client";

import { products } from "@/components/home/home-data";
import ProductCard from "@/components/home/product-card";
import { SectionHeading } from "@/components/home/section-heading";
import axios from "@/lib/axios";
import { useEffect, useState } from "react";


export function ProductsSection() {
  const [featuredProducts, setFeaturedProducts] = useState(products);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get("/product");
        console.log("API response:", response);
        if (response?.data?.success) {
          setFeaturedProducts(response.data.data || []);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <section className="section-block" id="products">
      <SectionHeading
        eyebrow="Featured Products"
        title="Pieces designed to mix, layer, and last."
        note="Neutral shades, breathable textures, and silhouettes that move across workdays, weekends, and evenings."
        split
      />

      {loading && <p>Loading products...</p>}

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