"""Behavior tests for scope boundaries and cross-language aliases.

These lock the consultant-style handling of missing components, adversarial
invented names and out-of-scope questions, in Portuguese, English and Spanish.
Abraxos must never invent a component and never collapse a known gap into a flat
"not found" reply. Assertions check behavior, not rigid response text.
"""

from __future__ import annotations

import unittest

from agent.understanding import analyze_query

_UNSUPPORTED_INTENTS = {
    "unsupported_entity_lookup",
    "unsupported_entity_recommendation",
    "unknown_entity_lookup",
}


class MissingComponentTests(unittest.TestCase):
    def test_known_gaps_route_to_unsupported_not_out_of_scope(self) -> None:
        cases = {
            "tem combobox?": "Combobox",
            "tem breadcrumb?": "Breadcrumb",
            "tem stepper?": "Stepper",
            "tem popover?": "Popover",
            "Do you have a Drawer component?": "Drawer",
        }
        for query, label in cases.items():
            with self.subTest(query=query):
                understanding = analyze_query(query)
                self.assertIn(understanding.user_intent, _UNSUPPORTED_INTENTS)
                self.assertNotEqual(understanding.user_intent, "out_of_scope")
                resolution = understanding.catalog_entity_resolution
                self.assertIsNotNone(resolution)
                assert resolution is not None
                self.assertEqual(resolution.entity_status, "unknown")
                self.assertEqual(resolution.entity_label, label)

    def test_missing_components_are_not_invented_as_real(self) -> None:
        # An absent entity must not be resolved as a supported catalog component.
        for query in ("tem combobox?", "Do you have a Drawer component?"):
            with self.subTest(query=query):
                understanding = analyze_query(query)
                self.assertEqual(understanding.entities.components, [])


class AdversarialEntityTests(unittest.TestCase):
    def test_invented_names_are_treated_as_unsupported(self) -> None:
        cases = {
            "How do I configure DragonButton?": "DragonButton",
            "tem MagicPopover?": "MagicPopover",
            "tem MegaWizard?": "MegaWizard",
        }
        for query, label in cases.items():
            with self.subTest(query=query):
                understanding = analyze_query(query)
                self.assertIn(understanding.user_intent, _UNSUPPORTED_INTENTS)
                resolution = understanding.catalog_entity_resolution
                self.assertIsNotNone(resolution)
                assert resolution is not None
                self.assertEqual(resolution.entity_label, label)
                self.assertEqual(resolution.entity_status, "unknown")


class SpanishMissingAliasTests(unittest.TestCase):
    def test_spanish_aliases_resolve_known_gaps(self) -> None:
        cases = {
            "¿Tienes un cuadro combinado?": "Combobox",
            "¿Tienes migas de pan?": "Breadcrumb",
            "¿Tienes una ventana emergente?": "Popover",
            "Necesito un cajón lateral": "Side Drawer",
        }
        for query, label in cases.items():
            with self.subTest(query=query):
                understanding = analyze_query(query)
                resolution = understanding.catalog_entity_resolution
                self.assertIsNotNone(resolution)
                assert resolution is not None
                self.assertEqual(resolution.entity_label, label)
                self.assertEqual(resolution.entity_status, "unknown")


class OutOfScopeTests(unittest.TestCase):
    def test_non_design_system_questions_are_out_of_scope(self) -> None:
        cases = (
            "What is the weather today?",
            "¿Cuál es la política fiscal en Portugal?",
            "Qual a cotação do dólar?",
        )
        for query in cases:
            with self.subTest(query=query):
                self.assertEqual(analyze_query(query).user_intent, "out_of_scope")


class CanonicalStillResolvesTests(unittest.TestCase):
    def test_aliases_did_not_break_canonical_components(self) -> None:
        # Adding Spanish and French aliases must not regress canonical lookups.
        cases = {
            "tem button?": "Button",
            "tem modal?": "Modal/Dialog",
            "tem tooltip?": "Explanation Bubble / Tooltip",
        }
        for query, expected in cases.items():
            with self.subTest(query=query):
                understanding = analyze_query(query)
                resolution = understanding.catalog_entity_resolution
                self.assertIsNotNone(resolution)
                assert resolution is not None
                self.assertEqual(resolution.entity_status, "supported")
                self.assertEqual(resolution.entity_label, expected)


if __name__ == "__main__":
    unittest.main()
