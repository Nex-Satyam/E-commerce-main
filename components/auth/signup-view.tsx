"use client";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { CtaButton } from "@/components/home/cta-button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import axios from "axios";

export function SignupView() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    if (form.password !== form.confirmPassword) { alert("Passwords do not match"); return; }
    try {
      setLoading(true);
      const res = await axios.post("/api/register", { name: form.name?.trim(), email: form.email?.trim(), password: form.password, phone: form.phone || "" });
      if (res.data.error) { alert(res.data.error); return; }
      const loginRes = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      if (loginRes?.error) { alert("Login failed after signup"); return; }
      router.push("/");
    } catch (err: any) {
      console.error(err); alert("Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <AuthShell eyebrow="Create Account" title="Signup is available only for customers." description="Create your user account to save wishlist items, manage orders, and speed up checkout." accentLabel="User Registration" accentTitle="Customer-only signup" accentDescription="Admin roles are handled separately.">
      <Card className="auth-card py-0 shadow-none">
        <CardContent className="auth-card-content">
          <div className="auth-card-head">
            <p className="eyebrow">Signup</p>
            <h2>Create your user account</h2>
            <p>Register as a customer and start saving products, tracking orders, and checking out faster.</p>
          </div>
          <Button type="button" variant="outline" className="w-full mb-4 flex items-center justify-center gap-2" onClick={() => signIn("google", { callbackUrl: "/" })}>
            <img src="/google.svg" alt="Google" width={20} height={20} />
            Continue with Google
          </Button>
          <div className="auth-role-pill is-user-only"><BadgeCheck className="size-4" /> User role only</div>
          <form className="auth-form" onSubmit={(event) => { event.preventDefault(); handleSignup(); }}>
            <div className="auth-two-col-grid">
              <label className="auth-field"><span>First Name</span><Input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required /></label>
              <label className="auth-field"><span>Last Name</span></label>
            </div>
            <label className="auth-field"><span>Email Address</span><Input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required /></label>
            <label className="auth-field"><span>Phone Number</span><Input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" /></label>
            <div className="auth-two-col-grid">
              <label className="auth-field"><span>Password</span><Input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Create a password" required /></label>
              <label className="auth-field"><span>Confirm Password</span><Input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat your password" required /></label>
            </div>
            <label className="auth-checkbox-row"><input type="checkbox" /><span>I agree to the store terms and privacy policy.</span></label>
            <CtaButton type="submit" className="auth-submit-button" disabled={loading}>{loading ? "Creating..." : "Create User Account"}</CtaButton>
          </form>
          <div className="auth-footnote-block">
            <p>Already have an account? <Link href="/login" className="auth-inline-link">Login here</Link></p>
          </div>
        </CardContent>
      </Card>
    </AuthShell>
  );
}