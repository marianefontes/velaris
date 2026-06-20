import type { Locale } from "../../../i18n/translations";
import type { ProfileId } from "../../types/beatrice";

export type AbraxosOnboardingVariant = "velaris" | "research" | "guide";

export interface OnboardingPerspective {
  name: string;
  role: string;
  profileId: ProfileId;
  examplePrompt: string;
}

const VELARIS_EXAMPLES: Record<Locale, string[]> = {
  "pt-BR": [
    "Quando devo usar Dialog?",
    "Compare Tooltip e Popover.",
    "Quais riscos existem nesta implementação?",
    "Explique o racional deste componente.",
    "Gere um plano de migração para um componente legado.",
  ],
  "pt-PT": [
    "Quando devo usar Dialog?",
    "Compare Tooltip e Popover.",
    "Quais riscos existem nesta implementação?",
    "Explique o racional deste componente.",
    "Gere um plano de migração para um componente legado.",
  ],
  "en-US": [
    "When should I use Dialog?",
    "Compare Tooltip and Popover.",
    "What risks exist in this implementation?",
    "Explain the rationale for this component.",
    "Generate a migration plan for a legacy component.",
  ],
};

const RESEARCH_EXAMPLES: Record<Locale, Record<string, string[]>> = {
  "pt-BR": {
    understanding: [
      "O que é este componente?",
      "Quando devo utilizá-lo?",
      "Quais alternativas existem?",
    ],
    decision: [
      "Drawer ou Dialog?",
      "Tooltip ou Popover?",
      "Esta é a melhor solução?",
    ],
    institutional: [
      "Por que essa decisão foi tomada?",
      "Quais riscos existem?",
      "Como isso afeta governança?",
    ],
    engineering: [
      "Gere um plano de migração.",
      "Analise impacto arquitetural.",
      "Quais contratos podem ser afetados?",
    ],
  },
  "pt-PT": {
    understanding: [
      "O que é este componente?",
      "Quando devo utilizá-lo?",
      "Quais alternativas existem?",
    ],
    decision: [
      "Drawer ou Dialog?",
      "Tooltip ou Popover?",
      "Esta é a melhor solução?",
    ],
    institutional: [
      "Por que essa decisão foi tomada?",
      "Quais riscos existem?",
      "Como isso afeta governança?",
    ],
    engineering: [
      "Gere um plano de migração.",
      "Analise impacto arquitetural.",
      "Quais contratos podem ser afetados?",
    ],
  },
  "en-US": {
    understanding: [
      "What is this component?",
      "When should I use it?",
      "What alternatives exist?",
    ],
    decision: [
      "Drawer or Dialog?",
      "Tooltip or Popover?",
      "Is this the best solution?",
    ],
    institutional: [
      "Why was this decision made?",
      "What risks exist?",
      "How does this affect governance?",
    ],
    engineering: [
      "Generate a migration plan.",
      "Analyze architectural impact.",
      "Which contracts may be affected?",
    ],
  },
};

export function getVelarisOnboardingExamples(locale: Locale): string[] {
  return VELARIS_EXAMPLES[locale] ?? VELARIS_EXAMPLES["pt-BR"];
}

export function getResearchOnboardingExamples(locale: Locale): Record<string, string[]> {
  return RESEARCH_EXAMPLES[locale] ?? RESEARCH_EXAMPLES["pt-BR"];
}

export const ONBOARDING_PERSPECTIVES: OnboardingPerspective[] = [
  {
    name: "João Fontes",
    role: "Designer",
    profileId: "designer",
    examplePrompt: "Como João Fontes avaliaria a hierarquia deste layout?",
  },
  {
    name: "Lucas Matsunaga",
    role: "UX Specialist",
    profileId: "product_designer",
    examplePrompt: "Como Lucas Matsunaga avaliaria a fricção deste fluxo?",
  },
  {
    name: "Guilherme Marques",
    role: "Developer",
    profileId: "dev",
    examplePrompt: "Como Guilherme Marques validaria os contratos deste componente?",
  },
  {
    name: "Maria Feliciana",
    role: "Solution Architect",
    profileId: "maintainer",
    examplePrompt: "Como Maria Feliciana avaliaria esta decisão?",
  },
  {
    name: "Carlos Eduardo Chaves",
    role: "QA",
    profileId: "qa",
    examplePrompt: "Como Carlos Eduardo Chaves testaria os estados deste componente?",
  },
  {
    name: "Francisco Soares",
    role: "Accessibility Specialist",
    profileId: "a11y",
    examplePrompt: "Como Francisco Soares auditaria a acessibilidade desta implementação?",
  },
  {
    name: "Thiago Chaves",
    role: "Maintainer",
    profileId: "maintainer",
    examplePrompt: "Como Thiago Chaves avaliaria o impacto de manutenção?",
  },
  {
    name: "Bruna Lopes",
    role: "Tech Writer",
    profileId: "tech_writer",
    examplePrompt: "Como Bruna Lopes documentaria este padrão?",
  },
  {
    name: "Pedro Arthur",
    role: "Design System Manager",
    profileId: "design_system_manager",
    examplePrompt: "Como Pedro Arthur avaliaria o impacto de governança?",
  },
];
