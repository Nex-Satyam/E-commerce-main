"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowUpRight,
  BadgeCheck,
  Clock3,
  Headphones,
  Mail,
  MapPin,
  MessageCircle,
  PackageCheck,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

import {
  footerLinks,
  footerSections,
  socialLinks,
} from "@/components/home/home-data";
import { CtaButton } from "@/components/home/cta-button";
import { Input } from "@/components/ui/input";

const newsletterSchema = z.object({
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
});

type NewsletterValues = z.infer<typeof newsletterSchema>;

function isInternalLink(href: string) {
  return (
    href.startsWith("/") && !href.startsWith("mailto:") && !href.startsWith("tel:")
  );
}

const serviceItems = [
  {
    icon: Truck,
    title: "Fast dispatch",
    copy: "Priority packing for ready-to-ship edits.",
  },
  {
    icon: ShieldCheck,
    title: "Secure checkout",
    copy: "Protected payments and private order handling.",
  },
  {
    icon: PackageCheck,
    title: "Quality checked",
    copy: "Every piece is inspected before it leaves us.",
  },
  {
    icon: Headphones,
    title: "Client care",
    copy: "Sizing, delivery, and styling help when needed.",
  },
];

const tickerItems = [
  "New silhouettes every week",
  "Monochrome essentials",
  "Tailored in limited runs",
  "Client care from New Delhi",
  "Secure checkout",
  "7 day return support",
];

export function SiteFooter() {
  const tickerLoop = [...tickerItems, ...tickerItems];
  const [subscribedEmail, setSubscribedEmail] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterValues>({
    resolver: zodResolver(newsletterSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  });

  const handleNewsletterSubmit = (values: NewsletterValues) => {
    setSubscribedEmail(values.email);
    reset();
  };

  return (
    <footer className="site-footer" id="footer">
      <div className="footer-marquee" aria-label="Atelier highlights">
        <div className="footer-marquee-track">
          {tickerLoop.map((item, index) => (
            <span key={`${item}-${index}`}>
              <Sparkles className="size-4" />
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="footer-hero-row">
        <div className="footer-brand-panel">
          <div className="footer-minimal-brand">
            <div className="footer-brand-mark">
              <span>ASR</span>
            </div>
            <div className="footer-brand-copy">
              <p className="eyebrow">Offwhite Atelier</p>
              <h2>Quiet essentials, shaped for modern wardrobes.</h2>
              <p className="footer-brand-description">
                A monochrome-first studio for refined everyday dressing,
                considered fits, and pieces that stay useful beyond the season.
              </p>
            </div>
          </div>

          <div className="footer-service-grid">
            {serviceItems.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="footer-service-card">
                  <span className="footer-service-icon">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.copy}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="footer-highlight-card">
          <div className="footer-card-kicker">
            <BadgeCheck className="size-4" />
            Private client desk
          </div>
          <h3>Get early access, styling notes, and delivery support.</h3>
          <p>
            Join the atelier list for new drop alerts, size guidance, occasion
            edits, and quieter wardrobe ideas.
          </p>

          <form
            className="footer-subscribe-form"
            onSubmit={handleSubmit(handleNewsletterSubmit)}
            noValidate
          >
            <div className="footer-input-shell">
              <Mail className="size-4" />
              <Input
                {...register("email")}
                type="email"
                placeholder="Email address"
                className="footer-subscribe-input"
                aria-invalid={Boolean(errors.email)}
              />
            </div>
            <CtaButton type="submit" className="footer-subscribe-button">
              <span>
                Join <Send className="size-4" />
              </span>
            </CtaButton>
            {errors.email && (
              <small className="form-error footer-form-message">
                {errors.email.message}
              </small>
            )}
            {subscribedEmail && !errors.email && (
              <small className="form-success footer-form-message">
                Added {subscribedEmail} to the atelier list.
              </small>
            )}
          </form>

          <div className="footer-contact-row">
            <a
              className="footer-contact-pill"
              href="mailto:hello@offwhiteatelier.com"
            >
              <Mail className="size-4" /> Email us
            </a>
            <a className="footer-contact-pill" href="tel:+919876543210">
              <Phone className="size-4" /> Call studio
            </a>
            <a className="footer-contact-pill" href="#footer">
              <MessageCircle className="size-4" /> Styling help
            </a>
          </div>

          <div className="footer-highlight-meta">
            <span>
              <Clock3 className="size-4" /> Mon to Sat, 10:00 AM to 8:00 PM
            </span>
            <span>
              <MapPin className="size-4" /> New Delhi studio appointments
            </span>
          </div>
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
          <p className="footer-link-column-title">Atelier Notes</p>
          <div className="footer-note-card">
            <p>
              Minimal dressing notes, product care reminders, and early access
              links curated for repeat wear.
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
                <strong>Complimentary over Rs. 120</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-minimal-bottom">
        <div className="footer-meta-inline">
          <p>Copyright 2026 ASR Offwhite Atelier</p>
          <span>New Delhi, India</span>
          <span>Designed for quiet daily wear</span>
        </div>

        <div className="footer-actions-inline">
          <div className="footer-inline-links">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
              >
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
