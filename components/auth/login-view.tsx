"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, Eye, EyeOff, Loader2, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthShell } from "@/components/auth/auth-shell";
import { CtaButton } from "@/components/home/cta-button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginView() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (res?.error) {
        setError("root", { message: "Invalid email or password." });
        return;
      }

      router.push("/");
    } catch (err: unknown) {
      console.error(err);
      setError("root", { message: "Something went wrong. Please try again." });
    }
  };

  return (
    <AuthShell
      eyebrow="Account Access"
      title="One login page for both customer and admin access."
      description="Use a single sign-in form. The app automatically identifies whether the account belongs to an admin or a user from the account email."
      accentLabel="Unified Entry"
      accentTitle="Automatic role detection"
      accentDescription="Admin and user accounts use the same login screen. The role is inferred from the account identity instead of choosing a tab manually."
    >
      <Card className="auth-card auth-modern-card py-0 shadow-none">
        <CardContent className="auth-card-content">
          <div className="auth-card-head">
            <div className="auth-card-icon">
              <LockKeyhole className="size-5" />
            </div>
            <p className="eyebrow">Login</p>
            <h2>Welcome back</h2>
            <p>Enter your account details to continue. Admin accounts are detected automatically after sign in.</p>
          </div>
          <div className="auth-role-pill">
            <ShieldCheck className="size-4" />
            Role auto-detected on login
          </div>
          <div className="auth-mini-benefits">
            <span>
              <CheckCircle2 className="size-4" />
              Secure account session
            </span>
            <span>
              <CheckCircle2 className="size-4" />
              Cart and wishlist restored
            </span>
          </div>
          <form
            className="auth-form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <label className="auth-field">
              <span>
                <Mail className="size-4" />
                Email Address
              </span>
              <Input
                {...register("email")}
                type="email"
                placeholder="you@example.com or admin@atelier.com"
                autoComplete="username"
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && (
                <small className="form-error">{errors.email.message}</small>
              )}
            </label>
            <label className="auth-field relative">
              <span>
                <LockKeyhole className="size-4" />
                Password
              </span>
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pr-11"
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="auth-password-toggle"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
              {errors.password && (
                <small className="form-error">{errors.password.message}</small>
              )}
            </label>
            <div className="auth-form-row">
              <label className="auth-checkbox-row">
                <input {...register("remember")} type="checkbox" />
                <span>Keep me signed in</span>
              </label>
              <Link href="/login" className="auth-inline-link">
                Forgot password?
              </Link>
            </div>
            {errors.root?.message && (
              <div className="checkout-error-box">{errors.root.message}</div>
            )}
            <CtaButton type="submit" className="auth-submit-button" disabled={isSubmitting || !isValid}>
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Login"
              )}
            </CtaButton>
          </form>
          <div className="auth-divider"><span>or continue with</span></div>
          <Button
            type="button"
            variant="outline"
            className="auth-provider-button"
            onClick={async () => await signIn("google", { callbackUrl: "/" })}
          >
            <Image src="/google.svg" alt="Google" width={20} height={20} />
            Continue with Google
          </Button>
          <Button
            asChild
            variant="outline"
            className="auth-provider-button"
          >
            <Link href="/admin/login">Login as Admin</Link>
          </Button>
          <div className="auth-footnote-block">
            <p>Customer accounts can be created from signup.<br/>Admin accounts are created internally and only use this login page.</p>
            <p>
              Need an account? <Link href="/signup" className="auth-inline-link">Create user account</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
