import type { Locale } from "../i18n/translations";
import type { ComponentId } from "./componentWorkbench";

export interface ComponentUsageGuidance {
  do: string[];
  dont: string[];
}

interface LocalizedGuidance {
  pt: ComponentUsageGuidance;
  en: ComponentUsageGuidance;
}

const guidance = (
  ptDo: string[],
  ptDont: string[],
  enDo: string[],
  enDont: string[],
): LocalizedGuidance => ({
  pt: { do: ptDo, dont: ptDont },
  en: { do: enDo, dont: enDont },
});

const COMPONENT_USAGE_GUIDANCE: Record<ComponentId, LocalizedGuidance> = {
  button: guidance(
    [
      "Use Button para ações explícitas como salvar, confirmar, enviar, gerar ou avançar.",
      "Use apenas uma ação primária por região visual para manter a hierarquia clara.",
      "Use loading quando a ação disparar uma operação assíncrona.",
      "Use positive para confirmar conclusão, aprovação, restauração ou uma ação benéfica inequívoca.",
      "Use negative apenas para ações críticas, como excluir, cancelar definitivamente ou remover dados.",
      "Mantenha o texto do botão curto, direto e orientado à ação.",
    ],
    [
      "Não use Button para navegação textual simples; use Link quando a ação for apenas navegar.",
      "Não coloque múltiplos botões primary competindo na mesma área.",
      "Não use disabled sem explicar por que a ação está indisponível.",
      "Não use positive como decoração ou para ações neutras.",
      "Não use negative para ações comuns ou facilmente reversíveis.",
      "Não altere estilos manualmente fora dos tokens do design system.",
    ],
    [
      "Use Button for explicit actions such as saving, confirming, submitting, generating, or advancing.",
      "Use only one primary action per visual region to preserve clear hierarchy.",
      "Use loading when the action starts an asynchronous operation.",
      "Use positive to confirm completion, approval, restoration, or another clearly beneficial action.",
      "Use negative only for critical actions such as deleting, permanently canceling, or removing data.",
      "Keep Button text short, direct, and action-oriented.",
    ],
    [
      "Do not use Button for simple text navigation; use Link when the action only changes destination.",
      "Do not place multiple competing primary Buttons in the same area.",
      "Do not use disabled without explaining why the action is unavailable.",
      "Do not use positive as decoration or for neutral actions.",
      "Do not use negative for common or easily reversible actions.",
      "Do not manually override styles outside the design-system tokens.",
    ],
  ),
  "toggle-switch": guidance(
    [
      "Use Switch para configurações binárias que entram em vigor imediatamente.",
      "Escreva o rótulo como a condição controlada, por exemplo, “Reduzir animações”.",
      "Mostre o estado atual por posição, contraste e texto quando a consequência não for óbvia.",
    ],
    [
      "Não use Switch quando a alteração depender de um botão Salvar ou Confirmar.",
      "Não use Switch para escolher entre três ou mais alternativas; use Radio ou Select.",
      "Não use rótulos vagos como “Ativar” sem indicar o que será ativado.",
    ],
    [
      "Use Switch for binary settings that take effect immediately.",
      "Write the label as the controlled condition, such as “Reduce motion”.",
      "Show the current state through position, contrast, and text when the outcome is not obvious.",
    ],
    [
      "Do not use Switch when the change depends on a Save or Confirm action.",
      "Do not use Switch for three or more alternatives; use Radio or Select.",
      "Do not use vague labels such as “Enable” without naming what will be enabled.",
    ],
  ),
  checkbox: guidance(
    [
      "Use Checkbox quando cada opção puder ser selecionada de forma independente.",
      "Amplie a área clicável incluindo o rótulo e preserve um alvo mínimo de 44px.",
      "Use indeterminate apenas para representar seleção parcial em grupos hierárquicos.",
    ],
    [
      "Não use Checkbox para opções mutuamente exclusivas; use Radio Button.",
      "Não use Checkbox para uma configuração com efeito imediato quando Switch comunicar melhor a mudança.",
      "Não pré-selecione consentimento ou aceite obrigatório em nome do usuário.",
    ],
    [
      "Use Checkbox when each option can be selected independently.",
      "Expand the clickable area through the label and preserve a 44px minimum target.",
      "Use indeterminate only to represent partial selection in hierarchical groups.",
    ],
    [
      "Do not use Checkbox for mutually exclusive options; use Radio Button.",
      "Do not use Checkbox for an immediate setting when Switch communicates the change better.",
      "Do not preselect consent or required acceptance on the user's behalf.",
    ],
  ),
  "radio-button": guidance(
    [
      "Use Radio Button para duas a cinco alternativas mutuamente exclusivas.",
      "Mantenha todas as opções visíveis quando a comparação entre elas ajudar a decisão.",
      "Agrupe opções relacionadas com legend e navegação por setas.",
    ],
    [
      "Não use Radio Button para seleção múltipla.",
      "Não apresente uma lista extensa que torne a página difícil de percorrer; use Select.",
      "Não deixe o grupo sem contexto ou pergunta que explique a escolha.",
    ],
    [
      "Use Radio Button for two to five mutually exclusive alternatives.",
      "Keep all options visible when comparing them supports the decision.",
      "Group related options with a legend and arrow-key navigation.",
    ],
    [
      "Do not use Radio Button for multiple selection.",
      "Do not present a long list that makes the page difficult to scan; use Select.",
      "Do not leave the group without context or a question explaining the choice.",
    ],
  ),
  "selectable-chip": guidance(
    [
      "Use chips selecionáveis para filtros rápidos, tags ou atributos curtos.",
      "Mantenha o estado selecionado evidente por preenchimento, borda e aria-pressed.",
      "Limite o conjunto para que todas as opções continuem fáceis de escanear.",
    ],
    [
      "Não use Chip como ação primária ou substituto de Button.",
      "Não misture badges informativos e chips interativos com aparência idêntica.",
      "Não use rótulos longos nem dezenas de chips em uma única linha.",
    ],
    [
      "Use selectable chips for quick filters, tags, or short attributes.",
      "Keep selected state evident through fill, border, and aria-pressed.",
      "Limit the set so every option remains easy to scan.",
    ],
    [
      "Do not use Chip as a primary action or Button replacement.",
      "Do not give passive badges and interactive chips an identical appearance.",
      "Do not use long labels or dozens of chips in one row.",
    ],
  ),
  "text-input": guidance(
    [
      "Use Text Input para valores curtos que cabem em uma linha.",
      "Mantenha label persistente e use placeholder apenas como exemplo.",
      "Escolha type, inputMode e autocomplete de acordo com o dado solicitado.",
    ],
    [
      "Não use Input para descrições extensas; use Text Area.",
      "Não substitua o label por placeholder, pois ele desaparece durante a digitação.",
      "Não apresente erro sem explicar como o valor pode ser corrigido.",
    ],
    [
      "Use Text Input for short values that fit on one line.",
      "Keep a persistent label and use placeholder only as an example.",
      "Choose type, inputMode, and autocomplete according to the requested data.",
    ],
    [
      "Do not use Input for extended descriptions; use Text Area.",
      "Do not replace the label with placeholder because it disappears while typing.",
      "Do not present an error without explaining how the value can be corrected.",
    ],
  ),
  "text-area": guidance(
    [
      "Use Text Area para descrições, justificativas, comentários e prompts extensos.",
      "Dimensione a altura inicial de acordo com a profundidade esperada da resposta.",
      "Ofereça contador ou limite apenas quando ele afetar a tarefa.",
    ],
    [
      "Não use Text Area para valores curtos ou dados estruturados.",
      "Não bloqueie redimensionamento quando o usuário puder precisar de mais espaço.",
      "Não use um campo muito alto sem necessidade, pois ele domina a página.",
    ],
    [
      "Use Text Area for descriptions, rationale, comments, and extended prompts.",
      "Size the initial height according to the expected depth of the answer.",
      "Provide a counter or limit only when it affects the task.",
    ],
    [
      "Do not use Text Area for short values or structured data.",
      "Do not block resizing when the user may need more space.",
      "Do not use an unnecessarily tall field that dominates the page.",
    ],
  ),
  "select-dropdown": guidance(
    [
      "Use Select para escolha única em listas médias ou longas com opções conhecidas.",
      "Mostre o valor selecionado no trigger e preserve busca quando a lista for extensa.",
      "Ordene as opções por frequência, lógica ou sequência reconhecível.",
    ],
    [
      "Não use Select para duas opções simples que cabem em Radio Button.",
      "Não esconda alternativas importantes que precisam ser comparadas lado a lado.",
      "Não use uma opção desabilitada como substituto de label ou instrução.",
    ],
    [
      "Use Select for single choice in medium or long lists with familiar options.",
      "Show the selected value in the trigger and support search for long lists.",
      "Order options by frequency, logic, or a recognizable sequence.",
    ],
    [
      "Do not use Select for two simple options that fit Radio Button.",
      "Do not hide important alternatives that need side-by-side comparison.",
      "Do not use a disabled option as a substitute for a label or instruction.",
    ],
  ),
  "date-picker": guidance(
    [
      "Use Date Picker quando calendário, disponibilidade ou intervalo ajudarem a escolha.",
      "Permita entrada digitada para usuários que já conhecem a data.",
      "Comunique formato, limites e datas indisponíveis antes da confirmação.",
    ],
    [
      "Não force navegação mensal para datas muito distantes.",
      "Não use apenas um calendário visual sem suporte completo a teclado.",
      "Não aceite uma data inválida sem indicar o formato ou limite correto.",
    ],
    [
      "Use Date Picker when calendar context, availability, or a range supports the choice.",
      "Allow typed entry for users who already know the date.",
      "Communicate format, limits, and unavailable dates before confirmation.",
    ],
    [
      "Do not force month-by-month navigation for distant dates.",
      "Do not use only a visual calendar without full keyboard support.",
      "Do not accept an invalid date without indicating the correct format or limit.",
    ],
  ),
  "form-field": guidance(
    [
      "Use Form Field para manter label, controle, ajuda e validação como uma unidade.",
      "Associe hint e erro ao controle com ids estáveis e aria-describedby.",
      "Reserve espaço para mensagens quando mudanças de layout prejudicarem a leitura.",
    ],
    [
      "Não duplique labels ou mensagens já fornecidas pelo controle filho.",
      "Não comunique erro apenas pela cor da borda.",
      "Não use Form Field para conteúdo somente leitura sem comportamento de formulário.",
    ],
    [
      "Use Form Field to keep label, control, help, and validation as one unit.",
      "Associate hint and error with stable ids and aria-describedby.",
      "Reserve message space when layout shifts would disrupt reading.",
    ],
    [
      "Do not duplicate labels or messages already provided by the child control.",
      "Do not communicate errors through border color alone.",
      "Do not use Form Field for read-only content without form behavior.",
    ],
  ),
  link: guidance(
    [
      "Use Link quando o resultado da interação for navegar para outro destino.",
      "Escreva um rótulo que descreva o destino mesmo fora do parágrafo.",
      "Sinalize download, nova janela ou destino externo quando isso afetar a expectativa.",
    ],
    [
      "Não use Link para enviar formulários ou alterar apenas o estado local.",
      "Não use textos genéricos como “clique aqui” ou “saiba mais” sem contexto.",
      "Não remova sublinhado ou foco sem oferecer outra indicação clara de interatividade.",
    ],
    [
      "Use Link when the interaction navigates to another destination.",
      "Write a label that describes the destination even outside its paragraph.",
      "Signal downloads, new windows, or external destinations when they affect expectations.",
    ],
    [
      "Do not use Link to submit forms or change only local state.",
      "Do not use generic text such as “click here” or “learn more” without context.",
      "Do not remove underline or focus without another clear interaction cue.",
    ],
  ),
  tabs: guidance(
    [
      "Use Tabs para alternar entre duas a seis visões irmãs no mesmo contexto.",
      "Mantenha rótulos curtos e coloque primeiro a aba mais útil ou frequente.",
      "Implemente tablist, aria-selected, painéis associados e navegação por setas.",
    ],
    [
      "Não use Tabs para etapas sequenciais; use um fluxo passo a passo.",
      "Não use Tabs como navegação global do produto.",
      "Não esconda conteúdo que precisa ser comparado simultaneamente.",
    ],
    [
      "Use Tabs to switch between two to six sibling views in the same context.",
      "Keep labels short and place the most useful or frequent tab first.",
      "Implement tablist, aria-selected, associated panels, and arrow-key navigation.",
    ],
    [
      "Do not use Tabs for sequential steps; use a step flow.",
      "Do not use Tabs as global product navigation.",
      "Do not hide content that needs simultaneous comparison.",
    ],
  ),
  card: guidance(
    [
      "Use Card para agrupar conteúdo e ações pertencentes à mesma entidade.",
      "Mantenha título, metadados e ações em uma hierarquia previsível.",
      "Torne o card inteiro clicável apenas quando houver um único destino inequívoco.",
    ],
    [
      "Não envolva toda seção em Card apenas para criar bordas.",
      "Não aninhe cards dentro de cards.",
      "Não misture várias ações concorrentes sem indicar qual é a principal.",
    ],
    [
      "Use Card to group content and actions belonging to the same entity.",
      "Keep title, metadata, and actions in a predictable hierarchy.",
      "Make the whole card clickable only when there is one unambiguous destination.",
    ],
    [
      "Do not wrap every section in a Card merely to add borders.",
      "Do not nest cards inside cards.",
      "Do not mix several competing actions without indicating the primary one.",
    ],
  ),
  "modal-dialog": guidance(
    [
      "Use Dialog para decisões curtas que precisam ser concluídas ou canceladas antes de continuar.",
      "Forneça título claro, ação principal, cancelamento e fechamento previsível.",
      "Prenda o foco, aceite Escape e restaure o foco ao elemento de origem.",
    ],
    [
      "Não use Dialog para conteúdo longo, navegação ou tarefas com várias etapas.",
      "Não empilhe modais nem abra um segundo dialog sobre o primeiro.",
      "Não feche automaticamente enquanto o usuário estiver corrigindo um erro.",
    ],
    [
      "Use Dialog for short decisions that must be completed or canceled before continuing.",
      "Provide a clear title, primary action, cancellation, and predictable closing.",
      "Trap focus, support Escape, and restore focus to the triggering element.",
    ],
    [
      "Do not use Dialog for long content, navigation, or multi-step tasks.",
      "Do not stack modals or open a second dialog over the first.",
      "Do not close automatically while the user is correcting an error.",
    ],
  ),
  "data-table": guidance(
    [
      "Use Data Table quando comparar valores por linha e coluna for a tarefa principal.",
      "Mantenha cabeçalhos visíveis, alinhamento consistente e ordenação explícita.",
      "Priorize colunas no mobile e ofereça uma alternativa para dados menos importantes.",
    ],
    [
      "Não use Table para narrativas ou poucos pares de rótulo e valor.",
      "Não transforme cada célula em uma ação concorrente.",
      "Não remova caption, cabeçalhos ou semântica para reproduzir um layout visual.",
    ],
    [
      "Use Data Table when comparing values by row and column is the primary task.",
      "Keep headers visible, alignment consistent, and sorting explicit.",
      "Prioritize columns on mobile and provide an alternative for lower-priority data.",
    ],
    [
      "Do not use Table for narratives or a few label-value pairs.",
      "Do not turn every cell into a competing action.",
      "Do not remove caption, headers, or semantics to reproduce a visual layout.",
    ],
  ),
  alert: guidance(
    [
      "Use Alert para feedback importante que deve permanecer visível no contexto.",
      "Escolha severidade pela consequência real e inclua texto além da cor.",
      "Inclua uma ação apenas quando ela ajudar a resolver ou compreender a mensagem.",
    ],
    [
      "Não use role alert para mensagens informativas sem urgência.",
      "Não exiba vários alertas concorrentes sem consolidar prioridades.",
      "Não use Alert para confirmações transitórias que cabem em Toast.",
    ],
    [
      "Use Alert for important feedback that must remain visible in context.",
      "Choose severity from the real consequence and include text beyond color.",
      "Include an action only when it helps resolve or understand the message.",
    ],
    [
      "Do not use alert role for non-urgent informational messages.",
      "Do not show several competing alerts without consolidating priorities.",
      "Do not use Alert for transient confirmations better handled by Toast.",
    ],
  ),
  toast: guidance(
    [
      "Use Toast para confirmar uma mudança recente sem interromper o fluxo.",
      "Mantenha a mensagem curta e use live region compatível com a urgência.",
      "Pause o tempo ou mantenha o toast visível quando houver uma ação como Desfazer.",
    ],
    [
      "Não use Toast para erros que exigem correção imediata.",
      "Não coloque conteúdo longo ou várias ações dentro da notificação.",
      "Não dependa apenas de auto-dismiss para informação que o usuário precisará consultar.",
    ],
    [
      "Use Toast to confirm a recent change without interrupting the flow.",
      "Keep the message short and use a live region appropriate to its urgency.",
      "Pause timing or keep the toast visible when it contains an action such as Undo.",
    ],
    [
      "Do not use Toast for errors requiring immediate correction.",
      "Do not place long content or several actions inside the notification.",
      "Do not rely on auto-dismiss for information the user will need to consult.",
    ],
  ),
  "skeleton-loader": guidance(
    [
      "Use Skeleton quando a geometria final do conteúdo for previsível.",
      "Faça os blocos provisórios refletirem a estrutura que será carregada.",
      "Marque a região como busy e respeite prefers-reduced-motion.",
    ],
    [
      "Não use Skeleton para operações instantâneas ou duração totalmente desconhecida.",
      "Não simule uma estrutura diferente do conteúdo final.",
      "Não mantenha animação depois que o conteúdo estiver disponível.",
    ],
    [
      "Use Skeleton when the final content geometry is predictable.",
      "Make provisional blocks reflect the structure that will load.",
      "Mark the region as busy and respect prefers-reduced-motion.",
    ],
    [
      "Do not use Skeleton for instant operations or completely unknown duration.",
      "Do not simulate a structure different from the final content.",
      "Do not keep animation running after content becomes available.",
    ],
  ),
  "explanation-tooltip": guidance(
    [
      "Use Tooltip para definições curtas, atalhos ou explicações complementares.",
      "Abra por hover e foco e conecte o conteúdo com aria-describedby.",
      "Mantenha o texto breve e permita fechamento quando ele permanecer aberto.",
    ],
    [
      "Não esconda instruções essenciais apenas dentro do Tooltip.",
      "Não coloque formulários, links complexos ou conteúdo longo na bolha.",
      "Não dependa exclusivamente de hover, pois ele não existe em toque.",
    ],
    [
      "Use Tooltip for short definitions, shortcuts, or supporting explanations.",
      "Open on hover and focus and connect content with aria-describedby.",
      "Keep text brief and allow dismissal when it remains open.",
    ],
    [
      "Do not hide essential instructions only inside a Tooltip.",
      "Do not place forms, complex links, or long content in the bubble.",
      "Do not depend exclusively on hover because it does not exist on touch.",
    ],
  ),
  "confidence-badge": guidance(
    [
      "Use Confidence Badge apenas quando houver um método definido de calibração.",
      "Apresente faixa ou linguagem de incerteza junto ao valor.",
      "Ofereça acesso à explicação sobre origem, escala e limitações da confiança.",
    ],
    [
      "Não apresente percentual como probabilidade objetiva de verdade.",
      "Não use confiança para substituir inspeção de fonte ou julgamento humano.",
      "Não dependa apenas de verde, amarelo e vermelho para comunicar a faixa.",
    ],
    [
      "Use Confidence Badge only when a defined calibration method exists.",
      "Present a tier or uncertainty language alongside the value.",
      "Provide access to an explanation of confidence origin, scale, and limitations.",
    ],
    [
      "Do not present a percentage as an objective probability of truth.",
      "Do not use confidence to replace source inspection or human judgment.",
      "Do not rely only on green, yellow, and red to communicate the tier.",
    ],
  ),
  "command-palette": guidance(
    [
      "Use Command Palette em produtos densos com muitos destinos ou ações recorrentes.",
      "Suporte busca por nomes, sinônimos, grupos e atalhos de teclado.",
      "Mantenha seleção ativa, resultado vazio e execução acessíveis por teclado.",
    ],
    [
      "Não use Command Palette como substituto da navegação principal.",
      "Não esconda nela ações essenciais que não aparecem em nenhum outro lugar.",
      "Não mostre resultados sem contexto suficiente para distinguir comandos parecidos.",
    ],
    [
      "Use Command Palette in dense products with many destinations or recurring actions.",
      "Support search by names, synonyms, groups, and keyboard shortcuts.",
      "Keep active selection, empty results, and execution keyboard accessible.",
    ],
    [
      "Do not use Command Palette as a replacement for primary navigation.",
      "Do not hide essential actions there when they appear nowhere else.",
      "Do not show results without enough context to distinguish similar commands.",
    ],
  ),
  "source-attribution": guidance(
    [
      "Use Source Attribution para conectar uma afirmação à origem que a sustenta.",
      "Mostre título, trecho, relevância e ação para inspecionar o contexto completo.",
      "Use disclosure progressivo para equilibrar rastreabilidade e densidade.",
    ],
    [
      "Não cite uma fonte que não sustenta diretamente a afirmação.",
      "Não use atribuição como decoração ou selo genérico de confiança.",
      "Não esconda origem e trecho atrás de rótulos vagos ou links sem contexto.",
    ],
    [
      "Use Source Attribution to connect a claim to the origin that supports it.",
      "Show title, excerpt, relevance, and an action to inspect full context.",
      "Use progressive disclosure to balance traceability and density.",
    ],
    [
      "Do not cite a source that does not directly support the claim.",
      "Do not use attribution as decoration or a generic trust seal.",
      "Do not hide origin and excerpt behind vague labels or context-free links.",
    ],
  ),
  "audit-panel": guidance(
    [
      "Use Audit Panel para revisão, governança e investigação de decisões.",
      "Organize eventos em sequência com entradas, saídas, status e responsáveis.",
      "Permita expandir detalhes sem competir com a resposta principal.",
    ],
    [
      "Não mantenha o painel aberto por padrão em toda interação simples.",
      "Não exponha logs técnicos sem tradução para o público da interface.",
      "Não omita conflitos, falhas ou etapas incompletas da trilha.",
    ],
    [
      "Use Audit Panel for review, governance, and decision investigation.",
      "Organize events in sequence with inputs, outputs, status, and ownership.",
      "Allow details to expand without competing with the primary response.",
    ],
    [
      "Do not keep the panel open by default for every simple interaction.",
      "Do not expose technical logs without translating them for the interface audience.",
      "Do not omit conflicts, failures, or incomplete stages from the trail.",
    ],
  ),
  typography: guidance(
    [
      "Use tokens tipográficos para comunicar hierarquia, leitura e metadados de forma consistente.",
      "Preserve ordem semântica de headings independentemente do tamanho visual.",
      "Mantenha tamanho, line-height e comprimento de linha adequados ao conteúdo.",
    ],
    [
      "Não crie hierarquia apenas com tamanho ou peso sem semântica.",
      "Não introduza valores arbitrários fora da escala tipográfica.",
      "Não use caixa alta extensa em textos de leitura contínua.",
    ],
    [
      "Use typography tokens to communicate hierarchy, reading, and metadata consistently.",
      "Preserve semantic heading order regardless of visual size.",
      "Keep size, line height, and line length appropriate to the content.",
    ],
    [
      "Do not create hierarchy through size or weight without semantics.",
      "Do not introduce arbitrary values outside the type scale.",
      "Do not use extended uppercase text for continuous reading.",
    ],
  ),
  icon: guidance(
    [
      "Use Icon para reforçar uma ação, status ou categoria já compreensível.",
      "Oculte ícones decorativos e forneça nome acessível aos interativos.",
      "Mantenha tamanho, stroke e alinhamento consistentes com os tokens.",
    ],
    [
      "Não use um ícone ambíguo como única explicação de uma ação.",
      "Não misture estilos preenchidos e lineares sem significado semântico.",
      "Não reduza o alvo clicável ao tamanho visual do glyph.",
    ],
    [
      "Use Icon to reinforce an already understandable action, status, or category.",
      "Hide decorative icons and provide accessible names for interactive ones.",
      "Keep size, stroke, and alignment consistent with tokens.",
    ],
    [
      "Do not use an ambiguous icon as the only explanation of an action.",
      "Do not mix filled and outline styles without semantic meaning.",
      "Do not reduce the clickable target to the visual glyph size.",
    ],
  ),
};

export function getComponentUsageGuidance(
  componentId: ComponentId,
  locale: Locale,
): ComponentUsageGuidance {
  const localized = COMPONENT_USAGE_GUIDANCE[componentId];
  return locale === "en-US" ? localized.en : localized.pt;
}
