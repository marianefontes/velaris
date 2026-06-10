import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Eye,
  FlaskConical,
  Gauge,
  Layers3,
  MessageSquareText,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";
import type { Locale } from "../i18n/translations";
import {
  fetchStudyResults,
  type ResultDistributionItem,
  type StudyResults,
} from "../services/studyResultsService";
import { useStudyParticipantSession } from "../hooks/useStudyParticipantSession";
import { useLaboratorySnapshot } from "../hooks/useLaboratorySnapshot";
import { readResearchAdminKey } from "../services/researchAdminAuth";
import type { LaboratoryResults } from "../types/laboratory";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageShell,
} from "./ui/VisualPrimitives";

const COPY: Record<Locale, {
  eyebrow: string;
  title: string;
  accent: string;
  lead: string;
  live: string;
  privacy: string;
  updated: string;
  participants: string;
  invited: string;
  started: string;
  completed: string;
  completion: string;
  recruitmentTitle: string;
  recruitmentCaption: string;
  profilesEyebrow: string;
  profilesTitle: string;
  area: string;
  experience: string;
  dsExperience: string;
  dsFrequency: string;
  usageEyebrow: string;
  usageTitle: string;
  events: string;
  pageViews: string;
  prompts: string;
  responses: string;
  perspectiveChanges: string;
  errors: string;
  averagePrompts: string;
  averageDuration: string;
  minutes: string;
  instrumentsEyebrow: string;
  instrumentsTitle: string;
  observed: string;
  pending: string;
  observedBody: string;
  pendingBody: string;
  emptyTitle: string;
  emptyBody: string;
  evaluationCta: string;
  errorTitle: string;
  errorBody: string;
  retry: string;
}> = {
  "pt-BR": {
    eyebrow: "Resultados do estudo",
    title: "O que o uso real",
    accent: "revelou.",
    lead: "Evidências agregadas da avaliação acadêmica do Velaris. Os números abaixo vêm das sessões registradas e nunca expõem a identidade de participantes.",
    live: "Dados reais",
    privacy: "Agregado e anonimizado",
    updated: "Atualizado",
    participants: "Participantes",
    invited: "Convidados",
    started: "Iniciaram",
    completed: "Concluíram",
    completion: "Taxa de conclusão",
    recruitmentTitle: "Jornada da participação",
    recruitmentCaption: "Do convite à conclusão da sessão acadêmica.",
    profilesEyebrow: "Amostra",
    profilesTitle: "Quem participou",
    area: "Área de atuação",
    experience: "Experiência profissional",
    dsExperience: "Experiência com design systems",
    dsFrequency: "Frequência de uso",
    usageEyebrow: "Comportamento observado",
    usageTitle: "Como o Velaris foi utilizado",
    events: "Eventos registrados",
    pageViews: "Páginas acessadas",
    prompts: "Perguntas enviadas",
    responses: "Respostas concluídas",
    perspectiveChanges: "Trocas de perspectiva",
    errors: "Erros de resposta",
    averagePrompts: "Perguntas por sessão",
    averageDuration: "Duração média concluída",
    minutes: "min",
    instrumentsEyebrow: "Evidência acadêmica",
    instrumentsTitle: "O que já é observável e o que ainda depende da coleta",
    observed: "Observado no produto",
    pending: "Instrumentos pendentes",
    observedBody: "Navegação, perguntas, respostas, erros, perspectivas utilizadas e conclusão das sessões.",
    pendingBody: "SUS, clareza da explicação, confiança, sucesso nas tarefas e feedback qualitativo serão publicados após os questionários.",
    emptyTitle: "A coleta ainda não começou.",
    emptyBody: "Esta página será preenchida automaticamente quando as primeiras pessoas iniciarem os links personalizados do estudo.",
    evaluationCta: "Ver metodologia",
    errorTitle: "Os resultados não puderam ser carregados.",
    errorBody: "O servidor de pesquisa está indisponível ou ainda não foi configurado neste ambiente.",
    retry: "Tentar novamente",
  },
  "pt-PT": {
    eyebrow: "Resultados do estudo",
    title: "O que a utilização real",
    accent: "revelou.",
    lead: "Evidências agregadas da avaliação académica do Velaris. Os números abaixo vêm das sessões registadas e nunca expõem a identidade dos participantes.",
    live: "Dados reais",
    privacy: "Agregado e anonimizado",
    updated: "Atualizado",
    participants: "Participantes",
    invited: "Convidados",
    started: "Iniciaram",
    completed: "Concluíram",
    completion: "Taxa de conclusão",
    recruitmentTitle: "Jornada da participação",
    recruitmentCaption: "Do convite à conclusão da sessão académica.",
    profilesEyebrow: "Amostra",
    profilesTitle: "Quem participou",
    area: "Área de atuação",
    experience: "Experiência profissional",
    dsExperience: "Experiência com design systems",
    dsFrequency: "Frequência de utilização",
    usageEyebrow: "Comportamento observado",
    usageTitle: "Como o Velaris foi utilizado",
    events: "Eventos registados",
    pageViews: "Páginas acedidas",
    prompts: "Perguntas enviadas",
    responses: "Respostas concluídas",
    perspectiveChanges: "Trocas de perspetiva",
    errors: "Erros de resposta",
    averagePrompts: "Perguntas por sessão",
    averageDuration: "Duração média concluída",
    minutes: "min",
    instrumentsEyebrow: "Evidência académica",
    instrumentsTitle: "O que já é observável e o que ainda depende da recolha",
    observed: "Observado no produto",
    pending: "Instrumentos pendentes",
    observedBody: "Navegação, perguntas, respostas, erros, perspetivas utilizadas e conclusão das sessões.",
    pendingBody: "SUS, clareza da explicação, confiança, sucesso nas tarefas e feedback qualitativo serão publicados após os questionários.",
    emptyTitle: "A recolha ainda não começou.",
    emptyBody: "Esta página será preenchida automaticamente quando as primeiras pessoas iniciarem os links personalizados do estudo.",
    evaluationCta: "Ver metodologia",
    errorTitle: "Não foi possível carregar os resultados.",
    errorBody: "O servidor de investigação está indisponível ou ainda não foi configurado neste ambiente.",
    retry: "Tentar novamente",
  },
  "en-US": {
    eyebrow: "Study results",
    title: "What real usage",
    accent: "revealed.",
    lead: "Aggregated evidence from the Velaris academic evaluation. The figures below come from recorded sessions and never expose participant identities.",
    live: "Real data",
    privacy: "Aggregated and anonymized",
    updated: "Updated",
    participants: "Participants",
    invited: "Invited",
    started: "Started",
    completed: "Completed",
    completion: "Completion rate",
    recruitmentTitle: "Participation journey",
    recruitmentCaption: "From invitation to completion of the academic session.",
    profilesEyebrow: "Sample",
    profilesTitle: "Who participated",
    area: "Professional area",
    experience: "Professional experience",
    dsExperience: "Design-system experience",
    dsFrequency: "Usage frequency",
    usageEyebrow: "Observed behavior",
    usageTitle: "How Velaris was used",
    events: "Recorded events",
    pageViews: "Page views",
    prompts: "Questions submitted",
    responses: "Completed responses",
    perspectiveChanges: "Perspective changes",
    errors: "Response errors",
    averagePrompts: "Questions per session",
    averageDuration: "Average completed duration",
    minutes: "min",
    instrumentsEyebrow: "Academic evidence",
    instrumentsTitle: "What is observable and what still depends on collection",
    observed: "Observed in product",
    pending: "Pending instruments",
    observedBody: "Navigation, questions, responses, errors, perspectives used and session completion.",
    pendingBody: "SUS, explanation clarity, trust, task success and qualitative feedback will be published after questionnaires.",
    emptyTitle: "Data collection has not started yet.",
    emptyBody: "This page will populate automatically when the first participants start their personalized study links.",
    evaluationCta: "View methodology",
    errorTitle: "Results could not be loaded.",
    errorBody: "The research server is unavailable or has not been configured in this environment.",
    retry: "Try again",
  },
};

