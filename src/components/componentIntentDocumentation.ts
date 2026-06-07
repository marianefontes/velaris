import type { Locale } from "../i18n/translations";
import type { ComponentId } from "./componentWorkbench";

interface IntentExplanation {
  description: string;
  example: string;
}

interface LocalizedIntentExplanation {
  pt: IntentExplanation;
  en: IntentExplanation;
}

const explanation = (
  ptDescription: string,
  ptExample: string,
  enDescription: string,
  enExample: string,
): LocalizedIntentExplanation => ({
  pt: { description: ptDescription, example: ptExample },
  en: { description: enDescription, example: enExample },
});

const INTENT_EXPLANATIONS: Record<ComponentId, Record<string, LocalizedIntentExplanation>> = {
  button: {
    primary: explanation(
      "Identifica a ação principal e mais importante de uma região.",
      "Gerar análise é a próxima ação recomendada.",
      "Identifies the main and most important action in a region.",
      "Generate analysis is the recommended next action.",
    ),
    secondary: explanation(
      "Representa uma ação de apoio com menor prioridade visual.",
      "Salvar rascunho acompanha a ação principal sem competir com ela.",
      "Represents a supporting action with lower visual priority.",
      "Save draft supports the primary action without competing with it.",
    ),
    positive: explanation(
      "Comunica conclusão, aprovação, restauração ou resultado benéfico.",
      "Aprovar alteração confirma uma decisão positiva e explícita.",
      "Communicates completion, approval, restoration, or a beneficial outcome.",
      "Approve change confirms an explicit positive decision.",
    ),
    negative: explanation(
      "Sinaliza uma ação crítica, destrutiva ou difícil de reverter.",
      "Excluir análise exige atenção para a consequência da ação.",
      "Signals a critical, destructive, or difficult-to-reverse action.",
      "Delete analysis calls attention to the consequence of the action.",
    ),
  },
  "toggle-switch": {
    preference: explanation(
      "Representa uma escolha pessoal, reversível e persistente do usuário.",
      "Reduzir animações adapta a experiência à preferência individual.",
      "Represents a personal, reversible, and persistent user choice.",
      "Reduce motion adapts the experience to an individual preference.",
    ),
    visibility: explanation(
      "Controla se um conteúdo complementar fica visível ou oculto, sem alterar o conteúdo em si.",
      "Mostrar detalhes revela ou recolhe informações adicionais.",
      "Controls whether supporting content is visible or hidden without changing the content itself.",
      "Show details reveals or collapses additional information.",
    ),
    mode: explanation(
      "Alterna entre dois comportamentos operacionais mutuamente exclusivos.",
      "Modo de edição muda como a interface responde às interações.",
      "Switches between two mutually exclusive operational behaviors.",
      "Edit mode changes how the interface responds to interactions.",
    ),
  },
  checkbox: {
    selection: explanation(
      "Inclui ou remove uma opção independente de um conjunto.",
      "Incluir na análise não interfere nas demais opções.",
      "Includes or removes an independent option from a set.",
      "Include in analysis does not affect the other options.",
    ),
    consent: explanation(
      "Registra concordância explícita com uma condição ou política.",
      "Concordar com os termos exige uma decisão consciente do usuário.",
      "Records explicit agreement with a condition or policy.",
      "Agreeing to terms requires a conscious user decision.",
    ),
    bulk: explanation(
      "Aplica a mesma seleção a vários itens de uma vez.",
      "Selecionar todos prepara um conjunto para uma ação coletiva.",
      "Applies the same selection to several items at once.",
      "Select all prepares a set for a bulk action.",
    ),
  },
  "radio-button": {
    "single choice": explanation(
      "Permite escolher exatamente uma alternativa em um grupo.",
      "Selecionar uma profundidade desmarca automaticamente as demais.",
      "Allows exactly one alternative to be chosen from a group.",
      "Selecting one depth automatically clears the others.",
    ),
    plan: explanation(
      "Compara opções de plano mutuamente exclusivas.",
      "O usuário escolhe um único plano para continuar.",
      "Compares mutually exclusive plan options.",
      "The user chooses one plan to continue.",
    ),
    preference: explanation(
      "Escolhe uma preferência única entre alternativas visíveis.",
      "A preferência selecionada substitui a escolha anterior.",
      "Chooses one preference among visible alternatives.",
      "The selected preference replaces the previous choice.",
    ),
  },
  "selectable-chip": {
    filter: explanation(
      "Ativa um critério para reduzir ou refinar resultados.",
      "Jurídico limita a listagem aos itens dessa categoria.",
      "Activates a criterion to narrow or refine results.",
      "Legal limits the list to items in that category.",
    ),
    tag: explanation(
      "Seleciona um rótulo curto usado para organizar conteúdo.",
      "Documentação adiciona ou remove uma tag do conjunto.",
      "Selects a short label used to organize content.",
      "Documentation adds or removes a tag from the set.",
    ),
    attribute: explanation(
      "Ativa uma característica específica associada ao item.",
      "Alta confiança seleciona itens que possuem esse atributo.",
      "Activates a specific characteristic associated with an item.",
      "High confidence selects items with that attribute.",
    ),
  },
  "text-input": {
    text: explanation(
      "Captura um valor textual curto e genérico em uma linha.",
      "Nome do projeto recebe uma identificação breve.",
      "Captures a short, general text value on one line.",
      "Project name receives a brief identifier.",
    ),
    search: explanation(
      "Captura uma consulta usada para localizar ou filtrar conteúdo.",
      "Buscar fontes atualiza os resultados conforme o texto informado.",
      "Captures a query used to find or filter content.",
      "Search sources updates results from the entered query.",
    ),
    email: explanation(
      "Captura um endereço de e-mail com formato e autocomplete adequados.",
      "E-mail permite validação específica antes do envio.",
      "Captures an email address with appropriate format and autocomplete.",
      "Email supports format-specific validation before submission.",
    ),
  },
  "text-area": {
    description: explanation(
      "Captura uma explicação extensa ou contexto em várias linhas.",
      "Contexto da decisão oferece espaço para detalhes relevantes.",
      "Captures an extended explanation or context across multiple lines.",
      "Decision context provides room for relevant details.",
    ),
    prompt: explanation(
      "Recebe uma instrução detalhada destinada a um sistema de IA.",
      "Prompt da Beatrice descreve objetivo, restrições e formato esperado.",
      "Receives a detailed instruction intended for an AI system.",
      "Beatrice prompt describes the goal, constraints, and expected format.",
    ),
    comment: explanation(
      "Registra uma observação livre associada a um item ou decisão.",
      "Comentário adiciona contexto sem alterar os dados principais.",
      "Records a free-form observation associated with an item or decision.",
      "A comment adds context without changing the primary data.",
    ),
  },
  "select-dropdown": {
    "single choice": explanation(
      "Seleciona uma única opção em uma lista compacta.",
      "Modelo define uma escolha sem manter todas as alternativas visíveis.",
      "Selects one option from a compact list.",
      "Model defines a choice without keeping every alternative visible.",
    ),
    filter: explanation(
      "Aplica um critério escolhido em uma lista de opções.",
      "Filtrar por status restringe os resultados ao valor selecionado.",
      "Applies a chosen criterion from a list of options.",
      "Filter by status narrows results to the selected value.",
    ),
    configuration: explanation(
      "Define um parâmetro operacional entre valores predefinidos.",
      "Configuração escolhe como uma funcionalidade deve operar.",
      "Defines an operational parameter from predefined values.",
      "Configuration chooses how a feature should operate.",
    ),
  },
  "date-picker": {
    "single date": explanation(
      "Seleciona uma data específica.",
      "Data da revisão registra um único dia no calendário.",
      "Selects one specific date.",
      "Review date records a single day on the calendar.",
    ),
    range: explanation(
      "Seleciona um período com data inicial e final.",
      "Período da auditoria delimita o intervalo analisado.",
      "Selects a period with a start and end date.",
      "Audit period defines the analyzed interval.",
    ),
    deadline: explanation(
      "Define a data limite para concluir uma tarefa.",
      "Prazo comunica quando a ação deve estar finalizada.",
      "Defines the final date for completing a task.",
      "Deadline communicates when the action must be completed.",
    ),
  },
  "form-field": {
    "data entry": explanation(
      "Agrupa rótulo, controle e apoio para entrada de dados.",
      "Dado de entrada apresenta o campo como uma unidade completa.",
      "Groups label, control, and support text for data entry.",
      "Data entry presents the field as one complete unit.",
    ),
    validation: explanation(
      "Comunica se o valor atende às regras esperadas.",
      "E-mail apresenta sucesso ou erro junto ao controle relacionado.",
      "Communicates whether a value meets the expected rules.",
      "Email presents success or error beside the related control.",
    ),
    guidance: explanation(
      "Orienta o preenchimento antes que um erro aconteça.",
      "Nome da análise explica formato ou finalidade do campo.",
      "Guides completion before an error occurs.",
      "Analysis name explains the field format or purpose.",
    ),
  },
  link: {
    navigation: explanation(
      "Leva o usuário a outro destino dentro do produto.",
      "Explorar Foundations muda a página ou seção atual.",
      "Moves the user to another destination within the product.",
      "Explore Foundations changes the current page or section.",
    ),
    external: explanation(
      "Abre um recurso localizado fora do produto.",
      "Consultar fonte original sinaliza o destino externo.",
      "Opens a resource located outside the product.",
      "Open original source signals the external destination.",
    ),
    download: explanation(
      "Inicia a obtenção de um arquivo em vez de navegar para uma página.",
      "Baixar relatório comunica claramente que um arquivo será salvo.",
      "Starts obtaining a file instead of navigating to a page.",
      "Download report clearly communicates that a file will be saved.",
    ),
  },
  tabs: {
    section: explanation(
      "Alterna entre seções irmãs dentro do mesmo contexto.",
      "Visão geral troca o painel sem sair da página.",
      "Switches between sibling sections in the same context.",
      "Overview changes the panel without leaving the page.",
    ),
    view: explanation(
      "Muda a representação do mesmo conteúdo ou objeto.",
      "Preview apresenta outra visualização dos mesmos dados.",
      "Changes the representation of the same content or object.",
      "Preview presents another view of the same data.",
    ),
    mode: explanation(
      "Alterna a tarefa ativa dentro de uma área local.",
      "Modo muda a forma de trabalhar sem representar uma etapa.",
      "Switches the active task within a local area.",
      "Mode changes how work is performed without representing a step.",
    ),
  },
  card: {
    entity: explanation(
      "Representa uma entidade individual com dados e ações relacionados.",
      "Confidence Badge aparece como um item autônomo da coleção.",
      "Represents an individual entity with related data and actions.",
      "Confidence Badge appears as a standalone item in the collection.",
    ),
    summary: explanation(
      "Condensa as informações mais importantes de um conteúdo.",
      "Resumo da análise permite compreensão rápida antes de abrir detalhes.",
      "Condenses the most important information from content.",
      "Analysis summary supports quick understanding before opening details.",
    ),
    choice: explanation(
      "Transforma o card em uma opção selecionável dentro de um conjunto.",
      "Fonte recomendada pode ser escolhida para uma próxima ação.",
      "Turns the card into a selectable option within a set.",
      "Recommended source can be chosen for a following action.",
    ),
  },
  "modal-dialog": {
    confirm: explanation(
      "Solicita confirmação antes de concluir uma ação relevante.",
      "Confirmar análise permite revisar a decisão antes de prosseguir.",
      "Requests confirmation before completing a meaningful action.",
      "Confirm analysis allows reviewing the decision before proceeding.",
    ),
    edit: explanation(
      "Oferece uma edição curta que precisa manter o contexto anterior.",
      "Editar parâmetros altera poucos valores sem abrir uma nova página.",
      "Provides a short edit while preserving the previous context.",
      "Edit parameters changes a few values without opening a new page.",
    ),
    "critical decision": explanation(
      "Interrompe o fluxo para uma decisão com consequência importante.",
      "Remover fonte exige clareza sobre impacto e possibilidade de reversão.",
      "Interrupts the flow for a decision with an important consequence.",
      "Remove source requires clarity about impact and reversibility.",
    ),
  },
  "data-table": {
    compare: explanation(
      "Organiza valores em colunas para comparação direta entre linhas.",
      "Comparar fontes evidencia diferenças usando os mesmos cabeçalhos.",
      "Organizes values in columns for direct comparison across rows.",
      "Compare sources exposes differences under the same headers.",
    ),
    inspect: explanation(
      "Permite examinar detalhes estruturados de vários registros.",
      "Inspecionar fontes favorece leitura e ordenação dos atributos.",
      "Supports examining structured details across several records.",
      "Inspect sources supports reading and sorting attributes.",
    ),
    manage: explanation(
      "Combina dados com seleção e ações operacionais por linha.",
      "Gerenciar fontes permite selecionar, ordenar e agir sobre registros.",
      "Combines data with selection and row-level operational actions.",
      "Manage sources supports selecting, sorting, and acting on records.",
    ),
  },
  alert: {
    inform: explanation(
      "Apresenta informação persistente relevante ao contexto atual.",
      "Atualização do sistema permanece visível enquanto for útil.",
      "Presents persistent information relevant to the current context.",
      "System update remains visible while it is useful.",
    ),
    warn: explanation(
      "Chama atenção para um risco que ainda permite continuar.",
      "Revise os campos indica cautela antes da próxima ação.",
      "Calls attention to a risk while still allowing progress.",
      "Review the fields signals caution before the next action.",
    ),
    block: explanation(
      "Comunica um problema que impede a conclusão da tarefa.",
      "Ação bloqueada explica o que precisa ser resolvido para continuar.",
      "Communicates a problem that prevents task completion.",
      "Action blocked explains what must be resolved to continue.",
    ),
  },
  toast: {
    success: explanation(
      "Confirma que uma ação foi concluída com sucesso.",
      "Análise concluída oferece retorno transitório após a operação.",
      "Confirms that an action completed successfully.",
      "Analysis complete provides transient feedback after the operation.",
    ),
    info: explanation(
      "Comunica uma atualização transitória sem exigir correção.",
      "Sincronização iniciada informa o novo estado do sistema.",
      "Communicates a transient update without requiring correction.",
      "Sync started reports the system's new state.",
    ),
    undo: explanation(
      "Confirma uma mudança e oferece uma reversão imediata.",
      "Item removido mantém Desfazer disponível por tempo limitado.",
      "Confirms a change and offers an immediate reversal.",
      "Item removed keeps Undo available for a limited time.",
    ),
  },
  "skeleton-loader": {
    card: explanation(
      "Reserva a forma de um bloco de conteúdo individual.",
      "O skeleton antecipa título, texto e área principal do card.",
      "Reserves the shape of an individual content block.",
      "The skeleton anticipates the card title, text, and main area.",
    ),
    list: explanation(
      "Repete linhas provisórias para uma coleção vertical.",
      "O skeleton preserva ritmo e quantidade aproximada dos itens.",
      "Repeats provisional rows for a vertical collection.",
      "The skeleton preserves the approximate rhythm and item count.",
    ),
    table: explanation(
      "Reserva cabeçalhos, colunas e linhas de uma tabela.",
      "O skeleton reduz mudança de layout durante o carregamento dos dados.",
      "Reserves table headers, columns, and rows.",
      "The skeleton reduces layout shift while data loads.",
    ),
  },
  "explanation-tooltip": {
    definition: explanation(
      "Esclarece o significado de um termo curto ou especializado.",
      "Definição oferece contexto sem interromper a tarefa.",
      "Clarifies the meaning of a short or specialized term.",
      "Definition provides context without interrupting the task.",
    ),
    shortcut: explanation(
      "Informa a combinação de teclado associada a um controle.",
      "Atalho ajuda a descobrir uma forma mais rápida de executar a ação.",
      "Communicates the keyboard combination associated with a control.",
      "Shortcut helps users discover a faster way to perform the action.",
    ),
    explanation: explanation(
      "Explica brevemente por que um resultado ou comportamento existe.",
      "A explicação oferece contexto adicional sob demanda.",
      "Briefly explains why a result or behavior exists.",
      "The explanation provides additional context on demand.",
    ),
  },
  "confidence-badge": {
    calibrate: explanation(
      "Expressa o nível de confiança segundo uma escala definida.",
      "O valor ajuda a interpretar força e limite da estimativa.",
      "Expresses confidence according to a defined scale.",
      "The value helps interpret the strength and limits of the estimate.",
    ),
    warn: explanation(
      "Destaca quando a confiança é insuficiente para uma decisão segura.",
      "Risco de confiança incentiva revisão antes de agir.",
      "Highlights when confidence is insufficient for a safe decision.",
      "Confidence risk encourages review before acting.",
    ),
    "support trust": explanation(
      "Apoia confiança informada ao tornar a incerteza explícita.",
      "Evidência de confiança apresenta o valor sem prometer certeza.",
      "Supports informed trust by making uncertainty explicit.",
      "Confidence evidence presents the value without promising certainty.",
    ),
  },
  "command-palette": {
    navigate: explanation(
      "Localiza e abre rapidamente destinos do produto.",
      "Ir para permite acessar uma página sem percorrer toda a navegação.",
      "Quickly finds and opens product destinations.",
      "Go to reaches a page without traversing the full navigation.",
    ),
    search: explanation(
      "Pesquisa itens indexados a partir de uma consulta textual.",
      "Buscar comando reduz a lista conforme o usuário digita.",
      "Searches indexed items from a text query.",
      "Search command narrows the list as the user types.",
    ),
    execute: explanation(
      "Localiza e dispara uma ação diretamente.",
      "Executar ação transforma o resultado selecionado em um comando.",
      "Finds and triggers an action directly.",
      "Execute action turns the selected result into a command.",
    ),
  },
  "source-attribution": {
    trace: explanation(
      "Mostra de onde uma informação se originou.",
      "A atribuição conecta o conteúdo ao seu registro de origem.",
      "Shows where information originated.",
      "Attribution connects content to its source record.",
    ),
    verify: explanation(
      "Permite conferir se a origem sustenta o conteúdo apresentado.",
      "Fonte verificada oferece acesso ao contexto necessário para validação.",
      "Allows checking whether the source supports the presented content.",
      "Verified source provides the context needed for validation.",
    ),
    inspect: explanation(
      "Abre metadados e detalhes adicionais sobre a origem.",
      "Inspecionar trecho revela informações sem sobrecarregar a visão inicial.",
      "Opens metadata and additional details about the source.",
      "Inspect excerpt reveals information without overloading the initial view.",
    ),
  },
  "audit-panel": {
    audit: explanation(
      "Expõe as etapas e registros que produziram um resultado.",
      "Trilha de decisão organiza eventos para revisão posterior.",
      "Exposes the stages and records that produced an outcome.",
      "Decision trail organizes events for later review.",
    ),
    govern: explanation(
      "Apoia supervisão de regras, responsabilidades e conformidade.",
      "Governança permite verificar se o processo seguiu os critérios definidos.",
      "Supports oversight of rules, responsibilities, and compliance.",
      "Governance checks whether the process followed defined criteria.",
    ),
    debug: explanation(
      "Ajuda a investigar falhas ou comportamentos inesperados.",
      "Diagnóstico identifica em qual etapa ocorreu uma divergência.",
      "Helps investigate failures or unexpected behavior.",
      "Diagnostics identifies the stage where a divergence occurred.",
    ),
  },
  typography: {
    hierarchy: explanation(
      "Diferencia níveis de importância e estrutura do conteúdo.",
      "Heading torna títulos e subseções reconhecíveis durante a leitura.",
      "Differentiates levels of importance and content structure.",
      "Heading makes titles and subsections recognizable while reading.",
    ),
    reading: explanation(
      "Prioriza legibilidade e ritmo em textos contínuos.",
      "Body mantém tamanho e entrelinha adequados para leitura prolongada.",
      "Prioritizes legibility and rhythm in continuous text.",
      "Body maintains suitable size and line height for extended reading.",
    ),
    metadata: explanation(
      "Apresenta informações auxiliares com menor ênfase visual.",
      "Labels e captions identificam contexto sem competir com o conteúdo principal.",
      "Presents supporting information with lower visual emphasis.",
      "Labels and captions identify context without competing with primary content.",
    ),
  },
  icon: {
    action: explanation(
      "Representa visualmente uma ação conhecida.",
      "O ícone reforça o rótulo, mas não substitui o nome acessível.",
      "Visually represents a familiar action.",
      "The icon reinforces the label but does not replace the accessible name.",
    ),
    status: explanation(
      "Comunica uma condição ou resultado do sistema.",
      "O símbolo de status acompanha texto para evitar dependência visual.",
      "Communicates a system condition or outcome.",
      "The status symbol accompanies text to avoid visual-only meaning.",
    ),
    category: explanation(
      "Ajuda a reconhecer e distinguir tipos de conteúdo.",
      "O símbolo de categoria cria consistência entre itens relacionados.",
      "Helps recognize and distinguish content types.",
      "The category symbol creates consistency across related items.",
    ),
  },
};

export function getIntentExplanation(
  componentId: ComponentId,
  intent: string,
  locale: Locale,
): IntentExplanation {
  const localized = INTENT_EXPLANATIONS[componentId][intent.trim().toLowerCase()];
  if (localized) return locale === "en-US" ? localized.en : localized.pt;

  return locale === "en-US"
    ? {
        description: "Describes the purpose this component serves in the current context.",
        example: "The preview demonstrates how this intent changes component usage.",
      }
    : {
        description: "Descreve a finalidade que este componente atende no contexto atual.",
        example: "O preview demonstra como esse intent altera o uso do componente.",
      };
}
