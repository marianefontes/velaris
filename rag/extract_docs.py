"""
extract_docs.py  (v2 — TSX source)
-----------------------------------
Extrai chunks semânticos dos arquivos .tsx do Aetheris Design System React.
Fonte da verdade: src/components/*.tsx

Saídas:
  - aetheris-docs-dump.json  →  chunks estruturados com metadados
  - aetheris-docs-dump.md    →  versão legível para revisão humana
  (nomes de arquivo mantidos por compatibilidade com o pipeline atual)

Uso:
  python3 rag/extract_docs.py
"""

import json
import re
import sys
from pathlib import Path

# ─── Caminhos ────────────────────────────────────────────────────────────────
BASE_DIR   = Path(__file__).parent.parent          # /AETHERIS/
SRC_DIR    = BASE_DIR / "src" / "components"
CAPABILITY_REGISTRY = BASE_DIR / "src" / "beatrice" / "domain" / "governance" / "capabilities.ts"
OUTPUT_DIR = Path(__file__).parent                 # /AETHERIS/rag/
PRODUCT_NAME = "Aetheris"

if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from component_metadata import (  # noqa: E402
    component_catalog,
    component_document_text,
    localized_rules,
    localized_text,
)

# ─── Helpers ─────────────────────────────────────────────────────────────────

def read_tsx(filename: str) -> str:
    path = SRC_DIR / filename
    if not path.exists():
        print(f"  [AVISO] {filename} não encontrado em {SRC_DIR}", file=sys.stderr)
        return ""
    return path.read_text(encoding="utf-8")


def extract_string_field(obj_text: str, field: str) -> str:
    """
    Extrai o valor de um campo string de um bloco de texto de objeto TypeScript.
    Suporta:
      field: "valor simples",
      field:
        "valor em linha separada",
      field: "valor com \"aspas\" escapadas",
    """
    # tentativa 1: campo e valor na mesma linha
    pat1 = rf'\b{field}\s*:\s*"((?:[^"\\]|\\.)*)"'
    m = re.search(pat1, obj_text)
    if m:
        return m.group(1).replace('\\"', '"').replace("\\n", "\n").replace("\\t", "\t")

    # tentativa 2: campo e valor em linhas separadas
    pat2 = rf'\b{field}\s*:\s*\n\s*"((?:[^"\\]|\\.)*)"'
    m = re.search(pat2, obj_text, re.MULTILINE)
    if m:
        return m.group(1).replace('\\"', '"').replace("\\n", "\n").replace("\\t", "\t")

    return ""


def _objects_from_bracket_start(source: str, bracket_pos: int) -> list[str]:
    """Dado o índice logo após o '[' de abertura, extrai todos os objetos { } de nível 1."""
    objects = []
    depth = 0
    obj_start = None
    i = bracket_pos
    while i < len(source):
        c = source[i]
        if c == '{':
            if depth == 0:
                obj_start = i
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0 and obj_start is not None:
                objects.append(source[obj_start: i + 1])
                obj_start = None
        elif c == ']' and depth == 0:
            break
        i += 1
    return objects


def extract_objects_from_array(source: str, array_name: str) -> list[str]:
    """
    Localiza 'const arrayName ... = [' OU 'arrayName: [' e extrai cada objeto { ... }
    de nível 1 dentro do array, respeitando nesting.
    Suporta anotações de tipo TypeScript como SectionData[], ComponentItem[], etc.
    """
    # 1) tenta: const arrayName (qualquer coisa) = [
    m = re.search(rf'const\s+{array_name}\b', source)
    if m:
        rest = source[m.end():]
        eq = re.search(r'=\s*\[', rest)
        if eq:
            bracket_pos = m.end() + eq.end()
            return _objects_from_bracket_start(source, bracket_pos)

    # 2) tenta: arrayName: [  (campo inline dentro de objeto)
    m = re.search(rf'\b{array_name}\s*:\s*\[', source)
    if m:
        return _objects_from_bracket_start(source, m.end())

    return []


def make_id(source_file: str, title: str) -> str:
    slug = re.sub(r'[^a-z0-9]+', '_', title.lower()).strip('_')
    base = source_file.replace(".tsx", "").lower()
    return f"{base} :: {slug}"


