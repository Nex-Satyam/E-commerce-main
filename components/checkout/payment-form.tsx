"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import {
  Banknote,
  CheckCircle2,
  CreditCard,
  Gift,
  Landmark,
  PackageCheck,
  WalletCards,
} from "lucide-react";

type PaymentMethod = "online" | "cod";

type PaymentOption = {
  id: PaymentMethod;
  title: string;
  copy: string;
};

export function PaymentForm({
  paymentMethod,
  setPaymentMethod,
  deliverySlot,
  giftWrap,
  setGiftWrap,
  paymentOptions,
  onValidationChange,
}: {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (m: PaymentMethod) => void;
  deliverySlot: string;
  giftWrap: boolean;
  setGiftWrap: (v: boolean) => void;
  paymentOptions: PaymentOption[];
  onValidationChange: (isValid: boolean) => void;
}) {
  useEffect(() => {
    onValidationChange(true);
  }, [onValidationChange, paymentMethod]);

  const optionIcons = {
    online: WalletCards,
    cod: Banknote,
  };

  return (
    <Card className="checkout-card py-0 shadow-none">
      <CardContent className="checkout-card-content">
        <div className="checkout-section-head">
          <div className="checkout-section-icon">
            <CreditCard className="size-4" />
          </div>
          <div>
            <span className="checkout-section-label">Step 2</span>
            <h2>Payment Method</h2>
            <p>Choose how you want to pay for this order.</p>
          </div>
        </div>

        <div className="checkout-payment-options">
          {paymentOptions.map((option) => {
            const Icon = optionIcons[option.id];
            const isActive = paymentMethod === option.id;

            return (
              <label
                key={option.id}
                className={`checkout-option-card ${isActive ? "is-active" : ""}`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={isActive}
                  onChange={() => setPaymentMethod(option.id)}
                />
                <span className="checkout-option-icon">
                  <Icon className="size-5" />
                </span>
                <div className="checkout-option-copy">
                  <strong>{option.title}</strong>
                  <span>{option.copy}</span>
                </div>
                {isActive ? (
                  <CheckCircle2 className="checkout-option-check size-5" />
                ) : null}
              </label>
            );
          })}
        </div>

        {paymentMethod === "online" ? (
          <div className="checkout-inline-highlight">
            <Landmark className="size-5" />
            <div>
              <strong>Online payment selected</strong>
              <span>
                Continue to pay securely with UPI, card, wallet, or net banking.
              </span>
            </div>
          </div>
        ) : (
          <div className="checkout-inline-highlight">
            <PackageCheck className="size-5" />
            <div>
              <strong>Cash on Delivery selected</strong>
              <span>Your order will be placed now and paid at delivery.</span>
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
            <Gift className="size-5" />
            <div>
              <strong>Gift Wrap</strong>
              <span>Premium box, tissue wrap, and a handwritten note for Rs. 9.</span>
            </div>
          </label>

          <div className="checkout-service-note">
            <Gift className="size-4" />
            Selected delivery slot: {deliverySlot}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
