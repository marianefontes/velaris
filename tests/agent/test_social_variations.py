"""Tests for welcoming social response variations and rotation."""

from __future__ import annotations

import unittest

from agent.operational_responses import greeting_response, small_talk_response
from agent.social_variations import (
    GREETING_VARIATIONS,
    HELP_VARIATIONS,
    ONLINE_VARIATIONS,
    WELLBEING_VARIATIONS,
    pick_variation,
    resolve_portuguese_variant,
)


class SocialVariationTests(unittest.TestCase):
    def test_pick_variation_is_deterministic(self) -> None:
        pool = ("a", "b", "c")
        self.assertEqual(pick_variation(pool, seed="session:req"), pick_variation(pool, seed="session:req"))

    def test_pick_variation_rotates_with_seed(self) -> None:
        pool = tuple(f"option-{index}" for index in range(8))
        responses = {pick_variation(pool, seed=f"session:{index}") for index in range(16)}
        self.assertGreater(len(responses), 1)

    def test_portuguese_variant_detects_pt_pt_markers(self) -> None:
        self.assertEqual(
            resolve_portuguese_variant(language="pt-BR", query="ajudas-me?"),
            "pt-PT",
        )
        self.assertEqual(
            resolve_portuguese_variant(language="pt-BR", query="tudo bem?"),
            "pt-BR",
        )

    def test_greeting_variations_cover_locales(self) -> None:
        for locale in ("pt-BR", "pt-PT", "en"):
            self.assertGreaterEqual(len(GREETING_VARIATIONS[locale]), 4)

    def test_wellbeing_variations_match_guidelines(self) -> None:
        for locale in ("pt-BR", "pt-PT", "en"):
            pool = WELLBEING_VARIATIONS[locale]
            velaris_mentions = sum(1 for response in pool if "Velaris" in response)
            self.assertGreaterEqual(velaris_mentions, max(2, len(pool) // 2))
            for response in pool:
                self.assertNotIn("😀", response)

    def test_greeting_response_uses_pool(self) -> None:
        response = greeting_response(
            english=False,
            language="pt-BR",
            rotation_seed="fixed-session:fixed-request",
        )
        self.assertIn(response, GREETING_VARIATIONS["pt-BR"])

    def test_small_talk_wellbeing_pt_br(self) -> None:
        response = small_talk_response(
            "tudo bem?",
            english=False,
            language="pt-BR",
            rotation_seed="fixed-session:fixed-request",
        )
        self.assertIn(response, WELLBEING_VARIATIONS["pt-BR"])

    def test_small_talk_wellbeing_pt_pt(self) -> None:
        response = small_talk_response(
            "ajudas-me?",
            english=False,
            language="pt-BR",
            rotation_seed="fixed-session:fixed-request",
        )
        self.assertIn(response, HELP_VARIATIONS["pt-PT"])

    def test_small_talk_wellbeing_en(self) -> None:
        response = small_talk_response(
            "how are you?",
            english=True,
            language="en",
            rotation_seed="fixed-session:fixed-request",
        )
        self.assertIn(response, WELLBEING_VARIATIONS["en"])

    def test_small_talk_online_variants(self) -> None:
        response = small_talk_response(
            "estás online?",
            english=False,
            language="pt-BR",
            rotation_seed="fixed-session:fixed-request",
        )
        self.assertIn(response, ONLINE_VARIATIONS["pt-PT"])


if __name__ == "__main__":
    unittest.main()