def build_chunk(source_file: str, page_type: str, title: str, fields: dict) -> dict:
    """Monta o chunk no formato canônico do dump."""
    text_parts = [f"{PRODUCT_NAME.upper()} {page_type.upper()}: {title}"]
    field_order = [
        "description", "structure", "logic", "context_of_use",
        "when_to_use", "when_not_to_use", "trade_offs", "accessibility",
        "rag_relation", "aetheris_insight",
    ]
    for key in field_order:
        val = fields.get(key, "")
        if val:
            label = key.replace("_", " ").title()
            text_parts.append(f"{label}: {val}")

    full_text = " | ".join(text_parts)

    return {
        "id": make_id(source_file, title),
        "source": source_file,
        "page_type": page_type,
        "title": title,
        "status": fields.get("status", "Stable"),
        "structure": fields.get("structure", ""),
        "logic": fields.get("logic", ""),
        "context_of_use": fields.get("context_of_use", ""),
        "when_to_use": fields.get("when_to_use", ""),
        "when_not_to_use": fields.get("when_not_to_use", ""),
        "trade_offs": fields.get("trade_offs", ""),
        "accessibility": fields.get("accessibility", ""),
        "rag_relation": fields.get("rag_relation", ""),
        "aetheris_insight": fields.get("aetheris_insight", ""),
        "text": full_text,
        "char_count": len(full_text),
    }


# ═══════════════════════════════════════════════════════════════════════════════
# EXTRATORES POR ARQUIVO
# ═══════════════════════════════════════════════════════════════════════════════

def extract_components(chunks: list):
    """data/component-metadata.json → canonical component chunks."""
    catalog = component_catalog()
    for component in catalog.components:
        page_type = (
            "xai_component"
            if component.component_id in {
                "confidence-badge",
                "source-attribution",
                "audit-panel",
            }
            else "component"
        )
        fields = {
            "status": component.status,
            "description": localized_text(component.description),
            "logic": localized_text(component.logic),
            "structure": localized_text(component.structure),
            "when_to_use": " ".join(localized_rules(component.when_to_use) or []),
            "when_not_to_use": " ".join(
                localized_rules(component.when_not_to_use) or []
            ),
            "trade_offs": localized_text(component.trade_offs),
            "accessibility": localized_text(
                component.accessibility.summary
                if component.accessibility else None
            ),
            "rag_relation": localized_text(component.rag_relation),
            "aetheris_insight": localized_text(component.aetheris_insight),
            "context_of_use": f"Section: {component.section}",
        }
        chunk = build_chunk(
            "data/component-metadata.json",
            page_type,
            component.name,
            fields,
        )
        chunk.update({
            "component_id": component.component_id,
            "section": component.section,
            "schema_version": catalog.schema_version,
            "about": component.about.model_dump(mode="json"),
            "about_features": [
                feature.model_dump(mode="json")
                for feature in component.about_features
            ],
            "common_uses": [
                use.model_dump(mode="json")
                for use in component.common_uses
            ],
            "intent": (
                component.intent.model_dump(mode="json")
                if component.intent else None
            ),
            "intents": [
                intent.model_dump(mode="json")
                for intent in component.intents or []
            ] if component.intents is not None else None,
            "variants": [
                variant.model_dump(mode="json")
                for variant in component.variants or []
            ] if component.variants is not None else None,
            "states": [
                state.model_dump(mode="json")
                for state in component.states or []
            ] if component.states is not None else None,
            "do": [
                rule.model_dump(mode="json")
                for rule in component.do or []
            ] if component.do is not None else None,
            "dont": [
                rule.model_dump(mode="json")
                for rule in component.dont or []
            ] if component.dont is not None else None,
            "accessibility_metadata": (
                component.accessibility.model_dump(mode="json")
                if component.accessibility else None
            ),
            "edge_cases": (
                [rule.model_dump(mode="json") for rule in component.edge_cases]
                if component.edge_cases is not None else None
            ),
            "content_guidelines": (
                [
                    rule.model_dump(mode="json")
                    for rule in component.content_guidelines
                ]
                if component.content_guidelines is not None else None
            ),
            "governance_notes": (
                [
                    rule.model_dump(mode="json")
                    for rule in component.governance_notes
                ]
                if component.governance_notes is not None else None
            ),
            "related_components": component.related_components,
            "examples": (
                [
                    example.model_dump(mode="json")
                    for example in component.examples
                ]
                if component.examples is not None else None
            ),
            "anti_patterns": (
                [
                    rule.model_dump(mode="json")
                    for rule in component.anti_patterns
                ]
                if component.anti_patterns is not None else None
            ),
            "provenance": component.provenance,
            "text": component_document_text(component),
        })
        chunk["char_count"] = len(chunk["text"])
        chunks.append(chunk)


