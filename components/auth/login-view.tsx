"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

  return (
    <AuthShell
      eyebrow="Account Access"
      title="One login page for both customer and admin access."
      description="Use a single sign-in form. The app automatically identifies whether the account belongs to an admin or a user from the account email."
      accentLabel="Unified Entry"
      accentTitle="Automatic role detection"
      accentDescription="Admin and user accounts use the same login screen. The role is inferred from the account identity instead of choosing a tab manually."
    >
      <Card className="auth-card py-0 shadow-none">
        <CardContent className="auth-card-content">
          <div className="auth-card-head">
            <p className="eyebrow">Login</p>
            <h2>Welcome back</h2>
            <p>Enter your account details to continue. Admin accounts are detected automatically after sign in.</p>
          </div>

          <div className="auth-role-pill">Role auto-detected on login</div>


          <Button
            type="button"
            variant="outline"
            className="w-full mb-4 flex items-center justify-center gap-2"
            onClick={async () => await signIn("google", { callbackUrl: "/" })}
          >
            <img src="/google.svg" alt="Google" width={20} height={20} />
            Continue with Google
          </Button>
          <form
            className="auth-form"
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
              <span>Email Address</span>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com or admin@atelier.com"
              />
            </label>

            <label className="auth-field">
              <span>Password</span>
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
              />
            </label>

            <div className="auth-form-row">
              <label className="auth-checkbox-row">
                <input type="checkbox" />
                <span>Keep me signed in</span>
              </label>
              <Link href="/login" className="auth-inline-link">
                Forgot password?
              </Link>
            </div>

            <CtaButton type="submit" className="auth-submit-button">
              Login
            </CtaButton>
          </form>

          <div className="auth-footnote-block">
            <p>Customer accounts can be created from signup. Admin accounts are created internally and only use this login page.</p>
            <p>
              Need an account? <Link href="/signup" className="auth-inline-link">Create user account</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </AuthShell>
  );
}