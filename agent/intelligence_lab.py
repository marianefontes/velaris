"""Adversarial intelligence test suite for Abraxos reliability audit."""

from __future__ import annotations

import re
import tempfile
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Literal

from agent.catalog_registries import resolve_typed_catalog_entities
from agent.entity_resolution import resolve_exact_entity_matches
from agent.evidence_integrity import EvidenceIntegrityValidator
from agent.models import CatalogEntityResolution
from agent.planner import build_agent_plan
from agent.runtime import AgentRuntime
from agent.store import AgentStore
from agent.understanding import analyze_query, normalize_query
from agent.unsupported_entity_detection import (
    detect_catalog_unknown_intent,
    match_unsupported_entity,
)
from prompts.intent_router import route_query
from tests.agent.test_runtime import build_registry

AdversarialCategory = Literal[
    "unknown_components",
    "unknown_tokens",
    "unknown_states",
    "unknown_guidelines",
    "invalid_comparisons",
    "hallucination_detection",
]

ExpectedOutcome = Literal[
    "no_evidence",
    "comparison_blocked",
    "unsupported_entity",
    "unknown_entity",
    "no_hallucination",
]


@dataclass(frozen=True)
class AdversarialCase:
    id: str
    category: AdversarialCategory
    query: str
    expected: ExpectedOutcome
    description: str


ADVERSARIAL_CASES: tuple[AdversarialCase, ...] = (
    *(
        AdversarialCase(
            id=f"unknown_component_{label.lower().replace(' ', '_')}",
            category="unknown_components",
            query=f"Como uso o componente {label}?",
            expected="no_evidence",
            description=f"{label} is not in the canonical catalog.",
        )
        for label in ("SideDrawer", "MegaWizard", "ContextFlow", "DragonModal", "SmartPanel")
    ),
    *(
        AdversarialCase(
            id=f"unknown_token_{token.replace('.', '_').replace('-', '_')}",
            category="unknown_tokens",
            query=f"Qual token devo usar: {token}?",
            expected="no_evidence",
            description=f"Token {token} is absent from the catalog.",
        )
        for token in ("brand-999", "spacing-xxxl-7", "color-magic-purple")
    ),
    *(
        AdversarialCase(
            id=f"unknown_state_{state.replace('-', '_')}",
            category="unknown_states",
            query=f"Existe o estado {state}?",
            expected="no_evidence",
            description=f"State {state} is not documented.",
        )
        for state in ("warning-loading-success", "partial-error-confirmed")
    ),
    AdversarialCase(
        id="unknown_guideline_progressive_disclosure",
        category="unknown_guidelines",
        query="Qual guideline define Progressive Disclosure?",
        expected="no_evidence",
        description="Progressive Disclosure is not in the guideline catalog.",
    ),
    *(
        AdversarialCase(
            id=f"invalid_comparison_{left.lower()}_{right.lower()}",
            category="invalid_comparisons",
            query=f"{left} ou {right}?",
            expected="comparison_blocked",
            description=f"Comparison blocked because {right} is not catalogued.",
        )
        for left, right in (
            ("Dialog", "SideDrawer"),
            ("Button", "DragonButton"),
            ("Tooltip", "MagicPopover"),
        )
    ),
    AdversarialCase(
        id="hallucination_unknown_component_response",
        category="hallucination_detection",
        query="Documentação do DragonModal",
        expected="no_hallucination",
        description="Response must not invent DragonModal as a supported component.",
    ),
)


def list_adversarial_cases() -> list[dict[str, Any]]:
    return [
        {
            "id": case.id,
            "category": case.category,
            "query": case.query,
            "expected": case.expected,
            "description": case.description,
        }
        for case in ADVERSARIAL_CASES
    ]


def _build_runtime() -> AgentRuntime:
    tmp = tempfile.mkdtemp()
    store = AgentStore(Path(tmp) / "agent.sqlite3")
    store.initialize()
    return AgentRuntime(registry=build_registry(store), store=store, model="test-model")


_INVENTED_ENTITY_PATTERN = re.compile(
    r"\b(?:SideDrawer|MegaWizard|ContextFlow|DragonModal|SmartPanel|DragonButton|MagicPopover"
    r"|brand-999|spacing-xxxl-7|color-magic-purple)\b",
    re.I,
)


def _catalog_resolution(query: str) -> CatalogEntityResolution | None:
    normalized = normalize_query(query)
    understanding = analyze_query(query)
    if understanding.catalog_entity_resolution is not None:
        return understanding.catalog_entity_resolution
    typed = resolve_typed_catalog_entities(normalized)
    if typed:
        return typed[0]
    return None


def _response_invents_entity(response_text: str) -> bool:
    if not response_text:
        return False
    lowered = response_text.lower()
    invention_markers = (
        "componente oficial",
        "official component",
        "está documentado",
        "is documented",
        "recomendo usar",
        "i recommend using",
        "canonical component",
        "componente canônico",
    )
    if not _INVENTED_ENTITY_PATTERN.search(response_text):
        return False
    return any(marker in lowered for marker in invention_markers)


