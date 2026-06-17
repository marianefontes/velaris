"""Mandatory entity validation before artifact-dependent capabilities execute."""

from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Literal

from component_metadata import component_registry

from .entity_resolution import primary_exact_match
from .models import QueryUnderstanding
from .understanding import normalize_query
from .unsupported_entity_detection import match_unsupported_entity


EntityValidationStatus = Literal["validated", "needs_clarification", "not_required"]

ENTITY_CONFIDENCE_THRESHOLD = 0.75

ARTIFACT_DEPENDENT_WORKFLOWS = frozenset({
    "migration_advisor",
    "compare_options",
    "comparison_rule",
    "direct_entity_guidance",
    "accessibility_guidance",
    "component_decision",
})

_DEICTIC_MARKERS = (
    "este componente",
    "esta componente",
    "esse componente",
    "essa componente",
    "este estado de componente",
    "esta estado de componente",
    "esse estado de componente",
    "essa estado de componente",
    "this component",
    "that component",
    "this component state",
    "that component state",
    "this legacy",
    "that legacy",
    "este legado",
    "esse legado",
    "migre isso",
    "migrar isso",
    "migrate this",
    "migrate that",
    "como migrar isso",
    "how to migrate this",
    "how to migrate that",
)

_GENERIC_ARTIFACT_MARKERS = (
    "componente legado",
    "legacy component",
    "controle customizado",
    "custom component",
    "custom control",
    "ui customizada",
    "custom ui",
)

_LEGACY_LABEL_PATTERN = re.compile(
    r"(?<![a-z0-9])"
    r"(?:"
    r"(?:legacy|old|custom)\s*[A-Z][A-Za-z0-9]+|"
    r"[A-Z][a-z]+(?:Modal|Button|Drawer|Table|Input|Select|Form|Panel|Dropdown|Chip|Toast|Dialog)"
    r")"
    r"(?![a-z0-9])",
)

_MIGRATION_ARROW_PATTERN = re.compile(
    r"(.+?)\s*(?:→|->|para|to)\s*(.+)",
    re.IGNORECASE,
)


@dataclass(frozen=True)
class EntityValidationResult:
    status: EntityValidationStatus
    confidence: float
    entity_label: str | None
    catalog_component_id: str | None
    source: str
    reason: str


def _contains_any(normalized: str, terms: tuple[str, ...]) -> bool:
    return any(term in normalized for term in terms)


def is_deictic_artifact_reference(normalized: str) -> bool:
    return _is_deictic_only_reference(normalized)


def _is_deictic_only_reference(normalized: str) -> bool:
    if not _contains_any(normalized, _DEICTIC_MARKERS):
        return False
    return not _LEGACY_LABEL_PATTERN.search(normalized)


def _extract_legacy_entity_label(query: str, normalized: str) -> str | None:
    match = re.search(
        r"\b(?:o|a|the)\s+([A-Z][A-Za-z0-9]+(?:[A-Z][A-Za-z0-9]+)*)\b",
        query,
    )
    if match:
        candidate = match.group(1).strip()
        if candidate.lower() not in {"velaris", "abraxos", "beatrice", "aetheris"}:
            return candidate

    label_match = _LEGACY_LABEL_PATTERN.search(query)
    if label_match:
        return label_match.group(0).strip()
    return None


def _confidence_for_understanding(
    query: str,
    understanding: QueryUnderstanding,
    *,
    normalized: str,
) -> EntityValidationResult:
    if understanding.exact_entity_matches:
        match = understanding.exact_entity_matches[0]
        return EntityValidationResult(
            status="validated",
            confidence=1.0,
            entity_label=match.name,
            catalog_component_id=match.component_id,
            source="exact_catalog_match",
            reason="Exact catalog entity resolved.",
        )

    component_id = None
    exact = primary_exact_match(normalized)
    if exact is not None:
        component_id = exact.component_id
    if component_id is not None:
        component = component_registry().get(component_id)
        return EntityValidationResult(
            status="validated",
            confidence=0.9,
            entity_label=component.name if component else component_id,
            catalog_component_id=component_id,
            source="component_hint",
            reason="Component type identified in the query.",
        )

    unsupported = match_unsupported_entity(normalized)
    if unsupported is not None:
        entry, alias = unsupported
        return EntityValidationResult(
            status="validated",
            confidence=0.85,
            entity_label=entry.label,
            catalog_component_id=None,
            source="unsupported_registry",
            reason=f"Unsupported entity '{alias}' explicitly cited.",
        )

    legacy_label = _extract_legacy_entity_label(query, normalized)
    if legacy_label is not None:
        return EntityValidationResult(
            status="validated",
            confidence=0.8,
            entity_label=legacy_label,
            catalog_component_id=None,
            source="legacy_label",
            reason="Explicit legacy artifact label cited.",
        )

    if understanding.entities.components:
        return EntityValidationResult(
            status="validated",
            confidence=0.85,
            entity_label=understanding.entities.components[0],
            catalog_component_id=None,
            source="extracted_entity",
            reason="Named component extracted from query.",
        )

    if _is_deictic_only_reference(normalized):
        return EntityValidationResult(
            status="needs_clarification",
            confidence=0.0,
            entity_label=None,
            catalog_component_id=None,
            source="deictic_reference",
            reason="Query references an artifact without naming it.",
        )

    if _contains_any(normalized, _GENERIC_ARTIFACT_MARKERS):
        return EntityValidationResult(
            status="needs_clarification",
            confidence=0.0,
            entity_label=None,
            catalog_component_id=None,
            source="generic_artifact",
            reason="Generic legacy/custom reference without a named artifact.",
        )

    return EntityValidationResult(
        status="needs_clarification",
        confidence=0.0,
        entity_label=None,
        catalog_component_id=None,
        source="missing_entity",
        reason="No validated artifact entity was found.",
    )