def extract_patterns(chunks: list):
    """PatternsPage.tsx → primaryPatterns[] + compactPatterns[]"""
    src = read_tsx("PatternsPage.tsx")
    if not src:
        return

    # primaryPatterns — estrutura completa
    for obj in extract_objects_from_array(src, "primaryPatterns"):
        title = extract_string_field(obj, "title")
        if not title:
            continue
        fields = {
            "context_of_use":   extract_string_field(obj, "context"),
            "structure":        extract_string_field(obj, "structure"),
            "logic":            extract_string_field(obj, "logic"),
            "when_not_to_use":  extract_string_field(obj, "whenNotToUse"),
            "aetheris_insight": extract_string_field(obj, "insight"),
        }
        chunks.append(build_chunk("PatternsPage.tsx", "pattern", title, fields))

    # compactPatterns — estrutura parcial (campos opcionais)
    for obj in extract_objects_from_array(src, "compactPatterns"):
        title = extract_string_field(obj, "title")
        if not title:
            continue
        fields = {
            "structure":        extract_string_field(obj, "structure"),
            "logic":            extract_string_field(obj, "logic"),
            "context_of_use":   extract_string_field(obj, "context"),
            "when_not_to_use":  extract_string_field(obj, "whenNotToUse"),
            "trade_offs":       extract_string_field(obj, "tradeOffs"),
            "aetheris_insight": extract_string_field(obj, "insight"),
        }
        chunks.append(build_chunk("PatternsPage.tsx", "pattern", title, fields))


def extract_tokens(chunks: list):
    """TokensPage.tsx → canonical token contracts + documented aliases."""
    src = read_tsx("TokensPage.tsx")
    if not src:
        return

    for obj in extract_objects_from_array(src, "canonicalTokens"):
        name = extract_string_field(obj, "name")
        value = extract_string_field(obj, "value")
        group = extract_string_field(obj, "group")
        kind = extract_string_field(obj, "kind")
        layer = extract_string_field(obj, "layer")
        description = extract_string_field(obj, "description")
        components = extract_string_field(obj, "components")
        if not name or not value:
            continue

        text = (
            f"{PRODUCT_NAME.upper()} TOKEN: {name} | "
            f"Value: {value} | Group: {group} | Kind: {kind} | Layer: {layer} | "
            f"Description: {description} | Components: {components}"
        )
        chunks.append({
            "id": f"TokensPage.tsx :: token_{make_id('', name).split(' :: ')[-1]}",
            "source": "TokensPage.tsx",
            "page_type": "token",
            "title": name,
            "status": "Stable",
            "structure": f"{group} / {kind} / {layer}",
            "logic": description,
            "context_of_use": components,
            "when_to_use": f"Use the {name} contract wherever the documented component context applies.",
            "when_not_to_use": "Do not replace this contract with an unrelated raw value or one-off state token.",
            "trade_offs": "",
            "aetheris_insight": "Canonical tokens centralize values while semantic layers preserve explicit usage intent.",
            "token_value": value,
            "token_group": group,
            "token_kind": kind,
            "token_layer": layer,
            "text": text,
            "char_count": len(text),
        })

    for obj in extract_objects_from_array(src, "aliasTokens"):
        name = extract_string_field(obj, "name")
        target = extract_string_field(obj, "target")
        resolved_value = extract_string_field(obj, "resolvedValue")
        group = extract_string_field(obj, "group")
        description = extract_string_field(obj, "description")
        if not name or not target:
            continue

        text = (
            f"{PRODUCT_NAME.upper()} TOKEN ALIAS: {name} | "
            f"Target: {target} | Resolved value: {resolved_value} | Group: {group} | "
            f"Description: {description}"
        )
        chunks.append({
            "id": f"TokensPage.tsx :: alias_{make_id('', name).split(' :: ')[-1]}",
            "source": "TokensPage.tsx",
            "page_type": "token_alias",
            "title": name,
            "status": "Stable",
            "structure": f"{name} → {target}",
            "logic": description,
            "context_of_use": f"{group} semantic contract",
            "when_to_use": f"Reference {name} when the usage intent differs from its canonical target.",
            "when_not_to_use": "Do not duplicate the resolved value as a new canonical token.",
            "trade_offs": "The alias adds semantic vocabulary without increasing the canonical value inventory.",
            "aetheris_insight": "Aliases keep component intent explicit while preventing unnecessary value duplication.",
            "alias_target": target,
            "resolved_value": resolved_value,
            "token_group": group,
            "text": text,
            "char_count": len(text),
        })


