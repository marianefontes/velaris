import type { CommandMode } from "../beatrice/domain/governance/types";
import type { Locale } from "./translations";

interface CommandMessages {
  hints: Record<CommandMode, string>;
  placeholders: Record<CommandMode, string>;
}

const PT_BR: CommandMessages = {
  hints: {
    enforce: "cole o código JSX ou TSX que deseja validar",
    migrate: "cole o componente legado ou descreva o padrão",
    memory: "recupere decisões institucionais, padrões recorrentes e usos anteriores",
    decision: "reconstrua a origem, as alternativas e as consequências de uma decisão",
    perspectives: "compare a questão por design, frontend, produto, QA e documentação",
    audit: "audite fontes, lacunas de evidência, confiança e limitações",
    history: "pergunte sobre uma decisão arquitetural ou o histórico de um componente",
    why: "pergunte por que uma regra, componente ou padrão existe",
    tradeoff: "compare dois componentes, padrões ou abordagens",
    score: "avalie a qualidade arquitetural de um componente ou fluxo",
    simulate: "descreva uma mudança proposta para antecipar consequências antes de implementá-la",
    capture: "cole texto bruto de Slack, PR, RFC ou reunião para extrair e conectar conhecimento",
    document: "informe um componente ou fluxo para gerar documentação viva",
    learn: "alias legado para feedback review; nenhum treinamento de modelo é executado",
    "feedback-review": "analise feedback e evidências sem afirmar aprendizado automático",
    "token-impact": "gere um relatório estruturado de dependências e migração de token",
    "contract-check": "audite design, documentação, props, estados, tokens e implementação",
    "organizational-memory": "investigue como a organização resolveu problemas semelhantes",
    "decision-archaeology": "reconstrua a origem completa de uma decisão, do problema às consequências",
    "perspective-synthesis": "raciocine em paralelo pelas perspectivas profissionais do Abraxos",
    "explainability-audit": "audite evidência, cobertura e confiança de uma recomendação",
    "knowledge-gap": "detecte documentação ausente ou superficial sobre um tema",
    governance: "execute scan proativo de governança do catálogo Abraxos",
    health: "diagnostique a confiabilidade do sistema: RAG, catálogo, atribuição e validação",
    "governance-impact": "analise o impacto sistêmico e organizacional de uma mudança proposta",
    "principle-conflict": "exponha e resolva uma tensão entre princípios de design",
    "adoption-friction": "diagnostique barreiras de descoberta, documentação e design para código",
    "oracle-council": "execute uma deliberação experimental e estruturada entre perspectivas",
  },
  placeholders: {
    enforce: "/enforce\n<Button intent=\"negative\">Excluir análise</Button>",
    migrate: "/migrate notification → Toast/Notification",
    memory: "/memory O que já foi decidido sobre Modal/Dialog em ações destrutivas?",
    decision: "/decision Por que usamos Toast em vez de Alert para confirmação de salvamento?",
    perspectives: "/perspectives Tabs ou Card para organizar o catálogo? Compare design, frontend e QA.",
    audit: "/audit Audite fontes, lacunas e confiança desta recomendação de Confidence Badge.",
    history: "/history Por que adotamos SideDrawer no checkout mobile?",
    why: "/why Por que o ConfidenceMeter usa um arco radial em vez de uma barra?",
    tradeoff: "/tradeoff SideDrawer vs ModalOverlay no checkout mobile",
    score: "/score componente ConfidenceMeter",
    simulate: "/simulate trocar Alert por Toast em erros de Form Field",
    capture: "/capture\n[cole uma conversa do Slack, descrição de PR, RFC ou notas de reunião]",
    document: "/document ConfidenceMeter",
    learn: "/learn\n[descreva um padrão, cole dados de resultado ou informe uma decisão recorrente]",
    "feedback-review": "/feedback-review\n[cole feedback, resultados ou evidências recorrentes de uso]",
    "token-impact": "/token-impact primary-200",
    "contract-check": "/contract-check estado disabled do Button",
    "organizational-memory": "/organizational-memory como costumamos resolver formulários multi-etapas?",
    "decision-archaeology": "/decision-archaeology por que adotamos SideDrawer em vez de Modal?",
    "perspective-synthesis": "/perspective-synthesis vale a pena substituir Modal por Drawer no checkout?",
    "explainability-audit": "/explainability-audit audite a recomendação de usar Drawer no checkout",
    "knowledge-gap": "/knowledge-gap o que falta documentar sobre acessibilidade em formulários?",
    governance: "/governance",
    health: "/health o que mede o RAG Health e onde fica na UI?",
    "governance-impact": "/governance-impact impacto de trocar todos os Modals por Drawers",
    "principle-conflict": "/principle-conflict densidade de informação vs clareza no dashboard",
    "adoption-friction": "/adoption-friction Por que os times não usam o componente Table?",
    "oracle-council": "/oracle-council devemos padronizar Drawer como container primário?",
  },
};

