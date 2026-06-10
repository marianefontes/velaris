// Strategic anchor map — Abraxos presence pulses where user attention should land first.

export interface AnchorPoint {
  x: number;
  y: number;
}

export interface AnchorPlacement {
  xRatio: number;
  yRatio: number;
}

export interface RouteAnchorEntry {
  path: string;
  rationale: string;
  resolve: (search: string) => { selectors: string[]; placement: AnchorPlacement };
}

export const ROUTE_ANCHOR_REGISTRY: RouteAnchorEntry[] = [
  {
    path: "/main",
    rationale: "Home — a barra Consultar Abraxos é o primeiro gesto de intenção.",
    resolve: () => ({
      selectors: ['[data-abraxos-focus="home-ask"]', "#velaris-ask-input"],
      placement: { xRatio: 0.05, yRatio: 0.5 },
    }),
  },
  {
    path: "/oracle",
    rationale: "Oráculo — o compositor de chat é onde a conversa começa.",
    resolve: () => ({
      selectors: ['[data-abraxos-focus="oracle-composer"]', "#beatrice-chat-input"],
      placement: { xRatio: 0.04, yRatio: 0.5 },
    }),
  },
  {
    path: "/foundations",
    rationale: "Fundamentos — aba ativa orienta qual camada da biblioteca explorar.",
    resolve: (search) => {
      const focus = normalizeFocus(search, "focus", "manifesto");
      return {
        selectors: [`#foundation-tab-${focus}`, '[data-state="active"].section-tab-active'],
        placement: { xRatio: 0.12, yRatio: 0.5 },
      };
    },
  },
  {
    path: "/components",
    rationale: "Componentes — item ativo no catálogo lateral concentra a escolha.",
    resolve: () => ({
      selectors: [
        '#main-content aside button[aria-current="true"]',
        '[data-abraxos-focus="component-catalog"]',
      ],
      placement: { xRatio: 0.08, yRatio: 0.5 },
    }),
  },
  {
    path: "/reasoning",
    rationale: "Raciocínio — aba ativa indica qual camada cognitiva está em foco.",
    resolve: (search) => {
      const focus = normalizeFocus(search, "focus", "overview");
      return {
        selectors: [`#reasoning-tab-${focus}`, '#main-content [role="tablist"] [aria-selected="true"]'],
        placement: { xRatio: 0.14, yRatio: 0.5 },
      };
    },
  },
  {
    path: "/perspectives",
    rationale: "Perspectivas — lente ativa é a decisão central da página.",
    resolve: () => ({
      selectors: [
        '#main-content [role="radiogroup"] button[aria-checked="true"]',
        '[data-abraxos-focus="perspective-lens"]',
      ],
      placement: { xRatio: 0.04, yRatio: 0.5 },
    }),
  },
  {
    path: "/architecture",
    rationale: "Arquitetura — aba ativa direciona para a camada técnica relevante.",
    resolve: (search) => {
      const focus = normalizeFocus(search, "focus", "architecture");
      return {
        selectors: [
          `[data-abraxos-focus="architecture-${focus}"]`,
          '#main-content nav[aria-label] button[aria-pressed="true"]',
        ],
        placement: { xRatio: 0.12, yRatio: 0.5 },
      };
    },
  },
  {
    path: "/evaluation",
    rationale: "Avaliação — aba ativa ou matriz de baseline concentram a atenção analítica.",
    resolve: (search) => {
      const focus = normalizeFocus(search, "focus", "methodology");
      if (focus === "baseline") {
        return {
          selectors: ['[data-abraxos-focus="evaluation-baseline"]', "#main-content nav button[aria-pressed='true']"],
          placement: { xRatio: 0.1, yRatio: 0.35 },
        };
      }
      return {
        selectors: ['#main-content nav button[aria-pressed="true"]'],
        placement: { xRatio: 0.12, yRatio: 0.5 },
      };
    },
  },
  {
    path: "/laboratory",
    rationale: "Laboratório — compositor de execução é o gesto primário de experimento.",
    resolve: () => ({
      selectors: ['[data-abraxos-focus="lab-run"]', "#main-content .laboratory-input"],
      placement: { xRatio: 0.1, yRatio: 0.22 },
    }),
  },
  {
    path: "/results",
    rationale: "Resultados — métricas de participação são o primeiro indicador de valor.",
    resolve: () => ({
      selectors: ['[data-abraxos-focus="results-metrics"]', "#main-content .page-h1"],
      placement: { xRatio: 0.08, yRatio: 0.62 },
    }),
  },
];

function normalizeFocus(search: string, key: string, fallback: string) {
  const value = new URLSearchParams(search).get(key);
  return value && value.length > 0 ? value : fallback;
}

function pointFromElement(element: Element, placement: AnchorPlacement): AnchorPoint {
  const rect = element.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) {
    return { x: 0, y: 0 };
  }
  return {
    x: rect.left + rect.width * placement.xRatio,
    y: rect.top + rect.height * placement.yRatio,
  };
}

function isVisible(element: Element) {
  const rect = element.getBoundingClientRect();
  return rect.width > 0 || rect.height > 0;
}

export function getAnchorStrategy(pathname: string): RouteAnchorEntry | null {
  const normalized = pathname.split("?")[0] ?? pathname;
  for (const entry of ROUTE_ANCHOR_REGISTRY) {
    if (normalized === entry.path || normalized.startsWith(`${entry.path}/`)) {
      return entry;
    }
  }
  return null;
}

export function resolvePresenceAnchor(pathname: string, search: string): AnchorPoint | null {
  const strategy = getAnchorStrategy(pathname);
  if (!strategy) return null;

  const { selectors, placement } = strategy.resolve(search);
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element && isVisible(element)) {
      return pointFromElement(element, placement);
    }
  }
  return null;
}

export function waitForPresenceAnchor(
  pathname: string,
  search: string,
  maxAttempts = 14,
): Promise<AnchorPoint | null> {
  return new Promise((resolve) => {
    let attempts = 0;

    const tick = () => {
      const anchor = resolvePresenceAnchor(pathname, search);
      if (anchor) {
        resolve(anchor);
        return;
      }
      attempts += 1;
      if (attempts >= maxAttempts) {
        resolve(null);
        return;
      }
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  });
}
