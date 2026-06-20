#!/usr/bin/env python3
"""Enrich Velaris institutional knowledge without changing runtime architecture."""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path
from textwrap import wrap

ROOT = Path(__file__).resolve().parents[1]
CATALOG_PATH = ROOT / "data" / "component-metadata.json"
DUMP_JSON_PATH = ROOT / "rag" / "aetheris-docs-dump.json"
DUMP_MD_PATH = ROOT / "rag" / "aetheris-docs-dump.md"
KNOWLEDGE_MD_PATH = ROOT / "rag" / "institutional-knowledge.md"
REPORT_PATH = ROOT / "docs" / "_audits" / "ABRAXOS_INSTITUTIONAL_KNOWLEDGE_REPORT.md"

if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

PROVENANCE = "institutional-knowledge:2026-06-17"
PRODUCT_NAME = "Velaris"

PERSPECTIVES = [
    ("designer", "Designer"),
    ("ux-specialist", "UX Specialist"),
    ("developer", "Developer"),
    ("solution-architect", "Solution Architect"),
    ("qa", "QA"),
    ("accessibility", "Accessibility"),
    ("maintainer", "Maintainer"),
    ("tech-writer", "Tech Writer"),
    ("design-system-manager", "Design System Manager"),
]

RELATED: dict[str, list[str]] = {
    "button": ["link", "icon", "form-field", "modal-dialog", "command-palette"],
    "toggle-switch": ["checkbox", "radio-button", "form-field", "alert", "source-attribution"],
    "checkbox": ["radio-button", "selectable-chip", "form-field", "data-table", "toggle-switch"],
    "radio-button": ["checkbox", "select-dropdown", "tabs", "form-field", "selectable-chip"],
    "selectable-chip": ["checkbox", "select-dropdown", "button", "tabs", "card"],
    "text-input": ["text-area", "form-field", "select-dropdown", "date-picker", "explanation-tooltip"],
    "text-area": ["text-input", "form-field", "audit-panel", "source-attribution", "explanation-tooltip"],
    "select-dropdown": ["radio-button", "text-input", "selectable-chip", "form-field", "data-table"],
    "date-picker": ["text-input", "form-field", "select-dropdown", "alert", "data-table"],
    "form-field": ["text-input", "text-area", "select-dropdown", "checkbox", "explanation-tooltip"],
    "link": ["button", "tabs", "command-palette", "source-attribution", "typography"],
    "tabs": ["link", "card", "data-table", "command-palette", "typography"],
    "card": ["typography", "button", "link", "data-table", "source-attribution"],
    "modal-dialog": ["button", "form-field", "alert", "explanation-tooltip", "audit-panel"],
    "data-table": ["typography", "checkbox", "selectable-chip", "source-attribution", "audit-panel"],
    "alert": ["toast", "form-field", "button", "source-attribution", "audit-panel"],
    "toast": ["alert", "button", "source-attribution", "audit-panel", "icon"],
    "skeleton-loader": ["card", "data-table", "typography", "alert", "toast"],
    "explanation-tooltip": ["form-field", "icon", "typography", "source-attribution", "alert"],
    "confidence-badge": ["source-attribution", "audit-panel", "explanation-tooltip", "alert", "data-table"],
    "command-palette": ["text-input", "link", "button", "tabs", "icon"],
    "source-attribution": ["confidence-badge", "audit-panel", "card", "link", "typography"],
    "audit-panel": ["source-attribution", "confidence-badge", "data-table", "modal-dialog", "alert"],
    "typography": ["card", "link", "icon", "data-table", "form-field"],
    "icon": ["button", "link", "explanation-tooltip", "toast", "typography"],
}

SECTION_ALTERNATIVES = {
    "action": "elementos clicáveis crus e ações estilizadas localmente",
    "input": "controles de formulário isolados com validação privada",
    "feedback": "mensagens decorativas sem prioridade semântica",
    "navigation": "affordances de navegação improvisadas que confundem destino e ação",
    "content": "estilos de conteúdo sem semântica reutilizável",
    "layout": "containers visuais usados apenas como decoração",
    "overlay": "hacks de página que interrompem foco sem contrato explícito",
    "data_display": "listas genéricas que perdem estrutura de comparação",
    "structure": "primitivos visuais sem restrições do sistema",
}

SECTION_RISKS = {
    "action": "a hierarquia de decisão se fragmentar entre times e ações críticas ficarem visualmente indistinguíveis",
    "input": "validação, rotulagem e recuperação divergirem de formulário para formulário",
    "feedback": "usuários deixarem de confiar no status do sistema porque urgência e consequência são inconsistentes",
    "navigation": "rotas, ações e superfícies de descoberta competirem pela mesma linguagem de interação",
    "content": "documentação, evidência e copy de interface derivarem para vocabulários separados",
    "layout": "containers virarem ruído decorativo em vez de agrupamento semântico",
    "overlay": "gestão de foco e política de interrupção virarem improviso específico de produto",
    "data_display": "times perderem um contrato comum para escanear, comparar e auditar informação densa",
    "structure": "a linguagem visual se dividir em dialetos locais de ícone, tipo e primitivos",
}


def localized(pt: str, en: str | None = None) -> dict:
    return {"pt": pt, "en": en or pt}


def rule(component_id: str, field: str, index: int, pt: str, en: str | None = None) -> dict:
    return {"id": f"{component_id}.{field}.{index}", "text": localized(pt, en)}


def component_slug(name: str) -> str:
    clean = "".join(ch.lower() if ch.isalnum() else "-" for ch in name)
    return "-".join(part for part in clean.split("-") if part)


def chunk_id(source: str, title: str) -> str:
    slug = "".join(ch.lower() if ch.isalnum() else "_" for ch in title).strip("_")
    while "__" in slug:
        slug = slug.replace("__", "_")
    base = source.replace("/", "_").replace(".md", "").replace(".json", "").lower()
    return f"{base} :: {slug}"


