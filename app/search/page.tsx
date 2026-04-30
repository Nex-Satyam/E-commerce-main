"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BadgeCheck,
  Filter,
  PackageSearch,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Tag,
  X,
} from "lucide-react";

import ProductCard from "@/components/home/product-card";
import { SiteHeader } from "@/components/home/site-header";
import { SiteFooter } from "@/components/home/site-footer";
import { CtaButton } from "@/components/home/cta-button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { searchProducts } from "@/services/search.service";
import { ProductItem } from "@/components/home/home-data";
import { queryKeys } from "@/lib/query-keys";

type SearchProductImage = {
  url?: string | null;
  altText?: string | null;
};

type SearchProductVariant = {
  name?: string;
  sku?: string;
  price?: number;
  stock?: number;
};

type SearchProduct = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  brand?: string | null;
  images?: SearchProductImage[];
  variants?: SearchProductVariant[];
  category?: { name?: string | null } | null;
  reviews?: { rating?: number | null }[];
};

const categories = ["Mobiles", "Clothing", "Electronics", "Books", "Home", "Toys"];

const priceRanges = [
  { label: "Under Rs. 1,000", value: "0-100000" },
  { label: "Rs. 1,000 - Rs. 2,500", value: "100000-250000" },
  { label: "Rs. 2,500 - Rs. 5,000", value: "250000-500000" },
  { label: "Above Rs. 5,000", value: "500000-10000000" },
];

function useDebouncedValue<T>(value: T, delay = 350) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
}

function formatCurrencyFromPaise(value = 0) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value / 100);
}

function getAverageRating(product: SearchProduct) {
  const ratings = product.reviews?.map((review) => review.rating || 0).filter(Boolean) || [];
  if (!ratings.length) return 4;

  return Number((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1));
}

function normalizeProduct(product: SearchProduct): ProductItem {
  const prices = product.variants?.map((variant) => variant.price || 0).filter(Boolean) || [];
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const primaryImage = product.images?.[0]?.url || "/placeholder.png";
  const firstVariant = product.variants?.[0];
  const rating = getAverageRating(product);

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: minPrice ? formatCurrencyFromPaise(minPrice) : "Price on request",
    tag: product.brand || product.category?.name || "Premium",
    image: primaryImage,
    images: product.images?.map((image) => image.url || "/placeholder.png") || [primaryImage],
    variants: product.variants as ProductItem["variants"],
    description: product.description || "A carefully selected product from the latest store edit.",
    longDescription: product.description || "",
    details: [],
    sizes: [],
    colors: [],
    rating,
    reviewCount: product.reviews?.length || 0,
    sku: firstVariant?.sku || product.slug,
    category: product.category?.name || "Collection",
    material: "Premium finish",
    fit: "Standard",
    reviews: [],
  };
}

