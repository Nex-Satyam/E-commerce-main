"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import api from "@/lib/axios";
import { useCart } from "@/components/cart/cart-provider";
import { useToast } from "@/components/ui/toast-context";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Heart,
  Loader2,
  Minus,
  PackageCheck,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import { CtaButton } from "@/components/home/cta-button";
import { ProductItem } from "@/components/home/home-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProductDetailViewProps = {
  product: ProductItem;
};

function getImageUrl(image: any) {
  if (typeof image === "string") return image;
  return image?.url || "/placeholder.png";
}

function formatPrice(price?: number) {
  if (!price) return "N/A";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price / 100);
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const images = Array.isArray(product.images) ? product.images : [];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(
    variants.length > 0 ? variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const { showToast } = useToast();
  const { addToCart } = useCart();

  const variant = selectedVariant;
  const maxQuantity = variant?.stock || 0;
  const activeImageUrl = getImageUrl(images[activeImageIndex]);

  const quantityOptions = useMemo(() => {
    return Array.from({ length: maxQuantity }, (_, i) => i + 1);
  }, [maxQuantity]);

  const categoryName =
    typeof product.category === "object" && product.category
      ? (product.category as any).name
      : product.category;

  useEffect(() => {
    const checkWishlist = async () => {
      if (!product?.id) return;

      try {
        const res = await api.get(`/wishlist?productId=${product.id}`);
        setIsWishlisted(Boolean(res.data.wishlisted));
      } catch (err) {
        console.log("Wishlist check failed:", err);
      }
    };

    checkWishlist();
  }, [product?.id]);

  const handleVariantChange = (item: any) => {
    setSelectedVariant(item);
    setQuantity(1);
  };

  const goToPrevious = () => {
    if (images.length <= 1) return;

    setActiveImageIndex((index) =>
      index === 0 ? images.length - 1 : index - 1
    );
  };

  const goToNext = () => {
    if (images.length <= 1) return;

    setActiveImageIndex((index) => (index + 1) % images.length);
  };

  const handleToggleWishlist = async () => {
    if (!product?.id) {
      showToast("Product id missing", "error");
      return;
    }

    setWishlistLoading(true);

    try {
      const res = await api.patch("/wishlist", {
        productId: product.id,
      });

      setIsWishlisted(Boolean(res.data.wishlisted));

      showToast(
        res.data.message ||
          (res.data.wishlisted
            ? "Added to wishlist"
            : "Removed from wishlist"),
        "success"
      );
    } catch (err: any) {
      showToast(
        err.response?.data?.error || "Wishlist action failed",
        "error"
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!variant?.id) {
      showToast("Please select a variant", "error");
      return;
    }

    if (maxQuantity <= 0) {
      showToast("This product is out of stock", "error");
      return;
    }

    if (quantity > maxQuantity) {
      showToast(`Only ${maxQuantity} items available`, "error");
      return;
    }

    setIsAdding(true);

    try {
      await api.post("/cart", {
        variantId: variant.id,
        quantity,
      });

      addToCart({
        productSlug: product.slug,
        size: variant.name || "",
        color: "",
        quantity,
      });

      showToast(`${product.name} added to cart`, "success");
    } catch (err: any) {
      showToast(
        err.response?.data?.error || err.message || "Failed to add to cart",
        "error"
      );
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f4ed] text-[#253a33]">
      <section className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-[#7a8b83]">
            <Link href="/" className="hover:text-[#253a33]">
              Home
            </Link>
            <span>/</span>
            <Link href="/#products" className="hover:text-[#253a33]">
              Products
            </Link>
            <span>/</span>
            <strong className="text-[#253a33]">{product.name}</strong>
          </div>

          <Link
            href="/#products"
            className="inline-flex items-center gap-2 rounded-full border border-[#253a33]/15 bg-white/70 px-4 py-2 text-sm shadow-sm hover:bg-white"
          >
            <ArrowLeft size={16} />
            Back to collection
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-[38px] border border-[#253a33]/15 bg-[#eee5d8] shadow-[0_30px_80px_rgba(37,58,51,0.16)]">
              <div className="absolute left-5 top-5 z-10 rounded-full bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#253a33] backdrop-blur">
                {categoryName || "Premium"}
              </div>

              <button
                type="button"
                onClick={handleToggleWishlist}
                disabled={wishlistLoading}
                className={cn(
                  "absolute right-5 top-5 z-10 grid size-11 place-items-center rounded-full shadow-sm backdrop-blur transition-all hover:scale-105 disabled:opacity-60",
                  isWishlisted
                    ? "bg-red-50 text-red-600"
                    : "bg-white/85 text-[#253a33] hover:bg-white"
                )}
              >
                {wishlistLoading ? (
                  <Loader2 size={19} className="animate-spin" />
                ) : (
                  <Heart
                    size={19}
                    className={isWishlisted ? "fill-red-600" : ""}
                  />
                )}
              </button>

              <div className="relative aspect-[4/5] md:aspect-[5/5]">
                <Image
                  src={activeImageUrl}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 52vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goToPrevious}
                    className="absolute left-5 top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/85 shadow-md backdrop-blur hover:bg-white"
                  >
                    <ArrowLeft size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={goToNext}
                    className="absolute right-5 top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/85 shadow-md backdrop-blur hover:bg-white"
                  >
                    <ArrowRight size={18} />
                  </button>

                  <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-full bg-white/80 px-4 py-2 backdrop-blur">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setActiveImageIndex(index)}
                        className={cn(
                          "h-2.5 rounded-full transition-all",
                          index === activeImageIndex
                            ? "w-8 bg-[#253a33]"
                            : "w-2.5 bg-[#253a33]/25"
                        )}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                {images.map((image, index) => (
                  <button
                    key={`${product.slug}-${index}`}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    className={cn(
                      "relative aspect-square overflow-hidden rounded-3xl border bg-[#eee5d8] transition-all hover:-translate-y-1",
                      index === activeImageIndex
                        ? "border-[#253a33] shadow-lg"
                        : "border-[#253a33]/10"
                    )}
                  >
                    <Image
                      src={getImageUrl(image)}
                      alt={`${product.name} image ${index + 1}`}
                      fill
                      sizes="140px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl bg-white/70 p-5 shadow-sm">
                <Truck className="mb-3" size={22} />
                <p className="font-semibold">Fast Delivery</p>
                <p className="mt-1 text-sm text-[#7a8b83]">
                  Ships in 2-4 days
                </p>
              </div>

              <div className="rounded-3xl bg-white/70 p-5 shadow-sm">
                <RotateCcw className="mb-3" size={22} />
                <p className="font-semibold">Easy Returns</p>
                <p className="mt-1 text-sm text-[#7a8b83]">
                  7 day return window
                </p>
              </div>

              <div className="rounded-3xl bg-white/70 p-5 shadow-sm">
                <ShieldCheck className="mb-3" size={22} />
                <p className="font-semibold">Secure Checkout</p>
                <p className="mt-1 text-sm text-[#7a8b83]">
                  Protected payment
                </p>
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-[38px] border border-[#253a33]/15 bg-[#fffaf3] p-6 shadow-[0_30px_90px_rgba(37,58,51,0.12)] md:p-8 lg:sticky lg:top-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[#7a8b83]">
              {categoryName || "Product"}
            </p>

            <h1 className="mt-3 font-serif text-5xl leading-[0.95] md:text-6xl">
              {product.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={18}
                    className={cn(
                      index < 4
                        ? "fill-[#253a33] text-[#253a33]"
                        : "text-[#253a33]/20"
                    )}
                  />
                ))}
              </div>

              <span className="text-sm text-[#7a8b83]">
                {product.reviews?.length || 0} reviews
              </span>
            </div>

            <div className="mt-7 rounded-[28px] border border-[#253a33]/10 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-[#7a8b83]">Price</p>
                  <strong className="mt-1 block text-4xl">
                    {formatPrice(variant?.price)}
                  </strong>
                  <p className="mt-2 text-sm text-[#7a8b83]">
                    Inclusive of all taxes
                  </p>
                </div>

                {maxQuantity > 0 ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
                    <BadgeCheck size={16} />
                    In stock
                  </span>
                ) : (
                  <span className="rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-600">
                    Out of stock
                  </span>
                )}
              </div>
            </div>

            <p className="mt-6 leading-7 text-[#7a8b83]">
              {product.description || "No description available."}
            </p>

            <div className="mt-7">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-semibold">
                  Select Variant: {variant?.name || "N/A"}
                </span>
                <span className="text-sm text-[#7a8b83]">
                  {maxQuantity} left
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                {variants.length > 0 ? (
                  variants.map((item: any) => (
                    <Button
                      key={item.id || item.sku}
                      type="button"
                      variant="outline"
                      disabled={item.stock === 0}
                      onClick={() => handleVariantChange(item)}
                      className={cn(
                        "h-12 rounded-full border-[#253a33]/20 bg-white px-6 hover:bg-[#253a33] hover:text-white",
                        variant?.id === item.id &&
                          "bg-[#253a33] text-white shadow-lg"
                      )}
                    >
                      {item.name}
                    </Button>
                  ))
                ) : (
                  <span className="text-sm text-red-600">
                    No variants available
                  </span>
                )}
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-[#253a33]/10 bg-white p-4">
                <p className="text-xs text-[#7a8b83]">SKU</p>
                <strong className="mt-1 block truncate">
                  {variant?.sku || "N/A"}
                </strong>
              </div>

              <div className="rounded-3xl border border-[#253a33]/10 bg-white p-4">
                <p className="text-xs text-[#7a8b83]">Stock</p>
                <strong className="mt-1 block">{maxQuantity}</strong>
              </div>

              <div className="rounded-3xl border border-[#253a33]/10 bg-white p-4">
                <p className="text-xs text-[#7a8b83]">Status</p>
                <strong className="mt-1 block">
                  {maxQuantity > 0 ? "Available" : "Sold out"}
                </strong>
              </div>
            </div>

            <div className="mt-7">
              <label className="mb-3 block font-semibold">Quantity</label>

              <div className="inline-flex items-center rounded-full border border-[#253a33]/15 bg-white p-1 shadow-sm">
                <button
                  type="button"
                  disabled={quantity <= 1 || maxQuantity <= 0}
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="grid size-12 place-items-center rounded-full hover:bg-[#f0ebe2] disabled:opacity-40"
                >
                  <Minus size={16} />
                </button>

                <select
                  value={quantity}
                  disabled={maxQuantity <= 0}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="min-w-16 bg-transparent text-center font-semibold outline-none"
                >
                  {quantityOptions.length > 0 ? (
                    quantityOptions.map((q) => (
                      <option key={q} value={q}>
                        {q}
                      </option>
                    ))
                  ) : (
                    <option value={1}>0</option>
                  )}
                </select>

                <button
                  type="button"
                  disabled={quantity >= maxQuantity || maxQuantity <= 0}
                  onClick={() =>
                    setQuantity((prev) => Math.min(maxQuantity, prev + 1))
                  }
                  className="grid size-12 place-items-center rounded-full hover:bg-[#f0ebe2] disabled:opacity-40"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <CtaButton
                onClick={handleAddToCart}
                disabled={isAdding || !variant || maxQuantity <= 0}
              >
                <span className="flex items-center justify-center gap-2">
                  {isAdding ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Adding...
                    </>
                  ) : maxQuantity <= 0 ? (
                    "Out of Stock"
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      Add to Cart
                    </>
                  )}
                </span>
              </CtaButton>

              <CtaButton tone="light">Buy Now</CtaButton>
            </div>

            <div className="mt-7 space-y-3 rounded-[28px] bg-[#253a33] p-5 text-white">
              <p className="flex items-center gap-3 text-sm">
                <PackageCheck size={18} />
                Genuine product quality checked before shipping
              </p>
              <p className="flex items-center gap-3 text-sm">
                <Truck size={18} />
                Free delivery on eligible orders
              </p>
              <p className="flex items-center gap-3 text-sm">
                <ShieldCheck size={18} />
                Secure payments and protected checkout
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}