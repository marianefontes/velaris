"""Knowledge health observability payload for Abraxos intelligence audit."""

from __future__ import annotations

import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable

from component_metadata import ComponentMetadata, component_catalog, component_registry

from agent.catalog_registries import catalog_registries_health, decision_catalog
from agent.evidence import _field_presence
from prompts.perspective_contracts import PERSPECTIVE_RESPONSE_CONTRACTS
from prompts.perspective_health import build_perspective_health_payload
from prompts.perspective_ids import CANONICAL_PERSPECTIVE_IDS

BASE_DIR = Path(__file__).resolve().parents[1]
FOUNDATIONS_PATH = BASE_DIR / "src" / "components" / "FoundationsPage.tsx"

MIN_COMPLETE_COVERAGE = 0.80

COVERAGE_WEIGHTS_V2: dict[str, float] = {
    "description": 0.10,
    "variants": 0.10,
    "states": 0.10,
    "accessibility": 0.20,
    "edge_cases": 0.15,
    "examples": 0.15,
    "guidelines": 0.15,
    "limitations": 0.05,
}

BACKLOG_PRIORITY_THRESHOLDS: tuple[tuple[float, str], ...] = (
    (0.60, "critical"),
    (0.80, "high"),
    (0.90, "medium"),
)


def _has_localized_text(value: object | None) -> bool:
    if value is None:
        return False
    if hasattr(value, "pt"):
        return bool(str(getattr(value, "pt", "")).strip())
    return bool(str(value).strip())


def _has_guidelines(component: ComponentMetadata) -> bool:
    return bool(component.content_guidelines) or (
        bool(component.when_to_use) and bool(component.when_not_to_use)
    )


def _has_limitations(component: ComponentMetadata) -> bool:
    return bool(component.governance_notes) or bool(component.anti_patterns)


COVERAGE_DIMENSIONS: tuple[tuple[str, Callable[[ComponentMetadata], bool]], ...] = (
    ("description", lambda c: _has_localized_text(c.description) or _has_localized_text(c.about)),
    ("variants", lambda c: bool(c.variants)),
    ("states", lambda c: bool(c.states)),
    (
        "accessibility",
        lambda c: bool(
            c.accessibility
            and (
                (c.accessibility.summary and c.accessibility.summary.pt)
                or c.accessibility.keyboard
                or c.accessibility.aria
                or c.accessibility.items
            )
        ),
    ),
    ("when_to_use", lambda c: bool(c.when_to_use)),
    ("when_not_to_use", lambda c: bool(c.when_not_to_use)),
    ("edge_cases", lambda c: bool(c.edge_cases)),
    ("examples", lambda c: bool(c.examples)),
    ("guidelines", _has_guidelines),
    ("related_components", lambda c: bool(c.related_components)),
    ("limitations", _has_limitations),
)

PERSPECTIVE_DIMENSIONS: tuple[str, ...] = (
    "contracts",
    "signals",
    "vocabulary",
    "examples",
    "specializations",
    "limitations",
)


def _utc_now() -> str:
    return datetime.now(tz=timezone.utc).isoformat(timespec="seconds")


def _percent(ratio: float) -> int:
    return round(max(0.0, min(1.0, ratio)) * 100)


def _weighted_coverage_v2(dimensions: dict[str, bool]) -> float:
    return sum(
        weight
        for key, weight in COVERAGE_WEIGHTS_V2.items()
        if dimensions.get(key)
    )


def _backlog_priority(coverage_ratio: float) -> str:
    for threshold, priority in BACKLOG_PRIORITY_THRESHOLDS:
        if coverage_ratio < threshold:
            return priority
    return "healthy"


def _slice_tsx_array(source: str, array_name: str) -> str:
    match = re.search(
        rf"(?:export\s+const\s+)?{re.escape(array_name)}(?:\s*:\s*[^=]+)?\s*=\s*\[",
        source,
    )
    if not match:
        return ""
    start = match.end()
    depth = 1
    index = start
    while index < len(source) and depth:
        char = source[index]
        if char == "[":
            depth += 1
        elif char == "]":
            depth -= 1
        index += 1
    return source[start : index - 1]


def _count_tsx_objects(source: str, array_name: str) -> int:
    section = _slice_tsx_array(source, array_name)
    if not section:
        return 0
    return section.count("{")