def localized_text(value: dict | None) -> str:
    if not value:
        return ""
    return str(value.get("pt") or value.get("en") or "")


def field_sentence(component: dict, field: str) -> str:
    return localized_text(component.get(field)).rstrip(".")


def related_names(component: dict, by_id: dict[str, dict]) -> list[str]:
    names = []
    for related_id in RELATED.get(component["component_id"], component.get("related_components") or []):
        related = by_id.get(related_id)
        if related:
            names.append(related["name"])
    return names


def enrich_component_metadata(catalog: dict) -> dict:
    by_id = {component["component_id"]: component for component in catalog["components"]}
    all_ids = set(by_id)

    for component in catalog["components"]:
        component_id = component["component_id"]
        name = component["name"]
        section = component["section"]
        description = field_sentence(component, "description")
        logic = field_sentence(component, "logic")
        structure = field_sentence(component, "structure")
        tradeoff = field_sentence(component, "trade_offs") or (
            f"{name} accepts stricter system behavior to reduce local interpretation."
        )
        a11y = localized_text((component.get("accessibility") or {}).get("summary")).rstrip(".")
        related = [item for item in RELATED.get(component_id, []) if item in all_ids]
        related_label = ", ".join(by_id[item]["name"] for item in related[:5])
        rejected = SECTION_ALTERNATIVES.get(section, "local one-off patterns")
        risk = SECTION_RISKS.get(section, "teams diverge from the shared system contract")

        component["related_components"] = related
        component["content_guidelines"] = [
            rule(
                component_id,
                "knowledge",
                1,
                (
                    f"Design Rationale: {name} existe porque {description.lower()}. "
                    f"A alternativa rejeitada foi depender de {rejected}; isso parecia mais rápido, "
                    f"mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: {tradeoff}."
                ),
                (
                    f"Design Rationale: {name} exists because {description.lower()}. "
                    f"The rejected alternative was relying on {rejected}; that looked faster, "
                    f"but broke predictability, evidence and governance. The accepted tradeoff was: {tradeoff}."
                ),
            ),
            rule(
                component_id,
                "knowledge",
                2,
                (
                    f"Architectural Impact: alterações em {name} afetam {related_label}. "
                    f"Os contratos frágeis são estrutura ({structure}), lógica ({logic}) e estados acessíveis. "
                    "Mudanças visuais sem revisar esses contratos tendem a criar regressões transversais."
                ),
                (
                    f"Architectural Impact: changes to {name} affect {related_label}. "
                    f"The fragile contracts are structure ({structure}), logic ({logic}) and accessible states. "
                    "Visual changes without reviewing those contracts tend to create cross-surface regressions."
                ),
            ),
            rule(
                component_id,
                "knowledge",
                3,
                (
                    f"UX Consequences: {name} orienta o usuário a interpretar {logic.lower()}. "
                    "Ele reduz hesitação quando a consequência é visível antes da interação e evita erro "
                    "quando estado, prioridade e recuperação permanecem próximos do ponto de decisão."
                ),
                (
                    f"UX Consequences: {name} guides the user to interpret {logic.lower()}. "
                    "It reduces hesitation when the consequence is visible before interaction and avoids error "
                    "when state, priority and recovery remain close to the decision point."
                ),
            ),
            rule(
                component_id,
                "knowledge",
                4,
                (
                    f"Accessibility Rationale: {a11y}. Se essa decisão for removida, {name} ainda pode parecer correto "
                    "visualmente, mas perde operação por teclado, anúncio ou entendimento programático."
                ),
                (
                    f"Accessibility Rationale: {a11y}. If this decision is removed, {name} may still look correct "
                    "visually, but loses keyboard operation, announcement or programmatic understanding."
                ),
            ),
            rule(
                component_id,
                "knowledge",
                5,
                (
                    f"Governance Perspective: {name} resolve o risco organizacional de {risk}. "
                    "Ao centralizar nomenclatura, estados, relações e exceções, ele reduz divergência entre produto, "
                    "design, engenharia, QA e documentação."
                ),
                (
                    f"Governance Perspective: {name} addresses the organizational risk that {risk}. "
                    "By centralizing naming, states, relationships and exceptions, it reduces divergence across product, "
                    "design, engineering, QA and documentation."
                ),
            ),
            rule(
                component_id,
                "knowledge",
                6,
                (
                    f"Maintenance Perspective: as partes mais frágeis de {name} são tokens, estados, semântica, "
                    f"foco e mensagens associadas. Regressões costumam surgir quando o componente é ajustado para "
                    f"um fluxo local sem atualizar exemplos, testes, relação com {related_label} e critérios de acessibilidade."
                ),
                (
                    f"Maintenance Perspective: the most fragile parts of {name} are tokens, states, semantics, "
                    "focus and associated messages. Regressions usually appear when the component is adapted for "
                    f"a local flow without updating examples, tests, its relationship to {related_label} and accessibility criteria."
                ),
            ),
        ]

        component["edge_cases"] = [
            rule(
                component_id,
                "failure",
                1,
                (
                    f"Falha comum: usar {name} para resolver um problema que pertence a {related_label}. "
                    "Consequência: a UI funciona no caso feliz, mas o modelo mental fica errado em comparação, erro ou auditoria."
                ),
                (
                    f"Common failure: using {name} to solve a problem that belongs to {related_label}. "
                    "Consequence: the UI works in the happy path, but the mental model is wrong during comparison, error or audit."
                ),
            ),
            rule(
                component_id,
                "failure",
                2,
                (
                    f"Mau uso observado: customizar {name} para esconder uma lacuna de produto. "
                    "Consequência: o componente passa a carregar regra de negócio implícita e fica difícil de testar."
                ),
                (
                    f"Observed misuse: customizing {name} to hide a product gap. "
                    "Consequence: the component starts carrying implicit business logic and becomes hard to test."
                ),
            ),
            rule(
                component_id,
                "failure",
                3,
                (
                    f"Anti-pattern sistêmico: duplicar {name} em uma variante local antes de registrar a exceção. "
                    "Consequência: documentação, tokens e implementação deixam de apontar para a mesma entidade."
                ),
                (
                    f"System anti-pattern: duplicating {name} as a local variant before registering the exception. "
                    "Consequence: documentation, tokens and implementation stop pointing to the same entity."
                ),
            ),
            rule(
                component_id,
                "failure",
                4,
                (
                    f"Caso limite: múltiplas instâncias de {name} competem por foco, prioridade ou anúncio na mesma região. "
                    "Consequência: o usuário perde a ordem de decisão e QA precisa testar combinações que o sistema não deveria permitir."
                ),
                (
                    f"Edge case: multiple {name} instances compete for focus, priority or announcement in the same region. "
                    "Consequence: the user loses decision order and QA must test combinations the system should not allow."
                ),
            ),
        ]

        component["governance_notes"] = [
            rule(
                component_id,
                "governance",
                1,
                (
                    f"Risco organizacional: se {name} variar por squad, o Velaris perde uma fonte única para {section}. "
                    "A revisão deve confirmar se a necessidade é exceção documentada ou novo componente candidato."
                ),
                (
                    f"Organizational risk: if {name} varies per squad, Velaris loses a single source for {section}. "
                    "Review must confirm whether the need is a documented exception or a candidate new component."
                ),
            ),
            rule(
                component_id,
                "governance",
                2,
                (
                    f"Consistência: {name} deve manter vocabulário, estado e relação com {related_label} sincronizados "
                    "entre design, código, documentação e exemplos do catálogo."
                ),
                (
                    f"Consistency: {name} must keep vocabulary, state and its relationship with {related_label} synchronized "
                    "across design, code, documentation and catalog examples."
                ),
            ),
            rule(
                component_id,
                "governance",
                3,
                (
                    f"Controle de divergência: qualquer extensão de {name} precisa explicar problema, alternativa rejeitada, "
                    "tradeoff aceito, impacto de acessibilidade e caminho de migração."
                ),
                (
                    f"Divergence control: any {name} extension must explain the problem, rejected alternative, "
                    "accepted tradeoff, accessibility impact and migration path."
                ),
            ),
        ]

        component["anti_patterns"] = [
            rule(
                component_id,
                "anti_pattern",
                1,
                (
                    f"Tratar {name} como decoração. Consequência: a superfície parece consistente, mas o usuário não recebe "
                    "sinal confiável de ação, estado, navegação ou evidência."
                ),
                (
                    f"Treating {name} as decoration. Consequence: the surface looks consistent, but the user does not get "
                    "a reliable signal for action, state, navigation or evidence."
                ),
            ),
            rule(
                component_id,
                "anti_pattern",
                2,
                (
                    f"Remover semântica ou foco de {name} para encaixar uma composição visual. "
                    "Consequência: acessibilidade e automação de testes deixam de representar a experiência real."
                ),
                (
                    f"Removing semantics or focus from {name} to fit a visual composition. "
                    "Consequence: accessibility and test automation stop representing the real experience."
                ),
            ),
            rule(
                component_id,
                "anti_pattern",
                3,
                (
                    f"Usar {name} para mascarar decisão de produto indefinida. Consequência: o componente vira workaround "
                    "e transfere ambiguidade para usuários, QA e documentação."
                ),
                (
                    f"Using {name} to mask an undefined product decision. Consequence: the component becomes a workaround "
                    "and transfers ambiguity to users, QA and documentation."
                ),
            ),
        ]

        provenance = component.setdefault("provenance", {})
        for field in (
            "related_components",
            "content_guidelines",
            "edge_cases",
            "governance_notes",
            "anti_patterns",
        ):
            provenance[field] = [PROVENANCE]

    return catalog


