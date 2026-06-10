// Route → Abraxos destination presence. All primary surfaces use the same
// transition; strategic anchor placement varies per page (presenceAnchors.ts).

export type TransitionVariant = "destination-presence";

export interface RouteTransitionEntry {
  path: string;
  variant: TransitionVariant;
  rationale: string;
}

export const ROUTE_TRANSITION_REGISTRY: RouteTransitionEntry[] = [
  {
    path: "/main",
    variant: "destination-presence",
    rationale: "Home — presença junto à barra Consultar Abraxos.",
  },
  {
    path: "/oracle",
    variant: "destination-presence",
    rationale: "Oráculo — presença no compositor de chat.",
  },
  {
    path: "/foundations",
    variant: "destination-presence",
    rationale: "Fundamentos — presença na aba ativa de exploração.",
  },
  {
    path: "/components",
    variant: "destination-presence",
    rationale: "Componentes — presença no catálogo lateral.",
  },
  {
    path: "/reasoning",
    variant: "destination-presence",
    rationale: "Raciocínio — presença na aba cognitiva ativa.",
  },
  {
    path: "/perspectives",
    variant: "destination-presence",
    rationale: "Perspectivas — presença na lente profissional ativa.",
  },
  {
    path: "/architecture",
    variant: "destination-presence",
    rationale: "Arquitetura — presença na seção técnica ativa.",
  },
  {
    path: "/evaluation",
    variant: "destination-presence",
    rationale: "Avaliação — presença na seção ou matriz em foco.",
  },
  {
    path: "/laboratory",
    variant: "destination-presence",
    rationale: "Laboratório — presença no compositor de execução.",
  },
  {
    path: "/results",
    variant: "destination-presence",
    rationale: "Resultados — presença nas métricas de participação.",
  },
];

export function getTransitionForPath(pathname: string): RouteTransitionEntry | null {
  const normalized = pathname.split("?")[0] ?? pathname;
  for (const entry of ROUTE_TRANSITION_REGISTRY) {
    if (normalized === entry.path || normalized.startsWith(`${entry.path}/`)) {
      return entry;
    }
  }
  return null;
}

export function getPageEnterClass(reduced: boolean): string {
  if (reduced) return "presence-page-enter-reduced";
  return "presence-page-enter-destination";
}
