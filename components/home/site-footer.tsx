import Link from "next/link";
import { Mail, Phone, ArrowUpRight } from "lucide-react";

import {
  footerSections,
  socialLinks,
} from "@/components/home/home-data";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function isInternalLink(href: string) {
  return href.startsWith("/") && !href.startsWith("mailto:") && !href.startsWith("tel:");
}

export function SiteFooter() {
  return (
    <footer
      id="footer"
      className="bg-[#2C2C2A] text-white"
    >
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Top Section */}
        <div className="grid gap-12 lg:grid-cols-4 border-b border-white/10 pb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl font-bold tracking-tight text-white">
              ASR
            </Link>

            <p className="mt-4 text-sm leading-7 text-white/70">
              Premium essentials crafted for modern wardrobes. Clean silhouettes,
              elevated basics, and timeless style.
            </p>

            <div className="mt-6 space-y-3 text-sm text-white/70">
              <a
                href="mailto:hello@nexgen.com"
                className="flex items-center gap-2 hover:text-[#EF9F27]"
              >
                <Mail size={16} />
                hello@nexgen.com
              </a>

              <a
                href="tel:+919876543210"
                className="flex items-center gap-2 hover:text-[#EF9F27]"
              >
                <Phone size={16} />
                +91 98765 43210
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
                {section.title}
              </h3>

              <div className="mt-4 space-y-3">
                {section.links.map((link) =>
                  isInternalLink(link.href) ? (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="block text-sm text-white/70 hover:text-[#EF9F27]"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      key={link.label}
                      href={link.href}
                      className="block text-sm text-white/70 hover:text-[#EF9F27]"
                    >
                      {link.label}
                    </a>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="grid gap-8 border-b border-white/10 py-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h3 className="text-xl font-semibold text-white">
              Join Our Newsletter
            </h3>
            <p className="mt-2 text-sm text-white/70">
              Get updates on new arrivals, exclusive offers, and product drops.
            </p>
          </div>

          <form className="flex flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              placeholder="Enter your email"
              className="h-11 border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-[#185FA5]"
            />
            <Button className="h-11 bg-[#185FA5] px-6 text-white hover:bg-[#154f89]">
              Subscribe
            </Button>
          </form>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col gap-6 pt-8 text-sm text-white/60 lg:flex-row lg:items-center lg:justify-between">
          <p>© 2026 ASR. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-5">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#EF9F27]"
              >
                {link.label}
              </a>
            ))}

            <a
              href="#top"
              className="inline-flex items-center gap-1 hover:text-[#EF9F27]"
            >
              Back to top
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}