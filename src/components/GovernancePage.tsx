import {
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { buildOracleHref } from "../beatrice/navigation/oracleNavigation";
import { useI18n } from "../i18n/I18nProvider";
import { fetchGovernanceAlerts } from "../services/governanceService";
import type { GovernanceAlert, GovernanceSeverity } from "../types/governance";
import { ErrorState, LoadingState, PageHero, PageShell, SecondaryButton, SectionBlock, SectionHeader, SurfacePanel } from "./ui/VisualPrimitives";

const SEVERITY_STYLES: Record<GovernanceSeverity, string> = {
  critical: "text-rose-300 bg-rose-500/10 border-rose-500/30",
  high: "text-orange-200 bg-orange-500/10 border-orange-500/25",
  medium: "text-amber-200 bg-amber-500/10 border-amber-500/20",
  low: "text-slate-300 bg-white/[0.04] border-white/10",
};

const SEVERITY_LABELS: Record<GovernanceSeverity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

const CATEGORY_LABELS: Record<string, string> = {
  duplicate_components: "Componentes duplicados",
  overlapping_components: "Componentes sobrepostos",
  orphan_tokens: "Tokens órfãos",
  guidelines_without_reference: "Guidelines sem referência",
  components_without_examples: "Componentes sem exemplos",
  components_without_edge_cases: "Componentes sem edge cases",
  components_without_accessibility: "Componentes sem acessibilidade",
  inconsistent_documentation: "Documentação inconsistente",
  conflicting_aliases: "Aliases conflitantes",
  low_coverage: "Entidades com baixa cobertura",
};

function SeverityBadge({ severity }: { severity: GovernanceSeverity }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${SEVERITY_STYLES[severity]}`}
    >
      {SEVERITY_LABELS[severity]}
    </span>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: GovernanceSeverity | "total";
}) {
  const toneClass =
    tone === "total"
      ? "text-white"
      : tone === "critical"
        ? "text-rose-300"
        : tone === "high"
          ? "text-orange-200"
          : tone === "medium"
            ? "text-amber-200"
            : "text-slate-300";

  return (
    <article className="rounded-2xl border border-white/[0.09] bg-white/[0.025] p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className={`mt-3 text-4xl font-semibold tracking-[-0.04em] ${toneClass}`}>{value}</p>
    </article>
  );
}

function GovernanceAlertCard({ alert }: { alert: GovernanceAlert }) {
  return (
    <SurfacePanel className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            {CATEGORY_LABELS[alert.category] ?? alert.category}
          </p>
          <h3 className="break-words text-base font-semibold text-white">{alert.problem}</h3>
        </div>
        <SeverityBadge severity={alert.severity} />
      </div>

      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Impacto</dt>
          <dd className="mt-1.5 text-sm leading-relaxed text-slate-300">{alert.impact}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Recomendação</dt>
          <dd className="mt-1.5 text-sm leading-relaxed text-slate-300">{alert.recommendation}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Entidades afetadas</dt>
          <dd className="mt-2 flex flex-wrap gap-2">
            {alert.affected_entities.map((entity) => (
              <span
                key={entity}
                className="max-w-full break-words rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-slate-300"
              >
                {entity}
              </span>
            ))}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Prioridade</dt>
          <dd className="mt-1.5 text-sm font-medium text-white">{SEVERITY_LABELS[alert.severity]}</dd>
        </div>
      </dl>
    </SurfacePanel>
  );
}

export function GovernancePage() {
  const { locale } = useI18n();
  const [payload, setPayload] = useState<Awaited<ReturnType<typeof fetchGovernanceAlerts>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<GovernanceSeverity | "all">("all");

  const auditedAtLabel = useMemo(() => {
    if (!payload?.audited_at) return "";
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(payload.audited_at));
  }, [locale, payload?.audited_at]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchGovernanceAlerts();
      setPayload(data);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível carregar os alertas. Verifique se o backend está ativo.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredAlerts = useMemo(() => {
    if (!payload) return [];
    if (filter === "all") return payload.alerts;
    return payload.alerts.filter((alert) => alert.severity === filter);
  }, [filter, payload]);

  return (
    <PageShell width="wide">
      <PageHero
        eyebrow="Governance Agent"
        title="Governance Alerts"
        description="Análise contínua e proativa do catálogo Abraxos. Detecta duplicações, lacunas, inconsistências e riscos de governança sem depender de perguntas do usuário."
        actions={(
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={loadData}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white transition hover:bg-white/[0.08] disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Atualizar scan
            </button>
            <Link
              to={buildOracleHref("/governance")}
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/15"
            >
              /governance no Oráculo
            </Link>
          </div>
        )}
      />

      {error ? (
        <SectionBlock className="mt-8">
          <ErrorState
            icon={<AlertTriangle className="h-5 w-5 text-error" />}
            title="Não foi possível carregar os alertas"
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

      {loading && !payload ? (
        <SectionBlock className="mt-16">
          <LoadingState
            title="Carregando alertas de governança"
            description="Analisando o catálogo Abraxos em busca de duplicações, lacunas e inconsistências."
          />
        </SectionBlock>
      ) : null}

      {payload ? (
        <>
          <SectionBlock className="mt-10">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <SummaryCard label="Total" value={payload.total_alerts} tone="total" />
              <SummaryCard label="Critical" value={payload.severity_summary.critical} tone="critical" />
              <SummaryCard label="High" value={payload.severity_summary.high} tone="high" />
              <SummaryCard label="Medium" value={payload.severity_summary.medium} tone="medium" />
              <SummaryCard label="Low" value={payload.severity_summary.low} tone="low" />
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Última auditoria: {auditedAtLabel}
            </p>
          </SectionBlock>

          <SectionBlock className="mt-10">
            <SectionHeader
              eyebrow="Filtros"
              title="Severity"
              description="Critical · High · Medium · Low"
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {(["all", "critical", "high", "medium", "low"] as const).map((severity) => (
                <button
                  key={severity}
                  type="button"
                  onClick={() => setFilter(severity)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                    filter === severity
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"
                  }`}
                >
                  {severity === "all" ? "Todos" : SEVERITY_LABELS[severity]}
                </button>
              ))}
            </div>
          </SectionBlock>

          <SectionBlock className="mt-10">
            <SectionHeader
              eyebrow="Findings"
              title={`${filteredAlerts.length} alerta(s)`}
              description="Cada alerta inclui problema, impacto, entidades afetadas, recomendação e prioridade."
            />
            <div className="mt-6 space-y-4">
              {filteredAlerts.length === 0 ? (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-sm text-emerald-200">
                  Nenhum alerta neste filtro. O catálogo está saudável nesta dimensão.
                </div>
              ) : (
                filteredAlerts.map((alert) => (
                  <GovernanceAlertCard key={alert.id} alert={alert} />
                ))
              )}
            </div>
          </SectionBlock>
        </>
      ) : null}
    </PageShell>
  );
}
