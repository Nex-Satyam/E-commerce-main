import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

type InformationSection = {
  title: string;
  body: string[];
};

type InformationPageViewProps = {
  eyebrow: string;
  title: string;
  description: string;
  highlights: string[];
  sections: InformationSection[];
};

export function InformationPageView({
  eyebrow,
  title,
  description,
  highlights,
  sections,
}: InformationPageViewProps) {
  return (
    <section className="information-page">
      <div className="information-breadcrumb">
        <Link href="/" className="wishlist-back-link">
          <ArrowLeft className="size-4" /> Back to home
        </Link>
        <span>/</span>
        <span>{title}</span>
      </div>

      <div className="information-hero-card">
        <div className="information-hero-copy">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        <div className="information-highlight-grid">
          {highlights.map((highlight) => (
            <div key={highlight} className="information-highlight-pill">
              <CheckCircle2 className="size-4" />
              <span>{highlight}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="information-section-grid">
        {sections.map((section) => (
          <article key={section.title} className="information-section-card">
            <h2>{section.title}</h2>
            <div className="information-section-copy">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}