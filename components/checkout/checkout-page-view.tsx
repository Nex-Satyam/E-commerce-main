"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  Gift,
  IndianRupee,
  Loader2,
  LockKeyhole,
  MapPin,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  Tag,
  Truck,
} from "lucide-react";

import axios from "@/lib/axios";
import { queryKeys } from "@/lib/query-keys";
import { CtaButton } from "@/components/home/cta-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/components/cart/cart-provider";
import { useToast } from "@/components/ui/toast-context";
import { AddressForm } from "./address-form";
import { PaymentForm } from "./payment-form";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value);
}

function formatCurrencyFromPaise(value: number) {
  return formatCurrency(value / 100);
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

type DeliveryMethod = "standard" | "express";
type PaymentMethod = "online" | "cod";

type CheckoutAddress = {
  id: string;
  fullName: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  pincode: string;
  label?: string;
  isDefault?: boolean;
};

type CartApiItem = {
  id: string;
  quantity: number;
  variant: {
    name?: string;
    sku?: string;
    price: number;
    product: {
      id: string;
      name: string;
      slug?: string;
      images?: { url?: string }[];
    };
  };
};

type OrderDetails = {
  id?: string;
  totalAmount?: number;
  status?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  paymentProvider?: string | null;
  paymentId?: string | null;
};

type RazorpayPaymentResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOrderResponse = {
  success?: boolean;
  keyId?: string;
  order?: {
    id: string;
    amount: number;
    currency: string;
  };
  error?: string;
  message?: string;
};

type RazorpayFailureResponse = {
  error?: {
    code?: string;
    description?: string;
    reason?: string;
    source?: string;
    step?: string;
  };
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    contact?: string;
  };
  handler: (response: RazorpayPaymentResponse) => void | Promise<void>;
  modal?: {
    ondismiss?: () => void;
  };
  theme?: {
    color: string;
  };
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => {
      open: () => void;
      on: (
        event: "payment.failed",
        handler: (response: RazorpayFailureResponse) => void
      ) => void;
    };
  }
}

