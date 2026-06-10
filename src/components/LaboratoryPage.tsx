import {
  Activity,
  Ban,
  Beaker,
  Bell,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Database,
  FlaskConical,
  Gauge,
  KeyRound,
  LoaderCircle,
  PauseCircle,
  Play,
  RefreshCw,
  RotateCcw,
  ScanSearch,
  SlidersHorizontal,
  ShieldCheck,
} from "lucide-react";
import { FormEvent, useCallback, useEffect, useState, type ReactNode } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { useLaboratorySnapshot } from "../hooks/useLaboratorySnapshot";
import { useStudyParticipantSession } from "../hooks/useStudyParticipantSession";
import { useI18n } from "../i18n/I18nProvider";
import {
  cancelLaboratoryRun,
  createLaboratoryRun,
  fetchLaboratoryCaseSets,
  fetchLaboratoryRun,
  fetchLaboratorySnapshot,
  decideLaboratoryRecommendation,
  markLaboratoryNotificationsRead,
  markLaboratoryRecommendationRead,
  pauseLaboratoryAutomation,
  reviewLaboratoryItem,
  resumeLaboratoryAutomation,
  rollbackLaboratoryCalibration,
  setLaboratoryBaseline,
} from "../services/laboratoryService";
import {
  readResearchAdminKey,
  saveResearchAdminKey,
  verifyResearchAdminAccess,
  verifyResearchAdminKey,
  type ResearchAdminVerification,
} from "../services/researchAdminAuth";
import type {
  LaboratoryCaseSet,
  LaboratoryMetric,
  LaboratoryRecommendation,
  LaboratoryRun,
  LaboratoryRunItem,
  LaboratorySnapshot,
} from "../types/laboratory";
import { PageShell } from "./ui/VisualPrimitives";

const PROFILES = [
  { id: "dev", label: "Developer" },
  { id: "designer", label: "Designer" },
  { id: "product_designer", label: "Product Designer" },
  { id: "qa", label: "QA" },
  { id: "tech_writer", label: "Tech Writer" },
  { id: "a11y", label: "Accessibility Specialist" },
  { id: "maintainer", label: "Maintainer" },
  { id: "design_system_manager", label: "Design System Manager" },
];

const METRIC_LABELS: Record<string, string> = {
  observed_correctness: "Correção observada",
  evidence_confidence: "Confiança da evidência",
  required_fact_coverage: "Cobertura factual",
  forbidden_claim_avoidance: "Evita afirmações proibidas",
  retrieval_precision: "Precisão do retrieval",
  source_coverage: "Cobertura de fontes",
  perspective_signal: "Sinal da perspectiva",
  structural_adherence: "Aderência estrutural",
  repeat_stability: "Estabilidade",
  factual_convergence: "Convergência factual",
  principled_divergence: "Divergência fundamentada",
  factual_correctness: "Correção factual",
  source_fidelity: "Fidelidade à fonte",
  usefulness: "Utilidade",
  intent_match: "Aderência ao intent",
};

function formatMetric(value: number | null | undefined): string {
  return value === null || value === undefined ? "pendente" : `${Math.round(value * 100)}%`;
}

