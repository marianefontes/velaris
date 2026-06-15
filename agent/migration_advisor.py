"""Migration advisor capability for component adoption and modernization."""

from __future__ import annotations

import re
from typing import Any

from component_metadata import ComponentMetadata, component_registry, localized_rules

from .entity_validation_gate import (
    EntityValidationResult,
    entity_clarification_response,
    validate_entity_for_capability,
)
from .models import ExtractedEntities, QueryUnderstanding


MIGRATION_FRAMEWORK: tuple[dict[str, str], ...] = (
    {"id": "discovery", "label": "Descoberta", "label_en": "Discovery"},
    {"id": "mapping", "label": "Mapeamento", "label_en": "Mapping"},
    {"id": "replacement", "label": "Substituição", "label_en": "Replacement"},
    {"id": "validation", "label": "Validação", "label_en": "Validation"},
    {"id": "rollout", "label": "Rollout", "label_en": "Rollout"},
    {"id": "monitoring", "label": "Monitoramento", "label_en": "Monitoring"},
)

_MIGRATION_MARKERS = (
    "migrar",
    "migracao",
    "migração",
    "migration",
    "migrate",
    "substituir",
    "substituicao",
    "substituição",
    "replace",
    "trocar",
    "swap",
    "modernizar",
    "modernize",
    "modernizacao",
    "modernização",
    "refatorar",
    "refactor",
    "descontinuar",
    "discontinue",
    "deprecated",
    "depreciar",
    "legado",
    "legacy",
    "customizado",
    "customizada",
    "custom ",
    "caminho de migracao",
    "caminho de migração",
    "migration path",
    "roadmap de migracao",
    "roadmap de migração",
    "atualizar interface",
    "update interface",
    "atualizar nossa interface",
)

_LEGACY_SOURCE_MARKERS = (
    "legado",
    "legacy",
    "customizado",
    "customizada",
    "custom ",
    "proprio",
    "próprio",
    "in house",
    "in-house",
    "antigo",
    "old ",
)

_INTERFACE_SCOPE_MARKERS = (
    "interface",
    "tela",
    "screen",
    "produto",
    "product",
    "aplicacao",
    "aplicação",
    "application",
    "sistema",
    "system",
)

_LEGACY_LABEL_TARGET_HINTS: tuple[tuple[str, str], ...] = (
    ("modal", "modal-dialog"),
    ("dialog", "modal-dialog"),
    ("button", "button"),
    ("drawer", "side-drawer"),
    ("table", "table"),
    ("input", "input"),
    ("select", "select"),
    ("toast", "toast"),
    ("checkbox", "checkbox"),
    ("radio", "radio-button"),
    ("switch", "switch"),
    ("tab", "tabs"),
)


def _infer_target_from_legacy_label(label: str) -> str | None:
    folded = label.lower().replace("-", "").replace("_", "")
    registry = component_registry()
    for hint, component_id in _LEGACY_LABEL_TARGET_HINTS:
        if hint in folded and component_id in registry:
            return component_id
    return None


def _resolve_legacy_source_label(query: str) -> str | None:
    from .entity_validation_gate import _extract_legacy_entity_label

    normalized = " ".join(query.lower().split())
    return _extract_legacy_entity_label(query, normalized)


_COMPONENT_HINTS: tuple[tuple[str, str], ...] = (
    ("botao", "button"),
    ("botão", "button"),
    ("button", "button"),
    ("drawer", "side-drawer"),
    ("side drawer", "side-drawer"),
    ("modal", "modal-dialog"),
    ("dialog", "modal-dialog"),
    ("toast", "toast"),
    ("input", "input"),
    ("select", "select"),
    ("checkbox", "checkbox"),
    ("radio", "radio-button"),
    ("switch", "switch"),
    ("table", "table"),
    ("tabs", "tabs"),
)


