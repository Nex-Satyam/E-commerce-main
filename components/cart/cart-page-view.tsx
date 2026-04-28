"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Loader2,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";
import axios from "axios";

type CartApiItem = {
  id: string;
  userId: string;
  variantId: string;
  quantity: number;
  variant: {
    id: string;
    name?: string;
    sku?: string;
    price: number;
    stock: number;
    product: {
      id: string;
      name: string;
      slug: string;
      description?: string;
      images?: { url: string }[];
    };
  };
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function CartPageView() {
  const [cartItems, setCartItems] = useState<CartApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchCart = async () => {
    try {
      setError("");
      const res = await axios.get("/api/cart");
      setCartItems(res.data.cart || []);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const items = useMemo(() => {
    return cartItems.map((cartItem) => {
      const variant = cartItem.variant;
      const product = variant.product;

      return {
        id: cartItem.id,
        variantId: cartItem.variantId,
        quantity: cartItem.quantity,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        image: product.images?.[0]?.url || "/placeholder.png",
        size: variant.name || "-",
        sku: variant.sku || "-",
        unitPrice: variant.price,
        stock: variant.stock,
        maxQuantity: variant.stock + cartItem.quantity,
        totalPrice: variant.price * cartItem.quantity,
      };
    });
  }, [cartItems]);

  const hasItems = items.length > 0;
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const shipping = hasItems && subtotal < 180 ? 12 : 0;
  const tax = hasItems ? Number((subtotal * 0.08).toFixed(2)) : 0;
  const orderTotal = subtotal + shipping + tax;

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      setUpdatingId(cartItemId);
      setError("");

      await axios.patch("/api/cart", {
        cartItemId,
        quantity,
      });

      await fetchCart();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update cart");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8f4ed] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#31483f]">
          <Loader2 className="animate-spin" />
          <span>Loading your cart...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f4ed] px-5 py-8 text-[#263b34]">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#31483f]/20 px-4 py-2 text-sm hover:bg-white"
        >
          <ArrowLeft size={16} />
          Continue Shopping
        </Link>

        <section className="grid gap-8 lg:grid-cols-[1fr_420px]">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.3em] text-[#7a8b83]">
              Shopping Cart
            </p>

            <h1 className="font-serif text-5xl md:text-7xl">
              Your selected pieces.
            </h1>

            <p className="mt-4 text-lg text-[#7a8b83]">
              Review your items, update quantities, and proceed when your order
              feels right.
            </p>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-600">
                {error}
              </div>
            )}

            <div className="mt-8 space-y-5">
              {hasItems ? (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[28px] border border-[#31483f]/25 bg-[#fffaf3] p-5 shadow-sm"
                  >
                    <div className="grid gap-5 md:grid-cols-[170px_1fr_180px]">
                      <Link href={`/products/${item.slug}`}>
                        <div className="relative aspect-square overflow-hidden rounded-[24px] bg-[#eee5d8]">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </Link>

                      <div className="space-y-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-[#7a8b83]">
                            Product
                          </p>

                          <h2 className="mt-3 text-2xl font-semibold">
                            {item.name}
                          </h2>

                          {item.description && (
                            <p className="mt-2 line-clamp-2 text-[#7a8b83]">
                              {item.description}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-3 text-sm text-[#7a8b83]">
                          <span className="rounded-full bg-white px-3 py-1">
                            Size: {item.size}
                          </span>
                          <span className="rounded-full bg-white px-3 py-1">
                            SKU: {item.sku}
                          </span>
                          <span className="rounded-full bg-white px-3 py-1">
                            Available: {item.stock}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-start justify-between gap-5 md:items-end">
                        <div className="flex items-center rounded-full border border-[#31483f]/25 bg-white p-1">
                          <button
                            type="button"
                            disabled={updatingId === item.id}
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="grid size-10 place-items-center rounded-full hover:bg-[#f0ebe2] disabled:opacity-50"
                          >
                            {item.quantity === 1 ? (
                              <Trash2 size={16} />
                            ) : (
                              <Minus size={16} />
                            )}
                          </button>

                          <span className="min-w-12 text-center font-semibold">
                            {updatingId === item.id ? (
                              <Loader2 className="mx-auto animate-spin" size={18} />
                            ) : (
                              item.quantity
                            )}
                          </span>

                          <button
                            type="button"
                            disabled={
                              updatingId === item.id ||
                              item.quantity >= item.maxQuantity
                            }
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="grid size-10 place-items-center rounded-full hover:bg-[#f0ebe2] disabled:opacity-50"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <div className="text-left md:text-right">
                          <p className="text-sm text-[#7a8b83]">
                            {formatCurrency(item.unitPrice)} each
                          </p>
                          <strong className="text-2xl">
                            {formatCurrency(item.totalPrice)}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[30px] border border-[#31483f]/20 bg-[#fffaf3] p-10 text-center">
                  <ShoppingBag className="mx-auto mb-4 text-[#31483f]" size={44} />
                  <h2 className="text-3xl font-semibold">Your cart is empty.</h2>
                  <p className="mt-3 text-[#7a8b83]">
                    Add a few products to continue checkout.
                  </p>
                  <Link
                    href="/#products"
                    className="mt-6 inline-flex rounded-full bg-[#31483f] px-6 py-3 text-white"
                  >
                    Browse Products
                  </Link>
                </div>
              )}
            </div>
          </div>

          <aside className="h-fit rounded-[30px] border border-[#31483f]/25 bg-[#fffaf3] p-7 shadow-sm lg:sticky lg:top-8">
            <p className="text-xs uppercase tracking-[0.3em] text-[#7a8b83]">
              Order Summary
            </p>

            <h2 className="mt-3 text-2xl font-semibold">
              {hasItems ? "Ready to check out?" : "Your cart is empty"}
            </h2>

            <div className="mt-8 space-y-5 border-b border-[#31483f]/15 pb-6">
              <div className="flex justify-between">
                <span className="text-[#7a8b83]">Subtotal</span>
                <strong>{formatCurrency(subtotal)}</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-[#7a8b83]">Shipping</span>
                <strong>{shipping === 0 ? "Free" : formatCurrency(shipping)}</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-[#7a8b83]">Estimated Tax</span>
                <strong>{formatCurrency(tax)}</strong>
              </div>
            </div>

            <div className="mt-6 flex justify-between text-xl">
              <span>Total</span>
              <strong>{formatCurrency(orderTotal)}</strong>
            </div>

            <Link
              href="/checkout"
              className={`mt-7 flex w-full justify-center rounded-full px-6 py-4 font-semibold ${
                hasItems
                  ? "bg-[#31483f] text-white hover:bg-[#263b34]"
                  : "pointer-events-none bg-[#31483f]/30 text-[#31483f]/50"
              }`}
            >
              Proceed to Checkout
            </Link>

            <div className="mt-6 space-y-3 text-sm text-[#7a8b83]">
              <p className="flex items-center gap-2">
                <Truck size={16} /> Free delivery above ₹180
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck size={16} /> Secure checkout protected end to end
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}