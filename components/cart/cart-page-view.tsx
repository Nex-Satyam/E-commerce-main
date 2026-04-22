"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ShieldCheck, Truck } from "lucide-react";

import { CtaButton } from "@/components/home/cta-button";
import { cartItems, getProductBySlug } from "@/components/home/home-data";
import { Card, CardContent } from "@/components/ui/card";

const quantityOptions = [0, 1, 2, 3, 4, 5];

function parsePrice(price: string) {
  return Number(price.replace(/[^\d.]/g, ""));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function CartPageView() {
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(cartItems.map((item) => [item.productSlug, item.quantity])),
  );

  const items = useMemo(() => {
    return cartItems
      .map((item) => {
        const product = getProductBySlug(item.productSlug);

        if (!product) {
          return null;
        }

        const quantity = quantities[item.productSlug] ?? item.quantity;

        if (quantity <= 0) {
          return null;
        }

        const unitPrice = parsePrice(product.price);

        return {
          ...item,
          product,
          quantity,
          unitPrice,
          totalPrice: unitPrice * quantity,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  }, [quantities]);

  const hasItems = items.length > 0;

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const shipping = hasItems ? (subtotal >= 180 ? 0 : 12) : 0;
  const tax = hasItems ? Number((subtotal * 0.08).toFixed(2)) : 0;
  const orderTotal = subtotal + shipping + tax;

  return (
    <main className="cart-page">
      <div className="cart-breadcrumb">
        <Link href="/" className="cart-back-link">
          <ArrowLeft className="size-4" /> Continue Shopping
        </Link>
        <span>/</span>
        <strong>Cart</strong>
      </div>

      <section className="cart-layout">
        <div className="cart-main">
          <div className="cart-head">
            <p className="eyebrow">Shopping Cart</p>
            <h1>Your selected pieces.</h1>
            <p>
              Review your items, update quantities, and proceed when your order
              feels right.
            </p>
          </div>

          <div className="cart-item-list">
            {hasItems ? (
              items.map((item) => (
                <Card key={item.product.slug} className="cart-item-card py-0 shadow-none">
                  <CardContent className="cart-item-content">
                    <Link href={`/products/${item.product.slug}`} className="cart-item-image-link">
                      <div className="cart-item-image-wrap">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          sizes="180px"
                          className="cart-item-image"
                        />
                      </div>
                    </Link>

                    <div className="cart-item-copy">
                      <div className="cart-item-info">
                        <p className="cart-item-tag">{item.product.tag}</p>
                        <h2>{item.product.name}</h2>
                        <p>{item.product.description}</p>
                      </div>

                      <div className="cart-item-variants">
                        <span>Size: {item.size}</span>
                        <span>Color: {item.color}</span>
                        <span>SKU: {item.product.sku}</span>
                      </div>
                    </div>

                    <div className="cart-item-actions">
                      <label className="cart-quantity-field">
                        <span>Quantity</span>
                        <select
                          value={item.quantity}
                          onChange={(event) => {
                            setQuantities((current) => ({
                              ...current,
                              [item.product.slug]: Number(event.target.value),
                            }));
                          }}
                        >
                          {quantityOptions.map((option) => (
                            <option key={option} value={option}>
                              {option === 0 ? "0 (Remove)" : option}
                            </option>
                          ))}
                        </select>
                      </label>

                      <div className="cart-price-block">
                        <span>{item.product.price} each</span>
                        <strong>{formatCurrency(item.totalPrice)}</strong>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="cart-empty-card py-0 shadow-none">
                <CardContent className="cart-empty-content">
                  <p className="eyebrow">Cart Empty</p>
                  <h2>Your bag is clear.</h2>
                  <p>
                    Add a few pieces back to your cart to continue to checkout.
                  </p>
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
              <div>
                <p className="eyebrow">Order Summary</p>
                <h2>{hasItems ? "Ready to check out?" : "Your cart is empty"}</h2>
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

              <div className="cart-summary-actions">
                {hasItems ? (
                  <CtaButton asChild className="cart-summary-button">
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </CtaButton>
                ) : (
                  <CtaButton className="cart-summary-button" disabled>
                    Proceed to Checkout
                  </CtaButton>
                )}
                <CtaButton tone="light" className="cart-summary-button" disabled={!hasItems}>
                  Save for Later
                </CtaButton>
              </div>

              <div className="cart-summary-notes">
                <span>
                  <Truck className="size-4" /> Free delivery above ₹180
                </span>
                <span>
                  <ShieldCheck className="size-4" /> Secure checkout protected end to end
                </span>
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  );
}