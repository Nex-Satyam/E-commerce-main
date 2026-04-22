import Link from "next/link";
import { ArrowUpRight, Clock3, Mail, MapPin, Phone, Sparkles } from "lucide-react";

import { footerLinks, footerSections, socialLinks } from "@/components/home/home-data";
import { CtaButton } from "@/components/home/cta-button";
import { Input } from "@/components/ui/input";

function isInternalLink(href: string) {
  return href.startsWith("/") && !href.startsWith("mailto:") && !href.startsWith("tel:");
}

export function SiteFooter() {
  return (
    <footer className="site-footer" id="footer">
      <div className="footer-ambient footer-ambient-one" aria-hidden="true" />
      <div className="footer-ambient footer-ambient-two" aria-hidden="true" />

      <div className="footer-hero-row">
        <div className="footer-brand-panel">
          <div className="footer-minimal-brand">
            <div className="footer-brand-mark">
              <span>ASR</span>
            </div>
            <div className="footer-brand-copy">
              <p className="eyebrow">Offwhite Atelier</p>
              <h2>Quiet essentials for a cleaner wardrobe.</h2>
              <p className="footer-brand-description">
                Designed in New Delhi with a softer palette, refined tailoring,
                and everyday silhouettes that feel elevated without excess.
              </p>
            </div>
          </div>

          <div className="footer-feature-pills">
            <span className="footer-feature-pill">
              <Sparkles className="size-4" /> Styling-led edits every week
            </span>
            <span className="footer-feature-pill">
              <MapPin className="size-4" /> Crafted for city dressing in India
            </span>
            <span className="footer-feature-pill">
              <Clock3 className="size-4" /> Fast response from client care
            </span>
          </div>

          <div className="footer-brand-stats">
            <div className="footer-stat-card">
              <strong>24h</strong>
              <span>Average client-care response</span>
            </div>
            <div className="footer-stat-card">
              <strong>14 days</strong>
              <span>Easy return support window</span>
            </div>
            <div className="footer-stat-card">
              <strong>Curated</strong>
              <span>Seasonal edits in limited runs</span>
            </div>
          </div>
        </div>

        <div className="footer-highlight-card">
          <p className="eyebrow">Client Care</p>
          <h3>Stay close to new drops and private edits.</h3>
          <p>
            Reach our team for sizing, delivery guidance, appointment requests,
            and seasonal curation recommendations.
          </p>
          <a className="footer-mail-link footer-mail-link-hero" href="mailto:hello@offwhiteatelier.com">
            <Mail className="size-4" /> hello@offwhiteatelier.com
          </a>
          <a className="footer-mail-link footer-mail-link-hero" href="tel:+919876543210">
            <Phone className="size-4" /> +91 98765 43210
          </a>
          <div className="footer-highlight-meta">
            <span>Mon to Sat, 10:00 AM to 8:00 PM</span>
            <span>New Delhi studio appointments available</span>
          </div>

          <div className="footer-highlight-badges">
            <span className="footer-highlight-badge">Private styling</span>
            <span className="footer-highlight-badge">Delivery support</span>
            <span className="footer-highlight-badge">Occasion edits</span>
          </div>

          <form className="footer-subscribe-form">
            <Input
              type="email"
              placeholder="Enter your email for atelier notes"
              className="footer-subscribe-input"
            />
            <CtaButton type="submit" className="footer-subscribe-button">
              Subscribe
            </CtaButton>
          </form>
        </div>
      </div>

      <div className="footer-link-grid">
        {footerSections.map((section) => (
          <div key={section.title} className="footer-link-column">
            <p className="footer-link-column-title">{section.title}</p>
            <div className="footer-link-list">
              {section.links.map((link) =>
                isInternalLink(link.href) ? (
                  <Link key={link.label} href={link.href}>
                    {link.label}
                  </Link>
                ) : (
                  <a key={link.label} href={link.href}>
                    {link.label}
                  </a>
                ),
              )}
            </div>
          </div>
        ))}

        <div className="footer-link-column footer-link-column-wide">
          <p className="footer-link-column-title">From The Atelier</p>
          <div className="footer-note-card">
            <p>
              Minimal dressing notes, early access product alerts, and select
              editorial drops curated for repeat wear.
            </p>
            <div className="footer-minimal-links">
              {footerLinks.slice(0, 3).map((link) =>
                isInternalLink(link.href) ? (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                ) : (
                  <a key={link.href} href={link.href}>
                    {link.label}
                  </a>
                ),
              )}
            </div>
            <div className="footer-note-grid">
              <div className="footer-note-pill">
                <span>Appointments</span>
                <strong>Private studio visits available</strong>
              </div>
              <div className="footer-note-pill">
                <span>Shipping</span>
                <strong>Complimentary over ₹120</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-minimal-bottom">
        <div className="footer-meta-inline">
          <p>© 2026 ASR Offwhite Atelier</p>
          <span>New Delhi, India</span>
          <span>Mon to Sat, 10:00 AM to 8:00 PM</span>
        </div>

        <div className="footer-actions-inline">
          <a className="footer-mail-link" href="mailto:hello@offwhiteatelier.com">
            <Mail className="size-4" /> hello@offwhiteatelier.com
          </a>
          <div className="footer-inline-links">
            {socialLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
          <a className="footer-back-top" href="#slider">
            Back to top <ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}