export function CheckoutPageView() {
  const router = useRouter();
  const { refreshCart } = useCart();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [step, setStep] = useState(0);
  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("online");
  const [deliverySlot, setDeliverySlot] = useState("Morning");
  const [giftWrap, setGiftWrap] = useState(true);

  const [placingOrder, setPlacingOrder] = useState(false);

  const [addressId, setAddressId] = useState<string | null>(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cartQuery = useQuery({
    queryKey: queryKeys.cart.items,
    queryFn: async () => {
      const res = await axios.get("/cart");
      return (res.data.cart || []) as CartApiItem[];
    },
  });

  const addressesQuery = useQuery({
    queryKey: queryKeys.addresses,
    queryFn: async () => {
      const res = await axios.get("/address");
      return (res.data.addresses || []) as CheckoutAddress[];
    },
  });

  const cartItems = cartQuery.data || [];
  const addresses = addressesQuery.data || [];
  const loading = cartQuery.isLoading;
  const error = cartQuery.isError ? "Failed to load cart items" : null;
  const addressLoading = addressesQuery.isLoading;

  const fetchAddresses = async (selectId?: string, moveNext = false) => {
    const result = await queryClient.fetchQuery({
      queryKey: queryKeys.addresses,
      queryFn: async () => {
        const res = await axios.get("/address");
        return (res.data.addresses || []) as CheckoutAddress[];
      },
    });

    if (selectId) {
      setAddressId(selectId);
    } else if (result.length > 0) {
      const defaultAddr =
        result.find((addr: CheckoutAddress) => addr.isDefault) || result[0];
      setAddressId(defaultAddr.id);
    } else {
      setAddressId(null);
    }

    if (moveNext) setStep(1);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const items = cartItems.map((cartItem) => {
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
  const baseShipping = subtotal >= 18000 ? 0 : 1200;
  const shipping = deliveryMethod === "express" ? baseShipping + 1800 : baseShipping;
  const giftWrapCharge = giftWrap ? 900 : 0;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax + giftWrapCharge;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const savings = hasItems ? Math.max(0, subtotal * 0.05) : 0;

  const defaultAddress =
    addresses.find((addr: CheckoutAddress) => addr.isDefault) || addresses[0];
  const selectedAddressId = addressId || defaultAddress?.id || null;
  const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId);

  const notify = (
    message: string,
    type: "success" | "error" | "info" | "warning" = "info"
  ) => {
    showToast(message, type);
  };

  const getPaymentFailureReason = (response: RazorpayFailureResponse) => {
    const message =
      response.error?.description ||
      response.error?.reason ||
      "Payment failed. Please try another payment method or use Cash on Delivery.";
    const normalizedMessage = message.toLowerCase();

    if (
      normalizedMessage.includes("maximum") ||
      normalizedMessage.includes("exceed") ||
      normalizedMessage.includes("limit")
    ) {
      return "Payment failed because the amount exceeds the limit allowed by Razorpay, your bank, or this payment method. Try Cash on Delivery, reduce the order value, or contact support.";
    }

    if (
      normalizedMessage.includes("minimum") ||
      normalizedMessage.includes("less than") ||
      normalizedMessage.includes("at least")
    ) {
      return "Payment failed because the amount is below Razorpay's minimum limit. Please add items worth at least INR 1.00 or choose Cash on Delivery.";
    }

    return message;
  };

  const deliveryOptions = [
    {
      id: "standard" as const,
      title: "Standard Delivery",
      eta: "3-5 days",
      price: baseShipping === 0 ? "Free" : formatCurrencyFromPaise(baseShipping),
      badge: subtotal >= 18000 ? "Free eligible" : "Best value",
    },
    {
      id: "express" as const,
      title: "Express Delivery",
      eta: "Next day",
      price: formatCurrencyFromPaise(baseShipping + 1800),
      badge: "Fastest",
    },
  ];

  const paymentOptions = [
    { id: "online", title: "UPI, Card, Net Banking", copy: "Pay securely online" },
    { id: "cod", title: "Cash on Delivery", copy: "Pay at home" },
  ] as const;

  const completeOrder = async (
    paymentDetails:
      | {
          method: "online";
          paymentId: string;
          providerOrderId: string;
        }
      | { method: "cod" }
  ) => {
    const finalOrderRes = await axios.post("/order", {
      addressId: selectedAddressId,
      deliveryMethod,
      giftWrap,
      paymentMethod:
        paymentDetails.method === "online" ? "ONLINE" : "CASH_ON_DELIVERY",
      paymentId:
        paymentDetails.method === "online" ? paymentDetails.paymentId : undefined,
      paymentProviderOrderId:
        paymentDetails.method === "online"
          ? paymentDetails.providerOrderId
          : undefined,
    });

    const finalOrderData = finalOrderRes.data;

    if (!finalOrderData.success) {
      notify(finalOrderData.error || "Failed to place order", "error");
      return;
    }

    setOrderDetails(finalOrderData.order || {});
    setShowSuccessModal(true);
    queryClient.setQueryData(queryKeys.cart.items, []);
    queryClient.setQueryData(queryKeys.cart.count, 0);
    void queryClient.invalidateQueries({ queryKey: queryKeys.orders });
    notify(
      finalOrderData.order?.paymentStatus === "PAID"
        ? "Order placed successfully. Payment is marked as paid."
        : "Cash on Delivery order placed successfully. Payment will be collected at delivery.",
      "success"
    );
    await refreshCart();

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setShowSuccessModal(false);
      router.push("/");
    }, 3000);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      notify("Please select a delivery address before placing the order.", "warning");
      return;
    }

    if (!hasItems) {
      notify("Your cart is empty. Add products before checkout.", "warning");
      return;
    }

    setPlacingOrder(true);

    try {
      if (paymentMethod === "cod") {
        notify("Placing your Cash on Delivery order now.", "info");
        await completeOrder({ method: "cod" });
        return;
      }

      if (!window.Razorpay) {
        notify("Payment gateway is still loading. Please try again in a moment.", "warning");
        return;
      }

      const orderRes = await axios.post<RazorpayOrderResponse>("/payment/create-order", {
        deliveryMethod,
        giftWrap,
      });

      const orderData = orderRes.data;

      if (!orderData.success || !orderData.order || !orderData.keyId) {
        notify(orderData.error || "Payment order creation failed", "error");
        return;
      }

      notify(
        orderData.message ||
          "Payment popup is opening. Complete payment to place the order.",
        "info"
      );

      const options: RazorpayOptions = {
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "ASR Offwhite Atelier",
        description: "Order Payment",
        order_id: orderData.order.id,
        prefill: {
          name: selectedAddress?.fullName,
          contact: selectedAddress?.phone,
        },
        handler: async function (response) {
          const verifyRes = await axios.post("/payment/verify", response);

          const verifyData = verifyRes.data;

          if (!verifyData.success) {
            notify(
              verifyData.error ||
                "Payment verification failed. Your order was not placed because we could not confirm the payment.",
              "error"
            );
            return;
          }

          notify("Payment verified successfully. Placing your order now.", "success");
          await completeOrder({
            method: "online",
            paymentId: response.razorpay_payment_id,
            providerOrderId: response.razorpay_order_id,
          });
        },
        modal: {
          ondismiss: () => {
            notify("Payment popup was closed before payment was completed.", "warning");
            setPlacingOrder(false);
          },
        },
        theme: {
          color: "#0a0a0a",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response) => {
        notify(getPaymentFailureReason(response), "error");
        setPlacingOrder(false);
      });
      razorpay.open();
    } catch (error) {
      console.error(error);
      notify(getErrorMessage(error, "Something went wrong during payment"), "error");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <main className="checkout-page">
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

              <span>
                {orderDetails?.paymentStatus === "PAID" ? "Total Paid" : "Order Total"}
              </span>
              <strong>
                {orderDetails?.totalAmount
                  ? formatCurrencyFromPaise(orderDetails.totalAmount)
                  : formatCurrencyFromPaise(total)}
              </strong>

              <span>Status</span>
              <strong>{orderDetails?.status || "Confirmed"}</strong>

              <span>Payment</span>
              <strong>
                {orderDetails?.paymentStatus === "PAID"
                  ? "Paid"
                  : "Cash on Delivery"}
              </strong>
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
        <ChevronRight className="size-4" />
        <span>Checkout</span>
      </div>

      <section className="checkout-head">
        <div>
          <p className="eyebrow">Secure checkout</p>
          <h1>Review and place your order</h1>
          <p>
            Confirm your delivery address, shipping speed, payment method, and
            final price before checkout.
          </p>
        </div>

        <div className="checkout-head-panel">
          <span>
            <ShieldCheck className="size-4" />
            Bank-grade payment security
          </span>
          <span>
            <RotateCcw className="size-4" />
            7 day return window
          </span>
        </div>
      </section>

      <div className="checkout-trust-bar">
        <span>
          <PackageCheck className="size-4" />
          {itemCount || 0} item(s) ready
        </span>
        <span>
          <Truck className="size-4" />
          Delivery slot: {deliverySlot}
        </span>
        <span>
          <IndianRupee className="size-4" />
          Pay securely at checkout
        </span>
        <span>
          <Tag className="size-4" />
          Offers applied in summary
        </span>
      </div>

      <div className="checkout-reassurance-strip">
        <span>
          <LockKeyhole className="size-4" />
          Encrypted payment session
        </span>
        <span>
          <BadgeCheck className="size-4" />
          Stock reserved after order confirmation
        </span>
        <span>
          <Clock3 className="size-4" />
          Estimated packing within 24 hours
        </span>
      </div>

      <div className="checkout-stepper">
        {[
          { label: "Address", icon: MapPin, done: Boolean(selectedAddressId) },
          { label: "Delivery", icon: Truck, done: true },
          { label: "Payment", icon: CreditCard, done: step > 1 },
        ].map((item, idx) => {
          const Icon = item.icon;
          const isActive =
            idx === 0 ? step === 0 : idx === 2 ? step === 1 : false;
          const isDone = item.done && !isActive;

          return (
            <div
              key={item.label}
              className={`checkout-step ${
                isActive ? "active" : isDone ? "done" : ""
              }`}
            >
              <div>
                {isDone ? <CheckCircle2 className="size-4" /> : idx + 1}
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
                        <span className="checkout-section-label">Step 1</span>
                        <h2>Select Delivery Address</h2>
                        <p>Choose where this order should be delivered.</p>
                      </div>
                    </div>

                    <div className="checkout-address-list">
                      {addresses.map((addr) => (
                        <label
                          key={addr.id}
                          className={`checkout-address-card ${
                            selectedAddressId === addr.id ? "is-active" : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="address"
                            value={addr.id}
                            checked={selectedAddressId === addr.id}
                            onChange={() => setAddressId(addr.id)}
                          />

                          <div>
                            <strong className="checkout-address-title">
                              <span>{addr.label || "Home"}</span>
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

                    <Button
                      type="button"
                      className="checkout-primary-action"
                      disabled={!selectedAddressId}
                      onClick={() => {
                        if (selectedAddressId) setStep(1);
                      }}
                    >
                      Deliver to this address
                    </Button>
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
              <Button
                type="button"
                className="checkout-back-mini"
                onClick={() => setStep(0)}
              >
                <ArrowLeft className="size-4" />
                Back to Address
              </Button>

              <PaymentForm
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                deliverySlot={deliverySlot}
                giftWrap={giftWrap}
                setGiftWrap={setGiftWrap}
                paymentOptions={[...paymentOptions]}
                onValidationChange={() => undefined}
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
                  <span className="checkout-section-label">Delivery</span>
                  <h2>Delivery Preferences</h2>
                  <p>Choose shipping speed and a convenient delivery window.</p>
                </div>
              </div>

              <div className="checkout-option-grid">
                {deliveryOptions.map((opt) => (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setDeliveryMethod(opt.id)}
                    className={`checkout-choice-card ${
                      deliveryMethod === opt.id ? "is-active" : ""
                    }`}
                  >
                    <div>
                      <span className="checkout-choice-badge">{opt.badge}</span>
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
              <span>Secure payment processing for every order.</span>
            </div>
            <div className="checkout-feature-card">
              <PackageCheck className="size-5" />
              <strong>Quality checked</strong>
              <span>Items are verified before dispatch.</span>
            </div>
            <div className="checkout-feature-card">
              <Gift className="size-5" />
              <strong>Gift-ready</strong>
              <span>Add premium wrap from payment options.</span>
            </div>
          </div>
        </div>

        <aside className="checkout-summary">
          <Card className="checkout-summary-card py-0 shadow-none">
            <CardContent className="checkout-summary-content">
              <div className="checkout-summary-hero">
                <div>
                  <span className="checkout-summary-kicker">Order Summary</span>
                  <strong>{itemCount} item(s)</strong>
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
                          {formatCurrencyFromPaise(item.totalPrice)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <hr className="checkout-summary-divider" />

                  <div className="checkout-summary-lines">
                    <div>
                      <span>Subtotal</span>
                      <strong>{formatCurrencyFromPaise(subtotal)}</strong>
                    </div>
                    <div>
                      <span>Shipping</span>
                      <strong>
                        {shipping === 0 ? "Free" : formatCurrencyFromPaise(shipping)}
                      </strong>
                    </div>
                    <div>
                      <span>Gift Wrap</span>
                      <strong>
                        {giftWrap ? formatCurrencyFromPaise(giftWrapCharge) : "No"}
                      </strong>
                    </div>
                    <div>
                      <span>Estimated Tax</span>
                      <strong>{formatCurrencyFromPaise(tax)}</strong>
                    </div>
                    <div className="checkout-savings-line">
                      <span>Estimated Savings</span>
                      <strong>{formatCurrencyFromPaise(savings)}</strong>
                    </div>
                  </div>

                  <div className="checkout-summary-total">
                    <span>Total</span>
                    <strong>{formatCurrencyFromPaise(total)}</strong>
                  </div>

                  <div className="checkout-mini-timeline">
                    {[
                      "Order confirmed",
                      "Quality check",
                      "Dispatch update",
                    ].map((item, index) => (
                      <span key={item}>
                        <b>{index + 1}</b>
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="checkout-summary-actions">
                    {step === 0 ? (
                      <Button
                        type="button"
                        className="checkout-primary-action"
                        onClick={() =>
                          notify("Please complete address selection first.", "warning")
                        }
                      >
                        Complete Address First
                      </Button>
                    ) : (
                      <Button
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
                          paymentMethod === "cod" ? "Place COD Order" : "Pay & Place Order"
                        )}
                      </Button>
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
                    <span>
                      <BadgeCheck className="size-4" />
                      You saved {formatCurrencyFromPaise(savings)} on this order
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
