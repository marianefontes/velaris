import {
  AlertTriangle,
  Brain,
  CheckCircle2,
  LoaderCircle,
  RefreshCw,
  Shield,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";
import { ResearchAdminGate } from "./ResearchAdminGate";
import { ErrorState, LoadingState, PageHero, PageShell, SecondaryButton, SectionBlock, SectionHeader, SurfacePanel } from "./ui/VisualPrimitives";
import {
  fetchKnowledgeHealthDashboard,
  fetchReliabilityGates,
  verifyResearchAdminAccess,
} from "../services/intelligenceHealthService";
import { readResearchAdminKey } from "../services/researchAdminAuth";
import type {
  ComponentCoverageEntry,
  KnowledgeGapEntry,
  KnowledgeHealthDashboard,
  ReliabilityGatesResult,
} from "../types/intelligenceHealth";

const DIMENSION_LABELS: Record<string, string> = {
  description: "Descrição",
  variants: "Variantes",
  states: "Estados",
  accessibility: "Acessibilidade",
  edge_cases: "Edge Cases",
  examples: "Exemplos",
  guidelines: "Guidelines",
  when_to_use: "When to use",
  when_not_to_use: "When not to use",
  contracts: "Contratos",
  signals: "Sinais",
  vocabulary: "Vocabulário",
  specializations: "Especializações",
  limitations: "Limitações",
};

const PRIORITY_STYLES: Record<string, string> = {
  high: "text-rose-300 bg-rose-500/10 border-rose-500/20",
  medium: "text-amber-200 bg-amber-500/10 border-amber-500/20",
  low: "text-slate-300 bg-white/[0.04] border-white/10",
};

function ScoreRing({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.09] bg-white/[0.025] p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white">{value}%</p>
    </div>
  );
}

function CoverageBadge({ present }: { present: boolean }) {
  return present ? (
    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" aria-label="Present" />
  ) : (
    <XCircle className="h-4 w-4 shrink-0 text-rose-400" aria-label="Missing" />
  );
}

function ComponentCoverageRow({ entry }: { entry: ComponentCoverageEntry }) {
  return (
    <SurfacePanel className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="break-words text-sm font-semibold text-white">{entry.name}</h3>
          <p className="mt-1 text-xs text-slate-500">{entry.component_id} · {entry.status}</p>
        </div>
        <div className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-white">
          Coverage: {entry.coverage_percent}%
        </div>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(entry.dimensions).map(([key, present]) => (
          <div key={key} className="flex items-center gap-2 text-xs text-slate-300">
            <CoverageBadge present={present} />
            <span>{DIMENSION_LABELS[key] ?? key}</span>
          </div>
        ))}
      </div>
    </SurfacePanel>
  );
}

