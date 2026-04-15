import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Metric } from "../types/dashboard";

const trendMap = {
  up: {
    icon: ArrowUpRight,
    tone: "text-emerald-400",
  },
  down: {
    icon: ArrowDownRight,
    tone: "text-rose-400",
  },
  steady: {
    icon: ArrowRight,
    tone: "text-amber-300",
  },
} as const;

interface MetricCardProps {
  metric: Metric;
}

export function MetricCard({ metric }: MetricCardProps) {
  const trend = trendMap[metric.trend];
  const TrendIcon = trend.icon;

  return (
    <article className="glass-panel rounded-[28px] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
            {metric.label}
          </p>
          <p className="mt-4 text-3xl font-black text-white">{metric.value}</p>
        </div>
        <span className={`flex items-center gap-1 text-xs font-bold ${trend.tone}`}>
          <TrendIcon className="h-4 w-4" />
          {metric.delta}
        </span>
      </div>
      <p className="mt-5 text-sm leading-relaxed text-on-surface-variant">{metric.hint}</p>
    </article>
  );
}
