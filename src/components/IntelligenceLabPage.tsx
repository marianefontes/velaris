import {
  AlertTriangle,
  Brain,
  CheckCircle2,
  FlaskConical,
  LoaderCircle,
  Play,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ResearchAdminGate } from "./ResearchAdminGate";
import { ErrorState, PageHero, PageShell, SecondaryButton, SectionBlock, SectionHeader, SurfacePanel } from "./ui/VisualPrimitives";
import {
  fetchAdversarialCases,
  runAdversarialSuite,
  verifyResearchAdminAccess,
} from "../services/intelligenceHealthService";
import { readResearchAdminKey } from "../services/researchAdminAuth";
import type { AdversarialCase, AdversarialResult, AdversarialSuiteResult } from "../types/intelligenceHealth";

const CATEGORY_LABELS: Record<string, string> = {
  unknown_components: "Componentes desconhecidos",
  unknown_tokens: "Tokens desconhecidos",
  unknown_states: "Estados desconhecidos",
  unknown_guidelines: "Diretrizes desconhecidas",
  invalid_comparisons: "Comparações inválidas",
  hallucination_detection: "Detecção de alucinação",
};

function ResultRow({ result }: { result: AdversarialResult }) {
  return (
    <article className={`rounded-xl border p-4 ${result.passed ? "border-emerald-500/20 bg-emerald-500/5" : "border-rose-500/20 bg-rose-500/5"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="break-words text-sm font-medium text-white">{result.query}</p>
          <p className="mt-1 text-xs text-slate-500">{CATEGORY_LABELS[result.category] ?? result.category}</p>
        </div>
        {result.passed ? (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
        ) : (
          <XCircle className="h-5 w-5 shrink-0 text-rose-400" />
        )}
      </div>
      <div className="mt-3 grid gap-1 text-xs text-slate-400">
        <p>Esperado: {result.expected}</p>
        <p>Fluxo: {result.workflow}</p>
        {result.entity_status ? <p>Status da entidade: {result.entity_status}</p> : null}
        {result.fail_reason ? <p className="text-rose-300">Motivo da falha: {result.fail_reason}</p> : null}
      </div>
      {result.response_preview ? (
        <p className="surface-panel mt-3 p-3 text-xs leading-6 text-slate-300">
          {result.response_preview}
        </p>
      ) : null}
    </article>
  );
}

export function IntelligenceLabPage() {
  const [authStatus, setAuthStatus] = useState<"checking" | "locked" | "ready">("checking");
  const [cases, setCases] = useState<AdversarialCase[]>([]);
  const [result, setResult] = useState<AdversarialSuiteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  const loadCases = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setCases(await fetchAdversarialCases());
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Não foi possível carregar os casos de teste.");
    } finally {
      setLoading(false);
    }
  }, []);

  const executeSuite = useCallback(async () => {
    setRunning(true);
    setError("");
    try {
      setResult(await runAdversarialSuite());
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Não foi possível executar a suite. Tente novamente.");
    } finally {
      setRunning(false);
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
      await loadCases();
    }
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [loadCases]);

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
        eyebrow="Adversarial intelligence lab"
        title="Quebrar o Abraxos antes que os usuários quebrem."
        description="Suite adversarial para descobrir falhas de cobertura, comparações inválidas e risco de alucinação. A meta não é sucesso — é descobrir onde a inteligência falha."
        onAuthenticated={() => {
          setAuthStatus("ready");
          loadCases();
        }}
      />
    );
  }

  return (
    <PageShell width="wide">
      <PageHero
        eyebrow="Internal audit · Intelligence lab"
        title="Adversarial Test Suite"
        description="Testes determinísticos que tentam forçar respostas sem evidência, comparações inválidas e invenção de entidades. Cada falha é um sinal de risco real."
        actions={(
          <>
            <button
              type="button"
              onClick={executeSuite}
              disabled={running}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-on-primary transition hover:bg-primary-dim disabled:opacity-50"
            >
              {running ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
              Executar suite
            </button>
            <button
              type="button"
              onClick={loadCases}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-300 transition hover:border-primary/25 hover:text-white disabled:opacity-50"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Recarregar casos
            </button>
            <Link
              to="/knowledge-health"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-300 transition hover:border-primary/25 hover:text-white"
            >
              <FlaskConical className="h-3.5 w-3.5" />
              Knowledge Health
            </Link>
          </>
        )}
        aside={result ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Pass rate</p>
            <p className="mt-2 text-5xl font-semibold tracking-[-0.05em] text-white">{result.pass_rate_percent}%</p>
            <p className="mt-2 text-xs text-slate-500">{result.passed} / {result.total} casos</p>
          </div>
        ) : null}
      />

      {error ? (
        <SectionBlock className="mt-6">
          <ErrorState
            icon={<AlertTriangle className="h-5 w-5 text-error" />}
            title="Não foi possível completar a operação"
            description={error}
            action={(
              <SecondaryButton onClick={() => void loadCases()} disabled={loading || running}>
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "motion-safe:animate-spin" : ""}`} />
                Tentar novamente
              </SecondaryButton>
            )}
          />
        </SectionBlock>
      ) : null}

      <div className="mt-10 grid gap-8">
        <SectionBlock>
          <SectionHeader
            title="Casos adversariais"
            eyebrow="Catalog"
            description={`${cases.length} casos registrados em 6 categorias.`}
          />
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {cases.map((testCase) => (
              <SurfacePanel as="div" key={testCase.id} className="p-4">
                <p className="text-sm font-medium text-white">{testCase.query}</p>
                <p className="mt-2 text-xs text-slate-500">{CATEGORY_LABELS[testCase.category] ?? testCase.category}</p>
                <p className="mt-2 text-xs text-slate-400">{testCase.description}</p>
              </SurfacePanel>
            ))}
          </div>
        </SectionBlock>

        {result ? (
          <>
            <SectionBlock>
              <SectionHeader title="Resultado por categoria" eyebrow="Summary" />
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {Object.entries(result.by_category).map(([category, stats]) => (
                  <SurfacePanel as="div" key={category} className="px-4 py-3">
                    <p className="text-sm font-medium text-white">{CATEGORY_LABELS[category] ?? category}</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{stats.passed}/{stats.total}</p>
                  </SurfacePanel>
                ))}
              </div>
            </SectionBlock>

            <SectionBlock>
              <SectionHeader
                title="Resultados detalhados"
                eyebrow="Execution"
                description="Falhas indicam lacunas reais de governança — não são regressões a ignorar."
              />
              <div className="mt-5 grid gap-3">
                {result.results
                  .slice()
                  .sort((a, b) => Number(a.passed) - Number(b.passed))
                  .map((entry) => (
                    <ResultRow key={entry.id} result={entry} />
                  ))}
              </div>
            </SectionBlock>

            {result.pass_rate_percent < 100 ? (
              <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
                <div>
                  <p className="text-sm font-medium text-amber-100">Falhas detectadas — comportamento esperado desta ferramenta</p>
                  <p className="mt-1 text-sm leading-6 text-amber-100/80">
                    O lab existe para expor limites. Corrija a inteligência ou documente a lacuna antes de expandir capacidades.
                  </p>
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
            <Brain className="mx-auto h-8 w-8 text-primary/70" />
            <p className="mt-4 text-sm text-slate-400">Execute a suite para ver resultados adversariais.</p>
          </div>
        )}
      </div>
    </PageShell>
  );
}
