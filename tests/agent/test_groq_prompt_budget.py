from __future__ import annotations

import json
import unittest

from server import (
    GROQ_MAX_REQUEST_BYTES,
    _build_groq_messages,
    _collapse_messages_for_workflow_resume,
    _compact_agent_context,
    _fit_groq_messages,
    _groq_payload_size,
)


class GroqPromptBudgetTests(unittest.TestCase):
    def test_collapse_messages_for_workflow_resume(self) -> None:
        messages = [
            {"role": "user", "content": "Gere um caminho de migração para este componente legado."},
            {"role": "assistant", "content": "Qual componente legado você quer migrar?"},
            {"role": "user", "content": "Button"},
        ]
        class Pending:
            resolved_query = (
                "Gere um caminho de migração para este componente legado. "
                "Componente informado para migração: Button."
            )

        collapsed = _collapse_messages_for_workflow_resume(messages, Pending())
        self.assertEqual(len(collapsed), 1)
        self.assertEqual(collapsed[0]["role"], "user")
        self.assertIn("Button", collapsed[0]["content"])

    def test_compact_migration_agent_context(self) -> None:
        payload = {
            "request_id": "req_test",
            "workflow": "migration_advisor",
            "session_memory": {"history": ["x" * 5000]},
            "project_memory": {"notes": ["y" * 5000]},
            "query_understanding": {
                "user_intent": "component_recommendation",
                "professional_category": "MIGRATION_ADVISOR",
                "language": "pt-BR",
                "entities": {"components": ["Button"]},
                "answer_strategy": "component_recommendation",
                "noise": "z" * 3000,
            },
            "migration_advisor_contract": {"capability": "MIGRATION_ADVISOR"},
            "composer_boundary": "compose",
        }
        raw = "# Governed Agent Context\n\n" + json.dumps(payload, ensure_ascii=False, indent=2)
        compact = _compact_agent_context(raw, workflow="migration_advisor")
        self.assertNotIn("session_memory", compact)
        self.assertNotIn("noise", compact)
        self.assertIn("migration_advisor_contract", compact)

    def test_fit_groq_messages_respects_budget(self) -> None:
        messages = [
            {"role": "system", "content": "x" * 80_000},
            {"role": "user", "content": "Button"},
        ]
        fitted = _fit_groq_messages(messages, max_bytes=GROQ_MAX_REQUEST_BYTES)
        self.assertLessEqual(_groq_payload_size(fitted), GROQ_MAX_REQUEST_BYTES)


if __name__ == "__main__":
    unittest.main()
