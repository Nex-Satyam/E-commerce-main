"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useAuth } from "@/components/auth/auth-provider";
import { AuthShell } from "@/components/auth/auth-shell";
import { CtaButton } from "@/components/home/cta-button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginView() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthShell
      eyebrow="Account Access"
      title="One login page for both customer and admin access."
      description="Use a single sign-in form. The app automatically identifies whether the account belongs to an admin or a user from the account email."
      accentLabel="Unified Entry"
      accentTitle="Automatic role detection"
      accentDescription="Admin and user accounts use the same login screen. The role is inferred from the account identity instead of choosing a tab manually."
    >
      <Card className="auth-card py-0 shadow-xl border border-zinc-100 rounded-2xl overflow-hidden bg-transparent">
        <CardContent className="auth-card-content px-6 py-8 md:px-10 md:py-10">
          <div className="auth-card-head mb-2">
            <p className="eyebrow text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1">Login</p>
            <h2 className="text-2xl font-bold text-zinc-800 mb-1">Welcome back</h2>
            <p className="text-zinc-500 text-sm">Enter your account details to continue. Admin accounts are detected automatically after sign in.</p>
          </div>
          <div className="auth-role-pill mb-4">Role auto-detected on login</div>
          <form
            className="auth-form space-y-4"
            style={{ background: "none", borderRadius: 16, boxShadow: "none" }}
            onSubmit={async (event) => {
              event.preventDefault();
              try {
                const res = await signIn("credentials", {
                  email,
                  password,
                  redirect: false,
                });
                if (res?.error) {
                  alert("Invalid email or password ");
                  return;
                }
                router.push("/");
              } catch (err) {
                console.error(err);
                alert("Something went wrong");
              }
            }}
          >
            <label className="auth-field">
              <span className="font-medium text-zinc-700">Email Address</span>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com or admin@atelier.com"
                className="rounded-lg border border-zinc-200 focus:ring-2 focus:ring-blue-500 bg-white/90 shadow-sm mt-1"
                autoComplete="username"
              />
            </label>
            <label className="auth-field relative">
              <span className="font-medium text-zinc-700">Password</span>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="rounded-lg border border-zinc-200 focus:ring-2 focus:ring-blue-500 bg-white/90 shadow-sm pr-10 mt-1"
                autoComplete="current-password"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-9 flex items-center text-zinc-400 hover:text-blue-500 transition-colors"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                style={{ background: "none", border: 0, padding: 0 }}
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </label>
            <div className="auth-form-row flex items-center justify-between">
              <label className="auth-checkbox-row flex items-center gap-2">
                <input type="checkbox" className="accent-blue-500" />
                <span>Keep me signed in</span>
              </label>
              <Link href="/login" className="auth-inline-link text-blue-500 hover:underline">
                Forgot password?
              </Link>
            </div>
            <CtaButton type="submit" className="auth-submit-button w-full bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white shadow-lg transition-all text-base font-semibold py-2.5 rounded-xl mt-2">
              Login
            </CtaButton>
          </form>
          <Button
            type="button"
            variant="outline"
            className="w-full mt-6 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 border-blue-100 text-blue-700 font-medium transition"
            onClick={async () => await signIn("google", { callbackUrl: "/" })}
          >
            <img src="/google.svg" alt="Google" width={20} height={20} />
            Continue with Google
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full mt-3 flex items-center justify-center gap-2 border-zinc-200 text-zinc-700 hover:bg-zinc-100 font-medium transition"
          >
            <Link href="/admin/login">Login as Admin</Link>
          </Button>
          <div className="auth-footnote-block mt-8 text-center text-zinc-500 text-sm">
            <p>Customer accounts can be created from signup.<br/>Admin accounts are created internally and only use this login page.</p>
            <p className="mt-2">
              Need an account? <Link href="/signup" className="auth-inline-link text-blue-600 hover:underline font-medium">Create user account</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </AuthShell>
  );
}