def extract_design_decisions(chunks: list):
    """DesignDecisionsPage.tsx → supportingDecisions[]"""
    src = read_tsx("DesignDecisionsPage.tsx")
    if not src:
        return

    # Decisão principal (hardcoded hero) — extraída diretamente do texto
    hero_chunk_text = (
        f"{PRODUCT_NAME.upper()} DESIGN DECISION: Side Drawer vs Modal Overlay | "
        "Logic: Side Drawer preserves spatial context — use when user needs to reference content behind. "
        "Modal Overlay demands full attention — use for confirmations, creation flows, critical alerts. | "
        "When to Use Side Drawer: High density content, persistent context, form step integration. | "
        "When to Use Modal: Actions requiring undivided focus, confirmations, blocking decisions. | "
        "Trade-offs: Visual occlusion (drawer), contextual drift (modal blindness). | "
        "Aetheris Insight: If the user needs page context, use a drawer. If undivided attention is needed, use a modal."
    )
    chunks.append({
        "id": "DesignDecisionsPage.tsx :: side_drawer_vs_modal",
        "source": "DesignDecisionsPage.tsx",
        "page_type": "design_decision",
        "title": "Side Drawer vs Modal Overlay",
        "status": "Stable",
        "structure": "Decision tree based on user focus requirements",
        "logic": "Spatial continuity vs. attention isolation trade-off.",
        "context_of_use": "Any form, panel or overlay interaction that requires choosing a container type.",
        "when_to_use": "Side Drawer: user needs page context. Modal: action requires full focus.",
        "when_not_to_use": "Do not use Modal for low-stakes, reversible actions that don't need interruption.",
        "trade_offs": "Visual occlusion with drawers; modal blindness and context loss with modals.",
        "aetheris_insight": "The decision maps to one question: does the user need to see the page while acting?",
        "text": hero_chunk_text,
        "char_count": len(hero_chunk_text),
    })

    # Decisões de suporte
    for obj in extract_objects_from_array(src, "supportingDecisions"):
        title = extract_string_field(obj, "title")
        rule  = extract_string_field(obj, "rule")
        desc  = extract_string_field(obj, "description")
        if not title:
            continue
        text = f"{PRODUCT_NAME.upper()} DESIGN DECISION: {title} | Rule: {rule} | Description: {desc}"
        chunks.append({
            "id": make_id("DesignDecisionsPage.tsx", title),
            "source": "DesignDecisionsPage.tsx",
            "page_type": "design_decision",
            "title": title,
            "status": "Stable",
            "structure": "",
            "logic": desc,
            "context_of_use": f"{rule}",
            "when_to_use": "",
            "when_not_to_use": "",
            "trade_offs": "",
            "aetheris_insight": "",
            "text": text,
            "char_count": len(text),
        })


def extract_guidelines(chunks: list):
    """GuidelinesPage.tsx → principios + voz"""
    src = read_tsx("GuidelinesPage.tsx")
    if not src:
        return

    for array_name in ("corePrinciples", "voiceRules", "interactionRules"):
        for obj in extract_objects_from_array(src, array_name):
            title = extract_string_field(obj, "title")
            desc  = extract_string_field(obj, "description") or extract_string_field(obj, "rule")
            if not title:
                continue
            text = f"{PRODUCT_NAME.upper()} GUIDELINE: {title} | {desc}"
            chunks.append({
                "id": make_id("GuidelinesPage.tsx", title),
                "source": "GuidelinesPage.tsx",
                "page_type": "guideline",
                "title": title,
                "status": "Stable",
                "structure": "",
                "logic": desc,
                "context_of_use": f"Array: {array_name}",
                "when_to_use": "",
                "when_not_to_use": "",
                "trade_offs": "",
                "aetheris_insight": "",
                "text": text,
                "char_count": len(text),
            })


def extract_accessibility(chunks: list):
    """FoundationsPage.tsx → accessibility contracts + readiness checklist."""
    src = read_tsx("FoundationsPage.tsx")
    if not src:
        return

    for obj in extract_objects_from_array(src, "ACCESSIBILITY_CONTRACTS"):
        title = extract_string_field(obj, "title")
        description = extract_string_field(obj, "description")
        requirements = extract_string_field(obj, "requirements")
        applies_to = extract_string_field(obj, "appliesTo")
        token_references = extract_string_field(obj, "tokenReferences")
        rag_relation = extract_string_field(obj, "ragRelation")
        if not title or not description:
            continue

        fields = {
            "description": description,
            "structure": "Transversal accessibility contract",
            "logic": requirements,
            "context_of_use": applies_to,
            "when_to_use": f"Apply before approving any affected component or pattern. Related tokens: {token_references}",
            "when_not_to_use": "Accessibility is never optional or deferred as post-release polish.",
            "accessibility": description,
            "rag_relation": rag_relation,
            "aetheris_insight": "Accessibility is a system-wide quality contract, not a component-specific add-on.",
        }
        chunks.append(build_chunk("FoundationsPage.tsx", "accessibility", title, fields))

    checklist_items = []
    for obj in extract_objects_from_array(src, "ACCESSIBILITY_READINESS_CHECKLIST"):
        text = extract_string_field(obj, "text")
        if text:
            checklist_items.append(text)

    if checklist_items:
        checklist_text = " ".join(
            f"{index + 1}. {item}" for index, item in enumerate(checklist_items)
        )
        fields = {
            "description": "Gate obrigatório antes de um componente entrar no Aetheris.",
            "structure": f"{len(checklist_items)} verificações de prontidão acessível",
            "logic": checklist_text,
            "context_of_use": "Component review, pattern review, documentation and Beatrice guidance.",
            "when_to_use": "Use during design, implementation, QA and corpus review.",
            "when_not_to_use": "Do not approve a component with undocumented or failed checks.",
            "accessibility": checklist_text,
            "rag_relation": "Fornece à Beatrice uma lista verificável para auditar prontidão e apontar lacunas.",
            "aetheris_insight": "Prontidão acessível exige evidência reproduzível, não apenas intenção.",
        }
        chunks.append(
            build_chunk(
                "FoundationsPage.tsx",
                "accessibility",
                "Checklist de prontidão acessível",
                fields,
            )
        )


