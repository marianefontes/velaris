import type { Locale } from "../i18n/translations";
import type { ComponentId } from "./componentWorkbench";
import {
  getComponentMetadataById,
  getComponentMetadataList,
  localizedText,
  type LocalizedRule,
} from "./componentMetadata";

export type ComponentPracticeIcon =
  | "action"
  | "clarity"
  | "confirm"
  | "content"
  | "focus"
  | "hierarchy"
  | "misuse"
  | "motion"
  | "semantics"
  | "state";

export interface ComponentPracticeItem {
  icon: ComponentPracticeIcon;
  title: string;
  description: string;
}

interface LocalizedPracticeTitles {
  pt: readonly [string, string, string, string, string];
  en: readonly [string, string, string, string, string];
}

interface ComponentPracticeTitles {
  dos: LocalizedPracticeTitles;
  donts: LocalizedPracticeTitles;
}

const DO_ICONS: readonly ComponentPracticeIcon[] = [
  "action",
  "hierarchy",
  "state",
  "confirm",
  "clarity",
];

const DONT_ICONS: readonly ComponentPracticeIcon[] = [
  "misuse",
  "hierarchy",
  "state",
  "semantics",
  "content",
];

const localizedTitles = (
  pt: readonly [string, string, string, string, string],
  en: readonly [string, string, string, string, string],
): LocalizedPracticeTitles => ({ pt, en });

const practiceTitles = (
  dosPt: readonly [string, string, string, string, string],
  dosEn: readonly [string, string, string, string, string],
  dontsPt: readonly [string, string, string, string, string],
  dontsEn: readonly [string, string, string, string, string],
): ComponentPracticeTitles => ({
  dos: localizedTitles(dosPt, dosEn),
  donts: localizedTitles(dontsPt, dontsEn),
});

