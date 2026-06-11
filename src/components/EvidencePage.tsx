import {
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  Check,
  Cpu,
  FileSearch,
  Filter,
  GitBranch,
  Layers,
  Minimize2,
  Scale,
  Search,
  ShieldCheck,
  TrendingUp,
  Unlink,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import { getEvidencePageContent } from "../i18n/pages/evidencePage";
import {
  FoundationSection,
  FoundationSectionHeader,
  FoundationSectionHero,
} from "./ui/FoundationPrimitives";

const TIER_ICONS = {
  strong: ShieldCheck,
  partial: Layers,
  inferred: GitBranch,
  absent: Unlink,
} as const;

const TOKEN_STRATEGY_ICONS: Record<string, LucideIcon> = {
  selective: Search,
  deterministic: Cpu,
  compact: Minimize2,
  noise: Filter,
  scale: TrendingUp,
};

export function EvidencePage() {
  const { locale } = useI18n();
  const content = getEvidencePageContent(locale);

  return (
    <div className="foundation-page">
      <FoundationSectionHero
        description={content.description}
        eyebrow={content.eyebrow}
        icon={ShieldCheck}
        metrics={content.metrics}
        note={content.note}
        noteLabel={content.noteLabel}
        titleAccent={content.titleAccent}
        titleLead={content.titleLead}
      />

      <div className="foundation-content-shell">
        <FoundationSection aria-labelledby="evidence-hierarchy-title">
          <FoundationSectionHeader
            description={content.hierarchy.description}
            eyebrow={content.hierarchy.eyebrow}
            id="evidence-hierarchy-title"
            title={content.hierarchy.title}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {content.hierarchy.tiers.map((tier, index) => {
              const Icon = TIER_ICONS[tier.id as keyof typeof TIER_ICONS] ?? ShieldCheck;
              return (
                <article
                  key={tier.id}
                  className="content-card relative overflow-hidden p-6"
                >
                  <div className="absolute right-5 top-4 text-6xl font-black tracking-tighter text-white/[0.025]">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <header className="relative flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/[0.06] text-primary">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <h3 className="text-lg font-bold text-white">{tier.label}</h3>
                  </header>
                  <p className="mt-4 text-sm leading-7 text-on-surface-variant">{tier.summary}</p>
                </article>
              );
            })}
          </div>
        </FoundationSection>

        <FoundationSection aria-labelledby="evidence-confidence-title">
          <FoundationSectionHeader
            description={content.confidence.description}
            eyebrow={content.confidence.eyebrow}
            id="evidence-confidence-title"
            title={content.confidence.title}
          />
          <div className="grid gap-4 md:grid-cols-2">
            {content.confidence.dimensions.map((dimension) => (
              <div
                key={dimension.label}
                className="rounded-2xl border border-white/8 bg-white/[0.02] p-5"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Scale className="h-4 w-4 text-primary" aria-hidden />
                  <h3 className="text-sm font-semibold text-slate-100">{dimension.label}</h3>
                </div>
                <p className="text-xs leading-relaxed text-slate-400">{dimension.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 rounded-2xl border border-primary/15 bg-primary/[0.04] px-5 py-4 text-sm leading-7 text-slate-300">
            {content.confidence.insight}
          </p>
        </FoundationSection>

        <FoundationSection aria-labelledby="evidence-unknown-title">
          <FoundationSectionHeader
            description={content.unknown.description}
            eyebrow={content.unknown.eyebrow}
            id="evidence-unknown-title"
            title={content.unknown.title}
          />
          <ul className="space-y-3">
            {content.unknown.rules.map((rule) => (
              <li key={rule} className="flex gap-3 text-sm leading-6 text-slate-300">
                <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
          <aside className="surface-panel mt-6 rounded-2xl p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
              {content.unknown.example.label}
            </p>
            <code className="mt-2 block font-mono text-sm text-primary">{content.unknown.example.entity}</code>
            <p className="mt-3 text-sm leading-7 text-slate-400">{content.unknown.example.response}</p>
          </aside>
        </FoundationSection>

        <FoundationSection aria-labelledby="evidence-attribution-title">
          <FoundationSectionHeader
            description={content.attribution.description}
            eyebrow={content.attribution.eyebrow}
            id="evidence-attribution-title"
            title={content.attribution.title}
          />
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.attribution.sources.map((source) => (
              <div
                key={source.label}
                className="rounded-2xl border border-white/8 bg-white/[0.02] p-4"
              >
                <dt className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                  <BookOpen className="h-3.5 w-3.5 text-primary" aria-hidden />
                  {source.label}
                </dt>
                <dd className="mt-2 text-xs leading-relaxed text-slate-400">{source.detail}</dd>
              </div>
            ))}
          </dl>
        </FoundationSection>

        <FoundationSection aria-labelledby="evidence-gaps-title">
          <FoundationSectionHeader
            description={content.gaps.description}
            eyebrow={content.gaps.eyebrow}
            id="evidence-gaps-title"
            title={content.gaps.title}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {content.gaps.gapTypes.map((gap) => (
              <div
                key={gap.label}
                className="flex gap-3 rounded-2xl border border-white/8 bg-white/[0.02] p-4"
              >
                <FileSearch className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">{gap.label}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{gap.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </FoundationSection>

        <FoundationSection aria-labelledby="evidence-token-efficiency-title">
          <FoundationSectionHeader
            description={content.tokenEfficiency.description}
            eyebrow={content.tokenEfficiency.eyebrow}
            id="evidence-token-efficiency-title"
            title={content.tokenEfficiency.title}
          />

          <article
            className="rounded-[28px] border border-primary/20 bg-[linear-gradient(135deg,rgba(169,153,198,0.1),rgba(255,255,255,0.02))] p-6 sm:p-7"
            aria-label={`${content.tokenEfficiency.title}: ${content.tokenEfficiency.score}%`}
          >
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="min-w-0 flex-1">
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/[0.06] text-primary">
                    <Zap className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-white">{content.tokenEfficiency.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-on-surface-variant">
                      {content.tokenEfficiency.description}
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                    <Zap className="h-3 w-3" aria-hidden />
                    {content.tokenEfficiency.status}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-white/[0.02] px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
                    <ArrowUpRight className="h-3 w-3" aria-hidden />
                    {content.tokenEfficiency.trend}
                  </span>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  {content.tokenEfficiency.scoreLabel}
                </p>
                <p className="mt-1 font-mono text-5xl font-semibold tracking-[-0.04em] text-white" aria-hidden>
                  {content.tokenEfficiency.score}
                  <span className="text-2xl text-primary">%</span>
                </p>
                <span className="sr-only">
                  {content.tokenEfficiency.scoreSr.replace(
                    "{score}",
                    String(content.tokenEfficiency.score),
                  )}
                </span>
              </div>
            </div>
            <p className="mt-6 border-t border-white/[0.06] pt-5 text-sm leading-7 text-slate-300">
              {content.tokenEfficiency.detail}
            </p>
          </article>

          <div className="mt-8">
            <h3 className="mb-4 text-sm font-semibold text-slate-100">
              {content.tokenEfficiency.strategiesTitle}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {content.tokenEfficiency.strategies.map((strategy) => {
                const Icon = TOKEN_STRATEGY_ICONS[strategy.id] ?? Zap;
                return (
                  <div
                    key={strategy.id}
                    className="flex gap-3 rounded-2xl border border-white/8 bg-white/[0.02] p-4"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/[0.06] text-primary">
                      <Icon className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-slate-100">{strategy.label}</h4>
                      <p className="mt-1 text-xs leading-relaxed text-slate-400">
                        {strategy.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </FoundationSection>

        <FoundationSection aria-labelledby="evidence-contract-title" className="border-b-0">
          <FoundationSectionHeader
            description={content.contract.description}
            eyebrow={content.contract.eyebrow}
            id="evidence-contract-title"
            title={content.contract.title}
          />
          <ul className="space-y-3">
            {content.contract.principles.map((principle) => (
              <li key={principle} className="flex gap-3 text-sm leading-6 text-slate-300">
                <AlertTriangle className="mt-1 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                <span>{principle}</span>
              </li>
            ))}
          </ul>
        </FoundationSection>
      </div>
    </div>
  );
}
