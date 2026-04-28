
"use client";
import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, CheckCircle2, Eye, EyeOff, Loader2, LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import axios from "axios";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthShell } from "@/components/auth/auth-shell";
import { CtaButton } from "@/components/home/cta-button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const signupSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your full name."),
    email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
    phone: z
      .string()
      .trim()
      .refine(
        (value) =>
          !value ||
          /^[6-9]\d{9}$|^\+91[6-9]\d{9}$/.test(value.replace(/\s/g, "")),
        "Enter a valid Indian phone number.",
      ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Add one uppercase letter.")
      .regex(/[a-z]/, "Add one lowercase letter.")
      .regex(/\d/, "Add one number."),
    confirmPassword: z.string().min(1, "Confirm your password."),
    terms: z.boolean().refine((value) => value, "Accept the terms to continue."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

type SignupFormValues = z.infer<typeof signupSchema>;

function getSignupErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (
      error as { response?: { data?: { error?: unknown; message?: unknown } } }
    ).response;

    if (typeof response?.data?.error === "string") return response.data.error;
    if (typeof response?.data?.message === "string") return response.data.message;
  }

  return "Something went wrong. Please try again.";
}

export function SignupView() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });
  const passwordValue = useWatch({ control, name: "password" }) || "";
  const passwordChecks = [
    { label: "8 characters", valid: passwordValue.length >= 8 },
    { label: "Uppercase", valid: /[A-Z]/.test(passwordValue) },
    { label: "Lowercase", valid: /[a-z]/.test(passwordValue) },
    { label: "Number", valid: /\d/.test(passwordValue) },
  ];
  const passwordScore = passwordChecks.filter((check) => check.valid).length;

  const handleSignup = async (form: SignupFormValues) => {
    try {
      const res = await axios.post("/api/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.replace(/\s/g, ""),
      });

      if (res.data.error) {
        setError("root", { message: res.data.error });
        return;
      }

      const loginRes = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (loginRes?.error) {
        setError("root", { message: "Login failed after signup." });
        return;
      }

      router.push("/");
    } catch (err: unknown) {
      console.error(err);
      setError("root", { message: getSignupErrorMessage(err) });
    }
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
      <div className="auth-frame">
        <Card className="auth-card auth-modern-card py-0 shadow-none">
          <CardContent className="auth-card-content">
            <div className="auth-card-head">
              <div className="auth-card-icon">
                <UserRound className="size-5" />
              </div>
              <p className="eyebrow">Signup</p>
              <h2>Create your user account</h2>
              <p>Register as a customer and start saving products, tracking orders, and checking out faster.</p>
            </div>
            <div className="auth-role-pill is-user-only">
              <BadgeCheck className="size-4" /> User role only
            </div>
            <div className="auth-mini-benefits">
              <span>
                <CheckCircle2 className="size-4" />
                Wishlist and order history
              </span>
              <span>
                <CheckCircle2 className="size-4" />
                Faster checkout profile
              </span>
            </div>
            <form
              className="auth-form"
              onSubmit={handleSubmit(handleSignup)}
              noValidate
            >
              <div className="auth-two-col-grid">
                <label className="auth-field">
                  <span>
                    <UserRound className="size-4" />
                    Full Name
                  </span>
                  <Input
                    {...register("name")}
                    type="text"
                    placeholder="Full Name"
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name && (
                    <small className="form-error">{errors.name.message}</small>
                  )}
                </label>
                <div></div>
              </div>
              <label className="auth-field">
                <span>
                  <Mail className="size-4" />
                  Email Address
                </span>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="you@example.com"
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email && (
                  <small className="form-error">{errors.email.message}</small>
                )}
              </label>
              <label className="auth-field">
                <span>
                  <Phone className="size-4" />
                  Phone Number
                </span>
                <Input
                  {...register("phone")}
                  type="tel"
                  placeholder="+91 98765 43210"
                  aria-invalid={Boolean(errors.phone)}
                />
                {errors.phone && (
                  <small className="form-error">{errors.phone.message}</small>
                )}
              </label>
              <div className="auth-two-col-grid">
                <label className="auth-field relative">
                  <span>
                    <LockKeyhole className="size-4" />
                    Password
                  </span>
                  <Input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className="pr-11"
                    autoComplete="new-password"
                    aria-invalid={Boolean(errors.password)}
                  />
                  <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} className="auth-password-toggle" tabIndex={-1} onClick={() => setShowPassword((v) => !v)}>
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                  {errors.password && (
                    <small className="form-error">{errors.password.message}</small>
                  )}
                </label>
                <label className="auth-field relative">
                  <span>
                    <LockKeyhole className="size-4" />
                    Confirm Password
                  </span>
                  <Input
                    {...register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repeat your password"
                    className="pr-11"
                    autoComplete="new-password"
                    aria-invalid={Boolean(errors.confirmPassword)}
                  />
                  <button type="button" aria-label={showConfirmPassword ? "Hide password" : "Show password"} className="auth-password-toggle" tabIndex={-1} onClick={() => setShowConfirmPassword((v) => !v)}>
                    {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                  {errors.confirmPassword && (
                    <small className="form-error">
                      {errors.confirmPassword.message}
                    </small>
                  )}
                </label>
              </div>
              <div className="auth-password-strength">
                <div className="auth-strength-head">
                  <span>Password strength</span>
                  <strong>{passwordScore < 2 ? "Weak" : passwordScore < 4 ? "Good" : "Strong"}</strong>
                </div>
                <div className="auth-strength-meter" data-score={passwordScore}>
                  <span style={{ width: `${(passwordScore / passwordChecks.length) * 100}%` }} />
                </div>
                <div className="auth-password-checks">
                  {passwordChecks.map((check) => (
                    <span key={check.label} className={check.valid ? "is-valid" : ""}>
                      <CheckCircle2 className="size-3.5" />
                      {check.label}
                    </span>
                  ))}
                </div>
              </div>
              <label className="auth-checkbox-row"><input {...register("terms")} type="checkbox" /><span>I agree to the store terms and privacy policy.</span></label>
              {errors.terms && (
                <small className="form-error">{errors.terms.message}</small>
              )}
              {errors.root?.message && (
                <div className="checkout-error-box">{errors.root.message}</div>
              )}
              <CtaButton type="submit" className="auth-submit-button" disabled={isSubmitting || !isValid}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create User Account"
                )}
              </CtaButton>
              <div className="auth-divider"><span>or continue with</span></div>
              <Button
                type="button"
                variant="outline"
                className="auth-provider-button"
                onClick={() => signIn("google", { callbackUrl: "/" })}
              >
                <Image src="/google.svg" alt="Google" width={20} height={20} />
                Continue with Google
              </Button>
            </form>
            <div className="auth-footnote-block">
              <p>Already have an account? <Link href="/login" className="auth-inline-link">Login here</Link></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthShell>
  );
}