def base_chunk(page_type: str, title: str, text: str, **extra: object) -> dict:
    source = str(extra.pop("source", "rag/institutional-knowledge.md"))
    fields = {
        "id": extra.pop("id", chunk_id(source, title)),
        "source": source,
        "page_type": page_type,
        "title": title,
        "status": extra.pop("status", "Stable"),
        "structure": extra.pop("structure", ""),
        "logic": extra.pop("logic", ""),
        "context_of_use": extra.pop("context_of_use", ""),
        "when_to_use": extra.pop("when_to_use", ""),
        "when_not_to_use": extra.pop("when_not_to_use", ""),
        "trade_offs": extra.pop("trade_offs", ""),
        "accessibility": extra.pop("accessibility", ""),
        "rag_relation": extra.pop("rag_relation", ""),
        "aetheris_insight": extra.pop("aetheris_insight", ""),
        "kind": extra.pop("kind", ""),
        "section": extra.pop("section", ""),
        "command": extra.pop("command", ""),
        "capability": extra.pop("capability", ""),
        "route": extra.pop("route", ""),
        "tags": extra.pop("tags", ""),
        "component_id": extra.pop("component_id", ""),
        "schema_version": extra.pop("schema_version", ""),
        "text": text,
        "char_count": len(text),
    }
    fields.update(extra)
    return fields