def _count_foundations() -> int:
    if not FOUNDATIONS_PATH.exists():
        return 0
    src = FOUNDATIONS_PATH.read_text(encoding="utf-8")
    return sum(
        _count_tsx_objects(src, array_name)
        for array_name in (
            "ACCESSIBILITY_CONTRACTS",
            "ACCESSIBILITY_READINESS_CHECKLIST",
            "SUMMARY_PT",
        )
    )


def _component_dimension_coverage(component: ComponentMetadata) -> dict[str, Any]:
    dimensions: dict[str, bool] = {}
    for key, checker in COVERAGE_DIMENSIONS:
        dimensions[key] = checker(component)
    present = sum(1 for value in dimensions.values() if value)
    total = len(COVERAGE_DIMENSIONS)
    ratio = present / total if total else 1.0
    weighted_ratio = _weighted_coverage_v2(dimensions)
    missing_fields = [key for key, present in dimensions.items() if not present]
    return {
        "component_id": component.component_id,
        "name": component.name,
        "status": component.status,
        "dimensions": dimensions,
        "missing_fields": missing_fields,
        "coverage_ratio": round(ratio, 4),
        "coverage_percent": _percent(ratio),
        "coverage_v2_ratio": round(weighted_ratio, 4),
        "coverage_v2_percent": _percent(weighted_ratio),
        "backlog_priority": _backlog_priority(weighted_ratio),
        "is_complete": weighted_ratio >= MIN_COMPLETE_COVERAGE,
    }


def _perspective_dimension_coverage(profile: str) -> dict[str, Any]:
    contract = PERSPECTIVE_RESPONSE_CONTRACTS.get(profile)
    prompt_path = BASE_DIR / "prompts" / (contract.prompt_path if contract else "")
    prompt_text = prompt_path.read_text(encoding="utf-8") if prompt_path.is_file() else ""
    lowered = prompt_text.lower()

    dimensions = {
        "contracts": contract is not None,
        "signals": bool(contract and contract.signal_groups),
        "vocabulary": bool(re.search(r"\bvocabulary\b|\bvocabul", lowered)),
        "examples": bool(
            re.search(r"\bexample\b|\bexemplo\b|\bexemplos\b", lowered)
            or "```" in prompt_text
        ),
        "specializations": bool(
            re.search(
                r"specialist|especializ|required specialist|lens|perspective",
                lowered,
            )
        ),
        "limitations": bool(
            re.search(r"limita|limitation|evidências e limitações|evidence", lowered)
        ),
    }
    present = sum(1 for value in dimensions.values() if value)
    total = len(PERSPECTIVE_DIMENSIONS)
    ratio = present / total if total else 1.0
    return {
        "profile": profile,
        "label": _perspective_label(profile),
        "dimensions": dimensions,
        "signal_group_count": len(contract.signal_groups) if contract else 0,
        "coverage_ratio": round(ratio, 4),
        "coverage_percent": _percent(ratio),
        "backlog_priority": _backlog_priority(ratio),
        "is_complete": ratio >= MIN_COMPLETE_COVERAGE,
    }


def _perspective_label(profile: str) -> str:
    labels = {
        "dev": "Developer",
        "designer": "Designer",
        "product_designer": "Product Designer",
        "qa": "QA",
        "tech_writer": "Tech Writer",
        "a11y": "Accessibility",
        "maintainer": "Maintainer",
        "design_system_manager": "Design System Manager",
    }
    return labels.get(profile, profile)


def _evidence_strength_for_field(
    component: ComponentMetadata,
    field_path: str,
    *,
    present: bool,
    empty: bool,
) -> str:
    if not present:
        return "absent"
    if empty:
        return "weak"
    provenance = component.provenance.get(field_path.split(".")[0], [])
    if provenance:
        return "strong"
    return "medium"


def _build_evidence_health() -> dict[str, Any]:
    distribution = {"strong": 0, "medium": 0, "weak": 0, "absent": 0}
    audited_fields = 0

    for component in component_registry().values():
        present_fields, missing_fields, empty_fields = _field_presence(component)
        present_set = set(present_fields)
        empty_set = set(empty_fields)
        missing_set = set(missing_fields)

        for field in sorted(present_set | missing_set | empty_set):
            if field in {"provenance"}:
                continue
            audited_fields += 1
            tier = _evidence_strength_for_field(
                component,
                field,
                present=field in present_set,
                empty=field in empty_set,
            )
            distribution[tier] += 1

    total = max(audited_fields, 1)
    percentages = {
        tier: round((count / total) * 100, 1)
        for tier, count in distribution.items()
    }
    return {
        "distribution": distribution,
        "percentages": percentages,
        "audited_fields": audited_fields,
    }


