"""
build_search_index.py
----------------------
Generate the client-side global search catalog from the canonical RAG corpus
(rag/aetheris-docs-dump.json). Emits a typed, committed TypeScript module at
src/search/searchEntries.generated.ts so the frontend ships a single lean array
(no build-time dependency, no bundling of the full 460 KB corpus).

The corpus is the source of truth for component / pattern / token / decision /
guideline titles. This script maps each chunk to a navigable route and bakes in
bilingual (PT/EN) alias keywords so users can search "botão" and find Button,
"confiança" and find Confidence Badge, "espaçamento" and find spacing tokens.

Run after the corpus changes:
  python3 scripts/build_search_index.py
"""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CORPUS = ROOT / "rag" / "aetheris-docs-dump.json"
OUTPUT = ROOT / "src" / "search" / "searchEntries.generated.ts"

# Routes (use legacy-aware focus targets so results land on the right sub-page).
ROUTE_COMPONENTS = "/components"
ROUTE_PATTERNS = "/foundations?focus=patterns"
ROUTE_TOKENS = "/foundations?focus=tokens"
# Design decisions have no dedicated focus tab; /foundations is their canonical
# home (matches the legacy /design-decisions redirect).
ROUTE_DECISIONS = "/foundations"
ROUTE_GUIDELINES = "/foundations?focus=manifesto"
ROUTE_REASONING = "/reasoning"
ROUTE_ARCHITECTURE = "/architecture"

# page_type -> (search type, route)
TYPE_MAP = {
    "component": ("component", ROUTE_COMPONENTS),
    "xai_component": ("component", ROUTE_COMPONENTS),
    "pattern": ("pattern", ROUTE_PATTERNS),
    "token": ("token", ROUTE_TOKENS),
    "token_alias": ("token", ROUTE_TOKENS),
    "design_decision": ("decision", ROUTE_DECISIONS),
    "accessibility": ("guideline", ROUTE_GUIDELINES),
    "oracle_command": ("reasoning", ROUTE_REASONING),
    "automatic_skill": ("reasoning", ROUTE_REASONING),
    "dev_integration": ("dev", ROUTE_ARCHITECTURE),
}

# Bilingual aliases keyed by component_id (PT-BR, PT-PT, EN).
COMPONENT_ALIASES = {
    "button": ["botão", "botao", "button", "ação", "acao", "cta", "action"],
    "toggle-switch": ["toggle", "switch", "interruptor", "alternar", "chave", "liga desliga"],
    "checkbox": ["checkbox", "caixa de seleção", "caixa de selecao", "marcar", "seleção múltipla"],
    "radio-button": ["radio", "radio button", "opção única", "escolha única", "botão de opção"],
    "selectable-chip": ["chip", "badge", "tag", "etiqueta", "selo", "rótulo"],
    "text-input": ["input", "campo de texto", "text input", "entrada de texto", "caixa de texto"],
    "text-area": ["textarea", "área de texto", "area de texto", "texto longo", "text area"],
    "select-dropdown": ["select", "dropdown", "seleção", "lista suspensa", "combobox", "menu suspenso"],
    "date-picker": ["data", "calendário", "calendario", "date picker", "seletor de data"],
    "form-field": ["campo de formulário", "form field", "label", "rótulo", "formulário"],
    "link": ["link", "hiperlink", "navegação", "âncora", "anchor"],
    "tabs": ["abas", "guias", "tabs", "navegação por abas"],
    "card": ["card", "cartão", "cartao", "painel", "bloco"],
    "modal-dialog": ["modal", "dialog", "diálogo", "dialogo", "janela", "popup", "overlay", "sobreposição"],
    "data-table": ["tabela", "table", "grade de dados", "data table", "planilha", "grid"],
    "alert": ["alerta", "alert", "aviso", "mensagem", "banner"],
    "toast": ["toast", "notificação", "notificacao", "notification", "snackbar"],
    "skeleton-loader": ["skeleton", "carregando", "loading", "placeholder", "esqueleto"],
    "explanation-tooltip": ["tooltip", "dica", "balão", "balao", "explicação", "explanation", "hint"],
    "command-palette": ["command palette", "barra de comandos", "paleta de comandos", "atalhos", "cmd k"],
    "typography": ["tipografia", "typography", "fonte", "texto", "type", "tipo de letra"],
    "icon": ["ícone", "icone", "icon", "símbolo", "simbolo"],
    "confidence-badge": ["confiança", "confianca", "confidence", "medidor de confiança", "confidence meter", "certeza", "nível de confiança"],
    "source-attribution": ["fonte", "fontes", "source", "sources", "atribuição de fonte", "citação", "citacao", "evidência", "evidencia"],
    "audit-panel": ["auditoria", "audit", "painel de auditoria", "rastreabilidade", "trilha de auditoria"],
}

