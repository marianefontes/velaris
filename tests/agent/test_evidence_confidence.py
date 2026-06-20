"""Tests for evidence confidence summaries."""

from __future__ import annotations

import unittest

from agent.evidence import build_component_selection
from agent.evidence_confidence import build_evidence_confidence, format_evidence_confidence
from agent.models import EvidenceItem
from component_metadata import component_registry


class EvidenceConfidenceTests(unittest.TestCase):
    def test_builds_items_for_recommended_component(self) -> None:
        component = component_registry()["button"]
        evidence = [
            EvidenceItem(
                title=component.name,
                source="catalog",
                page_type="component",
                excerpt="Button actions",
                component_id=component.component_id,
                status=component.status,
                section=component.section,
                similarity=0.9,
                weighted_score=0.9,
                component_metadata=component,
            )
        ]
        selection = build_component_selection(
            evidence,
            query="qual componente para ação principal?",
            profile="general",
        )
        items = build_evidence_confidence(selection, english=False)
        keys = {item.key for item in items}
        self.assertIn("contract", keys)
        self.assertIn("dos", keys)
        self.assertIn("donts", keys)
        self.assertIn("accessibility", keys)

    def test_format_uses_status_icons(self) -> None:
        items = build_evidence_confidence(None, english=False)
        text = format_evidence_confidence(items, english=False)
        self.assertIn("✗", text)
        self.assertIn("Evidências consideradas", text)


if __name__ == "__main__":
    unittest.main()