const PT_PT: CommandMessages = {
  hints: {
    ...PT_BR.hints,
    enforce: "cole o código JSX ou TSX que pretende validar",
    migrate: "cole o componente legado ou descreva o padrão",
    perspectives: "compare a questão por design, frontend, produto, QA e documentação",
    capture: "cole texto bruto de Slack, PR, RFC ou reunião para extrair e ligar conhecimento",
    document: "indique um componente ou fluxo para gerar documentação viva",
    "knowledge-gap": "detete documentação ausente ou superficial sobre um tema",
    "adoption-friction": "diagnostique barreiras de descoberta, documentação e design para código",
  },
  placeholders: {
    ...PT_BR.placeholders,
    enforce: "/enforce\n<Button intent=\"negative\">Eliminar análise</Button>",
    perspectives: "/perspectives Compare esta decisão por design, frontend, produto, QA e documentação.",
    capture: "/capture\n[cole uma conversa do Slack, descrição de PR, RFC ou notas de reunião]",
    "adoption-friction": "/adoption-friction Porque é que as equipas não utilizam o componente Table?",
  },
};

const EN_US: CommandMessages = {
  hints: {
    enforce: "paste JSX or TSX code to validate",
    migrate: "paste the legacy component or describe the pattern",
    memory: "recover institutional decisions, recurring patterns and prior usage",
    decision: "reconstruct the origin, alternatives and consequences of a decision",
    perspectives: "compare the question through design, frontend, product, QA and documentation",
    audit: "audit sources, evidence gaps, confidence and limitations",
    history: "ask about an architectural decision or component history",
    why: "ask why a rule, component or pattern exists",
    tradeoff: "compare two components, patterns or approaches",
    score: "evaluate the architectural quality of a component or flow",
    simulate: "describe a proposed change to anticipate consequences before implementing it",
    capture: "paste raw Slack, PR, RFC or meeting text to extract and connect knowledge",
    document: "name a component or flow to generate living documentation",
    learn: "legacy alias for feedback review; no model learning is performed",
    "feedback-review": "analyze feedback and evidence without claiming automatic learning",
    "token-impact": "generate a structured token dependency and migration report",
    "contract-check": "audit design, documentation, props, states, tokens and implementation",
    "organizational-memory": "investigate how the organization solved similar problems",
    "decision-archaeology": "reconstruct the full origin of a decision, from problem to consequences",
    "perspective-synthesis": "reason through Abraxos professional perspectives in parallel",
    "explainability-audit": "audit a recommendation's evidence, coverage and confidence",
    "knowledge-gap": "detect missing or thin documentation on a topic",
    governance: "run a proactive Abraxos catalog governance scan",
    health: "diagnose system reliability: RAG, catalog, attribution and validation",
    "governance-impact": "analyze the systemic and organizational impact of a proposed change",
    "principle-conflict": "surface and resolve a tension between design principles",
    "adoption-friction": "diagnose discovery, documentation and design-to-code barriers",
    "oracle-council": "run an experimental structured multi-perspective deliberation",
  },
  placeholders: {
    enforce: "/enforce\n<Button intent=\"negative\">Delete analysis</Button>",
    migrate: "/migrate notification → Toast/Notification",
    memory: "/memory What has already been decided about Modal/Dialog for destructive actions?",
    decision: "/decision Why do we use Toast instead of Alert for save confirmation?",
    perspectives: "/perspectives Tabs or Card to organize the catalog? Compare design, frontend, and QA.",
    audit: "/audit Audit sources, gaps, and confidence for this Confidence Badge recommendation.",
    history: "/history Why did we adopt SideDrawer for mobile checkout?",
    why: "/why Why does ConfidenceMeter use a radial arc instead of a bar?",
    tradeoff: "/tradeoff SideDrawer vs ModalOverlay for mobile checkout",
    score: "/score ConfidenceMeter component",
    simulate: "/simulate replace Alert with Toast for Form Field errors",
    capture: "/capture\n[paste a Slack thread, PR description, RFC or meeting notes]",
    document: "/document ConfidenceMeter",
    learn: "/learn\n[describe a pattern, paste outcome data or name a recurring decision]",
    "feedback-review": "/feedback-review\n[paste feedback, outcomes or recurring usage evidence]",
    "token-impact": "/token-impact primary-200",
    "contract-check": "/contract-check Button disabled state",
    "organizational-memory": "/organizational-memory how do we usually solve multi-step forms?",
    "decision-archaeology": "/decision-archaeology why did we adopt SideDrawer instead of Modal?",
    "perspective-synthesis": "/perspective-synthesis should we replace Modal with Drawer in checkout?",
    "explainability-audit": "/explainability-audit audit the recommendation to use Drawer in checkout",
    "knowledge-gap": "/knowledge-gap what is missing about form accessibility?",
    governance: "/governance",
    health: "/health what does RAG Health measure and where is it in the UI?",
    "governance-impact": "/governance-impact impact of replacing every Modal with Drawer",
    "principle-conflict": "/principle-conflict information density vs clarity in the dashboard",
    "adoption-friction": "/adoption-friction Why do teams avoid the Table component?",
    "oracle-council": "/oracle-council should Drawer become the primary container?",
  },
};

const COMMAND_MESSAGES: Record<Locale, CommandMessages> = {
  "pt-BR": PT_BR,
  "pt-PT": PT_PT,
  "en-US": EN_US,
};

export function commandHintForLocale(command: CommandMode, locale: Locale): string {
  return COMMAND_MESSAGES[locale].hints[command];
}

export function commandPlaceholderForLocale(command: CommandMode, locale: Locale): string {
  return COMMAND_MESSAGES[locale].placeholders[command];
}
