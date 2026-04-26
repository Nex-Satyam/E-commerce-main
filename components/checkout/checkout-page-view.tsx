"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Clock3,
  CreditCard,
  Gift,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Truck,
  WalletCards,
} from "lucide-react";

import { CtaButton } from "@/components/home/cta-button";
import { cartItems, getProductBySlug } from "@/components/home/home-data";
import { Card, CardContent } from "@/components/ui/card";

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

export function CheckoutPageView() {
  const [deliveryMethod, setDeliveryMethod] = useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "cod">("card");
  const [deliverySlot, setDeliverySlot] = useState("Tomorrow, 10 AM - 1 PM");
  const [giftWrap, setGiftWrap] = useState(true);

  const items = cartItems
    .map((item) => {
      const product = getProductBySlug(item.productSlug);

      if (!product) {
        return null;
      }

      const unitPrice = parsePrice(product.price);

      return {
        ...item,
        product,
        totalPrice: unitPrice * item.quantity,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const baseShipping = subtotal >= 180 ? 0 : 12;
  const shipping = deliveryMethod === "express" ? baseShipping + 18 : baseShipping;
  const giftWrapCharge = giftWrap ? 9 : 0;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const total = subtotal + shipping + tax + giftWrapCharge;

  const deliveryOptions = useMemo(
    () => [
      {
        id: "standard",
        title: "Standard Delivery",
        eta: "3-5 business days",
        price: baseShipping === 0 ? "Free" : formatCurrency(baseShipping),
      },
      {
        id: "express",
        title: "Express Priority",
        eta: "Next day in metro cities",
        price: formatCurrency(baseShipping + 18),
      },
    ],
    [baseShipping],
  );

  const paymentOptions = [
    {
      id: "card",
      title: "Credit / Debit Card",
      copy: "Visa, Mastercard, RuPay, Amex",
    },
    {
      id: "upi",
      title: "UPI",
      copy: "Pay using any UPI app instantly",
    },
    {
      id: "cod",
      title: "Cash on Delivery",
      copy: "Available for eligible pin codes",
    },
  ] as const;

  const timelineSteps = [
    { label: "Order review", detail: "Cart, address, and payment confirmed" },
    { label: "Packed in atelier", detail: "Hand-finished pieces prepared for dispatch" },
    { label: "Out for delivery", detail: deliveryMethod === "express" ? "Priority handoff to courier" : "Standard courier dispatch" },
  ];

  return (
    <main className="checkout-page">
      <div className="checkout-ambient checkout-ambient-one" aria-hidden="true" />
      <div className="checkout-ambient checkout-ambient-two" aria-hidden="true" />

      <div className="checkout-breadcrumb">
        <Link href="/cart" className="checkout-back-link">
          <ArrowLeft className="size-4" /> Back to Cart
        </Link>
        <span>/</span>
        <strong>Checkout</strong>
      </div>

      <section className="checkout-layout">
        <div className="checkout-main">
          <div className="checkout-head">
            <p className="eyebrow">Checkout</p>
            <h1>Complete your order.</h1>
            <p>Review delivery details, choose your preferred payment flow, and place your order with a more polished, premium finish.</p>
          </div>

          <div className="checkout-trust-bar">
            <span>
              <ShieldCheck className="size-4" /> Secure checkout
            </span>
            <span>
              <BadgeCheck className="size-4" /> Authentic atelier pieces
            </span>
            <span>
              <Sparkles className="size-4" /> Complimentary styling note included
            </span>
          </div>

          <div className="checkout-progress-strip">
            {timelineSteps.map((step, index) => (
              <div key={step.label} className="checkout-progress-step">
                <div className="checkout-progress-dot">{index + 1}</div>
                <div>
                  <strong>{step.label}</strong>
                  <span>{step.detail}</span>
                </div>
              </div>
            ))}
          </div>

          <Card className="checkout-card py-0 shadow-none">
            <CardContent className="checkout-card-content">
              <div className="checkout-section-head">
                <div className="checkout-section-icon">
                  <MapPin className="size-4" />
                </div>
                <div>
                  <h2>Delivery Address</h2>
                  <p>Use your preferred address for doorstep delivery.</p>
                </div>
              </div>

              <div className="checkout-two-col-grid">
                <label className="checkout-field">
                  <span>Full Name</span>
                  <input type="text" placeholder="Aarav Sharma" />
                </label>
                <label className="checkout-field">
                  <span>Phone</span>
                  <input type="tel" placeholder="+91 98765 43210" />
                </label>
              </div>

              <label className="checkout-field">
                <span>Street Address</span>
                <input type="text" placeholder="House no. 24, Greater Kailash" />
              </label>

              <div className="checkout-two-col-grid">
                <label className="checkout-field">
                  <span>City</span>
                  <input type="text" placeholder="New Delhi" />
                </label>
                <label className="checkout-field">
                  <span>Postal Code</span>
                  <input type="text" placeholder="110048" />
                </label>
              </div>

              <label className="checkout-field">
                <span>Landmark / Delivery Note</span>
                <input type="text" placeholder="Near M Block Market, ring before delivery" />
              </label>
            </CardContent>
          </Card>

          <Card className="checkout-card py-0 shadow-none">
            <CardContent className="checkout-card-content">
              <div className="checkout-section-head">
                <div className="checkout-section-icon">
                  <Truck className="size-4" />
                </div>
                <div>
                  <h2>Delivery Preference</h2>
                  <p>Select the delivery speed and time slot that fits your schedule.</p>
                </div>
              </div>

              <div className="checkout-option-grid">
                {deliveryOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`checkout-choice-card${deliveryMethod === option.id ? " is-active" : ""}`}
                    onClick={() => setDeliveryMethod(option.id as "standard" | "express")}
                  >
                    <div>
                      <strong>{option.title}</strong>
                      <span>{option.eta}</span>
                    </div>
                    <strong>{option.price}</strong>
                  </button>
                ))}
              </div>

              <div className="checkout-slot-row">
                {[
                  "Tomorrow, 10 AM - 1 PM",
                  "Tomorrow, 2 PM - 6 PM",
                  "Friday, 9 AM - 12 PM",
                ].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    className={`checkout-slot-chip${deliverySlot === slot ? " is-active" : ""}`}
                    onClick={() => setDeliverySlot(slot)}
                  >
                    <Clock3 className="size-4" /> {slot}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="checkout-card py-0 shadow-none">
            <CardContent className="checkout-card-content">
              <div className="checkout-section-head">
                <div className="checkout-section-icon">
                  <CreditCard className="size-4" />
                </div>
                <div>
                  <h2>Payment Method</h2>
                  <p>Secure payment protected from end to end.</p>
                </div>
              </div>

              <div className="checkout-payment-options">
                {paymentOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`checkout-option-card${paymentMethod === option.id ? " is-active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === option.id}
                      onChange={() => setPaymentMethod(option.id)}
                    />
                    <div className="checkout-option-copy">
                      <strong>{option.title}</strong>
                      <span>{option.copy}</span>
                    </div>
                  </label>
                ))}
              </div>

              {paymentMethod === "card" ? (
                <>
                  <div className="checkout-two-col-grid">
                    <label className="checkout-field">
                      <span>Card Number</span>
                      <input type="text" placeholder="1234 5678 9012 3456" />
                    </label>
                    <label className="checkout-field">
                      <span>Name on Card</span>
                      <input type="text" placeholder="Aarav Sharma" />
                    </label>
                  </div>

                  <div className="checkout-three-col-grid">
                    <label className="checkout-field">
                      <span>Expiry</span>
                      <input type="text" placeholder="08/28" />
                    </label>
                    <label className="checkout-field">
                      <span>CVV</span>
                      <input type="password" placeholder="123" />
                    </label>
                    <label className="checkout-field">
                      <span>Promo Code</span>
                      <input type="text" placeholder="ASR10" />
                    </label>
                  </div>
                </>
              ) : paymentMethod === "upi" ? (
                <div className="checkout-inline-highlight">
                  <WalletCards className="size-5" />
                  <div>
                    <strong>UPI selected</strong>
                    <span>After clicking place order, you will be redirected to complete payment in your preferred UPI app.</span>
                  </div>
                </div>
              ) : (
                <div className="checkout-inline-highlight">
                  <PackageCheck className="size-5" />
                  <div>
                    <strong>Cash on Delivery selected</strong>
                    <span>Pay at your doorstep. Availability may vary by pin code and order value.</span>
                  </div>
                </div>
              )}

              <div className="checkout-service-row">
                <label className="checkout-service-card">
                  <input
                    type="checkbox"
                    checked={giftWrap}
                    onChange={(event) => setGiftWrap(event.target.checked)}
                  />
                  <div>
                    <strong>Gift Wrap</strong>
                    <span>Premium box, tissue wrap, and a handwritten note for ₹9</span>
                  </div>
                </label>
                <div className="checkout-service-note">
                  <Gift className="size-4" /> Selected delivery slot: {deliverySlot}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="checkout-card py-0 shadow-none checkout-support-card">
            <CardContent className="checkout-card-content">
              <div className="checkout-section-head">
                <div className="checkout-section-icon">
                  <Sparkles className="size-4" />
                </div>
                <div>
                  <h2>Added at Checkout</h2>
                  <p>Small details that make delivery feel more considered and premium.</p>
                </div>
              </div>

              <div className="checkout-feature-grid">
                <div className="checkout-feature-card">
                  <strong>Order updates</strong>
                  <span>WhatsApp and email alerts for every delivery milestone.</span>
                </div>
                <div className="checkout-feature-card">
                  <strong>Easy return window</strong>
                  <span>14-day returns with support from client care.</span>
                </div>
                <div className="checkout-feature-card">
                  <strong>Styling note</strong>
                  <span>Recommended pairing ideas added to your dispatch note.</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="checkout-summary">
          <Card className="checkout-summary-card py-0 shadow-none">
            <CardContent className="checkout-summary-content">
              <div>
                <p className="eyebrow">Order Summary</p>
                <h2>{items.length} items in your order</h2>
              </div>

              <div className="checkout-summary-hero">
                <div>
                  <span className="checkout-summary-kicker">Estimated arrival</span>
                  <strong>{deliveryMethod === "express" ? "Tomorrow" : "3-5 business days"}</strong>
                </div>
                <span className="checkout-summary-badge">
                  <BadgeCheck className="size-4" /> Secure
                </span>
              </div>

              <div className="checkout-summary-items">
                {items.map((item) => (
                  <div key={item.product.slug} className="checkout-summary-item">
                    <div>
                      <strong>{item.product.name}</strong>
                      <span>{item.quantity} x {item.product.price}</span>
                    </div>
                    <strong>{formatCurrency(item.totalPrice)}</strong>
                  </div>
                ))}
              </div>

              <div className="checkout-summary-lines">
                <div>
                  <span>Subtotal</span>
                  <strong>{formatCurrency(subtotal)}</strong>
                </div>
                <div>
                  <span>Shipping</span>
                  <strong>{shipping === 0 ? "Free" : formatCurrency(shipping)}</strong>
                </div>
                <div>
                  <span>Gift Wrap</span>
                  <strong>{giftWrap ? formatCurrency(giftWrapCharge) : "No"}</strong>
                </div>
                <div>
                  <span>Estimated Tax</span>
                  <strong>{formatCurrency(tax)}</strong>
                </div>
              </div>

              <div className="checkout-summary-total">
                <span>Total</span>
                <strong>{formatCurrency(total)}</strong>
              </div>

              <div className="checkout-summary-actions">
                <CtaButton className="checkout-summary-button checkout-summary-button-primary">
                  Place Order Securely
                </CtaButton>
                <CtaButton tone="light" asChild className="checkout-summary-button">
                  <Link href="/cart">Edit Cart</Link>
                </CtaButton>
              </div>

              <div className="checkout-summary-notes">
                <span>
                  <Truck className="size-4" /> {deliveryMethod === "express" ? "Express dispatch with priority courier handoff" : "Expected delivery in 3-5 business days"}
                </span>
                <span>
                  <ShieldCheck className="size-4" /> Payments are encrypted and secured
                </span>
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  );
}