const LABELS: Record<Locale, Record<string, string>> = {
  "pt-BR": {
    design: "Design / UX / UI", frontend: "Front-end", product: "Produto", qa: "Qualidade / QA",
    content: "Conteúdo", accessibility: "Acessibilidade", research: "Pesquisa", other: "Outra",
    "under-1": "Menos de 1 ano", "1-2": "1 a 2 anos", "3-5": "3 a 5 anos",
    "6-10": "6 a 10 anos", "over-10": "Mais de 10 anos", none: "Nenhuma",
    basic: "Básica", intermediate: "Intermediária", advanced: "Avançada", never: "Nunca",
    rarely: "Raramente", monthly: "Mensalmente", weekly: "Semanalmente", daily: "Diariamente",
  },
  "pt-PT": {
    design: "Design / UX / UI", frontend: "Front-end", product: "Produto", qa: "Qualidade / QA",
    content: "Conteúdo", accessibility: "Acessibilidade", research: "Investigação", other: "Outra",
    "under-1": "Menos de 1 ano", "1-2": "1 a 2 anos", "3-5": "3 a 5 anos",
    "6-10": "6 a 10 anos", "over-10": "Mais de 10 anos", none: "Nenhuma",
    basic: "Básica", intermediate: "Intermédia", advanced: "Avançada", never: "Nunca",
    rarely: "Raramente", monthly: "Mensalmente", weekly: "Semanalmente", daily: "Diariamente",
  },
  "en-US": {
    design: "Design / UX / UI", frontend: "Front-end", product: "Product", qa: "Quality / QA",
    content: "Content", accessibility: "Accessibility", research: "Research", other: "Other",
    "under-1": "Under 1 year", "1-2": "1 to 2 years", "3-5": "3 to 5 years",
    "6-10": "6 to 10 years", "over-10": "Over 10 years", none: "None",
    basic: "Basic", intermediate: "Intermediate", advanced: "Advanced", never: "Never",
    rarely: "Rarely", monthly: "Monthly", weekly: "Weekly", daily: "Daily",
  },
};