function formatDate(value: string | null | undefined): string {
  if (!value) return ":";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function LaboratoryPage() {
  const participantStatus = useStudyParticipantSession();
  const { locale } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const [authStatus, setAuthStatus] = useState<"checking" | "locked" | "ready">("checking");
  const [caseSets, setCaseSets] = useState<LaboratoryCaseSet[]>([]);
  const [runs, setRuns] = useState<LaboratoryRun[]>([]);
  const [selectedRun, setSelectedRun] = useState<LaboratoryRun | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState<"runs" | "recommendations">(
    searchParams.get("view") === "recommendations" ? "recommendations" : "runs",
  );
  const [selectedRecommendationId, setSelectedRecommendationId] = useState<string | null>(
    searchParams.get("recommendation"),
  );
  const isEnglish = locale === "en-US";
  const laboratorySnapshot = useLaboratorySnapshot(
    authStatus === "ready" && participantStatus === "none",
  );

  const loadWorkspace = useCallback(async (preferredRunId?: string) => {
    setLoading(true);
    setError("");
    try {
      const [nextCaseSets, nextSnapshot] = await Promise.all([
        fetchLaboratoryCaseSets(),
        fetchLaboratorySnapshot(),
      ]);
      setCaseSets(nextCaseSets);
      const nextRuns = nextSnapshot.runs;
      setRuns(nextRuns);
      const runId = preferredRunId ?? selectedRun?.id ?? nextRuns[0]?.id;
      if (runId) {
        setSelectedRun(await fetchLaboratoryRun(runId));
      } else {
        setSelectedRun(null);
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Falha ao carregar o laboratório.");
    } finally {
      setLoading(false);
    }
  }, [selectedRun?.id]);

  useEffect(() => {
    const snapshot = laboratorySnapshot.snapshot;
    if (!snapshot || authStatus !== "ready") return;
    setRuns(snapshot.runs);
    const runId = selectedRun?.id ?? snapshot.runs[0]?.id;
    if (!runId) {
      setSelectedRun(null);
      return;
    }
    let active = true;
    fetchLaboratoryRun(runId)
      .then((run) => {
        if (active) setSelectedRun(run);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [authStatus, laboratorySnapshot.snapshot?.revision, selectedRun?.id]);

  useEffect(() => {
    if (participantStatus !== "none") return;
    const key = readResearchAdminKey();
    if (!key) {
      setAuthStatus("locked");
      return;
    }
    verifyResearchAdminKey(key).then((valid) => {
      setAuthStatus(valid ? "ready" : "locked");
    });
  }, [participantStatus]); // Authentication is intentionally restored once.

  useEffect(() => {
    if (authStatus !== "ready") return;
    fetchLaboratoryCaseSets().then(setCaseSets).catch(() => undefined);
  }, [authStatus]);

  if (participantStatus === "participant") return <Navigate to="/main" replace />;
  if (participantStatus === "checking" || authStatus === "checking") {
    return <LaboratoryLoading />;
  }
  if (authStatus === "locked") {
    return (
      <LaboratoryAuthGate
        onAuthenticated={() => {
          setAuthStatus("ready");
        }}
      />
    );
  }

  return (
    <PageShell width="wide" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_18%_0%,rgba(222,204,253,0.08),transparent_42%)]" />
      <header className="relative border-b border-white/[0.08] pb-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="page-eyebrow">
              <FlaskConical className="h-3.5 w-3.5" aria-hidden />
              {isEnglish ? "Offline evaluation laboratory" : "Laboratório de avaliação offline"}
            </div>
            <h1 className="page-h1 max-w-4xl">
              {isEnglish ? "Measure before" : "Medir antes de"}{" "}
              <span className="page-h1-accent">{isEnglish ? "calibrating." : "calibrar."}</span>
            </h1>
            <p className="page-lead max-w-3xl">
              {isEnglish
                ? "Run controlled, persisted benchmarks across every cognitive perspective. Production prompts remain untouched until a result is reviewed."
                : "Execute benchmarks controlados e persistentes em todas as perspectivas cognitivas. Os prompts de produção permanecem intactos até que um resultado seja revisado."}
            </p>
          </div>
          <div className="flex gap-2">
            <StatusPill icon={<Database />} label="SQLite isolado" />
            <StatusPill icon={<ShieldCheck />} label="Admin only" />
          </div>
        </div>
      </header>

      {laboratorySnapshot.snapshot ? (
        <AutomationOverview
          snapshot={laboratorySnapshot.snapshot}
          onPause={async () => {
            await pauseLaboratoryAutomation("Pausada no painel do laboratório");
          }}
          onResume={resumeLaboratoryAutomation}
          onReadNotifications={markLaboratoryNotificationsRead}
        />
      ) : null}

      {error ? (
        <div role="alert" className="relative mt-6 rounded-xl border border-error/25 bg-error/[0.05] px-4 py-3 text-xs text-rose-200">
          {error}
        </div>
      ) : null}

      <div className="relative mt-7 flex flex-wrap items-center gap-2 border-b border-white/[0.07] pb-4">
        <LaboratoryViewButton
          active={view === "runs"}
          icon={<Activity />}
          label="Execuções"
          onClick={() => {
            setView("runs");
            setSearchParams({});
          }}
        />
        <LaboratoryViewButton
          active={view === "recommendations"}
          icon={<Bell />}
          label={`Recomendações${laboratorySnapshot.snapshot?.unread_recommendations ? ` · ${laboratorySnapshot.snapshot.unread_recommendations}` : ""}`}
          onClick={() => {
            setView("recommendations");
            setSearchParams({ view: "recommendations" });
          }}
        />
      </div>

      {view === "recommendations" && laboratorySnapshot.snapshot ? (
        <RecommendationsWorkspace
          recommendations={laboratorySnapshot.snapshot.recommendations}
          activeCalibrationId={laboratorySnapshot.snapshot.active_calibration.id}
          selectedId={selectedRecommendationId}
          onSelect={(id) => {
            setSelectedRecommendationId(id);
            setSearchParams({ view: "recommendations", recommendation: id });
          }}
          onRead={markLaboratoryRecommendationRead}
          onDecision={decideLaboratoryRecommendation}
          onRollback={rollbackLaboratoryCalibration}
        />
      ) : (
      <div className="relative mt-7 grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <RunComposer
            caseSets={caseSets}
            busy={loading}
            onCreate={async (payload) => {
              setLoading(true);
              setError("");
              try {
                const run = await createLaboratoryRun(payload);
                await loadWorkspace(run.id);
              } catch (requestError) {
                setError(requestError instanceof Error ? requestError.message : "Não foi possível iniciar a execução.");
              } finally {
                setLoading(false);
              }
            }}
          />
          <RunHistory
            runs={runs}
            selectedId={selectedRun?.id}
            loading={loading}
            onRefresh={() => void loadWorkspace()}
            onSelect={async (runId) => {
              setLoading(true);
              try {
                setSelectedRun(await fetchLaboratoryRun(runId));
              } finally {
                setLoading(false);
              }
            }}
          />
        </aside>

        <div className="min-w-0">
          {selectedRun ? (
            <RunWorkspace
              run={selectedRun}
              onCancel={async () => {
                await cancelLaboratoryRun(selectedRun.id);
                await loadWorkspace(selectedRun.id);
              }}
              onBaseline={async () => {
                await setLaboratoryBaseline(selectedRun.id);
                await loadWorkspace(selectedRun.id);
              }}
              onReview={async (itemId, review) => {
                await reviewLaboratoryItem(itemId, review);
                setSelectedRun(await fetchLaboratoryRun(selectedRun.id));
                await laboratorySnapshot.refresh();
              }}
            />
          ) : (
            <EmptyLaboratory />
          )}
        </div>
      </div>
      )}
    </PageShell>
  );
}

function AutomationOverview({
  snapshot,
  onPause,
  onResume,
  onReadNotifications,
}: {
  snapshot: LaboratorySnapshot;
  onPause: () => Promise<void>;
  onResume: () => Promise<void>;
  onReadNotifications: () => Promise<void>;
}) {
  const [changing, setChanging] = useState(false);
  const automation = snapshot.automation;
  const nextSlot = automation.next_slot;
  return (
    <section className="relative mt-6 overflow-hidden rounded-2xl border border-primary/15 bg-primary/[0.035]">
      <div className="grid gap-px bg-white/[0.06] lg:grid-cols-[1.2fr_0.8fr_0.8fr_auto]">
        <div className="bg-surface-container-low p-5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/80">
              Calibração automática
            </p>
          </div>
          <p className="mt-3 text-sm font-semibold text-white">
            {!automation.enabled
              ? "Desativada neste ambiente"
              : automation.paused
                ? "Pausada"
                : "Operacional"}
          </p>
          <p className="mt-2 text-[10px] leading-5 text-slate-600">
            {automation.pause_reason
              ?? `Versão ativa: ${snapshot.active_calibration.label}`}
          </p>
        </div>
        <div className="bg-surface-container-low p-5">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">Próxima candidata</p>
          <p className="mt-3 text-sm font-semibold text-slate-200">{nextSlot?.version_label ?? ":"}</p>
          <p className="mt-2 font-mono text-[9px] text-slate-600">
            {nextSlot ? `${formatDate(nextSlot.scheduled_for)} · ${nextSlot.repetitions} repetição(ões)` : "Sem janela"}
          </p>
        </div>
        <div className="bg-surface-container-low p-5">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">Volume diário</p>
          <p className="mt-3 font-mono text-2xl font-semibold text-white">
            {automation.daily_estimated_calls ?? 336}
          </p>
          <p className="mt-1 text-[9px] text-slate-600">chamadas estimadas</p>
        </div>
        <div className="flex items-center justify-center bg-surface-container-low p-5">
          {automation.enabled ? (
            <button
              type="button"
              disabled={changing}
              onClick={async () => {
                setChanging(true);
                try {
                  if (automation.paused) await onResume();
                  else await onPause();
                } finally {
                  setChanging(false);
                }
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-300 transition hover:border-primary/25 hover:text-white disabled:opacity-40"
            >
              {changing ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : automation.paused ? <Play className="h-3.5 w-3.5" /> : <PauseCircle className="h-3.5 w-3.5" />}
              {automation.paused ? "Retomar" : "Pausar"}
            </button>
          ) : (
            <span className="text-[9px] uppercase tracking-widest text-slate-700">somente leitura</span>
          )}
        </div>
      </div>
      {snapshot.candidates.length ? (
        <div className="grid gap-px border-t border-white/[0.07] bg-white/[0.06] sm:grid-cols-3">
          {snapshot.candidates.map((candidate) => (
            <div key={candidate.id} className="flex items-center justify-between gap-3 bg-surface-container-low px-5 py-3">
              <div>
                <p className="text-[10px] font-semibold text-slate-300">candidate{candidate.slot_index}</p>
                <p className="mt-1 font-mono text-[8px] uppercase tracking-wider text-slate-700">{candidate.status}</p>
              </div>
              <RunStatusDot status={candidate.status} />
            </div>
          ))}
        </div>
      ) : null}
      {snapshot.notifications.length ? (
        <div className="border-t border-white/[0.07] bg-surface-container-low px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">
              Notificações internas
            </p>
            {snapshot.unread_notifications ? (
              <button
                type="button"
                onClick={() => void onReadNotifications()}
                className="font-mono text-[8px] uppercase tracking-wider text-primary/70 transition hover:text-primary"
              >
                Marcar {snapshot.unread_notifications} como lida(s)
              </button>
            ) : (
              <span className="font-mono text-[8px] text-slate-700">Tudo lido</span>
            )}
          </div>
          <div className="mt-3 grid gap-2 lg:grid-cols-3">
            {snapshot.notifications.slice(0, 3).map((notification) => (
              <div
                key={notification.id}
                className="rounded-xl border border-white/[0.07] bg-black/20 px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  {!notification.read_at ? <span className="h-1.5 w-1.5 rounded-full bg-primary" /> : null}
                  <p className="truncate text-[10px] font-semibold text-slate-300">
                    {notification.title}
                  </p>
                </div>
                <p className="mt-2 line-clamp-2 text-[9px] leading-4 text-slate-600">
                  {notification.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function LaboratoryViewButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] transition ${
        active ? "bg-primary text-on-primary" : "border border-white/10 text-slate-500 hover:text-white"
      }`}
    >
      <span className="[&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>
      {label}
    </button>
  );
}

function RecommendationsWorkspace({
  recommendations,
  activeCalibrationId,
  selectedId,
  onSelect,
  onRead,
  onDecision,
  onRollback,
}: {
  recommendations: LaboratoryRecommendation[];
  activeCalibrationId: string;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRead: (id: string) => Promise<void>;
  onDecision: (
    id: string,
    decision: "reject" | "approve_for_backlog",
    notes?: string,
  ) => Promise<void>;
  onRollback: (versionId: string, reason: string) => Promise<void>;
}) {
  const selected = recommendations.find((item) => item.id === selectedId) ?? recommendations[0] ?? null;
  return (
    <div className="relative mt-7 grid min-h-[620px] overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.015] lg:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="border-b border-white/[0.08] lg:border-b-0 lg:border-r">
        <div className="border-b border-white/[0.07] px-5 py-4">
          <SectionLabel icon={<Bell />} label="Central de revisões" />
        </div>
        <div className="max-h-[680px] divide-y divide-white/[0.06] overflow-y-auto">
          {recommendations.length ? recommendations.map((recommendation) => (
            <button
              key={recommendation.id}
              type="button"
              onClick={() => onSelect(recommendation.id)}
              className={`w-full px-5 py-4 text-left transition ${
                selected?.id === recommendation.id ? "bg-primary/[0.07]" : "hover:bg-white/[0.025]"
              }`}
            >
              <div className="flex items-center gap-2">
                {!recommendation.is_read ? <span className="h-2 w-2 rounded-full bg-primary" /> : null}
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600">
                  {recommendationStatusLabel(recommendation.status)}
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold leading-5 text-slate-200">{recommendation.title}</p>
              <p className="mt-2 line-clamp-2 text-[10px] leading-4 text-slate-600">{recommendation.summary}</p>
              <p className="mt-2 font-mono text-[8px] text-slate-700">{formatDate(recommendation.created_at)}</p>
            </button>
          )) : (
            <p className="px-6 py-12 text-center text-xs text-slate-600">Nenhuma recomendação registrada.</p>
          )}
        </div>
      </aside>
      {selected ? (
        <RecommendationDetail
          recommendation={selected}
          activeCalibrationId={activeCalibrationId}
          onRead={onRead}
          onDecision={onDecision}
          onRollback={onRollback}
        />
      ) : (
        <div className="grid place-items-center p-8 text-center text-sm text-slate-600">
          As conclusões das candidatas aparecerão aqui com evidências e justificativa.
        </div>
      )}
    </div>
  );
}

function RecommendationDetail({
  recommendation,
  activeCalibrationId,
  onRead,
  onDecision,
  onRollback,
}: {
  recommendation: LaboratoryRecommendation;
  activeCalibrationId: string;
  onRead: (id: string) => Promise<void>;
  onDecision: (
    id: string,
    decision: "reject" | "approve_for_backlog",
    notes?: string,
  ) => Promise<void>;
  onRollback: (versionId: string, reason: string) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const changes = Array.isArray(recommendation.metric_comparison.changes)
    ? recommendation.metric_comparison.changes as Array<Record<string, unknown>>
    : [];
  const checks = recommendation.guardrails.checks ?? [];
  const canDecide = ["awaiting_review", "informational"].includes(recommendation.status);
  const canRollback = (
    recommendation.status === "applied_automatically"
    && recommendation.calibration_version_id === activeCalibrationId
  );

  async function act(action: () => Promise<void>) {
    setBusy(true);
    try {
      await action();
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="min-w-0 p-6 lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/[0.07] pb-6">
        <div className="max-w-3xl">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-primary/70">
            {recommendationStatusLabel(recommendation.status)} · {formatDate(recommendation.created_at)}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">{recommendation.title}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">{recommendation.summary}</p>
        </div>
        {!recommendation.is_read ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => void act(() => onRead(recommendation.id))}
            className="rounded-full border border-white/10 px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-white"
          >
            Marcar como lida
          </button>
        ) : null}
      </div>

      <section className="mt-6">
        <SectionLabel icon={<ScanSearch />} label="Por que" />
        <p className="mt-3 rounded-xl border border-white/[0.07] bg-black/20 p-5 text-sm leading-7 text-slate-300">
          {recommendation.rationale}
        </p>
      </section>

      {recommendation.affected_perspectives.length ? (
        <section className="mt-7">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">Perspectivas afetadas</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {recommendation.affected_perspectives.map((profile) => (
              <span key={profile} className="rounded-full border border-primary/15 bg-primary/[0.05] px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-primary/80">
                {profile}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {changes.length ? (
        <section className="mt-7">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">Ajustes avaliados</p>
          <div className="mt-3 divide-y divide-white/[0.06] overflow-hidden rounded-xl border border-white/[0.07]">
            {changes.map((change, index) => (
              <div key={`${String(change.profile)}-${String(change.field)}-${index}`} className="grid gap-2 bg-white/[0.015] px-4 py-3 sm:grid-cols-[1fr_1fr_auto]">
                <span className="text-xs font-semibold text-slate-300">{String(change.profile)}</span>
                <span className="text-[10px] text-slate-500">{String(change.field)}</span>
                <span className="font-mono text-[10px] text-primary">{String(change.from)} → {String(change.to)}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {checks.length ? (
        <section className="mt-7">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">Guardrails</p>
          <div className="mt-3 divide-y divide-white/[0.06] overflow-hidden rounded-xl border border-white/[0.07]">
            {checks.map((check) => (
              <div key={check.id} className="grid gap-2 bg-white/[0.015] px-4 py-3 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                {check.passed ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Ban className="h-4 w-4 text-rose-300" />}
                <span className="text-[10px] leading-5 text-slate-400">{check.rationale}</span>
                <span className="font-mono text-[9px] text-slate-600">{String(check.observed ?? ":")}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-2 border-t border-white/[0.07] pt-6">
        {canDecide ? (
          <>
            <ActionButton
              icon={<CheckCircle2 />}
              label="Aprovar para backlog"
              onClick={() => act(() => onDecision(recommendation.id, "approve_for_backlog"))}
            />
            <ActionButton
              icon={<Ban />}
              label="Rejeitar"
              onClick={() => act(() => onDecision(recommendation.id, "reject"))}
            />
          </>
        ) : null}
        {canRollback && recommendation.calibration_version_id ? (
          <ActionButton
            icon={<RotateCcw />}
            label="Reverter calibração"
            onClick={() => act(() => onRollback(
              recommendation.calibration_version_id as string,
              `Reversão solicitada na recomendação ${recommendation.id}`,
            ))}
          />
        ) : null}
        {busy ? <LoaderCircle className="h-4 w-4 animate-spin self-center text-primary" /> : null}
      </div>
    </article>
  );
}

function recommendationStatusLabel(status: string): string {
  return {
    applied_automatically: "Aplicada automaticamente",
    awaiting_review: "Aguardando aprovação",
    rejected_automatically: "Rejeitada automaticamente",
    reverted: "Revertida",
    informational: "Informativa",
    approved_for_backlog: "Aprovada para backlog",
    rejected: "Rejeitada",
  }[status] ?? status;
}

function LaboratoryAuthGate({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [key, setKey] = useState(readResearchAdminKey);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    const result = await verifyResearchAdminAccess(key);
    if (!result.authenticated) {
      setErrorMessage(researchAdminErrorMessage(result));
      setStatus("error");
      return;
    }
    saveResearchAdminKey(key);
    onAuthenticated();
  }

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-[1180px] place-items-center px-6 py-14">
      <div className="grid w-full overflow-hidden rounded-[28px] border border-white/[0.09] bg-surface-container-low shadow-[0_30px_100px_rgba(0,0,0,0.42)] lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative min-h-[360px] overflow-hidden border-b border-white/[0.08] p-8 lg:border-b-0 lg:border-r lg:p-12">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:36px_36px]" />
          <div className="absolute -left-24 top-8 h-72 w-72 rounded-full border border-primary/10" />
          <div className="absolute left-14 top-32 h-40 w-40 rounded-full border border-primary/20" />
          <div className="relative">
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-primary/70">Controlled environment</p>
            <h1 className="mt-5 max-w-lg text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Evidência antes de confiança.
            </h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
              Este ambiente dispara chamadas reais, armazena respostas experimentais e permite revisar métricas. O acesso é reservado à pesquisa.
            </p>
          </div>
        </div>
        <form onSubmit={submit} className="flex flex-col justify-center p-8 lg:p-12">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/[0.07]">
            <KeyRound className="h-4 w-4 text-primary" />
          </div>
          <h2 className="mt-6 text-xl font-semibold text-white">Autenticar laboratório</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Use a mesma chave administrativa do console de pesquisa.
          </p>
          <label className="mt-7 grid gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Research admin key</span>
            <input
              type="password"
              value={key}
              onChange={(event) => {
                setKey(event.target.value);
                if (status === "error") setStatus("idle");
              }}
              autoComplete="current-password"
              className="h-12 rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none transition focus:border-primary/40"
              required
              autoFocus
            />
          </label>
          {status === "error" ? <p role="alert" className="mt-3 text-xs leading-5 text-rose-300">{errorMessage}</p> : null}
          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-xs font-bold uppercase tracking-[0.16em] text-on-primary transition hover:bg-primary-dim disabled:opacity-50"
          >
            {status === "loading" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

function researchAdminErrorMessage(result: Exclude<ResearchAdminVerification, { authenticated: true }>): string {
  switch (result.reason) {
    case "invalid":
      return "Chave incorreta. Use exatamente o valor de RESEARCH_ADMIN_KEY configurado no backend.";
    case "unconfigured":
      return "O backend ainda não possui RESEARCH_ADMIN_KEY configurada. Defina a variável e reinicie o servidor.";
    case "route_missing":
      return "A API do laboratório não existe neste servidor. Publique ou reinicie o backend atualizado.";
    case "unreachable":
      return "Não foi possível conectar à API. Confirme se o backend está em execução.";
    default:
      return "O servidor recusou a autenticação por um erro interno. Consulte os logs do backend.";
  }
}

function RunComposer({
  caseSets,
  busy,
  onCreate,
}: {
  caseSets: LaboratoryCaseSet[];
  busy: boolean;
  onCreate: (payload: { case_set_id: string; version_label: string; profiles: string[]; repetitions: number }) => void;
}) {
  const [caseSetId, setCaseSetId] = useState(caseSets[0]?.id ?? "beatrice-core-v1");
  const [versionLabel, setVersionLabel] = useState(() => `candidate-${new Date().toISOString().slice(0, 10)}`);
  const [profiles, setProfiles] = useState(PROFILES.map((profile) => profile.id));
  const activeCaseSet = caseSets.find((caseSet) => caseSet.id === caseSetId);
  const requestCount = (activeCaseSet?.case_count ?? 0) * profiles.length;

  useEffect(() => {
    if (caseSets[0] && !caseSets.some((caseSet) => caseSet.id === caseSetId)) {
      setCaseSetId(caseSets[0].id);
    }
  }, [caseSets, caseSetId]);

  return (
    <section data-abraxos-focus="lab-run" className="rounded-2xl border border-white/[0.09] bg-white/[0.025] p-5">
      <SectionLabel icon={<Play />} label="Nova execução" />
      <div className="mt-5 space-y-5">
        <FieldLabel label="Identificador da versão">
          <input
            value={versionLabel}
            onChange={(event) => setVersionLabel(event.target.value)}
            className="laboratory-input"
            maxLength={80}
          />
        </FieldLabel>
        <FieldLabel label="Conjunto de casos">
          <select value={caseSetId} onChange={(event) => setCaseSetId(event.target.value)} className="laboratory-input">
            {caseSets.map((caseSet) => (
              <option key={caseSet.id} value={caseSet.id}>{caseSet.id} · {caseSet.case_count} casos</option>
            ))}
          </select>
        </FieldLabel>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-slate-500">Perspectivas</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {PROFILES.map((profile) => {
              const checked = profiles.includes(profile.id);
              return (
                <button
                  key={profile.id}
                  type="button"
                  aria-pressed={checked}
                  onClick={() => setProfiles((current) =>
                    checked ? current.filter((item) => item !== profile.id) : [...current, profile.id]
                  )}
                  className={`rounded-full border px-2.5 py-1.5 text-[10px] font-semibold transition ${
                    checked
                      ? "border-primary/25 bg-primary/[0.1] text-primary"
                      : "border-white/[0.08] text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {profile.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-black/20 px-3 py-3">
          <div>
            <p className="font-mono text-lg font-semibold text-white">{requestCount}</p>
            <p className="text-[9px] uppercase tracking-widest text-slate-600">requisições previstas</p>
          </div>
          <Gauge className="h-5 w-5 text-primary/60" />
        </div>
        <button
          type="button"
          disabled={busy || !versionLabel.trim() || profiles.length === 0 || requestCount === 0}
          onClick={() => onCreate({
            case_set_id: caseSetId,
            version_label: versionLabel.trim(),
            profiles,
            repetitions: 1,
          })}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-[10px] font-bold uppercase tracking-[0.17em] text-on-primary transition hover:bg-primary-dim disabled:opacity-35"
        >
          {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
          Executar benchmark
        </button>
      </div>
    </section>
  );
}

function RunHistory({
  runs,
  selectedId,
  loading,
  onRefresh,
  onSelect,
}: {
  runs: LaboratoryRun[];
  selectedId?: string;
  loading: boolean;
  onRefresh: () => void;
  onSelect: (id: string) => void;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.018]">
      <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3.5">
        <SectionLabel icon={<Activity />} label="Histórico" />
        <button type="button" onClick={onRefresh} aria-label="Atualizar execuções" className="text-slate-600 transition hover:text-white">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>
      <div className="max-h-[430px] divide-y divide-white/[0.06] overflow-y-auto">
        {runs.length === 0 ? (
          <p className="px-4 py-8 text-center text-xs text-slate-600">Nenhuma execução registrada.</p>
        ) : runs.map((run) => (
          <button
            key={run.id}
            type="button"
            onClick={() => onSelect(run.id)}
            className={`grid w-full grid-cols-[1fr_auto] gap-3 px-4 py-3.5 text-left transition ${
              selectedId === run.id ? "bg-primary/[0.07]" : "hover:bg-white/[0.025]"
            }`}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <RunStatusDot status={run.status} />
                <p className="truncate text-xs font-semibold text-slate-200">{run.version_label}</p>
                {run.is_baseline ? <span className="rounded-full border border-technical-accent/20 bg-technical-accent/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-technical-accent">baseline</span> : null}
              </div>
              <p className="mt-1.5 font-mono text-[9px] text-slate-600">{formatDate(run.created_at)} · {run.completed_items}/{run.total_items}</p>
            </div>
            <ChevronRight className="mt-1 h-3.5 w-3.5 text-slate-700" />
          </button>
        ))}
      </div>
    </section>
  );
}

function RunWorkspace({
  run,
  onCancel,
  onBaseline,
  onReview,
}: {
  run: LaboratoryRun;
  onCancel: () => Promise<void>;
  onBaseline: () => Promise<void>;
  onReview: (itemId: string, review: { reviewer: string; scores: Record<string, number>; notes: string }) => Promise<void>;
}) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(run.items?.[0]?.id ?? null);
  const selectedItem = run.items?.find((item) => item.id === selectedItemId) ?? run.items?.[0] ?? null;

  useEffect(() => {
    if (!run.items?.some((item) => item.id === selectedItemId)) {
      setSelectedItemId(run.items?.[0]?.id ?? null);
    }
  }, [run.id, run.items?.length, selectedItemId]);

  const metrics = run.aggregate.metrics ?? {};
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-white/[0.09] bg-surface-container-low">
        <div className="grid gap-5 border-b border-white/[0.08] p-5 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <RunStatusChip status={run.status} />
              {run.is_baseline ? <span className="rounded-full border border-technical-accent/20 bg-technical-accent/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-technical-accent">baseline ativa</span> : null}
            </div>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">{run.version_label}</h2>
            <p className="mt-2 font-mono text-[10px] leading-5 text-slate-600">
              model={run.model} · prompt={run.prompt_fingerprint} · dataset={run.dataset_fingerprint}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {["queued", "running"].includes(run.status) ? (
              <ActionButton icon={<Ban />} label="Cancelar" onClick={onCancel} />
            ) : null}
            {run.status === "completed" && !run.is_baseline ? (
              <ActionButton icon={<CircleDot />} label="Definir baseline" onClick={onBaseline} />
            ) : null}
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-3xl font-semibold tracking-tight text-white">
                {run.completed_items + run.failed_items}
                <span className="text-base text-slate-600">/{run.total_items}</span>
              </p>
              <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">itens processados</p>
            </div>
            <p className="font-mono text-xs text-primary">{Math.round(run.progress * 100)}%</p>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${run.progress * 100}%` }} />
          </div>
          {run.failed_items > 0 ? <p className="mt-3 text-xs text-rose-300">{run.failed_items} item(ns) falharam e permanecem inspecionáveis.</p> : null}
        </div>
      </section>

      <MetricBoard metrics={metrics} calibration={run.aggregate.confidence_calibration} />

      {run.items?.length ? (
        <section className="grid min-h-[620px] overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.015] lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="border-b border-white/[0.08] lg:border-b-0 lg:border-r">
            <div className="border-b border-white/[0.07] px-4 py-4">
              <SectionLabel icon={<ScanSearch />} label="Casos" />
            </div>
            <div className="max-h-[620px] divide-y divide-white/[0.06] overflow-y-auto">
              {run.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedItemId(item.id)}
                  className={`w-full px-4 py-3 text-left transition ${
                    selectedItem?.id === item.id ? "bg-primary/[0.07]" : "hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <RunStatusDot status={item.status} />
                    <span className="truncate text-[11px] font-semibold text-slate-300">{item.case_id}</span>
                  </div>
                  <p className="mt-1.5 font-mono text-[9px] uppercase tracking-wider text-slate-600">
                    {item.profile} · r{item.repetition} · {item.convergence_mode}
                  </p>
                </button>
              ))}
            </div>
          </div>
          {selectedItem ? <CaseInspector item={selectedItem} onReview={onReview} /> : null}
        </section>
      ) : null}
    </div>
  );
}

function MetricBoard({
  metrics,
  calibration,
}: {
  metrics: Record<string, { value: number; samples: number }>;
  calibration?: { status: string; ece: number | null; reason: string };
}) {
  const ordered = [
    "observed_correctness",
    "source_coverage",
    "retrieval_precision",
    "perspective_signal",
    "repeat_stability",
    "factual_convergence",
    "principled_divergence",
    "evidence_confidence",
  ].filter((name) => metrics[name]);

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <SectionLabel icon={<Gauge />} label="Métricas agregadas" />
        <p className="text-[9px] uppercase tracking-widest text-slate-700">0-100 · maior é melhor</p>
      </div>
      {ordered.length ? (
        <div className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 xl:grid-cols-4">
          {ordered.map((name) => (
            <div key={name} className="bg-[#121215] p-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">{METRIC_LABELS[name] ?? name}</p>
              <p className="mt-3 font-mono text-2xl font-semibold text-white">{formatMetric(metrics[name].value)}</p>
              <p className="mt-2 text-[9px] text-slate-700">{metrics[name].samples} amostras</p>
              <div className="mt-3 h-px bg-white/[0.06]">
                <div className="h-px bg-primary" style={{ width: `${metrics[name].value * 100}%` }} />
              </div>
            </div>
          ))}
          <div className="bg-[#121215] p-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">ECE da confiança</p>
            <p className="mt-3 font-mono text-lg font-semibold text-technical-number">{calibration?.ece ?? "dados insuficientes"}</p>
            <p className="mt-2 text-[9px] leading-4 text-slate-700">{calibration?.reason}</p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/10 px-5 py-10 text-center text-xs text-slate-600">
          As métricas aparecerão quando os primeiros itens forem concluídos.
        </div>
      )}
    </section>
  );
}

function CaseInspector({
  item,
  onReview,
}: {
  item: LaboratoryRunItem;
  onReview: (itemId: string, review: { reviewer: string; scores: Record<string, number>; notes: string }) => Promise<void>;
}) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewer, setReviewer] = useState(item.review?.reviewer ?? "");
  const [notes, setNotes] = useState(item.review?.notes ?? "");
  const [scores, setScores] = useState<Record<string, number>>(item.review?.scores ?? {
    factual_correctness: 0.5,
    source_fidelity: 0.5,
    completeness: 0.5,
    perspective_adherence: 0.5,
    usefulness: 0.5,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setReviewer(item.review?.reviewer ?? "");
    setNotes(item.review?.notes ?? "");
    setScores(item.review?.scores ?? {
      factual_correctness: 0.5,
      source_fidelity: 0.5,
      completeness: 0.5,
      perspective_adherence: 0.5,
      usefulness: 0.5,
    });
  }, [item.id, item.review?.reviewed_at]);

  return (
    <div className="min-w-0 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/[0.07] pb-5">
        <div className="max-w-3xl">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-primary/70">
            {item.case_id} · {item.profile} · repetition {item.repetition}
          </p>
          <h3 className="mt-3 text-lg font-semibold leading-7 text-white">{item.question}</h3>
        </div>
        {item.status === "completed" ? (
          <button
            type="button"
            onClick={() => setReviewOpen((current) => !current)}
            className="rounded-full border border-white/10 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400 transition hover:border-primary/25 hover:text-white"
          >
            {item.review ? "Editar revisão" : "Revisar resposta"}
          </button>
        ) : null}
      </div>

      {item.error ? (
        <div className={`mt-5 rounded-xl border p-4 text-xs ${
          item.status === "waiting_rate_limit"
            ? "border-warning/20 bg-warning/[0.04] text-warning"
            : "border-error/20 bg-error/[0.04] text-rose-200"
        }`}>
          {item.error}
          {item.status === "waiting_rate_limit" && item.retry_after ? (
            <span className="mt-1 block font-mono text-[9px] uppercase tracking-wider text-technical-number/60">
              tentativa {item.retry_count + 1} · retoma {formatDate(item.retry_after)}
            </span>
          ) : null}
        </div>
      ) : null}

      {item.answer_text ? (
        <div className="mt-6">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">Resposta gerada</p>
          <div className="mt-3 whitespace-pre-wrap rounded-xl border border-white/[0.07] bg-black/20 p-5 text-sm leading-7 text-slate-300">
            {item.answer_text}
          </div>
        </div>
      ) : (
        <div className="mt-8 flex items-center gap-3 text-xs text-slate-600">
          {["running", "waiting_rate_limit"].includes(item.status)
            ? <LoaderCircle className="h-4 w-4 animate-spin text-primary" />
            : <PauseCircle className="h-4 w-4" />}
          {item.status === "waiting_rate_limit"
            ? "Aguardando o limite temporário da Groq liberar."
            : item.status === "running"
              ? "Gerando e persistindo a resposta."
              : item.status === "queued"
                ? "Aguardando sua vez na fila."
                : item.status === "failed"
                  ? "Nenhuma resposta foi gerada para este item."
                  : "Execução interrompida antes da resposta."}
        </div>
      )}

      {item.sources.length ? (
        <div className="mt-7">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">Evidências recuperadas</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {item.sources.map((source) => (
              <div key={`${source.position}-${source.title}`} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                <p className="truncate text-xs font-semibold text-slate-300">{source.title || source.source}</p>
                <p className="mt-1 font-mono text-[9px] text-slate-600">
                  {source.page_type} · {source.similarity === null ? "registry" : `${Math.round(source.similarity * 100)}%`}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {item.metrics.length ? <ItemMetrics metrics={item.metrics} /> : null}

      {reviewOpen ? (
        <form
          className="mt-7 rounded-2xl border border-primary/15 bg-primary/[0.035] p-5"
          onSubmit={async (event) => {
            event.preventDefault();
            setSaving(true);
            try {
              await onReview(item.id, { reviewer, scores, notes });
              setReviewOpen(false);
            } finally {
              setSaving(false);
            }
          }}
        >
          <SectionLabel icon={<CheckCircle2 />} label="Revisão humana" />
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {Object.entries(scores).map(([name, value]) => (
              <label key={name} className="grid gap-2">
                <span className="text-[10px] font-semibold text-slate-400">{METRIC_LABELS[name] ?? name}</span>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.1}
                    value={value}
                    onChange={(event) => setScores((current) => ({ ...current, [name]: Number(event.target.value) }))}
                    className="min-w-0 flex-1 accent-[#deccfd]"
                  />
                  <span className="w-10 text-right font-mono text-[10px] text-primary">{Math.round(value * 100)}%</span>
                </div>
              </label>
            ))}
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <FieldLabel label="Revisor">
              <input value={reviewer} onChange={(event) => setReviewer(event.target.value)} className="laboratory-input" required />
            </FieldLabel>
            <FieldLabel label="Notas">
              <input value={notes} onChange={(event) => setNotes(event.target.value)} className="laboratory-input" />
            </FieldLabel>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.15em] text-on-primary disabled:opacity-40"
          >
            {saving ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
            Salvar revisão
          </button>
        </form>
      ) : null}
    </div>
  );
}

function ItemMetrics({ metrics }: { metrics: LaboratoryMetric[] }) {
  return (
    <div className="mt-7">
      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">Leitura das métricas</p>
      <div className="mt-3 divide-y divide-white/[0.06] overflow-hidden rounded-xl border border-white/[0.07]">
        {metrics.map((metric) => (
          <div key={`${metric.metric_name}-${metric.evaluator_version}`} className="grid gap-2 bg-white/[0.015] px-4 py-3 sm:grid-cols-[190px_80px_1fr] sm:items-center">
            <p className="text-[10px] font-semibold text-slate-300">{METRIC_LABELS[metric.metric_name] ?? metric.metric_name}</p>
            <p className={`font-mono text-[10px] ${metric.value === null ? "text-warning" : "text-primary"}`}>{formatMetric(metric.value)}</p>
            <p className="text-[10px] leading-4 text-slate-600">{metric.rationale}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LaboratoryLoading() {
  return (
    <div className="flex min-h-[65vh] items-center justify-center gap-3 text-sm text-slate-500">
      <LoaderCircle className="h-4 w-4 animate-spin text-primary" />
      Validando acesso ao laboratório...
    </div>
  );
}

function EmptyLaboratory() {
  return (
    <div className="grid min-h-[620px] place-items-center rounded-2xl border border-dashed border-white/10 bg-white/[0.012] px-6 text-center">
      <div className="max-w-md">
        <Beaker className="mx-auto h-8 w-8 text-slate-700" />
        <h2 className="mt-5 text-xl font-semibold text-white">Nenhuma execução selecionada</h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">Configure o conjunto, as perspectivas e as repetições para iniciar o primeiro benchmark persistente.</p>
      </div>
    </div>
  );
}

function FieldLabel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-[10px] font-bold uppercase tracking-[0.17em] text-slate-500">{label}</span>
      {children}
    </label>
  );
}

function SectionLabel({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
      <span className="[&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:text-primary/70">{icon}</span>
      {label}
    </div>
  );
}

function StatusPill({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500">
      <span className="[&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-primary/60">{icon}</span>
      {label}
    </div>
  );
}

function ActionButton({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void | Promise<void> }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400 transition hover:border-primary/25 hover:text-white">
      <span className="[&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>
      {label}
    </button>
  );
}

function RunStatusDot({ status }: { status: string }) {
  const tone = status === "completed"
    ? "bg-success"
    : status === "waiting_rate_limit"
      ? "bg-warning animate-pulse"
      : status === "running" || status === "queued"
      ? "bg-primary animate-pulse"
      : status === "failed" || status === "partial"
        ? "bg-rose-300"
        : "bg-slate-600";
  return <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${tone}`} />;
}

function RunStatusChip({ status }: { status: string }) {
  const Icon = status === "completed"
    ? CheckCircle2
    : status === "running" || status === "queued"
      ? LoaderCircle
      : status === "failed" || status === "partial"
        ? Activity
        : PauseCircle;
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.03] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
      <Icon className={`h-3 w-3 ${status === "running" ? "animate-spin text-primary" : ""}`} />
      {status}
    </span>
  );
}