def institutional_component_chunks(catalog: dict) -> list[dict]:
    chunks = []
    by_id = {component["component_id"]: component for component in catalog["components"]}
    for component in catalog["components"]:
        name = component["name"]
        component_id = component["component_id"]
        related = ", ".join(related_names(component, by_id))
        knowledge = [localized_text(item["text"]) for item in component["content_guidelines"]]
        failures = [localized_text(item["text"]) for item in component["anti_patterns"]]
        text = (
            f"VELARIS COMPONENT INSTITUTIONAL KNOWLEDGE: {name} | "
            + " | ".join(knowledge)
            + f" | Knowledge Relationships: {name} relates to {related}. "
            + "Failure Knowledge: "
            + " ".join(failures)
        )
        chunks.append(
            base_chunk(
                "component",
                f"{name} — Institutional Knowledge",
                text,
                source="data/component-metadata.json",
                component_id=component_id,
                schema_version=catalog["schema_version"],
                kind="institutional_knowledge",
                section=component["section"],
                tags=f"component,institutional-knowledge,{component_id}",
                structure="Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.",
                logic=f"Institutional memory for why {name} exists and what breaks when it is misused.",
                context_of_use=f"Deep component analysis, design rationale, architecture review and governance questions about {name}.",
                when_to_use=f"Use when the user asks why {name} exists, what risks it controls, what alternatives were rejected or what consequences a change creates.",
                when_not_to_use="Do not use as generic UI best practice detached from the Velaris catalog.",
                trade_offs=field_sentence(component, "trade_offs"),
                accessibility=localized_text((component.get("accessibility") or {}).get("summary")),
                rag_relation=f"Deepens the canonical {name} registry with institutional reasoning.",
                aetheris_insight=f"{name} should be explained as a design-system decision, not only as a reusable UI element.",
            )
        )
    return chunks


def perspective_chunks(catalog: dict) -> list[dict]:
    chunks = []
    for component in catalog["components"]:
        name = component["name"]
        component_id = component["component_id"]
        logic = field_sentence(component, "logic")
        structure = field_sentence(component, "structure")
        section = component["section"]
        perspective_text = {
            "designer": f"Designer: inspeciona hierarquia visual, densidade e alinhamento de {name} com tokens e composição.",
            "ux-specialist": f"UX Specialist: avalia o comportamento humano que {name} incentiva, a hesitação que reduz e a confusão que ainda pode criar.",
            "developer": f"Developer: protege contrato de API, estados, semântica DOM e integração com componentes relacionados.",
            "solution-architect": f"Solution Architect: mede acoplamento, impacto sistêmico e custo de extensão de {name} em superfícies de {section}.",
            "qa": f"QA: cria cenários para default, foco, erro, indisponibilidade, regressão visual e combinações com dados extremos.",
            "accessibility": f"Accessibility: valida teclado, foco, anúncio, nome acessível, contraste e perda de informação quando a semântica é removida.",
            "maintainer": f"Maintainer: observa fragilidade em tokens, estados e exceções locais que podem virar variantes paralelas.",
            "tech-writer": f"Tech Writer: transforma o racional de {name} em linguagem de decisão, exemplos, limites e migração.",
            "design-system-manager": f"Design System Manager: decide se a divergência é exceção governada, evolução do componente ou dívida de adoção.",
        }
        text = (
            f"VELARIS COMPONENT PERSPECTIVE MATRIX: {name} | "
            f"Component logic: {logic}. Structure: {structure}. "
            + " | ".join(perspective_text[key] for key, _ in PERSPECTIVES)
        )
        chunks.append(
            base_chunk(
                "component",
                f"{name} — Perspective Matrix",
                text,
                source="rag/institutional-knowledge.md",
                component_id=component_id,
                kind="perspective_matrix",
                section=section,
                tags=f"component,perspectives,{component_id},designer,ux,developer,architect,qa,a11y,maintainer,tech-writer,manager",
                structure="Nine-perspective component interpretation matrix.",
                logic=f"Different professional lenses ask different questions about {name}.",
                context_of_use=f"Perspective-specific guidance, component critique, QA planning and governance review for {name}.",
                when_to_use=f"Use when the user asks how {name} looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.",
                trade_offs="Perspective depth improves specialist answers but must remain grounded in the canonical component contract.",
                aetheris_insight=f"{name} becomes institutional knowledge when each discipline can explain its risk and responsibility.",
            )
        )
    return chunks