function GapRow({ gap }: { gap: KnowledgeGapEntry }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3 last:border-b-0">
      <div className="min-w-0 flex-1">
        <p className="break-words text-sm font-medium text-white">{gap.entity}</p>
        <p className="mt-1 break-words text-xs text-slate-500">{gap.gap}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">{gap.coverage_percent}%</span>
        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${PRIORITY_STYLES[gap.priority] ?? PRIORITY_STYLES.low}`}>
          {gap.priority}
        </span>
      </div>
    </div>
  );
}

export function KnowledgeHealthPage() {
  const { locale } = useI18n();
  const [authStatus, setAuthStatus] = useState<"checking" | "locked" | "ready">("checking");
  const [dashboard, setDashboard] = useState<KnowledgeHealthDashboard | null>(null);
  const [gates, setGates] = useState<ReliabilityGatesResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [health, gateResult] = await Promise.all([
        fetchKnowledgeHealthDashboard(),
        fetchReliabilityGates(),
      ]);
      setDashboard(health);
      setGates(gateResult);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível carregar o dashboard. Verifique se o backend está ativo.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      const key = readResearchAdminKey();
      if (!key) {
        if (!cancelled) setAuthStatus("locked");
        return;
      }
      const verified = await verifyResearchAdminAccess(key);
      if (cancelled) return;
      if (!verified.authenticated) {
        setAuthStatus("locked");
        return;
      }
      setAuthStatus("ready");
      await loadData();
    }
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [loadData]);

  const auditedAtLabel = useMemo(() => {
    if (!dashboard?.audited_at) return "";
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(dashboard.audited_at));
  }, [dashboard?.audited_at, locale]);

  if (authStatus === "checking") {
    return (
      <PageShell className="flex min-h-[60vh] items-center justify-center">
        <LoaderCircle className="h-6 w-6 animate-spin text-primary" />
      </PageShell>
    );
  }

  if (authStatus === "locked") {
    return (
      <ResearchAdminGate
        eyebrow="Intelligence observability"
        title="Conhecer os limites antes de expandir."
        description="Dashboard interno de saúde do conhecimento. Mede cobertura, evidência, lacunas e decisões do Abraxos."
        onAuthenticated={() => {
          setAuthStatus("ready");
          loadData();
        }}
      />
    );
  }

  return (
    <PageShell width="wide">
      <PageHero
        eyebrow="Internal audit · Knowledge health"
        title="Knowledge Health Dashboard"
        description="Observabilidade da inteligência Abraxos. O objetivo não é adicionar capacidades — é medir o que o sistema sabe, o que sabe parcialmente e onde existe risco."
        actions={(
          <>
            <button
              type="button"
              onClick={loadData}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-on-primary transition hover:bg-primary-dim disabled:opacity-50"
            >
              {loading ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
              Atualizar
            </button>
            <Link
              to="/intelligence-lab"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-300 transition hover:border-primary/25 hover:text-white"
            >
              <Brain className="h-3.5 w-3.5" />
              Intelligence Lab
            </Link>
          </>
        )}
        aside={dashboard ? (
          <div className="rounded-2xl border border-primary/20 bg-primary/[0.06] px-6 py-5 text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/80">Knowledge Health Score</p>
            <p className="mt-2 text-5xl font-semibold tracking-[-0.05em] text-white">{dashboard.knowledge_health_score}%</p>
            <p className="mt-2 text-xs text-slate-500">Auditado em {auditedAtLabel}</p>
          </div>
        ) : null}
      />

      {error ? (
        <SectionBlock className="mt-6">
          <ErrorState
            icon={<AlertTriangle className="h-5 w-5 text-error" />}
            title="Não foi possível carregar o dashboard"
            description={error}
            action={(
              <SecondaryButton onClick={() => void loadData()} disabled={loading}>
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "motion-safe:animate-spin" : ""}`} />
                Tentar novamente
              </SecondaryButton>
            )}
          />
        </SectionBlock>
      ) : null}

      {dashboard ? (
        <div className="mt-10 grid gap-8">
          <SectionBlock>
            <SectionHeader title="Entities Catalogued" eyebrow="Catalog" />
            <div className="mt-5 grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 xl:grid-cols-4">
              {Object.entries(dashboard.entities_catalogued).map(([key, value]) => (
                <div key={key} className="bg-surface-container-low px-4 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">{key.replace(/_/g, " ")}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>
          </SectionBlock>

          <SectionBlock>
            <SectionHeader title="Intelligence Scores" eyebrow="Scores" />
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Object.entries(dashboard.intelligence_scores).map(([key, value]) => (
                <ScoreRing
                  key={key}
                  label={key.replace(/_/g, " ")}
                  value={value}
                />
              ))}
            </div>
          </SectionBlock>

          {gates ? (
            <SectionBlock>
              <SectionHeader title="Reliability Gates" eyebrow="Phase 3" />
              <div className="mt-5 grid gap-3">
                {Object.entries(gates.gates).map(([key, gate]) => (
                  <div
                    key={key}
                    className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 ${gate.passed ? "border-emerald-500/20 bg-emerald-500/5" : "border-rose-500/20 bg-rose-500/5"}`}
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{key.replace(/_/g, " ")}</p>
                      <p className="mt-1 text-xs text-slate-400">{gate.message}</p>
                    </div>
                    {gate.passed ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-rose-400" />
                    )}
                  </div>
                ))}
              </div>
            </SectionBlock>
          ) : null}

          <SectionBlock>
            <SectionHeader title="Cobertura por entidade" eyebrow="Components" />
            <div className="mt-5 grid gap-3">
              {dashboard.component_coverage
                .slice()
                .sort((a, b) => a.coverage_percent - b.coverage_percent)
                .map((entry) => (
                  <ComponentCoverageRow key={entry.component_id} entry={entry} />
                ))}
            </div>
          </SectionBlock>

          <SectionBlock>
            <SectionHeader title="Cobertura por perspectiva" eyebrow="Perspectives" />
            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              {dashboard.perspective_coverage.map((entry) => (
                <SurfacePanel key={entry.profile} className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-white">{entry.label}</h3>
                    <span className="text-xs font-semibold text-white">{entry.coverage_percent}%</span>
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {Object.entries(entry.dimensions).map(([key, present]) => (
                      <div key={key} className="flex items-center gap-2 text-xs text-slate-300">
                        <CoverageBadge present={present} />
                        <span>{DIMENSION_LABELS[key] ?? key}</span>
                      </div>
                    ))}
                  </div>
                </SurfacePanel>
              ))}
            </div>
          </SectionBlock>

          <SectionBlock>
            <SectionHeader title="Knowledge Debt Backlog" eyebrow="Backlog" />
            <p className="mt-2 text-sm text-slate-500">
              {dashboard.critical_entity_count} críticas · {dashboard.complete_entity_count} completas
            </p>
            <SurfacePanel as="div" variant="stack" className="mt-4">
              {dashboard.knowledge_debt_backlog.slice(0, 20).map((entry) => (
                <div key={`${entry.entity_id}-${entry.type}`} className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3 last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-white">{entry.entity}</p>
                    <p className="mt-1 text-xs text-slate-500">{entry.missing_fields.join(", ") || "completo"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{entry.coverage_percent}%</span>
                    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${PRIORITY_STYLES[entry.priority === "critical" ? "high" : entry.priority === "healthy" ? "low" : "medium"] ?? PRIORITY_STYLES.low}`}>
                      {entry.priority}
                    </span>
                  </div>
                </div>
              ))}
            </SurfacePanel>
          </SectionBlock>

          <SectionBlock>
            <SectionHeader title="Knowledge Gaps" eyebrow="Gaps" />
            <p className="mt-2 text-sm text-slate-500">{dashboard.knowledge_gaps_total} lacunas detectadas · exibindo top 50</p>
            <SurfacePanel as="div" variant="stack" className="mt-4">
              {dashboard.knowledge_gaps.map((gap) => (
                <GapRow key={`${gap.entity_id}-${gap.gap}`} gap={gap} />
              ))}
            </SurfacePanel>
          </SectionBlock>

          <div className="grid gap-8 lg:grid-cols-2">
            <SectionBlock>
              <SectionHeader title="Evidence Health" eyebrow="Evidence" />
              <div className="mt-5 grid gap-3">
                {(["strong", "medium", "weak", "absent"] as const).map((tier) => (
                  <SurfacePanel as="div" key={tier} className="px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm capitalize text-white">{tier}</span>
                      <span className="text-sm font-semibold text-white">
                        {dashboard.evidence_health.percentages[tier]}%
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full ${tier === "strong" ? "bg-emerald-400" : tier === "medium" ? "bg-amber-300" : tier === "weak" ? "bg-orange-400" : "bg-rose-400"}`}
                        style={{ width: `${dashboard.evidence_health.percentages[tier]}%` }}
                      />
                    </div>
                  </SurfacePanel>
                ))}
              </div>
            </SectionBlock>

            <SectionBlock>
              <SectionHeader title="Decision Health" eyebrow="Decisions" />
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {Object.entries(dashboard.decision_health.statuses).map(([status, count]) => (
                  <SurfacePanel as="div" key={status} className="px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">{status}</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{count}</p>
                  </SurfacePanel>
                ))}
              </div>
              {dashboard.decision_health.orphans.length > 0 ? (
                <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                  <p className="text-sm font-medium text-amber-100">Decision Orphans ({dashboard.decision_health.orphan_count})</p>
                  <ul className="mt-3 space-y-1 text-xs text-amber-100/80">
                    {dashboard.decision_health.orphans.map((orphan) => (
                      <li key={orphan}>{orphan}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </SectionBlock>
          </div>
        </div>
      ) : loading ? (
        <SectionBlock className="mt-16">
          <LoadingState
            title="Carregando saúde do conhecimento"
            description="Medindo cobertura, evidência, lacunas e gates de confiabilidade."
          />
        </SectionBlock>
      ) : null}
    </PageShell>
  );
}
