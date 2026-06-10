import {
  Accessibility,
  Activity,
  AlignLeft,
  BadgeCheck,
  Bell,
  BookOpenCheck,
  CalendarDays,
  ClipboardCheck,
  Command,
  Gauge,
  Info,
  Layers3,
  LayoutGrid,
  ListChecks,
  LoaderCircle,
  MessageCircleQuestion,
  MousePointerClick,
  PanelsTopLeft,
  Route,
  Search,
  Shapes,
  Table2,
  ToggleLeft,
  TriangleAlert,
  Type,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ComponentDoc } from "./componentPresentation";

const FEATURE_ICONS: Record<string, LucideIcon> = {
  accessibility: Accessibility,
  action: MousePointerClick,
  alert: TriangleAlert,
  audit: ClipboardCheck,
  calendar: CalendarDays,
  choice: ListChecks,
  command: Command,
  confidence: Gauge,
  content: AlignLeft,
  data: Table2,
  explanation: MessageCircleQuestion,
  feedback: Activity,
  hierarchy: Layers3,
  icon: Shapes,
  loading: LoaderCircle,
  navigation: Route,
  notification: Bell,
  responsive: PanelsTopLeft,
  search: Search,
  source: BookOpenCheck,
  state: ToggleLeft,
  structure: LayoutGrid,
  typography: Type,
  validation: BadgeCheck,
};

function featureClassName(index: number, total: number): string {
  return [
    "min-w-0 border-white/[0.07]",
    index > 0 ? "border-t pt-5" : "",
    "sm:border-t-0 sm:pt-0",
    index >= 2 ? "sm:border-t sm:pt-5" : "",
    index % 2 === 1 ? "sm:border-l sm:pl-5" : "",
    total === 3 && index === 2 ? "sm:col-span-2 xl:col-span-1" : "",
    "xl:border-t-0 xl:pt-0",
    index > 0 ? "xl:border-l xl:pl-6" : "",
  ].filter(Boolean).join(" ");
}

export function ComponentAboutCard({
  className = "",
  componentId,
  title,
  commonUsesLabel,
  about,
  features,
  commonUses,
}: {
  className?: string;
  componentId: string;
  title: string;
  commonUsesLabel: string;
  about: string;
  features: ComponentDoc["aboutFeatures"];
  commonUses: string[];
}) {
  const headingId = `component-about-${componentId}`;
  const desktopColumns = features.length === 4 ? "xl:grid-cols-4" : "xl:grid-cols-3";

  return (
    <article
      data-component-about={componentId}
      aria-labelledby={headingId}
      className={`overflow-hidden rounded-[20px] border border-white/[0.085] bg-black/20 ${className}`.trim()}
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-primary/15 bg-primary/[0.055] text-primary">
            <Info className="h-4 w-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <h3
              id={headingId}
              className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary"
            >
              {title}
            </h3>
            <p className="mt-3 max-w-[70ch] text-sm leading-7 text-slate-300">
              {about}
            </p>
          </div>
        </div>
      </div>

      <ul
        className={`grid border-t border-white/[0.07] px-5 py-5 sm:grid-cols-2 sm:px-6 sm:py-6 ${desktopColumns}`}
      >
        {features.map((feature, index) => {
          const FeatureIcon = FEATURE_ICONS[feature.icon] ?? Info;
          return (
            <li
              key={`${feature.title}-${feature.icon}`}
              data-about-feature
              className={featureClassName(index, features.length)}
            >
              <FeatureIcon className="h-4 w-4 text-primary/90" aria-hidden />
              <h4 className="mt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-100">
                {feature.title}
              </h4>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                {feature.description}
              </p>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-white/[0.07] px-5 py-5 sm:px-6">
        <h4 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
          {commonUsesLabel}
        </h4>
        <ul className="mt-3 flex flex-wrap gap-2" aria-label={commonUsesLabel}>
          {commonUses.map((use) => (
            <li
              key={use}
              data-common-use
              className="rounded-lg border border-primary/15 bg-primary/[0.045] px-3 py-1.5 text-[11px] font-medium leading-5 text-primary/90"
            >
              {use}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
