"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Loader2, MapPin, Phone, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";

type AddressFormProps = {
  onComplete: (id?: string) => void;
};

const addressSchema = z.object({
  fullName: z.string().trim().min(2, "Enter the receiver's full name."),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$|^\+91[6-9]\d{9}$/, "Enter a valid Indian phone number."),
  line1: z.string().trim().min(5, "Enter a complete street address."),
  city: z.string().trim().min(2, "Enter city."),
  state: z.string().trim().optional(),
  pincode: z.string().trim().regex(/^\d{6}$/, "Enter a valid 6 digit pincode."),
  line2: z.string().trim().optional(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (
      error as { response?: { data?: { error?: unknown } } }
    ).response;

    if (typeof response?.data?.error === "string") {
      return response.data.error;
    }
  }

  return fallback;
}

export function AddressForm({ onComplete }: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      phone: "",
      line1: "",
      city: "",
      state: "",
      pincode: "",
      line2: "",
    },
  });

  const onSubmit = async (form: AddressFormValues) => {
    try {
      const res = await axios.post("/api/address", {
        fullName: form.fullName,
        phone: form.phone,
        line1: form.line1,
        line2: form.line2,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      });

      if (res.data.success) {
        const newAddressId =
          res.data.address?.id || res.data.data?.id || res.data.id;

        onComplete(newAddressId);
      } else {
        setError("root", {
          message: res.data.error || "Failed to save address",
        });
      }
    } catch (err: unknown) {
      setError("root", {
        message: getErrorMessage(err, "Failed to save address"),
      });
    }
  };

  return (
    <Card className="checkout-card py-0 shadow-none">
      <CardContent className="checkout-card-content">
        <form className="checkout-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="checkout-section-head">
          <div className="checkout-section-icon">
            <MapPin className="size-4" />
          </div>
          <div>
            <span className="checkout-section-label">New address</span>
            <h2>Delivery Address</h2>
            <p>Add your doorstep delivery details carefully.</p>
          </div>
        </div>

        <div className="checkout-two-col-grid">
          <label className="checkout-field">
            <span>
              <User className="size-4" /> Full Name
            </span>
            <input
              {...register("fullName")}
              type="text"
              placeholder="Riya Rawat"
              aria-invalid={Boolean(errors.fullName)}
            />
            {errors.fullName && (
              <small className="form-error">{errors.fullName.message}</small>
            )}
          </label>

          <label className="checkout-field">
            <span>
              <Phone className="size-4" /> Phone
            </span>
            <input
              {...register("phone")}
              type="tel"
              placeholder="9876543210"
              aria-invalid={Boolean(errors.phone)}
            />
            {errors.phone && (
              <small className="form-error">{errors.phone.message}</small>
            )}
          </label>
        </div>

        <label className="checkout-field">
          <span>
            <Home className="size-4" /> Street Address
          </span>
          <input
            {...register("line1")}
            type="text"
            placeholder="House no. 24, Balawala"
            aria-invalid={Boolean(errors.line1)}
          />
          {errors.line1 && (
            <small className="form-error">{errors.line1.message}</small>
          )}
        </label>

        <div className="checkout-two-col-grid">
          <label className="checkout-field">
            <span>City</span>
            <input
              {...register("city")}
              type="text"
              placeholder="Dehradun"
              aria-invalid={Boolean(errors.city)}
            />
            {errors.city && (
              <small className="form-error">{errors.city.message}</small>
            )}
          </label>

          <label className="checkout-field">
            <span>State</span>
            <input
              {...register("state")}
              type="text"
              placeholder="Uttarakhand"
              aria-invalid={Boolean(errors.state)}
            />
            {errors.state && (
              <small className="form-error">{errors.state.message}</small>
            )}
          </label>
        </div>

        <div className="checkout-two-col-grid">
          <label className="checkout-field">
            <span>Postal Code</span>
            <input
              {...register("pincode")}
              type="text"
              placeholder="248001"
              aria-invalid={Boolean(errors.pincode)}
            />
            {errors.pincode && (
              <small className="form-error">{errors.pincode.message}</small>
            )}
          </label>

          <label className="checkout-field">
            <span>Landmark / Delivery Note</span>
            <input
              {...register("line2")}
              type="text"
              placeholder="Near main road, call before delivery"
              aria-invalid={Boolean(errors.line2)}
            />
            {errors.line2 && (
              <small className="form-error">{errors.line2.message}</small>
            )}
          </label>
        </div>

        {errors.root?.message && (
          <div className="checkout-error-box">{errors.root.message}</div>
        )}

        <Button
          type="submit"
          className="checkout-primary-action"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving Address...
            </>
          ) : (
            "Continue to Payment"
          )}
        </Button>
        </form>
      </CardContent>
    </Card>
  );
}