# Bilingual aliases keyed by title for entries without a component_id.
TITLE_ALIASES = {
    # Patterns
    "Dashboard": ["dashboard", "painel", "visão geral", "overview", "indicadores"],
    "Multi-step Form": ["formulário", "multi-step", "etapas", "wizard", "passo a passo", "multietapas"],
    "Onboarding": ["onboarding", "integração", "integracao", "primeiros passos", "boas-vindas", "introdução"],
    "Data Explorer": ["explorador de dados", "data explorer", "filtros", "exploração", "exploracao"],
    "Empty States": ["estado vazio", "empty state", "sem dados", "vazio", "nenhum resultado"],
    "Settings & Config": ["configurações", "configuracoes", "settings", "ajustes", "preferências", "config"],
    "Command Center": ["central de comando", "command center", "comando", "operações"],
    "Focus Mode": ["modo foco", "focus mode", "concentração", "concentracao", "sem distração"],
    "Collaboration": ["colaboração", "colaboracao", "collaboration", "tempo real", "comentários"],
    "Timeline": ["linha do tempo", "timeline", "histórico", "historico", "cronologia"],
    "Entity Picker": ["seletor de entidade", "entity picker", "escolher item", "selecionar entidade"],
    # Decisions
    "Side Drawer vs Modal Overlay": ["drawer", "gaveta", "modal", "overlay", "decisão", "decisao", "decision"],
    "Primary vs. Secondary Button Logic": ["botão primário", "secundário", "hierarquia", "primary", "secondary", "decisão"],
    "List vs. Bento": ["lista", "bento", "layout", "grade", "decisão", "decisao"],
    "Haptic Feedback": ["háptico", "haptico", "haptic", "vibração", "vibracao", "feedback tátil"],
    # Guidelines (accessibility)
    "Contraste e legibilidade": ["contraste", "contrast", "legibilidade", "wcag", "cor", "acessibilidade"],
    "Foco e navegação por teclado": ["foco", "focus", "teclado", "keyboard", "navegação", "tab", "acessibilidade"],
    "Alvo mínimo e densidade": ["alvo", "target", "44px", "toque", "touch", "densidade", "acessibilidade"],
    "Estados acessíveis": ["estados", "states", "disabled", "foco", "acessível", "acessibilidade"],
    "Leitores de tela e semântica": ["leitor de tela", "screen reader", "aria", "semântica", "semantic", "acessibilidade"],
    "Feedback não apenas por cor": ["cor", "color", "daltonismo", "não apenas cor", "acessibilidade"],
    "Movimento seguro": ["movimento", "motion", "animação", "reduced motion", "prefers-reduced-motion", "acessibilidade"],
    "Checklist de prontidão acessível": ["checklist", "acessibilidade", "accessibility", "a11y", "prontidão"],
    # Dev integration
    "API Endpoints": ["api", "endpoints", "integração", "rest", "backend", "rota"],
    "Framework Support": ["framework", "react", "vue", "integração", "suporte", "biblioteca"],
}


