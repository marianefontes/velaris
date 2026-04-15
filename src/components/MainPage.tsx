import { useState } from "react";
import {
  ArrowRight,
  Bot,
  Boxes,
  BrainCircuit,
  MoveUpRight,
  Palette,
  Send,
  Sparkles,
  TerminalSquare,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";

interface JourneyCard {
  title: string;
  description: string;
  cta: string;
  to: string;
  icon: typeof Sparkles;
  tone: string;
}

interface PillarTag {
  label: string;
}

const journeyCards: JourneyCard[] = [
  {
    title: "AI Synthesis",
    description:
      "Converse com Beatrice para gerar layouts, analisar decisões e navegar pelo sistema.",
    cta: "Initialize Core",
    to: "/beatrice-chat",
    icon: Sparkles,
    tone: "text-primary",
  },
  {
    title: "Blueprint Mode",
    description:
      "Explore cores, tipografia, grids, elevações e princípios da fundação visual.",
    cta: "View Tokens",
    to: "/foundations",
    icon: Palette,
    tone: "text-secondary",
  },
  {
    title: "Dev Integration",
    description:
      "A ponte entre tokens, componentes e engenharia em fluxos reais de produto.",
    cta: "Get Config",
    to: "/dev-integration",
    icon: TerminalSquare,
    tone: "text-tertiary",
  },
];

const foundationTags: PillarTag[] = [
  { label: "Color" },
  { label: "Type" },
  { label: "Grid" },
];

export function MainPage() {
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();
  const { t } = useI18n();

  function openChat() {
    navigate("/beatrice-chat");
  }

  return (
    <div className="space-y-20 pb-16">
      <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-surface-container-low to-surface-container">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(222,204,253,0.18),transparent_32%)]" />
        <div className="relative grid gap-8 p-10 lg:grid-cols-[1.1fr_0.9fr] lg:p-16">
          <div className="max-w-2xl">
            <p className="mb-5 text-[10px] uppercase tracking-[0.3em] text-on-surface-variant">
              {t("main.eyebrow")}
            </p>
            <h1 className="mb-6 text-5xl font-black leading-[0.92] tracking-tight text-white lg:text-7xl">
              {t("main.titlePrefix")} <span className="signature-text">{t("main.titleAccent")}</span>
            </h1>
            <p className="mb-10 max-w-xl text-lg leading-relaxed text-on-surface-variant">
              {t("main.description")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/components"
                className="inline-flex items-center gap-3 rounded-[20px] bg-signature px-8 py-4 font-bold text-on-primary transition-transform hover:scale-[1.02]"
              >
                {t("main.ctaPrimary")}
                <MoveUpRight className="h-4 w-4" />
              </Link>
              <Link
                to="/foundations"
                className="glass-panel rounded-[20px] px-8 py-4 font-bold text-primary"
              >
                {t("main.ctaSecondary")}
              </Link>
              <Link
                to="/design-decisions"
                className="flex items-center gap-2 rounded-[20px] px-8 py-4 font-medium text-on-surface-variant transition-colors hover:text-primary"
              >
                <BrainCircuit className="h-4 w-4" />
                {t("main.ctaTertiary")}
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="glass-panel h-full rounded-[32px] p-8 shadow-glow">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">
                    {t("main.cardEyebrow")}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-white">{t("main.cardTitle")}</h2>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                  {t("main.live")}
                </span>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="mb-2 flex justify-between text-[10px] font-bold uppercase">
                    <span>{t("main.syncConsistency")}</span>
                    <span className="text-primary">98.4%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                    <div className="h-full w-[98%] rounded-full bg-signature" />
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex justify-between text-[10px] font-bold uppercase">
                    <span>{t("main.decisionVelocity")}</span>
                    <span className="text-secondary">High</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                    <div className="h-full w-[85%] rounded-full bg-signature" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="glass-panel rounded-[24px] p-5">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface-variant">
                      {t("main.reasoningFit")}
                    </p>
                    <p className="mt-3 text-3xl font-black text-white">99.1%</p>
                  </div>
                  <div className="glass-panel rounded-[24px] p-5">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface-variant">
                      {t("main.cognitiveLoad")}
                    </p>
                    <p className="mt-3 text-3xl font-black text-white">{t("main.low")}</p>
                  </div>
                </div>
                <Link
                  to="/reasoning"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
                >
                  {t("main.readReasoning")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-10 text-sm uppercase tracking-[0.2em] text-on-surface-variant">
          {t("main.journeyTitle")}
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {journeyCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.title}
                to={card.to}
                className="glass-panel block rounded-[20px] p-8 transition-all hover:bg-surface-container-high"
              >
                <Icon className={`mb-6 h-10 w-10 ${card.tone}`} />
                <h3 className="mb-3 text-2xl font-bold text-white">
                  {card.title === "AI Synthesis"
                    ? t("main.aiSynthesis")
                    : card.title === "Blueprint Mode"
                      ? t("main.blueprint")
                      : t("main.devIntegration")}
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-on-surface-variant">
                  {card.title === "AI Synthesis"
                    ? t("main.aiSynthesisText")
                    : card.title === "Blueprint Mode"
                      ? t("main.blueprintText")
                      : t("main.devIntegrationText")}
                </p>
                <div className={`flex items-center text-xs font-bold uppercase tracking-widest ${card.tone}`}>
                  {card.title === "AI Synthesis"
                    ? t("main.aiSynthesisCta")
                    : card.title === "Blueprint Mode"
                      ? t("main.blueprintCta")
                      : t("main.devIntegrationCta")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-10 text-sm uppercase tracking-[0.2em] text-on-surface-variant">
          {t("main.pillarsTitle")}
        </h2>
        <div className="grid gap-6 lg:grid-cols-12">
          <Link
            to="/foundations"
            className="glass-panel flex min-h-[340px] flex-col justify-between rounded-[28px] p-10 lg:col-span-7"
          >
            <div>
              <span className="text-[10px] uppercase tracking-[0.22em] text-primary">
                {t("main.foundationsTag")}
              </span>
              <h3 className="mt-4 text-4xl font-black text-white">{t("main.foundationsTitle")}</h3>
              <p className="mt-4 max-w-md text-on-surface-variant">
                {t("main.foundationsText")}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {foundationTags.map((tag) => (
                <span
                  key={tag.label}
                  className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase"
                >
                  {tag.label}
                </span>
              ))}
            </div>
          </Link>

          <Link to="/components" className="glass-panel min-h-[340px] rounded-[28px] p-10 lg:col-span-5">
            <h3 className="mb-6 text-3xl font-black text-white">{t("main.componentsTitle")}</h3>
            <ul className="space-y-4 text-sm text-on-surface-variant">
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Buttons & Inputs
              </li>
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-secondary" />
                Navigation Shells
              </li>
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-tertiary" />
                Data Visualization
              </li>
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-primary-container" />
                AI Overlays
              </li>
            </ul>
          </Link>

          <Link
            to="/patterns"
            className="glass-panel flex min-h-[260px] flex-col justify-between rounded-[28px] p-10 lg:col-span-4"
          >
            <div>
              <h3 className="mb-2 text-2xl font-bold text-white">{t("main.patternsTitle")}</h3>
              <p className="text-sm leading-relaxed text-on-surface-variant">
                {t("main.patternsText")}
              </p>
            </div>
            <div className="flex -space-x-4">
              {[Sparkles, Bot, Boxes].map((Icon, index) => (
                <div
                  key={index}
                  className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-surface bg-surface-container-low"
                >
                  <Icon className="h-4 w-4 text-slate-300" />
                </div>
              ))}
            </div>
          </Link>

          <div className="glass-panel flex min-h-[260px] items-center justify-between gap-8 rounded-[28px] p-10 lg:col-span-8">
            <div className="max-w-xl">
              <h3 className="mb-4 text-3xl font-black italic text-white">{t("main.decisionTitle")}</h3>
              <p className="text-lg text-on-surface-variant">
                {t("main.decisionText")}
              </p>
            </div>
            <Link
              to="/reasoning"
              className="whitespace-nowrap rounded-full bg-signature px-6 py-3 font-bold text-on-primary"
            >
              {t("main.openReasoning")}
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 pt-20">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-signature shadow-glow">
            <Sparkles className="h-9 w-9 text-on-primary" />
          </div>
          <h3 className="mb-4 text-3xl font-black text-white">{t("main.footerTitle")}</h3>
          <p className="mb-12 max-w-lg text-on-surface-variant">{t("main.footerText")}</p>
          <div className="relative w-full max-w-2xl">
            <input
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  openChat();
                }
              }}
              className="glass-panel w-full rounded-full border-white/10 px-8 py-5 pr-20 text-lg text-white outline-none transition-all placeholder:text-on-surface-variant/40 focus:border-primary/50"
              placeholder={t("main.footerPlaceholder")}
              type="text"
            />
            <button
              type="button"
              onClick={openChat}
              className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-signature"
            >
              <Send className="h-4 w-4 text-on-primary" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