PERSPECTIVE_MIGRATION_FOCUS: dict[str, dict[str, str]] = {
    "designer": {
        "pt": "Consistência visual, hierarquia, estados, densidade e experiência percebida.",
        "en": "Visual consistency, hierarchy, states, density and perceived experience.",
    },
    "product_designer": {
        "pt": "Fluxo, fricção, clareza de tarefa e impacto na jornada do usuário.",
        "en": "Flow, friction, task clarity and user-journey impact.",
    },
    "dev": {
        "pt": "Implementação, contratos, dívida técnica, acoplamento e esforço de refactor.",
        "en": "Implementation, contracts, technical debt, coupling and refactor effort.",
    },
    "qa": {
        "pt": "Regressões, cobertura de estados, acessibilidade e validação de release.",
        "en": "Regressions, state coverage, accessibility and release validation.",
    },
    "product_design_system_manager": {
        "pt": "Impacto de adoção, risco organizacional, rollout e governança de exceções.",
        "en": "Adoption impact, organizational risk, rollout and exception governance.",
    },
    "tech_writer": {
        "pt": "Documentação, exemplos canônicos, naming e materiais de enablement.",
        "en": "Documentation, canonical examples, naming and enablement materials.",
    },
    "maintainer": {
        "pt": "Custo de manutenção, duplicação, simplicidade e evolução futura.",
        "en": "Maintenance cost, duplication, simplicity and future evolution.",
    },
    "a11y": {
        "pt": "Semântica, teclado, leitores de tela, contraste e estados acessíveis.",
        "en": "Semantics, keyboard, screen readers, contrast and accessible states.",
    },
    "general": {
        "pt": "Adoção equilibrada entre valor, risco, esforço e consistência do sistema.",
        "en": "Balanced adoption across value, risk, effort and system consistency.",
    },
}


def contains_migration_intent(text: str) -> bool:
    normalized = " ".join(text.lower().split())
    return any(marker in normalized for marker in _MIGRATION_MARKERS)


def _contains_any(text: str, markers: tuple[str, ...]) -> bool:
    return any(marker in text for marker in markers)


def _resolve_target_component_id(
    query: str,
    entities: ExtractedEntities,
) -> str | None:
    from .entity_resolution import primary_exact_match

    registry = component_registry()
    if entities.components:
        for name in entities.components:
            for candidate in registry.values():
                if candidate.name == name:
                    return candidate.component_id
    normalized = " ".join(query.lower().split())
    exact = primary_exact_match(normalized)
    if exact is not None:
        return exact.component_id
    return None


def _resolve_target_component(
    query: str,
    understanding: QueryUnderstanding,
) -> ComponentMetadata | None:
    registry = component_registry()
    if understanding.exact_entity_matches:
        return registry.get(understanding.exact_entity_matches[0].component_id)
    component_id = _resolve_target_component_id(query, understanding.entities)
    if component_id is None:
        legacy_label = _resolve_legacy_source_label(query)
        if legacy_label is not None:
            component_id = _infer_target_from_legacy_label(legacy_label)
    if component_id is None:
        return None
    return registry.get(component_id)


def _legacy_source_detected(query: str) -> bool:
    normalized = " ".join(query.lower().split())
    return _contains_any(normalized, _LEGACY_SOURCE_MARKERS)


def _interface_scope(query: str) -> bool:
    normalized = " ".join(query.lower().split())
    return _contains_any(normalized, _INTERFACE_SCOPE_MARKERS)


def _estimate_complexity(
    *,
    has_target: bool,
    legacy_source: bool,
    interface_scope: bool,
) -> str:
    if interface_scope and not has_target:
        return "high"
    if has_target and legacy_source:
        return "medium"
    if has_target:
        return "low"
    return "medium"


def _catalog_reasons(component: ComponentMetadata, *, english: bool) -> list[str]:
    if english:
        reasons = [
            "Supported catalog component",
            "Active maintenance in Velaris",
            "Catalog alignment and governance fit",
        ]
        if component.accessibility is not None:
            reasons.insert(1, "Documented accessibility coverage")
        if component.status == "stable":
            reasons.insert(1, "Stable status")
        return reasons
    reasons = [
        "Componente suportado no catálogo",
        "Manutenção ativa no Velaris",
        "Aderência ao catálogo e governança",
    ]
    if component.accessibility is not None:
        reasons.insert(1, "Cobertura documentada de acessibilidade")
    if component.status == "stable":
        reasons.insert(1, "Status estável")
    return reasons


