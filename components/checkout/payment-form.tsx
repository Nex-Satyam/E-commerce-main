import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, WalletCards, PackageCheck, Gift, Truck } from "lucide-react";
import { useState } from "react";

export function PaymentForm({
  paymentMethod,
  setPaymentMethod,
  deliverySlot,
  giftWrap,
  setGiftWrap,
  paymentOptions,
}: {
  paymentMethod: string;
  setPaymentMethod: (m: any) => void;
  deliverySlot: string;
  giftWrap: boolean;
  setGiftWrap: (v: boolean) => void;
  paymentOptions: any[];
}) {
  return (
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
  );
}
