#!/usr/bin/env python3
"""End-to-end intelligence matrix for Abraxos phases 3 to 6."""

from __future__ import annotations

import json
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from agent.runtime import AgentRuntime
from agent.store import AgentStore
from agent.understanding import analyze_query
from prompts.intent_router import route_query
from tests.agent.test_runtime import build_registry


CASES = [
    ("small_talk", "me ajuda?", {"intent": "small_talk", "compose": False}),
    ("entity_lookup", "me mostra Modal", {"intent": "entity_lookup", "action": True}),
    ("entity_lookup", "onde fica Checkbox?", {"intent": "entity_lookup", "action": True}),
    ("guidance", "acessibilidade do Modal", {"intent": "direct_entity_guidance", "action": True}),
    ("guidance", "quais estados do Button?", {"intent": "direct_entity_guidance", "action": True}),
    ("recommendation", "qual componente uso para escolher várias opções?", {"workflow": "decision_rule_recommendation"}),
    ("recommendation", "qual componente uso para ação destrutiva?", {"workflow": "decision_rule_recommendation"}),
    ("comparison", "Button ou Link?", {"workflow": "comparison_rule", "action": True}),
    ("comparison", "Radio Button ou Select?", {"workflow": "comparison_rule", "action": True}),
    ("comparison", "Modal ou Drawer?", {"workflow": "comparison_rule", "action": True}),
    ("comparison", "Checkbox ou Switch?", {"workflow": "comparison_rule", "action": True}),
    ("concept", "o que é Abraxos?", {"intent": "concept_query", "compose": False}),
    ("navigation", "onde acho tokens?", {"intent": "navigation_query", "action": True}),
    ("out_of_scope", "qual a previsão do tempo?", {"intent": "out_of_scope", "compose": False}),
    ("perspective", "quero ver acessibilidade", {"intent": "perspective_lookup", "profile": "a11y", "action": True}),
    ("perspective", "onde fica a parte de QA", {"intent": "perspective_lookup", "profile": "qa", "action": True}),
    ("perspective", "onde encontro governança", {"intent": "perspective_lookup", "profile": "design_system_manager", "action": True}),
    ("perspective", "quero ver design de produto", {"intent": "perspective_lookup", "profile": "product_designer", "action": True}),
    ("perspective", "onde fica a parte de design", {"intent": "perspective_lookup", "profile": "designer", "action": True}),
    ("perspective", "quero ver documentação", {"intent": "perspective_lookup", "profile": "tech_writer", "action": True}),
    ("perspective", "onde fica desenvolvimento", {"intent": "perspective_lookup", "profile": "dev", "action": True}),
    ("perspective", "onde fica manutenção", {"intent": "perspective_lookup", "profile": "maintainer", "action": True}),
]


def prepare(query: str):
    tmp = tempfile.mkdtemp()
    store = AgentStore(Path(tmp) / "agent.sqlite3")
    store.initialize()
    runtime = AgentRuntime(registry=build_registry(store), store=store, model="test-model")
    route = route_query(query)
    return runtime.prepare(
        query=query,
        profile="designer",
        routed_intent=route.response_intent,
        command_mode=None,
        session_id="e2e",
        project_id="e2e",
        preferred_detail_level="balanced",
        understanding=route.understanding,
    )


def main() -> None:
    results = []
    passed = 0
    for category, query, expected in CASES:
        understanding = analyze_query(query)
        ctx = prepare(query)
        row = {
            "category": category,
            "query": query,
            "user_intent": understanding.user_intent,
            "workflow": ctx.plan.workflow,
            "should_compose": ctx.should_compose,
            "has_action": ctx.navigation_action is not None,
            "passed": True,
            "fail_reason": "",
        }
        if "intent" in expected and understanding.user_intent != expected["intent"]:
            row["passed"] = False
            row["fail_reason"] = f"expected intent {expected['intent']}"
        if "workflow" in expected and ctx.plan.workflow != expected["workflow"]:
            row["passed"] = False
            row["fail_reason"] = f"expected workflow {expected['workflow']}"
        if expected.get("compose") is False and ctx.should_compose:
            row["passed"] = False
            row["fail_reason"] = "expected deterministic path"
        if "profile" in expected and understanding.resolved_perspective_id != expected["profile"]:
            row["passed"] = False
            row["fail_reason"] = f"expected profile {expected['profile']}"
        if expected.get("action") and ctx.navigation_action is None:
            row["passed"] = False
            row["fail_reason"] = "expected navigation_action"
        if row["passed"]:
            passed += 1
        results.append(row)

    payload = {
        "total": len(results),
        "passed": passed,
        "failed": len(results) - passed,
        "results": results,
    }
    print(json.dumps(payload, ensure_ascii=False, indent=2))
    if passed != len(results):
        sys.exit(1)


if __name__ == "__main__":
    main()
