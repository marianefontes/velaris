#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
import tempfile
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from agent.registry import ToolRegistry
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
from tests.agent.fixtures import fixture_retrieve


STATUS_LABELS_PT = {
    "pending": "Pendente",
    "running": "Em execução",
    "completed": "Concluído",
    "failed": "Falhou",
    "blocked": "Bloqueado",
    "skipped": "Ignorado",
}


def build_registry(store: AgentStore, retrieve=fixture_retrieve) -> ToolRegistry:
    registry = ToolRegistry()
    for tool in (
        build_search_component_tool(retrieve),
        build_search_design_decision_tool(retrieve),
        build_search_explainability_tool(retrieve),
        build_search_pattern_tool(retrieve),
        build_search_token_tool(retrieve),
        build_compare_design_options_tool(retrieve),
        build_validate_design_system_tool(retrieve),
        build_create_decision_record_tool(store),
    ):
        registry.register(tool)
    return registry


def prepare(runtime: AgentRuntime, query: str, routed_intent: str = "general"):
    return runtime.prepare(
        query=query,
        profile="designer",
        routed_intent=routed_intent,
        command_mode=None,
        session_id="session_tcc_validation",
        project_id="project_tcc_validation",
        preferred_detail_level="balanced",
    )


def rendered_trace(steps: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [
        {
            "id": step["id"],
            "label": step["label"],
            "status": STATUS_LABELS_PT[step["status"]],
            "details": step.get("details"),
        }
        for step in steps
    ]


def main() -> None:
    with tempfile.TemporaryDirectory(prefix="aetheris-agent-validation-") as temp_dir:
        store = AgentStore(Path(temp_dir) / "agent.sqlite3")
        store.initialize()
        runtime = AgentRuntime(
            registry=build_registry(store),
            store=store,
            model="composer-fixture",
        )

        component = prepare(
            runtime,
            "Qual componente usar para confirmação?",
            "component_guidance",
        )
        selected_tools_before_composition = list(component.plan.tools)
        structured_context = runtime.structured_context(component)
        runtime.start_composition(component)
        component_audit = runtime.finalize_success(
            component,
            "Use Dialog para uma decisão bloqueante que exige confirmação explícita.",
        ).model_dump(mode="json")
        component_run = store.get_run(component.request_id)
        if component_run is None:
            raise RuntimeError("component agent_run was not persisted")
        decision_id = component_audit["decision_id"]
        draft_decision = store.get_decision(decision_id)
        confirmed_decision = store.update_decision_status(decision_id, "confirmed")

        out_of_scope = prepare(runtime, "Qual é a previsão do tempo?")
        out_of_scope_audit = out_of_scope.audit_metadata(
            execution_status="blocked",
        ).model_dump(mode="json")
        out_of_scope_step_ids = [
            step["id"]
            for step in out_of_scope_audit["steps"]
        ]

        def failing_retrieve(
            query: str,
            intent: str,
            top_k: int,
            profile: str,
        ) -> list[dict]:
            del query, intent, top_k, profile
            raise RuntimeError("retrieval unavailable")

        failing_runtime = AgentRuntime(
            registry=build_registry(store, failing_retrieve),
            store=store,
            model="composer-fixture",
        )
        failed = prepare(
            failing_runtime,
            "Qual componente usar para confirmação?",
            "component_guidance",
        )
        failed_audit = failed.audit_metadata(
            execution_status="failed",
        ).model_dump(mode="json")

        component_step_ids = [
            step["id"]
            for step in component_audit["steps"]
        ]
        result = {
            "validation_context": {
                "database": "SQLite temporário criado pelo script",
                "retrieval": "fixture versionada da suíte agentic",
                "composer": "fixture determinística",
                "external_groq_call": False,
            },
            "component_decision": {
                "audit_metadata": component_audit,
                "agent_run": component_run,
                "decision_draft": draft_decision,
                "decision_confirmed": confirmed_decision,
                "execution_trace_rendered": rendered_trace(
                    component_audit["steps"]
                ),
            },
            "out_of_scope": {
                "response": out_of_scope.deterministic_response,
                "audit_metadata": out_of_scope_audit,
                "llm_composition_step_present": (
                    "llm_composition_started" in out_of_scope_step_ids
                ),
                "should_compose": out_of_scope.should_compose,
            },
            "failure_example": {
                "response": failed.deterministic_response,
                "audit_metadata": failed_audit,
            },
            "llm_boundary": {
                "selected_tools_before_composition": (
                    selected_tools_before_composition
                ),
                "tool_results_built_before_composition": (
                    component_step_ids.index("tool_results_built")
                    < component_step_ids.index("llm_composition_started")
                ),
                "structured_context_contains_tool_results": (
                    '"tool_results"' in structured_context
                ),
                "structured_context_contains_executable_registry": False,
                "composer_instruction": (
                    "Compose the final answer from this structured context. "
                    "Do not choose tools, execute actions, invent sources or "
                    "expose internal reasoning."
                ),
            },
        }

        assert draft_decision is not None
        assert draft_decision["status"] == "draft"
        assert confirmed_decision is not None
        assert confirmed_decision["status"] == "confirmed"
        assert confirmed_decision["confirmed_by_user"] is True
        assert out_of_scope.should_compose is False
        assert "llm_composition_started" not in out_of_scope_step_ids
        assert failed_audit["execution_status"] == "failed"
        assert failed_audit["limitations"]
        assert result["llm_boundary"]["tool_results_built_before_composition"]

        print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
