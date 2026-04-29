"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Clock3,
  Loader2,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";
import { Card, CardContent } from "@/components/ui/card";
import { CtaButton } from "@/components/home/cta-button";

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

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (
      error as { response?: { data?: { error?: unknown } } }
    ).response;

    if (typeof response?.data?.error === "string") {
      return response.data.error;
    }
  }

  if (error instanceof Error) return error.message;

  return fallback;
}

export default function CartPageView() {
  const { refreshCart } = useCart();
  const [cartItems, setCartItems] = useState<CartApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchCart = useCallback(async () => {
    try {
      setError("");
      const res = await axios.get("/api/cart");
      setCartItems(res.data.cart || []);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load cart"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      await fetchCart();
    };

    void loadCart();
  }, [fetchCart]);

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
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const freeShippingThreshold = 180;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shipping = hasItems && subtotal < freeShippingThreshold ? 12 : 0;
  const tax = hasItems ? Number((subtotal * 0.08).toFixed(2)) : 0;
  const orderTotal = subtotal + shipping + tax;
  const freeShippingProgress = hasItems
    ? Math.min(100, (subtotal / freeShippingThreshold) * 100)
    : 0;

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      setUpdatingId(cartItemId);
      setError("");

      await axios.patch("/api/cart", {
        cartItemId,
        quantity,
      });

      await fetchCart();
      await refreshCart();
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to update cart"));
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <main className="cart-page cart-page-loading">
        <Card className="cart-loading-card py-0 shadow-none">
          <CardContent className="cart-loading-content">
            <Loader2 className="animate-spin" />
            <span>Loading your cart...</span>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-breadcrumb">
        <Link href="/" className="cart-back-link">
          <ArrowLeft size={16} />
          Continue Shopping
        </Link>
        <span>/</span>
        <strong>Cart</strong>
      </div>

      <section className="cart-hero">
        <div>
          <p className="eyebrow">Shopping Cart</p>
          <h1>Your selected pieces.</h1>
          <p>
            Review quantities, confirm availability, and move into checkout
            when everything looks right.
          </p>
        </div>

        <div className="cart-hero-panel">
          <span>
            <ShoppingBag className="size-4" />
            {itemCount} item(s)
          </span>
          <span>
            <ShieldCheck className="size-4" />
            Secure checkout
          </span>
        </div>
      </section>

      <section className="cart-trust-strip">
        <span>
          <Truck className="size-4" />
          Free delivery above {formatCurrency(freeShippingThreshold)}
        </span>
        <span>
          <PackageCheck className="size-4" />
          Quality checked before dispatch
        </span>
        <span>
          <Clock3 className="size-4" />
          Fast packing on eligible orders
        </span>
      </section>

      <section className="cart-layout">
        <div className="cart-main">
          {error && <div className="cart-error-box">{error}</div>}

          {hasItems && (
            <div className="cart-progress-card">
              <div>
                <p className="font-semibold">
                  {amountToFreeShipping === 0
                    ? "You unlocked free delivery."
                    : `${formatCurrency(amountToFreeShipping)} away from free delivery.`}
                </p>
                <span>Cart value updates automatically with quantity changes.</span>
              </div>
              <div className="cart-progress-track">
                <div style={{ width: `${freeShippingProgress}%` }} />
              </div>
            </div>
          )}

          <div className="cart-item-list">
            {hasItems ? (
              items.map((item) => (
                <Card key={item.id} className="cart-item-card py-0 shadow-none">
                  <CardContent className="cart-item-content">
                    <Link
                      href={`/products/${item.slug}`}
                      className="cart-item-image-link"
                    >
                      <div className="cart-item-image-wrap">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="180px"
                          className="cart-item-image"
                        />
                        <div className="cart-item-image-overlay">
                          View <ArrowRight className="size-4" />
                        </div>
                      </div>
                    </Link>

                    <div className="cart-item-copy">
                      <div className="cart-item-info">
                        <p className="cart-item-tag">Product</p>
                        <h2>{item.name}</h2>
                        {item.description && <p>{item.description}</p>}
                      </div>

                      <div className="cart-item-variants">
                        <span>Variant: {item.size}</span>
                        <span>SKU: {item.sku}</span>
                        <span>Available: {item.stock}</span>
                      </div>

                      <div className="cart-item-mobile-price">
                        <span>{formatCurrency(item.unitPrice)} each</span>
                        <strong>{formatCurrency(item.totalPrice)}</strong>
                      </div>
                    </div>

                    <div className="cart-item-actions">
                      <div className="cart-quantity-control">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          disabled={updatingId === item.id}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label={
                            item.quantity === 1
                              ? `Remove ${item.name}`
                              : `Decrease ${item.name} quantity`
                          }
                        >
                          {item.quantity === 1 ? (
                            <Trash2 size={16} />
                          ) : (
                            <Minus size={16} />
                          )}
                        </Button>

                        <span>
                          {updatingId === item.id ? (
                            <Loader2 className="mx-auto animate-spin" size={18} />
                          ) : (
                            item.quantity
                          )}
                        </span>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          disabled={
                            updatingId === item.id ||
                            item.quantity >= item.maxQuantity
                          }
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          <Plus size={16} />
                        </Button>
                      </div>

                      <div className="cart-price-block">
                        <span>{formatCurrency(item.unitPrice)} each</span>
                        <strong>{formatCurrency(item.totalPrice)}</strong>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="cart-empty-card py-0 shadow-none">
                <CardContent className="cart-empty-content">
                  <div className="cart-empty-icon">
                    <ShoppingBag size={34} />
                  </div>
                  <p className="eyebrow">Cart Empty</p>
                  <h2>Your cart is empty.</h2>
                  <p>Add a few products to continue checkout.</p>
                  <CtaButton asChild className="cart-empty-button">
                    <Link href="/#products">Browse Products</Link>
                  </CtaButton>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <aside className="cart-summary">
          <Card className="cart-summary-card py-0 shadow-none">
            <CardContent className="cart-summary-content">
              <div className="cart-summary-hero">
                <div>
                  <span>Order Summary</span>
                  <h2>{hasItems ? "Ready to check out?" : "Your cart is empty"}</h2>
                </div>
                <BadgeCheck className="size-5" />
              </div>

              <div className="cart-summary-lines">
                <div>
                  <span>Subtotal</span>
                  <strong>{formatCurrency(subtotal)}</strong>
                </div>
                <div>
                  <span>Shipping</span>
                  <strong>{shipping === 0 ? "Free" : formatCurrency(shipping)}</strong>
                </div>
                <div>
                  <span>Estimated Tax</span>
                  <strong>{formatCurrency(tax)}</strong>
                </div>
              </div>

              <div className="cart-summary-total">
                <span>Total</span>
                <strong>{formatCurrency(orderTotal)}</strong>
              </div>

              <Link
                href="/checkout"
                className={`cart-summary-button ${
                  hasItems ? "" : "is-disabled"
                }`}
              >
                Proceed to Checkout
              </Link>

              <div className="cart-summary-timeline">
                {["Cart review", "Secure checkout", "Order dispatch"].map(
                  (item, index) => (
                    <span key={item}>
                      <b>{index + 1}</b>
                      {item}
                    </span>
                  )
                )}
              </div>

              <div className="cart-summary-notes">
                <span>
                  <Truck size={16} /> Free delivery above{" "}
                  {formatCurrency(freeShippingThreshold)}
                </span>
                <span>
                  <ShieldCheck size={16} /> Secure checkout protected end to end
                </span>
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  );
}