export function StudyResultsPage() {
  const { locale } = useI18n();
  const copy = COPY[locale];
  const participantStatus = useStudyParticipantSession();
  const [results, setResults] = useState<StudyResults | null>(null);
  const [activeSection, setActiveSection] = useState<"study" | "laboratory">("study");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const laboratorySnapshot = useLaboratorySnapshot(
    participantStatus === "none" && Boolean(readResearchAdminKey()),
  );
  const laboratoryResults = laboratorySnapshot.snapshot as LaboratoryResults | null;

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      setResults(await fetchStudyResults());
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchStudyResults(controller.signal)
      .then((data) => {
        setResults(data);
        setStatus("ready");
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setStatus("error");
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (participantStatus !== "none" || !readResearchAdminKey()) {
      setActiveSection("study");
    }
  }, [participantStatus]);

  if (status === "loading") return <ResultsLoading copy={copy} />;
  if (status === "error" || !results) return <ResultsError copy={copy} onRetry={load} />;

  return (
    <PageShell>
      {laboratoryResults ? (
        <ResultsModeNav active={activeSection} onChange={setActiveSection} locale={locale} />
      ) : null}

      {activeSection === "laboratory" && laboratoryResults ? (
        <LaboratoryResultsView results={laboratoryResults} locale={locale} />
      ) : (
      <>
      <header className="page-hero">
        <div className="page-eyebrow">
          <BarChart3 className="h-3.5 w-3.5" aria-hidden />
          {copy.eyebrow}
        </div>
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <h1 className="page-h1 max-w-3xl">
              {copy.title} <span className="page-h1-accent">{copy.accent}</span>
            </h1>
            <p className="page-lead">{copy.lead}</p>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <StatusPill icon={<Activity className="h-3 w-3" />} label={copy.live} />
            <StatusPill icon={<ShieldCheck className="h-3 w-3" />} label={copy.privacy} />
          </div>
        </div>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-slate-600">
          {copy.updated}: {formatDate(results.generated_at, locale)}
        </p>
      </header>

      {results.participants.started === 0 ? (
        <EmptyResults copy={copy} />
      ) : (
        <>
          <section className="mb-14">
            <div
              data-abraxos-focus="results-metrics"
              className="grid overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.018] sm:grid-cols-2 lg:grid-cols-4"
            >
              <SummaryMetric label={copy.invited} value={results.participants.invited} />
              <SummaryMetric label={copy.started} value={results.participants.started} />
              <SummaryMetric label={copy.completed} value={results.participants.completed} />
              <SummaryMetric label={copy.completion} value={`${formatNumber(results.participants.completion_rate, locale)}%`} accent />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
              <SectionIntro
                eyebrow={copy.participants}
                title={copy.recruitmentTitle}
                caption={copy.recruitmentCaption}
              />
              <RecruitmentFlow results={results} copy={copy} />
            </div>
          </section>

          <section className="mb-14 border-t border-white/[0.07] pt-12">
            <SectionIntro eyebrow={copy.profilesEyebrow} title={copy.profilesTitle} />
            <div className="mt-7 grid gap-x-10 gap-y-9 lg:grid-cols-2">
              <Distribution title={copy.area} items={results.profiles.primary_area} locale={locale} />
              <Distribution title={copy.experience} items={results.profiles.experience_range} locale={locale} />
              <Distribution title={copy.dsExperience} items={results.profiles.design_system_experience} locale={locale} />
              <Distribution title={copy.dsFrequency} items={results.profiles.design_system_frequency} locale={locale} />
            </div>
          </section>

          <section className="mb-14 border-t border-white/[0.07] pt-12">
            <SectionIntro eyebrow={copy.usageEyebrow} title={copy.usageTitle} />
            <div className="mt-7 grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-4">
              <UsageMetric icon={<Layers3 />} label={copy.events} value={results.usage.total_events} />
              <UsageMetric icon={<Eye />} label={copy.pageViews} value={results.usage.page_views} />
              <UsageMetric icon={<MessageSquareText />} label={copy.prompts} value={results.usage.prompts} />
              <UsageMetric icon={<CheckCircle2 />} label={copy.responses} value={results.usage.responses} />
              <UsageMetric icon={<Sparkles />} label={copy.perspectiveChanges} value={results.usage.perspective_changes} />
              <UsageMetric icon={<Activity />} label={copy.errors} value={results.usage.errors} danger={results.usage.errors > 0} />
              <UsageMetric
                icon={<Gauge />}
                label={copy.averagePrompts}
                value={formatNumber(results.usage.average_prompts_per_session, locale)}
              />
              <UsageMetric
                icon={<Clock3 />}
                label={copy.averageDuration}
                value={results.usage.average_session_minutes === null
                  ? ":"
                  : `${formatNumber(results.usage.average_session_minutes, locale)} ${copy.minutes}`}
              />
            </div>
          </section>
        </>
      )}

      <section className="border-t border-white/[0.07] pt-12">
        <SectionIntro eyebrow={copy.instrumentsEyebrow} title={copy.instrumentsTitle} />
        <div className="mt-7 grid gap-5 lg:grid-cols-2">
          <EvidencePanel
            icon={<CheckCircle2 className="h-5 w-5" />}
            label={copy.observed}
            body={copy.observedBody}
            tone="observed"
          />
          <EvidencePanel
            icon={<Clock3 className="h-5 w-5" />}
            label={copy.pending}
            body={copy.pendingBody}
            tone="pending"
          />
        </div>
      </section>
      </>
      )}
    </PageShell>
  );
}