const PRACTICE_TITLES: Record<ComponentId, ComponentPracticeTitles> = {
  button: practiceTitles(
    ["Preserve uma prioridade", "Mostre o processamento", "Confirme resultados positivos", "Reserve o negativo", "Mantenha o texto direto"],
    ["Preserve one priority", "Show processing", "Confirm positive outcomes", "Reserve negative intent", "Keep text direct"],
    ["Não navegue com Button", "Não multiplique primários", "Explique indisponibilidade", "Não decore com intents", "Não ignore os tokens"],
    ["Do not navigate with Button", "Do not multiply primaries", "Explain unavailability", "Do not decorate with intents", "Do not ignore tokens"],
  ),
  "toggle-switch": practiceTitles(
    ["Aplique a mudança na hora", "Nomeie a condição", "Mostre o estado atual", "Mantenha perto do efeito", "Confirme a persistência"],
    ["Apply changes immediately", "Name the condition", "Show the current state", "Keep it near the effect", "Confirm persistence"],
    ["Não adie a confirmação", "Não amplie as alternativas", "Não use rótulos vagos", "Não esconda consequências", "Não antecipe falhas"],
    ["Do not delay confirmation", "Do not expand alternatives", "Do not use vague labels", "Do not hide consequences", "Do not anticipate failures"],
  ),
  checkbox: practiceTitles(
    ["Mantenha escolhas independentes", "Amplie a área clicável", "Use mixed com precisão", "Explique seleção parcial", "Preserve consentimento"],
    ["Keep choices independent", "Expand the clickable area", "Use mixed precisely", "Explain partial selection", "Preserve consent"],
    ["Não force exclusividade", "Não simule um Switch", "Não pré-selecione consentimento", "Não trate mixed como opção", "Não oculte obrigatoriedade"],
    ["Do not force exclusivity", "Do not imitate a Switch", "Do not preselect consent", "Do not treat mixed as an option", "Do not hide requirements"],
  ),
  "radio-button": practiceTitles(
    ["Limite as alternativas", "Mantenha opções visíveis", "Agrupe com contexto", "Escolha defaults seguros", "Use rótulos paralelos"],
    ["Limit alternatives", "Keep options visible", "Group with context", "Choose safe defaults", "Use parallel labels"],
    ["Não permita seleção múltipla", "Não crie listas extensas", "Não remova a pergunta", "Não imponha uma escolha", "Não use para efeito imediato"],
    ["Do not allow multiple selection", "Do not create long lists", "Do not remove the question", "Do not force a choice", "Do not use for immediate effects"],
  ),
  "selectable-chip": practiceTitles(
    ["Use para filtros compactos", "Destaque a seleção", "Mantenha o conjunto curto", "Permita quebra de linha", "Nomeie o grupo"],
    ["Use for compact filters", "Emphasize selection", "Keep the set short", "Allow wrapping", "Name the group"],
    ["Não substitua ações", "Não imite badges passivos", "Não alongue os rótulos", "Não dependa só de cor", "Não esconda taxonomias extensas"],
    ["Do not replace actions", "Do not imitate passive badges", "Do not lengthen labels", "Do not rely only on color", "Do not hide large taxonomies"],
  ),
  "text-input": practiceTitles(
    ["Capture valores curtos", "Mantenha label persistente", "Escolha o tipo correto", "Oriente antes do erro", "Preserve o valor"],
    ["Capture short values", "Keep a persistent label", "Choose the right type", "Guide before errors", "Preserve the value"],
    ["Não capture textos longos", "Não use placeholder como label", "Não mostre erro sem correção", "Não valide agressivamente", "Não misture conceitos"],
    ["Do not capture long text", "Do not use placeholder as label", "Do not show errors without correction", "Do not validate aggressively", "Do not mix concepts"],
  ),
  "text-area": practiceTitles(
    ["Reserve espaço para contexto", "Ajuste a altura inicial", "Use limites com propósito", "Mantenha label e ajuda", "Preserve rascunhos"],
    ["Reserve room for context", "Set an appropriate initial height", "Use limits with purpose", "Keep label and help", "Preserve drafts"],
    ["Não capture dados curtos", "Não bloqueie o redimensionamento", "Não domine a página", "Não dependa de placeholder", "Não corte conteúdo em silêncio"],
    ["Do not capture short data", "Do not block resizing", "Do not dominate the page", "Do not rely on placeholder", "Do not truncate silently"],
  ),
  "select-dropdown": practiceTitles(
    ["Use listas previsíveis", "Mostre o valor atual", "Ordene com lógica", "Ofereça um estado inicial", "Preserve teclado e busca"],
    ["Use predictable lists", "Show the current value", "Order with logic", "Offer an initial state", "Preserve keyboard and search"],
    ["Não esconda escolhas simples", "Não oculte comparações", "Não use opção como label", "Não esconda indisponibilidade", "Não misture ações e valores"],
    ["Do not hide simple choices", "Do not hide comparisons", "Do not use an option as a label", "Do not hide unavailability", "Do not mix actions and values"],
  ),
  "date-picker": practiceTitles(
    ["Use contexto de calendário", "Permita digitação", "Comunique limites", "Respeite locale e fuso", "Preserve entradas válidas"],
    ["Use calendar context", "Allow typing", "Communicate limits", "Respect locale and timezone", "Preserve valid entries"],
    ["Não force meses sucessivos", "Não dependa só do calendário", "Não aceite datas inválidas", "Não normalize em silêncio", "Não confunda intervalos"],
    ["Do not force sequential months", "Do not rely only on the calendar", "Do not accept invalid dates", "Do not normalize silently", "Do not confuse ranges"],
  ),
  "form-field": practiceTitles(
    ["Mantenha a unidade do campo", "Conecte ajuda e erro", "Reserve espaço para mensagens", "Sinalize obrigatoriedade", "Leve foco ao problema"],
    ["Keep the field unified", "Connect help and error", "Reserve message space", "Signal requirements", "Move focus to the problem"],
    ["Não duplique mensagens", "Não dependa só de cor", "Não envolva conteúdo estático", "Não valide cedo demais", "Não apague valores com erro"],
    ["Do not duplicate messages", "Do not rely only on color", "Do not wrap static content", "Do not validate too early", "Do not clear invalid values"],
  ),
  link: practiceTitles(
    ["Use para navegação", "Descreva o destino", "Sinalize mudanças de contexto", "Mantenha o destino válido", "Amplie links isolados"],
    ["Use for navigation", "Describe the destination", "Signal context changes", "Keep the destination valid", "Expand standalone links"],
    ["Não dispare ações locais", "Não use texto genérico", "Não remova affordances", "Não surpreenda com nova janela", "Não simule disabled"],
    ["Do not trigger local actions", "Do not use generic text", "Do not remove affordances", "Do not surprise with a new window", "Do not imitate disabled"],
  ),
  tabs: practiceTitles(
    ["Use visões irmãs", "Priorize a aba útil", "Implemente teclado completo", "Preserve aba e foco", "Atualize o painel com clareza"],
    ["Use sibling views", "Prioritize the useful tab", "Implement complete keyboard support", "Preserve tab and focus", "Update the panel clearly"],
    ["Não represente etapas", "Não substitua navegação global", "Não esconda comparações", "Não comprima sem saída", "Não exponha painéis ocultos"],
    ["Do not represent steps", "Do not replace global navigation", "Do not hide comparisons", "Do not compress without an alternative", "Do not expose hidden panels"],
  ),
  card: practiceTitles(
    ["Agrupe uma entidade real", "Organize a hierarquia", "Use clique total com critério", "Associe ações relacionadas", "Adapte conteúdo responsivo"],
    ["Group a real entity", "Organize hierarchy", "Use whole-card clicks carefully", "Associate related actions", "Adapt responsive content"],
    ["Não envolva toda seção", "Não aninhe cards", "Não misture prioridades", "Não esconda a interatividade", "Não remova headings"],
    ["Do not wrap every section", "Do not nest cards", "Do not mix priorities", "Do not hide interactivity", "Do not remove headings"],
  ),
  "modal-dialog": practiceTitles(
    ["Use decisões curtas", "Ofereça saída previsível", "Gerencie o foco", "Mantenha conteúdo conciso", "Preserve erros no contexto"],
    ["Use short decisions", "Offer a predictable exit", "Manage focus", "Keep content concise", "Preserve errors in context"],
    ["Não prolongue o fluxo", "Não empilhe modais", "Não feche durante correção", "Não bloqueie informação simples", "Não perca o trigger"],
    ["Do not prolong the flow", "Do not stack dialogs", "Do not close during correction", "Do not block simple information", "Do not lose the trigger"],
  ),
  "data-table": practiceTitles(
    ["Use para comparação", "Mantenha cabeçalhos claros", "Priorize colunas no mobile", "Comunique ordenação", "Ofereça leitura responsiva"],
    ["Use for comparison", "Keep headers clear", "Prioritize mobile columns", "Communicate sorting", "Offer responsive reading"],
    ["Não use para narrativa", "Não transforme tudo em ação", "Não remova semântica", "Não corte valores críticos", "Não use status só por cor"],
    ["Do not use for narrative", "Do not turn everything into an action", "Do not remove semantics", "Do not truncate critical values", "Do not use color-only status"],
  ),
  alert: practiceTitles(
    ["Mantenha no contexto", "Calibre a severidade", "Ofereça ação útil", "Posicione perto da causa", "Permita dispensar com segurança"],
    ["Keep it in context", "Calibrate severity", "Offer a useful action", "Place it near the cause", "Allow safe dismissal"],
    ["Não anuncie tudo como urgente", "Não acumule alertas", "Não substitua Toast", "Não repita a mesma mensagem", "Não use texto vago"],
    ["Do not announce everything as urgent", "Do not accumulate alerts", "Do not replace Toast", "Do not repeat the same message", "Do not use vague text"],
  ),
  toast: practiceTitles(
    ["Confirme sem interromper", "Mantenha a mensagem curta", "Pause ações temporizadas", "Anuncie uma vez", "Limite a pilha"],
    ["Confirm without interrupting", "Keep the message short", "Pause timed actions", "Announce once", "Limit the stack"],
    ["Não esconda erros acionáveis", "Não inclua conteúdo longo", "Não dependa de auto-dismiss", "Não desapareça cedo demais", "Não roube foco"],
    ["Do not hide actionable errors", "Do not include long content", "Do not rely on auto-dismiss", "Do not disappear too soon", "Do not steal focus"],
  ),
  "skeleton-loader": practiceTitles(
    ["Represente a forma final", "Preserve a geometria", "Respeite reduced motion", "Anuncie a região", "Reserve dimensões reais"],
    ["Represent the final shape", "Preserve geometry", "Respect reduced motion", "Announce the region", "Reserve real dimensions"],
    ["Não masque operações rápidas", "Não invente outra estrutura", "Não anime após carregar", "Não anuncie cada bloco", "Não esconda falhas"],
    ["Do not mask fast operations", "Do not invent another structure", "Do not animate after loading", "Do not announce every block", "Do not hide failures"],
  ),
  "explanation-tooltip": practiceTitles(
    ["Explique conteúdo complementar", "Abra por foco e hover", "Mantenha o texto breve", "Proteja a área do trigger", "Feche com Escape"],
    ["Explain complementary content", "Open on focus and hover", "Keep text brief", "Protect the trigger area", "Close with Escape"],
    ["Não esconda instruções", "Não inclua fluxos complexos", "Não dependa só de hover", "Não substitua labels", "Não prenda ajuda em disabled"],
    ["Do not hide instructions", "Do not include complex flows", "Do not rely only on hover", "Do not replace labels", "Do not trap help in disabled controls"],
  ),
  "confidence-badge": practiceTitles(
    ["Use calibração definida", "Explique a incerteza", "Abra a origem do valor", "Mostre atualização e fonte", "Mantenha faixas consistentes"],
    ["Use defined calibration", "Explain uncertainty", "Expose the value source", "Show update and source", "Keep ranges consistent"],
    ["Não prometa verdade", "Não substitua julgamento", "Não dependa de semáforo", "Não compare escalas distintas", "Não use precisão falsa"],
    ["Do not promise truth", "Do not replace judgment", "Do not rely on traffic-light color", "Do not compare different scales", "Do not use false precision"],
  ),
  "command-palette": practiceTitles(
    ["Use em produtos densos", "Indexe nomes e sinônimos", "Complete o fluxo por teclado", "Agrupe resultados", "Preserve consulta e erro"],
    ["Use in dense products", "Index names and synonyms", "Complete the flow by keyboard", "Group results", "Preserve query and errors"],
    ["Não substitua a navegação", "Não esconda ações essenciais", "Não remova contexto", "Não execute riscos sem confirmação", "Não sobrecarregue atalhos"],
    ["Do not replace navigation", "Do not hide essential actions", "Do not remove context", "Do not execute risky actions without confirmation", "Do not overload shortcuts"],
  ),
  "source-attribution": practiceTitles(
    ["Conecte afirmação e origem", "Mostre contexto verificável", "Use divulgação progressiva", "Exponha proveniência", "Ordene por relevância"],
    ["Connect claims and sources", "Show verifiable context", "Use progressive disclosure", "Expose provenance", "Order by relevance"],
    ["Não cite sem sustentação", "Não use como selo", "Não esconda a origem", "Não mostre URL crua", "Não limite a mouse"],
    ["Do not cite without support", "Do not use as a seal", "Do not hide the source", "Do not show raw URLs", "Do not limit access to mouse"],
  ),
  "audit-panel": practiceTitles(
    ["Apoie revisão e governança", "Organize a sequência", "Revele detalhes sob demanda", "Registre status e tempo", "Proteja dados sensíveis"],
    ["Support review and governance", "Organize the sequence", "Reveal details on demand", "Record status and time", "Protect sensitive data"],
    ["Não abra sempre", "Não exponha logs brutos", "Não omita conflitos", "Não exponha raciocínio privado", "Não confunda log e evidência"],
    ["Do not keep it always open", "Do not expose raw logs", "Do not omit conflicts", "Do not expose private reasoning", "Do not confuse logs and evidence"],
  ),
  typography: practiceTitles(
    ["Use tokens tipográficos", "Preserve headings semânticos", "Mantenha leitura confortável", "Respeite idioma e caracteres", "Suporte zoom e reflow"],
    ["Use typography tokens", "Preserve semantic headings", "Keep reading comfortable", "Respect language and characters", "Support zoom and reflow"],
    ["Não simule semântica", "Não crie valores arbitrários", "Não prolongue caixa alta", "Não reduza metadados demais", "Não force truncamento"],
    ["Do not imitate semantics", "Do not create arbitrary values", "Do not extend uppercase text", "Do not shrink metadata too far", "Do not force truncation"],
  ),
  icon: practiceTitles(
    ["Reforce significado conhecido", "Trate decoração corretamente", "Mantenha estilo consistente", "Ajuste alinhamento óptico", "Use metáforas estáveis"],
    ["Reinforce familiar meaning", "Treat decoration correctly", "Keep style consistent", "Adjust optical alignment", "Use stable metaphors"],
    ["Não substitua explicações", "Não misture estilos", "Não reduza o alvo", "Não dependa só de cor", "Não anime sem função"],
    ["Do not replace explanations", "Do not mix styles", "Do not shrink the target", "Do not rely only on color", "Do not animate without purpose"],
  ),
};

