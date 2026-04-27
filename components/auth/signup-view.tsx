
"use client";
import Link from "next/link";
import { BadgeCheck, Eye, EyeOff } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { CtaButton } from "@/components/home/cta-button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import axios from "axios";

export function SignupView() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    <AuthShell
      eyebrow="Create Account"
      title="Signup is available only for customers."
      description="Create your user account to save wishlist items, manage orders, and speed up checkout."
      accentLabel="User Registration"
      accentTitle="Customer-only signup"
      accentDescription="Admin roles are handled separately."
    >
      <div
        style={{
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5ff 100%)",
          borderRadius: 28,
          boxShadow: "0 8px 32px 0 rgba(60,60,120,0.10)",
          padding: 0,
        }}
        className="p-1"
      >
        <Card className="auth-card py-0 shadow-xl border border-zinc-100 rounded-2xl overflow-hidden">
          <CardContent className="auth-card-content px-6 py-8 md:px-10 md:py-10">
            <div className="auth-card-head mb-2">
              <p className="eyebrow text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1">Signup</p>
              <h2 className="text-2xl font-bold text-zinc-800 mb-1">Create your user account</h2>
              <p className="text-zinc-500 text-sm">Register as a customer and start saving products, tracking orders, and checking out faster.</p>
            </div>
            <div className="flex items-center gap-2 my-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
              <span className="text-xs text-zinc-400">or</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-zinc-200 to-transparent" />
            </div>
            <div className="auth-role-pill is-user-only mb-4 flex items-center gap-2 bg-zinc-100 text-zinc-700 px-3 py-1 rounded-full w-max text-xs font-medium">
              <BadgeCheck className="size-4 text-blue-500" /> User role only
            </div>
            <form
              className="auth-form space-y-4"
              style={{ background: "none", borderRadius: 18, boxShadow: "none" }}
              onSubmit={(event) => { event.preventDefault(); handleSignup(); }}
            >
              <div className="auth-two-col-grid gap-4">
                <label className="auth-field w-full">
                  <span className="font-medium text-zinc-700">Full Name</span>
                  <Input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required className="rounded-lg border border-zinc-200 focus:ring-2 focus:ring-blue-500 bg-white/90 shadow-sm mt-1" />
                </label>
                <div></div>
              </div>
              <label className="auth-field">
                <span className="font-medium text-zinc-700">Email Address</span>
                <Input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required className="rounded-lg border border-zinc-200 focus:ring-2 focus:ring-blue-500 bg-white/90 shadow-sm mt-1" />
              </label>
              <label className="auth-field">
                <span className="font-medium text-zinc-700">Phone Number</span>
                <Input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" className="rounded-lg border border-zinc-200 focus:ring-2 focus:ring-blue-500 bg-white/90 shadow-sm mt-1" />
              </label>
              <div className="auth-two-col-grid gap-4">
                <label className="auth-field relative w-full">
                  <span className="font-medium text-zinc-700">Password</span>
                  <Input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="Create a password" required className="rounded-lg border border-zinc-200 focus:ring-2 focus:ring-blue-500 bg-white/90 shadow-sm pr-10 mt-1" autoComplete="new-password" />
                  <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-9 flex items-center text-zinc-400 hover:text-blue-500 transition-colors" tabIndex={-1} onClick={() => setShowPassword((v) => !v)} style={{ background: "none", border: 0, padding: 0 }}>
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </label>
                <label className="auth-field relative w-full">
                  <span className="font-medium text-zinc-700">Confirm Password</span>
                  <Input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat your password" required className="rounded-lg border border-zinc-200 focus:ring-2 focus:ring-blue-500 bg-white/90 shadow-sm pr-10 mt-1" autoComplete="new-password" />
                  <button type="button" aria-label={showConfirmPassword ? "Hide password" : "Show password"} className="absolute right-3 top-9 flex items-center text-zinc-400 hover:text-blue-500 transition-colors" tabIndex={-1} onClick={() => setShowConfirmPassword((v) => !v)} style={{ background: "none", border: 0, padding: 0 }}>
                    {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </label>
              </div>
              <label className="auth-checkbox-row flex items-center gap-2 mt-2"><input type="checkbox" className="accent-blue-500" /><span className="text-zinc-600">I agree to the store terms and privacy policy.</span></label>
              <CtaButton type="submit" className="auth-submit-button w-full bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white shadow-lg transition-all text-base font-semibold py-2.5 rounded-xl mt-2" disabled={loading}>{loading ? "Creating..." : "Create User Account"}</CtaButton>
              <Button
                type="button"
                variant="outline"
                className="w-full mt-6 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 border-blue-100 text-blue-700 font-medium transition"
                onClick={() => signIn("google", { callbackUrl: "/" })}
              >
                <img src="/google.svg" alt="Google" width={20} height={20} />
                Continue with Google
              </Button>
            </form>
            <div className="auth-footnote-block mt-8 text-center text-zinc-500 text-sm">
              <p>Already have an account? <Link href="/login" className="auth-inline-link text-blue-600 hover:underline font-medium">Login here</Link></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthShell>
  );
}