def extract_reasoning(chunks: list):
    """ReasoningPage.tsx → reasoning steps, confidence metrics, alternatives"""
    src = read_tsx("ReasoningPage.tsx")
    if not src:
        return

    # Only process the en-US section (first occurrence of each array)
    en_src = src[:src.find("isPtPt")] if "isPtPt" in src else src

    # Reasoning steps — how Beatrice processes a query
    step_objects = extract_objects_from_array(en_src, "steps")
    for obj in step_objects:
        title = extract_string_field(obj, "title")
        desc  = extract_string_field(obj, "description")
        if not title or not desc:
            continue
        text = (
            f"{PRODUCT_NAME.upper()} REASONING STEP: {title} | "
            f"Description: {desc} | "
            "Context Of Use: Beatrice cognitive pipeline — how evidence and UX "
            "principles are combined before a recommendation is generated"
        )
        chunks.append({
            "id":               make_id("ReasoningPage.tsx", title),
            "source":           "ReasoningPage.tsx",
            "page_type":        "reasoning",
            "title":            title,
            "status":           "Stable",
            "structure":        "",
            "logic":            desc,
            "context_of_use":   "Beatrice XAI reasoning pipeline",
            "when_to_use":      "",
            "when_not_to_use":  "",
            "trade_offs":       "",
            "aetheris_insight": "",
            "text":             text,
            "char_count":       len(text),
        })

    # Confidence metrics — scores that describe recommendation quality
    metric_objects = extract_objects_from_array(en_src, "metrics")
    metric_parts = []
    for obj in metric_objects:
        label = extract_string_field(obj, "label")
        if label:
            metric_parts.append(label)
    if metric_parts:
        text = (
            f"{PRODUCT_NAME.upper()} REASONING: Confidence Metrics | "
            "Logic: Beatrice scores each recommendation on three dimensions: "
            + ", ".join(metric_parts) + " | "
            "Context Of Use: Displayed after each oracle response to calibrate user trust | "
            "Aetheris Insight: Scores are derived from vector similarity and UX principle alignment"
        )
        chunks.append({
            "id":               "ReasoningPage.tsx :: confidence_metrics",
            "source":           "ReasoningPage.tsx",
            "page_type":        "reasoning",
            "title":            "Confidence Metrics",
            "status":           "Stable",
            "structure":        "Three-axis scoring: " + ", ".join(metric_parts),
            "logic":            "Scores surface how well a recommendation aligns with design system rules and UX principles.",
            "context_of_use":   "Shown after oracle responses to help users calibrate trust",
            "when_to_use":      "Reference when evaluating competing recommendations",
            "when_not_to_use":  "",
            "trade_offs":       "Scores are proxies — high similarity does not guarantee the correct recommendation for every context.",
            "aetheris_insight": "Confidence calibration is what distinguishes an oracle from a search engine.",
            "text":             text,
            "char_count":       len(text),
        })

    # Decision alternatives — paths considered and rejected
    alt_objects = extract_objects_from_array(en_src, "alternatives")
    alt_parts = []
    for obj in alt_objects:
        title  = extract_string_field(obj, "title")
        result = extract_string_field(obj, "result")
        if title and result:
            alt_parts.append(f"{title}: {result}")
    if alt_parts:
        text = (
            f"{PRODUCT_NAME.upper()} REASONING: Decision Alternatives | "
            "Logic: Beatrice evaluates multiple response strategies before selecting one | "
            + " | ".join(alt_parts)
        )
        chunks.append({
            "id":               "ReasoningPage.tsx :: decision_alternatives",
            "source":           "ReasoningPage.tsx",
            "page_type":        "reasoning",
            "title":            "Decision Alternatives",
            "status":           "Stable",
            "structure":        "Multiple paths evaluated; only the best-fit strategy is returned",
            "logic":            "Alternative paths are weighted against clarity, rationale depth and trust calibration.",
            "context_of_use":   "Internal oracle evaluation — surfaces in XAI explanation when requested",
            "when_to_use":      "Reference when the user asks why a specific response style was chosen",
            "when_not_to_use":  "",
            "trade_offs":       "Showing rejected paths increases transparency but adds cognitive load.",
            "aetheris_insight": "The best oracle response is the one the user can audit, trust, and reuse.",
            "text":             text,
            "char_count":       len(text),
        })