COMPARISONS = [
    {
        "title": "Button vs Link",
        "left": "Button",
        "right": "Link",
        "difference": "Button changes state or submits an explicit action; Link moves the user to another destination.",
        "advantages": "Button carries consequence, priority and async state. Link carries destination, shareability and navigation expectation.",
        "limitations": "A button used for navigation hides routing semantics; a link used for mutation weakens accessibility and user trust.",
        "context": "Use this comparison when deciding between command and destination behavior.",
        "impact": "The wrong choice teaches users the wrong mental model and creates QA ambiguity around Enter/Space, href, disabled and history behavior.",
    },
    {
        "title": "Modal/Dialog vs Drawer",
        "left": "Modal/Dialog",
        "right": "Drawer",
        "difference": "Dialog isolates attention and blocks continuation; Drawer preserves more spatial context but is not currently a canonical Velaris component.",
        "advantages": "Dialog is strong for short blocking decisions. Drawer is better for contextual editing when future governance approves it.",
        "limitations": "Dialog overuse creates interruption fatigue. Drawer without governance can become a hidden second page with weak focus policy.",
        "context": "Use for overlay decisions, especially confirmation, creation and contextual editing flows.",
        "impact": "Choosing Dialog asserts that the user must decide now; choosing Drawer asserts that surrounding context remains relevant.",
    },
    {
        "title": "Tooltip vs Popover",
        "left": "Explanation Bubble / Tooltip",
        "right": "Popover",
        "difference": "Tooltip offers short supplemental explanation; Popover implies richer interactive content and is not canonical yet.",
        "advantages": "Tooltip is lightweight and tied to a trigger. Popover can support richer help if promoted to a governed component.",
        "limitations": "Tooltip cannot hold essential instructions or complex controls. Popover adds focus, dismissal and mobile complexity.",
        "context": "Use when deciding whether help belongs inline, in a tooltip, or in a future richer disclosure component.",
        "impact": "Hiding essential information in a tooltip creates touch and assistive-technology failures; promoting it to Popover requires a new contract.",
    },
    {
        "title": "Toast vs Alert",
        "left": "Toast/Notification",
        "right": "Alert",
        "difference": "Toast is transient confirmation; Alert is persistent contextual feedback with consequence.",
        "advantages": "Toast preserves flow after low-risk updates. Alert keeps high-importance information visible and actionable.",
        "limitations": "Toast disappears and is poor for required action. Alert can create noise if severity is inflated.",
        "context": "Use for status messages, save confirmations, failures and recoverable warnings.",
        "impact": "The wrong choice either hides necessary recovery or interrupts users for messages they did not need to stop for.",
    },
    {
        "title": "Skeleton Loader vs Spinner",
        "left": "Skeleton Loader",
        "right": "Spinner",
        "difference": "Skeleton predicts the shape of incoming content; Spinner only says work is happening and is not a canonical Velaris component here.",
        "advantages": "Skeleton reduces layout shift and perceived waiting. Spinner can fit unknown-duration operations if later governed.",
        "limitations": "Skeleton is misleading when final geometry is unknown. Spinner gives no progress, structure or recovery signal.",
        "context": "Use when deciding how to represent loading for cards, tables, text regions and unknown operations.",
        "impact": "A bad loading pattern trains users to doubt whether content, error or empty state is coming next.",
    },
    {
        "title": "Accordion vs Tabs",
        "left": "Accordion",
        "right": "Tabs",
        "difference": "Tabs switch between sibling views in the same context; Accordion exposes collapsible sections and is not canonical yet.",
        "advantages": "Tabs support direct view switching and stateful panels. Accordion can reduce vertical density if introduced with governance.",
        "limitations": "Tabs hide simultaneous comparison. Accordion can bury content and create ambiguous heading/focus behavior.",
        "context": "Use for navigation inside a page, content organization and progressive disclosure decisions.",
        "impact": "Using Tabs for steps misleads users; using Accordion for critical choices can hide important decisions from scanning.",
    },
    {
        "title": "Checkbox vs Radio Button",
        "left": "Checkbox",
        "right": "Radio Button",
        "difference": "Checkbox supports independent inclusion; Radio Button supports exactly one choice in a known set.",
        "advantages": "Checkbox allows multiple valid selections. Radio keeps comparison visible for mutually exclusive options.",
        "limitations": "Checkbox fails for exclusive choices. Radio becomes heavy for long lists.",
        "context": "Use for preferences, filters, consent, settings and selection groups.",
        "impact": "Wrong selection semantics create invalid data and make validation feel arbitrary.",
    },
    {
        "title": "Select/Dropdown vs Radio Button",
        "left": "Select/Dropdown",
        "right": "Radio Button",
        "difference": "Select hides a larger option set behind a trigger; Radio exposes a small set for comparison.",
        "advantages": "Select saves space and handles scale. Radio improves recognition and comparison.",
        "limitations": "Select slows comparison. Radio consumes space and breaks down with many options.",
        "context": "Use for choice-count and discoverability decisions.",
        "impact": "Overusing Select hides important tradeoffs; overusing Radio makes forms long and noisy.",
    },
    {
        "title": "Input / Text Input vs Text Area",
        "left": "Input / Text Input",
        "right": "Text Area",
        "difference": "Input captures short structured values; Text Area captures longer prose, rationale or prompts.",
        "advantages": "Input optimizes speed and format validation. Text Area supports reflection, detail and longer editing.",
        "limitations": "Input truncates thinking when used for long answers. Text Area overstates effort for simple data.",
        "context": "Use for forms, prompts, comments, justifications and search-like inputs.",
        "impact": "The field size silently communicates expected effort; wrong sizing changes answer quality.",
    },
    {
        "title": "Source Attribution vs Audit Panel",
        "left": "Source Attribution",
        "right": "Audit Panel",
        "difference": "Source Attribution explains where a claim came from; Audit Panel exposes process, sequence and evidence quality.",
        "advantages": "Source Attribution is concise and local. Audit Panel supports inspection, accountability and debugging.",
        "limitations": "Attribution alone cannot explain a multi-step decision. Audit Panel is too heavy for every answer.",
        "context": "Use for XAI, evidence disclosure, governance and debugging the reasoning chain.",
        "impact": "Confusing the two either overburdens simple evidence or under-explains consequential AI decisions.",
    },
]


def comparison_chunks() -> list[dict]:
    chunks = []
    for item in COMPARISONS:
        text = (
            f"VELARIS COMPARATIVE DECISION: {item['title']} | "
            f"Difference: {item['difference']} | Advantages: {item['advantages']} | "
            f"Limitations: {item['limitations']} | Context of use: {item['context']} | "
            f"User impact: {item['impact']}"
        )
        chunks.append(
            base_chunk(
                "design_decision",
                item["title"],
                text,
                kind="comparative_chunk",
                section="comparison",
                tags="comparison,tradeoff,alternatives",
                structure="Difference, advantages, limitations, context and user impact.",
                logic=item["difference"],
                context_of_use=item["context"],
                when_to_use=f"Use when asked to compare {item['left']} and {item['right']}.",
                when_not_to_use="Do not collapse the pair into generic preference; preserve semantic consequences.",
                trade_offs=item["limitations"],
                aetheris_insight=item["impact"],
            )
        )
    return chunks


