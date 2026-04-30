"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useCart } from "@/components/cart/cart-provider";
import { useToast } from "@/components/ui/toast-context";
import { useWishlist } from "@/components/wishlist/wishlist-provider";
import { queryKeys } from "@/lib/query-keys";
import {
  ArrowLeft,
  ArrowRight,
  BadgePercent,
  BadgeCheck,
  ChevronRight,
  Expand,
  Heart,
  Info,
  Layers3,
  Loader2,
  Minus,
  PackageCheck,
  Plus,
  RotateCcw,
  Ruler,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Tag,
  Truck,
} from "lucide-react";
import { CtaButton } from "@/components/home/cta-button";
import type { ProductItem, ProductVariant } from "@/components/home/home-data";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type ProductImage = string | { url?: string | null };
type ProductCategory = string | { name?: string | null };
type ProductDetailProduct = Omit<
  ProductItem,
  "category" | "images" | "variants"
> & {
  category?: ProductCategory;
  images?: ProductImage[];
  variants?: ProductVariant[];
};

type ProductDetailViewProps = {
  product: ProductDetailProduct;
};

function getImageUrl(image?: ProductImage) {
  if (typeof image === "string") return image;
  return image?.url || "/placeholder.png";
}

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (
      error as { response?: { data?: { error?: unknown } } }
    ).response;

    if (typeof response?.data?.error === "string") {
      return response.data.error;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
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
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    variants.length > 0 ? variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const { showToast } = useToast();
  const { refreshCart } = useCart();
  const { refreshWishlistCount } = useWishlist();
  const queryClient = useQueryClient();
  const router = useRouter();

  const variant = selectedVariant;
  const maxQuantity = variant?.stock || 0;
  const activeImageUrl = getImageUrl(images[activeImageIndex]);
  const imageCount = images.length;
  const reviewCount = product.reviews?.length || 0;
  const details = Array.isArray(product.details) ? product.details : [];
  const galleryProgress =
    imageCount > 0 ? ((activeImageIndex + 1) / imageCount) * 100 : 100;
  const stockTone =
    maxQuantity <= 0
      ? "Sold out"
      : maxQuantity <= 5
        ? "Low stock"
        : "Ready to ship";
  const expectedDelivery = "2-4 days";

  const quantityOptions = useMemo(() => {
    return Array.from({ length: maxQuantity }, (_, i) => i + 1);
  }, [maxQuantity]);

  const categoryName: string =
    typeof product.category === "object" && product.category
      ? product.category.name || ""
      : product.category || "";

  const productSpecs = [
    {
      icon: Ruler,
      label: "Fit",
      value: product.fit || "Relaxed modern fit",
    },
    {
      icon: Layers3,
      label: "Material",
      value: product.material || "Premium hand-feel fabric",
    },
    {
      icon: Tag,
      label: "SKU",
      value: variant?.sku || product.sku || "N/A",
    },
  ];

  const wishlistStateQuery = useQuery({
    queryKey: queryKeys.product.wishlistState(product.id),
    queryFn: async () => {
      const res = await api.get(`/wishlist?productId=${product.id}`);
      return Boolean(res.data?.wishlisted);
    },
    enabled: Boolean(product?.id),
    placeholderData: false,
  });

  const wishlistMutation = useMutation({
    mutationFn: async () => {
      const res = await api.patch("/wishlist", {
        productId: product.id,
      });
      return res.data as { wishlisted?: boolean; message?: string };
    },
    onSuccess: (data) => {
      const nextWishlisted = Boolean(data.wishlisted);
      queryClient.setQueryData(
        queryKeys.product.wishlistState(product.id),
        nextWishlisted
      );
      refreshWishlistCount();
      showToast(
        data.message ||
          (nextWishlisted ? "Added to wishlist" : "Removed from wishlist"),
        "success"
      );
    },
    onError: (err: unknown) => {
      showToast(getErrorMessage(err, "Wishlist action failed"), "error");
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: async (selectedVariant: ProductVariant) => {
      await api.post("/cart", {
        variantId: selectedVariant.id,
        quantity,
      });
    },
    onSuccess: async () => {
      await refreshCart();
    },
  });

  const isAdding = addToCartMutation.isPending;
  const isBuying = addToCartMutation.isPending;

  const handleVariantChange = (item: ProductVariant) => {
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

    wishlistMutation.mutate();
  };

  const validateCartSelection = (
    selectedVariant: ProductVariant | null
  ): selectedVariant is ProductVariant => {
    if (!selectedVariant?.id) {
      showToast("Please select a variant", "error");
      return false;
    }

    if (maxQuantity <= 0) {
      showToast("This product is out of stock", "error");
      return false;
    }

    if (quantity > maxQuantity) {
      showToast(`Only ${maxQuantity} items available`, "error");
      return false;
    }

    return true;
  };

  const addSelectedProductToCart = async (selectedVariant: ProductVariant) => {
    await addToCartMutation.mutateAsync(selectedVariant);
  };

  const handleAddToCart = async () => {
    if (!validateCartSelection(variant)) return;

    try {
      await addSelectedProductToCart(variant);
      showToast(`${product.name} added to cart`, "success");
    } catch (err: unknown) {
      showToast(
        getErrorMessage(err, "Failed to add to cart"),
        "error"
      );
    }
  };

  const handleBuyNow = async () => {
    if (!validateCartSelection(variant)) return;

    try {
      await addSelectedProductToCart(variant);
      showToast(`${product.name} added to cart`, "success");
      router.push("/cart");
    } catch (err: unknown) {
      showToast(
        getErrorMessage(err, "Failed to add to cart"),
        "error"
      );
    }
  };

  return (
    <>
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
            <Link href="/" className="hover:text-black">
              Home
            </Link>
            <span>/</span>
            <Link href="/#products" className="hover:text-black">
              Products
            </Link>
            <span>/</span>
            <strong className="text-black">{product.name}</strong>
          </div>

          <Link
            href="/#products"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-neutral-50"
          >
            <ArrowLeft size={16} />
            Back to collection
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-5">
            <div className="overflow-hidden rounded-[32px] border border-neutral-200 bg-white shadow-[0_30px_90px_rgba(0,0,0,0.1)]">
              <div
                className={cn(
                  "grid gap-0",
                  imageCount > 1 && "xl:grid-cols-[92px_1fr]"
                )}
              >
                {imageCount > 1 && (
                  <div className="order-2 grid grid-cols-4 gap-3 border-t border-neutral-200 bg-neutral-50 p-3 xl:order-1 xl:grid-cols-1 xl:border-r xl:border-t-0">
                    {images.map((image, index) => (
                      <button
                        key={`${product.slug}-${index}`}
                        type="button"
                        onClick={() => setActiveImageIndex(index)}
                        className={cn(
                          "relative aspect-square overflow-hidden rounded-2xl border bg-white transition-all duration-200 hover:-translate-y-0.5",
                          index === activeImageIndex
                            ? "border-black shadow-[0_12px_26px_rgba(0,0,0,0.16)]"
                            : "border-neutral-200 opacity-70 hover:opacity-100"
                        )}
                      >
                        <Image
                          src={getImageUrl(image)}
                          alt={`${product.name} image ${index + 1}`}
                          fill
                          sizes="92px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                <div className="relative order-1 overflow-hidden bg-neutral-100 xl:order-2">
                  <div className="absolute left-5 top-5 z-20 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-black shadow-sm backdrop-blur">
                      <Sparkles size={14} />
                      {categoryName || "Premium"}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-sm">
                      {stockTone}
                    </span>
                  </div>

                  <div className="absolute right-5 top-5 z-20 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPreviewOpen(true)}
                      className="grid size-11 place-items-center rounded-full bg-white/90 text-black shadow-sm backdrop-blur transition-all hover:scale-105 hover:bg-white"
                      aria-label="Open image preview"
                    >
                      <Expand size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={handleToggleWishlist}
                      disabled={wishlistMutation.isPending}
                      className={cn(
                        "grid size-11 place-items-center rounded-full shadow-sm backdrop-blur transition-all hover:scale-105 disabled:opacity-60",
                        wishlistStateQuery.data
                          ? "bg-black text-white"
                          : "bg-white/90 text-black hover:bg-white"
                      )}
                      aria-label="Toggle wishlist"
                    >
                      {wishlistMutation.isPending ? (
                        <Loader2 size={19} className="animate-spin" />
                      ) : (
                        <Heart
                          size={19}
                          className={wishlistStateQuery.data ? "fill-white" : ""}
                        />
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPreviewOpen(true)}
                    className="group relative block aspect-[4/5] w-full md:aspect-[5/5]"
                    aria-label="Preview product image"
                  >
                    <Image
                      src={activeImageUrl}
                      alt={product.name}
                      fill
                      priority
                      sizes="(max-width: 900px) 100vw, 58vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                    />
                    <span className="absolute inset-x-5 bottom-20 z-10 flex translate-y-2 items-center justify-between rounded-full border border-white/70 bg-white/80 px-4 py-3 text-sm font-semibold opacity-0 shadow-lg backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      View larger
                      <Expand size={16} />
                    </span>
                  </button>

                  {imageCount > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={goToPrevious}
                        className="absolute left-5 top-1/2 z-20 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-md backdrop-blur transition hover:bg-black hover:text-white"
                        aria-label="Previous image"
                      >
                        <ArrowLeft size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={goToNext}
                        className="absolute right-5 top-1/2 z-20 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-md backdrop-blur transition hover:bg-black hover:text-white"
                        aria-label="Next image"
                      >
                        <ArrowRight size={18} />
                      </button>

                      <div className="absolute bottom-5 left-5 right-5 z-20 rounded-2xl border border-white/60 bg-white/80 p-4 shadow-lg backdrop-blur">
                        <div className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
                          <span>
                            Image {activeImageIndex + 1} of {imageCount}
                          </span>
                          <span>{Math.round(galleryProgress)}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-neutral-200">
                          <div
                            className="h-full rounded-full bg-black transition-all duration-300"
                            style={{ width: `${galleryProgress}%` }}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  icon: Truck,
                  title: "Fast Delivery",
                  copy: `Ships in ${expectedDelivery}`,
                },
                {
                  icon: RotateCcw,
                  title: "Easy Returns",
                  copy: "7 day return window",
                },
                {
                  icon: ShieldCheck,
                  title: "Secure Checkout",
                  copy: "Protected payment",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="group rounded-[24px] border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-black hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)]"
                  >
                    <div className="mb-4 grid size-11 place-items-center rounded-full bg-neutral-100 transition group-hover:bg-black group-hover:text-white">
                      <Icon size={20} />
                    </div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="mt-1 text-sm text-neutral-500">{item.copy}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="h-fit rounded-[34px] border border-neutral-200 bg-white p-6 shadow-[0_30px_90px_rgba(0,0,0,0.08)] md:p-8 lg:sticky lg:top-6">
            <div className="flex flex-wrap items-center gap-2">
              <p className="rounded-full bg-neutral-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-neutral-600">
                {categoryName || "Product"}
              </p>
              <span className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white">
                <BadgePercent size={14} />
                Inclusive tax
              </span>
            </div>

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
                        ? "fill-black text-black"
                        : "text-black/20"
                    )}
                  />
                ))}
              </div>

              <span className="text-sm text-neutral-500">
                {reviewCount} reviews
              </span>
            </div>

            <div className="mt-7 overflow-hidden rounded-[28px] border border-neutral-200 bg-white">
              <div className="bg-black p-5 text-white">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-white/70">Current price</span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-black">
                    {stockTone}
                  </span>
                </div>
                <strong className="mt-2 block text-5xl leading-none">
                  {formatPrice(variant?.price)}
                </strong>
              </div>

              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="p-5">
                  <p className="flex items-center gap-2 text-sm text-neutral-500">
                    <Info size={15} />
                    Price includes all taxes and selected variant pricing.
                  </p>
                </div>

                {maxQuantity > 0 ? (
                  <span className="m-5 inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-black">
                    <BadgeCheck size={16} />
                    In stock
                  </span>
                ) : (
                  <span className="m-5 rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-black">
                    Out of stock
                  </span>
                )}
              </div>
            </div>

            <p className="mt-6 leading-7 text-neutral-500">
              {product.description || "No description available."}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {productSpecs.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="rounded-3xl border border-neutral-200 bg-neutral-50 p-4"
                  >
                    <Icon className="mb-3" size={19} />
                    <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                      {item.label}
                    </p>
                    <strong className="mt-1 block text-sm leading-5">
                      {item.value}
                    </strong>
                  </div>
                );
              })}
            </div>

            <div className="mt-7">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-semibold">
                  Select Variant: {variant?.name || "N/A"}
                </span>
                <span className="text-sm text-neutral-500">
                  {maxQuantity} left
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                {variants.length > 0 ? (
                  variants.map((item) => (
                    <Button
                      key={item.id || item.sku}
                      type="button"
                      variant="outline"
                      disabled={item.stock === 0}
                      onClick={() => handleVariantChange(item)}
                      className={cn(
                        "h-12 rounded-full border-neutral-200 bg-white px-6 hover:bg-black hover:text-white",
                        variant?.id === item.id &&
                          "bg-black text-white shadow-lg"
                      )}
                    >
                      {item.name}
                    </Button>
                  ))
                ) : (
                  <span className="text-sm text-black">
                    No variants available
                  </span>
                )}
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-neutral-200 bg-white p-4">
                <p className="text-xs text-neutral-500">SKU</p>
                <strong className="mt-1 block truncate">
                  {variant?.sku || "N/A"}
                </strong>
              </div>

              <div className="rounded-3xl border border-neutral-200 bg-white p-4">
                <p className="text-xs text-neutral-500">Stock</p>
                <strong className="mt-1 block">{maxQuantity}</strong>
              </div>

              <div className="rounded-3xl border border-neutral-200 bg-white p-4">
                <p className="text-xs text-neutral-500">Status</p>
                <strong className="mt-1 block">
                  {maxQuantity > 0 ? "Available" : "Sold out"}
                </strong>
              </div>
            </div>

            <div className="mt-7">
              <label className="mb-3 block font-semibold">Quantity</label>

              <div className="inline-flex items-center rounded-full border border-neutral-200 bg-white p-1 shadow-sm">
                <button
                  type="button"
                  disabled={quantity <= 1 || maxQuantity <= 0}
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="grid size-12 place-items-center rounded-full hover:bg-neutral-100 disabled:opacity-40"
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
                  className="grid size-12 place-items-center rounded-full hover:bg-neutral-100 disabled:opacity-40"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="mt-7 rounded-[26px] border border-neutral-200 bg-neutral-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Delivery estimate</p>
                  <p className="mt-1 text-sm text-neutral-500">
                    Enter pincode during checkout for precise courier timing.
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold">
                  <Truck size={16} />
                  {expectedDelivery}
                </span>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <CtaButton
                onClick={handleAddToCart}
                disabled={isAdding || isBuying || !variant || maxQuantity <= 0}
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

              <CtaButton
                tone="light"
                onClick={handleBuyNow}
                disabled={isAdding || isBuying || !variant || maxQuantity <= 0}
              >
                <span className="flex items-center justify-center gap-2">
                  {isBuying ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Buy Now"
                  )}
                </span>
              </CtaButton>
            </div>

            <div className="mt-7 space-y-3 rounded-[28px] bg-black p-5 text-white">
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

        <section className="mt-10 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[32px] border border-neutral-200 bg-white p-6 shadow-[0_20px_70px_rgba(0,0,0,0.06)] md:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-neutral-500">
                  Product story
                </p>
                <h2 className="mt-2 font-serif text-4xl leading-none md:text-5xl">
                  Designed for repeat wear.
                </h2>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-sm font-semibold">
                <Sparkles size={16} />
                Atelier edit
              </span>
            </div>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-600">
              {product.longDescription ||
                product.description ||
                "A refined everyday piece with clean proportions, modern finishing, and an easy wardrobe presence."}
            </p>

            {details.length > 0 && (
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {details.slice(0, 6).map((detail) => (
                  <div
                    key={detail}
                    className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
                  >
                    <BadgeCheck className="mt-0.5 shrink-0" size={17} />
                    <span className="text-sm leading-6 text-neutral-700">
                      {detail}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[32px] border border-neutral-200 bg-black p-6 text-white shadow-[0_20px_70px_rgba(0,0,0,0.14)] md:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/55">
              Realistic checkout support
            </p>
            <h2 className="mt-2 font-serif text-4xl leading-none">
              What happens after you buy?
            </h2>

            <div className="mt-7 grid gap-3">
              {[
                "Order is confirmed and reserved against selected stock.",
                "Product is quality checked, packed, and handed to courier.",
                "Tracking updates appear after dispatch from the store.",
              ].map((item, index) => (
                <div
                  key={item}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4"
                >
                  <span className="grid size-9 place-items-center rounded-full bg-white text-sm font-bold text-black">
                    {index + 1}
                  </span>
                  <span className="text-sm leading-6 text-white/80">{item}</span>
                  <ChevronRight size={17} className="text-white/50" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>

    <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
      <DialogContent className="max-w-5xl border-neutral-200 bg-white p-3" showCloseButton>
        <DialogTitle className="sr-only">{product.name} image preview</DialogTitle>
        <div className="relative aspect-[4/5] max-h-[82vh] overflow-hidden rounded-2xl bg-neutral-100 md:aspect-[16/10]">
          <Image
            src={activeImageUrl}
            alt={product.name}
            fill
            sizes="90vw"
            className="object-contain"
          />
        </div>
        {imageCount > 1 && (
          <div className="flex items-center justify-between gap-3 px-1">
            <Button
              type="button"
              variant="outline"
              onClick={goToPrevious}
              className="rounded-full"
            >
              <ArrowLeft size={16} />
              Previous
            </Button>
            <span className="text-sm font-semibold text-neutral-500">
              {activeImageIndex + 1} / {imageCount}
            </span>
            <Button
              type="button"
              variant="outline"
              onClick={goToNext}
              className="rounded-full"
            >
              Next
              <ArrowRight size={16} />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
    </>
  );
}
  
