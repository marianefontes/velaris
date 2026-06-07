import {
  Accessibility,
  BadgeCheck,
  Check,
  CircleDot,
  Contrast,
  Eye,
  Focus,
  Keyboard,
  MessageCircleWarning,
  MousePointer2,
  Move3d,
  ScanText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import type { Locale } from "../i18n/translations";

interface SummaryContract {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
}

interface AccessibilityContract {
  id: string;
  title: string;
  description: string;
  requirements: string;
  appliesTo: string;
  tokenReferences: string;
  ragRelation: string;
}

interface ReadinessItem {
  id: string;
  text: string;
}

export const ACCESSIBILITY_CONTRACTS: AccessibilityContract[] = [
  {
    id: "contrast-legibility",
    title: "Contraste e legibilidade",
    description:
      "O Aetheris deve garantir leitura clara em superfícies escuras, translúcidas ou elevadas. Estados semânticos e níveis de confiança não dependem apenas da cor.",
    requirements:
      "Manter contraste AA como base; distinguir text-primary, text-secondary, text-muted e text-disabled; validar texto sobre glass surfaces; combinar feedback com texto e ícone",
    appliesTo:
      "Alert, Toast, Tooltip, Confidence Badge, Source Attribution e Audit Panel",
    tokenReferences:
      "text-primary, text-secondary, text-muted, text-disabled, feedback-error",
    ragRelation:
      "Permite que a Beatrice avalie legibilidade, contraste e redundância semântica em recomendações de interface.",
  },
  {
    id: "focus-keyboard",
    title: "Foco e navegação por teclado",
    description:
      "A navegação por teclado é um requisito de base. Elementos interativos precisam de foco visível, ordem previsível e estados que não dependam exclusivamente de hover.",
    requirements:
      "Tornar todo controle alcançável por teclado; aplicar focus-ring e border-focus de forma consistente; alinhar a ordem de tabulação à estrutura visual; restaurar o foco após overlays",
    appliesTo:
      "Command Palette, Modal/Dialog, Tabs, Form Field, Button, Input e Select",
    tokenReferences: "focus-ring, border-focus, state-selected",
    ragRelation:
      "Oferece critérios verificáveis para respostas sobre teclado, foco, overlays e fluxos de formulário.",
  },
  {
    id: "target-density",
    title: "Alvo mínimo e densidade",
    description:
      "Componentes interativos preservam uma área de acionamento confortável. Densidade visual não pode comprometer precisão, leitura ou previsibilidade.",
    requirements:
      "Usar target-size-min; manter 44px em controles principais; ampliar a área clicável de ícones compactos; separar ações adjacentes; testar densidade em telas menores",
    appliesTo: "Button, Input, Select, Toggle, chips, badges e botões de ícone",
    tokenReferences: "target-size-min, space-2, space-3, space-4",
    ragRelation:
      "Ajuda a Beatrice a identificar quando compactação visual cria risco de erro ou exclusão motora.",
  },
  {
    id: "accessible-states",
    title: "Estados acessíveis",
    description:
      "Estados de interface precisam ser distinguíveis e previsíveis, tanto visualmente quanto semanticamente quando a mudança afeta tecnologias assistivas.",
    requirements:
      "Documentar hover, focus, pressed, selected, disabled, loading, error, expanded e collapsed; evitar mudanças apenas por opacidade; expor aria attributes quando aplicável",
    appliesTo: "Todos os componentes interativos e superfícies com disclosure",
    tokenReferences: "state-disabled, state-selected, border-focus, feedback-error",
    ragRelation:
      "Transforma estados globais em evidência consultável para revisão de componentes e padrões.",
  },
  {
    id: "screen-readers-semantics",
    title: "Leitores de tela e semântica",
    description:
      "Componentes expõem nomes, papéis, relações e estados compreensíveis para tecnologias assistivas, sem depender da aparência visual.",
    requirements:
      "Usar labels visíveis; associar aria-describedby e mensagens de erro; aplicar aria-expanded e aria-invalid; nomear botões de ícone; usar role apenas quando necessário",
    appliesTo:
      "Formulários, tabelas, navegação, componentes de disclosure e superfícies XAI",
    tokenReferences: "text-primary, text-muted, feedback-error",
    ragRelation:
      "Permite que fontes, evidências e confiança sejam explicadas textualmente em respostas e auditorias da Beatrice.",
  },
  {
    id: "non-color-feedback",
    title: "Feedback não apenas por cor",
    description:
      "O Aetheris não comunica significado crítico apenas por verde, amarelo ou vermelho. Cor reforça uma mensagem que também existe em texto, ícone ou estrutura.",
    requirements:
      "Combinar success, warning, error e info com rótulo ou ícone; nomear o nível de confiança; identificar a origem da evidência; indicar conflitos e lacunas de auditoria",
    appliesTo: "Alert, Toast, Confidence Badge, Source Attribution e Audit Panel",
    tokenReferences: "feedback-success, feedback-warning, feedback-error, feedback-info",
    ragRelation:
      "Sustenta recomendações XAI que permanecem compreensíveis para diferentes capacidades perceptivas.",
  },
  {
    id: "safe-motion",
    title: "Movimento seguro",
    description:
      "Movimento apoia orientação, feedback e continuidade. Animações são discretas, previsíveis e não atrasam leitura, foco ou tomada de decisão.",
    requirements:
      "Usar transições curtas; respeitar prefers-reduced-motion; evitar animações bloqueantes; preservar foco durante mudanças; usar motion para explicar continuidade espacial",
    appliesTo:
      "Modal/Dialog, Toast, Tooltip, Skeleton Loader, Command Palette e Audit Panel",
    tokenReferences: "motion-fast, motion-standard, motion-reduced",
    ragRelation:
      "Ajuda a Beatrice a separar movimento funcional de ornamentação que aumenta carga cognitiva.",
  },
];

const ACCESSIBILITY_CONTRACTS_EN: AccessibilityContract[] = [
  {
    id: "contrast-legibility",
    title: "Contrast and legibility",
    description:
      "Aetheris must remain readable across dark, translucent and elevated surfaces. Semantic states and confidence levels never rely on color alone.",
    requirements:
      "Maintain AA contrast as the baseline; distinguish text-primary, text-secondary, text-muted and text-disabled; validate copy over glass surfaces; pair feedback with text and icons",
    appliesTo:
      "Alert, Toast, Tooltip, Confidence Badge, Source Attribution and Audit Panel",
    tokenReferences:
      "text-primary, text-secondary, text-muted, text-disabled, feedback-error",
    ragRelation:
      "Lets Beatrice evaluate legibility, contrast and semantic redundancy in interface guidance.",
  },
  {
    id: "focus-keyboard",
    title: "Focus and keyboard navigation",
    description:
      "Keyboard navigation is a baseline requirement. Interactive elements need visible focus, predictable order and states that do not depend on hover.",
    requirements:
      "Make every control keyboard reachable; apply focus-ring and border-focus consistently; match tab order to visual structure; restore focus after overlays",
    appliesTo:
      "Command Palette, Modal/Dialog, Tabs, Form Field, Button, Input and Select",
    tokenReferences: "focus-ring, border-focus, state-selected",
    ragRelation:
      "Provides verifiable criteria for answers about keyboard access, focus, overlays and form flows.",
  },
  {
    id: "target-density",
    title: "Minimum target and density",
    description:
      "Interactive components preserve a comfortable hit area. Visual density must not compromise precision, reading or interaction predictability.",
    requirements:
      "Use target-size-min; preserve 44px for primary controls; enlarge compact icon hit areas; separate adjacent actions; test density on smaller screens",
    appliesTo: "Button, Input, Select, Toggle, chips, badges and icon buttons",
    tokenReferences: "target-size-min, space-2, space-3, space-4",
    ragRelation:
      "Helps Beatrice identify when visual compression introduces motor-access or error risk.",
  },
  {
    id: "accessible-states",
    title: "Accessible states",
    description:
      "Interface states must be distinguishable and predictable, both visually and semantically when changes affect assistive technologies.",
    requirements:
      "Document hover, focus, pressed, selected, disabled, loading, error, expanded and collapsed; avoid opacity-only changes; expose aria attributes where applicable",
    appliesTo: "Every interactive component and disclosure surface",
    tokenReferences: "state-disabled, state-selected, border-focus, feedback-error",
    ragRelation:
      "Turns global states into retrievable evidence for component and pattern reviews.",
  },
  {
    id: "screen-readers-semantics",
    title: "Screen readers and semantics",
    description:
      "Components expose names, roles, relationships and states that assistive technologies can understand without relying on visual appearance.",
    requirements:
      "Use visible labels; associate aria-describedby and errors; apply aria-expanded and aria-invalid; name icon buttons; use role only when needed",
    appliesTo: "Forms, tables, navigation, disclosure components and XAI surfaces",
    tokenReferences: "text-primary, text-muted, feedback-error",
    ragRelation:
      "Ensures sources, evidence and confidence can be communicated textually in Beatrice answers and audits.",
  },
  {
    id: "non-color-feedback",
    title: "Feedback beyond color",
    description:
      "Aetheris never communicates critical meaning through green, yellow or red alone. Color reinforces a message that also exists in text, iconography or structure.",
    requirements:
      "Pair success, warning, error and info with labels or icons; name confidence levels; identify evidence origins; surface audit conflicts and gaps",
    appliesTo: "Alert, Toast, Confidence Badge, Source Attribution and Audit Panel",
    tokenReferences: "feedback-success, feedback-warning, feedback-error, feedback-info",
    ragRelation:
      "Supports XAI recommendations that remain understandable across different perceptual abilities.",
  },
  {
    id: "safe-motion",
    title: "Safe motion",
    description:
      "Motion supports orientation, feedback and continuity. Animation stays restrained and predictable without delaying reading, focus or decisions.",
    requirements:
      "Use short transitions; respect prefers-reduced-motion; avoid blocking animation; preserve focus through changes; use motion to explain spatial continuity",
    appliesTo:
      "Modal/Dialog, Toast, Tooltip, Skeleton Loader, Command Palette and Audit Panel",
    tokenReferences: "motion-fast, motion-standard, motion-reduced",
    ragRelation:
      "Helps Beatrice distinguish functional motion from ornament that increases cognitive load.",
  },
];

export const ACCESSIBILITY_READINESS_CHECKLIST: ReadinessItem[] = [
  { id: "visible-focus", text: "Possui foco visível." },
  { id: "keyboard", text: "Pode ser usado por teclado." },
  { id: "accessible-name", text: "Tem label ou nome acessível." },
  { id: "not-color-only", text: "Não comunica estado apenas por cor." },
  { id: "dark-contrast", text: "Mantém contraste adequado em dark mode." },
  {
    id: "states",
    text: "Expõe estados disabled, loading, error e selected quando aplicável.",
  },
  {
    id: "semantic-tokens",
    text: "Usa tokens semânticos de texto, borda, foco e feedback.",
  },
  { id: "target-size", text: "Respeita alvo mínimo de interação." },
  { id: "documentation", text: "Possui documentação de acessibilidade." },
  { id: "examples", text: "Possui exemplo de uso correto e incorreto." },
];

const ACCESSIBILITY_READINESS_CHECKLIST_EN: ReadinessItem[] = [
  { id: "visible-focus", text: "Has a visible focus state." },
  { id: "keyboard", text: "Can be operated with a keyboard." },
  { id: "accessible-name", text: "Has a visible label or accessible name." },
  { id: "not-color-only", text: "Does not communicate state through color alone." },
  { id: "dark-contrast", text: "Maintains sufficient contrast in dark mode." },
  {
    id: "states",
    text: "Exposes disabled, loading, error and selected states when applicable.",
  },
  {
    id: "semantic-tokens",
    text: "Uses semantic text, border, focus and feedback tokens.",
  },
  { id: "target-size", text: "Respects the minimum interaction target." },
  { id: "documentation", text: "Includes accessibility documentation." },
  { id: "examples", text: "Includes correct and incorrect usage examples." },
];

const SUMMARY_PT: SummaryContract[] = [
  {
    title: "Contraste",
    value: "AA como base",
    description:
      "Textos, ícones e feedback mantêm legibilidade em superfícies escuras.",
    icon: Contrast,
  },
  {
    title: "Foco",
    value: "Sempre visível",
    description:
      "Todo elemento interativo mostra com clareza onde a navegação está.",
    icon: Focus,
  },
  {
    title: "Alvo mínimo",
    value: "44px",
    description:
      "Controles preservam uma área de interação confortável e previsível.",
    icon: MousePointer2,
  },
  {
    title: "Feedback",
    value: "Nunca só por cor",
    description:
      "Sucesso, alerta, erro e confiança combinam cor com outro sinal.",
    icon: MessageCircleWarning,
  },
];

const SUMMARY_EN: SummaryContract[] = [
  {
    title: "Contrast",
    value: "AA baseline",
    description: "Text, icons and feedback remain legible on dark surfaces.",
    icon: Contrast,
  },
  {
    title: "Focus",
    value: "Always visible",
    description: "Every interactive element clearly shows navigation position.",
    icon: Focus,
  },
  {
    title: "Minimum target",
    value: "44px",
    description: "Controls preserve a comfortable and predictable hit area.",
    icon: MousePointer2,
  },
  {
    title: "Feedback",
    value: "Never color-only",
    description: "Success, warning, error and confidence combine multiple signals.",
    icon: MessageCircleWarning,
  },
];

const CONTRACT_ICONS: Record<string, LucideIcon> = {
  "contrast-legibility": Eye,
  "focus-keyboard": Keyboard,
  "target-density": MousePointer2,
  "accessible-states": CircleDot,
  "screen-readers-semantics": ScanText,
  "non-color-feedback": BadgeCheck,
  "safe-motion": Move3d,
};

function toPtPt(text: string) {
  const replacements = [
    ["usuários", "utilizadores"],
    ["usuário", "utilizador"],
    ["telas", "ecrãs"],
    ["tela", "ecrã"],
    ["controles", "controlos"],
    ["controle", "controlo"],
  ];

  return replacements.reduce(
    (localized, [source, target]) => localized.split(source).join(target),
    text,
  );
}

function localizePtPtRecord<T extends object>(item: T): T {
  return Object.fromEntries(
    Object.entries(item).map(([key, value]) => [
      key,
      typeof value === "string" ? toPtPt(value) : value,
    ]),
  ) as unknown as T;
}

function localizePtPt<T extends object>(items: T[]): T[] {
  return items.map(localizePtPtRecord);
}

function getAccessibilityContent(locale: Locale) {
  const isEnglish = locale === "en-US";
  const isPtPt = locale === "pt-PT";

  if (isEnglish) {
    return {
      eyebrow: "Aetheris accessibility guide",
      titleLead: "Accessibility",
      titleAccent: "Guide",
      description:
        "Accessibility in Aetheris is a transversal foundation, not a final adjustment. It defines the minimum criteria for components, patterns and Beatrice answers to remain readable, keyboard navigable, assistive-technology compatible and safe across contexts.",
      secondary:
        "This section establishes contrast, focus, target size, state, feedback, motion and validation contracts before a component is considered ready for use.",
      contractLabel: "Readiness standard",
      contractValue: "10 checks",
      contractDetail: "Every component must show evidence before adoption.",
      summaryLabel: "Minimum contracts",
      summaryTitle: "Quality that crosses every surface",
      summaryDescription:
        "These signals are requirements, not decorative scores. Tokens implement them; components and patterns must prove them.",
      sectionLabel: "Accessibility contract",
      appliesTo: "Applies to",
      tokens: "Related tokens",
      checklistLabel: "Adoption gate",
      checklistTitle: "Accessible readiness checklist",
      checklistDescription:
        "A component only enters Aetheris when these checks are documented and reproducible. The checklist is also indexed as evidence for Beatrice.",
      checklistStatus: "10 required checks",
      summaries: SUMMARY_EN,
      contracts: ACCESSIBILITY_CONTRACTS_EN,
      checklist: ACCESSIBILITY_READINESS_CHECKLIST_EN,
    };
  }

  const copy = {
    eyebrow: "Guia de Acessibilidade do Aetheris",
    titleLead: "Guia de",
    titleAccent: "Acessibilidade",
    description:
      "A acessibilidade no Aetheris é tratada como uma fundação transversal, não como um ajuste posterior. Ela define critérios mínimos para que componentes, padrões e respostas da Beatrice sejam legíveis, navegáveis por teclado, compreensíveis por tecnologias assistivas e seguros para diferentes contextos de uso.",
    secondary:
      "Esta seção estabelece contratos de contraste, foco, alvo mínimo, estado, feedback, movimento e validação antes que um componente seja considerado pronto para uso.",
    contractLabel: "Padrão de prontidão",
    contractValue: "10 verificações",
    contractDetail: "Todo componente precisa apresentar evidência antes da adoção.",
    summaryLabel: "Contratos mínimos",
    summaryTitle: "Qualidade que atravessa todas as superfícies",
    summaryDescription:
      "Estes sinais são requisitos, não métricas decorativas. Tokens os implementam; componentes e padrões precisam comprová-los.",
    sectionLabel: "Contrato de acessibilidade",
    appliesTo: "Aplica-se a",
    tokens: "Tokens relacionados",
    checklistLabel: "Gate de adoção",
    checklistTitle: "Checklist de prontidão acessível",
    checklistDescription:
      "Um componente só entra no Aetheris quando estas verificações estão documentadas e podem ser reproduzidas. A checklist também é indexada como evidência para a Beatrice.",
    checklistStatus: "10 verificações obrigatórias",
    summaries: SUMMARY_PT,
    contracts: ACCESSIBILITY_CONTRACTS,
    checklist: ACCESSIBILITY_READINESS_CHECKLIST,
  };

  if (!isPtPt) return copy;

  return {
    ...localizePtPtRecord(copy),
    summaries: localizePtPt(SUMMARY_PT),
    contracts: localizePtPt(ACCESSIBILITY_CONTRACTS),
    checklist: localizePtPt(ACCESSIBILITY_READINESS_CHECKLIST),
  };
}

export function FoundationsPage() {
  const { locale } = useI18n();
  const content = getAccessibilityContent(locale);

  return (
    <main className="overflow-hidden bg-surface-immersive text-[#f7f3fa]">
      <section className="relative isolate min-h-[360px] border-b border-white/[0.08]">
        <div className="absolute inset-0 -z-20">
          <img
            src="/accessibility-hero.png"
            alt=""
            aria-hidden="true"
            className="ml-auto h-full w-[52%] object-cover object-center opacity-70"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(9,9,13,1)_0%,rgba(9,9,13,0.97)_42%,rgba(9,9,13,0.45)_74%,rgba(9,9,13,0.7)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-[#09090d] to-transparent" />

        <div className="mx-auto flex min-h-[360px] w-full max-w-[1280px] flex-col justify-center px-6 py-5 sm:px-10 lg:px-10">
          <div className="max-w-[640px]">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b9a3dc]">
              {content.eyebrow}
            </p>
            <h1 className="tracking-[-0.045em]">
              <span className="block text-[2.5rem] font-semibold leading-[0.98] text-[#f7f3fa] sm:text-[3rem] lg:text-[3.5rem]">
                {content.titleLead}
              </span>
              <span className="mt-1 block text-[3.25rem] font-black leading-[0.88] text-[#c8a7ff] sm:text-[3.75rem] lg:text-[4.5rem]">
                {content.titleAccent}
              </span>
            </h1>
            <p className="mt-4 max-w-[600px] text-base leading-6 text-[#c1b9ca]">
              {content.description}
            </p>

            <dl className="mt-5 grid max-w-[580px] grid-cols-3 border-y border-white/[0.1]">
              {[
                [content.sectionLabel, "7"],
                [content.contractLabel, "10"],
                [content.summaries[0].title, content.summaries[0].value],
              ].map(([label, value], index) => (
                <div
                  key={label}
                  className={`py-3 ${index > 0 ? "border-l border-white/[0.1] pl-5" : ""}`}
                >
                  <dd className="text-2xl font-semibold tracking-[-0.04em] text-[#f7f3fa]">
                    {value}
                  </dd>
                  <dt className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#8e8799]">
                    {label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1280px] space-y-8 px-6 py-10 sm:px-10 lg:px-10">
      <section aria-labelledby="accessibility-summary-title">
        <header className="mb-6 max-w-3xl">
          <p className="section-eyebrow">{content.summaryLabel}</p>
          <h2 id="accessibility-summary-title" className="text-3xl font-bold text-white">
            {content.summaryTitle}
          </h2>
          <p className="mt-3 text-sm leading-7 text-on-surface-variant">
            {content.summaryDescription}
          </p>
        </header>

        <dl className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {content.summaries.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="glass-card rounded-[24px] p-5">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    {item.title}
                  </dt>
                  <Icon className="h-4 w-4 text-primary" aria-hidden />
                </div>
                <dd className="mt-5 text-2xl font-black tracking-tight text-white">
                  {item.value}
                </dd>
                <p className="mt-3 text-xs leading-6 text-on-surface-variant">
                  {item.description}
                </p>
              </div>
            );
          })}
        </dl>
      </section>

      <section
        aria-label={content.sectionLabel}
        className="grid items-start gap-5 lg:grid-cols-2"
      >
        {content.contracts.map((contract, index) => {
          const Icon = CONTRACT_ICONS[contract.id] ?? Accessibility;
          const requirements = contract.requirements.split("; ");
          const tokens = contract.tokenReferences.split(", ");

          return (
            <article
              key={contract.id}
              className={`content-card relative overflow-hidden rounded-[28px] p-6 sm:p-7 ${
                index === content.contracts.length - 1 ? "lg:col-span-2" : ""
              }`}
            >
              <div className="absolute right-5 top-4 text-6xl font-black tracking-tighter text-white/[0.025]">
                {String(index + 1).padStart(2, "0")}
              </div>
              <header className="relative flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/[0.06] text-primary">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary/65">
                    {content.sectionLabel} {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-white">{contract.title}</h2>
                </div>
              </header>

              <p className="mt-5 text-sm leading-7 text-on-surface-variant">
                {contract.description}
              </p>

              <ul className="mt-5 space-y-3">
                {requirements.map((requirement) => (
                  <li key={requirement} className="flex gap-3 text-xs leading-6 text-slate-300">
                    <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>

              <footer className="mt-6 border-t border-white/[0.06] pt-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  {content.appliesTo}
                </p>
                <p className="mt-2 text-xs leading-6 text-slate-400">{contract.appliesTo}</p>
                <div className="mt-4 flex flex-wrap gap-2" aria-label={content.tokens}>
                  {tokens.map((token) => (
                    <code
                      key={token}
                      className="rounded-full border border-white/[0.07] bg-black/20 px-2.5 py-1 text-[10px] text-primary/75"
                    >
                      {token}
                    </code>
                  ))}
                </div>
              </footer>
            </article>
          );
        })}
      </section>

      <section
        aria-labelledby="accessibility-checklist-title"
        className="xai-block rounded-[32px] p-7 sm:p-9"
      >
        <header className="grid gap-5 border-b border-white/[0.07] pb-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <p className="section-eyebrow">{content.checklistLabel}</p>
            <h2
              id="accessibility-checklist-title"
              className="text-3xl font-bold tracking-tight text-white"
            >
              {content.checklistTitle}
            </h2>
            <p className="mt-3 text-sm leading-7 text-on-surface-variant">
              {content.checklistDescription}
            </p>
          </div>
          <span className="signature-pill h-fit">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
            {content.checklistStatus}
          </span>
        </header>

        <ol className="mt-7 grid gap-x-8 gap-y-3 md:grid-cols-2">
          {content.checklist.map((item, index) => (
            <li
              key={item.id}
              className="flex min-h-14 items-center gap-4 border-b border-white/[0.055] py-3"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/[0.06] text-[10px] font-bold text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-sm leading-6 text-slate-300">{item.text}</span>
            </li>
          ))}
        </ol>
      </section>
      </div>
    </main>
  );
}
