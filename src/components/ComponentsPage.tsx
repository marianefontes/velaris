import {
  Activity,
  BarChart3,
  CalendarDays,
  CircleGauge,
  Command,
  Gauge,
  Layers3,
  LayoutTemplate,
  LoaderCircle,
  MenuSquare,
  MousePointerClick,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  ToggleLeft,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import type { Locale } from "../i18n/translations";

interface ComponentItem {
  title: string;
  status: "Stable" | "Beta";
  description: string;
  whenToUse: string;
  whenNotToUse: string;
  insight: string;
  icon: LucideIcon;
  accent: "primary" | "secondary" | "error";
}

interface SectionData {
  eyebrow: string;
  title: string;
  badge: string;
  items: ComponentItem[];
}

const accentMap = {
  primary: {
    text: "text-primary",
    border: "border-primary/20",
    soft: "bg-primary/5",
    left: "border-l-primary",
  },
  secondary: {
    text: "text-secondary",
    border: "border-secondary/20",
    soft: "bg-secondary/5",
    left: "border-l-secondary",
  },
  error: {
    text: "text-error",
    border: "border-error/20",
    soft: "bg-error/5",
    left: "border-l-error",
  },
} as const;

function getComponentsContent(locale: Locale) {
  if (locale === "en-US") {
    return {
      ui: {
        stable: "Stable",
        beta: "Beta",
        whenToUse: "When to Use",
        whenNotToUse: "When Not to Use",
        insight: "Aetheris Insight",
      },
      hero: {
        badge: "System Core v2.4",
        title: "Component Library",
        description:
          "A refined catalog of interaction building blocks engineered for the Aetheris ecosystem. Every component is designed to feel luminous, calm and context-aware.",
      },
      sections: [
        {
          eyebrow: "Component groups",
          title: "Actions",
          badge: "4 components",
          items: [
            {
              title: "Primary Action",
              status: "Stable",
              description: "Main system trigger for the most important objective in a view.",
              whenToUse: "Primary task completion and high-value progress steps.",
              whenNotToUse: "Secondary choices or low-impact options.",
              insight:
                "Limit to one primary action per focal region to keep neural clarity in dense interfaces.",
              icon: MousePointerClick,
              accent: "primary",
            },
            {
              title: "Switch Control",
              status: "Beta",
              description: "Compact segmented switch for moving between related modes or views.",
              whenToUse: "List, grid, graph and other tightly related perspectives.",
              whenNotToUse: "Cross-domain navigation or destination changes.",
              insight:
                "Keep label lengths balanced to prevent perceptual jitter during transitions.",
              icon: LayoutTemplate,
              accent: "secondary",
            },
            {
              title: "Global FAB",
              status: "Stable",
              description: "Persistent create affordance with strong symbolic weight in the canvas.",
              whenToUse: "Creation flows that are always relevant in the current surface.",
              whenNotToUse: "Nested details or contextual subtasks.",
              insight:
                "The FAB should feel like the source of creation in the system, not just another button.",
              icon: Sparkles,
              accent: "primary",
            },
            {
              title: "Contextual Menu",
              status: "Stable",
              description: "Scoped menu for secondary and destructive actions around a single entity.",
              whenToUse: "Rows, cards, assets and records with optional actions.",
              whenNotToUse: "Primary flows that deserve direct visibility.",
              insight:
                "Destructive actions should always sit last and visually separated from safe actions.",
              icon: MenuSquare,
              accent: "error",
            },
          ],
        },
        {
          eyebrow: "Component groups",
          title: "Feedback",
          badge: "3 components",
          items: [
            {
              title: "System Alerts",
              status: "Stable",
              description:
                "High-interruption feedback designed to reclaim user attention immediately.",
              whenToUse: "Critical system states, outages and blocked synchronization.",
              whenNotToUse: "Informational or dismissible status changes.",
              insight:
                "Alerts should break focus only when the cost of ignoring them exceeds the interruption.",
              icon: ShieldAlert,
              accent: "error",
            },
            {
              title: "Toast Notification",
              status: "Stable",
              description: "Low-friction, self-dismissing confirmation surface for recent actions.",
              whenToUse: "Saved, copied, synced or completed actions.",
              whenNotToUse: "Anything requiring a user decision or persistent context.",
              insight:
                "If the user needs to act, it is not a toast. It is an interruption and should be treated as one.",
              icon: Layers3,
              accent: "primary",
            },
            {
              title: "Skeleton Loader",
              status: "Stable",
              description:
                "Spatial placeholder preserving rhythm while asynchronous content arrives.",
              whenToUse: "Async panels, lazy content, pagination and API-backed cards.",
              whenNotToUse: "Operations so fast that the placeholder flickers.",
              insight:
                "A skeleton must mimic the final geometry; otherwise reveal feels like layout instability.",
              icon: LoaderCircle,
              accent: "primary",
            },
          ],
        },
        {
          eyebrow: "Component groups",
          title: "Data Visualization",
          badge: "5 components",
          items: [
            {
              title: "Metrics Plot",
              status: "Stable",
              description:
                "Dense trend visualization for temporal analysis and predictive modeling.",
              whenToUse: "Velocity, KPI evolution and forecasted movement.",
              whenNotToUse: "Single bounded values that need no trend context.",
              insight: "Direction of change is often more actionable than the raw number itself.",
              icon: BarChart3,
              accent: "primary",
            },
            {
              title: "Bioluminescent Heatmap",
              status: "Beta",
              description: "Intensity-based overview of hotspots in a complex system canvas.",
              whenToUse: "Activity clusters, dependency hotspots and risk density.",
              whenNotToUse: "Sparse datasets with few meaningful concentrations.",
              insight: "Map intensity with luminance and opacity before relying on hue shifts.",
              icon: Activity,
              accent: "secondary",
            },
            {
              title: "Radial Gauge",
              status: "Stable",
              description:
                "Circular bounded score for health, threshold and progress-at-a-glance.",
              whenToUse: "Health metrics, readiness scores and bounded KPIs.",
              whenNotToUse: "Unbounded values or raw totals.",
              insight:
                "A radial gauge implies a maximum; never use it for values without clear bounds.",
              icon: Gauge,
              accent: "primary",
            },
            {
              title: "Sparkline Strip",
              status: "Stable",
              description:
                "Compact inline trend cue embedded alongside metrics or table rows.",
              whenToUse: "Dense dashboards that still need directional context.",
              whenNotToUse: "Situations where precise reading beats glanceability.",
              insight:
                "A sparkline answers one critical question fast: is this getting better or worse?",
              icon: Activity,
              accent: "secondary",
            },
            {
              title: "Entity Graph",
              status: "Beta",
              description: "Relationship map for dependencies, systems and knowledge graphs.",
              whenToUse: "Connected entities where adjacency itself is meaningful.",
              whenNotToUse: "Linear flows better expressed as steps or trees.",
              insight:
                "Relationships are also data, and surfacing them often reveals the true bottleneck.",
              icon: Command,
              accent: "secondary",
            },
          ],
        },
        {
          eyebrow: "Component groups",
          title: "Inputs",
          badge: "6 components",
          items: [
            {
              title: "Neural Input",
              status: "Stable",
              description: "Signature text input built for conversational or semantic prompting.",
              whenToUse: "Search, prompts, generative commands and AI-assisted actions.",
              whenNotToUse: "Rigid structured forms with heavy validation.",
              insight:
                "Subtle glow and focused contrast make the field feel alive without reducing legibility.",
              icon: Search,
              accent: "primary",
            },
            {
              title: "Selection Chips",
              status: "Stable",
              description: "Compact multi-select controls for faceted refinement and tagging.",
              whenToUse: "Status, labels, dataset refinement and filtering.",
              whenNotToUse: "Long option lists that demand search or hierarchy.",
              insight:
                "Chips work best when options are few, semantically clear and visually balanced.",
              icon: Layers3,
              accent: "secondary",
            },
            {
              title: "Gradient Slider",
              status: "Stable",
              description: "Continuous control for threshold, opacity and numerical tuning.",
              whenToUse: "Precision values with immediate visual response.",
              whenNotToUse: "Discrete, categorical choices.",
              insight: "A slider should communicate range, not ambiguity. Show the current value clearly.",
              icon: SlidersHorizontal,
              accent: "primary",
            },
            {
              title: "Toggle Switch",
              status: "Stable",
              description: "Binary state control for immediate system preference changes.",
              whenToUse: "Instant, reversible preferences.",
              whenNotToUse: "Dangerous actions or changes that require confirmation.",
              insight:
                "A toggle promises immediate reversibility; never use it for high-risk consequences.",
              icon: ToggleLeft,
              accent: "primary",
            },
            {
              title: "Date Picker",
              status: "Stable",
              description: "Calendar anchor for deadlines, ranges and scheduled work.",
              whenToUse: "Scheduling, planning and time filtering.",
              whenNotToUse: "Simple year or text inputs where a calendar is excessive.",
              insight: "Today should always be a visible anchor so the user can orient instantly.",
              icon: CalendarDays,
              accent: "secondary",
            },
            {
              title: "Search Command Bar",
              status: "Stable",
              description: "Global command surface for navigation and power-user acceleration.",
              whenToUse: "Apps with broad IA, many actions or expert workflows.",
              whenNotToUse: "Tiny products where every action is already visible.",
              insight:
                "A great command bar is not an accessory; it becomes the operational backbone.",
              icon: Search,
              accent: "primary",
            },
          ],
        },
      ] satisfies SectionData[],
      xai: {
        eyebrow: "Component groups",
        title: "Intelligence / XAI",
        badge: "4 components",
        pill: "Explainable AI",
        widgetLabel: "XAI Widget",
        widgetTitle: "Explanation Bubble",
        widgetDescription:
          "Translates predictions into plain language for decision-makers, bridging the gap between automated analysis and operational understanding.",
        demoTitle: "Sprint Risk Prediction",
        demoRisk: "Medium Risk",
        demoTextBefore: "At the current velocity, Sprint 12 is likely to finish",
        demoTextHighlight: " 2.3 days late",
        demoTextAfter: ". The primary driver is the authentication module with effort 4x above estimate.",
        items: [
          {
            title: "Explanation Bubble",
            status: "Stable",
            description:
              "Natural-language explanation layer for opaque predictions and recommendations.",
            whenToUse: "Any AI-driven score or recommendation shown to non-technical users.",
            whenNotToUse: "Expert surfaces where raw coefficients matter more than summary language.",
            insight:
              "Explanation depth should adapt to role: managers need actionability, engineers need detail.",
            icon: Sparkles,
            accent: "primary",
          },
          {
            title: "Confidence Meter",
            status: "Stable",
            description: "Trust calibration surface that exposes uncertainty and signal quality.",
            whenToUse: "Predictions, forecasts and probabilistic suggestions.",
            whenNotToUse: "Deterministic rules where confidence is misleading theater.",
            insight:
              "Trust in AI is earned through uncertainty disclosure, not through tone of certainty.",
            icon: CircleGauge,
            accent: "primary",
          },
          {
            title: "Predictive Progress Card",
            status: "Beta",
            description: "Current progress plus projected trajectory in a single artifact.",
            whenToUse: "Sprints, milestones and delivery tracking with historical signal.",
            whenNotToUse: "Tasks with insufficient historical evidence.",
            insight:
              "The projection shadow must read as hypothesis, not promise, through muted styling.",
            icon: BarChart3,
            accent: "secondary",
          },
          {
            title: "Source Attribution Link",
            status: "Stable",
            description: "Evidence layer showing which documents, logs or datasets powered the insight.",
            whenToUse: "Every AI-generated summary, prediction or recommendation.",
            whenNotToUse: "Pure UI feedback that is not data-derived.",
            insight:
              "Explainability without provenance is storytelling. Evidence makes it auditable.",
            icon: Command,
            accent: "primary",
          },
        ] satisfies ComponentItem[],
      },
    };
  }

  const isPtPt = locale === "pt-PT";

  return {
    ui: {
      stable: isPtPt ? "Estável" : "Estável",
      beta: "Beta",
      whenToUse: isPtPt ? "Quando usar" : "Quando usar",
      whenNotToUse: isPtPt ? "Quando não usar" : "Quando não usar",
      insight: "Aetheris Insight",
    },
    hero: {
      badge: "System Core v2.4",
      title: isPtPt ? "Biblioteca de Componentes" : "Biblioteca de Componentes",
      description: isPtPt
        ? "Um catálogo refinado de blocos de interação concebidos para o ecossistema Aetheris. Cada componente foi desenhado para parecer luminoso, calmo e sensível ao contexto."
        : "Um catálogo refinado de blocos de interação projetados para o ecossistema Aetheris. Cada componente foi desenhado para parecer luminoso, calmo e sensível ao contexto.",
    },
    sections: [
      {
        eyebrow: "Grupos de componentes",
        title: "Ações",
        badge: "4 componentes",
        items: [
          {
            title: "Ação Primária",
            status: "Stable",
            description: isPtPt
              ? "Acionador principal do sistema para o objetivo mais importante de uma vista."
              : "Acionador principal do sistema para o objetivo mais importante de uma tela.",
            whenToUse: isPtPt
              ? "Conclusão da tarefa principal e passos de progresso de alto valor."
              : "Conclusão da tarefa principal e etapas de progresso de alto valor.",
            whenNotToUse: "Escolhas secundárias ou opções de baixo impacto.",
            insight:
              "Limite a uma ação primária por região focal para manter clareza cognitiva em interfaces densas.",
            icon: MousePointerClick,
            accent: "primary",
          },
          {
            title: "Controle de Alternância",
            status: "Beta",
            description: isPtPt
              ? "Segmentador compacto para alternar entre modos ou vistas relacionadas."
              : "Segmentador compacto para alternar entre modos ou visualizações relacionadas.",
            whenToUse: "Lista, grelha, gráfico e outras perspetivas intimamente relacionadas.",
            whenNotToUse: "Navegação entre domínios ou mudanças de destino.",
            insight:
              "Mantenha os rótulos com comprimentos equilibrados para evitar jitter perceptivo nas transições.",
            icon: LayoutTemplate,
            accent: "secondary",
          },
          {
            title: "FAB Global",
            status: "Stable",
            description:
              "Ação persistente de criação com forte peso simbólico no canvas.",
            whenToUse: "Fluxos de criação sempre relevantes na superfície atual.",
            whenNotToUse: "Detalhes aninhados ou subtarefas contextuais.",
            insight:
              "O FAB deve parecer a origem da criação no sistema, e não apenas mais um botão.",
            icon: Sparkles,
            accent: "primary",
          },
          {
            title: "Menu Contextual",
            status: "Stable",
            description:
              "Menu localizado para ações secundárias e destrutivas em torno de uma única entidade.",
            whenToUse: "Linhas, cards, assets e registos com ações opcionais.",
            whenNotToUse: "Fluxos primários que merecem visibilidade direta.",
            insight:
              "Ações destrutivas devem surgir sempre no fim e visualmente separadas das ações seguras.",
            icon: MenuSquare,
            accent: "error",
          },
        ],
      },
      {
        eyebrow: "Grupos de componentes",
        title: "Feedback",
        badge: "3 componentes",
        items: [
          {
            title: "Alertas do Sistema",
            status: "Stable",
            description:
              "Feedback de alta interrupção desenhado para recuperar imediatamente a atenção do utilizador.",
            whenToUse: "Estados críticos do sistema, indisponibilidades e sincronizações bloqueadas.",
            whenNotToUse: "Mudanças informativas ou descartáveis de estado.",
            insight:
              "Um alerta só deve quebrar o foco quando o custo de o ignorar superar a interrupção.",
            icon: ShieldAlert,
            accent: "error",
          },
          {
            title: "Notificação Toast",
            status: "Stable",
            description:
              "Superfície leve e auto-dispensável para confirmar ações recentes.",
            whenToUse: "Ações guardadas, copiadas, sincronizadas ou concluídas.",
            whenNotToUse: "Qualquer situação que exija decisão do utilizador ou contexto persistente.",
            insight:
              "Se a pessoa precisa agir, não é toast. É interrupção e deve ser tratada como tal.",
            icon: Layers3,
            accent: "primary",
          },
          {
            title: "Skeleton Loader",
            status: "Stable",
            description:
              "Placeholder espacial que preserva o ritmo enquanto o conteúdo assíncrono chega.",
            whenToUse: "Painéis assíncronos, conteúdo lazy, paginação e cards ligados a APIs.",
            whenNotToUse: "Operações tão rápidas que fariam o placeholder piscar.",
            insight:
              "O skeleton precisa imitar a geometria final; caso contrário, a revelação parece instabilidade de layout.",
            icon: LoaderCircle,
            accent: "primary",
          },
        ],
      },
      {
        eyebrow: "Grupos de componentes",
        title: "Visualização de Dados",
        badge: "5 componentes",
        items: [
          {
            title: "Gráfico de Métricas",
            status: "Stable",
            description:
              "Visualização densa de tendências para análise temporal e modelação preditiva.",
            whenToUse: "Velocidade, evolução de KPI e movimentos previstos.",
            whenNotToUse: "Valores únicos limitados que não precisam de contexto de tendência.",
            insight:
              "A direção da mudança é muitas vezes mais acionável do que o número bruto.",
            icon: BarChart3,
            accent: "primary",
          },
          {
            title: "Mapa de Calor Bioluminescente",
            status: "Beta",
            description:
              "Visão baseada em intensidade para hotspots num canvas complexo do sistema.",
            whenToUse: "Clusters de atividade, hotspots de dependência e densidade de risco.",
            whenNotToUse: "Conjuntos de dados esparsos com poucas concentrações relevantes.",
            insight:
              "Mapeie intensidade com luminância e opacidade antes de recorrer a mudanças de matiz.",
            icon: Activity,
            accent: "secondary",
          },
          {
            title: "Medidor Radial",
            status: "Stable",
            description:
              "Pontuação circular limitada para saúde, limiar e progresso num relance.",
            whenToUse: "Métricas de saúde, scores de prontidão e KPIs limitados.",
            whenNotToUse: "Valores ilimitados ou totais brutos.",
            insight:
              "Um medidor radial implica um máximo; nunca o use para valores sem limites claros.",
            icon: Gauge,
            accent: "primary",
          },
          {
            title: "Sparkline",
            status: "Stable",
            description:
              "Indicador compacto de tendência embutido ao lado de métricas ou linhas de tabela.",
            whenToUse: "Dashboards densos que ainda precisam de contexto direcional.",
            whenNotToUse: "Situações em que a leitura precisa é mais importante do que o escaneamento rápido.",
            insight:
              "Um sparkline responde depressa a uma pergunta crítica: isto está a melhorar ou a piorar?",
            icon: Activity,
            accent: "secondary",
          },
          {
            title: "Grafo de Entidades",
            status: "Beta",
            description:
              "Mapa de relações para dependências, sistemas e grafos de conhecimento.",
            whenToUse: "Entidades conectadas em que a adjacência tem significado.",
            whenNotToUse: "Fluxos lineares melhor expressos como passos ou árvores.",
            insight:
              "Relações também são dados, e mostrá-las muitas vezes revela o verdadeiro gargalo.",
            icon: Command,
            accent: "secondary",
          },
        ],
      },
      {
        eyebrow: "Grupos de componentes",
        title: "Inputs",
        badge: "6 componentes",
        items: [
          {
            title: "Neural Input",
            status: "Stable",
            description:
              "Campo de texto assinatura construído para prompting conversacional ou semântico.",
            whenToUse: "Pesquisa, prompts, comandos generativos e ações assistidas por IA.",
            whenNotToUse: "Formulários rígidos e estruturados com validação pesada.",
            insight:
              "Glow subtil e contraste focado fazem o campo parecer vivo sem prejudicar a legibilidade.",
            icon: Search,
            accent: "primary",
          },
          {
            title: "Chips de Seleção",
            status: "Stable",
            description:
              "Controlos compactos de multi-seleção para refinamento facetado e tagging.",
            whenToUse: "Estado, labels, refinamento de datasets e filtragem.",
            whenNotToUse: "Listas longas que exigem pesquisa ou hierarquia.",
            insight:
              "Chips funcionam melhor quando as opções são poucas, semanticamente claras e visualmente equilibradas.",
            icon: Layers3,
            accent: "secondary",
          },
          {
            title: "Slider Gradiente",
            status: "Stable",
            description:
              "Controlo contínuo para limiar, opacidade e afinação numérica.",
            whenToUse: "Valores precisos com resposta visual imediata.",
            whenNotToUse: "Escolhas discretas e categóricas.",
            insight: "Um slider deve comunicar intervalo, não ambiguidade. Mostre o valor atual com clareza.",
            icon: SlidersHorizontal,
            accent: "primary",
          },
          {
            title: "Interruptor Toggle",
            status: "Stable",
            description:
              "Controlo binário de estado para alterações imediatas de preferência do sistema.",
            whenToUse: "Preferências instantâneas e reversíveis.",
            whenNotToUse: "Ações perigosas ou mudanças que exigem confirmação.",
            insight:
              "Um toggle promete reversibilidade imediata; nunca o use para consequências de alto risco.",
            icon: ToggleLeft,
            accent: "primary",
          },
          {
            title: "Date Picker",
            status: "Stable",
            description:
              "Âncora de calendário para prazos, intervalos e trabalho agendado.",
            whenToUse: "Agendamento, planeamento e filtragem temporal.",
            whenNotToUse: "Inputs simples de ano ou texto em que o calendário seja excessivo.",
            insight: "Hoje deve ser sempre uma âncora visível para orientar instantaneamente a pessoa.",
            icon: CalendarDays,
            accent: "secondary",
          },
          {
            title: "Barra de Comandos",
            status: "Stable",
            description:
              "Superfície global de comando para navegação e aceleração de power users.",
            whenToUse: "Apps com IA ampla, muitas ações ou workflows especialistas.",
            whenNotToUse: "Produtos pequenos onde tudo já está visível.",
            insight:
              "Uma grande command bar não é acessório; torna-se a espinha dorsal operacional.",
            icon: Search,
            accent: "primary",
          },
        ],
      },
    ] satisfies SectionData[],
    xai: {
      eyebrow: "Grupos de componentes",
      title: "Inteligência / XAI",
      badge: "4 componentes",
      pill: "IA Explicável",
      widgetLabel: "Widget XAI",
      widgetTitle: "Bolha de Explicação",
      widgetDescription: isPtPt
        ? "Traduz previsões em linguagem simples para decisores, fazendo a ponte entre análise automatizada e entendimento operacional."
        : "Traduz previsões em linguagem simples para tomadores de decisão, fazendo a ponte entre análise automatizada e entendimento operacional.",
      demoTitle: isPtPt ? "Previsão de Risco da Sprint" : "Previsão de Risco da Sprint",
      demoRisk: isPtPt ? "Risco médio" : "Médio risco",
      demoTextBefore: isPtPt
        ? "Ao ritmo atual, a Sprint 12 deverá terminar"
        : "Na velocidade atual, a Sprint 12 provavelmente terminará",
      demoTextHighlight: " 2,3 dias atrasada",
      demoTextAfter: isPtPt
        ? ". O principal fator é o módulo de autenticação, com esforço 4x acima da estimativa."
        : ". O principal fator é o módulo de autenticação, com esforço 4x acima da estimativa.",
      items: [
        {
          title: isPtPt ? "Bolha de Explicação" : "Bolha de Explicação",
          status: "Stable",
          description:
            "Camada de explicação em linguagem natural para previsões e recomendações opacas.",
          whenToUse: "Qualquer score ou recomendação gerada por IA apresentada a pessoas não técnicas.",
          whenNotToUse: "Superfícies especialistas em que coeficientes brutos importam mais do que linguagem resumida.",
          insight:
            "A profundidade da explicação deve adaptar-se ao papel: gestão precisa de ação, engenharia precisa de detalhe.",
          icon: Sparkles,
          accent: "primary",
        },
        {
          title: isPtPt ? "Medidor de Confiança" : "Medidor de Confiança",
          status: "Stable",
          description: "Superfície de calibração de confiança que expõe incerteza e qualidade do sinal.",
          whenToUse: "Previsões, forecasts e sugestões probabilísticas.",
          whenNotToUse: "Regras determinísticas em que confiança seria teatro enganoso.",
          insight:
            "Confiança em IA é conquistada pela exposição da incerteza, não por um tom de certeza.",
          icon: CircleGauge,
          accent: "primary",
        },
        {
          title: isPtPt ? "Card de Progresso Preditivo" : "Card de Progresso Preditivo",
          status: "Beta",
          description: "Progresso atual mais trajetória projetada num único artefacto.",
          whenToUse: "Sprints, marcos e acompanhamento de entregas com histórico.",
          whenNotToUse: "Tarefas sem evidência histórica suficiente.",
          insight:
            "A sombra da projeção deve ser lida como hipótese, e não promessa, através de styling mais contido.",
          icon: BarChart3,
          accent: "secondary",
        },
        {
          title: isPtPt ? "Link de Proveniência" : "Link de Proveniência",
          status: "Stable",
          description:
            "Camada de evidência mostrando que documentos, logs ou datasets alimentaram o insight.",
          whenToUse: "Todo resumo, previsão ou recomendação gerado por IA.",
          whenNotToUse: "Feedback puramente de UI que não deriva de dados.",
          insight:
            "Explicabilidade sem proveniência é storytelling. A evidência torna tudo auditável.",
          icon: Command,
          accent: "primary",
        },
      ] satisfies ComponentItem[],
    },
  };
}

function StatusPill({
  status,
  accent,
  stableLabel,
  betaLabel,
}: {
  status: ComponentItem["status"];
  accent: ComponentItem["accent"];
  stableLabel: string;
  betaLabel: string;
}) {
  const tone = accentMap[accent];
  return (
    <span
      className={`rounded-full border px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${tone.border} ${tone.text}`}
    >
      {status === "Stable" ? stableLabel : betaLabel}
    </span>
  );
}

function PreviewCanvas({ item }: { item: ComponentItem }) {
  const Icon = item.icon;
  const tone = accentMap[item.accent];

  return (
    <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-t-[20px] bg-surface-container p-8">
      <div className={`absolute inset-0 ${tone.soft} opacity-80`} />
      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-gradient-to-tr from-primary to-secondary shadow-panel">
          <Icon className="h-8 w-8 text-on-primary-container" />
        </div>
        <div className="glass-card rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
          {item.title}
        </div>
      </div>
    </div>
  );
}

function ComponentCard({
  item,
  ui,
}: {
  item: ComponentItem;
  ui: {
    stable: string;
    beta: string;
    whenToUse: string;
    whenNotToUse: string;
    insight: string;
  };
}) {
  const tone = accentMap[item.accent];

  return (
    <article className="group overflow-hidden rounded-[20px] border border-white/5 bg-surface-container-low transition-all duration-500 hover:border-primary/20">
      <PreviewCanvas item={item} />
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-white">{item.title}</h3>
          <StatusPill
            status={item.status}
            accent={item.accent}
            stableLabel={ui.stable}
            betaLabel={ui.beta}
          />
        </div>
        <p className="text-sm leading-6 text-on-surface-variant">{item.description}</p>
        <div className="mt-5 space-y-4">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
              {ui.whenToUse}
            </p>
            <p className="text-xs leading-5 text-on-surface">{item.whenToUse}</p>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.24em] text-error/80">
              {ui.whenNotToUse}
            </p>
            <p className="text-xs leading-5 text-on-surface">{item.whenNotToUse}</p>
          </div>
        </div>
        <div className={`mt-6 rounded-xl border-l-2 ${tone.left} bg-surface-container-high/50 p-4`}>
          <p
            className={`mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] ${tone.text}`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {ui.insight}
          </p>
          <p className={`text-[11px] italic leading-5 ${tone.text}/80`}>{item.insight}</p>
        </div>
      </div>
    </article>
  );
}

function SectionBlock({
  section,
  ui,
}: {
  section: SectionData;
  ui: {
    stable: string;
    beta: string;
    whenToUse: string;
    whenNotToUse: string;
    insight: string;
  };
}) {
  return (
    <section>
      <div className="mb-10 flex items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-on-surface-variant">
            {section.eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">{section.title}</h2>
        </div>
        <span className="rounded-full bg-surface-container-high px-3 py-1 text-xs uppercase tracking-widest text-on-surface-variant">
          {section.badge}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {section.items.map((item) => (
          <ComponentCard key={item.title} item={item} ui={ui} />
        ))}
      </div>
    </section>
  );
}

export function ComponentsPage() {
  const { locale } = useI18n();
  const content = getComponentsContent(locale);

  return (
    <div className="space-y-24 pb-20">
      <section className="grid gap-8 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="max-w-3xl">
          <span className="mb-6 inline-block rounded-full border border-secondary/20 bg-secondary-container/30 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-on-secondary-container">
            {content.hero.badge}
          </span>
          <h1 className="text-6xl font-black tracking-tighter text-white md:text-7xl">
            {content.hero.title}
          </h1>
          <p className="mt-6 text-xl leading-8 text-on-surface-variant">
            {content.hero.description}
          </p>
        </div>

        <div className="relative flex justify-start xl:justify-end">
          <div className="relative flex h-48 w-48 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-[80px]" />
            <div className="glass-card relative z-10 flex h-full w-full items-center justify-center rounded-[40px] border border-white/10">
              <Sparkles className="h-16 w-16 text-primary" />
            </div>
          </div>
        </div>
      </section>

      {content.sections.map((section) => (
        <SectionBlock key={section.title} section={section} ui={content.ui} />
      ))}

      <section>
        <div className="mb-10 flex items-center gap-4 border-b border-white/5 pb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-on-surface-variant">
              {content.xai.eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
              {content.xai.title.includes("/") ? (
                <>
                  {content.xai.title.split("/")[0]?.trim()}{" "}
                  <span className="signature-text">/ XAI</span>
                </>
              ) : (
                content.xai.title
              )}
            </h2>
          </div>
          <span className="rounded-full bg-surface-container-high px-3 py-1 text-xs uppercase tracking-widest text-on-surface-variant">
            {content.xai.badge}
          </span>
          <span className="signature-pill">{content.xai.pill}</span>
        </div>

        <div className="mb-8 overflow-hidden rounded-[40px] border border-primary/10 bg-surface-container-low">
          <div className="grid gap-0 md:grid-cols-2">
            <div className="p-10">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                  {content.xai.widgetLabel}
                </span>
              </div>
              <h3 className="text-4xl font-black tracking-tighter text-white">
                {content.xai.widgetTitle}
              </h3>
              <p className="mt-5 max-w-md text-sm leading-7 text-on-surface-variant">
                {content.xai.widgetDescription}
              </p>
            </div>
            <div className="relative bg-surface-container p-10">
              <div className="absolute inset-0 opacity-15 [background-image:radial-gradient(circle_at_60%_40%,#deccfd,transparent_65%)]" />
              <div className="relative glass-card rounded-2xl border border-primary/10 p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {content.xai.demoTitle}
                  </span>
                  <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-1 text-[10px] font-black uppercase text-amber-300">
                    {content.xai.demoRisk}
                  </span>
                </div>
                <p className="text-sm leading-6 text-white">
                  {content.xai.demoTextBefore}
                  <span className="font-bold text-amber-300">{content.xai.demoTextHighlight}</span>
                  {content.xai.demoTextAfter}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {content.xai.items.slice(1).map((item) => (
            <ComponentCard key={item.title} item={item} ui={content.ui} />
          ))}
          <div className="md:col-span-2">
            <ComponentCard item={content.xai.items[0]!} ui={content.ui} />
          </div>
        </div>
      </section>
    </div>
  );
}
