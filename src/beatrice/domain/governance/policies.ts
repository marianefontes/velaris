import type { CommandMode } from "./types";

const COMMAND_PATTERN =
  /^\/(memory|decision|perspectives|audit|organizational-memory|decision-archaeology|perspective-synthesis|explainability-audit|knowledge-gap|governance-impact|principle-conflict|adoption-friction|oracle-council|enforce|migrate|token-impact|contract-check|feedback-review|capture|document|history|why|tradeoff|score|simulate|learn)\b/;

export function detectCommandMode(input: string): CommandMode | null {
  const match = input.match(COMMAND_PATTERN);
  return (match?.[1] as CommandMode | undefined) ?? null;
}

export function commandPlaceholder(command: CommandMode | null): string | null {
  const placeholders: Record<CommandMode, string> = {
    enforce: `/enforce\n<Button color="red">Delete account</Button>`,
    migrate: "/migrate LegacyDrawer -> ?",
    memory: "/memory O que já foi decidido sobre modais em ações destrutivas?",
    decision: "/decision Por que usamos Toast em vez de Alert para feedback não bloqueante?",
    perspectives: "/perspectives Compare esta decisão por design, frontend, produto, QA e documentação.",
    audit: "/audit Mostre as fontes, lacunas e confiança desta recomendação.",
    history: "/history why did we adopt SideDrawer for checkout mobile?",
    why: "/why does the ConfidenceMeter use a radial arc instead of a bar?",
    tradeoff: "/tradeoff SideDrawer vs ModalOverlay for mobile checkout",
    score: "/score ConfidenceMeter component",
    simulate: "/simulate replacing ModalOverlay with SideDrawer across checkout flows",
    capture: `/capture\n[paste Slack thread, PR description, RFC draft or meeting notes here]`,
    document: "/document ConfidenceMeter",
    learn: `/learn\n[describe a pattern, paste outcome data, or name a recurring decision to analyze]`,
    "feedback-review": `/feedback-review\n[paste feedback, outcomes or recurring usage evidence]`,
    "token-impact": "/token-impact primary-200",
    "contract-check": "/contract-check Button disabled state",
    "organizational-memory": "/organizational-memory como costumamos resolver formulários multi-etapas?",
    "decision-archaeology": "/decision-archaeology por que adotamos SideDrawer em vez de Modal?",
    "perspective-synthesis": "/perspective-synthesis vale a pena substituir o Modal por Drawer no checkout?",
    "explainability-audit": "/explainability-audit audite a recomendação de usar Drawer no checkout",
    "knowledge-gap": "/knowledge-gap o que falta documentar sobre acessibilidade em formulários?",
    "governance-impact": "/governance-impact impacto de trocar todos os Modais por Drawers",
    "principle-conflict": "/principle-conflict densidade de informação vs clareza no dashboard",
    "adoption-friction": "/adoption-friction Por que os times não usam o componente Table?",
    "oracle-council": "/oracle-council devemos padronizar Drawer como container primário?",
  };
  return command ? placeholders[command] : null;
}

export function commandHint(command: CommandMode): string {
  const hints: Record<CommandMode, string> = {
    enforce: "paste JSX/TSX code to validate",
    migrate: "paste legacy component or describe the pattern",
    memory: "recover institutional decisions, recurring patterns and prior usage",
    decision: "reconstruct the origin, alternatives and consequences of a decision",
    perspectives: "compare the question through design, frontend, product, QA and documentation",
    audit: "audit sources, evidence gaps, confidence and limitations",
    history: "ask about any architectural decision or component history",
    why: "ask why a rule, component or pattern exists",
    tradeoff: "compare two components, patterns or approaches",
    score: "evaluate architectural quality of a component or flow",
    simulate: "describe a proposed change to predict its UX and architectural impact",
    capture: "paste raw text (Slack, PR, RFC, meeting) to extract and connect knowledge",
    document: "name a component or flow to generate living documentation",
    learn: "legacy alias for feedback review; no model learning is performed",
    "feedback-review": "analyze feedback and evidence without claiming automatic learning",
    "token-impact": "generate a structured token dependency and migration report",
    "contract-check": "audit design, documentation, props, states, tokens and implementation",
    "organizational-memory": "how the organization has solved similar problems before",
    "decision-archaeology": "reconstruct the full origin of a decision (problem → consequences)",
    "perspective-synthesis": "reason through PM, Designer, Dev, QA and Tech Writer in parallel",
    "explainability-audit": "audit a recommendation's evidence, coverage and confidence",
    "knowledge-gap": "detect missing or thin documentation on a topic",
    "governance-impact": "simulate the systemic impact of a proposed change",
    "principle-conflict": "surface and resolve a tension between design principles",
    "adoption-friction": "diagnose discovery, documentation and design-code barriers to adoption",
    "oracle-council": "experimental structured multi-perspective deliberation",
  };
  return hints[command];
}