def _migration_steps(
  *,
  english: bool,
  has_target: bool,
) -> list[dict[str, str]]:
    if english:
        if has_target:
            return [
                {"step": "1", "title": "Inventory occurrences", "detail": "Map every legacy instance, route and variant."},
                {"step": "2", "title": "Map equivalence", "detail": "Match props, states, intents and interaction goals to the target component."},
                {"step": "3", "title": "Replace visual structure", "detail": "Swap markup and tokens while preserving task semantics."},
                {"step": "4", "title": "Validate states", "detail": "Check hover, focus, disabled, loading and error behavior."},
                {"step": "5", "title": "Run accessibility checks", "detail": "Keyboard, screen reader labels, contrast and focus order."},
                {"step": "6", "title": "Regression validation", "detail": "Cover critical flows, analytics and visual diffs before rollout."},
            ]
        return [
            {"step": "1", "title": "Inventory custom UI", "detail": "List screens, owners, variants and usage frequency."},
            {"step": "2", "title": "Map catalog equivalence", "detail": "Group legacy pieces by the closest Velaris primitive or pattern."},
            {"step": "3", "title": "Prioritize rollout waves", "detail": "Start with high-traffic, low-risk surfaces."},
            {"step": "4", "title": "Replace and validate", "detail": "Migrate in slices with accessibility and regression gates."},
            {"step": "5", "title": "Monitor adoption", "detail": "Track exceptions, regressions and remaining custom debt."},
        ]
    if has_target:
        return [
            {"step": "1", "title": "Mapear ocorrências", "detail": "Inventariar instâncias legadas, rotas e variantes."},
            {"step": "2", "title": "Mapear equivalência", "detail": "Alinhar props, estados, intents e objetivo de interação ao componente alvo."},
            {"step": "3", "title": "Substituir estrutura visual", "detail": "Trocar markup e tokens preservando a semântica da tarefa."},
            {"step": "4", "title": "Validar estados", "detail": "Conferir hover, focus, disabled, loading e erro."},
            {"step": "5", "title": "Executar testes de acessibilidade", "detail": "Teclado, leitores de tela, contraste e ordem de foco."},
            {"step": "6", "title": "Validar regressões", "detail": "Cobrir fluxos críticos, analytics e diffs visuais antes do rollout."},
        ]
    return [
        {"step": "1", "title": "Inventariar UI customizada", "detail": "Listar telas, donos, variantes e frequência de uso."},
        {"step": "2", "title": "Mapear equivalência no catálogo", "detail": "Agrupar peças legadas pelo primitive ou pattern Velaris mais próximo."},
        {"step": "3", "title": "Priorizar ondas de rollout", "detail": "Começar por superfícies de alto tráfego e baixo risco."},
        {"step": "4", "title": "Substituir e validar", "detail": "Migrar em fatias com gates de acessibilidade e regressão."},
        {"step": "5", "title": "Monitorar adoção", "detail": "Acompanhar exceções, regressões e dívida custom restante."},
    ]


