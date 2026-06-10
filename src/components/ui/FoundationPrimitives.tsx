import type { HTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export interface FoundationMetricItem {
  label: ReactNode;
  value: ReactNode;
  description?: ReactNode;
}

interface FoundationSectionHeroProps {
  description: ReactNode;
  eyebrow: ReactNode;
  icon?: LucideIcon;
  metricNote?: ReactNode;
  metrics: FoundationMetricItem[];
  note?: ReactNode;
  noteLabel?: ReactNode;
  titleAccent: ReactNode;
  titleLead: ReactNode;
}

export function FoundationMetricRow({
  items,
}: {
  items: FoundationMetricItem[];
}) {
  return (
    <dl className="foundation-metric-row" data-foundation-metrics>
      {items.map((item, index) => (
        <div className="foundation-metric" key={`${index}-${String(item.label)}`}>
          <dt className="foundation-metric-label">{item.label}</dt>
          <dd className="foundation-metric-value">{item.value}</dd>
          {item.description ? (
            <dd className="foundation-metric-description">{item.description}</dd>
          ) : null}
        </div>
      ))}
    </dl>
  );
}

export function FoundationSectionHero({
  description,
  eyebrow,
  icon: Icon,
  metricNote,
  metrics,
  note,
  noteLabel,
  titleAccent,
  titleLead,
}: FoundationSectionHeroProps) {
  return (
    <header className="foundation-section-hero" data-foundation-section-hero>
      <div className="foundation-section-atmosphere" aria-hidden="true" />
      <div className="foundation-section-shell">
        <div className="foundation-hero-grid">
          <div className="min-w-0">
            <div className="foundation-section-eyebrow">
              {Icon ? <Icon className="h-3.5 w-3.5" aria-hidden="true" /> : null}
              <span>{eyebrow}</span>
            </div>
            <h2 className="foundation-section-title">
              <span>{titleLead}</span>{" "}
              <span className="foundation-section-title-accent">{titleAccent}</span>
            </h2>
            <div className="foundation-section-description">{description}</div>
          </div>

          {note ? (
            <aside className="foundation-hero-note">
              {noteLabel ? (
                <p className="foundation-hero-note-label">{noteLabel}</p>
              ) : null}
              <div className="foundation-hero-note-copy">{note}</div>
            </aside>
          ) : null}
        </div>

        <FoundationMetricRow items={metrics} />
        {metricNote ? (
          <div className="foundation-metric-note">{metricNote}</div>
        ) : null}
      </div>
    </header>
  );
}

type FoundationSectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

export function FoundationSection({
  children,
  className,
  ...props
}: FoundationSectionProps) {
  return (
    <section
      {...props}
      className={["foundation-section", className].filter(Boolean).join(" ")}
    >
      {children}
    </section>
  );
}

type HeadingLevel = "h2" | "h3" | "h4";

export function FoundationSectionHeader({
  aside,
  description,
  eyebrow,
  headingLevel = "h2",
  id,
  title,
}: {
  aside?: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  headingLevel?: HeadingLevel;
  id?: string;
  title: ReactNode;
}) {
  const Heading = headingLevel;

  return (
    <header className="foundation-section-header">
      <div className="min-w-0">
        {eyebrow ? (
          <div className="foundation-section-header-eyebrow">{eyebrow}</div>
        ) : null}
        <Heading id={id} className="foundation-section-header-title">
          {title}
        </Heading>
        {description ? (
          <div className="foundation-section-header-description">{description}</div>
        ) : null}
      </div>
      {aside ? <div className="foundation-section-header-aside">{aside}</div> : null}
    </header>
  );
}
