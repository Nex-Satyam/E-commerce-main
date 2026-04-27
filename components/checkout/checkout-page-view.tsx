"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
import { useRouter } from "next/navigation";
import { useRef } from "react";

import { CtaButton } from "@/components/home/cta-button";
import axios from "@/lib/axios";
import Image from "next/image";
import { AddressForm } from "./address-form";

import { PaymentForm } from "./payment-form";
import { Card, CardContent } from "@/components/ui/card";

import { useToast } from "@/components/ui/toast-context";


function parsePrice(price: string) {
  return Number(price.replace(/[^\d.]/g, ""));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value);
}

export function CheckoutPageView() {
  const [step, setStep] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "cod">("card");
  const [deliverySlot, setDeliverySlot] = useState("Tomorrow, 10 AM - 1 PM");
  const [giftWrap, setGiftWrap] = useState(true);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [addresses, setAddresses] = useState<any[]>([]);
  const [addressId, setAddressId] = useState<string | null>(null);
  const [addressLoading, setAddressLoading] = useState(true);
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
    const fetchAddresses = async () => {
      setAddressLoading(true);
      try {
        const res = await axios.get("/address");
        console.log("Fetched addresses:", res.data.addresses);
        const addrs = res.data.addresses || [];
        setAddresses(addrs);
        if (addrs.length > 0) {
          const defaultAddr = addrs.find((a: any) => a.isDefault) || addrs[0];
          setAddressId(defaultAddr.id);
        } else {
          setAddressId(null);
        }
      } catch (err) {
        setAddresses([]);
        setAddressId(null);
      } finally {
        setAddressLoading(false);
      }
    };
    fetchAddresses();
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
        title: "Express",
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

  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePlaceOrder = async () => {
    if (!addressId) {
      alert("No address selected");
      return;
    }
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
        // Auto-close modal and redirect after 3 seconds
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setShowSuccessModal(false);
          router.push("/");
        }, 3000);
      } else {
        alert("Failed to place order");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <main className="checkout-page">
      {showSuccessModal && (
        <div className="modal-backdrop" style={{position: "fixed", top:0, left:0, width:"100vw", height:"100vh", background:"rgba(0,0,0,0.3)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center"}}>
          <div className="modal-content" style={{background:"#fff", borderRadius:8, padding:32, minWidth:320, boxShadow:"0 2px 16px rgba(0,0,0,0.15)"}}>
            <h2 style={{marginBottom:12}}>Order Placed Successfully!</h2>
            <div style={{marginBottom:8}}>
              <b>Order ID:</b> {orderDetails?.id || "-"}
            </div>
            <div style={{marginBottom:8}}>
              <b>Total:</b> {orderDetails?.totalAmount ? formatCurrency(orderDetails.totalAmount / 100) : "-"}
            </div>
            <div style={{marginBottom:8}}>
              <b>Status:</b> {orderDetails?.status || "-"}
            </div>
            <div style={{marginTop:16, color:"#888"}}>Redirecting to home...</div>
          </div>
        </div>
      )}
      <div className="checkout-breadcrumb">
        <Link href="/cart">
          <ArrowLeft /> Back
        </Link>
      </div>

      <div className="checkout-stepper">
        {["Address", "Payment"].map((label, idx) => (
          <div key={label} className={`step ${step === idx ? "active" : step > idx ? "done" : ""}`}>
            <div>{idx + 1}</div>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <section className="checkout-layout">
        <div>

          {step === 0 && (
            <>
              {addressLoading ? (
                <div>Loading addresses...</div>
              ) : addresses.length === 0 ? (
                <AddressForm
                  onComplete={async (id?: string) => {
                    if (id) {
                      setAddressLoading(true);
                      // Refetch addresses and select the new one
                      try {
                        const res = await axios.get("/address");
                        const addrs = res.data.addresses || [];
                        setAddresses(addrs);
                        setAddressId(id);
                        setStep(1);
                      } finally {
                        setAddressLoading(false);
                      }
                    }
                  }}
                />
              ) : (
                <div>
                  <h3>Select Delivery Address</h3>
                  <div style={{marginBottom: 16}}>
                    {addresses.map((addr) => (
                      <label key={addr.id} style={{ display: "block", marginBottom: 8, cursor: "pointer" }}>
                        <input
                          type="radio"
                          name="address"
                          value={addr.id}
                          checked={addressId === addr.id}
                          onChange={() => {
                            setAddressId(addr.id);
                          }}
                          style={{marginRight: 8}}
                        />
                        <span>
                          <b>{addr.label}</b>: {addr.fullName}, {addr.line1}, {addr.city}, {addr.state}, {addr.pincode} {addr.isDefault ? "(Default)" : ""}
                        </span>
                      </label>
                    ))}
                  </div>
                  <button
                    className="checkout-summary-button checkout-summary-button-primary"
                    disabled={!addressId}
                    style={{ marginTop: 12 }}
                    onClick={() => {
                      if (addressId && addresses.some(a => a.id === addressId)) {
                        setStep(1);
                      } else {
                        alert("Please select an address to continue.");
                      }
                    }}
                  >
                    Continue to Payment
                  </button>
                  <div style={{ marginTop: 16 }}>
                    <AddressForm
                      onComplete={async (id?: string) => {
                        if (id) {
                          setAddressLoading(true);
                          try {
                            const res = await axios.get("/address");
                            const addrs = res.data.addresses || [];
                            setAddresses(addrs);
                            setAddressId(id);
                            setStep(1);
                          } finally {
                            setAddressLoading(false);
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {step === 1 && (
            <>
              <button onClick={() => setStep(0)} style={{ marginBottom: 10 }}>
                ← Back to Address
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

          <Card>
            <CardContent>
              <h2>Delivery</h2>

              {deliveryOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setDeliveryMethod(opt.id as any)}
                >
                  {opt.title} - {opt.price}
                </button>
              ))}

              {["Morning", "Afternoon", "Evening"].map((slot) => (
                <button key={slot} onClick={() => setDeliverySlot(slot)}>
                  {slot}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        <aside>
          <Card className="checkout-summary-card py-0 shadow-none">
            <CardContent className="checkout-summary-content">
              <h2 className="checkout-summary-title">Order Summary</h2>
              {loading ? (
                <div className="checkout-summary-loading">Loading cart...</div>
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
                            width={60}
                            height={60}
                            className="checkout-summary-img"
                          />
                        </div>
                        <div className="checkout-summary-info">
                          <strong>{item.product.name}</strong>
                          <span>Qty: {item.quantity}</span>
                          <span>Size: {item.size}</span>
                          <span>SKU: {item.product.sku}</span>
                        </div>
                        <div className="checkout-summary-price">{formatCurrency(item.totalPrice)}</div>
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
                    {step === 0 ? (
                      <CtaButton
                        className="checkout-summary-button checkout-summary-button-primary"
                        onClick={() => alert("Please complete address first")}
                      >
                        Complete Address First
                      </CtaButton>
                    ) : (
                      <CtaButton className="checkout-summary-button checkout-summary-button-primary" onClick={handlePlaceOrder}>
                        Place Order
                      </CtaButton>
                    )}
                    <CtaButton tone="light" asChild className="checkout-summary-button">
                      <Link href="/cart">Edit Cart</Link>
                    </CtaButton>
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