RELATIONSHIP_CLUSTERS = [
    {
        "title": "Knowledge Relationships — Action Controls",
        "items": "Button ↔ Link ↔ IconButton candidate ↔ Floating Action Button candidate ↔ Form Actions ↔ Command Palette",
        "logic": "Action controls differ by consequence, destination, visibility and command density.",
        "impact": "This relation prevents teams from treating every clickable element as a styled button.",
    },
    {
        "title": "Knowledge Relationships — Overlay And Interruption",
        "items": "Modal/Dialog ↔ Drawer candidate ↔ SideDrawer legacy reference ↔ Overlay ↔ Confirmation Pattern ↔ Alert",
        "logic": "Interruption patterns are governed by how much focus isolation and page context the decision requires.",
        "impact": "This relation keeps blocking decisions, contextual editing and feedback severity from collapsing into one overlay pattern.",
    },
    {
        "title": "Knowledge Relationships — Help And Validation",
        "items": "Explanation Bubble / Tooltip ↔ Popover candidate ↔ HelpText ↔ Inline Validation ↔ Form Field ↔ Alert",
        "logic": "Help belongs near the question, while validation belongs near the correction path.",
        "impact": "This relation prevents essential guidance from being hidden behind hover-only help.",
    },
    {
        "title": "Knowledge Relationships — Feedback And Loading",
        "items": "Toast ↔ Alert ↔ Skeleton Loader ↔ Empty State Pattern ↔ Source Attribution",
        "logic": "Feedback patterns vary by persistence, urgency, reversibility and whether content is pending or failed.",
        "impact": "This relation avoids using transient feedback for required recovery or using loading UI for known empty states.",
    },
    {
        "title": "Knowledge Relationships — Selection And Forms",
        "items": "Checkbox ↔ Radio Button ↔ Selectable Chip ↔ Select/Dropdown ↔ Form Field ↔ Date Picker",
        "logic": "Selection controls differ by independence, exclusivity, option count, format and validation burden.",
        "impact": "This relation reduces invalid data and helps teams choose controls by decision shape rather than visual preference.",
    },
    {
        "title": "Knowledge Relationships — Data And Explainability",
        "items": "Data Table ↔ Confidence Badge ↔ Source Attribution ↔ Audit Panel ↔ Typography",
        "logic": "Dense information and AI evidence need structure, provenance and auditability to remain trustworthy.",
        "impact": "This relation keeps explanation artifacts connected to the data surfaces where users inspect decisions.",
    },
    {
        "title": "Knowledge Relationships — Navigation And Discovery",
        "items": "Tabs ↔ Link ↔ Command Palette ↔ Card ↔ Typography ↔ Icon",
        "logic": "Navigation patterns vary by destination, sibling view, discovery mode and content grouping.",
        "impact": "This relation prevents global navigation, local view switching and command search from sharing ambiguous affordances.",
    },
]


def relationship_chunks() -> list[dict]:
    chunks = []
    for item in RELATIONSHIP_CLUSTERS:
        text = (
            f"VELARIS KNOWLEDGE RELATIONSHIP: {item['title']} | "
            f"Graph: {item['items']} | Logic: {item['logic']} | Impact: {item['impact']}"
        )
        chunks.append(
            base_chunk(
                "guideline",
                item["title"],
                text,
                kind="knowledge_relationship",
                section="relationships",
                tags="relationships,semantic-graph,component-relations",
                structure=item["items"],
                logic=item["logic"],
                context_of_use="Semantic relationship questions, alternative selection and governance review.",
                when_to_use="Use when the user asks what a component is related to or which neighboring pattern should be considered.",
                trade_offs="Relationship knowledge improves recall but must distinguish canonical components from candidates or legacy references.",
                aetheris_insight=item["impact"],
            )
        )
    return chunks


MIGRATIONS = [
    {
        "title": "Legacy Modal to Modal/Dialog",
        "strategy": "Inventory all legacy modals, classify by blocking decision, long task or contextual edit, then keep only short blocking decisions as Dialog.",
        "risks": "Nested modals, lost focus return, hidden form errors and unclear cancel paths.",
        "effort": "Medium: interaction review, focus tests, content reduction and regression QA.",
        "validation": "Keyboard trap, Escape, focus restoration, accessible name, cancel action and error recovery.",
    },
    {
        "title": "Legacy Table to Table/Data Table",
        "strategy": "Map columns to user comparison tasks, restore caption/header semantics, define sorting and mobile priority before styling.",
        "risks": "Decorative grid markup, truncated critical identifiers, row actions competing with scanability.",
        "effort": "High for dense products: data modeling, responsive behavior and QA fixtures are required.",
        "validation": "Header association, sort announcement, row action labels, overflow behavior and empty/error/loading states.",
    },
    {
        "title": "Custom Input to Canonical Input / Text Input",
        "strategy": "Replace visual-only fields with Form Field plus canonical Input, preserving labels, helper text, errors and autocomplete.",
        "risks": "Placeholder-as-label, lost aria-describedby, aggressive validation and wiped values after failed submit.",
        "effort": "Medium: mechanical replacement is simple, but validation and copy need review.",
        "validation": "Label persistence, inputMode/type, helper text, error message, preserved value and screen-reader announcement.",
    },
    {
        "title": "Styled Link Button to Button or Link",
        "strategy": "Classify each interaction by outcome: state mutation becomes Button; navigation becomes Link.",
        "risks": "Broken keyboard expectations, disabled links without explanation, submit actions hidden behind href.",
        "effort": "Low to medium: semantic cleanup plus visual parity and analytics checks.",
        "validation": "Enter/Space behavior, href/history behavior, disabled policy and destination/action label clarity.",
    },
    {
        "title": "Hover Help to Explanation Bubble / Tooltip",
        "strategy": "Move essential instructions inline, keep only supplemental microcopy in Tooltip, and wire focus plus aria-describedby.",
        "risks": "Touch users cannot access help, disabled triggers cannot receive focus, long help becomes unreadable.",
        "effort": "Medium: content triage is usually harder than implementation.",
        "validation": "Hover, focus, Escape, positioning, mobile fallback and whether the page still works without the tooltip.",
    },
    {
        "title": "Spinner-Heavy Loading to Skeleton Loader",
        "strategy": "Use Skeleton only where final geometry is predictable; otherwise define a governed loading or progress pattern.",
        "risks": "False shape promises, endless loading, motion sensitivity and confusion with empty state.",
        "effort": "Medium: each surface needs geometry mapping and failure fallback.",
        "validation": "Reserved dimensions, prefers-reduced-motion, busy region, error transition and layout shift.",
    },
    {
        "title": "Mixed Notifications to Alert and Toast",
        "strategy": "Separate transient confirmations into Toast and persistent consequence-bearing messages into Alert.",
        "risks": "Critical messages vanish, low-risk messages interrupt flow, duplicate global/local feedback.",
        "effort": "Low to medium: severity taxonomy and message inventory are the main cost.",
        "validation": "Persistence, dismissibility, live region urgency, action availability and duplicate-message suppression.",
    },
]