function SearchResults() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);

  const debouncedQuery = useDebouncedValue(searchInput.trim(), 350);
  const debouncedCategory = useDebouncedValue(category, 250);
  const debouncedPriceRange = useDebouncedValue(priceRange, 250);
  const debouncedRating = useDebouncedValue(selectedRating, 250);
  const searchQueryParams = {
    q: debouncedQuery,
    category: debouncedCategory,
    price: debouncedPriceRange,
    rating: debouncedRating,
  };

  const activeFilterCount = [debouncedCategory, debouncedPriceRange, debouncedRating ? "rating" : ""].filter(Boolean).length;

  const productsQuery = useQuery({
    queryKey: queryKeys.search(searchQueryParams),
    queryFn: async () => {
      const result = await searchProducts(searchQueryParams);
      return (result as SearchProduct[]).map(normalizeProduct);
    },
    placeholderData: [],
  });

  const products = productsQuery.data || [];
  const loading = productsQuery.isLoading || productsQuery.isFetching;
  const error = productsQuery.isError ? "Unable to load search results." : null;

  const resultCopy = useMemo(() => {
    if (loading) return "Searching the catalogue...";
    if (!products.length) return "No products matched your current search.";
    return `${products.length} product${products.length === 1 ? "" : "s"} found`;
  }, [loading, products.length]);

  const clearFilters = () => {
    setCategory("");
    setPriceRange("");
    setSelectedRating(0);
  };

  return (
    <div className="search-results-page">
      <div className="search-page-breadcrumb">
        <Link href="/" className="wishlist-back-link">
          <ArrowLeft className="size-4" />
          Back to home
        </Link>
        <span>/</span>
        <strong>Search</strong>
      </div>

      <section className="search-page-hero">
        <div>
          <p className="eyebrow">Search catalogue</p>
          <h1>Find the right product without the noise.</h1>
          <p>
            Search, filter, and compare products with a calmer storefront view
            built for quick decisions.
          </p>
        </div>

        <Card className="search-insight-card py-0 shadow-none">
          <CardContent className="search-insight-content">
            <span>
              <PackageSearch className="size-4" />
              {resultCopy}
            </span>
            <span>
              <ShieldCheck className="size-4" />
              Secure products only
            </span>
          </CardContent>
        </Card>
      </section>

      <Card className="search-command-card py-0 shadow-none">
        <CardContent className="search-command-content">
          <div className="search-page-input">
            <Search className="size-4" />
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search shirts, phones, books..."
              aria-label="Search products"
            />
            {searchInput ? (
              <button type="button" onClick={() => setSearchInput("")} aria-label="Clear search">
                <X className="size-4" />
              </button>
            ) : null}
          </div>

          <div className="search-command-meta">
            <span>
              <SlidersHorizontal className="size-4" />
              {activeFilterCount} filter(s)
            </span>
            <span>
              <Sparkles className="size-4" />
              Debounced search
            </span>
          </div>
        </CardContent>
      </Card>

      <section className="search-layout">
        <Card className="search-filter-card py-0 shadow-none">
          <CardContent className="search-filter-content">
            <div className="search-filter-head">
              <div>
                <p className="eyebrow">Filters</p>
                <h2>Refine results</h2>
              </div>
              <button type="button" onClick={clearFilters} disabled={!activeFilterCount}>
                <RotateCcw className="size-4" />
                Reset
              </button>
            </div>

            <label className="search-filter-field">
              <span>
                <Tag className="size-4" />
                Category
              </span>
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="">All categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>

            <div className="search-filter-group">
              <span>
                <Filter className="size-4" />
                Price
              </span>
              <div className="search-choice-list">
                <button
                  type="button"
                  className={!priceRange ? "is-active" : ""}
                  onClick={() => setPriceRange("")}
                >
                  All prices
                </button>
                {priceRanges.map((range) => (
                  <button
                    key={range.value}
                    type="button"
                    className={priceRange === range.value ? "is-active" : ""}
                    onClick={() => setPriceRange(range.value)}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="search-filter-group">
              <span>
                <Star className="size-4" />
                Rating
              </span>
              <div className="search-choice-list">
                {[0, 4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    className={selectedRating === rating ? "is-active" : ""}
                    onClick={() => setSelectedRating(rating)}
                  >
                    {rating === 0 ? "All ratings" : `${rating}+ stars`}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <section className="search-results-section">
          <div className="search-results-head">
            <div>
              <p className="eyebrow">Results</p>
              <h2>{debouncedQuery ? `Search for "${debouncedQuery}"` : "Latest products"}</h2>
            </div>
            <span>
              <BadgeCheck className="size-4" />
              {resultCopy}
            </span>
          </div>

          {loading ? (
            <div className="search-skeleton-grid">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Card key={item} className="search-skeleton-card py-0 shadow-none">
                  <CardContent>
                    <span />
                    <strong />
                    <p />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="search-empty-card py-0 shadow-none">
              <CardContent className="search-empty-content">
                <PackageSearch className="size-10" />
                <h2>{error}</h2>
                <CtaButton type="button" onClick={() => setSearchInput(searchInput)}>
                  Try again
                </CtaButton>
              </CardContent>
            </Card>
          ) : products.length === 0 ? (
            <Card className="search-empty-card py-0 shadow-none">
              <CardContent className="search-empty-content">
                <PackageSearch className="size-10" />
                <h2>No products found</h2>
                <p>Try a broader search term or reset your filters.</p>
                <CtaButton type="button" onClick={clearFilters}>
                  Clear filters
                </CtaButton>
              </CardContent>
            </Card>
          ) : (
            <div className="search-product-grid">
              {products.map((product) => (
                <ProductCard key={product.slug || product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </section>
    </div>
  );
}

export default function SearchPage() {
  return (
    <>
      <SiteHeader />
      <main className="search-page">
        <Suspense fallback={<div className="search-page-loading">Loading search results...</div>}>
          <SearchResults />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
