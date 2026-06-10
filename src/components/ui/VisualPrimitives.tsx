import type {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
} from "react";

type PageWidth = "compact" | "standard" | "wide";

const PAGE_WIDTHS: Record<PageWidth, string> = {
  compact: "max-w-[1120px]",
  standard: "max-w-[1280px]",
  wide: "max-w-[1400px]",
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function PageShell({
  children,
  className,
  width = "standard",
}: {
  children: ReactNode;
  className?: string;
  width?: PageWidth;
}) {
  return (
    <div
      className={cx(
        "page-shell",
        PAGE_WIDTHS[width],
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PageHero({
  actions,
  aside,
  description,
  eyebrow,
  title,
}: {
  actions?: ReactNode;
  aside?: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  title: ReactNode;
}) {
  return (
    <header className="page-hero">
      <div className={cx("grid gap-7", Boolean(aside) && "lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end")}>
        <div className="min-w-0">
          {eyebrow ? <div className="page-eyebrow">{eyebrow}</div> : null}
          <h1 className="page-h1">{title}</h1>
          {description ? <div className="page-lead">{description}</div> : null}
          {actions ? <div className="mt-6 flex flex-wrap items-center gap-3">{actions}</div> : null}
        </div>
        {aside ? <div className="page-hero-aside">{aside}</div> : null}
      </div>
    </header>
  );
}

export function SectionBlock({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cx("section-block", className)}>
      {children}
    </section>
  );
}

export function SectionIntroHeader({
  description,
  eyebrow,
  icon,
  title,
}: {
  description?: string;
  eyebrow: ReactNode;
  icon?: ReactNode;
  title: string;
}) {
  return (
    <header className="section-intro-header">
      <div className="section-intro-eyebrow">
        {icon}
        {eyebrow}
      </div>
      <h2 className="section-intro-title">{title}</h2>
      {description ? <p className="section-intro-description">{description}</p> : null}
    </header>
  );
}

export function SectionHeader({
  action,
  badge,
  description,
  eyebrow,
  title,
}: {
  action?: ReactNode;
  badge?: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  title: ReactNode;
}) {
  return (
    <header className="section-header">
      <div className="min-w-0">
        {eyebrow ? <div className="section-eyebrow">{eyebrow}</div> : null}
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="section-intro-title">{title}</h2>
          {badge}
        </div>
        {description ? <div className="section-intro-description">{description}</div> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

type PremiumCardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  interactive?: boolean;
};

export function PremiumCard({
  children,
  className,
  interactive = false,
  onPointerLeave,
  onPointerMove,
  ...props
}: PremiumCardProps) {
  return (
    <article
      {...props}
      className={cx("premium-card", interactive && "premium-card-interactive", className)}
      onPointerMove={(event) => {
        if (interactive) {
          const bounds = event.currentTarget.getBoundingClientRect();
          event.currentTarget.style.setProperty(
            "--surface-x",
            `${event.clientX - bounds.left}px`,
          );
          event.currentTarget.style.setProperty(
            "--surface-y",
            `${event.clientY - bounds.top}px`,
          );
        }
        onPointerMove?.(event);
      }}
      onPointerLeave={(event) => {
        event.currentTarget.style.removeProperty("--surface-x");
        event.currentTarget.style.removeProperty("--surface-y");
        onPointerLeave?.(event);
      }}
    >
      {children}
    </article>
  );
}

type StatusTone =
  | "beta"
  | "deprecated"
  | "draft"
  | "experimental"
  | "legacy"
  | "stable"
  | "success"
  | "warning";

const STATUS_CLASSES: Record<StatusTone, string> = {
  beta: "status-badge-beta",
  deprecated: "status-badge-deprecated",
  draft: "status-badge-draft",
  experimental: "status-badge-experimental",
  legacy: "status-badge-legacy",
  stable: "status-badge-stable",
  success: "status-badge-success",
  warning: "status-badge-warning",
};

export function StatusBadge({
  children,
  tone = "stable",
}: {
  children: ReactNode;
  tone?: StatusTone;
}) {
  return (
    <span className={cx("status-badge", STATUS_CLASSES[tone])}>
      <span className="status-badge-dot" aria-hidden />
      {children}
    </span>
  );
}

function StatePanel({
  action,
  className,
  description,
  icon,
  role,
  title,
}: {
  action?: ReactNode;
  className?: string;
  description: ReactNode;
  icon?: ReactNode;
  role?: "alert" | "status";
  title: ReactNode;
}) {
  return (
    <div role={role} className={cx("state-panel", className)}>
      {icon ? <div className="state-panel-icon">{icon}</div> : null}
      <div>
        <h3 className="state-panel-title">{title}</h3>
        <div className="state-panel-description">{description}</div>
      </div>
      {action ? <div className="state-panel-action">{action}</div> : null}
    </div>
  );
}

export function EmptyState(props: Omit<Parameters<typeof StatePanel>[0], "className" | "role">) {
  return <StatePanel {...props} className="state-panel-empty" role="status" />;
}

export function ErrorState(props: Omit<Parameters<typeof StatePanel>[0], "className" | "role">) {
  return <StatePanel {...props} className="state-panel-error" role="alert" />;
}

export function LoadingState({
  description,
  title,
}: {
  description: ReactNode;
  title: ReactNode;
}) {
  return (
    <StatePanel
      role="status"
      className="state-panel-loading"
      icon={
        <span className="state-loader" aria-hidden>
          <span />
          <span />
          <span />
        </span>
      }
      title={title}
      description={description}
    />
  );
}

export type PremiumSurfaceStyle = CSSProperties & {
  "--surface-x"?: string;
  "--surface-y"?: string;
};
