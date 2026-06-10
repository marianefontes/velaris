#!/usr/bin/env python3
"""Expand component accessibility metadata with rich, component-specific items."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CATALOG_PATH = ROOT / "data" / "component-metadata.json"

AccessibilityIcon = str
Item = dict[str, object]


def item(
    component_id: str,
    slug: str,
    title_pt: str,
    title_en: str,
    desc_pt: str,
    desc_en: str,
    icon: AccessibilityIcon = "quality",
    applies_to: list[str] | None = None,
    severity: str = "essential",
) -> Item:
    return {
        "id": f"{component_id}.accessibility.item.{slug}",
        "title": {"pt": title_pt, "en": title_en},
        "description": {"pt": desc_pt, "en": desc_en},
        "icon": icon,
        "applies_to": applies_to or ["developer", "qa"],
        "severity": severity,
    }


ACCESSIBILITY_ITEMS: dict[str, list[Item]] = {
    "button": [
        item(
            "button", "semantics", "Elemento correto", "Correct element",
            "Use o botão nativo do HTML (<button>) para ações. Não simule clique com div ou span.",
            "Use the native HTML button (<button>) for actions. Do not simulate clicks with div or span.",
            "semantics",
        ),
        item(
            "button", "keyboard", "Teclado", "Keyboard",
            "Enter e Espaço disparam a ação. O indicador de foco permanece visível antes e depois do clique.",
            "Enter and Space trigger the action. The focus indicator stays visible before and after activation.",
            "keyboard",
        ),
        item(
            "button", "name", "Nome da ação", "Action name",
            "O texto do botão deve dizer o que acontece ao clicar. Se só houver ícone, inclua aria-label equivalente.",
            "Button text must say what happens on click. If icon-only, include an equivalent aria-label.",
            "semantics",
            ["developer", "designer", "qa"],
        ),
        item(
            "button", "disabled", "Estado desativado", "Disabled state",
            "Use o atributo disabled de verdade. Quando possível, explique por que a ação não está disponível.",
            "Use the disabled attribute for real. When possible, explain why the action is unavailable.",
            "quality",
        ),
        item(
            "button", "loading", "Carregando", "Loading",
            "Durante o processamento, informe que a ação está em andamento (aria-busy) sem remover o nome da ação.",
            "During processing, signal that the action is in progress (aria-busy) without removing the action name.",
            "semantics",
        ),
        item(
            "button", "navigation", "Navegação vs ação", "Navigation vs action",
            "Para ir a outra página ou seção, use Link. Button é para executar algo na tela atual.",
            "To go to another page or section, use Link. Button is for doing something on the current screen.",
            "quality",
            ["developer", "product-designer"],
        ),
    ],
    "toggle-switch": [
        item(
            "toggle-switch", "semantics", "Controle de alternância", "Toggle control",
            "Use o controle nativo de switch ou equivalente com estado ligado/desligado anunciável ao leitor de tela.",
            "Use the native switch control or equivalent with on/off state announced to screen readers.",
            "semantics",
        ),
        item(
            "toggle-switch", "keyboard", "Teclado", "Keyboard",
            "Espaço alterna entre ligado e desligado. Enter confirma quando o switch está dentro de um formulário.",
            "Space toggles between on and off. Enter confirms when the switch is inside a form.",
            "keyboard",
        ),
        item(
            "toggle-switch", "label", "Rótulo claro", "Clear label",
            "O rótulo deve dizer o que muda ao alternar — por exemplo, \"Notificações por e-mail\", não só \"Ligado\".",
            "The label must say what changes when toggled — e.g. \"Email notifications\", not just \"On\".",
            "semantics",
            ["designer", "developer"],
        ),
        item(
            "toggle-switch", "state", "Estado visível", "Visible state",
            "Ligado e desligado precisam ser distinguíveis por mais do que cor ou posição do thumb.",
            "On and off must be distinguishable by more than color or thumb position.",
            "quality",
        ),
        item(
            "toggle-switch", "focus", "Foco visível", "Visible focus",
            "Foco, hover e estado ativo devem ter aparências diferentes entre si.",
            "Focus, hover, and active state should look different from each other.",
            "quality",
        ),
        item(
            "toggle-switch", "target", "Área de toque", "Touch target",
            "Mantenha pelo menos 44px de área clicável, incluindo o trilho do switch.",
            "Keep at least 44px of clickable area, including the switch track.",
            "quality",
            ["developer", "qa"],
        ),
    ],
    "checkbox": [
        item(
            "checkbox", "semantics", "Caixa de seleção", "Checkbox",
            "Use o checkbox nativo do HTML ou equivalente com estado marcado/desmarcado coerente.",
            "Use the native HTML checkbox or equivalent with consistent checked/unchecked state.",
            "semantics",
        ),
        item(
            "checkbox", "keyboard", "Teclado", "Keyboard",
            "Espaço marca ou desmarca. Em formulários, Enter envia sem alternar a caixa por acidente.",
            "Space checks or unchecks. In forms, Enter submits without accidentally toggling the box.",
            "keyboard",
        ),
        item(
            "checkbox", "mixed", "Seleção parcial", "Partial selection",
            "Quando parte de um grupo está marcada, comunique o estado \"parcialmente selecionado\" ao leitor de tela.",
            "When part of a group is checked, communicate \"partially selected\" state to screen readers.",
            "semantics",
        ),
        item(
            "checkbox", "label", "Rótulo clicável", "Clickable label",
            "O rótulo deve estar ligado à caixa — clicar no texto também marca/desmarca. Cada opção precisa de nome único.",
            "The label must be tied to the box — clicking the text also toggles it. Each option needs a unique name.",
            "semantics",
        ),
        item(
            "checkbox", "group", "Grupo de opções", "Option group",
            "Checkboxes relacionados compartilham um título de grupo visível, como \"Permissões de acesso\".",
            "Related checkboxes share a visible group title, such as \"Access permissions\".",
            "quality",
        ),
        item(
            "checkbox", "disabled", "Desativado", "Disabled",
            "Estado desativado impede interação e deve ser perceptível além da cor — opacidade, cursor ou texto auxiliar.",
            "Disabled state blocks interaction and must be perceptible beyond color — opacity, cursor, or helper text.",
            "quality",
        ),
    ],
    "radio-button": [
        item(
            "radio-button", "group", "Pergunta do grupo", "Group question",
            "As opções devem estar dentro de um grupo com título visível — a pergunta à qual o usuário responde.",
            "Options must sit inside a group with a visible title — the question the user is answering.",
            "semantics",
        ),
        item(
            "radio-button", "keyboard", "Navegação", "Navigation",
            "Setas movem o foco entre opções do mesmo grupo. Tab leva para o próximo campo fora do grupo.",
            "Arrow keys move focus among options in the same group. Tab goes to the next field outside the group.",
            "keyboard",
        ),
        item(
            "radio-button", "selection", "Escolha única", "Single choice",
            "Espaço seleciona a opção focada. Apenas uma opção pode estar marcada por vez no grupo.",
            "Space selects the focused option. Only one option can be selected at a time in the group.",
            "keyboard",
        ),
        item(
            "radio-button", "state", "Opção marcada", "Selected option",
            "A opção escolhida deve ser anunciada pelo leitor de tela — não dependa só de cor ou preenchimento.",
            "The chosen option must be announced by screen readers — do not rely on color or fill alone.",
            "quality",
        ),
        item(
            "radio-button", "error", "Mensagem de erro", "Error message",
            "Erros de validação do grupo ficam ligados ao conjunto de opções, não só à opção focada.",
            "Group validation errors are tied to the set of options, not only the focused option.",
            "semantics",
        ),
        item(
            "radio-button", "label", "Rótulo por opção", "Per-option label",
            "Cada opção precisa de texto que descreva a escolha — por exemplo, \"Entrega expressa (1–2 dias)\".",
            "Each option needs text describing the choice — e.g. \"Express delivery (1–2 days)\".",
            "semantics",
            ["designer", "developer"],
        ),
    ],
    "selectable-chip": [
        item(
            "selectable-chip", "toggle", "Chip alternável", "Toggleable chip",
            "Chips que ligam/desligam um filtro devem comunicar se estão selecionados ou não ao leitor de tela.",
            "Chips that turn a filter on/off must communicate selected state to screen readers.",
            "semantics",
        ),
        item(
            "selectable-chip", "single", "Escolha exclusiva", "Exclusive choice",
            "Quando só uma opção pode ser escolhida, prefira radio buttons em vez de chips independentes.",
            "When only one option can be chosen, prefer radio buttons over independent chips.",
            "semantics",
        ),
        item(
            "selectable-chip", "keyboard", "Teclado", "Keyboard",
            "Enter e Espaço alternam seleção. Foco visível deve ser distinto de hover e de selecionado.",
            "Enter and Space toggle selection. Visible focus must differ from hover and selected.",
            "keyboard",
        ),
        item(
            "selectable-chip", "state", "Estado selecionado", "Selected state",
            "Selecionado não pode depender só de cor — combine borda, peso, ícone ou fundo.",
            "Selected cannot rely on color alone — combine border, weight, icon, or background.",
            "quality",
            ["designer", "qa"],
        ),
        item(
            "selectable-chip", "name", "Nome da opção", "Option name",
            "Cada chip precisa de nome claro, inclusive quando mostra só ícone ou contagem (ex.: \"3 selecionados\").",
            "Each chip needs a clear name, including icon-only or count variants (e.g. \"3 selected\").",
            "semantics",
        ),
        item(
            "selectable-chip", "target", "Área de toque", "Touch target",
            "Em filtros densos, mantenha área confortável para toque — mínimo recomendado de 44px.",
            "In dense filters, keep a comfortable touch area — 44px minimum recommended.",
            "quality",
        ),
    ],
    "text-input": [
        item(
            "text-input", "label", "Rótulo do campo", "Field label",
            "Todo campo precisa de rótulo visível acima ou ao lado. Placeholder não substitui rótulo.",
            "Every field needs a visible label above or beside it. Placeholder does not replace a label.",
            "semantics",
        ),
        item(
            "text-input", "description", "Instrução e erro", "Instruction and error",
            "Texto de ajuda e mensagem de erro ficam ligados ao campo para o leitor de tela anunciar junto.",
            "Help text and error messages are tied to the field so screen readers announce them together.",
            "semantics",
        ),
        item(
            "text-input", "required", "Campo obrigatório", "Required field",
            "Indique obrigatoriedade no rótulo (ex.: asterisco + texto) e no atributo required quando aplicável.",
            "Mark required in the label (e.g. asterisk + text) and with the required attribute when applicable.",
            "quality",
        ),
        item(
            "text-input", "keyboard", "Teclado", "Keyboard",
            "Tab entra e sai do campo na ordem esperada. Atalhos internos não conflitam com navegação da página.",
            "Tab enters and exits the field in expected order. Internal shortcuts do not conflict with page navigation.",
            "keyboard",
        ),
        item(
            "text-input", "autocomplete", "Preenchimento automático", "Autocomplete",
            "Use autocomplete do navegador quando fizer sentido (e-mail, nome, endereço) para reduzir erros.",
            "Use browser autocomplete when it makes sense (email, name, address) to reduce errors.",
            "quality",
            ["developer", "product-designer"],
        ),
        item(
            "text-input", "focus", "Foco visível", "Visible focus",
            "O indicador de foco deve permanecer visível mesmo com borda de erro ou campo preenchido.",
            "The focus indicator must stay visible even with error border or filled field.",
            "quality",
        ),
    ],
    "text-area": [
        item(
            "text-area", "label", "Rótulo do campo", "Field label",
            "Rótulo visível descrevendo o que o usuário deve escrever — ex.: \"Descrição do problema\".",
            "Visible label describing what the user should write — e.g. \"Problem description\".",
            "semantics",
        ),
        item(
            "text-area", "description", "Instruções e limite", "Instructions and limit",
            "Limite de caracteres e orientações ficam ligados ao campo, não como texto solto sem relação.",
            "Character limits and guidance are tied to the field, not as unrelated loose text.",
            "semantics",
        ),
        item(
            "text-area", "keyboard", "Edição multilinha", "Multiline editing",
            "Enter cria nova linha. Se Enter enviar o formulário, documente isso perto do campo.",
            "Enter creates a new line. If Enter submits the form, document that near the field.",
            "keyboard",
        ),
        item(
            "text-area", "error", "Erro de validação", "Validation error",
            "Erro aparece em texto claro associado ao campo — borda vermelha sozinha não basta.",
            "Error appears as clear text tied to the field — red border alone is not enough.",
            "quality",
        ),
        item(
            "text-area", "resize", "Redimensionamento", "Resize",
            "Permita redimensionar sem quebrar layout crítico. Respeite preferência de movimento reduzido.",
            "Allow resizing without breaking critical layout. Respect reduced motion preference.",
            "quality",
        ),
        item(
            "text-area", "focus", "Foco persistente", "Persistent focus",
            "Indicador de foco visível durante digitação longa e revisões.",
            "Visible focus indicator during long typing and revisions.",
            "quality",
        ),
    ],
    "select-dropdown": [
        item(
            "select-dropdown", "native", "Lista nativa", "Native list",
            "Para listas simples, prefira o select nativo do HTML — já funciona com teclado e leitor de tela.",
            "For simple lists, prefer native HTML select — it already works with keyboard and screen readers.",
            "semantics",
        ),
        item(
            "select-dropdown", "combobox", "Lista customizada", "Custom list",
            "Se customizar, implemente abertura/fechamento, navegação por setas e opção selecionada anunciável.",
            "If customized, implement open/close, arrow navigation, and announced selected option.",
            "semantics",
        ),
        item(
            "select-dropdown", "keyboard", "Teclado", "Keyboard",
            "Setas navegam opções; Enter confirma; Escape fecha sem perder o valor já selecionado.",
            "Arrow keys navigate options; Enter confirms; Escape closes without losing the selected value.",
            "keyboard",
        ),
        item(
            "select-dropdown", "value", "Valor selecionado", "Selected value",
            "Ao abrir, o leitor de tela deve anunciar qual opção está selecionada. Repita após mudança.",
            "On open, screen readers must announce which option is selected. Repeat after change.",
            "semantics",
        ),
        item(
            "select-dropdown", "error", "Erro de validação", "Validation error",
            "Mensagem de erro fica ligada ao campo que abre a lista, não só à opção dentro dela.",
            "Error message is tied to the field that opens the list, not only to the option inside it.",
            "quality",
        ),
        item(
            "select-dropdown", "dismiss", "Fechamento previsível", "Predictable dismissal",
            "A lista não deve fechar sozinha enquanto o usuário navega por teclado ou leitor de tela.",
            "The list must not close on its own while the user navigates by keyboard or screen reader.",
            "quality",
        ),
    ],
    "date-picker": [
        item(
            "date-picker", "input", "Digitação manual", "Manual typing",
            "Permita digitar a data diretamente no campo — não force uso exclusivo do calendário ou mouse.",
            "Allow typing the date directly in the field — do not force calendar-only or mouse-only use.",
            "keyboard",
        ),
        item(
            "date-picker", "format", "Formato esperado", "Expected format",
            "Mostre o formato esperado (ex.: DD/MM/AAAA) e valide com mensagem clara quando a data for inválida.",
            "Show expected format (e.g. DD/MM/YYYY) and validate with a clear message when the date is invalid.",
            "semantics",
        ),
        item(
            "date-picker", "calendar", "Calendário por teclado", "Keyboard calendar",
            "No calendário, setas navegam dias; hoje, selecionado e desabilitado devem ser anunciáveis.",
            "In the calendar, arrows navigate days; today, selected, and disabled must be announced.",
            "keyboard",
        ),
        item(
            "date-picker", "focus", "Foco ao abrir/fechar", "Focus on open/close",
            "Ao abrir o calendário, leve o foco para ele. Ao fechar, devolva o foco ao campo de data.",
            "When opening the calendar, move focus to it. When closing, return focus to the date field.",
            "quality",
        ),
        item(
            "date-picker", "error", "Data inválida", "Invalid date",
            "Erro de data inválida aparece em texto ligado ao campo — não dependa só de cor.",
            "Invalid date error appears as text tied to the field — do not rely on color alone.",
            "semantics",
        ),
        item(
            "date-picker", "range", "Intervalo de datas", "Date range",
            "Em seleção de intervalo, anuncie data inicial, final e dias indisponíveis no meio.",
            "In range selection, announce start date, end date, and unavailable days in between.",
            "semantics",
            ["developer", "qa"],
        ),
    ],
    "form-field": [
        item(
            "form-field", "label", "Rótulo e campo", "Label and field",
            "Rótulo e input devem estar ligados — clicar no rótulo foca o campo correspondente.",
            "Label and input must be linked — clicking the label focuses the corresponding field.",
            "semantics",
        ),
        item(
            "form-field", "description", "Textos auxiliares", "Helper texts",
            "Instrução, contador de caracteres e erro ficam associados ao campo na ordem que faz sentido ler.",
            "Instruction, character counter, and error are associated with the field in sensible reading order.",
            "semantics",
        ),
        item(
            "form-field", "order", "Ordem de foco", "Focus order",
            "Tab segue a ordem visual. Campos que aparecem condicionalmente entram sem pular etapas.",
            "Tab follows visual order. Conditionally shown fields enter without skipping steps.",
            "keyboard",
        ),
        item(
            "form-field", "validation", "Validação", "Validation",
            "Estado válido/inválido é programático. Erro permanece visível até o usuário corrigir.",
            "Valid/invalid state is programmatic. Error stays visible until the user fixes it.",
            "quality",
        ),
        item(
            "form-field", "required", "Obrigatoriedade", "Requiredness",
            "Campo obrigatório indica isso no rótulo e no atributo required quando aplicável.",
            "Required fields indicate this in the label and with the required attribute when applicable.",
            "quality",
        ),
        item(
            "form-field", "group", "Campos relacionados", "Related fields",
            "Campos que pertencem juntos (ex.: endereço) compartilham um título de grupo visível.",
            "Fields that belong together (e.g. address) share a visible group title.",
            "semantics",
        ),
    ],
    "link": [
        item(
            "link", "semantics", "Link nativo", "Native link",
            "Use o link nativo do HTML (<a href>). Não simule navegação com botão ou span clicável.",
            "Use the native HTML link (<a href>). Do not simulate navigation with button or clickable span.",
            "semantics",
        ),
        item(
            "link", "destination", "Texto do link", "Link text",
            "O texto descreve para onde vai ou o que acontece — evite \"clique aqui\" ou \"saiba mais\" soltos.",
            "Text describes where it goes or what happens — avoid bare \"click here\" or \"learn more\".",
            "semantics",
            ["designer", "product-designer"],
        ),
        item(
            "link", "keyboard", "Teclado", "Keyboard",
            "Enter ativa o link. Foco visível distingue o link do texto normal ao redor.",
            "Enter activates the link. Visible focus distinguishes the link from surrounding normal text.",
            "keyboard",
        ),
        item(
            "link", "external", "Link externo", "External link",
            "Quando abrir outra aba ou site externo, avise no texto ou com ícone + texto alternativo.",
            "When opening a new tab or external site, warn in text or with icon + alternative text.",
            "quality",
        ),
        item(
            "link", "contrast", "Contraste e identificação", "Contrast and identification",
            "Contraste suficiente e sublinhado (ou outro indicador) além da cor para identificar links.",
            "Sufficient contrast and underline (or other indicator) beyond color to identify links.",
            "quality",
        ),
        item(
            "link", "button", "Link vs botão", "Link vs button",
            "Ação que não navega (salvar, excluir) deve ser botão — não link estilizado.",
            "Actions that do not navigate (save, delete) should be buttons — not styled links.",
            "quality",
            ["developer", "product-designer"],
        ),
    ],
    "tabs": [
        item(
            "tabs", "structure", "Abas e painéis", "Tabs and panels",
            "Cada aba controla um painel de conteúdo. O leitor de tela precisa saber qual aba está ativa e qual painel ela mostra.",
            "Each tab controls a content panel. Screen readers must know which tab is active and which panel it shows.",
            "semantics",
        ),
        item(
            "tabs", "keyboard", "Navegação", "Navigation",
            "Setas movem entre abas. Tab entra no conteúdo do painel ativo.",
            "Arrow keys move between tabs. Tab enters the active panel content.",
            "keyboard",
        ),
        item(
            "tabs", "selected", "Aba ativa", "Active tab",
            "A aba selecionada deve ser anunciada — não dependa só de cor, peso ou sublinhado.",
            "The selected tab must be announced — do not rely on color, weight, or underline alone.",
            "quality",
        ),
        item(
            "tabs", "relation", "Vínculo aba–painel", "Tab–panel link",
            "Cada aba aponta para seu painel correspondente para leitores de tela navegarem com contexto.",
            "Each tab points to its corresponding panel so screen readers navigate with context.",
            "semantics",
        ),
        item(
            "tabs", "focus", "Foco visível", "Visible focus",
            "Foco na aba e no painel deve ser claramente perceptível.",
            "Focus on tab and panel must be clearly perceptible.",
            "quality",
        ),
        item(
            "tabs", "hidden", "Painéis inativos", "Inactive panels",
            "Conteúdo de abas inativas não deve receber foco por teclado — oculte de forma acessível, não só visualmente.",
            "Inactive tab content must not receive keyboard focus — hide accessibly, not only visually.",
            "quality",
        ),
    ],
    "card": [
        item(
            "card", "structure", "Título do bloco", "Block title",
            "Cada card precisa de um título real (heading h2–h4), não só texto grande ou negrito. "
            "Assim quem usa leitor de tela entende do que se trata o conteúdo agrupado.",
            "Each card needs a real title (heading h2–h4), not just large or bold text. "
            "That way screen reader users understand what the grouped content is about.",
            "semantics",
        ),
        item(
            "card", "interactive", "Card clicável", "Clickable card",
            "Se o card inteiro for clicável, transforme-o em um único link ou botão com nome claro da ação.",
            "If the whole card is clickable, make it a single link or button with a clear action name.",
            "keyboard",
        ),
        item(
            "card", "hierarchy", "Ordem dos títulos", "Heading order",
            "Respeite a hierarquia de títulos da página (h2 antes de h3). Evite vários botões ou links competindo sem ordem clara.",
            "Respect page heading hierarchy (h2 before h3). Avoid several buttons or links competing without clear order.",
            "semantics",
        ),
        item(
            "card", "state", "Estados do card", "Card states",
            "Se o card for selecionável, expansível ou desativado, comunique isso por texto ou atributo — não só por cor ou sombra.",
            "If the card is selectable, expandable, or disabled, communicate it via text or attribute — not color or shadow alone.",
            "quality",
        ),
        item(
            "card", "contrast", "Contraste", "Contrast",
            "Texto, metadados e badges mantêm contraste legível sobre o fundo do card.",
            "Text, metadata, and badges maintain readable contrast on the card background.",
            "quality",
        ),
        item(
            "card", "focus", "Foco nas ações", "Action focus",
            "Botões e links dentro do card mantêm foco visível. O card inteiro não deve roubar foco de ações secundárias.",
            "Buttons and links inside the card keep visible focus. The whole card must not steal focus from secondary actions.",
            "keyboard",
        ),
    ],
    "modal-dialog": [
        item(
            "modal-dialog", "role", "Tipo de modal", "Modal type",
            "Modal informativo usa dialog padrão; avisos urgentes usam alertdialog para o leitor de tela priorizar.",
            "Informational modals use standard dialog; urgent warnings use alertdialog so screen readers prioritize them.",
            "semantics",
        ),
        item(
            "modal-dialog", "title", "Título visível", "Visible title",
            "Exiba um título claro no topo do modal — é como o leitor de tela anuncia a janela ao abrir.",
            "Show a clear title at the top of the modal — that is how screen readers announce the window on open.",
            "semantics",
        ),
        item(
            "modal-dialog", "trap", "Foco preso no modal", "Focus trapped in modal",
            "Enquanto aberto, o foco fica dentro do modal. O conteúdo atrás não recebe interação.",
            "While open, focus stays inside the modal. Content behind cannot be interacted with.",
            "keyboard",
        ),
        item(
            "modal-dialog", "escape", "Fechar com Escape", "Close with Escape",
            "Escape fecha quando seguro. Ações destrutivas exigem confirmação explícita antes de executar.",
            "Escape closes when safe. Destructive actions require explicit confirmation before executing.",
            "keyboard",
        ),
        item(
            "modal-dialog", "return", "Devolver foco", "Return focus",
            "Ao fechar, devolva o foco ao botão ou link que abriu o modal.",
            "On close, return focus to the button or link that opened the modal.",
            "quality",
        ),
        item(
            "modal-dialog", "background", "Fundo inativo", "Inactive background",
            "Não permita clicar, focar ou ler conteúdo da página enquanto o modal estiver aberto.",
            "Do not allow clicking, focusing, or reading page content while the modal is open.",
            "quality",
        ),
    ],
    "data-table": [
        item(
            "data-table", "structure", "Tabela semântica", "Semantic table",
            "Use tabela HTML com cabeçalhos de coluna marcados. Inclua título ou descrição do que a tabela mostra.",
            "Use HTML table with marked column headers. Include a title or description of what the table shows.",
            "semantics",
        ),
        item(
            "data-table", "sort", "Ordenação", "Sorting",
            "Coluna ordenada deve ser anunciada — ex.: \"Nome, ordenado crescente\" — não só indicada por seta.",
            "Sorted column must be announced — e.g. \"Name, sorted ascending\" — not only shown by arrow.",
            "semantics",
        ),
        item(
            "data-table", "keyboard", "Controles por teclado", "Keyboard controls",
            "Ordenar colunas e selecionar linhas deve funcionar por teclado, não só por clique.",
            "Sorting columns and selecting rows must work by keyboard, not click only.",
            "keyboard",
        ),
        item(
            "data-table", "selection", "Linhas selecionáveis", "Selectable rows",
            "Linha selecionada comunica estado por checkbox associado ou equivalente anunciável.",
            "Selected row communicates state via associated checkbox or equivalent announcement.",
            "quality",
        ),
        item(
            "data-table", "summary", "Resumo dos dados", "Data summary",
            "Ofereça resumo textual ou alternativa para quem não consegue interpretar a tabela visualmente.",
            "Provide a text summary or alternative for users who cannot interpret the table visually.",
            "semantics",
            ["developer", "qa", "product-designer"],
        ),
        item(
            "data-table", "contrast", "Contraste visual", "Visual contrast",
            "Listras, hover e seleção distinguíveis por mais do que cor — use ícone, peso ou padrão.",
            "Stripes, hover, and selection distinguishable by more than color — use icon, weight, or pattern.",
            "quality",
        ),
    ],
    "alert": [
        item(
            "alert", "role", "Nível de urgência", "Urgency level",
            "Alertas urgentes interrompem leitura; informativos aguardam pausa natural — escolha conforme criticidade.",
            "Urgent alerts interrupt reading; informational ones wait for a natural pause — choose by criticality.",
            "semantics",
        ),
        item(
            "alert", "text", "Texto e cor", "Text and color",
            "A mensagem descreve a severidade em palavras. Cor reforça, mas nunca substitui o texto.",
            "The message describes severity in words. Color reinforces but never replaces text.",
            "quality",
            ["designer", "qa"],
        ),
        item(
            "alert", "keyboard", "Ações internas", "Internal actions",
            "Botões dentro do alerta (fechar, desfazer) acessíveis por teclado com foco visível.",
            "Buttons inside the alert (dismiss, undo) accessible by keyboard with visible focus.",
            "keyboard",
        ),
        item(
            "alert", "persistence", "Persistência", "Persistence",
            "Alertas críticos não somem sozinhos sem forma de recuperar a informação.",
            "Critical alerts do not disappear on their own without a way to recover the information.",
            "quality",
        ),
        item(
            "alert", "icon", "Ícone decorativo", "Decorative icon",
            "Ícone de severidade é decorativo se o texto já comunica o significado — oculte do leitor de tela.",
            "Severity icon is decorative if text already conveys meaning — hide from screen readers.",
            "semantics",
        ),
        item(
            "alert", "contrast", "Contraste", "Contrast",
            "Texto, ícone e fundo do alerta atendem contraste AA (WCAG).",
            "Alert text, icon, and background meet AA contrast (WCAG).",
            "quality",
        ),
    ],
    "toast": [
        item(
            "toast", "live", "Anúncio automático", "Automatic announcement",
            "Mensagens importantes são lidas pelo leitor de tela ao aparecer — urgente interrompe, informativo aguarda.",
            "Important messages are read by screen readers on appear — urgent interrupts, informational waits.",
            "semantics",
        ),
        item(
            "toast", "timing", "Tempo na tela", "Time on screen",
            "Não desapareça rápido demais. Respeite tempo de leitura e permita pausar quando houver ação.",
            "Do not dismiss too quickly. Respect reading time and allow pausing when there is an action.",
            "quality",
        ),
        item(
            "toast", "persistent", "Mensagens importantes", "Important messages",
            "Erros e avisos críticos permanecem ou ficam acessíveis em histórico recuperável.",
            "Errors and critical warnings persist or remain accessible in recoverable history.",
            "quality",
            ["product-designer", "qa"],
        ),
        item(
            "toast", "focus", "Foco", "Focus",
            "Toast não rouba foco sem necessidade. Ações internas (desfazer, fechar) permanecem focáveis.",
            "Toast does not steal focus unnecessarily. Internal actions (undo, dismiss) remain focusable.",
            "keyboard",
        ),
        item(
            "toast", "actions", "Ações no toast", "Toast actions",
            "Desfazer ou fechar acessíveis por teclado com rótulo claro da ação.",
            "Undo or dismiss accessible by keyboard with a clear action label.",
            "keyboard",
        ),
        item(
            "toast", "error", "Erro", "Error",
            "Estado de erro anunciado com prioridade e texto explícito — não só cor vermelha.",
            "Error state announced with priority and explicit text — not red color alone.",
            "semantics",
        ),
    ],
    "skeleton-loader": [
        item(
            "skeleton-loader", "busy", "Carregando", "Loading",
            "O container pai informa que o conteúdo ainda está carregando — não cada bloco cinza individualmente.",
            "The parent container signals content is still loading — not each gray block individually.",
            "semantics",
        ),
        item(
            "skeleton-loader", "hidden", "Oculto do leitor", "Hidden from reader",
            "Placeholders visuais ficam ocultos do leitor de tela — são decoração, não conteúdo real.",
            "Visual placeholders are hidden from screen readers — they are decoration, not real content.",
            "semantics",
        ),
        item(
            "skeleton-loader", "keyboard", "Fora da navegação", "Outside navigation",
            "Skeletons não entram na ordem de Tab e não simulam botões ou campos reais.",
            "Skeletons are not in Tab order and do not simulate real buttons or fields.",
            "keyboard",
        ),
        item(
            "skeleton-loader", "motion", "Movimento reduzido", "Reduced motion",
            "Respeite preferência de movimento reduzido — pause ou simplifique animação de shimmer.",
            "Respect reduced motion preference — pause or simplify shimmer animation.",
            "quality",
        ),
        item(
            "skeleton-loader", "label", "Anúncio de carregamento", "Loading announcement",
            "Anuncie \"carregando\" no container ou região, não em cada retângulo placeholder.",
            "Announce \"loading\" on the container or region, not on each placeholder rectangle.",
            "semantics",
        ),
        item(
            "skeleton-loader", "content", "Substituição suave", "Smooth replacement",
            "Troque skeleton por conteúdo real sem saltos de layout que desorientem quem usa zoom ou leitor de tela.",
            "Replace skeleton with real content without layout jumps that disorient zoom or screen reader users.",
            "quality",
        ),
    ],
    "explanation-tooltip": [
        item(
            "explanation-tooltip", "hover", "Além do hover", "Beyond hover",
            "Tooltip aparece também ao focar por teclado — não dependa só de passar o mouse.",
            "Tooltip also appears on keyboard focus — do not rely on mouse hover alone.",
            "keyboard",
        ),
        item(
            "explanation-tooltip", "essential", "Conteúdo essencial", "Essential content",
            "Informação necessária para concluir a tarefa não pode existir só dentro do tooltip.",
            "Information needed to complete the task cannot exist only inside the tooltip.",
            "quality",
            ["designer", "product-designer"],
        ),
        item(
            "explanation-tooltip", "relation", "Ligação ao ícone", "Link to trigger",
            "Tooltip fica ligado ao ícone ou botão que o abre para o leitor de tela ler em sequência.",
            "Tooltip is tied to the icon or button that opens it so screen readers read in sequence.",
            "semantics",
        ),
        item(
            "explanation-tooltip", "focus", "Foco no trigger", "Focus on trigger",
            "Tooltip não rouba foco. Escape fecha quando aplicável.",
            "Tooltip does not steal focus. Escape closes when applicable.",
            "keyboard",
        ),
        item(
            "explanation-tooltip", "timing", "Tempo de leitura", "Reading time",
            "Permaneça visível tempo suficiente para ler enquanto o trigger estiver focado.",
            "Stay visible long enough to read while the trigger is focused.",
            "quality",
        ),
        item(
            "explanation-tooltip", "return", "Foco previsível", "Predictable focus",
            "Ao fechar, o foco permanece ou retorna ao ícone/botão que abriu o tooltip.",
            "On close, focus stays or returns to the icon/button that opened the tooltip.",
            "quality",
        ),
    ],
    "confidence-badge": [
        item(
            "confidence-badge", "text", "Nível em texto", "Level in text",
            "Confiança aparece em palavras (ex.: \"Alta\", \"Média\") — não só em cor ou intensidade visual.",
            "Confidence appears in words (e.g. \"High\", \"Medium\") — not color or visual intensity alone.",
            "semantics",
            ["designer", "qa"],
        ),
        item(
            "confidence-badge", "contrast", "Contraste", "Contrast",
            "Todos os níveis de confiança mantêm contraste legível no tema ativo.",
            "All confidence levels maintain readable contrast in the active theme.",
            "quality",
        ),
        item(
            "confidence-badge", "decision", "Decisões críticas", "Critical decisions",
            "Badge não deve ser o único indicador para aprovar ou rejeitar algo importante.",
            "Badge must not be the sole indicator for approving or rejecting something important.",
            "quality",
            ["product-designer", "qa"],
        ),
        item(
            "confidence-badge", "icon", "Ícone decorativo", "Decorative icon",
            "Se o texto já comunica o nível, o ícone pode ser decorativo e oculto do leitor de tela.",
            "If text already communicates the level, the icon can be decorative and hidden from screen readers.",
            "semantics",
        ),
        item(
            "confidence-badge", "scale", "Zoom 200%", "200% zoom",
            "Legível com zoom de 200% sem truncar o valor ou nível.",
            "Readable at 200% zoom without truncating value or level.",
            "quality",
        ),
        item(
            "confidence-badge", "screenreader", "Leitor de tela", "Screen reader",
            "Nome anunciado inclui nível e contexto — ex.: \"Confiança alta na recomendação\".",
            "Announced name includes level and context — e.g. \"High confidence in recommendation\".",
            "semantics",
        ),
    ],
    "command-palette": [
        item(
            "command-palette", "combobox", "Campo de busca", "Search field",
            "Campo de busca com lista de resultados: abertura, navegação e seleção devem ser anunciáveis.",
            "Search field with result list: open, navigation, and selection must be announced.",
            "semantics",
        ),
        item(
            "command-palette", "keyboard", "Teclado completo", "Full keyboard",
            "Setas navegam resultados; Enter executa; Escape fecha e restaura o contexto anterior.",
            "Arrows navigate results; Enter executes; Escape closes and restores previous context.",
            "keyboard",
        ),
        item(
            "command-palette", "results", "Resultados filtrados", "Filtered results",
            "Anuncie quantos resultados aparecem e quando a busca não retorna nada.",
            "Announce how many results appear and when search returns nothing.",
            "semantics",
        ),
        item(
            "command-palette", "trap", "Foco contido", "Contained focus",
            "Enquanto aberto, foco fica dentro da paleta. Ao fechar, retorna ao elemento anterior.",
            "While open, focus stays inside the palette. On close, returns to the previous element.",
            "keyboard",
        ),
        item(
            "command-palette", "shortcut", "Atalho de teclado", "Keyboard shortcut",
            "Atalho global documentado e sem conflito com navegador ou leitor de tela.",
            "Documented global shortcut without conflict with browser or screen reader.",
            "quality",
        ),
        item(
            "command-palette", "group", "Grupos de resultados", "Result groups",
            "Resultados agrupados por categoria com títulos que o leitor de tela anuncia.",
            "Results grouped by category with titles announced by screen readers.",
            "semantics",
        ),
    ],
    "source-attribution": [
        item(
            "source-attribution", "disclosure", "Expandir fontes", "Expand sources",
            "Botão de expandir comunica se a lista de fontes está aberta ou fechada.",
            "Expand button communicates whether the source list is open or closed.",
            "semantics",
        ),
        item(
            "source-attribution", "keyboard", "Teclado", "Keyboard",
            "Enter e Espaço expandem e colapsam. Foco visível no botão de expandir.",
            "Enter and Space expand and collapse. Visible focus on the expand button.",
            "keyboard",
        ),
        item(
            "source-attribution", "order", "Ordem de leitura", "Reading order",
            "Após expandir, metadados e links seguem ordem lógica de leitura.",
            "After expanding, metadata and links follow logical reading order.",
            "quality",
        ),
        item(
            "source-attribution", "links", "Links reais", "Real links",
            "Fontes citadas são links clicáveis com texto que descreve a origem.",
            "Cited sources are clickable links with text describing the origin.",
            "semantics",
        ),
        item(
            "source-attribution", "contrast", "Contraste", "Contrast",
            "Metadados secundários (data, tipo) mantêm contraste legível.",
            "Secondary metadata (date, type) maintains readable contrast.",
            "quality",
        ),
        item(
            "source-attribution", "summary", "Resumo antes de expandir", "Summary before expand",
            "Resumo visível antes da expansão; detalhes complementam, não substituem.",
            "Visible summary before expansion; details complement, do not replace.",
            "semantics",
            ["product-designer", "qa"],
        ),
    ],
    "audit-panel": [
        item(
            "audit-panel", "region", "Identificação do painel", "Panel identification",
            "O painel de auditoria tem nome claro — ex.: \"Trilha de auditoria\" — para o leitor de tela anunciar a seção.",
            "The audit panel has a clear name — e.g. \"Audit trail\" — so screen readers announce the section.",
            "semantics",
        ),
        item(
            "audit-panel", "headings", "Títulos internos", "Internal headings",
            "Subseções usam títulos reais (h2, h3) para navegação por leitor de tela.",
            "Subsections use real headings (h2, h3) for screen reader navigation.",
            "semantics",
        ),
        item(
            "audit-panel", "timeline", "Linha do tempo", "Timeline",
            "Eventos em ordem cronológica com marcos textuais — data, ação e resultado legíveis.",
            "Events in chronological order with textual milestones — date, action, and outcome readable.",
            "quality",
        ),
        item(
            "audit-panel", "states", "Status em texto", "Text status",
            "Aprovado, pendente e falha aparecem em texto e ícone — não só em cor.",
            "Approved, pending, and failed appear in text and icon — not color alone.",
            "quality",
        ),
        item(
            "audit-panel", "keyboard", "Navegação", "Navigation",
            "Entradas e filtros navegáveis por teclado com foco visível.",
            "Entries and filters navigable by keyboard with visible focus.",
            "keyboard",
        ),
        item(
            "audit-panel", "filters", "Filtros", "Filters",
            "Filtros anunciam o que está aplicado e quantos resultados aparecem.",
            "Filters announce what is applied and how many results are shown.",
            "semantics",
        ),
    ],
    "typography": [
        item(
            "typography", "hierarchy", "Hierarquia de títulos", "Heading hierarchy",
            "Use níveis de título em ordem (h1, h2, h3…) sem pular — o estilo visual segue a hierarquia, não o contrário.",
            "Use heading levels in order (h1, h2, h3…) without skipping — visual style follows hierarchy, not the reverse.",
            "semantics",
        ),
        item(
            "typography", "contrast", "Contraste", "Contrast",
            "Texto corpo e legendas atendem contraste AA (WCAG) no tema ativo.",
            "Body text and captions meet AA contrast (WCAG) in the active theme.",
            "quality",
        ),
        item(
            "typography", "zoom", "Zoom", "Zoom",
            "Legível com zoom de 200% sem truncar conteúdo essencial.",
            "Readable at 200% zoom without truncating essential content.",
            "quality",
        ),
        item(
            "typography", "lineheight", "Entrelinha", "Line height",
            "Entrelinha generosa o suficiente para leitura longa e conforto visual.",
            "Generous enough line height for long reading and visual comfort.",
            "quality",
            ["designer", "product-designer"],
        ),
        item(
            "typography", "interactive", "Texto clicável", "Clickable text",
            "Texto estilizado não deve ser o único elemento clicável — use botão ou link explícito.",
            "Styled text must not be the only clickable element — use an explicit button or link.",
            "keyboard",
        ),
        item(
            "typography", "motion", "Movimento reduzido", "Reduced motion",
            "Animações de texto respeitam preferência de movimento reduzido do sistema.",
            "Text animations respect the system reduced motion preference.",
            "quality",
        ),
    ],
    "icon": [
        item(
            "icon", "decorative", "Ícone decorativo", "Decorative icon",
            "Ícone que só complementa texto visível fica oculto do leitor de tela.",
            "Icon that only complements visible text is hidden from screen readers.",
            "semantics",
        ),
        item(
            "icon", "functional", "Ícone funcional", "Functional icon",
            "Ícone clicável sem texto precisa de nome — aria-label ou botão wrapper com rótulo.",
            "Clickable icon without text needs a name — aria-label or button wrapper with label.",
            "semantics",
        ),
        item(
            "icon", "keyboard", "Teclado", "Keyboard",
            "Ícone interativo alcançável por Tab com foco visível.",
            "Interactive icon reachable by Tab with visible focus.",
            "keyboard",
        ),
        item(
            "icon", "target", "Área de toque", "Touch target",
            "Quando o ícone é o controle principal, mantenha pelo menos 44px de área clicável.",
            "When the icon is the primary control, keep at least 44px of clickable area.",
            "quality",
        ),
        item(
            "icon", "meaning", "Significado", "Meaning",
            "Informação crítica nunca depende só do ícone — acompanhe sempre de texto.",
            "Critical information never relies on icon alone — always accompany with text.",
            "quality",
            ["designer", "qa"],
        ),
        item(
            "icon", "contrast", "Contraste", "Contrast",
            "Contraste suficiente com o fundo em todos os temas.",
            "Sufficient contrast with background in all themes.",
            "quality",
        ),
    ],
}


def derive_keyboard_rules(component_id: str, items: list[Item]) -> list[dict]:
    keyboard_items = [entry for entry in items if entry["icon"] == "keyboard"]
    selected = keyboard_items[:2] if keyboard_items else items[:2]
    rules = []
    for index, entry in enumerate(selected, start=1):
        title = entry["title"]["pt"]
        desc = entry["description"]["pt"]
        rules.append({
            "id": f"{component_id}.accessibility.keyboard.{index}",
            "text": {
                "pt": f"{title}: {desc}",
                "en": f"{entry['title']['en']}: {entry['description']['en']}",
            },
        })
    return rules


def derive_aria_rules(component_id: str, items: list[Item]) -> list[dict]:
    semantics_items = [entry for entry in items if entry["icon"] == "semantics"]
    selected = semantics_items[:2] if semantics_items else items[2:4]
    rules = []
    for index, entry in enumerate(selected, start=1):
        rules.append({
            "id": f"{component_id}.accessibility.aria.{index}",
            "attribute": "aria",
            "value": None,
            "text": {
                "pt": f"{entry['title']['pt']}: {entry['description']['pt']}",
                "en": f"{entry['title']['en']}: {entry['description']['en']}",
            },
        })
    return rules


def build_summary(items: list[Item]) -> dict[str, str]:
    essentials = [entry for entry in items if entry.get("severity") == "essential"]
    selected = essentials[:3] if len(essentials) >= 3 else items[:3]
    pt = " ".join(entry["description"]["pt"] for entry in selected)
    en = " ".join(entry["description"]["en"] for entry in selected)
    return {"pt": pt, "en": en}


def main() -> None:
    catalog = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
    updated = 0
    for component in catalog["components"]:
        component_id = component["component_id"]
        items = ACCESSIBILITY_ITEMS.get(component_id)
        if not items:
            raise SystemExit(f"Missing accessibility items for {component_id}")
        if len(items) < 5:
            raise SystemExit(f"{component_id} has fewer than 5 accessibility items")

        accessibility = component.setdefault("accessibility", {})
        accessibility["summary"] = build_summary(items)
        accessibility["items"] = items
        accessibility["keyboard"] = derive_keyboard_rules(component_id, items)
        accessibility["aria"] = derive_aria_rules(component_id, items)

        provenance = component.setdefault("provenance", {})
        provenance["accessibility.items"] = [
            f"scripts/expand_accessibility_items.py#{component_id}",
        ]
        updated += 1

    CATALOG_PATH.write_text(
        json.dumps(catalog, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Updated accessibility metadata for {updated} components.")


if __name__ == "__main__":
    main()
