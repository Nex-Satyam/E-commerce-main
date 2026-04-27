"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
// import { ProductItem } from "@/components/home/home-data";
import { searchProducts, SearchParams } from "@/services/search.service";
import ProductCard from "@/components/home/product-card";
import { SiteHeader } from "@/components/home/site-header";
import { SiteFooter } from "@/components/home/site-footer";



function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // For demo, you can hardcode categories or fetch from API
  const categories = ["Electronics", "Clothing", "Books", "Home", "Toys"];
  const priceRanges = [
    { label: "Under ₹60", value: "0-60" },
    { label: "₹60 - ₹100", value: "60-100" },
    { label: "₹100 - ₹150", value: "100-150" },
    { label: "Above ₹150", value: "150-10000" },
  ];

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const result = await searchProducts({
        q: query,
        category,
        price: priceRange,
        rating: selectedRating,
      });
      setProducts(result);
      setLoading(false);
    }
    fetchProducts();
  }, [query, category, priceRange, selectedRating]);

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-blue-50 to-white py-8 px-2 md:px-8">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-blue-900 text-center drop-shadow">Search Products</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filter Sidebar */}
        <aside className="w-full md:w-72 bg-white rounded-2xl shadow-xl p-6 mb-4 md:mb-0">
          <h2 className="text-xl font-semibold mb-6 text-blue-700">Filters</h2>
          <div className="mb-6">
            <label htmlFor="category-filter" className="block font-medium mb-2 text-gray-700">Category</label>
            <select
              id="category-filter"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <div className="font-medium mb-2 text-gray-700">Price</div>
            {priceRanges.map((range) => (
              <label key={range.value} className="block text-sm mb-1 cursor-pointer">
                <input
                  type="radio"
                  name="price"
                  value={range.value}
                  checked={priceRange === range.value}
                  onChange={() => setPriceRange(range.value)}
                  className="mr-2 accent-blue-500"
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
                className="mr-2 accent-blue-500"
              />
              All
            </label>
          </div>
          <div className="mb-6">
            <div className="font-medium mb-2 text-gray-700">Rating</div>
            {[4, 3, 2, 1].map((star) => (
              <label key={star} className="block text-sm mb-1 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  value={star}
                  checked={selectedRating === star}
                  onChange={() => setSelectedRating(star)}
                  className="mr-2 accent-blue-500"
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
                className="mr-2 accent-blue-500"
              />
              All
            </label>
          </div>
        </aside>
        {/* Product Grid */}
        <section className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center text-gray-400 py-20 text-xl">No products found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <div key={product.slug || product.id} className="transition-transform hover:-translate-y-2 hover:shadow-2xl">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <>
      <SiteHeader />
      <main className="search-page" style={{ background: "#f8fafb", minHeight: "80vh" }}>
        <Suspense fallback={<div>Loading search results...</div>}>
          <SearchResults />
        </Suspense>
      </main>
        <SiteFooter />
      </>
    );
}