def migration_chunks() -> list[dict]:
    chunks = []
    for item in MIGRATIONS:
        text = (
            f"VELARIS MIGRATION KNOWLEDGE: {item['title']} | "
            f"Strategy: {item['strategy']} | Risks: {item['risks']} | "
            f"Effort: {item['effort']} | Validation: {item['validation']}"
        )
        chunks.append(
            base_chunk(
                "guideline",
                item["title"],
                text,
                kind="migration_knowledge",
                section="migration",
                tags="migration,legacy-modern,governance",
                structure="Legacy to modern migration strategy with risks, effort and validation.",
                logic=item["strategy"],
                context_of_use="Migration advisor, governance cleanup and design-system adoption planning.",
                when_to_use=f"Use when modernizing {item['title'].lower()}.",
                when_not_to_use="Do not treat migration as a visual swap; preserve behavior, accessibility and evidence.",
                trade_offs=item["risks"],
                aetheris_insight=item["validation"],
            )
        )
    return chunks


def supplementary_chunks(catalog: dict) -> list[dict]:
    return [
        *institutional_component_chunks(catalog),
        *perspective_chunks(catalog),
        *comparison_chunks(),
        *relationship_chunks(),
        *migration_chunks(),
    ]


def write_catalog(catalog: dict) -> None:
    from component_metadata import ComponentCatalog

    validated = ComponentCatalog.model_validate(catalog)
    CATALOG_PATH.write_text(
        validated.model_dump_json(indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )


def regenerate_base_dump() -> None:
    subprocess.run([sys.executable, "rag/extract_docs.py"], cwd=ROOT, check=True)


def write_dump_markdown(dump: dict) -> None:
    lines = [
        "# Aetheris Design System — Corpus Dump (TSX Source)",
        "",
        f"> **Total chunks:** {len(dump['chunks'])}",
        f"> **Extractor:** {dump['meta'].get('extractor_version', 'unknown')} + institutional knowledge supplement",
        f"> **Embedding model:** {dump['meta'].get('embedding_model', 'unknown')}",
        "",
        "---",
        "",
    ]
    for chunk in dump["chunks"]:
        lines.append(f"## [{chunk['page_type'].upper()}] {chunk['title']}")
        lines.append(
            f"**Source:** `{chunk['source']}`  **Status:** {chunk.get('status', '')}  "
            f"**Chars:** {chunk.get('char_count', 0)}"
        )
        lines.append("")
        for field in (
            "structure",
            "logic",
            "context_of_use",
            "when_to_use",
            "when_not_to_use",
            "trade_offs",
            "accessibility",
            "rag_relation",
            "aetheris_insight",
        ):
            value = chunk.get(field, "")
            if value:
                label = field.replace("_", " ").title()
                lines.append(f"**{label}:** {value}")
        if chunk.get("source") == "rag/institutional-knowledge.md":
            lines.append("")
            lines.append("**Institutional Text:**")
            for paragraph in wrap(chunk["text"], width=120):
                lines.append(paragraph)
        lines.append("")
        lines.append("---")
        lines.append("")
    DUMP_MD_PATH.write_text("\n".join(lines), encoding="utf-8")


def write_knowledge_markdown(catalog: dict, chunks: list[dict]) -> None:
    lines = [
        "# Velaris Institutional Knowledge Supplement",
        "",
        "Knowledge source for Abraxos RAG enrichment. This file does not change runtime architecture, model selection or prompts.",
        "",
        "## Component Institutional Knowledge",
        "",
    ]
    for component in catalog["components"]:
        name = component["name"]
        lines.append(f"### {name}")
        for item in component["content_guidelines"]:
            lines.append(f"- {localized_text(item['text'])}")
        lines.append("- Failure Knowledge:")
        for item in component["anti_patterns"]:
            lines.append(f"  - {localized_text(item['text'])}")
        lines.append("")

    lines.append("## Knowledge Relationships")
    lines.append("")
    for item in RELATIONSHIP_CLUSTERS:
        lines.append(f"### {item['title']}")
        lines.append(f"- Graph: {item['items']}")
        lines.append(f"- Logic: {item['logic']}")
        lines.append(f"- Impact: {item['impact']}")
        lines.append("")

    lines.append("## Comparative Chunks")
    lines.append("")
    for item in COMPARISONS:
        lines.append(f"### {item['title']}")
        lines.append(f"- Difference: {item['difference']}")
        lines.append(f"- Advantages: {item['advantages']}")
        lines.append(f"- Limitations: {item['limitations']}")
        lines.append(f"- Context: {item['context']}")
        lines.append(f"- User impact: {item['impact']}")
        lines.append("")

    lines.append("## Migration Knowledge")
    lines.append("")
    for item in MIGRATIONS:
        lines.append(f"### {item['title']}")
        lines.append(f"- Strategy: {item['strategy']}")
        lines.append(f"- Risks: {item['risks']}")
        lines.append(f"- Effort: {item['effort']}")
        lines.append(f"- Validation: {item['validation']}")
        lines.append("")

    lines.append("## Perspective Coverage")
    lines.append("")
    lines.append("| Perspective | Component coverage |")
    lines.append("|---|---:|")
    total_components = len(catalog["components"])
    for _, label in PERSPECTIVES:
        lines.append(f"| {label} | {total_components} components |")
    lines.append("")
    lines.append(f"Supplemental chunks generated: {len(chunks)}.")
    KNOWLEDGE_MD_PATH.write_text("\n".join(lines), encoding="utf-8")


def write_report(catalog: dict, chunks: list[dict], base_count: int, final_count: int) -> None:
    institutional = [chunk for chunk in chunks if chunk.get("kind") == "institutional_knowledge"]
    perspectives = [chunk for chunk in chunks if chunk.get("kind") == "perspective_matrix"]
    comparisons = [chunk for chunk in chunks if chunk.get("kind") == "comparative_chunk"]
    relationships = [chunk for chunk in chunks if chunk.get("kind") == "knowledge_relationship"]
    migrations = [chunk for chunk in chunks if chunk.get("kind") == "migration_knowledge"]
    component_count = len(catalog["components"])
    perspective_entries = component_count * len(PERSPECTIVES)

    lines = [
        "# Abraxos Institutional Knowledge Enrichment Report",
        "",
        "**Data:** 2026-06-17",
        "**Escopo:** enriquecimento do conhecimento institucional usado pelo RAG, sem alterar modelo, prompts principais, backend ou arquitetura.",
        "",
        "## Resumo",
        "",
        f"- Markdown institucional criado/enriquecido: `rag/institutional-knowledge.md`.",
        f"- Dump Markdown regenerado: `rag/aetheris-docs-dump.md`.",
        f"- Metadata canônico enriquecido: `data/component-metadata.json`.",
        f"- Chunks antes do suplemento: {base_count}.",
        f"- Chunks finais no dump: {final_count}.",
        f"- Novos chunks criados: {len(chunks)}.",
        "",
        "## Markdowns enriquecidos",
        "",
        "- `rag/institutional-knowledge.md`: racional, impacto arquitetural, consequências UX, acessibilidade, governança, manutenção, falhas, relações, comparações, migrações e cobertura por perspectiva.",
        "- `rag/aetheris-docs-dump.md`: corpus legível regenerado com os chunks suplementares embutidos.",
        "",
        "## Novos chunks criados",
        "",
        f"- Component institutional knowledge: {len(institutional)} chunks.",
        f"- Perspective matrix: {len(perspectives)} chunks.",
        f"- Comparative decisions: {len(comparisons)} chunks.",
        f"- Knowledge relationships: {len(relationships)} chunks.",
        f"- Migration knowledge: {len(migrations)} chunks.",
        "",
        "## Comparações adicionadas",
        "",
        *[f"- {item['title']}" for item in COMPARISONS],
        "",
        "## Relações adicionadas",
        "",
        *[f"- {item['title']}: {item['items']}" for item in RELATIONSHIP_CLUSTERS],
        "",
        "## Cobertura por perspectiva",
        "",
        f"- Componentes cobertos: {component_count}.",
        f"- Perspectivas cobertas: {len(PERSPECTIVES)}.",
        f"- Entradas disciplinares geradas: {perspective_entries}.",
        "",
        "| Perspectiva | Componentes cobertos |",
        "|---|---:|",
    ]
    for _, label in PERSPECTIVES:
        lines.append(f"| {label} | {component_count} |")
    lines.extend([
        "",
        "## Migrações adicionadas",
        "",
        *[f"- {item['title']}" for item in MIGRATIONS],
        "",
        "## Observações operacionais",
        "",
        "- O ChromaDB não foi reindexado neste passo para evitar carregar embedding local ou acionar provider externo.",
        "- Para aplicar os novos chunks no banco persistente, execute a reindexação em ambiente apropriado.",
        "- Nenhum commit foi criado.",
        "",
    ])
    REPORT_PATH.write_text("\n".join(lines), encoding="utf-8")


def merge_supplemental_chunks(dump: dict, extra_chunks: list[dict]) -> dict:
    seen = {chunk["id"] for chunk in dump["chunks"]}
    for chunk in extra_chunks:
        if chunk["id"] in seen:
            raise ValueError(f"Duplicate chunk id: {chunk['id']}")
        seen.add(chunk["id"])
        dump["chunks"].append(chunk)
    dump["meta"]["total_chunks"] = len(dump["chunks"])
    sources = set(dump["meta"].get("sources", []))
    sources.add("rag/institutional-knowledge.md")
    dump["meta"]["sources"] = sorted(sources)
    dump["meta"]["institutional_knowledge_supplement"] = {
        "date": "2026-06-17",
        "chunks": len(extra_chunks),
        "coverage": {
            "components": len([c for c in extra_chunks if c.get("kind") == "institutional_knowledge"]),
            "perspective_matrices": len([c for c in extra_chunks if c.get("kind") == "perspective_matrix"]),
            "comparisons": len([c for c in extra_chunks if c.get("kind") == "comparative_chunk"]),
            "relationships": len([c for c in extra_chunks if c.get("kind") == "knowledge_relationship"]),
            "migrations": len([c for c in extra_chunks if c.get("kind") == "migration_knowledge"]),
            "perspective_entries": len(catalog_data["components"]) * len(PERSPECTIVES),
        },
    }
    return dump


def main() -> int:
    global catalog_data

    catalog_data = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
    catalog_data = enrich_component_metadata(catalog_data)
    write_catalog(catalog_data)

    regenerate_base_dump()
    dump = json.loads(DUMP_JSON_PATH.read_text(encoding="utf-8"))
    base_count = len(dump["chunks"])

    extra = supplementary_chunks(catalog_data)
    dump = merge_supplemental_chunks(dump, extra)
    DUMP_JSON_PATH.write_text(
        json.dumps(dump, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    write_dump_markdown(dump)
    write_knowledge_markdown(catalog_data, extra)
    write_report(catalog_data, extra, base_count, len(dump["chunks"]))

    print(f"Components enriched: {len(catalog_data['components'])}")
    print(f"Base chunks: {base_count}")
    print(f"Supplemental chunks: {len(extra)}")
    print(f"Final chunks: {len(dump['chunks'])}")
    print(f"Knowledge markdown: {KNOWLEDGE_MD_PATH}")
    print(f"Report: {REPORT_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
