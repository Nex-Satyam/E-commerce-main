"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Clock3,
  CreditCard,
  Gift,
  Loader2,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

import axios from "@/lib/axios";
import { CtaButton } from "@/components/home/cta-button";
import { Card, CardContent } from "@/components/ui/card";
import { AddressForm } from "./address-form";
import { PaymentForm } from "./payment-form";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value);
}

export function CheckoutPageView() {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState<"standard" | "express">(
    "standard"
  );
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "cod">(
    "card"
  );
  const [deliverySlot, setDeliverySlot] = useState("Morning");
  const [giftWrap, setGiftWrap] = useState(true);

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [addresses, setAddresses] = useState<any[]>([]);
  const [addressId, setAddressId] = useState<string | null>(null);
  const [addressLoading, setAddressLoading] = useState(true);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchAddresses = async (selectId?: string, moveNext = false) => {
    setAddressLoading(true);

    try {
      const res = await axios.get("/address");
      const addrs = res.data.addresses || [];

      setAddresses(addrs);

      if (selectId) {
        setAddressId(selectId);
      } else if (addrs.length > 0) {
        const defaultAddr = addrs.find((a: any) => a.isDefault) || addrs[0];
        setAddressId(defaultAddr.id);
      } else {
        setAddressId(null);
      }

      if (moveNext) setStep(1);
    } catch (err) {
      setAddresses([]);
      setAddressId(null);
    } finally {
      setAddressLoading(false);
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get("/cart");
        setCartItems(res.data.cart || []);
      } catch (err) {
        setError("Failed to load cart items");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const items = cartItems.map((cartItem: any) => {
    const product = cartItem.variant.product;
    const quantity = cartItem.quantity;
    const unitPrice = cartItem.variant.price;

    return {
      ...cartItem,
      product: {
        ...product,
        image: product.images?.[0]?.url,
        price: unitPrice,
        sku: cartItem.variant.sku,
      },
      quantity,
      unitPrice,
      totalPrice: unitPrice * quantity,
      size: cartItem.variant.name,
      color: "-",
    };
  });

  const hasItems = items.length > 0;
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const baseShipping = subtotal >= 180 ? 0 : 12;
  const shipping = deliveryMethod === "express" ? baseShipping + 18 : baseShipping;
  const giftWrapCharge = giftWrap ? 9 : 0;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const total = subtotal + shipping + tax + giftWrapCharge;

  const selectedAddress = addresses.find((addr) => addr.id === addressId);

  const deliveryOptions = useMemo(
    () => [
      {
        id: "standard",
        title: "Standard Delivery",
        eta: "3-5 days",
        price: baseShipping === 0 ? "Free" : formatCurrency(baseShipping),
      },
      {
        id: "express",
        title: "Express Delivery",
        eta: "Next day",
        price: formatCurrency(baseShipping + 18),
      },
    ],
    [baseShipping]
  );

  const paymentOptions = [
    { id: "card", title: "Card", copy: "Visa, Mastercard" },
    { id: "upi", title: "UPI", copy: "Google Pay, PhonePe" },
    { id: "cod", title: "Cash on Delivery", copy: "Pay at home" },
  ] as const;

  const handlePlaceOrder = async () => {
    if (!addressId) {
      alert("Please select a delivery address.");
      return;
    }

    if (!hasItems) {
      alert("Your cart is empty.");
      return;
    }

    setPlacingOrder(true);

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addressId }),
      });

      const data = await res.json();

      if (data.success) {
        setOrderDetails(data.order || {});
        setShowSuccessModal(true);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
          setShowSuccessModal(false);
          router.push("/");
        }, 3000);
      } else {
        alert(data.error || "Failed to place order");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <main className="checkout-page">
      <div className="checkout-ambient checkout-ambient-one" />
      <div className="checkout-ambient checkout-ambient-two" />

      {showSuccessModal && (
        <div className="checkout-modal-backdrop">
          <div className="checkout-success-modal">
            <div className="checkout-success-icon">
              <BadgeCheck />
            </div>

            <h2>Order Placed Successfully!</h2>
            <p>Your order has been confirmed and is being prepared.</p>

            <div className="checkout-success-details">
              <span>Order ID</span>
              <strong>{orderDetails?.id || "-"}</strong>

              <span>Total Paid</span>
              <strong>
                {orderDetails?.totalAmount
                  ? formatCurrency(orderDetails.totalAmount / 100)
                  : formatCurrency(total)}
              </strong>

              <span>Status</span>
              <strong>{orderDetails?.status || "Confirmed"}</strong>
            </div>

            <small>Redirecting to home...</small>
          </div>
        </div>
      )}

      <div className="checkout-breadcrumb">
        <Link href="/cart" className="checkout-back-link">
          <ArrowLeft className="size-4" />
          Back to cart
        </Link>
      </div>

      <section className="checkout-head">
        <p className="eyebrow">Secure checkout</p>
        <h1>Complete your order</h1>
        <p>
          Review delivery, payment, and order details before placing your order.
        </p>
      </section>

      <div className="checkout-trust-bar">
        <span>
          <ShieldCheck className="size-4" />
          Secure payment
        </span>
        <span>
          <Truck className="size-4" />
          Fast delivery
        </span>
        <span>
          <PackageCheck className="size-4" />
          Easy tracking
        </span>
      </div>

      <div className="checkout-stepper">
        {[
          { label: "Address", icon: MapPin },
          { label: "Payment", icon: CreditCard },
        ].map((item, idx) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className={`step ${
                step === idx ? "active" : step > idx ? "done" : ""
              }`}
            >
              <div>
                {step > idx ? <BadgeCheck className="size-4" /> : idx + 1}
              </div>
              <span>
                <Icon className="size-4" />
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      <section className="checkout-layout">
        <div className="checkout-main">
          {step === 0 && (
            <>
              {addressLoading ? (
                <Card className="checkout-card py-0 shadow-none">
                  <CardContent className="checkout-card-content">
                    <div className="checkout-loading-state">
                      <Loader2 className="size-5 animate-spin" />
                      Loading addresses...
                    </div>
                  </CardContent>
                </Card>
              ) : addresses.length === 0 ? (
                <AddressForm
                  onComplete={async (id?: string) => {
                    await fetchAddresses(id, true);
                  }}
                />
              ) : (
                <Card className="checkout-card py-0 shadow-none">
                  <CardContent className="checkout-card-content">
                    <div className="checkout-section-head">
                      <div className="checkout-section-icon">
                        <MapPin className="size-4" />
                      </div>
                      <div>
                        <h2>Select Delivery Address</h2>
                        <p>Choose where you want this order delivered.</p>
                      </div>
                    </div>

                    <div className="checkout-address-list">
                      {addresses.map((addr) => (
                        <label
                          key={addr.id}
                          className={`checkout-address-card ${
                            addressId === addr.id ? "is-active" : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="address"
                            value={addr.id}
                            checked={addressId === addr.id}
                            onChange={() => setAddressId(addr.id)}
                          />

                          <div>
                            <strong>
                              {addr.label || "Home"}{" "}
                              {addr.isDefault ? (
                                <span className="checkout-default-badge">
                                  Default
                                </span>
                              ) : null}
                            </strong>

                            <span>
                              {addr.fullName}, {addr.line1}, {addr.city},{" "}
                              {addr.state}, {addr.pincode}
                            </span>

                            {addr.phone ? <small>{addr.phone}</small> : null}
                          </div>
                        </label>
                      ))}
                    </div>

                    <button
                      className="checkout-primary-action"
                      disabled={!addressId}
                      onClick={() => {
                        if (addressId) setStep(1);
                      }}
                    >
                      Continue to Payment
                    </button>
                  </CardContent>
                </Card>
              )}

              {addresses.length > 0 && !addressLoading && (
                <AddressForm
                  onComplete={async (id?: string) => {
                    await fetchAddresses(id, true);
                  }}
                />
              )}
            </>
          )}

          {step === 1 && (
            <>
              <button
                type="button"
                className="checkout-back-mini"
                onClick={() => setStep(0)}
              >
                <ArrowLeft className="size-4" />
                Back to Address
              </button>

              <PaymentForm
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                deliverySlot={deliverySlot}
                giftWrap={giftWrap}
                setGiftWrap={setGiftWrap}
                paymentOptions={[...paymentOptions]}
              />
            </>
          )}

          <Card className="checkout-card py-0 shadow-none checkout-delivery-card">
            <CardContent className="checkout-card-content">
              <div className="checkout-section-head">
                <div className="checkout-section-icon">
                  <Truck className="size-4" />
                </div>
                <div>
                  <h2>Delivery Preferences</h2>
                  <p>Choose speed and delivery time for your order.</p>
                </div>
              </div>

              <div className="checkout-option-grid">
                {deliveryOptions.map((opt) => (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setDeliveryMethod(opt.id as any)}
                    className={`checkout-choice-card ${
                      deliveryMethod === opt.id ? "is-active" : ""
                    }`}
                  >
                    <div>
                      <strong>{opt.title}</strong>
                      <span>{opt.eta}</span>
                    </div>
                    <b>{opt.price}</b>
                  </button>
                ))}
              </div>

              <div className="checkout-slot-row">
                {["Morning", "Afternoon", "Evening"].map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setDeliverySlot(slot)}
                    className={`checkout-slot-chip ${
                      deliverySlot === slot ? "is-active" : ""
                    }`}
                  >
                    <Clock3 className="size-4" />
                    {slot}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="checkout-feature-grid">
            <div className="checkout-feature-card">
              <ShieldCheck className="size-5" />
              <strong>Protected checkout</strong>
              <span>Your payment and order data stays secure.</span>
            </div>
            <div className="checkout-feature-card">
              <Sparkles className="size-5" />
              <strong>Premium packaging</strong>
              <span>Elegant packaging for a better unboxing.</span>
            </div>
            <div className="checkout-feature-card">
              <Gift className="size-5" />
              <strong>Gift-ready</strong>
              <span>Add gift wrap for a special delivery feel.</span>
            </div>
          </div>
        </div>

        <aside className="checkout-summary">
          <Card className="checkout-summary-card py-0 shadow-none">
            <CardContent className="checkout-summary-content">
              <div className="checkout-summary-hero">
                <div>
                  <span className="checkout-summary-kicker">Order Summary</span>
                  <strong>{items.length} item(s)</strong>
                </div>
                <span className="checkout-summary-badge">
                  <ShieldCheck className="size-4" />
                  Secure
                </span>
              </div>

              {selectedAddress && (
                <div className="checkout-selected-address">
                  <MapPin className="size-4" />
                  <span>
                    Delivering to <strong>{selectedAddress.fullName}</strong>,{" "}
                    {selectedAddress.city}
                  </span>
                </div>
              )}

              {loading ? (
                <div className="checkout-summary-loading">
                  <Loader2 className="size-5 animate-spin" />
                  Loading cart...
                </div>
              ) : error ? (
                <div className="checkout-summary-error">{error}</div>
              ) : !hasItems ? (
                <div className="checkout-summary-empty">Your cart is empty.</div>
              ) : (
                <>
                  <div className="checkout-summary-items">
                    {items.map((item) => (
                      <div key={item.id} className="checkout-summary-item">
                        <div className="checkout-summary-img-wrap">
                          <Image
                            src={item.product.image || "/placeholder.png"}
                            alt={item.product.name}
                            width={70}
                            height={70}
                            className="checkout-summary-img"
                          />
                        </div>

                        <div className="checkout-summary-info">
                          <strong>{item.product.name}</strong>
                          <span>Qty: {item.quantity}</span>
                          <span>Size: {item.size}</span>
                          <span>SKU: {item.product.sku}</span>
                        </div>

                        <div className="checkout-summary-price">
                          {formatCurrency(item.totalPrice)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <hr className="checkout-summary-divider" />

                  <div className="checkout-summary-lines">
                    <div>
                      <span>Subtotal</span>
                      <strong>{formatCurrency(subtotal)}</strong>
                    </div>
                    <div>
                      <span>Shipping</span>
                      <strong>
                        {shipping === 0 ? "Free" : formatCurrency(shipping)}
                      </strong>
                    </div>
                    <div>
                      <span>Gift Wrap</span>
                      <strong>
                        {giftWrap ? formatCurrency(giftWrapCharge) : "No"}
                      </strong>
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
                    {step === 0 ? (
                      <button
                        type="button"
                        className="checkout-primary-action"
                        onClick={() => alert("Please complete address first")}
                      >
                        Complete Address First
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="checkout-primary-action"
                        onClick={handlePlaceOrder}
                        disabled={placingOrder}
                      >
                        {placingOrder ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Placing Order...
                          </>
                        ) : (
                          "Place Order"
                        )}
                      </button>
                    )}

                    <CtaButton tone="light" asChild className="checkout-summary-button">
                      <Link href="/cart">Edit Cart</Link>
                    </CtaButton>
                  </div>

                  <div className="checkout-summary-notes">
                    <span>
                      <ShieldCheck className="size-4" />
                      100% secure checkout
                    </span>
                    <span>
                      <Truck className="size-4" />
                      Delivery updates after order confirmation
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  );
}