"use client";
import { useRouter } from 'next/navigation';
import { useRef,useState } from "react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
const MOCK_ADMIN = {
  email: "admin@nex.com",
  password: "admin123",
  name: "maiAdminHoon",
  role: "ADMIN",
};

type FieldErrors = {
  email?: string;
  password?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function AdminLoginPage() {
  const router = useRouter();
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  function validateForm() {
    const nextErrors: FieldErrors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      nextErrors.email = "Email address is required.";
    } else if (!isValidEmail(trimmedEmail)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password: password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      setIsSignedIn(true);

      window.setTimeout(() => {
        router.push("/admin/dashboard");
      }, 400);
    } catch (error) {
      setErrors({
        password: error instanceof Error ? error.message : "Invalid email or password.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function fillDemoCredentials() {
    setEmail(MOCK_ADMIN.email);
    setPassword(MOCK_ADMIN.password);
    setErrors({});
    window.setTimeout(() => submitButtonRef.current?.focus(), 0);
  }

  const emailInputClass = [
    "h-10 w-full rounded-lg border bg-white px-3 text-sm text-zinc-900 shadow-sm outline-none transition",
    "placeholder:text-zinc-400 focus:border-transparent focus:ring-2 focus:ring-blue-500",
    errors.email ? "border-red-400 ring-2 ring-red-200" : "border-zinc-200",
  ].join(" ");

  const passwordInputClass = [
    "h-10 w-full rounded-lg border bg-white px-3 pr-10 text-sm text-zinc-900 shadow-sm outline-none transition",
    "placeholder:text-zinc-400 focus:border-transparent focus:ring-2 focus:ring-blue-500",
    errors.password ? "border-red-400 ring-2 ring-red-200" : "border-zinc-200",
  ].join(" ");

  return (
    <main className="min-h-screen bg-zinc-50 font-[Inter,ui-sans-serif,system-ui,sans-serif] text-zinc-900 lg:flex">
      <aside className="relative hidden w-[45%] flex-col bg-zinc-900 px-10 py-9 lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-zinc-800 text-lg text-white">
            ◈
          </div>
          <span className="text-lg font-semibold text-white">NexGen</span>
        </div>

        <div className="flex flex-1 items-center">
          <div className="max-w-105">
            <h1 className="text-3xl font-semibold leading-snug text-white">
              Built for people who run the store.
            </h1>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Everything you need to manage products, orders, and your team.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Full order & inventory control",
                "Real-time notifications",
                "Revenue analytics at a glance",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3 text-sm text-zinc-300">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-xs text-white">
                    ✓
                  </span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-xs text-zinc-600">NexGem Admin v1.0</p>
      </aside>

      <section className="flex min-h-screen flex-1 items-center justify-center bg-white px-5 py-10 md:px-8">
        <div className="w-full max-w-100">
          <div>
            <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
              Admin access only
            </span>
            <h2 className="mt-3 text-2xl font-semibold text-zinc-900">Welcome back</h2>
            <p className="mt-1 text-sm text-zinc-500">Sign in to your admin account</p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium text-zinc-700">
                Email address
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                placeholder="admin@nex.com"
                autoComplete="email"
                className={emailInputClass}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "admin-email-error" : undefined}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setErrors((current) => ({ ...current, email: undefined }));
                }}
              />
              {errors.email ? (
                <p id="admin-email-error" role="alert" className="mt-1 text-xs text-red-500">
                  {errors.email}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-1.5 block text-sm font-medium text-zinc-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="admin123"
                  autoComplete="current-password"
                  className={passwordInputClass}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? "admin-password-error" : undefined}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setErrors((current) => ({ ...current, password: undefined }));
                  }}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center text-zinc-400 hover:text-zinc-600"
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-5">
                      <path
                        d="M3 3l18 18M10.6 10.6A2 2 0 0012 14a2 2 0 001.4-.6M9.9 5.2A9.8 9.8 0 0112 5c5 0 8.5 4 9.5 6.6a10.8 10.8 0 01-2.1 3.1M6.1 6.6a11.3 11.3 0 00-3.6 5C3.5 14.1 7 18 12 18c1 0 2-.2 2.9-.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-5">
                      <path
                        d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password ? (
                <p id="admin-password-error" role="alert" className="mt-1 text-xs text-red-500">
                  {errors.password}
                </p>
              ) : null}
            </div>

            <div className="flex items-center justify-between gap-4">
              <label htmlFor="remember-admin" className="flex items-center gap-2 text-sm text-zinc-600">
                <input
                  id="remember-admin"
                  type="checkbox"
                  checked={rememberMe}
                  className="size-4 rounded border-zinc-200 accent-zinc-900"
                  onChange={(event) => setRememberMe(event.target.checked)}
                />
                Remember me
              </label>
              <button
                type="button"
                className="text-sm text-blue-500 hover:underline"
                onClick={() => toast("Contact your super admin to reset password.")}
              >
                Forgot password?
              </button>
            </div>

            <button
              ref={submitButtonRef}
              type="submit"
              disabled={isLoading || isSignedIn}
              aria-busy={isLoading}
              className={[
                "flex h-10 w-full items-center justify-center gap-2 rounded-lg text-sm font-medium text-white shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed",
                isSignedIn ? "bg-green-500" : "bg-zinc-900 hover:bg-zinc-700 disabled:bg-zinc-900/70",
              ].join(" ")}
            >
              {isLoading ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Signing in...
                </>
              ) : isSignedIn ? (
                "✓ Signed in"
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-100" />
            <span className="text-xs text-zinc-400">or</span>
            <div className="h-px flex-1 bg-zinc-100" />
          </div>

          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 shadow-sm">
            <p className="mb-2 text-xs font-medium text-zinc-500">Demo credentials</p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="text-zinc-500">Email</span>
                <code className="font-mono text-zinc-700">{MOCK_ADMIN.email}</code>
              </div>
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="text-zinc-500">Password</span>
                <code className="font-mono text-zinc-700">{MOCK_ADMIN.password}</code>
              </div>
            </div>
            <button
              type="button"
              className="mt-3 text-xs text-blue-500 hover:underline"
              onClick={fillDemoCredentials}
            >
              Fill credentials →
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
