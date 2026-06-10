from __future__ import annotations

import unittest

from agent.models import EvidenceItem
from agent.response_validation import (
    deterministic_token_response,
    validate_token_response,
)


class TokenResponseValidationTests(unittest.TestCase):
    def evidence(self) -> list[EvidenceItem]:
        return [
            EvidenceItem(
                title="--velaris-color-primary",
                source="TokensPage",
                page_type="token",
                excerpt="Use as the semantic brand color.",
                semantic_text="Use as the semantic brand color.",
                similarity=0.82,
                retrieval_weight=1.0,
                weighted_score=0.82,
            )
        ]

    def test_official_token_passes(self) -> None:
        validation = validate_token_response(
            "Token recomendado: --velaris-color-primary\n\n"
            "Evidência forte, com limitação de contraste.",
            self.evidence(),
        )
        self.assertEqual(validation.status, "pass")

    def test_invented_token_triggers_fallback(self) -> None:
        validation = validate_token_response(
            "Token recomendado: --velaris-brand-magic.",
            self.evidence(),
        )
        self.assertEqual(validation.status, "fallback")
        self.assertEqual(validation.violation_type, "invented_token")

    def test_deterministic_fallback_uses_retrieved_token(self) -> None:
        fallback = deterministic_token_response(self.evidence())
        self.assertIn("--velaris-color-primary", fallback)
        self.assertIn("não confiança da resposta", fallback)


if __name__ == "__main__":
    unittest.main()
