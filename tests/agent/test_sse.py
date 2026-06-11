from __future__ import annotations

import json
import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

os.environ["AETHERIS_SKIP_RAG_STARTUP"] = "1"
os.environ["LABORATORY_AUTOMATION_ENABLED"] = "false"

from fastapi.testclient import TestClient

import server
from agent.registry import ToolRegistry
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


def registry_for(store: AgentStore, retrieve=fixture_retrieve) -> ToolRegistry:
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


class FakeGroqResponse:
    def __init__(self, *, status_code: int = 200):
        self.status_code = status_code

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc, traceback):
        return False

    async def aiter_lines(self):
        yield 'data: {"choices":[{"delta":{"content":"Use Dialog."}}]}'
        yield "data: [DONE]"


class FakeAsyncClient:
    status_code = 200

    def __init__(self, *args, **kwargs):
        del args, kwargs

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc, traceback):
        return False

    def stream(self, *args, **kwargs):
        del args, kwargs
        return FakeGroqResponse(status_code=self.status_code)


def parse_sse(response_text: str) -> list[dict]:
    events: list[dict] = []
    for line in response_text.splitlines():
        if not line.startswith("data: "):
            continue
        payload = line[6:]
        if payload == "[DONE]":
            continue
        events.append(json.loads(payload))
    return events


class AgentSSEContractTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.store = AgentStore(Path(self.temp_dir.name) / "agent.sqlite3")
        self.store.initialize()
        self.original_store = server.agent_store
        self.original_api_key = server.API_KEY
        server.agent_store = self.store
        server.API_KEY = "test-key"
        self.calibration_patch = patch.object(
            server.laboratory_store,
            "active_calibration",
            return_value={"id": None, "calibration": {}},
        )
        self.calibration_patch.start()

    def tearDown(self) -> None:
        self.calibration_patch.stop()
        server.agent_store = self.original_store
        server.API_KEY = self.original_api_key
        self.temp_dir.cleanup()

    def payload(self, query: str) -> dict:
        return {
            "messages": [{"role": "user", "content": query}],
            "profile": "designer",
            "session_id": "session_sse",
            "project_id": "project_sse",
            "preferred_detail_level": "balanced",
        }

    def test_health_aliases_are_available(self) -> None:
        client = TestClient(server.app)
        try:
            for path in ("/health", "/api/health"):
                with self.subTest(path=path):
                    response = client.get(path)
                    self.assertEqual(response.status_code, 200)
                    self.assertEqual(response.json()["status"], "ok")
        finally:
            client.close()

    def test_greeting_emits_deterministic_response_without_retrieval_or_llm(self) -> None:
        retrieval_calls: list[str] = []

        def forbidden_retrieve(
            query: str,
            intent: str,
            top_k: int,
            profile: str,
        ) -> list[dict]:
            del intent, top_k, profile
            retrieval_calls.append(query)
            raise AssertionError("greeting must not execute retrieval")

        client = TestClient(server.app)
        try:
            with (
                patch.object(
                    server,
                    "_build_agent_registry",
                    side_effect=lambda route: registry_for(
                        self.store,
                        retrieve=forbidden_retrieve,
                    ),
                ),
                patch.object(server.httpx, "AsyncClient") as async_client,
            ):
                response = client.post("/api/chat", json=self.payload("oi"))
        finally:
            client.close()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(retrieval_calls, [])
        async_client.assert_not_called()
        events = parse_sse(response.text)
        self.assertEqual(events[0]["workflow"], "greeting")
        self.assertEqual(events[0]["tools_used"], [])
        self.assertEqual(
            events[0]["audit_metadata"]["evidence_tier"],
            "not_required",
        )
        self.assertEqual(
            events[1]["delta"],
            "Olá. Posso ajudar com componentes, tokens, padrões, perspectivas, "
            "acessibilidade, auditorias e decisões do Velaris.",
        )
        final = events[-1]["audit_metadata"]
        self.assertEqual(final["execution_status"], "completed")
        self.assertEqual(final["user_intent"], "greeting")
        self.assertEqual(final["evidence_tier"], "not_required")

    def test_out_of_scope_emits_real_steps_without_llm(self) -> None:
        server.API_KEY = ""
        client = TestClient(server.app)
        try:
            response = client.post("/api/chat", json=self.payload("Qual é a previsão do tempo?"))
        finally:
            client.close()
        self.assertEqual(response.status_code, 200)
        events = parse_sse(response.text)
        initial = events[0]
        final = events[-1]
        self.assertEqual(initial["workflow"], "out_of_scope")
        self.assertEqual(initial["tools_used"], [])
        self.assertEqual(
            initial["audit_metadata"]["evidence_tier"],
            "not_required",
        )
        self.assertEqual(final["audit_metadata"]["execution_status"], "blocked")
        self.assertIn(
            "out_of_scope_blocked",
            [step["id"] for step in final["audit_metadata"]["steps"]],
        )
        self.assertEqual(self.store.list_decisions(), [])

    def test_successful_stream_emits_initial_deltas_and_final_decision(self) -> None:
        client = TestClient(server.app)
        try:
            with (
                patch.object(server, "_build_agent_registry", side_effect=lambda route: registry_for(self.store)),
                patch.object(server.httpx, "AsyncClient", FakeAsyncClient),
            ):
                response = client.post(
                    "/api/chat",
                    json=self.payload(
                        "Qual componente devo usar para agrupar filtros "
                        "em uma barra lateral colapsável?"
                    ),
                )
        finally:
            client.close()
        events = parse_sse(response.text)
        self.assertEqual(events[0]["workflow"], "component_decision")
        self.assertIn(
            "Componente recomendado: Modal/Dialog",
            events[1]["delta"],
        )
        self.assertNotEqual(events[1]["delta"], "Use Dialog.")
        final = events[-1]
        final_audit = final["audit_metadata"]
        self.assertEqual(final_audit["execution_status"], "completed")
        self.assertEqual(final_audit["decision_status"], "draft")
        self.assertTrue(final_audit["decision_id"])
        self.assertEqual(final_audit["recommended_component"], "Modal/Dialog")
        self.assertEqual(final_audit["recommended_component_id"], "modal-dialog")
        self.assertIn("navigation_action", final)
        self.assertEqual(final["navigation_action"]["target_type"], "component")
        self.assertEqual(final_audit["response_validation_status"], "fallback")
        self.assertTrue(final_audit["fallback_used"])
        self.assertEqual(len(self.store.list_decisions()), 1)

    def test_decision_rule_stream_is_deterministic_with_navigation_action(self) -> None:
        client = TestClient(server.app)
        try:
            with (
                patch.object(server, "_build_agent_registry", side_effect=lambda route: registry_for(self.store)),
                patch.object(server.httpx, "AsyncClient", FakeAsyncClient),
            ):
                response = client.post(
                    "/api/chat",
                    json=self.payload("qual componente uso para ação destrutiva?"),
                )
        finally:
            client.close()
        events = parse_sse(response.text)
        self.assertEqual(events[0]["workflow"], "decision_rule_recommendation")
        final = events[-1]
        self.assertIn("navigation_action", final)
        self.assertEqual(
            final["navigation_action"]["metadata"]["component_id"],
            "modal-dialog",
        )
        self.assertIn("Modal/Dialog", events[1]["delta"])

    def test_primary_workflow_chat_smoke(self) -> None:
        cases = {
            "component_decision": "Qual componente usar para confirmação?",
            "pattern_guidance": "Qual padrão usar em um fluxo de onboarding?",
            "token_lookup": "Qual token de cor usar para erro?",
            "accessibility_guidance": "Quais requisitos de WCAG devo seguir para acessibilidade?",
            "design_decision": "Por que esta decisão de hierarquia existe?",
            "xai_explanation": "Por que a Beatrice recomendou este componente?",
            "design_audit": "Valide este Button com cor hardcoded e sem foco.",
            "comparison_rule": "Compare Button versus Link para ações de navegação.",
            "compare_options": "Compare Modal versus Drawer for a settings form.",
            "documentation_help": "Explique como funciona o design system Aetheris.",
            "out_of_scope": "Qual é a previsão do tempo?",
        }
        client = TestClient(server.app)
        try:
            with (
                patch.object(server, "_build_agent_registry", side_effect=lambda route: registry_for(self.store)),
                patch.object(server.httpx, "AsyncClient", FakeAsyncClient),
            ):
                for expected_workflow, query in cases.items():
                    with self.subTest(workflow=expected_workflow):
                        response = client.post("/api/chat", json=self.payload(query))
                        self.assertEqual(response.status_code, 200)
                        events = parse_sse(response.text)
                        self.assertEqual(events[0]["workflow"], expected_workflow)
                        final = events[-1]["audit_metadata"]
                        self.assertEqual(final["workflow"], expected_workflow)
                        self.assertTrue(final["steps"])
                        deterministic_workflows = {
                            "out_of_scope",
                            "comparison_rule",
                            "decision_rule_recommendation",
                            "single_choice_recommendation",
                            "unsupported_entity_lookup",
                        }
                        if expected_workflow in deterministic_workflows:
                            if expected_workflow == "out_of_scope":
                                self.assertEqual(final["execution_status"], "blocked")
                            else:
                                self.assertIn(
                                    "response_completed",
                                    [step["id"] for step in final["steps"]],
                                )
                            self.assertEqual(final["tools_used"], [])
                        else:
                            self.assertIn(
                                "response_completed",
                                [step["id"] for step in final["steps"]],
                            )
                            self.assertTrue(final["tools_used"])
        finally:
            client.close()

    def test_component_llm_error_uses_deterministic_fallback_without_draft(self) -> None:
        class FailedClient(FakeAsyncClient):
            status_code = 500

        client = TestClient(server.app)
        try:
            with (
                patch.object(server, "_build_agent_registry", side_effect=lambda route: registry_for(self.store)),
                patch.object(server.httpx, "AsyncClient", FailedClient),
            ):
                response = client.post(
                    "/api/chat",
                    json=self.payload("Qual componente usar para confirmação?"),
                )
        finally:
            client.close()
        events = parse_sse(response.text)
        self.assertNotIn("error", events[-1])
        self.assertIn("Componente recomendado:", events[1]["delta"])
        final = events[-1]["audit_metadata"]
        self.assertEqual(final["execution_status"], "limited")
        self.assertTrue(final["fallback_used"])
        self.assertEqual(final["decision_id"], None)
        self.assertEqual(self.store.list_decisions(), [])
        self.assertIsNone(self.store.get_session_memory("session_sse"))

    def test_non_fallback_llm_error_preserves_failure_metadata(self) -> None:
        class FailedClient(FakeAsyncClient):
            status_code = 500

        client = TestClient(server.app)
        try:
            with (
                patch.object(server, "_build_agent_registry", side_effect=lambda route: registry_for(self.store)),
                patch.object(server.httpx, "AsyncClient", FailedClient),
            ):
                response = client.post(
                    "/api/chat",
                    json=self.payload("Qual padrão usar em um fluxo de onboarding?"),
                )
        finally:
            client.close()
        events = parse_sse(response.text)
        error = events[-1]
        self.assertIn("error", error)
        self.assertEqual(error["audit_metadata"]["execution_status"], "failed")
        self.assertEqual(error["audit_metadata"]["decision_id"], None)
        self.assertEqual(self.store.list_decisions(), [])

    def test_decision_endpoints_confirm_and_reject_drafts(self) -> None:
        first = self.store.create_decision(
            server.CreateDecisionRecordInput.model_validate({
                "request_id": "req_1",
                "session_id": "session_sse",
                "project_id": "project_sse",
                "user_query": "Dialog?",
                "profile": "designer",
                "workflow": "component_decision",
                "recommendation": "Use Dialog.",
                "alternatives_considered": [],
                "tradeoffs": [],
                "evidence_sources": [],
                "top_similarity": 0.82,
                "evidence_tier": "strong",
                "model": "test",
            })
        )
        client = TestClient(server.app)
        try:
            confirmed = client.patch(
                f"/api/decisions/{first['decision_id']}",
                json={"status": "confirmed"},
            )
            listed = client.get("/api/decisions", params={"project_id": "project_sse"})
        finally:
            client.close()
        self.assertEqual(confirmed.status_code, 200)
        self.assertTrue(confirmed.json()["confirmed_by_user"])
        self.assertEqual(len(listed.json()["decisions"]), 1)


if __name__ == "__main__":
    unittest.main()
