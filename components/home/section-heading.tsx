type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  note?: string;
  split?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  note,
  split = false,
}: SectionHeadingProps) {
  return (
    <div className={split ? "section-heading split-heading" : "section-heading"}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {note ? <p className="section-note">{note}</p> : null}
    </div>
  );
}