def _build_decision_health() -> dict[str, Any]:
    decisions = decision_catalog()
    statuses = {
        "confirmed": 0,
        "draft": 0,
        "deprecated": 0,
        "rejected": 0,
        "unknown": 0,
    }
    orphans: list[str] = []
    component_ids = {c.component_id for c in component_registry().values()}
    component_names = {
        c.name.lower()
        for c in component_registry().values()
    }

    dump_path = BASE_DIR / "rag" / "aetheris-docs-dump.json"
    if dump_path.exists():
        import json

        dump = json.loads(dump_path.read_text(encoding="utf-8"))
        for chunk in dump.get("chunks", []):
            if chunk.get("page_type") != "design_decision":
                continue
            title = str(chunk.get("title", "")).strip()
            text = str(chunk.get("text", "")).lower()
            status = "unknown"
            for candidate in ("confirmed", "draft", "deprecated", "rejected"):
                if candidate in text or candidate in title.lower():
                    status = candidate
                    break
            statuses[status] += 1

            linked = any(
                component_id in text or name in text
                for component_id in component_ids
                for name in (component_id, component_id.replace("-", " "))
            ) or any(name in text for name in component_names)
            guideline_linked = "guideline" in text or "diretriz" in text
            if not linked and not guideline_linked:
                orphans.append(title or "Untitled decision")

    if not statuses["confirmed"] and not statuses["draft"]:
        total = len(decisions)
        statuses["draft"] = total

    return {
        "total": sum(statuses.values()) or len(decisions),
        "statuses": statuses,
        "orphans": sorted(set(orphans)),
        "orphan_count": len(set(orphans)),
    }


def build_knowledge_debt_backlog(
    component_coverage: list[dict[str, Any]],
    perspective_coverage: list[dict[str, Any]] | None = None,
) -> list[dict[str, Any]]:
    backlog: list[dict[str, Any]] = []

    for entry in component_coverage:
        backlog.append({
            "entity": entry["name"],
            "entity_id": entry["component_id"],
            "type": "component",
            "coverage_percent": entry["coverage_v2_percent"],
            "missing_fields": entry["missing_fields"],
            "priority": entry["backlog_priority"],
            "is_complete": entry["is_complete"],
        })

    for entry in perspective_coverage or []:
        missing = [key for key, present in entry["dimensions"].items() if not present]
        backlog.append({
            "entity": entry["label"],
            "entity_id": entry["profile"],
            "type": "perspective",
            "coverage_percent": entry["coverage_percent"],
            "missing_fields": missing,
            "priority": entry["backlog_priority"],
            "is_complete": entry["is_complete"],
        })

    priority_order = {"critical": 0, "high": 1, "medium": 2, "healthy": 3}
    backlog.sort(
        key=lambda item: (
            priority_order.get(str(item["priority"]), 99),
            item["coverage_percent"],
            item["entity"],
        )
    )
    return backlog