function buildPracticeItems(
  rules: LocalizedRule[] | null,
  titles: LocalizedPracticeTitles,
  icons: readonly ComponentPracticeIcon[],
  locale: Locale,
): ComponentPracticeItem[] {
  if (!rules || rules.length !== 5) return [];
  const localized = locale === "en-US" ? titles.en : titles.pt;
  return rules.map((rule, index) => ({
    icon: icons[index] ?? "clarity",
    title: localized[index],
    description: localizedText(rule.text, locale),
  }));
}

export function getComponentPractices(
  componentId: ComponentId,
  locale: Locale,
): { dos: ComponentPracticeItem[]; donts: ComponentPracticeItem[] } {
  const component = getComponentMetadataById(componentId);
  const titles = PRACTICE_TITLES[componentId];
  if (!component || !titles) return { dos: [], donts: [] };
  return {
    dos: buildPracticeItems(component.do, titles.dos, DO_ICONS, locale),
    donts: buildPracticeItems(component.dont, titles.donts, DONT_ICONS, locale),
  };
}

export function validateComponentPracticePresentation(): void {
  getComponentMetadataList().forEach((component) => {
    const componentId = component.component_id;
    const titles = PRACTICE_TITLES[componentId];
    if (!titles) throw new Error(`Missing practice presentation for ${componentId}`);
    if (component.do?.length !== 5 || component.dont?.length !== 5) {
      throw new Error(`${componentId} must define exactly five dos and five donts`);
    }
    if (titles.dos.pt.length !== 5 || titles.dos.en.length !== 5) {
      throw new Error(`${componentId} must define five localized do titles`);
    }
    if (titles.donts.pt.length !== 5 || titles.donts.en.length !== 5) {
      throw new Error(`${componentId} must define five localized dont titles`);
    }
  });
}