def extract_beatrice_capabilities(chunks: list):
    """capabilities.ts → automatic skills and user-triggered Oracle commands."""
    if not CAPABILITY_REGISTRY.exists():
        print(f"  [AVISO] registry não encontrado: {CAPABILITY_REGISTRY}", file=sys.stderr)
        return

    source = CAPABILITY_REGISTRY.read_text(encoding="utf-8")
    groups = (
        ("AUTOMATIC_SKILLS", "automatic_skill"),
        ("ORACLE_COMMANDS", "oracle_command"),
    )

    for array_name, page_type in groups:
        for obj in extract_objects_from_array(source, array_name):
            capability_id = extract_string_field(obj, "id")
            name = extract_string_field(obj, "name")
            capability_type = extract_string_field(obj, "type")
            command = extract_string_field(obj, "command")
            canonical_command = extract_string_field(obj, "canonicalCommand")
            description = extract_string_field(obj, "description")
            activation = extract_string_field(obj, "activation")
            example = extract_string_field(obj, "example")
            output = extract_string_field(obj, "output")
            combines_with = extract_string_field(obj, "combinesWith")
            rag_evidence = extract_string_field(obj, "ragEvidence")
            auditability = extract_string_field(obj, "auditability")
            if not capability_id or not name:
                continue

            text = (
                f"{PRODUCT_NAME.upper()} BEATRICE CAPABILITY: {name} | "
                f"Type: {capability_type} | Command: {command or 'automatic'} | "
                f"Canonical command: {canonical_command or command or 'none'} | "
                f"Description: {description} | Activation: {activation} | "
                f"Example: {example} | Expected output: {output} | "
                f"Can combine with: {combines_with} | RAG evidence: {rag_evidence} | "
                f"Auditability: {auditability}"
            )
            chunks.append({
                "id":               make_id("capabilities.ts", capability_id),
                "source":           "beatrice/domain/governance/capabilities.ts",
                "page_type":        page_type,
                "title":            name,
                "status":           "Experimental" if "experimental: true" in obj else "Stable",
                "structure":        capability_type,
                "logic":            description or output,
                "context_of_use":   activation,
                "when_to_use":      example,
                "when_not_to_use":  "",
                "trade_offs":       combines_with,
                "aetheris_insight": auditability,
                "text":             text,
                "char_count":       len(text),
            })


def extract_persona(chunks: list):
    """PersonaPage.tsx → goals, frustrations, journey steps, oracle capabilities"""
    src = read_tsx("PersonaPage.tsx")
    if not src:
        return

    # Only process the en-US section (first locale block)
    en_src = src[:src.find("isPtPt")] if "isPtPt" in src else src

    # Persona goals
    goal_objects = extract_objects_from_array(en_src, "goals")
    goal_parts = []
    for obj in goal_objects:
        title = extract_string_field(obj, "title")
        text  = extract_string_field(obj, "text")
        if title:
            goal_parts.append(f"{title}: {text}" if text else title)
    if goal_parts:
        text = (
            f"{PRODUCT_NAME.upper()} PERSONA: Francisco Soares — Goals | "
            "Context Of Use: Primary consumer persona — Product Manager using the design system | "
            + " | ".join(goal_parts)
        )
        chunks.append({
            "id":               "PersonaPage.tsx :: francisco_goals",
            "source":           "PersonaPage.tsx",
            "page_type":        "persona",
            "title":            "Persona Goals — Francisco Soares",
            "status":           "Stable",
            "structure":        "",
            "logic":            "Goals define what the primary consumer persona needs from Beatrice.",
            "context_of_use":   "Primary persona: Product Manager, mid-level DS consumer, sprint-pressure context",
            "when_to_use":      "Reference when designing oracle responses for time-constrained users",
            "when_not_to_use":  "",
            "trade_offs":       "",
            "aetheris_insight": "Francisco wants the right answer in 30 seconds — depth on demand, not by default.",
            "text":             text,
            "char_count":       len(text),
        })

    # Persona frustrations
    frust_objects = extract_objects_from_array(en_src, "frustrations")
    frust_parts = []
    for obj in frust_objects:
        title = extract_string_field(obj, "title")
        text  = extract_string_field(obj, "text")
        if title:
            frust_parts.append(f"{title}: {text}" if text else title)
    if frust_parts:
        text = (
            f"{PRODUCT_NAME.upper()} PERSONA: Francisco Soares — Frustrations | "
            "Context Of Use: Pain points that Beatrice is designed to resolve | "
            + " | ".join(frust_parts)
        )
        chunks.append({
            "id":               "PersonaPage.tsx :: francisco_frustrations",
            "source":           "PersonaPage.tsx",
            "page_type":        "persona",
            "title":            "Persona Frustrations — Francisco Soares",
            "status":           "Stable",
            "structure":        "",
            "logic":            "Documented friction points that the oracle must address.",
            "context_of_use":   "Guides oracle response design: answers must be fast, scannable and source-backed",
            "when_to_use":      "Reference when evaluating whether an oracle response resolves the user's real barrier",
            "when_not_to_use":  "",
            "trade_offs":       "",
            "aetheris_insight": "The oracle exists to eliminate the gap between documentation and decision.",
            "text":             text,
            "char_count":       len(text),
        })

    # Oracle capabilities — how Aetheris addresses each pain point
    cap_objects = extract_objects_from_array(en_src, "oracleCapabilities")
    for obj in cap_objects:
        title = extract_string_field(obj, "title")
        tag   = extract_string_field(obj, "tag")
        desc  = extract_string_field(obj, "text")
        if not title:
            continue
        text = (
            f"{PRODUCT_NAME.upper()} PERSONA: Oracle Capability — {title} | "
            f"Tag: {tag} | Description: {desc}"
        )
        chunks.append({
            "id":               make_id("PersonaPage.tsx", f"capability_{title}"),
            "source":           "PersonaPage.tsx",
            "page_type":        "persona",
            "title":            f"Oracle Capability: {title}",
            "status":           "Stable",
            "structure":        tag,
            "logic":            desc,
            "context_of_use":   "Maps persona pain point to specific Aetheris component or feature",
            "when_to_use":      "",
            "when_not_to_use":  "",
            "trade_offs":       "",
            "aetheris_insight": "",
            "text":             text,
            "char_count":       len(text),
        })


