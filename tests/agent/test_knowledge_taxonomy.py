from __future__ import annotations

import unittest

from agent.entity_resolution import resolve_exact_entity_matches
from agent.knowledge_taxonomy import classify_knowledge_state, knowledge_state_payload
from agent.operational_responses import entity_lookup_response, is_simple_existence_query
from agent.understanding import analyze_query, normalize_query
from component_metadata import component_registry


class KnowledgeTaxonomyTests(unittest.TestCase):
    def test_button_lookup_is_canonical(self) -> None:
        understanding = analyze_query("tem Button?")
        state = classify_knowledge_state("tem Button?", understanding)
        self.assertEqual(state, "canonical")

    def test_drawer_is_not_in_catalog(self) -> None:
        understanding = analyze_query("vocês têm Drawer?")
        state = classify_knowledge_state("vocês têm Drawer?", understanding)
        self.assertIn(state, {"not_in_catalog", "needs_human_validation"})

    def test_payload_includes_policy(self) -> None:
        payload = knowledge_state_payload("not_in_catalog", english=True)
        self.assertEqual(payload["state"], "not_in_catalog")
        self.assertIn("not in the Velaris catalog", payload["response_policy"])


class SimpleExistenceLookupTests(unittest.TestCase):
    def test_detects_simple_existence(self) -> None:
        self.assertTrue(is_simple_existence_query("Existe Button?"))
        self.assertTrue(is_simple_existence_query("Do you have a Tooltip?"))
        self.assertFalse(is_simple_existence_query("Como implementar Button?"))

    def test_compact_entity_lookup_response(self) -> None:
        component = component_registry()["button"]
        response = entity_lookup_response(component, english=False, compact=True)
        self.assertIn("Sim.", response)
        self.assertIn("Button", response)
        self.assertNotIn("\n\n", response)

    def test_primary_button_alias_resolves(self) -> None:
        matches = resolve_exact_entity_matches(normalize_query("primary button"))
        self.assertTrue(matches)
        self.assertEqual(matches[0].component_id, "button")


if __name__ == "__main__":
    unittest.main()
