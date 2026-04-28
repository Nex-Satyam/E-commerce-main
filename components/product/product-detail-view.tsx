"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@iconify/react";

import api from "@/lib/axios";
import { ProductItem } from "@/components/home/home-data";
import ProductCard from "@/components/home/product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ProductCategory = {
  name: string;
};

type ProductImage =
  | string
  | {
      url: string;
    };

type ProductDetailViewProps = {
  product: Omit<ProductItem, "category" | "images"> & {
    category: ProductCategory | string;
    images?: ProductImage[];
  };
  recommendedProducts?: Array<
    Pick<ProductItem, "slug" | "name"> &
      Partial<Omit<ProductItem, "images" | "price">> & {
        price?: string | number;
        images?: Array<string | { url?: string | null; altText?: string | null }>;
      }
  >;
};

function isProductImage(value: unknown): value is { url: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "url" in value &&
    typeof (value as { url: unknown }).url === "string"
  );
}

const isProductCategory = (category: unknown): category is ProductCategory =>
  typeof category === "object" &&
  category !== null &&
  "name" in category &&
  typeof (category as { name: unknown }).name === "string";

export function ProductDetailView({
  product,
  recommendedProducts = [],
}: ProductDetailViewProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const [selectedVariant, setSelectedVariant] = useState(
    Array.isArray(product.variants) && product.variants.length > 0
      ? product.variants[0]
      : null,
  );

  const activeImage = product.images?.[activeImageIndex];
  const imageCount = product.images?.length ?? 0;

  const activeImageUrl =
    typeof activeImage === "string"
      ? activeImage
      : isProductImage(activeImage)
        ? activeImage.url
        : "/placeholder.png";

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    try {
      setIsAdding(true);

      await api.post("/cart", {
        variantId: selectedVariant.id,
        quantity: 1,
      });

      toast.success(`${product.name} added to cart`);
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error("Please login first");
      } else {
        toast.error("Failed to add to cart");
      }
    } finally {
      setIsAdding(false);
    }
  };

  const goToPrevious = () => {
    setActiveImageIndex((prev) =>
      prev === 0 ? Math.max(imageCount, 1) - 1 : prev - 1,
    );
  };

  const goToNext = () => {
    setActiveImageIndex((prev) => (prev + 1) % Math.max(imageCount, 1));
  };

  return (
    <main className="min-h-screen bg-[#F1EFE8]">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-[#888780]">
          <Link href="/" className="hover:text-[#185FA5]">
            Home
          </Link>
          <span>/</span>
          <Link href="/#products" className="hover:text-[#185FA5]">
            Products
          </Link>
          <span>/</span>
          <span className="text-[#2C2C2A]">{product.name}</span>
        </nav>

        <section className="grid gap-12 lg:grid-cols-2">
          {/* Gallery */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-[#D3D1C7] bg-white">
              <Image
                src={activeImageUrl}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />

              {imageCount > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md hover:bg-white"
                  >
                    <Icon
                      icon="mdi:chevron-left"
                      className="text-xl text-[#2C2C2A]"
                    />
                  </button>

                  <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md hover:bg-white"
                  >
                    <Icon
                      icon="mdi:chevron-right"
                      className="text-xl text-[#2C2C2A]"
                    />
                  </button>
                </>
              )}
            </div>

            {imageCount > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                {(product.images ?? []).map((image, index) => {
                  const imgUrl =
                    typeof image === "string"
                      ? image
                      : (image as any)?.url || "/placeholder.png";

                  return (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={cn(
                        "relative aspect-square overflow-hidden rounded-2xl border bg-white transition",
                        activeImageIndex === index
                          ? "border-[#185FA5]"
                          : "border-[#D3D1C7]",
                      )}
                    >
                      <Image
                        src={imgUrl}
                        alt={`${product.name}-${index}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <p className="mb-2 text-sm font-medium text-[#185FA5]">
                {typeof product.category === "object"
                  ? (product.category as any)?.name
                  : product.category}
              </p>

              <h1 className="text-4xl font-bold text-[#2C2C2A]">
                {product.name}
              </h1>

              <div className="mt-3 flex items-center gap-4 text-sm text-[#5F5E5A]">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon
                      key={i}
                      icon="mdi:star"
                      className={cn(
                        "text-lg",
                        i < 4 ? "text-[#EF9F27]" : "text-[#D3D1C7]",
                      )}
                    />
                  ))}
                </div>

                <span>{product.reviews?.length || 0} Reviews</span>
              </div>
            </div>

            <div>
              <p className="text-3xl font-bold text-[#3B6D11]">
                ₹ {selectedVariant?.price ? selectedVariant.price / 100 : "N/A"}
              </p>

              {product.tag && (
                <span className="mt-2 inline-block rounded-full bg-[#FCEBEB] px-3 py-1 text-xs font-medium text-[#E24B4A]">
                  {product.tag}
                </span>
              )}
            </div>

            <p className="leading-7 text-[#5F5E5A]">
              {product.description || "No description available"}
            </p>

            {/* Variants */}
            {Array.isArray(product.variants) && product.variants.length > 0 && (
              <div>
                <p className="mb-3 font-medium text-[#2C2C2A]">
                  Size: {selectedVariant?.name}
                </p>

                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant) => (
                    <Button
                      key={variant.sku}
                      variant="outline"
                      disabled={variant.stock === 0}
                      onClick={() => setSelectedVariant(variant)}
                      className={cn(
                        "rounded-xl border px-5",
                        selectedVariant?.sku === variant.sku
                          ? "border-[#185FA5] bg-[#E6F1FB] text-[#185FA5]"
                          : "border-[#D3D1C7] bg-white",
                      )}
                    >
                      {variant.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Specs */}
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  label: "SKU",
                  value: selectedVariant?.sku || "N/A",
                },
                {
                  label: "Material",
                  value: product.material || "N/A",
                },
                {
                  label: "Fit",
                  value: product.fit || "Standard",
                },
              ].map((item) => (
                <Card
                  key={item.label}
                  className="rounded-2xl border-[#D3D1C7] bg-white"
                >
                  <CardContent className="p-4">
                    <p className="text-xs text-[#888780]">{item.label}</p>
                    <p className="mt-1 font-semibold text-[#2C2C2A]">
                      {item.value}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="grid gap-3 sm:grid-cols-3">
              {["Free Shipping", "Secure Checkout", "Easy Returns"].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-[#D3D1C7] bg-white px-4 py-3 text-sm font-medium text-[#5F5E5A]"
                  >
                    {item}
                  </div>
                ),
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="h-12 flex-1 rounded-xl bg-[#185FA5] text-white hover:bg-[#154f89]"
              >
                {isAdding ? "Adding..." : "Add to Cart"}
              </Button>

              <Button
                variant="outline"
                className="h-12 flex-1 rounded-xl border-[#D3D1C7] bg-white hover:bg-[#F1EFE8]"
              >
                Buy Now
              </Button>
            </div>
          </div>
        </section>

        {recommendedProducts.length > 0 && (
          <section className="mt-16">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-[#185FA5]">
                  Recommended Products
                </p>
                <h2 className="mt-2 text-2xl font-bold text-[#2C2C2A]">
                  You may also like
                </h2>
              </div>

              <Link
                href="/#products"
                className="text-sm font-semibold text-[#185FA5] hover:text-[#154f89]"
              >
                View all products
              </Link>
            </div>

            <div className="product-grid">
              {recommendedProducts.slice(0, 4).map((recommendedProduct) => (
                <ProductCard
                  key={recommendedProduct.slug}
                  product={recommendedProduct}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