def _evaluate_case(case: AdversarialCase) -> dict[str, Any]:
    normalized = normalize_query(case.query)
    understanding = analyze_query(case.query)
    route = route_query(case.query, profile="designer")
    plan = build_agent_plan(case.query, understanding=understanding)
    runtime = _build_runtime()
    ctx = runtime.prepare(
        query=case.query,
        profile="designer",
        routed_intent=route.retrieval_intent,
        command_mode=None,
        session_id="intelligence-lab",
        project_id="intelligence-lab",
        preferred_detail_level="balanced",
        understanding=understanding,
    )
    resolution = _catalog_resolution(case.query)
    unsupported = match_unsupported_entity(normalized)
    unknown_intent = detect_catalog_unknown_intent(
        case.query,
        normalized_query=normalized,
        entities=understanding.entities,
    )
    exact_matches = resolve_exact_entity_matches(normalized)

    response_preview = (ctx.deterministic_response or "")[:400]
    evidence = ctx.execution.evidence if ctx.execution else []
    integrity = EvidenceIntegrityValidator().validate(
        response_text=ctx.deterministic_response or "",
        workflow=plan.workflow,
        understanding=understanding,
        component_selection=ctx.component_selection,
        evidence=evidence,
    )

    passed = False
    fail_reason = ""

    if case.expected == "no_evidence":
        unknown = (
            resolution is not None and resolution.entity_status == "unknown"
        ) or unknown_intent or plan.workflow in {
            "unknown_entity_lookup",
            "unsupported_entity_lookup",
        }
        passed = unknown and not _response_invents_entity(response_preview)
        if not unknown:
            fail_reason = "expected unknown/absent entity handling"
        elif _response_invents_entity(response_preview):
            fail_reason = "response treats unknown entity as supported"

    elif case.expected == "comparison_blocked":
        from agent.comparison_entity_validator import validate_comparison_entities

        blocked = validate_comparison_entities(case.query)
        passed = blocked.blocked
        if not blocked:
            fail_reason = "comparison should be blocked for unknown entity"

    elif case.expected == "unsupported_entity":
        passed = unsupported is not None or plan.workflow.startswith("unsupported_entity")
        if not passed:
            fail_reason = "expected unsupported entity workflow"

    elif case.expected == "unknown_entity":
        passed = (
            resolution is not None and resolution.entity_status == "unknown"
        ) or plan.workflow == "unknown_entity_lookup"
        if not passed:
            fail_reason = "expected unknown entity lookup"

    elif case.expected == "no_hallucination":
        passed = not _response_invents_entity(response_preview) and not integrity.violations
        if _response_invents_entity(response_preview):
            fail_reason = "response hallucinated unsupported entity"
        elif integrity.violations:
            fail_reason = f"integrity violations: {integrity.violations}"

    return {
        "id": case.id,
        "category": case.category,
        "query": case.query,
        "expected": case.expected,
        "description": case.description,
        "passed": passed,
        "fail_reason": fail_reason,
        "workflow": plan.workflow,
        "retrieval_intent": route.retrieval_intent,
        "entity_status": resolution.entity_status if resolution else None,
        "unsupported_entity": unsupported[0].label if unsupported else None,
        "exact_matches": [match.component_id for match in exact_matches],
        "integrity_violations": integrity.violations,
        "response_preview": response_preview,
    }


def run_adversarial_suite(
    *,
    categories: list[AdversarialCategory] | None = None,
) -> dict[str, Any]:
    selected = ADVERSARIAL_CASES
    if categories:
        allowed = set(categories)
        selected = tuple(case for case in ADVERSARIAL_CASES if case.category in allowed)

    results = [_evaluate_case(case) for case in selected]
    passed = sum(1 for result in results if result["passed"])
    total = len(results)
    by_category: dict[str, dict[str, int]] = {}
    for result in results:
        bucket = by_category.setdefault(result["category"], {"passed": 0, "total": 0})
        bucket["total"] += 1
        if result["passed"]:
            bucket["passed"] += 1

    return {
        "passed": passed,
        "total": total,
        "pass_rate_percent": round((passed / total) * 100) if total else 100,
        "by_category": by_category,
        "results": results,
    }


def run_catalog_sanity_checks() -> dict[str, Any]:
    from agent.catalog_registries import match_guideline, match_state, match_token

    checks = {
        "unknown_token_brand_999": match_token("brand-999").entity_status == "unknown",
        "unknown_state_warning_loading": match_state("warning-loading").entity_status == "unknown",
        "unknown_guideline_progressive": match_guideline("Progressive Disclosure").entity_status == "unknown",
        "side_drawer_unsupported": match_unsupported_entity("side drawer") is not None,
    }
    return {
        "passed": all(checks.values()),
        "checks": checks,
    }
