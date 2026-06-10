#!/usr/bin/env python3
"""Temporary audit matrix runner for Abraxos intelligence audit."""
from __future__ import annotations

import json
import sys
import tempfile
from pathlib import Path  # noqa: F401 - used by build_runtime

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from agent.concept_map import resolve_concept_key
from agent.entity_resolution import primary_exact_match, resolve_exact_entity_matches
from agent.evidence import evidence_tier
from agent.models import QueryUnderstanding
from agent.navigation_actions import serialize_navigation_payload
from agent.planner import build_agent_plan
from agent.perspective_registry import resolve_perspective_match
from agent.route_map import resolve_navigation_route
from agent.runtime import AgentRuntime
from agent.store import AgentStore
from agent.tools import (
    build_compare_design_options_tool,
    build_create_decision_record_tool,
    build_search_component_tool,
    build_search_design_decision_tool,
    build_search_explainability_tool,
    build_search_pattern_tool,
    build_search_token_tool,
    build_validate_design_system_tool,
)
from agent.understanding import analyze_query, normalize_query
from prompts.intent_router import route_query
from tests.agent.fixtures import fixture_retrieve
from tests.agent.test_runtime import build_registry as build_test_registry


def build_runtime() -> AgentRuntime:
    tmp = tempfile.mkdtemp()
    store = AgentStore(Path(tmp) / "agent.sqlite3")
    store.initialize()
    registry = build_test_registry(store)
    return AgentRuntime(registry=registry, store=store, model="llama-3.3-70b-versatile")


def evaluate(query: str, *, expect_action: bool = False) -> dict:
    normalized = normalize_query(query)
    understanding = analyze_query(query)
    route = route_query(query, profile="designer")
    plan = build_agent_plan(query, understanding=understanding)
    runtime = build_runtime()
    ctx = runtime.prepare(
        query=query,
        profile="designer",
        routed_intent=route.retrieval_intent,
        command_mode=None,
        session_id="audit",
        project_id="audit",
        preferred_detail_level="balanced",
        understanding=understanding,
    )
    exact = resolve_exact_entity_matches(normalized)
    primary = primary_exact_match(normalized)
    nav_route = resolve_navigation_route(query)
    perspective = resolve_perspective_match(query)
    concept = resolve_concept_key(normalized)
    audit = ctx.audit_metadata()
    rag_called = any(
        "search_" in t.name for t in (audit.tools_used or [])
    )
    action = serialize_navigation_payload(ctx.navigation_action) if ctx.navigation_action else None
    secondary = [
        serialize_navigation_payload(a) for a in (ctx.secondary_navigation_actions or [])
    ]
    passed = True
    fail_reason = ""
    if expect_action and not action:
        passed = False
        fail_reason = "expected navigation_action but none generated"
    return {
        "input": query,
        "normalized_query": normalized,
        "language": understanding.language,
        "resolved_route_from_understanding": understanding.resolved_route,
        "resolved_perspective_from_understanding": understanding.resolved_perspective_id,
        "operational_intent": understanding.operational_intent,
        "user_intent": understanding.user_intent,
        "retrieval_intent": route.retrieval_intent,
        "entities": {
            "components": understanding.entities.components,
            "patterns": understanding.entities.patterns,
            "tokens": understanding.entities.tokens,
        },
        "resolved_route": nav_route.route if nav_route else None,
        "resolved_perspective": perspective.entry.profile_id if perspective else None,
        "concept_resolved": concept,
        "rag_called": rag_called,
        "workflow": plan.workflow,
        "should_compose": ctx.should_compose,
        "evidence_tier": audit.evidence_tier,
        "action_payload": action,
        "secondary_actions": secondary,
        "response_preview": (ctx.deterministic_response or "")[:200],
        "passed": passed,
        "fail_reason": fail_reason,
    }


