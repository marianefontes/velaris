import { Suspense, lazy, useState } from "react";
import { AIPredictionCard } from "./AIPredictionCard";
import { LoadingDashboard } from "./LoadingDashboard";
import { MetricCard } from "./MetricCard";
import { OracleGuidancePanel } from "./OracleGuidancePanel";
import { SectionTitle } from "./SectionTitle";
import { SourceAttributionPanel } from "./SourceAttributionPanel";
import { SprintHealthList } from "./SprintHealthList";
import { XAIExplanationPanel } from "./XAIExplanationPanel";
import { useDashboardData } from "../hooks/useDashboardData";
import { useI18n } from "../i18n/I18nProvider";

const VelocityChart = lazy(() =>
  import("./VelocityChart").then((module) => ({ default: module.VelocityChart })),
);
const TaskStatusChart = lazy(() =>
  import("./TaskStatusChart").then((module) => ({ default: module.TaskStatusChart })),
);
const BurndownChart = lazy(() =>
  import("./BurndownChart").then((module) => ({ default: module.BurndownChart })),
);

function ChartFallback({ height = "h-80" }: { height?: string }) {
  const { locale } = useI18n();
  const label =
    locale === "en-US"
      ? "Loading visualization"
      : locale === "pt-PT"
        ? "A carregar visualização"
        : "Carregando visualização";
  return (
    <div className={`glass-panel rounded-[32px] p-6 ${height}`}>
      <div className="mb-4 flex items-center gap-2">
        <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
        <span className="text-[10px] uppercase tracking-[0.28em] text-on-surface-variant">
          {label}
        </span>
      </div>
      <div className="grid h-[calc(100%-2.5rem)] animate-pulse gap-3">
        <div className="rounded-2xl bg-white/5" />
        <div className="rounded-2xl bg-white/5" />
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { locale } = useI18n();
  const filters =
    locale === "en-US"
      ? ["Current context", "Document base", "UX evaluation"]
      : locale === "pt-PT"
        ? ["Contexto atual", "Base documental", "Avaliação UX"]
        : ["Contexto atual", "Base documental", "Avaliação UX"];
  const [activeRange, setActiveRange] = useState(filters[0]);
  const { data, isLoading } = useDashboardData(locale);
  const copy =
    locale === "en-US"
      ? {
          snapshotEyebrow: "Oracle snapshot",
          snapshotTitle: "Intelligent Oracle signals",
          supportEyebrow: "Decision support",
          supportTitle: "Recommendations and explainability",
          supportBadge: "RAG-ready",
        }
      : locale === "pt-PT"
        ? {
            snapshotEyebrow: "Snapshot do oráculo",
            snapshotTitle: "Sinais do Oráculo Inteligente",
            supportEyebrow: "Suporte à decisão",
            supportTitle: "Recomendações e explicabilidade",
            supportBadge: "Pronto para RAG",
          }
        : {
            snapshotEyebrow: "Snapshot do oráculo",
            snapshotTitle: "Sinais do Oráculo Inteligente",
            supportEyebrow: "Suporte à decisão",
            supportTitle: "Recomendações e explicabilidade",
            supportBadge: "Pronto para RAG",
          };

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-center gap-3">
        {filters.map((range) => (
          <button
            key={range}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
              range === activeRange
                ? "bg-primary text-on-primary"
                : "glass-card text-on-surface-variant hover:text-white"
            }`}
            onClick={() => setActiveRange(range)}
            type="button"
          >
            {range}
          </button>
        ))}
      </section>

      {isLoading || !data ? (
        <LoadingDashboard />
      ) : (
        <div className="space-y-8">
          <section>
            <SectionTitle
              eyebrow={copy.snapshotEyebrow}
              title={copy.snapshotTitle}
              badge={activeRange}
            />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {data.metrics.map((metric) => (
                <MetricCard key={metric.id} metric={metric} />
              ))}
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
            <Suspense fallback={<ChartFallback />}>
              <VelocityChart data={data.velocity} />
            </Suspense>
            <Suspense fallback={<ChartFallback height="h-72" />}>
              <TaskStatusChart data={data.taskStatus} />
            </Suspense>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <Suspense fallback={<ChartFallback height="h-80" />}>
              <BurndownChart data={data.burndown} />
            </Suspense>
            <SprintHealthList items={data.sprintHealth} />
          </section>

          <XAIExplanationPanel data={data.explanation} />

          <OracleGuidancePanel data={data.guidance} />

          <section>
            <SectionTitle
              eyebrow={copy.supportEyebrow}
              title={copy.supportTitle}
              badge={copy.supportBadge}
            />
            <div className="grid gap-6 xl:grid-cols-2">
              {data.predictions.map((prediction) => (
                <AIPredictionCard key={prediction.id} prediction={prediction} />
              ))}
            </div>
          </section>

          <SourceAttributionPanel
            sources={data.predictions.flatMap((prediction) => prediction.sources)}
          />
        </div>
      )}
    </div>
  );
}