function ResultsModeNav({
  active,
  onChange,
  locale,
}: {
  active: "study" | "laboratory";
  onChange: (section: "study" | "laboratory") => void;
  locale: Locale;
}) {
  const study = locale === "en-US" ? "Study results" : "Resultados do estudo";
  const laboratory = locale === "en-US" ? "Laboratory results" : "Resultados do laboratório";
  return (
    <nav aria-label="Result sections" className="mb-8 flex w-fit gap-1 rounded-full border border-white/[0.08] bg-white/[0.025] p-1">
      {[
        { id: "study" as const, label: study, icon: UsersRound },
        { id: "laboratory" as const, label: laboratory, icon: FlaskConical },
      ].map((section) => {
        const Icon = section.icon;
        return (
          <button
            key={section.id}
            type="button"
            aria-pressed={active === section.id}
            onClick={() => onChange(section.id)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] transition ${
              active === section.id ? "bg-primary text-on-primary" : "text-slate-500 hover:text-white"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {section.label}
          </button>
        );
      })}
    </nav>
  );
}

function LaboratoryResultsView({ results, locale }: { results: LaboratoryResults; locale: Locale }) {
  const isEnglish = locale === "en-US";
  const latestMetrics = results.latest?.aggregate.metrics ?? {};
  const selectedMetrics = [
    "observed_correctness",
    "source_coverage",
    "retrieval_precision",
    "perspective_signal",
    "repeat_stability",
    "factual_convergence",
    "principled_divergence",
    "intent_match",
  ].filter((name) => latestMetrics[name]);

  return (
    <>
      <header className="page-hero">
        <div className="page-eyebrow">
          <FlaskConical className="h-3.5 w-3.5" aria-hidden />
          {isEnglish ? "Laboratory results" : "Resultados do laboratório"}
        </div>
        <h1 className="page-h1 max-w-4xl">
          {isEnglish ? "What controlled evaluation" : "O que a avaliação controlada"}{" "}
          <span className="page-h1-accent">{isEnglish ? "found." : "encontrou."}</span>
        </h1>
        <p className="page-lead max-w-3xl">
          {isEnglish
            ? "Persisted benchmark evidence, kept separate from participant research data."
            : "Evidências persistidas dos benchmarks, mantidas separadas dos dados da pesquisa com participantes."}
        </p>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-slate-600">
          {isEnglish ? "Updated" : "Atualizado"}: {formatDate(results.generated_at, locale)}
        </p>
      </header>

      <section className="grid overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-4">
        <SummaryMetric label={isEnglish ? "Runs" : "Execuções"} value={results.run_count} />
        <SummaryMetric label={isEnglish ? "Completed" : "Concluídas"} value={results.completed_run_count} />
        <SummaryMetric label={isEnglish ? "Pending reviews" : "Revisões pendentes"} value={results.pending_reviews} />
        <SummaryMetric
          label={isEnglish ? "Latest score" : "Nota mais recente"}
          value={results.latest?.aggregate.score === null || results.latest?.aggregate.score === undefined
            ? ":"
            : `${Math.round(results.latest.aggregate.score * 100)}%`}
          accent
        />
      </section>

      <section className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] lg:grid-cols-[1.1fr_1fr]">
        <div className="bg-background p-6">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-primary/70">
            {isEnglish ? "Automatic calibration" : "Calibração automática"}
          </p>
          <p className="mt-4 text-lg font-semibold text-white">
            {!results.automation.enabled
              ? isEnglish ? "Disabled in this environment" : "Desativada neste ambiente"
              : results.automation.paused
                ? isEnglish ? "Paused" : "Pausada"
                : isEnglish ? "Operational" : "Operacional"}
          </p>
          <p className="mt-2 text-xs leading-6 text-slate-500">
            {results.automation.pause_reason
              ?? `${isEnglish ? "Active version" : "Versão ativa"}: ${results.active_calibration.label}`}
          </p>
          <p className="mt-4 font-mono text-[9px] uppercase tracking-widest text-slate-700">
            {results.automation.next_slot
              ? `${isEnglish ? "Next" : "Próxima"}: ${results.automation.next_slot.version_label} · ${formatDate(results.automation.next_slot.scheduled_for, locale)}`
              : isEnglish ? "No upcoming slot" : "Sem próxima janela"}
          </p>
        </div>
        <div className="grid gap-px bg-white/[0.08] sm:grid-cols-3">
          {[1, 2, 3].map((slotIndex) => {
            const candidate = results.candidates.find((item) => item.slot_index === slotIndex);
            return (
              <div key={slotIndex} className="bg-background p-5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">candidate{slotIndex}</p>
                <p className="mt-4 text-sm font-semibold text-slate-200">{candidate?.status ?? (isEnglish ? "Waiting" : "Aguardando")}</p>
                <p className="mt-2 font-mono text-[8px] text-slate-700">{slotIndex}x</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-12 border-t border-white/[0.07] pt-12">
        <SectionIntro
          eyebrow={isEnglish ? "Latest completed run" : "Última execução concluída"}
          title={results.latest?.version_label ?? (isEnglish ? "No completed run yet" : "Nenhuma execução concluída")}
          caption={results.latest
            ? `${results.latest.model} · prompt ${results.latest.prompt_fingerprint} · dataset ${results.latest.dataset_fingerprint}`
            : undefined}
        />
        {selectedMetrics.length ? (
          <div className="mt-7 grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-4">
            {selectedMetrics.map((name) => (
              <div key={name} className="bg-background p-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">{laboratoryMetricLabel(name, locale)}</p>
                <p className="mt-4 font-mono text-2xl font-semibold text-white">{Math.round(latestMetrics[name].value * 100)}%</p>
                <p className="mt-2 text-[9px] text-slate-700">{latestMetrics[name].samples} samples</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-7 rounded-2xl border border-dashed border-white/10 px-6 py-12 text-center text-sm text-slate-600">
            {isEnglish ? "Run the first benchmark to populate laboratory metrics." : "Execute o primeiro benchmark para preencher as métricas do laboratório."}
          </div>
        )}
      </section>

      <section className="mt-12 grid gap-5 border-t border-white/[0.07] pt-12 lg:grid-cols-2">
        <EvidencePanel
          icon={<ShieldCheck className="h-5 w-5" />}
          label={isEnglish ? "Active baseline" : "Baseline ativa"}
          body={results.baseline
            ? `${results.baseline.version_label} · ${formatDate(results.baseline.completed_at ?? results.baseline.created_at, locale)}`
            : isEnglish ? "No completed run was designated as baseline." : "Nenhuma execução concluída foi definida como baseline."}
          tone="observed"
        />
        <EvidencePanel
          icon={<Activity className="h-5 w-5" />}
          label={isEnglish ? "Detected regressions" : "Regressões detectadas"}
          body={results.regressions.length
            ? results.regressions.map((item) => `${laboratoryMetricLabel(item.metric, locale)} ${Math.round(item.delta * 100)}pp`).join(" · ")
            : isEnglish ? "No comparable regression is currently recorded." : "Nenhuma regressão comparável está registrada no momento."}
          tone={results.regressions.length ? "pending" : "observed"}
        />
      </section>

      {results.recommendations[0] ? (
        <section className="mt-12 border-t border-white/[0.07] pt-12">
          <SectionIntro
            eyebrow={isEnglish ? "Latest recommendation" : "Recomendação mais recente"}
            title={results.recommendations[0].title}
            caption={results.recommendations[0].summary}
          />
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/15 bg-primary/[0.035] p-5">
            <p className="max-w-3xl text-sm leading-7 text-slate-400">{results.recommendations[0].rationale}</p>
            <Link
              to={`/laboratory?view=recommendations&recommendation=${results.recommendations[0].id}`}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-primary transition hover:bg-primary/10"
            >
              {isEnglish ? "Read evidence" : "Ler evidências"}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      ) : null}
    </>
  );
}

function laboratoryMetricLabel(metric: string, locale: Locale): string {
  const labels: Record<string, [string, string]> = {
    observed_correctness: ["Correção observada", "Observed correctness"],
    source_coverage: ["Cobertura de fontes", "Source coverage"],
    retrieval_precision: ["Precisão do retrieval", "Retrieval precision"],
    perspective_signal: ["Sinal da perspectiva", "Perspective signal"],
    repeat_stability: ["Estabilidade", "Repeat stability"],
    factual_convergence: ["Convergência factual", "Factual convergence"],
    principled_divergence: ["Divergência fundamentada", "Principled divergence"],
    intent_match: ["Aderência ao intent", "Intent match"],
  };
  const label = labels[metric];
  return label ? label[locale === "en-US" ? 1 : 0] : metric;
}

function ResultsLoading({ copy }: { copy: typeof COPY[Locale] }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[1280px] items-center justify-center px-6">
      <LoadingState title={copy.eyebrow} description={copy.lead} />
    </div>
  );
}

function ResultsError({ copy, onRetry }: { copy: typeof COPY[Locale]; onRetry: () => void }) {
  return (
    <div className="mx-auto flex min-h-[65vh] max-w-xl flex-col justify-center px-6">
      <h1 className="sr-only">{copy.errorTitle}</h1>
      <ErrorState
        icon={<Activity className="h-5 w-5 text-error" />}
        title={copy.errorTitle}
        description={copy.errorBody}
        action={
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:border-primary/25 hover:text-white"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            {copy.retry}
          </button>
        }
      />
    </div>
  );
}

function EmptyResults({ copy }: { copy: typeof COPY[Locale] }) {
  return (
    <section className="mb-14">
      <EmptyState
        icon={<UsersRound className="h-5 w-5" />}
        title={copy.emptyTitle}
        description={copy.emptyBody}
        action={
          <Link
            to="/evaluation"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-xs font-semibold text-primary transition-colors hover:text-white"
          >
            {copy.evaluationCta}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      />
    </section>
  );
}

function StatusPill({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/[0.05] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-primary/80">
      {icon}
      {label}
    </span>
  );
}

function SummaryMetric({ label, value, accent = false }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="border-b border-white/[0.07] p-5 last:border-b-0 sm:border-r sm:[&:nth-child(2)]:border-r-0 lg:border-b-0 lg:[&:nth-child(2)]:border-r lg:last:border-r-0">
      <p className={`font-mono text-3xl font-semibold tracking-tight ${accent ? "text-primary" : "text-white"}`}>{value}</p>
      <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">{label}</p>
    </div>
  );
}

function SectionIntro({ eyebrow, title, caption }: { eyebrow: string; title: string; caption?: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-600">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">{title}</h2>
      {caption ? <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">{caption}</p> : null}
    </div>
  );
}

function RecruitmentFlow({ results, copy }: { results: StudyResults; copy: typeof COPY[Locale] }) {
  const max = Math.max(results.participants.invited, 1);
  const steps = [
    { label: copy.invited, value: results.participants.invited },
    { label: copy.started, value: results.participants.started },
    { label: copy.completed, value: results.participants.completed },
  ];

  return (
    <div className="space-y-5">
      {steps.map((step, index) => (
        <div key={step.label} className="grid grid-cols-[88px_1fr_40px] items-center gap-4">
          <span className="text-xs font-medium text-slate-400">{step.label}</span>
          <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
            <div
              className={`h-full rounded-full ${index === 2 ? "bg-primary" : "bg-primary/45"}`}
              style={{ width: `${Math.max((step.value / max) * 100, step.value > 0 ? 4 : 0)}%` }}
            />
          </div>
          <span className="text-right font-mono text-xs text-slate-300">{step.value}</span>
        </div>
      ))}
    </div>
  );
}

function Distribution({
  title,
  items,
  locale,
}: {
  title: string;
  items: ResultDistributionItem[];
  locale: Locale;
}) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-slate-200">{title}</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.key}>
            <div className="mb-1.5 flex items-center justify-between gap-4 text-xs">
              <span className="text-slate-400">{LABELS[locale][item.key] ?? item.key}</span>
              <span className="font-mono text-slate-500">
                {item.count} · {formatNumber(item.percentage, locale)}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
              <div className="h-full rounded-full bg-primary/55" style={{ width: `${item.percentage}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsageMetric({
  icon,
  label,
  value,
  danger = false,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  danger?: boolean;
}) {
  return (
    <div className="bg-background p-5">
      <div className={`mb-6 [&>svg]:h-4 [&>svg]:w-4 ${danger ? "text-error" : "text-primary/60"}`}>{icon}</div>
      <p className={`font-mono text-2xl font-semibold ${danger ? "text-rose-200" : "text-white"}`}>{value}</p>
      <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">{label}</p>
    </div>
  );
}

function EvidencePanel({
  icon,
  label,
  body,
  tone,
}: {
  icon: ReactNode;
  label: string;
  body: string;
  tone: "observed" | "pending";
}) {
  const observed = tone === "observed";
  return (
    <div className={`rounded-2xl border p-6 ${observed ? "border-success/15 bg-success/[0.025]" : "border-warning/15 bg-warning/[0.025]"}`}>
      <div className={`mb-5 ${observed ? "text-success" : "text-warning"}`}>{icon}</div>
      <h3 className="text-sm font-semibold text-white">{label}</h3>
      <p className="mt-3 text-xs leading-6 text-slate-400">{body}</p>
    </div>
  );
}

function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value);
}

function formatDate(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
