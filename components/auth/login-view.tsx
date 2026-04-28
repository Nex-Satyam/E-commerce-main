"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { signIn } from "next-auth/react";

import { AuthShell } from "@/components/auth/auth-shell";
import { CtaButton } from "@/components/home/cta-button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginView() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Incorrect email or password.");
        return;
      }

      router.push("/");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main role="main" aria-label="Login page">
      <AuthShell
        eyebrow="Welcome Back"
        title="Sign in to continue shopping"
        description="Access your cart, wishlist, orders, and exclusive member offers."
        accentLabel="Member access"
        accentTitle="Secure sign in"
        accentDescription="Use your account credentials to access exclusive features.">
        <Card className="overflow-hidden rounded-2xl border border-neutral-200 shadow-sm">
          <CardContent className="px-6 py-8 md:px-10 md:py-10">
            {/* Header */}
            <div className="mb-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white font-bold text-lg">
                S
              </div>

              <h1 className="text-2xl font-bold text-neutral-900">
                Login to Your Account
              </h1>

              <p className="mt-1 text-sm text-neutral-500">
                Continue where you left off.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              aria-label="Sign in form"
              className="space-y-4"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="login-email"
                  className="mb-1 block text-sm font-medium text-neutral-700"
                >
                  Email Address
                </label>

                <Input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  autoComplete="username"
                  className="rounded-xl"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="login-password"
                  className="mb-1 block text-sm font-medium text-neutral-700"
                >
                  Password
                </label>

                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="rounded-xl pr-10"
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>

                {error && (
                  <p className="mt-2 flex items-center gap-1 text-sm text-red-500">
                    <AlertCircle className="size-4" />
                    {error}
                  </p>
                )}
              </div>

              {/* Remember / Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-neutral-500">
                  <input type="checkbox" className="rounded" />
                  Remember me
                </label>

                <Link
                  href="/forgot-password"
                  className="text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit */}
              <CtaButton
                type="submit"
                disabled={loading}
                className="w-full rounded-xl py-3 text-base font-semibold"
              >
                {loading ? "Signing In..." : "Sign In"}
              </CtaButton>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-neutral-200" />
              <span className="text-xs text-neutral-400">OR</span>
              <div className="h-px flex-1 bg-neutral-200" />
            </div>

            {/* Google Login */}
            <Button
              type="button"
              variant="outline"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full rounded-xl"
            >
              <img
                src="/google.svg"
                alt=""
                width={18}
                height={18}
                className="mr-2"
              />
              Continue with Google
            </Button>

            {/* Footer */}
            <p className="mt-6 text-center text-sm text-neutral-500">
              New here?{" "}
              <Link
                href="/signup"
                className="font-medium text-primary hover:underline"
              >
                Create Account
              </Link>
            </p>
          </CardContent>
        </Card>
      </AuthShell>
    </main>
  );
}