def extract_dev_integration(chunks: list):
    """DevIntegrationPage.tsx → API endpoints, framework support"""
    src = read_tsx("DevIntegrationPage.tsx")
    if not src:
        return

    # Only process the en-US section (first locale block)
    en_src = src[:src.find("isPtPt")] if "isPtPt" in src else src

    # API endpoints
    endpoint_objects = extract_objects_from_array(en_src, "endpoints")
    ep_parts = []
    for obj in endpoint_objects:
        method = extract_string_field(obj, "method")
        path   = extract_string_field(obj, "path")
        desc   = extract_string_field(obj, "description")
        if path:
            ep_parts.append(f"{method} {path}: {desc}" if desc else f"{method} {path}")
    if ep_parts:
        text = (
            f"{PRODUCT_NAME.upper()} DEV INTEGRATION: API Endpoints | "
            "Context Of Use: Connecting frontend or external tools to the Beatrice oracle backend | "
            + " | ".join(ep_parts)
        )
        chunks.append({
            "id":               "DevIntegrationPage.tsx :: api_endpoints",
            "source":           "DevIntegrationPage.tsx",
            "page_type":        "dev_integration",
            "title":            "API Endpoints",
            "status":           "Stable",
            "structure":        "REST + streaming endpoints served by the FastAPI server on port 3333",
            "logic":            "Beatrice exposes /api/chat (SSE streaming) and /health (status check).",
            "context_of_use":   "Integrating Beatrice into external tools, dashboards or developer workflows",
            "when_to_use":      "Use /api/chat for all oracle queries. Use /health to verify server status.",
            "when_not_to_use":  "Do not poll /api/chat for non-query operations.",
            "trade_offs":       "SSE streaming requires EventSource-compatible clients.",
            "aetheris_insight": "The API contract mirrors OpenAI streaming format — compatible with most AI SDK clients.",
            "text":             text,
            "char_count":       len(text),
        })

    # Framework support — top-level const, not locale-dependent
    fw_objects = extract_objects_from_array(src, "frameworks")
    fw_parts = []
    for obj in fw_objects:
        name   = extract_string_field(obj, "name")
        meta   = extract_string_field(obj, "meta")
        status = extract_string_field(obj, "status")
        if name:
            fw_parts.append(f"{name} ({meta}) — {status}" if meta else name)
    if fw_parts:
        text = (
            f"{PRODUCT_NAME.upper()} DEV INTEGRATION: Framework Support | "
            "Context Of Use: Installing the Aetheris design system into a project | "
            + " | ".join(fw_parts)
        )
        chunks.append({
            "id":               "DevIntegrationPage.tsx :: framework_support",
            "source":           "DevIntegrationPage.tsx",
            "page_type":        "dev_integration",
            "title":            "Framework Support",
            "status":           "Stable",
            "structure":        "npm packages: @aetheris/core, @aetheris/tokens, @aetheris/react",
            "logic":            "Aetheris ships framework-specific adapters alongside a framework-agnostic core.",
            "context_of_use":   "Setting up Aetheris in a new or existing project",
            "when_to_use":      "Install @aetheris/react for React projects, @aetheris/vue for Vue projects.",
            "when_not_to_use":  "Do not import @aetheris/react in a Vue project or vice versa.",
            "trade_offs":       "Framework packages add a thin adapter layer — minimal overhead, maximum type safety.",
            "aetheris_insight": "The core + tokens separation means theme changes never require framework updates.",
            "text":             text,
            "char_count":       len(text),
        })


