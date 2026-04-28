"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Home, Loader2, MapPin, Phone, User } from "lucide-react";
import { useState } from "react";
import axios from "axios";

type AddressFormProps = {
  onComplete: (id?: string) => void;
};

export function AddressForm({ onComplete }: AddressFormProps) {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    line1: "",
    city: "",
    pincode: "",
    line2: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.fullName || !form.phone || !form.line1 || !form.city || !form.pincode) {
      setError("Please fill all required address fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/address", {
        fullName: form.fullName,
        phone: form.phone,
        line1: form.line1,
        line2: form.line2,
        city: form.city,
        state: "",
        pincode: form.pincode,
      });

      if (res.data.success) {
        const newAddressId =
          res.data.address?.id || res.data.data?.id || res.data.id;

        onComplete(newAddressId);
      } else {
        setError(res.data.error || "Failed to save address");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="checkout-card py-0 shadow-none">
      <CardContent className="checkout-card-content">
        <div className="checkout-section-head">
          <div className="checkout-section-icon">
            <MapPin className="size-4" />
          </div>
          <div>
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
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              type="text"
              placeholder="Riya Rawat"
            />
          </label>

          <label className="checkout-field">
            <span>
              <Phone className="size-4" /> Phone
            </span>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              type="tel"
              placeholder="+91 98765 43210"
            />
          </label>
        </div>

        <label className="checkout-field">
          <span>
            <Home className="size-4" /> Street Address
          </span>
          <input
            name="line1"
            value={form.line1}
            onChange={handleChange}
            type="text"
            placeholder="House no. 24, Balawala"
          />
        </label>

        <div className="checkout-two-col-grid">
          <label className="checkout-field">
            <span>City</span>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              type="text"
              placeholder="Dehradun"
            />
          </label>

          <label className="checkout-field">
            <span>Postal Code</span>
            <input
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              type="text"
              placeholder="248001"
            />
          </label>
        </div>

        <label className="checkout-field">
          <span>Landmark / Delivery Note</span>
          <input
            name="line2"
            value={form.line2}
            onChange={handleChange}
            type="text"
            placeholder="Near main road, call before delivery"
          />
        </label>

        {error && <div className="checkout-error-box">{error}</div>}

        <button
          type="button"
          className="checkout-primary-action"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving Address...
            </>
          ) : (
            "Continue to Payment"
          )}
        </button>
      </CardContent>
    </Card>
  );
}