def validate_entity_for_capability(
    query: str,
    understanding: QueryUnderstanding,
    *,
    workflow: str,
    command_mode: str | None = None,
) -> EntityValidationResult:
    if workflow not in ARTIFACT_DEPENDENT_WORKFLOWS:
        return EntityValidationResult(
            status="not_required",
            confidence=1.0,
            entity_label=None,
            catalog_component_id=None,
            source="workflow_exempt",
            reason="Workflow does not require artifact validation.",
        )

    normalized = normalize_query(query)

    if workflow == "accessibility_guidance":
        if not understanding.entities.components and not understanding.exact_entity_matches:
            if not any(
                marker in normalized
                for marker in ("do ", "da ", "de ", "for ", "of ", "deste ", "desse ")
            ):
                return EntityValidationResult(
                    status="not_required",
                    confidence=1.0,
                    entity_label=None,
                    catalog_component_id=None,
                    source="general_a11y",
                    reason="General accessibility guidance without a named component.",
                )

    if command_mode == "migrate":
        if "→" in query or "->" in query:
            arrow = _MIGRATION_ARROW_PATTERN.search(query)
            if arrow:
                source = arrow.group(1).strip().lstrip("/migrate").strip()
                if source and len(source.split()) <= 4:
                    return EntityValidationResult(
                        status="validated",
                        confidence=0.9,
                        entity_label=source,
                        catalog_component_id=None,
                        source="migrate_command_arrow",
                        reason="Explicit /migrate source artifact provided.",
                    )

    result = _confidence_for_understanding(
        query,
        understanding,
        normalized=normalized,
    )
    if result.status == "validated" and result.confidence < ENTITY_CONFIDENCE_THRESHOLD:
        return EntityValidationResult(
            status="needs_clarification",
            confidence=result.confidence,
            entity_label=result.entity_label,
            catalog_component_id=result.catalog_component_id,
            source=result.source,
            reason="Entity confidence below validation threshold.",
        )
    return result


def requires_entity_clarification(
    query: str,
    understanding: QueryUnderstanding,
    *,
    workflow: str,
    command_mode: str | None = None,
) -> bool:
    return (
        validate_entity_for_capability(
            query,
            understanding,
            workflow=workflow,
            command_mode=command_mode,
        ).status
        == "needs_clarification"
    )


def entity_clarification_response(
    *,
    english: bool = False,
    workflow: str | None = None,
) -> str:
    if workflow == "migration_advisor":
        if english:
            return (
                "I cannot generate a migration plan because the source component was "
                "not specified.\n\n"
                "Please provide:\n"
                "• component name\n"
                "• screenshot\n"
                "• behavior description\n\n"
                "Examples:\n"
                "- Legacy Modal\n"
                "- Custom Button\n"
                "- Old Table\n"
                "- Side Drawer\n\n"
                "With that information I can generate:\n"
                "- replacement recommendation\n"
                "- migration plan\n"
                "- risks\n"
                "- compatibility notes\n"
                "- required validations"
            )
        return (
            "Não consigo gerar um plano de migração porque o componente de origem "
            "não foi informado.\n\n"
            "Informe:\n"
            "• nome do componente\n"
            "• screenshot\n"
            "• descrição do comportamento\n\n"
            "Exemplos:\n"
            "- Legacy Modal\n"
            "- Custom Button\n"
            "- Old Table\n"
            "- Side Drawer\n\n"
            "Com essa informação posso gerar:\n"
            "- recomendação de substituição\n"
            "- plano de migração\n"
            "- riscos\n"
            "- compatibilidade\n"
            "- validações necessárias"
        )
    if english:
        return (
            "I need the component name to answer about this artifact.\n\n"
            "Please name a documented Velaris component — for example Button, "
            "Modal, Drawer or Select — or open Abraxos from the component page "
            "you are reviewing."
        )
    return (
        "Preciso do nome do componente para responder sobre este artefato.\n\n"
        "Informe um componente documentado do Velaris — por exemplo Button, "
        "Modal, Drawer ou Select — ou abra o Abraxos a partir da página do "
        "componente que você está revisando."
    )


def insufficient_evidence_blocks_specific_output(
    *,
    evidence_tier: str,
    validation: EntityValidationResult,
) -> bool:
    if evidence_tier != "insufficient":
        return False
    if validation.status == "validated" and validation.confidence >= ENTITY_CONFIDENCE_THRESHOLD:
        return False
    return True
