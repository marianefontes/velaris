#!/usr/bin/env python3
"""Audit semantic alias coverage for Velaris entities."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from agent.entity_alias_registry import COMPONENT_ALIASES, entity_alias_registry
from agent.entity_resolution import resolve_exact_entity_matches
from agent.understanding import normalize_query
from component_metadata import component_registry


CANONICAL_PROBE_PHRASES: dict[str, tuple[str, ...]] = {
    "button": (
        "button",
        "buttons",
        "botão",
        "botao",
        "componente botão",
        "primary button",
        "action button",
        "botón",
        "bouton",
    ),
    "modal-dialog": (
        "modal",
        "dialog",
        "modal dialog",
        "janela modal",
        "ventana modal",
    ),
    "checkbox": ("checkbox", "check box", "casilla de verificación"),
    "select-dropdown": ("select", "dropdown", "lista desplegable"),
    "card": ("card", "cartão", "tarjeta"),
    "tabs": ("tabs", "abas", "pestañas"),
}


def audit_components() -> dict:
    registry = component_registry()
    covered: list[dict] = []
    gaps: list[dict] = []

    for component_id, component in registry.items():
        aliases = COMPONENT_ALIASES.get(component_id, ())
        probes = CANONICAL_PROBE_PHRASES.get(component_id, (component.name.lower(),))
        failed_probes: list[str] = []
        for probe in probes:
            match = resolve_exact_entity_matches(normalize_query(probe))
            if not any(m.component_id == component_id for m in match):
                failed_probes.append(probe)
        entry = {
            "component_id": component_id,
            "name": component.name,
            "alias_count": len(aliases),
            "failed_probes": failed_probes,
        }
        if failed_probes:
            gaps.append(entry)
        else:
            covered.append(entry)

    return {
        "total_components": len(registry),
        "fully_covered": len(covered),
        "with_gaps": len(gaps),
        "covered": covered,
        "gaps": gaps,
        "alias_entries": [
            {
                "component_id": entry.component_id,
                "name": entry.name,
                "alias_count": len(entry.aliases),
            }
            for entry in entity_alias_registry().values()
        ],
    }


def main() -> None:
    report = audit_components()
    out = ROOT / "docs" / "_audits" / "SEMANTIC_COVERAGE_REPORT.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Components: {report['total_components']}")
    print(f"Fully covered: {report['fully_covered']}")
    print(f"With gaps: {report['with_gaps']}")
    if report["gaps"]:
        print("Gaps:")
        for gap in report["gaps"]:
            print(f"  - {gap['name']}: {gap['failed_probes']}")
    print(f"Report written to {out}")


if __name__ == "__main__":
    main()