def token_category_aliases(title: str) -> list[str]:
    """Bilingual keyword buckets so 'cor', 'espaçamento', 'sombra' find tokens."""
    t = title.lower()
    extra: list[str] = ["token"]
    if "color" in t or t.startswith("primary-") or "feedback" in t or t in {"background", "overlay-backdrop"}:
        extra += ["cor", "color", "paleta", "palette"]
    if "primary" in t:
        extra += ["primária", "primaria", "primary", "marca", "brand"]
    if "feedback" in t or "error" in t or "success" in t or "warning" in t or "info" in t:
        extra += ["feedback", "alerta", "estado", "status"]
    if t.startswith("space-") or t == "space":
        extra += ["espaçamento", "espacamento", "spacing", "gap", "margem", "padding", "espaço"]
    if "radius" in t:
        extra += ["raio", "border radius", "arredondamento", "cantos", "radius"]
    if "shadow" in t or "glow" in t:
        extra += ["sombra", "shadow", "elevação", "elevacao", "elevation", "profundidade"]
    if any(t.startswith(p) for p in ("heading", "body", "display", "caption", "label", "code")):
        extra += ["tipografia", "typography", "fonte", "font", "texto", "text", "tamanho de fonte"]
    if "motion" in t or "easing" in t:
        extra += ["movimento", "motion", "animação", "animation", "transição", "transition", "tempo"]
    if "icon-size" in t:
        extra += ["ícone", "icone", "icon", "tamanho de ícone"]
    if "control-height" in t:
        extra += ["altura", "height", "controle", "control"]
    if "border" in t:
        extra += ["borda", "border", "contorno", "linha"]
    if "focus" in t:
        extra += ["foco", "focus", "anel de foco", "focus ring", "acessibilidade"]
    if "surface" in t or "dialog" in t or "popover" in t:
        extra += ["superfície", "surface", "fundo", "background"]
    if t.startswith("xai") or "confidence" in t or "audit" in t:
        extra += ["xai", "explicabilidade", "confiança", "confianca", "confidence", "auditoria"]
    if "state-" in t:
        extra += ["estado", "state", "disabled", "selecionado", "selected"]
    return extra


def keyword_split(value: str) -> list[str]:
    parts = re.split(r"[\s/_:.\-]+", value.lower())
    return [p for p in parts if p and len(p) > 1]


def main() -> None:
    data = json.loads(CORPUS.read_text(encoding="utf-8"))
    chunks = data["chunks"]
    seen: set[tuple[str, str]] = set()
    entries: list[dict] = []

    for chunk in chunks:
        page_type = chunk.get("page_type", "")
        mapping = TYPE_MAP.get(page_type)
        if mapping is None:
            continue
        search_type, route = mapping
        title = (chunk.get("title") or "").strip()
        component_id = (chunk.get("component_id") or "").strip()
        if not title:
            continue
        dedupe_key = (search_type, component_id or title)
        if dedupe_key in seen:
            continue
        seen.add(dedupe_key)

        keywords: list[str] = []
        if search_type == "component" and component_id:
            keywords += COMPONENT_ALIASES.get(component_id, [])
        else:
            keywords += keyword_split(title)
            if component_id:
                keywords += keyword_split(component_id)
        keywords += TITLE_ALIASES.get(title, [])
        if search_type == "token":
            keywords += token_category_aliases(title)

        # Normalize: dedupe, drop empties, keep order stable.
        normalized: list[str] = []
        for keyword in keywords:
            keyword = keyword.strip().lower()
            if keyword and keyword not in normalized:
                normalized.append(keyword)

        entry_id = f"{search_type}:{component_id or title}"
        entries.append(
            {
                "id": entry_id,
                "type": search_type,
                "title": title,
                "route": route,
                "section": (chunk.get("section") or "").strip(),
                "keywords": normalized,
            }
        )

    # Stable ordering: by type then title for clean diffs.
    type_order = ["component", "pattern", "token", "decision", "guideline", "reasoning", "dev"]
    entries.sort(key=lambda e: (type_order.index(e["type"]), e["title"].lower()))

    lines = [
        "// AUTO-GENERATED by scripts/build_search_index.py - do not edit by hand.",
        "// Source of truth: rag/aetheris-docs-dump.json (canonical RAG corpus).",
        "// Regenerate with: python3 scripts/build_search_index.py",
        "",
        'import type { RawSearchEntry } from "./types";',
        "",
        f"// {len(entries)} catalog entries across {len(set(e['type'] for e in entries))} types.",
        "export const generatedEntries: RawSearchEntry[] = [",
    ]
    for entry in entries:
        keyword_literal = ", ".join(json.dumps(k, ensure_ascii=False) for k in entry["keywords"])
        section = json.dumps(entry["section"], ensure_ascii=False)
        lines.append(
            "  { "
            f'id: {json.dumps(entry["id"], ensure_ascii=False)}, '
            f'type: {json.dumps(entry["type"])}, '
            f'title: {json.dumps(entry["title"], ensure_ascii=False)}, '
            f'route: {json.dumps(entry["route"])}, '
            f'section: {section}, '
            f"keywords: [{keyword_literal}] }},"
        )
    lines.append("];")
    lines.append("")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {len(entries)} entries to {OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
