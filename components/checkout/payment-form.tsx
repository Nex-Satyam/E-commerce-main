"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  BadgePercent,
  Banknote,
  CheckCircle2,
  CreditCard,
  Gift,
  LockKeyhole,
  PackageCheck,
  QrCode,
  WalletCards,
} from "lucide-react";

type PaymentMethod = "card" | "upi" | "cod";

type PaymentOption = {
  id: PaymentMethod;
  title: string;
  copy: string;
};

const paymentSchema = z
  .object({
    method: z.enum(["card", "upi", "cod"]),
    cardNumber: z.string().optional(),
    cardName: z.string().optional(),
    expiry: z.string().optional(),
    cvv: z.string().optional(),
    promoCode: z.string().trim().max(18, "Promo code is too long.").optional(),
    upiId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.method === "card") {
      const cardDigits = (data.cardNumber || "").replace(/\D/g, "");

      if (!/^\d{13,19}$/.test(cardDigits)) {
        ctx.addIssue({
          code: "custom",
          path: ["cardNumber"],
          message: "Enter a valid card number.",
        });
      }

      if (!data.cardName?.trim() || data.cardName.trim().length < 2) {
        ctx.addIssue({
          code: "custom",
          path: ["cardName"],
          message: "Enter the name printed on card.",
        });
      }

      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.expiry || "")) {
        ctx.addIssue({
          code: "custom",
          path: ["expiry"],
          message: "Use MM/YY format.",
        });
      }

      if (!/^\d{3,4}$/.test(data.cvv || "")) {
        ctx.addIssue({
          code: "custom",
          path: ["cvv"],
          message: "Enter a valid CVV.",
        });
      }
    }

    if (
      data.method === "upi" &&
      !/^[\w.-]{2,}@[a-zA-Z]{2,}[\w.-]*$/.test(data.upiId || "")
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["upiId"],
        message: "Enter a valid UPI ID.",
      });
    }
  });

type PaymentFormValues = z.infer<typeof paymentSchema>;

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
  const {
    register,
    setValue,
    trigger,
    control,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    mode: "onChange",
    defaultValues: {
      method: paymentMethod,
      cardNumber: "",
      cardName: "",
      expiry: "",
      cvv: "",
      promoCode: "",
      upiId: "",
    },
  });

  const cardNumber = useWatch({ control, name: "cardNumber" });
  const cardName = useWatch({ control, name: "cardName" });
  const expiry = useWatch({ control, name: "expiry" });
  const cvv = useWatch({ control, name: "cvv" });
  const promoCode = useWatch({ control, name: "promoCode" });
  const upiId = useWatch({ control, name: "upiId" });

  useEffect(() => {
    setValue("method", paymentMethod, { shouldValidate: true });
  }, [paymentMethod, setValue]);

  useEffect(() => {
    let isMounted = true;

    void trigger().then((isValid) => {
      if (isMounted) onValidationChange(isValid);
    });

    return () => {
      isMounted = false;
    };
  }, [
    paymentMethod,
    cardNumber,
    cardName,
    expiry,
    cvv,
    promoCode,
    upiId,
    trigger,
    onValidationChange,
  ]);

  const optionIcons = {
    card: CreditCard,
    upi: QrCode,
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
            <p>Choose a secure payment option to complete your order.</p>
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
                  onChange={() => {
                    setPaymentMethod(option.id);
                    setValue("method", option.id, { shouldValidate: true });
                  }}
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

        {paymentMethod === "card" ? (
          <>
            <div className="checkout-inline-highlight">
              <LockKeyhole className="size-5" />
              <div>
                <strong>Encrypted card payment</strong>
                <span>Your card details are protected with secure checkout.</span>
              </div>
            </div>

            <div className="checkout-two-col-grid">
              <label className="checkout-field">
                <span>Card Number</span>
                <input
                  {...register("cardNumber")}
                  type="text"
                  inputMode="numeric"
                  placeholder="1234 5678 9012 3456"
                  aria-invalid={Boolean(errors.cardNumber)}
                />
                {errors.cardNumber && (
                  <small className="form-error">
                    {errors.cardNumber.message}
                  </small>
                )}
              </label>

              <label className="checkout-field">
                <span>Name on Card</span>
                <input
                  {...register("cardName")}
                  type="text"
                  placeholder="Riya Rawat"
                  aria-invalid={Boolean(errors.cardName)}
                />
                {errors.cardName && (
                  <small className="form-error">{errors.cardName.message}</small>
                )}
              </label>
            </div>

            <div className="checkout-three-col-grid">
              <label className="checkout-field">
                <span>Expiry</span>
                <input
                  {...register("expiry")}
                  type="text"
                  placeholder="08/28"
                  aria-invalid={Boolean(errors.expiry)}
                />
                {errors.expiry && (
                  <small className="form-error">{errors.expiry.message}</small>
                )}
              </label>

              <label className="checkout-field">
                <span>CVV</span>
                <input
                  {...register("cvv")}
                  type="password"
                  inputMode="numeric"
                  placeholder="123"
                  aria-invalid={Boolean(errors.cvv)}
                />
                {errors.cvv && (
                  <small className="form-error">{errors.cvv.message}</small>
                )}
              </label>

              <label className="checkout-field">
                <span>
                  <BadgePercent className="size-4" /> Promo Code
                </span>
                <input
                  {...register("promoCode")}
                  type="text"
                  placeholder="ASR10"
                  aria-invalid={Boolean(errors.promoCode)}
                />
                {errors.promoCode && (
                  <small className="form-error">
                    {errors.promoCode.message}
                  </small>
                )}
              </label>
            </div>
          </>
        ) : paymentMethod === "upi" ? (
          <>
            <div className="checkout-inline-highlight">
              <WalletCards className="size-5" />
              <div>
                <strong>UPI selected</strong>
                <span>
                  Add your UPI ID so checkout can prepare the payment request.
                </span>
              </div>
            </div>

            <label className="checkout-field">
              <span>UPI ID</span>
              <input
                {...register("upiId")}
                type="text"
                placeholder="riya@upi"
                aria-invalid={Boolean(errors.upiId)}
              />
              {errors.upiId && (
                <small className="form-error">{errors.upiId.message}</small>
              )}
            </label>
          </>
        ) : (
          <div className="checkout-inline-highlight">
            <PackageCheck className="size-5" />
            <div>
              <strong>Cash on Delivery selected</strong>
              <span>Pay when the package reaches your doorstep.</span>
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
