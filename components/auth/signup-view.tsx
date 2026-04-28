"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import axios from "axios";
import Image from "next/image";
export function SignupView() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignup = async () => {
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("/api/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone || "",
      });

      if (res.data.error) {
        alert(res.data.error);
        return;
      }

      const loginRes = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (loginRes?.error) {
        alert("Login failed after signup");
        return;
      }

      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Create Account"
      title="Create Your Account"
      description="Register to save wishlist items, track orders, and enjoy faster checkout."
      accentLabel="Customer Registration"
      accentTitle="Customer Signup Only"
      accentDescription="Administrative accounts are managed separately."
    >
      <Card className="w-full max-w-lg rounded-3xl border border-[#D3D1C7] bg-white shadow-sm">
        <CardContent className="p-8 md:p-10">
          <div className="mb-8 space-y-2">
            <h2 className="text-2xl font-bold text-[#2C2C2A]">
              Create your account
            </h2>
            <p className="text-sm text-[#5F5E5A]">
              Join now to manage orders, save products, and checkout faster.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignup();
            }}
            className="space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2C2C2A]">
                Full Name
              </label>
              <Input
                name="name"
                type="text"
                required
                placeholder="Rahul Koli"
                value={form.name}
                onChange={handleChange}
                className="h-11 rounded-xl border-[#D3D1C7] bg-[#F1EFE8] focus:border-[#185FA5] focus:ring-[#185FA5]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#2C2C2A]">
                Email Address
              </label>
              <Input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="h-11 rounded-xl border-[#D3D1C7] bg-[#F1EFE8] focus:border-[#185FA5] focus:ring-[#185FA5]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#2C2C2A]">
                Phone Number
              </label>
              <Input
                name="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={handleChange}
                className="h-11 rounded-xl border-[#D3D1C7] bg-[#F1EFE8] focus:border-[#185FA5] focus:ring-[#185FA5]"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="relative">
                <label className="mb-2 block text-sm font-medium text-[#2C2C2A]">
                  Password
                </label>
                <Input
                  name="password"
                  required
                  autoComplete="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
                  value={form.password}
                  onChange={handleChange}
                  className="h-11 rounded-xl border-[#D3D1C7] bg-[#F1EFE8] pr-10 focus:border-[#185FA5] focus:ring-[#185FA5]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-[42px] text-[#888780]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative">
                <label className="mb-2 block text-sm font-medium text-[#2C2C2A]">
                  Confirm Password
                </label>
                <Input
                  name="confirmPassword"
                  required
                  autoComplete="new-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="h-11 rounded-xl border-[#D3D1C7] bg-[#F1EFE8] pr-10 focus:border-[#185FA5] focus:ring-[#185FA5]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-[42px] text-[#888780]"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-[#5F5E5A]">
              <input
                type="checkbox"
                required
                className="accent-[#185FA5]"
              />
              I agree to the Terms & Privacy Policy
            </label>

            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-xl bg-[#185FA5] text-white hover:bg-[#154f89]"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="h-11 w-full rounded-xl border-[#D3D1C7] bg-white text-[#2C2C2A] hover:bg-[#F1EFE8]"
            >
             <Image
    src="/google.svg"
    alt="Google"
    width={18}
    height={18}
  />
              Continue with Google
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-[#5F5E5A]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-[#EF9F27] hover:underline"
            >
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthShell>
  );
}