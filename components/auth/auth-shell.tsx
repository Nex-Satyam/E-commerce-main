import { BadgeCheck, Heart, PackageCheck, ShieldCheck, Sparkles } from "lucide-react";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  accentLabel: string;
  accentTitle: string;
  accentDescription: string;
  children: React.ReactNode;
};

export function AuthShell({
  eyebrow,
  title,
  description,
  accentLabel,
  accentTitle,
  accentDescription,
  children,
}: AuthShellProps) {
  return (
    <main className="auth-page">
      <section className="auth-layout">
        <div className="auth-intro">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>

          <div className="auth-highlight-card">
            <div className="auth-highlight-icon">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="eyebrow">{accentLabel}</p>
              <h2>{accentTitle}</h2>
              <p>{accentDescription}</p>
            </div>
          </div>

          <div className="auth-feature-list">
            <span>
              <Sparkles className="size-4" /> Personal order history and wishlist sync
            </span>
            <span>
              <Sparkles className="size-4" /> Admin access uses the same login screen with role-based entry
            </span>
          </div>

          <div className="auth-trust-grid" aria-label="Account benefits">
            <div>
              <ShieldCheck className="size-5" />
              <span>Secure</span>
              <strong>Protected session</strong>
            </div>
            <div>
              <Heart className="size-5" />
              <span>Wishlist</span>
              <strong>Saved favorites</strong>
            </div>
            <div>
              <PackageCheck className="size-5" />
              <span>Orders</span>
              <strong>Track delivery</strong>
            </div>
            <div>
              <BadgeCheck className="size-5" />
              <span>Checkout</span>
              <strong>Faster flow</strong>
            </div>
          </div>
        </div>

        <div className="auth-form-panel">{children}</div>
      </section>
    </main>
  );
}
