// Hand-authored page entries for global search.
// Titles and descriptions resolve through i18n at runtime (labelKey/badgeKey)
// so they stay in sync with the navigation and never hardcode language.

import type { TranslationKey } from "../i18n/translations";

export interface PageSearchSeed {
  id: string;
  route: string;
  labelKey: TranslationKey;
  badgeKey: TranslationKey;
  // Bilingual (PT-BR / PT-PT / EN) discovery terms.
  keywords: string[];
  deprecated?: boolean;
}

export const pageSeeds: PageSearchSeed[] = [
  {
    id: "page:main",
    route: "/main",
    labelKey: "routes.main",
    badgeKey: "badges.main",
    keywords: ["início", "inicio", "home", "landing", "página inicial", "principal", "comando"],
  },
  {
    id: "page:oracle",
    route: "/oracle",
    labelKey: "routes.beatriceChat",
    badgeKey: "badges.beatriceChat",
    keywords: ["abraxos", "consultar", "beatrice", "oráculo", "oraculo", "oracle", "chat", "perguntar", "assistente", "ia", "conversar"],
  },
  {
    id: "page:reasoning",
    route: "/reasoning",
    labelKey: "routes.reasoning",
    badgeKey: "badges.reasoning",
    keywords: ["raciocínio", "raciocinio", "reasoning", "xai", "explicabilidade", "explainability", "cognição", "pipeline", "explicar"],
  },
  {
    id: "page:perspectives",
    route: "/perspectives",
    labelKey: "routes.perspectives",
    badgeKey: "badges.perspectives",
    keywords: ["perspectivas", "perspectives", "persona", "lentes", "ponto de vista", "papéis", "papeis"],
  },
  {
    id: "page:foundations",
    route: "/foundations",
    labelKey: "routes.foundations",
    badgeKey: "badges.foundations",
    keywords: [
      "fundamentos", "foundations", "base", "guidelines", "diretrizes", "manifesto",
      "princípios", "principios", "tokens", "token", "padrões", "padroes", "patterns",
      "decisões", "decisoes", "decisions", "acessibilidade", "accessibility",
    ],
  },
  {
    id: "page:components",
    route: "/components",
    labelKey: "routes.components",
    badgeKey: "badges.components",
    keywords: ["componentes", "components", "catálogo", "catalogo", "ui", "interface", "biblioteca", "widgets"],
  },
  {
    id: "page:architecture",
    route: "/architecture",
    labelKey: "routes.architecture",
    badgeKey: "badges.architecture",
    keywords: ["arquitetura", "architecture", "integração", "integracao", "dev", "developer", "api", "código", "codigo", "engenharia"],
  },
  {
    id: "page:evaluation",
    route: "/evaluation",
    labelKey: "routes.evaluation",
    badgeKey: "badges.evaluation",
    keywords: ["avaliação", "avaliacao", "evaluation", "baseline", "comparação", "comparacao", "métricas", "metricas"],
  },
  {
    id: "page:results",
    route: "/results",
    labelKey: "routes.results",
    badgeKey: "badges.results",
    keywords: ["resultados", "results", "estudo", "study", "dados", "pesquisa"],
  },
  {
    id: "page:laboratory",
    route: "/laboratory",
    labelKey: "routes.laboratory",
    badgeKey: "badges.laboratory",
    keywords: ["laboratório", "laboratorio", "laboratory", "experimentos", "calibração", "calibracao"],
  },
];