def build_migration_advisor_contract(
    *,
    query: str,
    understanding: QueryUnderstanding,
    profile: str,
    english: bool,
    entity_validation: EntityValidationResult | None = None,
) -> dict[str, Any]:
    validation = entity_validation or validate_entity_for_capability(
        query,
        understanding,
        workflow="migration_advisor",
    )
    legacy_label = _resolve_legacy_source_label(query)
    target = _resolve_target_component(query, understanding)
    legacy_source = _legacy_source_detected(query)
    interface_scope = _interface_scope(query)
    complexity = _estimate_complexity(
        has_target=target is not None,
        legacy_source=legacy_source,
        interface_scope=interface_scope,
    )
    perspective = PERSPECTIVE_MIGRATION_FOCUS.get(
        profile,
        PERSPECTIVE_MIGRATION_FOCUS["general"],
    )
    if english:
        diagnosis = (
            "Legacy or custom UI detected."
            if legacy_source or legacy_label
            else "Migration requested without a fully specified legacy artifact."
        )
        risks = [
            "Visual change for end users",
            "Behavioral differences in edge states",
            "Test and snapshot impact",
        ]
        required_sections = [
            "Diagnosis",
            "Recommended component",
            "Reasons",
            "Migration path",
            "Risks",
            "Complexity",
            "Perspective focus",
        ]
    else:
        diagnosis = (
            "Interface ou componente legado/custom identificado."
            if legacy_source or legacy_label
            else "Migração solicitada sem artefato legado totalmente especificado."
        )
        risks = [
            "Mudança visual para o usuário final",
            "Diferenças comportamentais em estados de borda",
            "Impacto em testes e snapshots",
        ]
        required_sections = [
            "Diagnóstico",
            "Componente recomendado",
            "Motivos",
            "Caminho de migração",
            "Riscos",
            "Complexidade",
            "Foco da perspectiva",
        ]

    if validation.status != "validated":
        required_sections = [
            "Clarification request",
            "Required inputs",
            "Examples",
            "What can be generated after clarification",
        ] if english else [
            "Pedido de esclarecimento",
            "Informações necessárias",
            "Exemplos",
            "O que pode ser gerado após o esclarecimento",
        ]

    contract: dict[str, Any] = {
        "capability": "MIGRATION_ADVISOR",
        "entity_validation": {
            "status": validation.status,
            "confidence": validation.confidence,
            "entity_label": validation.entity_label,
            "catalog_component_id": validation.catalog_component_id,
            "source": validation.source,
            "reason": validation.reason,
        },
        "diagnosis": diagnosis,
        "legacy_source_detected": legacy_source,
        "legacy_source_label": legacy_label,
        "interface_scope": interface_scope,
        "framework": list(MIGRATION_FRAMEWORK),
        "migration_steps": _migration_steps(
            english=english,
            has_target=target is not None and validation.status == "validated",
        ),
        "risks": risks,
        "complexity": complexity,
        "perspective_focus": perspective["en" if english else "pt"],
        "required_sections": required_sections,
        "response_policy": (
            "Do not recommend a specific catalog component, API, code snippet, "
            "state flow or accessibility checklist unless entity_validation.status "
            "is validated. If validation is not satisfied, request clarification "
            "only and do not invent Dialog, Button, Drawer or any other component."
            if validation.status != "validated"
            else (
                "Produce a practical migration plan grounded in the validated "
                "artifact and documented catalog evidence. Do not invent APIs, "
                "props, states or code beyond the catalog."
            )
        ),
    }

    if validation.status == "validated" and target is not None:
        contract["recommended_component"] = target.name
        contract["recommended_component_id"] = target.component_id
        contract["recommended_status"] = target.status
        contract["reasons"] = _catalog_reasons(target, english=english)
        if target.when_to_use:
            contract["when_to_use"] = localized_rules(
                target.when_to_use,
                "en" if english else "pt",
            )[:3]
        if target.when_not_to_use:
            contract["when_not_to_use"] = localized_rules(
                target.when_not_to_use,
                "en" if english else "pt",
            )[:3]
    elif validation.status == "validated":
        contract["recommended_component"] = None
        contract["reasons"] = (
            [
                "Validated artifact without a direct catalog target mapping",
                "Prefer stable catalog primitives before bespoke UI",
                "Roll out in waves with accessibility and regression gates",
            ]
            if english
            else [
                "Artefato validado sem mapeamento direto no catálogo",
                "Preferir primitives estáveis do catálogo antes de UI bespoke",
                "Fazer rollout em ondas com gates de acessibilidade e regressão",
            ]
        )
    else:
        contract["recommended_component"] = None
        contract["reasons"] = []

    return contract
