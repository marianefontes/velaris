from __future__ import annotations

import json
import unittest
from pathlib import Path

from component_metadata import (
    DEFAULT_CATALOG_PATH,
    ComponentCatalog,
    component_document_text,
    load_component_catalog,
)


ROOT = Path(__file__).resolve().parents[1]
SNAPSHOT_PATH = ROOT / "tests" / "fixtures" / "component-metadata-legacy-snapshot.json"


class ComponentMetadataTests(unittest.TestCase):
    def test_catalog_validates_and_matches_legacy_ids(self) -> None:
        catalog = load_component_catalog()
        snapshot = json.loads(SNAPSHOT_PATH.read_text(encoding="utf-8"))
        canonical_ids = [component.component_id for component in catalog.components]
        self.assertEqual(canonical_ids, snapshot["frontend_component_ids"])
        self.assertEqual(canonical_ids, snapshot["rag_component_ids"])
        self.assertEqual(len(canonical_ids), snapshot["component_count"])

    def test_null_and_empty_list_have_distinct_meanings(self) -> None:
        # The schema must preserve the distinction between an undocumented
        # field (None) and a documented-but-empty field ([]). Assert it
        # structurally instead of pinning specific catalog rows, so catalog
        # documentation growth does not break the schema contract.
        payload = json.loads(DEFAULT_CATALOG_PATH.read_text(encoding="utf-8"))
        payload["components"][0]["edge_cases"] = None
        payload["components"][0]["examples"] = []
        parsed = ComponentCatalog.model_validate(payload)
        self.assertIsNone(parsed.components[0].edge_cases)
        self.assertEqual(parsed.components[0].examples, [])

    def test_rule_ids_are_stable_and_globally_unique(self) -> None:
        catalog = load_component_catalog()
        ids: list[str] = []
        for component in catalog.components:
            for rules in (
                component.do,
                component.dont,
                component.when_to_use,
                component.when_not_to_use,
            ):
                ids.extend(item.id for item in rules or [])
        self.assertEqual(len(ids), len(set(ids)))
        self.assertIn("modal-dialog.do.1", ids)
        self.assertIn("modal-dialog.when_not_to_use.1", ids)

    def test_invalid_status_is_rejected(self) -> None:
        payload = json.loads(DEFAULT_CATALOG_PATH.read_text(encoding="utf-8"))
        payload["components"][0]["status"] = "unknown"
        with self.assertRaises(ValueError):
            ComponentCatalog.model_validate(payload)

    def test_every_component_has_complete_operational_documentation(self) -> None:
        catalog = load_component_catalog()
        for component in catalog.components:
            self.assertEqual(len(component.do or []), 5, component.component_id)
            self.assertEqual(len(component.dont or []), 5, component.component_id)
            self.assertTrue(component.description, component.component_id)
            self.assertTrue(component.about, component.component_id)
            self.assertGreaterEqual(len(component.about_features), 3, component.component_id)
            self.assertLessEqual(len(component.about_features), 4, component.component_id)
            self.assertGreaterEqual(len(component.common_uses), 4, component.component_id)
            self.assertLessEqual(len(component.common_uses), 6, component.component_id)
            self.assertTrue(component.logic, component.component_id)
            self.assertTrue(component.states, component.component_id)
            self.assertTrue(component.intents, component.component_id)
            self.assertTrue(component.accessibility, component.component_id)
            self.assertTrue(component.accessibility.summary, component.component_id)
            self.assertTrue(component.accessibility.keyboard, component.component_id)
            self.assertTrue(component.accessibility.aria, component.component_id)
            self.assertTrue(component.rag_relation, component.component_id)

    def test_about_content_is_included_in_rag_document_text(self) -> None:
        catalog = load_component_catalog()
        button = next(
            component
            for component in catalog.components
            if component.component_id == "button"
        )
        document = component_document_text(button)
        self.assertIn("About:", document)
        self.assertIn("About Features:", document)
        self.assertIn("Common Uses:", document)
        self.assertIn("Envio de formulário", document)


if __name__ == "__main__":
    unittest.main()