def _build_knowledge_gaps(
    component_coverage: list[dict[str, Any]],
    perspective_coverage: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    gaps: list[dict[str, Any]] = []

    dimension_labels = {
        "description": "Missing description",
        "variants": "Missing variants",
        "states": "Missing states",
        "accessibility": "Missing accessibility",
        "when_to_use": "Missing when_to_use",
        "when_not_to_use": "Missing when_not_to_use",
        "edge_cases": "Missing edge cases",
        "examples": "Missing examples",
        "guidelines": "Missing guidelines",
        "related_components": "Missing related_components",
        "limitations": "Missing limitations",
    }
    perspective_labels = {
        "contracts": "Missing contract",
        "signals": "Missing signals",
        "vocabulary": "Missing vocabulary",
        "examples": "Missing examples",
        "specializations": "Missing specializations",
        "limitations": "Missing limitations",
    }

    for entry in component_coverage:
        for field in entry["missing_fields"]:
            gaps.append({
                "entity": entry["name"],
                "entity_id": entry["component_id"],
                "type": "component",
                "gap": dimension_labels.get(field, f"Missing {field}"),
                "coverage_percent": entry["coverage_v2_percent"],
                "priority": entry["backlog_priority"],
            })

    for entry in perspective_coverage:
        for dimension, present in entry["dimensions"].items():
            if present:
                continue
            gaps.append({
                "entity": entry["label"],
                "entity_id": entry["profile"],
                "type": "perspective",
                "gap": perspective_labels.get(dimension, f"Missing {dimension}"),
                "coverage_percent": entry["coverage_percent"],
                "priority": entry["backlog_priority"],
            })

    priority_order = {"critical": 0, "high": 1, "medium": 2, "healthy": 3}
    gaps.sort(
        key=lambda item: (
            priority_order.get(str(item["priority"]), 99),
            item["coverage_percent"],
            item["entity"],
        )
    )
    return gaps


def _aggregate_component_coverage_v2(components: list[dict[str, Any]]) -> float:
    if not components:
        return 1.0
    return sum(entry["coverage_v2_ratio"] for entry in components) / len(components)


def _aggregate_perspective_coverage(perspectives: list[dict[str, Any]]) -> float:
    if not perspectives:
        return 1.0
    return sum(entry["coverage_ratio"] for entry in perspectives) / len(perspectives)


def _evidence_reliability_score(evidence_health: dict[str, Any]) -> float:
    percentages = evidence_health["percentages"]
    return (
        percentages.get("strong", 0) * 1.0
        + percentages.get("medium", 0) * 0.7
        + percentages.get("weak", 0) * 0.3
    ) / 100.0


def build_knowledge_health_dashboard(collection: Any | None = None) -> dict[str, Any]:
    registry_health = catalog_registries_health()
    components = [
        _component_dimension_coverage(component)
        for component in component_catalog().components
    ]
    perspectives = [
        _perspective_dimension_coverage(profile)
        for profile in CANONICAL_PERSPECTIVE_IDS
    ]
    evidence_health = _build_evidence_health()
    decision_health = _build_decision_health()
    perspective_health = build_perspective_health_payload(collection)
    knowledge_debt_backlog = build_knowledge_debt_backlog(components, perspectives)
    knowledge_gaps = _build_knowledge_gaps(components, perspectives)

    knowledge_coverage = _aggregate_component_coverage_v2(components)
    perspective_coverage_score = _aggregate_perspective_coverage(perspectives)
    evidence_reliability = _evidence_reliability_score(evidence_health)
    decision_coverage = (
        1.0 - (decision_health["orphan_count"] / max(decision_health["total"], 1))
    )
    perspective_contract_health = (
        1.0
        if perspective_health.get("status") == "healthy"
        else max(0.0, 1.0 - len(perspective_health.get("warnings", [])) * 0.15)
    )
    critical_entities = sum(
        1 for entry in components if entry["backlog_priority"] == "critical"
    )
    complete_entities = sum(1 for entry in components if entry["is_complete"])

    scores = {
        "knowledge_coverage": _percent(knowledge_coverage),
        "knowledge_coverage_v2": _percent(knowledge_coverage),
        "evidence_reliability": _percent(evidence_reliability),
        "hallucination_resistance": _percent(
            perspective_contract_health * 0.4
            + evidence_reliability * 0.35
            + knowledge_coverage * 0.25
        ),
        "decision_coverage": _percent(decision_coverage),
        "perspective_coverage": _percent(perspective_coverage_score),
    }
    scores["overall_intelligence_health"] = _percent(
        sum(scores.values()) / len(scores)
        / 100.0
    )

    return {
        "audited_at": _utc_now(),
        "knowledge_health_score": scores["overall_intelligence_health"],
        "coverage_weights_v2": COVERAGE_WEIGHTS_V2,
        "min_complete_coverage_percent": _percent(MIN_COMPLETE_COVERAGE),
        "entities_catalogued": {
            "components": len(components),
            "tokens": registry_health["tokens"],
            "patterns": registry_health["patterns"],
            "guidelines": registry_health["guidelines"],
            "foundations": _count_foundations(),
            "perspectives": len(CANONICAL_PERSPECTIVE_IDS),
            "decisions": registry_health["decisions"],
        },
        "component_coverage": components,
        "perspective_coverage": perspectives,
        "knowledge_debt_backlog": knowledge_debt_backlog,
        "knowledge_gaps": knowledge_gaps[:50],
        "knowledge_gaps_total": len(knowledge_gaps),
        "critical_entity_count": critical_entities,
        "complete_entity_count": complete_entities,
        "evidence_health": evidence_health,
        "decision_health": decision_health,
        "perspective_contract_health": perspective_health,
        "intelligence_scores": scores,
        "catalog_registries": registry_health,
    }