# ═══════════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════════

def main():
    chunks: list[dict] = []

    print("Extraindo componentes (ComponentsPage.tsx)…")
    extract_components(chunks)

    print("Extraindo padrões (PatternsPage.tsx)…")
    extract_patterns(chunks)

    print("Extraindo tokens (TokensPage.tsx)…")
    extract_tokens(chunks)

    print("Extraindo design decisions (DesignDecisionsPage.tsx)…")
    extract_design_decisions(chunks)

    print("Extraindo guidelines (GuidelinesPage.tsx)…")
    extract_guidelines(chunks)

    print("Extraindo acessibilidade (FoundationsPage.tsx)…")
    extract_accessibility(chunks)

    print("Extraindo raciocínio XAI (ReasoningPage.tsx)…")
    extract_reasoning(chunks)

    print("Extraindo capacidades da Beatrice (capabilities.ts)…")
    extract_beatrice_capabilities(chunks)

    print("Extraindo persona (PersonaPage.tsx)…")
    extract_persona(chunks)

    print("Extraindo integração dev (DevIntegrationPage.tsx)…")
    extract_dev_integration(chunks)

    if not chunks:
        print("[ERRO] Nenhum chunk extraído. Verifique os caminhos TSX.", file=sys.stderr)
        sys.exit(1)

    # deduplicação por id
    seen = set()
    unique_chunks = []
    for c in chunks:
        if c["id"] not in seen:
            seen.add(c["id"])
            unique_chunks.append(c)
    chunks = unique_chunks

    # estatísticas por tipo
    from collections import Counter
    type_counts = Counter(c["page_type"] for c in chunks)

    # ── JSON output ───────────────────────────────────────────────────────────
    sources = sorted(set(c["source"] for c in chunks))
    dump = {
        "meta": {
            "total_chunks": len(chunks),
            "sources": sources,
            "embedding_model": "BAAI/bge-m3",
            "extractor_version": "2.2.0-capability-registry",
            "note": "Extracted from React/TypeScript source — TSX is the source of truth",
        },
        "chunks": chunks,
    }

    json_path = OUTPUT_DIR / "aetheris-docs-dump.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(dump, f, ensure_ascii=False, indent=2)
    print(f"\n✓ JSON gravado → {json_path}  ({len(chunks)} chunks)")

    # ── Markdown output ───────────────────────────────────────────────────────
    md_lines = [
        "# Aetheris Design System — Corpus Dump (TSX Source)",
        "",
        f"> **Total chunks:** {len(chunks)}",
        f"> **Extractor:** v2.2.0-capability-registry (React/TypeScript source)",
        f"> **Embedding model:** BAAI/bge-m3",
        "",
        "---",
        "",
    ]
    for c in chunks:
        md_lines.append(f"## [{c['page_type'].upper()}] {c['title']}")
        md_lines.append(f"**Source:** `{c['source']}`  **Status:** {c['status']}  "
                        f"**Chars:** {c['char_count']}")
        md_lines.append("")
        for field in ("structure","logic","context_of_use","when_to_use",
                      "when_not_to_use","trade_offs","aetheris_insight"):
            val = c.get(field, "")
            if val:
                label = field.replace("_"," ").title()
                md_lines.append(f"**{label}:** {val}")
        md_lines.append("")
        md_lines.append("---")
        md_lines.append("")

    md_path = OUTPUT_DIR / "aetheris-docs-dump.md"
    with open(md_path, "w", encoding="utf-8") as f:
        f.write("\n".join(md_lines))
    print(f"✓ Markdown gravado → {md_path}")

    # ── Resumo ────────────────────────────────────────────────────────────────
    print("\n── Estatísticas ────────────────────────────────")
    max_count = max(type_counts.values())
    for ptype, count in sorted(type_counts.items(), key=lambda x: -x[1]):
        bar = "█" * int(count / max_count * 9)
        print(f"  {ptype:<20} {count:>3}  {bar}")
    avg = sum(c["char_count"] for c in chunks) / len(chunks)
    print(f"\n  Tamanho médio de chunk: {avg:.0f} chars")
    print("────────────────────────────────────────────────")
    print("\nConcluído.")


if __name__ == "__main__":
    main()
