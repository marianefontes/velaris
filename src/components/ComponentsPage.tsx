import {
  AlignLeft,
  Bell,
  BookOpenCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  CircleDot,
  Clipboard,
  Code2,
  Command,
  CreditCard,
  ExternalLink,
  FormInput,
  Gauge,
  Layers3,
  Link2,
  ListChecks,
  ListFilter,
  LoaderCircle,
  MessageCircleQuestion,
  MousePointerClick,
  PanelTop,
  PanelsTopLeft,
  Shapes,
  Sparkles,
  SquareCheckBig,
  Table2,
  Tags,
  TextCursorInput,
  ToggleLeft,
  TriangleAlert,
  Type,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "../i18n/I18nProvider";
import type { Locale } from "../i18n/translations";
import {
  createInitialPlaygroundConfig,
  generateComponentSnippet,
  parseComponentSnippet,
} from "./componentWorkbench";
import { getIntentExplanation } from "./componentIntentDocumentation";
import { getComponentUsageGuidance } from "./componentUsageGuidance";
import type {
  ButtonIntent,
  ButtonState,
  ComponentId,
  ComponentPlaygroundConfig,
  SnippetParseResult,
} from "./componentWorkbench";

type SectionId =
  | "actions"
  | "forms"
  | "structure"
  | "feedback"
  | "intelligence";

interface EnglishCopy {
  description: string;
  logic: string;
  whenToUse: string;
  whenNotToUse: string;
  accessibility: string;
  ragRelation: string;
  insight: string;
}

interface ComponentDoc {
  id: ComponentId;
  section: SectionId;
  title: string;
  status: "Stable";
  description: string;
  logic: string;
  structure: string;
  whenToUse: string;
  whenNotToUse: string;
  tradeOffs: string;
  accessibility: string;
  ragRelation: string;
  insight: string;
  states: string[];
  intents: string[];
  snippet: string;
  icon: LucideIcon;
  en: EnglishCopy;
}

interface SectionMeta {
  id: SectionId;
  title: string;
  description: string;
}

interface WorkbenchUi {
  eyebrow: string;
  title: string;
  description: string;
  count: string;
  corpus: string;
  sectionNav: string;
  componentNav: string;
  preview: string;
  usage: string;
  whenToUse: string;
  whenNotToUse: string;
  accessibility: string;
  ragRelation: string;
  states: string;
  intents: string;
  code: string;
  copy: string;
  copied: string;
  libraryMap: string;
  components: string;
  stable: string;
  doLabel: string;
  dontLabel: string;
  snippetEditorLabel: string;
}

const DEFAULT_BUTTON_CONFIG: ComponentPlaygroundConfig = {
  intent: "Primary",
  state: "Default",
  label: "Gerar análise",
};

type SnippetError = Extract<SnippetParseResult, { ok: false }>["error"];

function getSnippetError(error: SnippetError, locale: Locale): string {
  if (locale === "en-US") {
    return error === "invalid-syntax"
      ? "Use a complete snippet with the documented component structure."
      : "This editor accepts the documented props and generated state/intent combinations.";
  }
  return error === "invalid-syntax"
    ? "Use um snippet completo com a estrutura documentada do componente."
    : "Este editor aceita as props documentadas e as combinações geradas de state e intent.";
}

const COMPONENT_CATALOG: ComponentDoc[] = [
  {
    id: "button",
    section: "actions",
    title: "Button",
    status: "Stable",
    description: "Aciona uma tarefa clara e comunica a prioridade da próxima ação.",
    logic: "Use uma ação primária por região focal e rebaixe escolhas concorrentes.",
    structure: "Rótulo curto, alvo mínimo de 44px e ícone opcional.",
    whenToUse: "Use Button para ações explícitas como salvar, confirmar, enviar, gerar ou avançar. Use apenas uma ação primária por região visual para manter a hierarquia clara. Use loading quando a ação disparar uma operação assíncrona. Use positive para confirmar conclusão, aprovação, restauração ou uma ação benéfica inequívoca. Use negative apenas para ações críticas, como excluir, cancelar definitivamente ou remover dados. Mantenha o texto do botão curto, direto e orientado à ação.",
    whenNotToUse: "Não use Button para navegação textual simples; use Link quando a ação for apenas navegar. Não coloque múltiplos botões primary competindo na mesma área. Não use disabled sem explicar por que a ação está indisponível. Não use positive como decoração ou para ações neutras. Não use negative para ações comuns ou facilmente reversíveis. Não altere estilos manualmente fora dos tokens do design system.",
    tradeOffs: "Excesso de botões primários dilui a hierarquia e aumenta hesitação.",
    accessibility: "Mantenha nome acessível, foco visível, alvo de 44px e estado disabled perceptível.",
    ragRelation: "Permite que a Beatrice recomende hierarquia de ações com evidência de uso e estado.",
    insight: "Uma ação primária deve tornar a decisão mais óbvia, não apenas mais colorida.",
    states: ["Default", "Hover", "Focus", "Loading", "Disabled"],
    intents: ["Primary", "Secondary", "Positive", "Negative"],
    snippet: generateComponentSnippet("button", DEFAULT_BUTTON_CONFIG),
    icon: MousePointerClick,
    en: {
      description: "Triggers a clear task and communicates the priority of the next action.",
      logic: "Use one primary action per focal region and demote competing choices.",
      whenToUse: "Use Button for explicit actions such as saving, confirming, submitting, generating, or advancing. Use only one primary action per visual region to preserve clear hierarchy. Use loading when the action starts an asynchronous operation. Use positive to confirm completion, approval, restoration, or another clearly beneficial action. Use negative only for critical actions such as deleting, permanently canceling, or removing data. Keep Button text short, direct, and action-oriented.",
      whenNotToUse: "Do not use Button for simple text navigation; use Link when the action only changes destination. Do not place multiple competing primary Buttons in the same area. Do not use disabled without explaining why the action is unavailable. Do not use positive as decoration or for neutral actions. Do not use negative for common or easily reversible actions. Do not manually override styles outside the design-system tokens.",
      accessibility: "Provide an accessible name, visible focus, 44px target, and clear disabled state.",
      ragRelation: "Helps Beatrice recommend action hierarchy from documented usage and state evidence.",
      insight: "A primary action should make the decision clearer, not merely more colorful.",
    },
  },
  {
    id: "toggle-switch",
    section: "actions",
    title: "Toggle/Switch",
    status: "Stable",
    description: "Alterna imediatamente uma configuração binária entre ligada e desligada.",
    logic: "Off e On definem o valor. Focus demonstra foco de teclado sem alterar esse valor. Preference aplica uma escolha pessoal, Visibility mostra ou oculta conteúdo e Mode alterna o comportamento operacional.",
    structure: "Trilho, indicador móvel, rótulo persistente e estado textual quando necessário.",
    whenToUse: "Para preferências binárias com efeito imediato e reversível.",
    whenNotToUse: "Para selecionar uma opção em um grupo ou confirmar termos obrigatórios.",
    tradeOffs: "Sem rótulo explícito, o usuário pode não entender o que o estado controla.",
    accessibility: "Use role switch, aria-checked, rótulo associado e não dependa apenas de cor.",
    ragRelation: "Evita que a Beatrice confunda alternância imediata com checkbox de confirmação.",
    insight: "O estado deve ser compreensível antes e depois da interação.",
    states: ["Off", "On", "Focus", "Disabled"],
    intents: ["Preference", "Visibility", "Mode"],
    snippet: `<Switch checked={reduceMotion} onCheckedChange={setReduceMotion}>\n  Reduzir animações\n</Switch>`,
    icon: ToggleLeft,
    en: {
      description: "Immediately toggles a binary setting between on and off.",
      logic: "Off and On define the value. Focus demonstrates keyboard focus without changing it. Preference applies a personal choice, Visibility shows or hides content, and Mode changes operational behavior.",
      whenToUse: "Use for immediate, reversible binary preferences.",
      whenNotToUse: "Avoid for grouped choices or required terms confirmation.",
      accessibility: "Use switch semantics, aria-checked, an associated label, and more than color.",
      ragRelation: "Prevents Beatrice from confusing immediate toggles with confirmation checkboxes.",
      insight: "The state must be understandable before and after interaction.",
    },
  },
  {
    id: "checkbox",
    section: "actions",
    title: "Checkbox",
    status: "Stable",
    description: "Permite selecionar zero, uma ou várias opções independentes.",
    logic: "Cada opção deve continuar válida mesmo quando as demais não são selecionadas.",
    structure: "Caixa, indicador de seleção, rótulo clicável e apoio opcional.",
    whenToUse: "Para escolhas múltiplas, consentimento ou confirmação explícita.",
    whenNotToUse: "Para uma única escolha mutuamente exclusiva ou efeito instantâneo.",
    tradeOffs: "Listas longas sem agrupamento elevam custo de leitura e comparação.",
    accessibility: "Associe label e input, suporte indeterminate e preserve foco de teclado.",
    ragRelation: "Oferece evidência sobre seleção múltipla e consentimento em respostas da Beatrice.",
    insight: "Checkbox representa inclusão independente, não mudança de modo.",
    states: ["Unchecked", "Checked", "Indeterminate", "Focus", "Disabled"],
    intents: ["Selection", "Consent", "Bulk"],
    snippet: `<Checkbox checked={accepted} onCheckedChange={setAccepted}>\n  Aceito os termos\n</Checkbox>`,
    icon: SquareCheckBig,
    en: {
      description: "Allows zero, one, or several independent options to be selected.",
      logic: "Each option must remain valid when the others are not selected.",
      whenToUse: "Use for multiple choices, consent, or explicit confirmation.",
      whenNotToUse: "Avoid for mutually exclusive choices or immediate settings.",
      accessibility: "Associate label and input, support indeterminate, and preserve keyboard focus.",
      ragRelation: "Provides Beatrice with evidence about multiple selection and consent patterns.",
      insight: "A checkbox represents independent inclusion, not a mode change.",
    },
  },
  {
    id: "radio-button",
    section: "actions",
    title: "Radio Button",
    status: "Stable",
    description: "Seleciona exatamente uma opção visível dentro de um conjunto relacionado.",
    logic: "Expor todas as opções reduz memória de trabalho e facilita comparação direta.",
    structure: "Grupo nomeado, círculos de seleção e rótulos completos.",
    whenToUse: "Para duas a cinco opções mutuamente exclusivas que devem ser comparadas.",
    whenNotToUse: "Para múltipla seleção ou listas extensas que cabem melhor em Select.",
    tradeOffs: "Muitas opções ocupam espaço e tornam o grupo difícil de escanear.",
    accessibility: "Use fieldset e legend, navegação por setas e estado checked programático.",
    ragRelation: "Ajuda a Beatrice a distinguir escolha exclusiva de seleção múltipla.",
    insight: "Se as alternativas precisam ser comparadas, mantenha-as visíveis.",
    states: ["Unchecked", "Checked", "Focus", "Disabled", "Error"],
    intents: ["Single choice", "Plan", "Preference"],
    snippet: `<RadioGroup value={plan} onValueChange={setPlan}>\n  <Radio value="team">Equipe</Radio>\n</RadioGroup>`,
    icon: CircleDot,
    en: {
      description: "Selects exactly one visible option within a related set.",
      logic: "Showing every option lowers memory load and supports direct comparison.",
      whenToUse: "Use for two to five mutually exclusive options that need comparison.",
      whenNotToUse: "Avoid for multiple selection or long lists better served by Select.",
      accessibility: "Use fieldset and legend, arrow-key navigation, and programmatic checked state.",
      ragRelation: "Helps Beatrice distinguish exclusive choice from multiple selection.",
      insight: "When alternatives need comparison, keep them visible.",
    },
  },
  {
    id: "selectable-chip",
    section: "actions",
    title: "Selectable Chip / Badge",
    status: "Stable",
    description: "Representa filtros ou atributos compactos que podem ser ativados individualmente.",
    logic: "Chips funcionam melhor com rótulos curtos, conjunto pequeno e estado selecionado evidente.",
    structure: "Pílula compacta com rótulo, ícone opcional e indicador de seleção.",
    whenToUse: "Para filtros rápidos, tags selecionáveis e refinamento contextual.",
    whenNotToUse: "Para ações primárias, conteúdo longo ou dezenas de opções.",
    tradeOffs: "Muitos chips criam ruído e quebram a hierarquia da página.",
    accessibility: "Use button com aria-pressed e não comunique seleção apenas por preenchimento.",
    ragRelation: "Documenta filtros compactos que a Beatrice pode sugerir em superfícies densas.",
    insight: "Chip é uma escolha compacta; badge passivo não deve parecer clicável.",
    states: ["Default", "Selected", "Hover", "Focus", "Disabled"],
    intents: ["Filter", "Tag", "Attribute"],
    snippet: `<Chip selected={active} onSelectedChange={setActive}>\n  Acessibilidade\n</Chip>`,
    icon: Tags,
    en: {
      description: "Represents compact filters or attributes that can be activated independently.",
      logic: "Chips work best with short labels, a small set, and an obvious selected state.",
      whenToUse: "Use for quick filters, selectable tags, and contextual refinement.",
      whenNotToUse: "Avoid for primary actions, long content, or dozens of options.",
      accessibility: "Use a button with aria-pressed and do not rely on fill alone.",
      ragRelation: "Documents compact filters Beatrice can recommend for dense surfaces.",
      insight: "A chip is a compact choice; a passive badge should not look clickable.",
    },
  },
  {
    id: "text-input",
    section: "forms",
    title: "Input / Text Input",
    status: "Stable",
    description: "Captura uma linha curta de texto, busca ou valor identificável.",
    logic: "O rótulo define o dado esperado; placeholder oferece exemplo, nunca substitui instrução.",
    structure: "Label, controle, apoio, indicador opcional e mensagem de erro.",
    whenToUse: "Para nomes, e-mail, busca e valores curtos em uma linha.",
    whenNotToUse: "Para narrativas longas, escolhas fechadas ou conteúdo somente leitura.",
    tradeOffs: "Validação tardia pode obrigar o usuário a reconstruir todo o contexto.",
    accessibility: "Mantenha label persistente, autocomplete correto, erro associado e foco visível.",
    ragRelation: "Fornece à Beatrice regras de entrada textual e validação contextual.",
    insight: "O campo deve explicar o formato antes de apontar o erro.",
    states: ["Empty", "Filled", "Focus", "Error", "Disabled"],
    intents: ["Text", "Search", "Email"],
    snippet: `<TextInput label="Nome do projeto" value={name} onChange={setName} />`,
    icon: TextCursorInput,
    en: {
      description: "Captures a short line of text, search query, or identifiable value.",
      logic: "The label defines the expected data; placeholder is an example, never the instruction.",
      whenToUse: "Use for names, email, search, and short single-line values.",
      whenNotToUse: "Avoid for long narratives, closed choices, or read-only content.",
      accessibility: "Keep a persistent label, correct autocomplete, associated error, and visible focus.",
      ragRelation: "Gives Beatrice rules for text entry and contextual validation.",
      insight: "Explain the expected format before pointing out the error.",
    },
  },
  {
    id: "text-area",
    section: "forms",
    title: "Text Area",
    status: "Stable",
    description: "Captura texto livre de várias linhas com espaço para contexto e revisão.",
    logic: "A altura inicial comunica a profundidade esperada da resposta.",
    structure: "Label, área redimensionável, apoio e contador opcional.",
    whenToUse: "Para descrições, justificativas, comentários e prompts extensos.",
    whenNotToUse: "Para valores curtos, conteúdo estruturado ou seleção de opções.",
    tradeOffs: "Campos muito altos dominam a página; campos baixos escondem a expectativa.",
    accessibility: "Associe label, descreva limites e anuncie contagem apenas quando relevante.",
    ragRelation: "Ajuda a Beatrice a orientar captura de contexto sem confundir com chat.",
    insight: "O tamanho inicial do campo é parte da instrução.",
    states: ["Empty", "Filled", "Focus", "Error", "Disabled"],
    intents: ["Description", "Prompt", "Comment"],
    snippet: `<TextArea label="Contexto da decisão" rows={5} value={context} />`,
    icon: AlignLeft,
    en: {
      description: "Captures multi-line free text with room for context and review.",
      logic: "The initial height communicates the expected depth of the answer.",
      whenToUse: "Use for descriptions, rationale, comments, and longer prompts.",
      whenNotToUse: "Avoid for short values, structured content, or option selection.",
      accessibility: "Associate a label, describe limits, and announce counts only when useful.",
      ragRelation: "Helps Beatrice guide contextual input without confusing it with chat.",
      insight: "The field's initial size is part of its instruction.",
    },
  },
  {
    id: "select-dropdown",
    section: "forms",
    title: "Select/Dropdown",
    status: "Stable",
    description: "Escolhe uma opção de uma lista compacta sem manter todas visíveis.",
    logic: "Economiza espaço, mas transfere a comparação para um painel temporário.",
    structure: "Label, trigger, valor atual, lista e indicadores de seleção.",
    whenToUse: "Para listas médias ou longas com escolha única e opções familiares.",
    whenNotToUse: "Para duas opções simples ou alternativas que precisam ser comparadas lado a lado.",
    tradeOffs: "Esconder opções reduz descoberta e torna comparação mais lenta.",
    accessibility: "Suporte teclado, typeahead, estado expanded e relação entre trigger e lista.",
    ragRelation: "Permite recomendações calibradas entre Select e Radio Button.",
    insight: "Use Select para escala, não para esconder decisões importantes.",
    states: ["Closed", "Open", "Selected", "Error", "Disabled"],
    intents: ["Single choice", "Filter", "Configuration"],
    snippet: `<Select label="Perspectiva" value={lens} onValueChange={setLens} />`,
    icon: ListFilter,
    en: {
      description: "Chooses one option from a compact list without keeping every option visible.",
      logic: "It saves space but moves comparison into a temporary panel.",
      whenToUse: "Use for medium or long single-choice lists with familiar options.",
      whenNotToUse: "Avoid for two simple options or choices that need side-by-side comparison.",
      accessibility: "Support keyboard, typeahead, expanded state, and trigger-list relationships.",
      ragRelation: "Enables calibrated recommendations between Select and Radio Button.",
      insight: "Use Select for scale, not to hide important decisions.",
    },
  },
  {
    id: "date-picker",
    section: "forms",
    title: "Date Picker",
    status: "Stable",
    description: "Permite inserir ou selecionar datas com formato e limites previsíveis.",
    logic: "Entrada digitável acelera especialistas; calendário apoia descoberta e contexto.",
    structure: "Campo formatado, botão de calendário, grade mensal e navegação temporal.",
    whenToUse: "Para prazos, agendamentos e intervalos em que o calendário agrega contexto.",
    whenNotToUse: "Para datas muito distantes, aproximadas ou melhor escolhidas por texto.",
    tradeOffs: "Calendários complexos penalizam teclado e telas pequenas sem uma entrada direta.",
    accessibility: "Ofereça digitação, rótulos completos, navegação por teclado e formato anunciado.",
    ragRelation: "Dá à Beatrice evidência sobre escolha temporal e restrições de intervalo.",
    insight: "Calendário e texto devem ser caminhos complementares.",
    states: ["Empty", "Selected", "Open", "Invalid", "Disabled"],
    intents: ["Single date", "Range", "Deadline"],
    snippet: `<DatePicker label="Data da revisão" value={date} min={today} />`,
    icon: CalendarDays,
    en: {
      description: "Allows dates to be typed or selected with predictable format and limits.",
      logic: "Typing helps experts; the calendar supports discovery and temporal context.",
      whenToUse: "Use for deadlines, scheduling, and ranges where a calendar adds context.",
      whenNotToUse: "Avoid for distant or approximate dates better entered as text.",
      accessibility: "Offer typing, complete labels, keyboard navigation, and an announced format.",
      ragRelation: "Gives Beatrice evidence about temporal selection and range constraints.",
      insight: "Calendar and text entry should be complementary paths.",
    },
  },
  {
    id: "form-field",
    section: "forms",
    title: "Form Field",
    status: "Stable",
    description: "Orquestra label, controle, ajuda, validação e mensagem em um contrato único.",
    logic: "Centralizar o contrato evita que cada formulário reconstrua acessibilidade e espaçamento.",
    structure: "Label, controle filho, texto de apoio, erro e indicador de obrigatoriedade.",
    whenToUse: "Ao compor qualquer controle que precise de orientação e validação consistentes.",
    whenNotToUse: "Para conteúdo somente leitura ou controles sem relação com formulário.",
    tradeOffs: "Abstração rígida pode limitar layouts especiais; preserve slots claros.",
    accessibility: "Gere ids estáveis e conecte label, hint e erro com aria-describedby.",
    ragRelation: "Funciona como evidência estrutural para a Beatrice montar formulários coerentes.",
    insight: "A validação pertence ao campo como conjunto, não apenas ao input.",
    states: ["Default", "Required", "Valid", "Error", "Disabled"],
    intents: ["Data entry", "Validation", "Guidance"],
    snippet: `<FormField label="E-mail" error={error} hint="Usaremos apenas para contato.">\n  <TextInput type="email" />\n</FormField>`,
    icon: FormInput,
    en: {
      description: "Orchestrates label, control, help, validation, and message as one contract.",
      logic: "A shared contract prevents every form from rebuilding accessibility and spacing.",
      whenToUse: "Use around controls that need consistent guidance and validation.",
      whenNotToUse: "Avoid for read-only content or controls unrelated to forms.",
      accessibility: "Generate stable ids and connect label, hint, and error with aria-describedby.",
      ragRelation: "Acts as structural evidence for Beatrice when composing coherent forms.",
      insight: "Validation belongs to the field as a whole, not only to the input.",
    },
  },
  {
    id: "link",
    section: "structure",
    title: "Link",
    status: "Stable",
    description: "Leva o usuário a outro destino ou recurso sem simular uma ação local.",
    logic: "Destino é navegação; mudança no estado atual é ação e deve usar Button.",
    structure: "Texto descritivo, indicador opcional de destino externo e foco visível.",
    whenToUse: "Para navegar entre páginas, âncoras, documentos e recursos externos.",
    whenNotToUse: "Para enviar formulários, abrir estados locais ou executar comandos.",
    tradeOffs: "Links genéricos como 'saiba mais' perdem contexto fora do parágrafo.",
    accessibility: "Use texto que descreva o destino e informe nova janela ou download.",
    ragRelation: "Ajuda a Beatrice a separar navegação semântica de comandos de interface.",
    insight: "O rótulo do link deve continuar fazendo sentido isoladamente.",
    states: ["Default", "Hover", "Focus", "Visited", "Disabled"],
    intents: ["Navigation", "External", "Download"],
    snippet: `<Link to="/components">Explorar componentes</Link>`,
    icon: Link2,
    en: {
      description: "Moves the user to another destination or resource without imitating a local action.",
      logic: "A destination is navigation; changing local state is an action and needs a Button.",
      whenToUse: "Use for pages, anchors, documents, and external resources.",
      whenNotToUse: "Avoid for form submission, local state, or commands.",
      accessibility: "Use destination-specific text and announce new windows or downloads.",
      ragRelation: "Helps Beatrice separate semantic navigation from interface commands.",
      insight: "The link label should remain meaningful out of context.",
    },
  },
  {
    id: "tabs",
    section: "structure",
    title: "Tabs",
    status: "Stable",
    description: "Alterna entre painéis relacionados dentro do mesmo contexto.",
    logic: "Cada aba representa uma visão irmã, não uma etapa sequencial.",
    structure: "Tablist, tabs, indicador ativo e painéis associados.",
    whenToUse: "Para duas a seis categorias pares que compartilham a mesma página.",
    whenNotToUse: "Para navegação global, fluxos passo a passo ou conteúdo que precisa ser comparado.",
    tradeOffs: "Muitas abas escondem conteúdo e prejudicam responsividade.",
    accessibility: "Implemente roles tablist, tab e tabpanel com setas e aria-selected.",
    ragRelation: "Permite que a Beatrice recomende estrutura local sem promover tabs a navegação global.",
    insight: "Abas trocam perspectiva; etapas avançam processo.",
    states: ["Default", "Active", "Hover", "Focus", "Disabled"],
    intents: ["Section", "View", "Mode"],
    snippet: `<Tabs value={tab} onValueChange={setTab}>\n  <Tab value="preview">Preview</Tab>\n  <TabPanel value="preview" />\n</Tabs>`,
    icon: PanelTop,
    en: {
      description: "Switches between related panels within the same context.",
      logic: "Each tab is a sibling view, not a sequential step.",
      whenToUse: "Use for two to six peer categories sharing one page.",
      whenNotToUse: "Avoid for global navigation, step flows, or content requiring comparison.",
      accessibility: "Implement tablist, tab, and tabpanel roles with arrows and aria-selected.",
      ragRelation: "Lets Beatrice recommend local structure without promoting tabs to global navigation.",
      insight: "Tabs change perspective; steps advance a process.",
    },
  },
  {
    id: "card",
    section: "structure",
    title: "Card",
    status: "Stable",
    description: "Agrupa conteúdo e ações que pertencem à mesma entidade ou decisão.",
    logic: "A borda visual deve refletir uma fronteira semântica real.",
    structure: "Container, título, metadados, corpo e ações opcionais.",
    whenToUse: "Para resumir entidades repetíveis, escolhas ou blocos independentes.",
    whenNotToUse: "Para envolver toda seção indiscriminadamente ou criar cartões dentro de cartões.",
    tradeOffs: "Card excessivo fragmenta a leitura e cria falsa prioridade.",
    accessibility: "Preserve ordem de heading e não torne toda a área clicável sem nome claro.",
    ragRelation: "Ajuda a Beatrice a recomendar agrupamento baseado em entidade e não decoração.",
    insight: "Um card deve responder: o que pertence junto aqui?",
    states: ["Default", "Hover", "Selected", "Loading", "Disabled"],
    intents: ["Entity", "Summary", "Choice"],
    snippet: `<Card selected={selected}>\n  <CardTitle>Confidence Badge</CardTitle>\n  <CardBody>...</CardBody>\n</Card>`,
    icon: CreditCard,
    en: {
      description: "Groups content and actions belonging to the same entity or decision.",
      logic: "The visual boundary should represent a real semantic boundary.",
      whenToUse: "Use for repeatable entities, choices, or independent summaries.",
      whenNotToUse: "Avoid wrapping every section or nesting cards inside cards.",
      accessibility: "Preserve heading order and avoid unnamed fully clickable regions.",
      ragRelation: "Helps Beatrice recommend entity-based grouping rather than decoration.",
      insight: "A card should answer: what belongs together here?",
    },
  },
  {
    id: "modal-dialog",
    section: "structure",
    title: "Modal/Dialog",
    status: "Stable",
    description: "Interrompe o contexto atual para uma decisão curta que exige foco.",
    logic: "A interrupção só se justifica quando concluir ou cancelar é necessário antes de continuar.",
    structure: "Backdrop, dialog nomeado, conteúdo, ação primária, cancelamento e fechar.",
    whenToUse: "Para confirmação crítica, edição curta ou decisão bloqueante.",
    whenNotToUse: "Para conteúdo longo, navegação, tarefas complexas ou informação não urgente.",
    tradeOffs: "Interrupções frequentes destroem fluxo e acumulam problemas de foco.",
    accessibility: "Prenda o foco, feche com Escape, restaure foco e use aria-modal.",
    ragRelation: "Dá à Beatrice critérios explícitos para evitar modais em tarefas inadequadas.",
    insight: "Modal é custo cognitivo deliberado, não atalho de layout.",
    states: ["Closed", "Open", "Submitting", "Error", "Disabled"],
    intents: ["Confirm", "Edit", "Critical decision"],
    snippet: `<Dialog open={open} onOpenChange={setOpen}>\n  <DialogTitle>Confirmar exclusão</DialogTitle>\n  <DialogActions />\n</Dialog>`,
    icon: PanelsTopLeft,
    en: {
      description: "Interrupts the current context for a short decision that requires focus.",
      logic: "Interruption is justified only when completion or cancellation is required to continue.",
      whenToUse: "Use for critical confirmation, short editing, or blocking decisions.",
      whenNotToUse: "Avoid for long content, navigation, complex tasks, or non-urgent information.",
      accessibility: "Trap focus, close with Escape, restore focus, and use aria-modal.",
      ragRelation: "Gives Beatrice explicit criteria for avoiding dialogs in unsuitable tasks.",
      insight: "A modal is a deliberate cognitive cost, not a layout shortcut.",
    },
  },
  {
    id: "data-table",
    section: "structure",
    title: "Table/Data Table",
    status: "Stable",
    description: "Apresenta dados comparáveis em linhas e colunas com relações explícitas.",
    logic: "Tabela é ideal quando cruzar valores por cabeçalho é a tarefa principal.",
    structure: "Caption, cabeçalhos, corpo, ordenação e ações de linha opcionais.",
    whenToUse: "Para conjuntos estruturados que exigem comparação, varredura ou ordenação.",
    whenNotToUse: "Para narrativas, poucos pares de dados ou layouts móveis sem prioridade definida.",
    tradeOffs: "Densidade alta melhora comparação, mas exige hierarquia e responsividade cuidadosas.",
    accessibility: "Use table semântica, caption, scope, estado de ordenação e nomes de ações.",
    ragRelation: "Permite que a Beatrice recomende visualização tabular com critérios de densidade.",
    insight: "Se a relação entre coluna e linha importa, preserve a semântica de tabela.",
    states: ["Default", "Sorted", "Selected row", "Empty", "Loading"],
    intents: ["Compare", "Inspect", "Manage"],
    snippet: `<DataTable caption="Fontes recuperadas" columns={columns} rows={sources} />`,
    icon: Table2,
    en: {
      description: "Presents comparable data in rows and columns with explicit relationships.",
      logic: "A table is ideal when crossing values by headers is the primary task.",
      whenToUse: "Use for structured sets requiring comparison, scanning, or sorting.",
      whenNotToUse: "Avoid for narratives, a few data pairs, or unprioritized mobile layouts.",
      accessibility: "Use semantic table markup, caption, scope, sort state, and named actions.",
      ragRelation: "Lets Beatrice recommend tabular views using explicit density criteria.",
      insight: "When row-column relationships matter, preserve table semantics.",
    },
  },
  {
    id: "alert",
    section: "feedback",
    title: "Alert",
    status: "Stable",
    description: "Comunica um estado persistente que precisa permanecer no contexto.",
    logic: "A severidade deve refletir consequência real, não preferência visual.",
    structure: "Ícone semântico, título, mensagem e ação ou dismiss opcional.",
    whenToUse: "Para erro, aviso ou informação importante que deve continuar visível.",
    whenNotToUse: "Para confirmações transitórias ou mensagens sem impacto na tarefa.",
    tradeOffs: "Alertas demais causam cegueira e reduzem o valor da hierarquia semântica.",
    accessibility: "Use role alert apenas para urgência; associe texto e não dependa de cor.",
    ragRelation: "Ajuda a Beatrice a calibrar severidade e persistência de feedback.",
    insight: "A interrupção visual deve ser proporcional ao custo de ignorar a mensagem.",
    states: ["Info", "Success", "Warning", "Error", "Dismissed"],
    intents: ["Inform", "Warn", "Block"],
    snippet: `<Alert intent="warning" title="Fonte incompleta">\n  Revise a evidência antes de decidir.\n</Alert>`,
    icon: TriangleAlert,
    en: {
      description: "Communicates a persistent state that must remain in context.",
      logic: "Severity should reflect real consequence, not a visual preference.",
      whenToUse: "Use for errors, warnings, or important information that must stay visible.",
      whenNotToUse: "Avoid for transient confirmations or low-impact messages.",
      accessibility: "Use alert role only for urgency; provide text and more than color.",
      ragRelation: "Helps Beatrice calibrate feedback severity and persistence.",
      insight: "Visual interruption should match the cost of ignoring the message.",
    },
  },
  {
    id: "toast",
    section: "feedback",
    title: "Toast/Notification",
    status: "Stable",
    description: "Confirma uma mudança recente sem bloquear o fluxo principal.",
    logic: "A mensagem deve ser curta, autossuficiente e dispensável após poucos segundos.",
    structure: "Container flutuante, mensagem, ícone e ação curta opcional.",
    whenToUse: "Para confirmar salvar, copiar, sincronizar ou concluir uma ação.",
    whenNotToUse: "Para erros que exigem correção, conteúdo longo ou decisões obrigatórias.",
    tradeOffs: "Auto-dismiss pode ocultar informação antes da leitura, especialmente com ações.",
    accessibility: "Use live region apropriada, tempo suficiente e pausa para conteúdo acionável.",
    ragRelation: "Permite que a Beatrice escolha feedback transitório apenas quando seguro.",
    insight: "Se a pessoa precisa agir, provavelmente não é um toast.",
    states: ["Entering", "Visible", "Actionable", "Leaving", "Paused"],
    intents: ["Success", "Info", "Undo"],
    snippet: `<Toast intent="success" duration={5000}>\n  Snippet copiado\n</Toast>`,
    icon: Bell,
    en: {
      description: "Confirms a recent change without blocking the primary flow.",
      logic: "The message should be short, self-contained, and disposable after a few seconds.",
      whenToUse: "Use to confirm save, copy, sync, or completion.",
      whenNotToUse: "Avoid for errors needing correction, long content, or required decisions.",
      accessibility: "Use the proper live region, enough time, and pause for actionable content.",
      ragRelation: "Lets Beatrice choose transient feedback only when it is safe.",
      insight: "When the user must act, it is probably not a toast.",
    },
  },
  {
    id: "skeleton-loader",
    section: "feedback",
    title: "Skeleton Loader",
    status: "Stable",
    description: "Reserva a geometria do conteúdo enquanto dados assíncronos carregam.",
    logic: "Imitar a forma final reduz mudança de layout e melhora percepção de velocidade.",
    structure: "Blocos neutros com dimensões próximas do conteúdo final e animação moderada.",
    whenToUse: "Para painéis e listas assíncronas com estrutura previsível.",
    whenNotToUse: "Para operações instantâneas, duração indeterminada ou geometria desconhecida.",
    tradeOffs: "Skeleton incorreto cria expectativa falsa e pode aumentar instabilidade percebida.",
    accessibility: "Marque região como busy, esconda decoração e respeite reduced motion.",
    ragRelation: "Dá à Beatrice critérios para feedback de carregamento sem sugerir spinner genérico.",
    insight: "O skeleton deve prometer a mesma forma que o conteúdo entregará.",
    states: ["Loading", "Reduced motion", "Loaded", "Error"],
    intents: ["Card", "List", "Table"],
    snippet: `<Skeleton aria-label="Carregando fontes" variant="list" rows={3} />`,
    icon: LoaderCircle,
    en: {
      description: "Reserves content geometry while asynchronous data loads.",
      logic: "Matching the final shape reduces layout shift and improves perceived speed.",
      whenToUse: "Use for asynchronous panels and lists with predictable structure.",
      whenNotToUse: "Avoid for instant operations, unknown duration, or unknown geometry.",
      accessibility: "Mark the region busy, hide decoration, and respect reduced motion.",
      ragRelation: "Gives Beatrice loading-feedback criteria beyond a generic spinner.",
      insight: "The skeleton should promise the same shape the content will deliver.",
    },
  },
  {
    id: "explanation-tooltip",
    section: "feedback",
    title: "Explanation Bubble / Tooltip",
    status: "Stable",
    description: "Explica um termo ou controle de forma breve e contextual.",
    logic: "A explicação complementa o conteúdo visível; informação essencial não pode depender dela.",
    structure: "Trigger nomeado, bolha curta, seta opcional e posicionamento adaptativo.",
    whenToUse: "Para definições curtas, atalhos e esclarecimento de ícones.",
    whenNotToUse: "Para instruções essenciais, conteúdo interativo complexo ou textos longos.",
    tradeOffs: "Hover exclusivo falha em toque, teclado e tecnologias assistivas.",
    accessibility: "Abra por hover e foco, conecte com aria-describedby e permita dismiss.",
    ragRelation: "É uma superfície XAI para explicar termos de confiança e raciocínio sem sobrecarregar.",
    insight: "Tooltip esclarece; não deve esconder a instrução necessária.",
    states: ["Closed", "Hover", "Focus", "Open", "Dismissed"],
    intents: ["Definition", "Shortcut", "Explanation"],
    snippet: `<Tooltip content="Confiança calibrada pelas fontes recuperadas.">\n  <InfoIcon aria-label="Sobre confiança" />\n</Tooltip>`,
    icon: MessageCircleQuestion,
    en: {
      description: "Briefly explains a term or control in context.",
      logic: "The explanation supplements visible content; essential information cannot depend on it.",
      whenToUse: "Use for short definitions, shortcuts, and icon clarification.",
      whenNotToUse: "Avoid for essential instructions, complex interaction, or long text.",
      accessibility: "Open on hover and focus, connect aria-describedby, and allow dismissal.",
      ragRelation: "Acts as an XAI surface for confidence and reasoning terms without overload.",
      insight: "A tooltip clarifies; it must not hide required instruction.",
    },
  },
  {
    id: "confidence-badge",
    section: "feedback",
    title: "Confidence Badge",
    status: "Stable",
    description: "Expressa confiança calibrada com valor, faixa e linguagem de incerteza.",
    logic: "Confiança deriva da qualidade da evidência, não do tom assertivo da resposta.",
    structure: "Percentual ou faixa, rótulo semântico e acesso à explicação da calibração.",
    whenToUse: "Ao apresentar recomendações de IA sustentadas por evidência recuperada.",
    whenNotToUse: "Quando não existe método de calibração ou o número sugere precisão falsa.",
    tradeOffs: "Percentual isolado pode ser interpretado como probabilidade objetiva de verdade.",
    accessibility: "Inclua texto equivalente, contraste e explicação acessível da escala.",
    ragRelation: "Conecta diretamente similaridade de recuperação, confiança percebida e XAI.",
    insight: "Confiança útil explica tanto força quanto limite da evidência.",
    states: ["Low", "Medium", "High", "Unavailable", "Inspecting"],
    intents: ["Calibrate", "Warn", "Support trust"],
    snippet: `<ConfidenceBadge value={86} basis="retrieval-similarity" showExplanation />`,
    icon: Gauge,
    en: {
      description: "Expresses calibrated confidence with value, tier, and uncertainty language.",
      logic: "Confidence comes from evidence quality, not an assertive tone.",
      whenToUse: "Use for AI recommendations supported by retrieved evidence.",
      whenNotToUse: "Avoid without a calibration method or when a number implies false precision.",
      accessibility: "Include equivalent text, contrast, and an accessible scale explanation.",
      ragRelation: "Directly connects retrieval similarity, perceived confidence, and XAI.",
      insight: "Useful confidence explains both evidence strength and its limits.",
    },
  },
  {
    id: "command-palette",
    section: "intelligence",
    title: "Command Palette / Barra de Comandos",
    status: "Stable",
    description: "Centraliza busca e execução rápida de destinos, componentes e ações.",
    logic: "A consulta reduz o espaço de opções e combina descoberta com produtividade.",
    structure: "Dialog, input de busca, grupos, resultados, atalhos e estado vazio.",
    whenToUse: "Em produtos densos com muitas ações recorrentes ou conteúdo pesquisável.",
    whenNotToUse: "Como substituto da navegação principal ou para poucas ações óbvias.",
    tradeOffs: "Descoberta depende de nomes, sinônimos e ranking coerentes.",
    accessibility: "Implemente combobox, active descendant, teclado completo e instruções de atalho.",
    ragRelation: "É uma porta direta para recuperação do corpus e descoberta orientada pela Beatrice.",
    insight: "A paleta acelera quem sabe o que busca e ensina quem ainda explora.",
    states: ["Closed", "Searching", "Results", "Empty", "Executing"],
    intents: ["Navigate", "Search", "Execute"],
    snippet: `<CommandPalette open={open} sources={componentCorpus} onSelect={runCommand} />`,
    icon: Command,
    en: {
      description: "Centralizes fast search and execution across destinations, components, and actions.",
      logic: "The query narrows choices and combines discovery with productivity.",
      whenToUse: "Use in dense products with recurring actions or searchable content.",
      whenNotToUse: "Avoid as a replacement for primary navigation or for a few obvious actions.",
      accessibility: "Implement combobox, active descendant, full keyboard use, and shortcut guidance.",
      ragRelation: "Acts as a direct doorway to corpus retrieval and Beatrice-guided discovery.",
      insight: "A palette speeds up experts while teaching people who are still exploring.",
    },
  },
  {
    id: "source-attribution",
    section: "intelligence",
    title: "Source Attribution",
    status: "Stable",
    description: "Liga uma afirmação da Beatrice à evidência recuperada que a sustenta.",
    logic: "Rastreabilidade transforma resposta fluente em conhecimento verificável.",
    structure: "Fonte, trecho, relevância, metadados e ação para inspecionar contexto.",
    whenToUse: "Em respostas RAG, recomendações e decisões que exigem verificação.",
    whenNotToUse: "Para decorar conteúdo sem origem ou atribuir uma fonte que não sustenta a afirmação.",
    tradeOffs: "Exibir todas as fontes de uma vez aumenta densidade; use disclosure progressivo.",
    accessibility: "Dê nomes descritivos, mantenha ordem de leitura e anuncie expansão.",
    ragRelation: "É o vínculo operacional entre chunk recuperado, afirmação e auditabilidade.",
    insight: "Fonte não é rodapé; é parte da resposta.",
    states: ["Collapsed", "Expanded", "High match", "Partial match", "Unavailable"],
    intents: ["Trace", "Verify", "Inspect"],
    snippet: `<SourceAttribution source={chunk.source} score={chunk.similarity} excerpt={chunk.text} />`,
    icon: BookOpenCheck,
    en: {
      description: "Connects a Beatrice claim to the retrieved evidence that supports it.",
      logic: "Traceability turns a fluent answer into verifiable knowledge.",
      whenToUse: "Use in RAG answers, recommendations, and decisions requiring verification.",
      whenNotToUse: "Avoid decorative citations or sources that do not support the claim.",
      accessibility: "Provide descriptive names, preserve reading order, and announce expansion.",
      ragRelation: "It is the operational link between retrieved chunk, claim, and auditability.",
      insight: "A source is not a footnote; it is part of the answer.",
    },
  },
  {
    id: "audit-panel",
    section: "intelligence",
    title: "Audit Panel",
    status: "Stable",
    description: "Expõe etapas, fontes, políticas e calibração que produziram uma decisão.",
    logic: "Detalhes de processo ficam disponíveis sob demanda sem competir com a resposta principal.",
    structure: "Linha do tempo, eventos, entradas, saídas, status e artefatos exportáveis.",
    whenToUse: "Para governança, revisão de decisões e investigação de comportamento da IA.",
    whenNotToUse: "Como painel aberto por padrão para toda interação simples.",
    tradeOffs: "Detalhe técnico excessivo pode confundir usuários sem contexto operacional.",
    accessibility: "Use headings, listas ordenadas, estados textuais e foco previsível ao expandir.",
    ragRelation: "Consolida retrieval, ranking, síntese e confiança em uma trilha auditável.",
    insight: "Auditabilidade deve estar disponível, não necessariamente ocupar o primeiro plano.",
    states: ["Collapsed", "Expanded", "Running", "Complete", "Conflict"],
    intents: ["Audit", "Govern", "Debug"],
    snippet: `<AuditPanel trace={decisionTrace} defaultOpen={false} exportable />`,
    icon: ListChecks,
    en: {
      description: "Exposes the stages, sources, policies, and calibration behind a decision.",
      logic: "Process detail stays available on demand without competing with the main answer.",
      whenToUse: "Use for governance, decision review, and AI behavior investigation.",
      whenNotToUse: "Avoid leaving it open by default for every simple interaction.",
      accessibility: "Use headings, ordered lists, textual states, and predictable expansion focus.",
      ragRelation: "Combines retrieval, ranking, synthesis, and confidence into an auditable trail.",
      insight: "Auditability should be available without always occupying the foreground.",
    },
  },
  {
    id: "typography",
    section: "intelligence",
    title: "Typography",
    status: "Stable",
    description: "Define hierarquia, ritmo e legibilidade para conteúdo operacional e explicações.",
    logic: "Escala e peso devem refletir a prioridade epistemológica do conteúdo.",
    structure: "Tokens de display, heading, body, label e code com regras de uso.",
    whenToUse: "Em toda superfície para organizar leitura, metadados, código e evidência.",
    whenNotToUse: "Para criar hierarquia apenas por tamanho sem relação com semântica.",
    tradeOffs: "Muitas variações enfraquecem consistência e tornam a leitura imprevisível.",
    accessibility: "Preserve tamanho legível, line-height, zoom, contraste e hierarquia de headings.",
    ragRelation: "Ajuda a Beatrice a documentar clareza visual como parte da explicabilidade.",
    insight: "Tipografia torna a ordem do raciocínio visível.",
    states: ["Display", "Heading", "Body", "Label", "Code"],
    intents: ["Hierarchy", "Reading", "Metadata"],
    snippet: `<Text as="h2" token="heading-lg">Evidência recuperada</Text>`,
    icon: Type,
    en: {
      description: "Defines hierarchy, rhythm, and legibility for operational content and explanations.",
      logic: "Scale and weight should reflect the epistemic priority of content.",
      whenToUse: "Use across every surface to organize reading, metadata, code, and evidence.",
      whenNotToUse: "Avoid hierarchy based on size without semantic meaning.",
      accessibility: "Preserve readable size, line height, zoom, contrast, and heading hierarchy.",
      ragRelation: "Helps Beatrice document visual clarity as part of explainability.",
      insight: "Typography makes the order of reasoning visible.",
    },
  },
  {
    id: "icon",
    section: "intelligence",
    title: "Icon",
    status: "Stable",
    description: "Reforça significado, estado ou ação com uma forma visual consistente.",
    logic: "Ícones apoiam reconhecimento, mas rótulos sustentam compreensão.",
    structure: "Glyph vetorial, tamanho por token, stroke consistente e label quando necessário.",
    whenToUse: "Para reforçar ações conhecidas, categorias e estados semânticos.",
    whenNotToUse: "Como única explicação de conceitos abstratos ou ícones ambíguos.",
    tradeOffs: "Bibliotecas extensas geram sinônimos visuais e escolhas inconsistentes.",
    accessibility: "Oculte ícones decorativos; nomeie os interativos e mantenha alvo adequado.",
    ragRelation: "Fornece vocabulário visual consistente para respostas e artefatos da Beatrice.",
    insight: "Consistência do símbolo vale mais que originalidade isolada.",
    states: ["Decorative", "Labeled", "Interactive", "Active", "Disabled"],
    intents: ["Action", "Status", "Category"],
    snippet: `<Icon icon={ShieldCheck} label="Fonte verificada" size="md" />`,
    icon: Shapes,
    en: {
      description: "Reinforces meaning, state, or action with a consistent visual form.",
      logic: "Icons support recognition, while labels support understanding.",
      whenToUse: "Use to reinforce familiar actions, categories, and semantic states.",
      whenNotToUse: "Avoid as the only explanation for abstract or ambiguous concepts.",
      accessibility: "Hide decorative icons; name interactive ones and preserve target size.",
      ragRelation: "Provides a consistent visual vocabulary for Beatrice responses and artifacts.",
      insight: "Symbol consistency matters more than isolated originality.",
    },
  },
];

function getSections(locale: Locale): SectionMeta[] {
  const en = locale === "en-US";
  const ptPt = locale === "pt-PT";

  return [
    {
      id: "actions",
      title: en ? "Actions and Controls" : ptPt ? "Ações e Controlos" : "Ações e Controles",
      description: en
        ? "Trigger commands, toggle states, and control user choices."
        : "Acionam comandos, alternam estados e controlam escolhas do usuário.",
    },
    {
      id: "forms",
      title: en ? "Inputs and Forms" : "Inputs e Formulários",
      description: en
        ? "Capture, edit, structure, and validate data."
        : "Capturam, editam, estruturam e validam dados.",
    },
    {
      id: "structure",
      title: en ? "Navigation and Structure" : "Navegação e Estrutura",
      description: en
        ? "Organize content, navigation, decisions, and data."
        : "Organizam conteúdo, navegação, decisões e dados.",
    },
    {
      id: "feedback",
      title: en ? "Feedback and States" : "Feedback e Estados",
      description: en
        ? "Communicate system status, loading, explanations, and confidence."
        : "Comunicam status, carregamento, explicações e confiança.",
    },
    {
      id: "intelligence",
      title: en ? "Intelligence, XAI and Auditability" : "Inteligência, XAI e Auditabilidade",
      description: en
        ? "Support retrieval, provenance, governance, and explainability."
        : "Apoiam recuperação, proveniência, governança e explicabilidade.",
    },
  ];
}

function getUi(locale: Locale): WorkbenchUi {
  if (locale === "en-US") {
    return {
      eyebrow: "Interactive design-system documentation",
      title: "Component Workbench",
      description:
        "Twenty-five production components documented as operational evidence for product teams and Beatrice's RAG pipeline.",
      count: "25 primary components",
      corpus: "Curated RAG corpus",
      sectionNav: "Sections",
      componentNav: "Components",
      preview: "Interactive preview",
      usage: "Usage",
      whenToUse: "When to use",
      whenNotToUse: "When to avoid",
      accessibility: "Accessibility",
      ragRelation: "Beatrice / RAG / XAI",
      states: "States",
      intents: "Intents",
      code: "Code snippet",
      copy: "Copy code",
      copied: "Copied",
      libraryMap: "Library map",
      components: "components",
      stable: "Stable",
      doLabel: "Do",
      dontLabel: "Don't",
      snippetEditorLabel: "Edit component code snippet",
    };
  }

  return {
    eyebrow: "Documentação interativa do design system",
    title: "Workbench de Componentes",
    description:
      "Vinte e cinco componentes principais documentados como evidência operacional para equipes de produto e para o pipeline RAG da Beatrice.",
    count: "25 componentes principais",
    corpus: "Corpus RAG curado",
    sectionNav: "Seções",
    componentNav: "Componentes",
    preview: "Preview interativo",
    usage: "Uso",
    whenToUse: "Quando usar",
    whenNotToUse: "Quando evitar",
    accessibility: "Acessibilidade",
    ragRelation: "Beatrice / RAG / XAI",
    states: "States",
    intents: "Intents",
    code: "Code snippet",
    copy: "Copiar código",
    copied: "Copiado",
    libraryMap: "Mapa da biblioteca",
    components: "componentes",
    stable: "Estável",
    doLabel: "Do",
    dontLabel: "Don't",
    snippetEditorLabel: "Editar code snippet do componente",
  };
}

function localizeComponent(item: ComponentDoc, locale: Locale): ComponentDoc {
  if (locale !== "en-US") return item;
  return { ...item, ...item.en };
}

const BUTTON_INTENT_CLASSES: Record<ButtonIntent, string> = {
  primary: "border-primary bg-primary text-on-primary hover:bg-primary-dim",
  secondary:
    "border-primary/20 bg-surface-container-highest text-primary hover:border-primary/40 hover:bg-primary/10",
  positive:
    "border-[var(--aetheris-color-success)] bg-[var(--aetheris-color-success)] text-background hover:brightness-90",
  negative: "border-error bg-error text-on-error hover:bg-error-dim",
};

const BUTTON_HOVER_CLASSES: Record<ButtonIntent, string> = {
  primary: "border-primary bg-primary-dim",
  secondary: "border-primary/40 bg-primary/10 text-primary",
  positive: "border-[var(--aetheris-color-success)] bg-[var(--aetheris-color-success)] brightness-90",
  negative: "border-error-dim bg-error-dim text-on-error",
};

function buttonPreviewClassName(config: ComponentPlaygroundConfig): string {
  const intent = config.intent.toLowerCase() as ButtonIntent;
  const state = config.state.toLowerCase() as ButtonState;
  const base =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-5 py-2.5 text-xs font-bold uppercase tracking-widest outline-none transition-[background-color,border-color,color,box-shadow,transform] duration-[160ms] active:translate-y-px";
  if (state === "disabled") {
    return `${base} cursor-not-allowed border-white/[0.07] bg-white/[0.025] text-on-surface-variant/45`;
  }

  return [
    base,
    BUTTON_INTENT_CLASSES[intent],
    state === "hover" ? BUTTON_HOVER_CLASSES[intent] : "",
    state === "focus"
      ? "border-primary [box-shadow:0_0_0_3px_rgba(222,204,253,0.35)]"
      : "focus-visible:border-primary focus-visible:[box-shadow:0_0_0_3px_rgba(222,204,253,0.35)]",
    state === "loading" ? "cursor-wait" : "",
  ].filter(Boolean).join(" ");
}

function InteractivePreview({
  item,
  config,
  onStateChange,
}: {
  item: ComponentDoc;
  config: ComponentPlaygroundConfig;
  onStateChange: (state: string) => void;
}) {
  const [count, setCount] = useState(0);
  const [enabled, setEnabled] = useState(true);
  const [checked, setChecked] = useState(false);
  const [radio, setRadio] = useState("balanced");
  const [chip, setChip] = useState(true);
  const [text, setText] = useState("");
  const [area, setArea] = useState("");
  const [select, setSelect] = useState("designer");
  const [date, setDate] = useState("");
  const [email, setEmail] = useState("");
  const [linkVisited, setLinkVisited] = useState(false);
  const [tab, setTab] = useState("preview");
  const [cardSelected, setCardSelected] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [ascending, setAscending] = useState(true);
  const [alertVisible, setAlertVisible] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [confidence, setConfidence] = useState(86);
  const [commandQuery, setCommandQuery] = useState("");
  const [sourceOpen, setSourceOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  const [displayType, setDisplayType] = useState(false);
  const [iconIndex, setIconIndex] = useState(0);
  const buttonPreviewRef = useRef<HTMLButtonElement>(null);
  const togglePreviewRef = useRef<HTMLButtonElement>(null);
  const state = config.state.toLowerCase();
  const intent = config.intent.toLowerCase();

  useEffect(() => {
    if (item.id !== "button") return;
    if (state === "focus") {
      buttonPreviewRef.current?.focus();
      return;
    }
    if (document.activeElement === buttonPreviewRef.current) {
      buttonPreviewRef.current?.blur();
    }
  }, [item.id, state]);

  useEffect(() => {
    if (item.id === "toggle-switch") {
      if (state === "on") setEnabled(true);
      if (state === "off") setEnabled(false);
      if (state === "focus") {
        setEnabled(false);
        togglePreviewRef.current?.focus();
      } else if (document.activeElement === togglePreviewRef.current) {
        togglePreviewRef.current?.blur();
      }
    }
    if (item.id === "checkbox") setChecked(state === "checked" || state === "indeterminate");
    if (item.id === "radio-button") setRadio(state === "checked" ? "balanced" : "");
    if (item.id === "selectable-chip") setChip(state === "selected");
    if (item.id === "text-input") setText(state === "filled" ? "Aetheris" : "");
    if (item.id === "text-area") setArea(state === "filled" ? "Explique a decisão com fontes verificáveis." : "");
    if (item.id === "select-dropdown") setSelect(state === "selected" ? "designer" : "");
    if (item.id === "date-picker") setDate(state === "selected" ? "2026-06-06" : "");
    if (item.id === "form-field") setEmail(state === "valid" ? "nome@empresa.com" : state === "error" ? "invalido" : "");
    if (item.id === "link") setLinkVisited(state === "visited");
    if (item.id === "tabs") setTab(state === "active" ? "preview" : "");
    if (item.id === "card") setCardSelected(state === "selected");
    if (item.id === "modal-dialog") setModalOpen(state !== "closed");
    if (item.id === "alert") setAlertVisible(state !== "dismissed");
    if (item.id === "toast") setToastVisible(state !== "paused");
    if (item.id === "skeleton-loader") setLoaded(state === "loaded");
    if (item.id === "explanation-tooltip") {
      setTooltipOpen(["hover", "focus", "open"].includes(state));
    }
    if (item.id === "confidence-badge") {
      setConfidence(state === "low" ? 34 : state === "medium" ? 67 : state === "high" ? 94 : 86);
    }
    if (item.id === "command-palette") {
      setCommandQuery(state === "empty" ? "sem resultados" : state === "results" ? "audit" : "");
    }
    if (item.id === "source-attribution") setSourceOpen(state === "expanded" || state === "high match");
    if (item.id === "audit-panel") setAuditOpen(state !== "collapsed");
    if (item.id === "typography") setDisplayType(state === "display");
    if (item.id === "icon") {
      setIconIndex(intent === "status" ? 1 : intent === "category" ? 2 : 0);
    }
  }, [intent, item.id, state]);

  const previewButton =
    "rounded-xl bg-signature px-5 py-3 text-xs font-bold uppercase tracking-widest text-on-primary transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/50";
  const secondaryButton =
    "rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:border-primary/25 hover:text-white";

  switch (item.id) {
    case "button":
      {
        const blocked = state === "loading" || state === "disabled";
        const statusId = blocked ? "button-preview-status" : undefined;
        return (
          <div className="text-center">
            <button
              ref={buttonPreviewRef}
              type="button"
              className={buttonPreviewClassName(config)}
              data-intent={intent}
              data-state={state}
              disabled={blocked}
              aria-busy={state === "loading" || undefined}
              aria-describedby={statusId}
              autoFocus={state === "focus"}
              onClick={() => setCount((value) => value + 1)}
            >
              {state === "loading" ? (
                <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
              ) : null}
              <span>{config.label ?? "Gerar análise"}</span>
            </button>
            <p className="mt-3 text-xs text-slate-500">Executado {count}x</p>
            {blocked ? (
              <p id={statusId} className="mt-2 text-[11px] leading-5 text-slate-500" aria-live="polite">
                {state === "loading"
                  ? "Processando operação assíncrona."
                  : "Indisponível: conclua os requisitos da ação."}
              </p>
            ) : null}
          </div>
        );
      }
    case "toggle-switch":
      {
        const toggleLabel =
          intent === "visibility"
            ? "Mostrar detalhes"
            : intent === "mode"
              ? "Modo de edição"
              : "Reduzir animações";
        return (
          <div className="w-full max-w-sm">
            <button
              ref={togglePreviewRef}
              type="button"
              role="switch"
              aria-checked={enabled}
              disabled={state === "disabled"}
              autoFocus={state === "focus"}
              onClick={() => {
                const next = !enabled;
                setEnabled(next);
                onStateChange(next ? "On" : "Off");
              }}
              className={`flex min-h-11 items-center gap-3 rounded-xl px-2 text-sm font-semibold text-white outline-none transition-[box-shadow,opacity] duration-[160ms] focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-40 ${state === "focus" ? "ring-2 ring-primary/50" : ""}`}
            >
              <span
                data-toggle-track
                aria-hidden
                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-[160ms] ${enabled ? "bg-primary" : "bg-white/10"}`}
              >
                <span
                  data-toggle-thumb
                  className={`absolute left-0 top-1 h-5 w-5 rounded-full bg-background transition-transform duration-[160ms] ${enabled ? "translate-x-6" : "translate-x-1"}`}
                />
              </span>
              <span>{toggleLabel} {enabled ? "ativado" : "desativado"}</span>
            </button>
          </div>
        );
      }
    case "checkbox":
      return (
        <label className={`flex min-h-11 items-center gap-3 rounded-xl px-2 text-sm text-white ${state === "disabled" ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}>
          <input
            type="checkbox"
            checked={checked}
            disabled={state === "disabled"}
            autoFocus={state === "focus"}
            aria-checked={state === "indeterminate" ? "mixed" : checked}
            onChange={(event) => {
              setChecked(event.target.checked);
              onStateChange(event.target.checked ? "Checked" : "Unchecked");
            }}
            className="h-5 w-5 accent-primary focus-visible:ring-2 focus-visible:ring-primary/50"
          />
          {intent === "consent" ? "Concordo com o uso das fontes" : intent === "bulk" ? "Selecionar todos" : "Incluir fontes recuperadas"}
        </label>
      );
    case "radio-button":
      return (
        <fieldset className="space-y-3">
          <legend className={`mb-3 text-xs font-bold uppercase tracking-widest ${state === "error" ? "text-error" : "text-slate-500"}`}>
            {intent === "plan" ? "Plano" : intent === "preference" ? "Preferência" : "Escolha única"}
          </legend>
          {["concise", "balanced", "detailed"].map((value) => (
            <label key={value} className={`flex min-h-11 items-center gap-3 text-sm capitalize text-white ${state === "disabled" ? "opacity-40" : ""}`}>
              <input
                type="radio"
                name="depth"
                value={value}
                checked={radio === value}
                disabled={state === "disabled"}
                autoFocus={state === "focus" && value === "balanced"}
                onChange={() => {
                  setRadio(value);
                  onStateChange("Checked");
                }}
                className="h-4 w-4 accent-primary"
              />
              {value}
            </label>
          ))}
          {state === "error" ? <p className="text-xs text-error">Selecione uma opção.</p> : null}
        </fieldset>
      );
    case "selectable-chip":
      return (
        <button
          type="button"
          aria-pressed={chip}
          disabled={state === "disabled"}
          autoFocus={state === "focus"}
          onClick={() => {
            const next = !chip;
            setChip(next);
            onStateChange(next ? "Selected" : "Default");
          }}
          className={`min-h-11 rounded-full border px-4 py-2 text-xs font-bold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-40 ${chip ? "border-primary/30 bg-primary/15 text-primary" : state === "hover" ? "border-white/20 bg-white/[0.07] text-white" : "border-white/10 bg-white/[0.03] text-slate-400"}`}
        >
          {intent === "tag" ? "Documentação" : intent === "attribute" ? "Alta confiança" : "Acessibilidade"}
        </button>
      );
    case "text-input":
      return (
        <label className="w-full max-w-sm text-xs font-semibold text-slate-400">
          {intent === "search" ? "Buscar fontes" : intent === "email" ? "E-mail" : "Nome do projeto"}
          <input
            type={intent === "email" ? "email" : intent === "search" ? "search" : "text"}
            value={text}
            disabled={state === "disabled"}
            autoFocus={state === "focus"}
            aria-invalid={state === "error"}
            onChange={(event) => {
              setText(event.target.value);
              onStateChange(event.target.value ? "Filled" : "Empty");
            }}
            placeholder="Ex.: Aetheris"
            className={`mt-2 min-h-11 w-full rounded-xl border bg-black/20 px-4 py-3 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-40 ${state === "error" ? "border-error/60" : "border-white/10 focus:border-primary/35"}`}
          />
          {state === "error" ? <span className="mt-2 block text-[11px] text-error">Revise o valor informado.</span> : null}
        </label>
      );
    case "text-area":
      return (
        <label className="w-full max-w-sm text-xs font-semibold text-slate-400">
          {intent === "prompt" ? "Prompt da Beatrice" : intent === "comment" ? "Comentário" : "Contexto da decisão"}
          <textarea
            value={area}
            disabled={state === "disabled"}
            autoFocus={state === "focus"}
            aria-invalid={state === "error"}
            onChange={(event) => {
              setArea(event.target.value);
              onStateChange(event.target.value ? "Filled" : "Empty");
            }}
            rows={4}
            placeholder="Descreva restrições e objetivo..."
            className={`mt-2 w-full resize-y rounded-xl border bg-black/20 px-4 py-3 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-40 ${state === "error" ? "border-error/60" : "border-white/10 focus:border-primary/35"}`}
          />
        </label>
      );
    case "select-dropdown":
      return (
        <label className="w-full max-w-xs text-xs font-semibold text-slate-400">
          {intent === "filter" ? "Filtrar fontes" : intent === "configuration" ? "Configuração" : "Perspectiva"}
          <select
            value={select}
            disabled={state === "disabled"}
            autoFocus={state === "open"}
            aria-invalid={state === "error"}
            onChange={(event) => {
              setSelect(event.target.value);
              onStateChange(event.target.value ? "Selected" : "Closed");
            }}
            className={`mt-2 min-h-11 w-full rounded-xl border bg-surface-container-high px-4 py-3 text-sm text-white outline-none disabled:opacity-40 ${state === "error" ? "border-error/60" : "border-white/10 focus:border-primary/35"}`}
          >
            <option value="">Selecione</option>
            <option value="designer">Design Architect</option>
            <option value="developer">Engineering Strategist</option>
            <option value="pm">Product Intelligence</option>
          </select>
        </label>
      );
    case "date-picker":
      return (
        <label className="w-full max-w-xs text-xs font-semibold text-slate-400">
          {intent === "range" ? "Período da auditoria" : intent === "deadline" ? "Prazo" : "Data da revisão"}
          <input
            type="date"
            value={date}
            disabled={state === "disabled"}
            autoFocus={state === "open"}
            aria-invalid={state === "invalid"}
            onChange={(event) => {
              setDate(event.target.value);
              onStateChange(event.target.value ? "Selected" : "Empty");
            }}
            className={`mt-2 min-h-11 w-full rounded-xl border bg-surface-container-high px-4 py-3 text-sm text-white outline-none disabled:opacity-40 ${state === "invalid" ? "border-error/60" : "border-white/10 focus:border-primary/35"}`}
          />
        </label>
      );
    case "form-field": {
      const invalid = state === "error" || (email.length > 0 && !email.includes("@"));
      return (
        <label className="w-full max-w-sm text-xs font-semibold text-slate-400">
          {intent === "validation" ? "E-mail" : intent === "guidance" ? "Nome da análise" : "Dado de entrada"}
          {state === "required" ? <span className="ml-1 text-error">*</span> : null}
          <input
            value={email}
            disabled={state === "disabled"}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={invalid}
            aria-describedby="email-hint"
            placeholder="nome@empresa.com"
            className={`mt-2 min-h-11 w-full rounded-xl border bg-black/20 px-4 py-3 text-sm text-white outline-none disabled:opacity-40 ${invalid ? "border-error/50" : state === "valid" ? "border-[var(--aetheris-color-success)]/50" : "border-white/10 focus:border-primary/35"}`}
          />
          <span id="email-hint" className={`mt-2 block text-[11px] ${invalid ? "text-error" : "text-slate-500"}`}>
            {invalid ? "Informe um e-mail válido." : state === "valid" ? "Valor validado." : "Usaremos apenas para contato."}
          </span>
        </label>
      );
    }
    case "link":
      return (
        <button
          type="button"
          disabled={state === "disabled"}
          autoFocus={state === "focus"}
          onClick={() => {
            setLinkVisited(true);
            onStateChange("Visited");
          }}
          className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-primary underline decoration-primary/30 underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-40 ${state === "hover" ? "bg-primary/10 text-white" : ""}`}
        >
          {intent === "external" ? "Consultar fonte original" : intent === "download" ? "Baixar relatório" : "Explorar Foundations"}
          {intent === "external" ? <ExternalLink className="h-4 w-4" /> : null}
          {linkVisited ? <Check className="h-4 w-4" aria-label="Visitado" /> : null}
        </button>
      );
    case "tabs":
      return (
        <div className="w-full max-w-sm">
          <div role="tablist" className="flex border-b border-white/10">
            {["preview", "usage", "code"].map((value, index) => (
              <button key={value} type="button" role="tab" aria-selected={tab === value} disabled={state === "disabled"} autoFocus={state === "focus" && index === 0} onClick={() => { setTab(value); onStateChange("Active"); }} className={`min-h-11 px-4 py-2 text-xs font-bold uppercase tracking-wider outline-none disabled:opacity-40 ${tab === value ? "border-b-2 border-primary text-primary" : state === "hover" && index === 0 ? "bg-white/5 text-white" : "text-slate-500"}`}>
                {value}
              </button>
            ))}
          </div>
          <div role="tabpanel" className="p-5 text-sm text-slate-300">{intent}: {tab || "nenhuma aba ativa"}</div>
        </div>
      );
    case "card":
      return (
        <button type="button" aria-pressed={cardSelected} disabled={state === "disabled" || state === "loading"} onClick={() => { const next = !cardSelected; setCardSelected(next); onStateChange(next ? "Selected" : "Default"); }} className={`min-h-11 w-full max-w-xs rounded-2xl border p-5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${cardSelected ? "border-primary/35 bg-primary/10" : state === "hover" ? "border-white/20 bg-white/[0.07]" : "border-white/10 bg-white/[0.03]"}`}>
          <CreditCard className="h-5 w-5 text-primary" />
          <p className="mt-4 text-sm font-bold text-white">{intent === "entity" ? "Confidence Badge" : intent === "summary" ? "Resumo da análise" : "Escolha interativa"}</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">{state === "loading" ? "Carregando conteúdo..." : "Selecionar componente para comparar."}</p>
        </button>
      );
    case "modal-dialog":
      return (
        <div className="text-center">
          <button type="button" disabled={state === "disabled"} onClick={() => { setModalOpen(true); onStateChange("Open"); }} className={`${previewButton} disabled:cursor-not-allowed disabled:opacity-40`}>Abrir dialog</button>
          {modalOpen ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/70 p-6">
              <div role="dialog" aria-modal="true" aria-labelledby="preview-dialog-title" className="w-full max-w-sm rounded-2xl border border-white/10 bg-surface-container-high p-5 text-left shadow-panel">
                <div className="flex items-start justify-between">
                  <h4 id="preview-dialog-title" className="font-bold text-white">{intent === "edit" ? "Editar parâmetros" : intent === "critical decision" ? "Remover fonte" : "Confirmar decisão"}</h4>
                  <button type="button" onClick={() => { setModalOpen(false); onStateChange("Closed"); }} aria-label="Fechar"><X className="h-4 w-4 text-slate-400" /></button>
                </div>
                <p className={`mt-3 text-xs leading-5 ${state === "error" ? "text-error" : "text-slate-400"}`}>{state === "error" ? "Não foi possível concluir. Revise os dados." : "A alteração será registrada na trilha de auditoria."}</p>
                <button type="button" disabled={state === "submitting" || state === "disabled"} onClick={() => { setModalOpen(false); onStateChange("Closed"); }} className={`mt-5 ${previewButton} disabled:cursor-wait disabled:opacity-50`}>{state === "submitting" ? "Processando..." : "Confirmar"}</button>
              </div>
            </div>
          ) : null}
        </div>
      );
    case "data-table": {
      const baseRows = state === "empty" ? [] : ascending ? ["Audit Panel", "Button", "Confidence Badge"] : ["Confidence Badge", "Button", "Audit Panel"];
      const rows = state === "loading" ? ["Carregando..."] : baseRows;
      return (
        <div className="w-full max-w-md overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-left text-xs">
            <caption className="sr-only">{intent === "compare" ? "Comparar componentes" : intent === "inspect" ? "Inspecionar componentes" : "Gerenciar componentes"}</caption>
            <thead className="bg-white/[0.04] text-slate-400">
              <tr><th className="px-4 py-3"><button type="button" onClick={() => { setAscending((value) => !value); onStateChange("Sorted"); }}>Componente {ascending ? "↑" : "↓"}</button></th><th className="px-4 py-3">Status</th></tr>
            </thead>
            <tbody>
              {rows.map((row, index) => <tr key={row} className={`border-t border-white/[0.06] ${state === "selected row" && index === 0 ? "bg-primary/10" : ""}`}><td className="px-4 py-3 text-white">{row}</td><td className="px-4 py-3 text-primary">{state === "loading" ? "..." : "Stable"}</td></tr>)}
              {rows.length === 0 ? <tr><td colSpan={2} className="px-4 py-8 text-center text-slate-500">Nenhum resultado.</td></tr> : null}
            </tbody>
          </table>
        </div>
      );
    }
    case "alert": {
      const alertTone = state === "error"
        ? "border-error/25 bg-error/[0.07] text-error"
        : state === "success"
          ? "border-[var(--aetheris-color-success)]/25 bg-[color:rgba(126,231,135,0.07)] text-[var(--aetheris-color-success)]"
          : state === "warning"
            ? "border-amber-300/20 bg-amber-300/[0.06] text-amber-300"
            : "border-primary/20 bg-primary/[0.06] text-primary";
      return alertVisible ? (
        <div role="alert" className={`flex w-full max-w-md items-start gap-3 rounded-xl border p-4 ${alertTone}`}>
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="flex-1"><p className="text-sm font-bold text-white">{intent === "warn" ? "Atenção necessária" : intent === "block" ? "Ação bloqueada" : "Atualização do sistema"}</p><p className="mt-1 text-xs text-slate-400">Revise a evidência antes de decidir.</p></div>
          <button type="button" onClick={() => { setAlertVisible(false); onStateChange("Dismissed"); }} aria-label="Fechar alerta"><X className="h-4 w-4 text-slate-400" /></button>
        </div>
      ) : <button type="button" onClick={() => { setAlertVisible(true); onStateChange("Info"); }} className={secondaryButton}>Restaurar alerta</button>;
    }
    case "toast":
      return (
        <div className="text-center">
          <button type="button" onClick={() => { setToastVisible(true); onStateChange("Visible"); }} className={previewButton}>Mostrar notificação</button>
          {toastVisible ? <div role="status" className={`mt-4 flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-semibold transition-all ${intent === "success" ? "border-[var(--aetheris-color-success)]/25 bg-[color:rgba(126,231,135,0.08)] text-[var(--aetheris-color-success)]" : "border-primary/20 bg-primary/10 text-primary"} ${state === "entering" ? "translate-y-1 opacity-70" : state === "leaving" ? "-translate-y-1 opacity-40" : ""}`}><CheckCircle2 className="h-4 w-4" />{intent === "undo" ? "Item removido · Desfazer" : intent === "info" ? "Sincronização iniciada" : "Análise concluída"}</div> : null}
        </div>
      );
    case "skeleton-loader":
      return (
        <div className="w-full max-w-sm">
          <button type="button" onClick={() => { const next = !loaded; setLoaded(next); onStateChange(next ? "Loaded" : "Loading"); }} className={`${secondaryButton} mb-5`}>{loaded ? "Mostrar loading" : "Carregar conteúdo"}</button>
          {state === "error" ? <div role="alert" className="rounded-xl border border-error/20 bg-error/[0.06] p-4 text-sm text-error">Falha ao carregar o conteúdo.</div> : loaded ? <div className="rounded-xl border border-white/10 p-4"><p className="font-semibold text-white">Fonte recuperada</p><p className="mt-2 text-xs text-slate-400">{intent} · 92% match</p></div> : <div aria-busy="true" className="space-y-3"><div className={`h-5 w-2/3 rounded bg-white/10 ${state === "reduced motion" ? "" : "animate-pulse"}`} /><div className={`h-3 w-full rounded bg-white/[0.06] ${state === "reduced motion" ? "" : "animate-pulse"}`} /><div className={`h-3 w-4/5 rounded bg-white/[0.06] ${state === "reduced motion" ? "" : "animate-pulse"}`} /></div>}
        </div>
      );
    case "explanation-tooltip":
      return (
        <div className="relative">
          <button type="button" aria-describedby="confidence-tip" onMouseEnter={() => { setTooltipOpen(true); onStateChange("Hover"); }} onMouseLeave={() => { setTooltipOpen(false); onStateChange("Closed"); }} onFocus={() => { setTooltipOpen(true); onStateChange("Focus"); }} onBlur={() => { setTooltipOpen(false); onStateChange("Closed"); }} className={secondaryButton}>
            {intent === "shortcut" ? "Atalho" : intent === "definition" ? "Definição" : "Explicação"} <MessageCircleQuestion className="ml-1 inline h-4 w-4" />
          </button>
          {tooltipOpen ? <div id="confidence-tip" role="tooltip" className="absolute bottom-full left-1/2 mb-3 w-64 -translate-x-1/2 rounded-xl border border-primary/20 bg-surface-container-high p-3 text-xs leading-5 text-slate-300 shadow-panel">Calibrada pela similaridade e cobertura das fontes recuperadas.</div> : null}
        </div>
      );
    case "confidence-badge": {
      const tier = confidence >= 80 ? "Alta" : confidence >= 55 ? "Média" : "Baixa";
      return (
        <div className="w-full max-w-sm">
          <div className={`flex items-center justify-between rounded-xl border p-4 ${state === "unavailable" ? "border-white/10 bg-white/[0.03] opacity-50" : tier === "Alta" ? "border-[var(--aetheris-color-success)]/20 bg-[color:rgba(126,231,135,0.06)]" : tier === "Média" ? "border-amber-300/20 bg-amber-300/[0.05]" : "border-error/20 bg-error/[0.05]"}`}><span className="text-sm font-semibold text-white">{intent === "warn" ? "Risco de confiança" : intent === "support trust" ? "Evidência de confiança" : "Confiança"} {state === "unavailable" ? "indisponível" : tier}</span><span className="rounded-full bg-primary/15 px-3 py-1 text-sm font-black text-primary">{state === "unavailable" ? "—" : `${confidence}%`}</span></div>
          <input aria-label="Confiança" disabled={state === "unavailable" || state === "inspecting"} type="range" min="25" max="98" value={confidence} onChange={(event) => { const value = Number(event.target.value); setConfidence(value); onStateChange(value >= 80 ? "High" : value >= 55 ? "Medium" : "Low"); }} className="mt-5 w-full accent-primary disabled:opacity-40" />
        </div>
      );
    }
    case "command-palette": {
      const commands = ["Abrir Components", "Consultar Confidence Badge", "Inspecionar Audit Panel"].filter((command) => command.toLowerCase().includes(commandQuery.toLowerCase()));
      return (
        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-black/20">
          <label className="flex min-h-11 items-center gap-3 border-b border-white/10 px-4 py-3"><Command className="h-4 w-4 text-primary" /><input disabled={state === "closed" || state === "executing"} value={commandQuery} onChange={(event) => { setCommandQuery(event.target.value); onStateChange(event.target.value ? "Searching" : "Results"); }} placeholder={intent === "navigate" ? "Ir para..." : intent === "execute" ? "Executar ação..." : "Buscar comando..."} className="w-full bg-transparent text-sm text-white outline-none disabled:opacity-40" /></label>
          <div className="p-2">{state === "closed" ? <p className="px-3 py-4 text-xs text-slate-500">Paleta fechada. Selecione outro state.</p> : commands.map((command) => <button key={command} type="button" onClick={() => onStateChange("Executing")} className="block min-h-11 w-full rounded-lg px-3 py-2 text-left text-xs text-slate-300 hover:bg-white/5 hover:text-white">{command}</button>)}{state !== "closed" && commands.length === 0 ? <p className="px-3 py-4 text-xs text-slate-500">Nenhum comando encontrado.</p> : null}</div>
        </div>
      );
    }
    case "source-attribution":
      return (
        <div className="w-full max-w-md">
          <button type="button" disabled={state === "unavailable"} aria-expanded={sourceOpen} onClick={() => { const next = !sourceOpen; setSourceOpen(next); onStateChange(next ? "Expanded" : "Collapsed"); }} className="flex min-h-11 w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left disabled:cursor-not-allowed disabled:opacity-40"><span className="flex items-center gap-2 text-sm font-semibold text-white"><BookOpenCheck className="h-4 w-4 text-primary" />{intent === "verify" ? "Fonte verificada" : intent === "inspect" ? "Inspecionar trecho" : "ComponentsPage.tsx"}</span><span className="text-xs font-bold text-primary">{state === "partial match" ? "54%" : state === "unavailable" ? "—" : "92% match"}</span></button>
          {sourceOpen ? <div className="mt-2 rounded-xl border border-white/[0.07] bg-black/20 p-4 text-xs leading-5 text-slate-400">Confidence Badge · confiança calibrada por evidência recuperada do corpus curado.</div> : null}
        </div>
      );
    case "audit-panel":
      return (
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.025] p-4">
          <button type="button" aria-expanded={auditOpen} onClick={() => { const next = !auditOpen; setAuditOpen(next); onStateChange(next ? "Expanded" : "Collapsed"); }} className="flex min-h-11 w-full items-center justify-between"><span className="flex items-center gap-2 text-sm font-semibold text-white"><ListChecks className="h-4 w-4 text-primary" />{intent === "govern" ? "Governança" : intent === "debug" ? "Diagnóstico" : "Trilha de decisão"}</span><span className="text-xs font-bold text-primary">{auditOpen ? "Recolher" : "Inspecionar"}</span></button>
          <div className="mt-4 grid grid-cols-3 gap-2">{["Retrieval", "Ranking", "Synthesis"].map((stage, index) => <div key={stage} className={`rounded-lg border p-2 text-center ${state === "conflict" && index === 1 ? "border-error/30 bg-error/[0.06]" : "border-white/[0.07] bg-black/20"}`}><Check className={`mx-auto h-3.5 w-3.5 ${state === "running" && index === 2 ? "animate-pulse text-amber-300" : state === "conflict" && index === 1 ? "text-error" : "text-primary"}`} /><p className="mt-1 text-[9px] uppercase tracking-wider text-slate-500">{stage}</p></div>)}</div>
          {auditOpen ? <div className="mt-4 border-t border-white/[0.07] pt-4 text-xs leading-5 text-slate-400">{state === "conflict" ? "Conflito detectado entre duas fontes." : state === "running" ? "Auditoria em execução..." : "4 fontes recuperadas · 3 selecionadas · confiança calibrada em 86%."}</div> : null}
        </div>
      );
    case "typography":
      return (
        <button type="button" onClick={() => { const next = !displayType; setDisplayType(next); onStateChange(next ? "Display" : "Heading"); }} className="min-h-11 text-left">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">{intent === "metadata" ? "METADATA" : intent === "reading" ? "Leitura contínua" : "Aetheris type scale"}</p>
          <p className={`mt-3 tracking-tight text-white transition-all ${state === "code" ? "font-mono text-lg" : state === "caption" || state === "label" ? "text-xs font-bold uppercase tracking-widest" : displayType ? "text-5xl font-black" : "text-3xl font-black"}`}>Evidência explicável</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">Clique para alternar entre Heading e Display.</p>
        </button>
      );
    case "icon": {
      const icons = [ShieldPreview, SourcePreview, AuditPreview];
      const ActiveIcon = icons[iconIndex] ?? ShieldPreview;
      if (state === "decorative") {
        return (
          <div className="text-center">
            <span aria-hidden className="flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/15 bg-primary/[0.06] text-primary/60">
              <ActiveIcon className="h-9 w-9" />
            </span>
            <p className="mt-3 text-xs text-slate-500">Ícone decorativo, oculto da árvore acessível</p>
          </div>
        );
      }
      return (
        <div className="text-center">
          <button type="button" disabled={state === "disabled"} onClick={() => { setIconIndex((value) => (value + 1) % icons.length); onStateChange("Active"); }} className={`flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary transition-colors hover:bg-primary/15 disabled:opacity-40 ${state === "active" ? "ring-2 ring-primary/50" : ""}`} aria-label={intent === "status" ? "Alternar ícone de status" : "Alternar ícone"}>
            <ActiveIcon className="h-9 w-9" />
          </button>
          <p className="mt-3 text-xs text-slate-500">{intent}: clique para trocar o símbolo</p>
        </div>
      );
    }
  }
}

function ShieldPreview({ className }: { className?: string }) {
  return <CheckCircle2 className={className} />;
}

function SourcePreview({ className }: { className?: string }) {
  return <BookOpenCheck className={className} />;
}

function AuditPreview({ className }: { className?: string }) {
  return <ListChecks className={className} />;
}

export function ComponentsPage() {
  const { locale } = useI18n();
  const ui = getUi(locale);
  const sections = getSections(locale);
  const catalog = useMemo(
    () => COMPONENT_CATALOG.map((item) => localizeComponent(item, locale)),
    [locale],
  );
  const [selectedId, setSelectedId] = useState<ComponentId>("button");
  const [copied, setCopied] = useState(false);
  const [playgroundConfigs, setPlaygroundConfigs] = useState<Record<ComponentId, ComponentPlaygroundConfig>>(
    () => Object.fromEntries(
      COMPONENT_CATALOG.map((item) => [
        item.id,
        createInitialPlaygroundConfig(item.id, item.states, item.intents),
      ]),
    ) as Record<ComponentId, ComponentPlaygroundConfig>,
  );
  const [snippetDrafts, setSnippetDrafts] = useState<Record<ComponentId, string>>(
    () => Object.fromEntries(
      COMPONENT_CATALOG.map((item) => {
        const config = createInitialPlaygroundConfig(item.id, item.states, item.intents);
        return [item.id, generateComponentSnippet(item.id, config)];
      }),
    ) as Record<ComponentId, string>,
  );
  const [snippetErrors, setSnippetErrors] = useState<Partial<Record<ComponentId, SnippetError>>>({});
  const selected = catalog.find((item) => item.id === selectedId) ?? catalog[0]!;
  const activeConfig = playgroundConfigs[selected.id];
  const activeSnippet = snippetDrafts[selected.id];
  const activeSnippetError = snippetErrors[selected.id];
  const activeSection = sections.find((section) => section.id === selected.section) ?? sections[0]!;
  const usageGuidance = getComponentUsageGuidance(selected.id, locale);
  const intentExplanation = getIntentExplanation(selected.id, activeConfig.intent, locale);
  const activeStateKey = activeConfig.state.toLowerCase();
  const previewFrameClass = [
    activeStateKey === "focus" ? "border-primary/45 [box-shadow:inset_0_0_0_1px_rgba(222,204,253,0.2)]" : "",
    activeStateKey === "hover" ? "border-white/15 bg-surface-container-high" : "",
    activeStateKey === "disabled" ? "opacity-70" : "",
    ["loading", "searching", "running", "submitting", "executing"].includes(activeStateKey)
      ? "border-primary/20"
      : "",
    ["error", "invalid", "conflict"].includes(activeStateKey) ? "border-error/30" : "",
  ].filter(Boolean).join(" ");

  const selectSection = (sectionId: SectionId) => {
    const first = catalog.find((item) => item.section === sectionId);
    if (first) setSelectedId(first.id);
  };

  const updatePlaygroundConfig = (patch: Partial<ComponentPlaygroundConfig>) => {
    const nextConfig = { ...activeConfig, ...patch };
    setPlaygroundConfigs((current) => ({ ...current, [selected.id]: nextConfig }));
    setSnippetDrafts((current) => ({
      ...current,
      [selected.id]: generateComponentSnippet(selected.id, nextConfig),
    }));
    setSnippetErrors((current) => {
      const next = { ...current };
      delete next[selected.id];
      return next;
    });
  };

  const updateSnippet = (draft: string) => {
    setSnippetDrafts((current) => ({ ...current, [selected.id]: draft }));
    const parsed = parseComponentSnippet(selected.id, draft, selected.states, selected.intents);
    if (parsed.ok) {
      setPlaygroundConfigs((current) => ({ ...current, [selected.id]: parsed.config }));
      setSnippetErrors((current) => {
        const next = { ...current };
        delete next[selected.id];
        return next;
      });
      return;
    }
    setSnippetErrors((current) => ({ ...current, [selected.id]: parsed.error }));
  };

  const copySnippet = async () => {
    try {
      await navigator.clipboard.writeText(activeSnippet);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-10 px-6 py-10 pb-20 text-slate-200 lg:px-10">
      <header className="grid gap-8 xl:grid-cols-[1fr_auto] xl:items-end">
        <div className="max-w-4xl">
          <div className="page-eyebrow">
            <Layers3 className="h-3.5 w-3.5" aria-hidden />
            {ui.eyebrow}
          </div>
          <h1 className="page-h1">
            {ui.title.split(" ")[0]}{" "}
            <span className="page-h1-accent">{ui.title.split(" ").slice(1).join(" ")}</span>
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-400">{ui.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="signature-pill">{ui.count}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {ui.corpus}
            </span>
          </div>
        </div>
        <div className="glass-card flex h-36 w-36 items-center justify-center rounded-[32px] border border-primary/15 shadow-glow">
          <Sparkles className="h-14 w-14 text-primary" />
        </div>
      </header>

      <nav aria-label={ui.sectionNav} className="glass-card flex gap-2 overflow-x-auto rounded-2xl p-2">
        {sections.map((section) => {
          const active = section.id === selected.section;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => selectSection(section.id)}
              aria-pressed={active}
              className={active ? "section-tab-active" : "section-tab"}
            >
              <span className="font-semibold">{section.title}</span>
              <span className="rounded-full bg-black/20 px-2 py-0.5 text-[9px]">5</span>
            </button>
          );
        })}
      </nav>

      <section className="overflow-hidden rounded-[32px] border border-white/[0.08] bg-surface-container-low">
        <div className="grid xl:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="border-b border-white/[0.08] p-5 xl:border-b-0 xl:border-r">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">{ui.componentNav}</p>
            <h2 className="mt-2 text-xl font-bold text-white">{activeSection.title}</h2>
            <p className="mt-2 text-xs leading-5 text-slate-500">{activeSection.description}</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
              {catalog.filter((item) => item.section === selected.section).map((item) => {
                const Icon = item.icon;
                const active = item.id === selected.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={`flex items-center gap-3 rounded-xl border px-3 py-3 text-left text-xs font-semibold transition-colors ${active ? "border-primary/25 bg-primary/10 text-white" : "border-transparent bg-white/[0.02] text-slate-400 hover:border-white/10 hover:text-white"}`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${active ? "text-primary" : "text-slate-600"}`} />
                    <span>{item.title}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="min-w-0">
            <div className="border-b border-white/[0.08] p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <selected.icon className="h-5 w-5 text-primary" />
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-primary">{ui.stable}</span>
                  </div>
                  <h2 className="mt-4 text-3xl font-bold tracking-tight text-white">{selected.title}</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">{selected.description}</p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {activeSection.title}
                </span>
              </div>
            </div>

            <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
              <div className="border-b border-white/[0.08] p-6 lg:border-b-0 lg:border-r md:p-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">{ui.preview}</p>
                <div
                  data-component-preview={selected.id}
                  data-state={activeConfig.state}
                  data-intent={activeConfig.intent}
                  className={`relative mt-4 flex min-h-[300px] items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-surface-container p-6 transition-[background-color,border-color,box-shadow,opacity] duration-[160ms] ${previewFrameClass}`}
                >
                  <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_50%_20%,#c2a0fc,transparent_55%)]" />
                  <span className="absolute right-4 top-4 z-[2] rounded-full border border-primary/15 bg-black/30 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-primary">
                    {activeConfig.intent} · {activeConfig.state}
                  </span>
                  <div className="relative z-[1] flex w-full flex-col items-center justify-center gap-5">
                    <InteractivePreview
                      key={selected.id}
                      item={selected}
                      config={activeConfig}
                      onStateChange={(state) => updatePlaygroundConfig({ state })}
                    />
                    <article
                      data-intent-explanation={activeConfig.intent}
                      className="w-full max-w-md rounded-xl border border-white/[0.08] bg-black/20 p-4 text-left"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                        Intent: {activeConfig.intent}
                      </p>
                      <p className="mt-2 text-xs leading-5 text-slate-300">
                        {intentExplanation.description}
                      </p>
                      <p className="mt-2 text-[11px] leading-5 text-slate-500">
                        {intentExplanation.example}
                      </p>
                    </article>
                  </div>
                </div>

                <div className="mt-7">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">{ui.usage}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{selected.logic}</p>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <article className="rounded-xl border border-primary/15 bg-primary/[0.05] p-4">
                    <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary">
                      <Check className="h-3.5 w-3.5" />
                      {ui.doLabel} · {ui.whenToUse}
                    </p>
                    <ul data-usage-guidance="do" className="mt-3 space-y-2">
                      {usageGuidance.do.map((rule) => (
                        <li key={rule} className="flex gap-2 text-xs leading-5 text-slate-300">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                  <article className="rounded-xl border border-error/15 bg-error/[0.05] p-4">
                    <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-error">
                      <X className="h-3.5 w-3.5" />
                      {ui.dontLabel} · {ui.whenNotToUse}
                    </p>
                    <ul data-usage-guidance="dont" className="mt-3 space-y-2">
                      {usageGuidance.dont.map((rule) => (
                        <li key={rule} className="flex gap-2 text-xs leading-5 text-slate-300">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-error" />
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">{ui.states}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selected.states.map((state) => {
                        const active = activeConfig.state === state;
                        return (
                          <button
                            key={state}
                            type="button"
                            aria-label={`${ui.states}: ${state}`}
                            aria-pressed={active}
                            onClick={() => updatePlaygroundConfig({ state })}
                            className={`min-h-11 rounded-xl border px-3 py-2 text-[10px] font-semibold outline-none transition-colors duration-[160ms] focus-visible:border-primary focus-visible:[box-shadow:0_0_0_3px_rgba(222,204,253,0.35)] ${active ? "border-primary/35 bg-primary/10 text-primary" : "border-white/10 bg-white/[0.035] text-slate-300 hover:border-white/20 hover:text-white"}`}
                          >
                            {state}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">{ui.intents}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selected.intents.map((intent) => {
                        const active = activeConfig.intent === intent;
                        return (
                          <button
                            key={intent}
                            type="button"
                            aria-label={`${ui.intents}: ${intent}`}
                            aria-pressed={active}
                            onClick={() => updatePlaygroundConfig({ intent })}
                            className={`min-h-11 rounded-xl border px-3 py-2 text-[10px] font-semibold outline-none transition-colors duration-[160ms] focus-visible:border-primary focus-visible:[box-shadow:0_0_0_3px_rgba(222,204,253,0.35)] ${active ? "border-primary/35 bg-primary/10 text-primary" : "border-primary/15 bg-primary/[0.04] text-primary/70 hover:border-primary/30 hover:text-primary"}`}
                          >
                            {intent}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <article className="mt-7 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">{ui.accessibility}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-300">{selected.accessibility}</p>
                </article>

                <article className="mt-3 rounded-xl border border-primary/15 bg-primary/[0.05] p-4">
                  <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-primary"><Sparkles className="h-3.5 w-3.5" />{ui.ragRelation}</p>
                  <p className="mt-2 text-xs leading-5 text-primary/80">{selected.ragRelation}</p>
                </article>

                <div className="mt-7 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                  <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
                    <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500"><Code2 className="h-3.5 w-3.5 text-primary" />{ui.code}</span>
                    <button type="button" onClick={() => { void copySnippet(); }} className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary">
                      {copied ? <Check className="h-3.5 w-3.5" /> : <Clipboard className="h-3.5 w-3.5" />}
                      {copied ? ui.copied : ui.copy}
                    </button>
                  </div>
                  <div>
                    <label htmlFor="component-snippet-editor" className="sr-only">
                      {ui.snippetEditorLabel}
                    </label>
                    <textarea
                      id="component-snippet-editor"
                      value={activeSnippet}
                      onChange={(event) => updateSnippet(event.target.value)}
                      aria-invalid={Boolean(activeSnippetError)}
                      aria-describedby={activeSnippetError ? "component-snippet-error" : undefined}
                      spellCheck={false}
                      className="min-h-40 w-full resize-y bg-transparent p-5 font-mono text-xs leading-6 text-slate-300 outline-none focus-visible:[box-shadow:inset_0_0_0_1px_rgba(222,204,253,0.35)]"
                    />
                    {activeSnippetError ? (
                      <p
                        id="component-snippet-error"
                        role="alert"
                        className="border-t border-error/15 bg-error/[0.05] px-5 py-3 text-xs leading-5 text-error"
                      >
                        {getSnippetError(activeSnippetError, locale)}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">{ui.libraryMap}</p>
            <h2 className="mt-2 text-2xl font-bold text-white">{ui.count}</h2>
          </div>
          <span className="text-xs text-slate-500">5 × 5</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {sections.map((section) => (
            <article key={section.id} className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">05 {ui.components}</span>
                <CheckCircle2 className="h-4 w-4 text-primary/60" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-white">{section.title}</h3>
              <ul className="mt-4 space-y-2">
                {catalog.filter((item) => item.section === section.id).map((item) => (
                  <li key={item.id}>
                    <button type="button" onClick={() => setSelectedId(item.id)} className="text-left text-xs leading-5 text-slate-500 transition-colors hover:text-primary">
                      {item.title}
                    </button>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
