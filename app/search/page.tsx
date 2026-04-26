"use client";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { products } from "@/components/home/home-data";
import ProductCard from "@/components/home/product-card";
import { SiteHeader } from "@/components/home/site-header";
import { SiteFooter } from "@/components/home/site-footer";


export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);

  const parsePrice = (price: string) => Number(price.replace(/[^\d.]/g, ""));

  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (query) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number);
      filtered = filtered.filter((p) => {
        const price = parsePrice(p.price);
        return price >= min && price <= max;
      });
    }
    if (selectedRating > 0) {
      filtered = filtered.filter((p) => Math.floor(p.rating) >= selectedRating);
    }
    return filtered;
  }, [query, category, priceRange, selectedRating]);

  const categories = Array.from(new Set(products.map((p) => p.category)));

  // Price ranges for filter
  const priceRanges = [
    { label: "Under ₹60", value: "0-60" },
    { label: "₹60 - ₹100", value: "60-100" },
    { label: "₹100 - ₹150", value: "100-150" },
    { label: "Above ₹150", value: "150-10000" },
  ];

  return (
    <>
      <SiteHeader />
      <main className="search-page" style={{ background: "#f8fafb", minHeight: "80vh" }}>
        <h1 className="text-2xl font-bold mb-6 px-8 pt-6">Search Results for "{query}"</h1>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 32, padding: "0 2rem 2rem 2rem" }}>
          {/* Filter Sidebar */}
          <aside style={{ minWidth: 260, background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #0001", padding: 24 }}>
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <div className="mb-6">
              <label htmlFor="category-filter" className="block font-medium mb-1">Category</label>
              <select
                id="category-filter"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded px-2 py-1"
              >
                <option value="">All</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <div className="font-medium mb-1">Price</div>
              {priceRanges.map((range) => (
                <label key={range.value} className="block text-sm mb-1 cursor-pointer">
                  <input
                    type="radio"
                    name="price"
                    value={range.value}
                    checked={priceRange === range.value}
                    onChange={() => setPriceRange(range.value)}
                    className="mr-2"
                  />
                  {range.label}
                </label>
              ))}
              <label className="block text-sm mt-1 cursor-pointer">
                <input
                  type="radio"
                  name="price"
                  value=""
                  checked={priceRange === ""}
                  onChange={() => setPriceRange("")}
                  className="mr-2"
                />
                All
              </label>
            </div>
            <div className="mb-6">
              <div className="font-medium mb-1">Rating</div>
              {[4, 3, 2, 1].map((star) => (
                <label key={star} className="block text-sm mb-1 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    value={star}
                    checked={selectedRating === star}
                    onChange={() => setSelectedRating(star)}
                    className="mr-2"
                  />
                  {star} stars & up
                </label>
              ))}
              <label className="block text-sm mt-1 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  value={0}
                  checked={selectedRating === 0}
                  onChange={() => setSelectedRating(0)}
                  className="mr-2"
                />
                All
              </label>
            </div>
          </aside>
          {/* Product Grid */}
          <section style={{ flex: 1 }}>
            <div
              className="product-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 24,
                alignItems: "stretch",
              }}
            >
              {filteredProducts.length === 0 ? (
                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 40, color: "#888" }}>No products found.</div>
              ) : (
                filteredProducts.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))
              )}
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
