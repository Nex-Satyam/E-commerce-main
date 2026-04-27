import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useState } from "react";
import axios from "axios";

export function AddressForm({ onComplete }: { onComplete: () => void }) {
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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
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
        onComplete();
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
            <p>Use your preferred address for doorstep delivery.</p>
          </div>
        </div>
        <div className="checkout-two-col-grid">
          <label className="checkout-field">
            <span>Full Name</span>
            <input name="fullName" value={form.fullName} onChange={handleChange} type="text" placeholder="Aarav Sharma" />
          </label>
          <label className="checkout-field">
            <span>Phone</span>
            <input name="phone" value={form.phone} onChange={handleChange} type="tel" placeholder="+91 98765 43210" />
          </label>
        </div>
        <label className="checkout-field">
          <span>Street Address</span>
          <input name="line1" value={form.line1} onChange={handleChange} type="text" placeholder="House no. 24, Greater Kailash" />
        </label>
        <div className="checkout-two-col-grid">
          <label className="checkout-field">
            <span>City</span>
            <input name="city" value={form.city} onChange={handleChange} type="text" placeholder="New Delhi" />
          </label>
          <label className="checkout-field">
            <span>Postal Code</span>
            <input name="pincode" value={form.pincode} onChange={handleChange} type="text" placeholder="110048" />
          </label>
        </div>
        <label className="checkout-field">
          <span>Landmark / Delivery Note</span>
          <input name="line2" value={form.line2} onChange={handleChange} type="text" placeholder="Near M Block Market, ring before delivery" />
        </label>
        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
        <button type="button" className="cta-btn" style={{marginTop: 16}} onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Continue to Payment"}
        </button>
      </CardContent>
    </Card>
  );
}