MATRIX = [
    ("Greeting", "oie", False),
    ("Greeting", "oiee", False),
    ("Greeting", "oi :)", False),
    ("Greeting", "olá, Abraxos", False),
    ("Greeting", "bom dia", False),
    ("Greeting", "hello", False),
    ("Small talk", "tudo bem?", False),
    ("Small talk", "estás online?", False),
    ("Small talk", "me ajuda?", False),
    ("Small talk", "pode me ajudar?", False),
    ("Small talk", "podes ajudar?", False),
    ("Small talk", "ajudas-me?", False),
    ("Small talk", "can you help me?", False),
    ("Navigation", "onde acho tokens?", True),
    ("Navigation", "cadê os componentes?", True),
    ("Navigation", "onde vejo fundamentos?", True),
    ("Navigation", "onde está raciocínio?", True),
    ("Navigation", "onde encontro decisões?", True),
    ("Semantic navigation", "onde posso achar a perspectiva de design?", True),
    ("Semantic navigation", "onde fica a parte de QA?", True),
    ("Semantic navigation", "quero ver acessibilidade", True),
    ("Semantic navigation", "onde encontro governança?", True),
    ("Semantic navigation", "onde vejo documentação?", True),
    ("Perspective", "mudar para designer", True),
    ("Perspective", "usar perspectiva de produto", True),
    ("Perspective", "visão de acessibilidade", True),
    ("Perspective", "parte de documentação", True),
    ("Perspective", "quero a perspectiva de QA", True),
    ("Entity lookup", "tem Button?", True),
    ("Entity lookup", "você tem Radio Button?", True),
    ("Entity lookup", "existe Select?", True),
    ("Entity lookup", "me mostra Modal", True),
    ("Entity lookup", "onde fica Checkbox?", True),
    ("Entity lookup", "quero ver Radio Button", True),
    ("Entity lookup", "abre Select", True),
    ("Direct guidance", "quando usar Radio Button?", True),
    ("Direct guidance", "quando não usar Button?", True),
    ("Direct guidance", "como usar Select?", True),
    ("Direct guidance", "acessibilidade do Modal", True),
    ("Direct guidance", "quais estados do Button?", True),
    ("Recommendation", "qual componente uso para escolher apenas uma opção entre várias?", True),
    ("Recommendation", "qual componente uso para escolher várias opções?", True),
    ("Recommendation", "qual componente uso para ação destrutiva?", True),
    ("Recommendation", "qual componente uso para feedback de sucesso?", True),
    ("Recommendation", "qual componente uso para erro em campo?", True),
    ("Recommendation", "qual componente uso para lista longa de opções?", True),
    ("Comparison", "Button ou Link?", False),
    ("Comparison", "Radio Button ou Select?", False),
    ("Comparison", "Modal ou Drawer?", False),
    ("Comparison", "Checkbox ou Switch?", False),
    ("Concept", "o que é Abraxos?", False),
    ("Concept", "o que era Beatrice?", False),
    ("Concept", "o que é Velaris?", False),
    ("Concept", "o que era Aetheris?", False),
    ("Concept", "o que é Tecelã?", False),
    ("Concept", "o que é evidence tier?", False),
    ("Concept", "o que é RAG?", False),
    ("Concept", "o que é XAI?", False),
    ("Out of scope", "qual a previsão do tempo amanhã?", False),
    ("Out of scope", "quem ganhou o campeonato?", False),
    ("Out of scope", "receita de bolo de chocolate", False),
]


def main() -> None:
    results = []
    for category, query, expect_action in MATRIX:
        row = evaluate(query, expect_action=expect_action)
        row["category"] = category
        # category-specific pass rules
        if category == "Greeting":
            if row["user_intent"] != "greeting":
                row["passed"] = False
                row["fail_reason"] = f"expected greeting, got {row['user_intent']}"
        elif category == "Small talk":
            if row["user_intent"] not in ("small_talk", "help_request", "greeting"):
                row["passed"] = False
                row["fail_reason"] = f"expected small_talk/help, got {row['user_intent']}"
        elif category == "Navigation":
            if row["user_intent"] not in ("navigation_query", "semantic_navigation_query"):
                row["passed"] = False
                row["fail_reason"] = f"expected navigation intent, got {row['user_intent']}"
        elif category == "Semantic navigation":
            if row["user_intent"] not in ("semantic_navigation_query", "perspective_lookup", "navigation_query"):
                row["passed"] = False
                row["fail_reason"] = f"expected semantic nav, got {row['user_intent']}"
        elif category == "Perspective":
            if row["user_intent"] not in ("perspective_lookup", "semantic_navigation_query"):
                row["passed"] = False
                row["fail_reason"] = f"expected perspective_lookup, got {row['user_intent']}"
        elif category == "Entity lookup":
            if row["user_intent"] not in ("entity_lookup", "direct_entity_guidance", "navigation_query"):
                row["passed"] = False
                row["fail_reason"] = f"expected entity_lookup, got {row['user_intent']}"
        elif category == "Direct guidance":
            if row["user_intent"] not in ("direct_entity_guidance", "component_recommendation", "accessibility_guidance"):
                row["passed"] = False
                row["fail_reason"] = f"expected direct guidance, got {row['user_intent']}"
        elif category == "Recommendation":
            if row["user_intent"] not in ("component_recommendation",):
                row["passed"] = False
                row["fail_reason"] = f"expected recommendation, got {row['user_intent']}"
            elif row["workflow"] not in (
                "decision_rule_recommendation",
                "single_choice_recommendation",
            ):
                row["passed"] = False
                row["fail_reason"] = f"expected deterministic recommendation, got {row['workflow']}"
            elif expect_action and not row["action_payload"]:
                row["passed"] = False
                row["fail_reason"] = "expected navigation_action for recommendation"
        elif category == "Comparison":
            if row["user_intent"] != "component_comparison":
                row["passed"] = False
                row["fail_reason"] = f"expected component_comparison, got {row['user_intent']}"
        elif category == "Concept":
            if row["user_intent"] not in ("concept_query", "legacy_name_query"):
                row["passed"] = False
                row["fail_reason"] = f"expected concept_query, got {row['user_intent']}"
        elif category == "Out of scope":
            if row["user_intent"] != "out_of_scope":
                row["passed"] = False
                row["fail_reason"] = f"expected out_of_scope, got {row['user_intent']}"
        results.append(row)

    passed = sum(1 for r in results if r["passed"])
    print(json.dumps({"total": len(results), "passed": passed, "failed": len(results) - passed, "results": results}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
