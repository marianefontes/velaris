#!/usr/bin/env python3
"""
Enrich do/dont entries in component-metadata.json:
  1. Update specific descriptions for Button, Toggle/Switch, Checkbox, Select
  2. Add do_dont_source_basis provenance entry for all components
"""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CATALOG_PATH = ROOT / "data" / "component-metadata.json"

# ── 1. Description improvements ──────────────────────────────────────────────

DESCRIPTION_PATCHES: dict[str, dict[str, dict]] = {
    "button": {
        "do": {
            "button.do.6": {
                "pt": "Mantenha o rótulo textual, curto e orientado à ação; preserve indicador de foco visível para quem navega por teclado ou tecnologia assistiva.",
                "en": "Keep the button label short and action-oriented; preserve a visible focus indicator for keyboard and assistive technology users.",
            }
        },
        "dont": {
            "button.dont.4": {
                "pt": "Não use intents positive ou negative como decoração visual; a aparência deve corresponder à consequência real, e negative exige confirmação quando a ação for difícil de reverter.",
                "en": "Do not use positive or negative intents for visual decoration; appearance must match the real consequence, and negative requires confirmation when the action is hard to reverse.",
            }
        },
    },
    "toggle-switch": {
        "do": {
            "toggle-switch.do.1": {
                "pt": "Use Switch para configurações binárias reversíveis que entram em vigor imediatamente, sem exigir confirmação posterior.",
                "en": "Use Switch for reversible binary settings that take effect immediately, without requiring subsequent confirmation.",
            }
        },
        "dont": {},
    },
    "checkbox": {
        "do": {
            "checkbox.do.2": {
                "pt": "Associe o rótulo ao controle via htmlFor; inclua-o na área clicável e preserve um alvo mínimo de 44px para conforto em toque.",
                "en": "Associate the label with the control via htmlFor; include it in the clickable area and preserve a minimum 44px target for touch comfort.",
            }
        },
        "dont": {},
    },
    "select-dropdown": {
        "do": {},
        "dont": {
            "select-dropdown.dont.4": {
                "pt": "Não esconda o motivo de uma opção indisponível nem omita o estado de erro de validação que orienta a correção.",
                "en": "Do not hide the reason an option is unavailable, nor omit the validation error state that guides correction.",
            }
        },
    },
}

# ── 2. Source basis per component ─────────────────────────────────────────────
# "concept:" prefix signals a conceptual reference, not a formal citation.

SOURCE_BASIS: dict[str, list[str]] = {
    "button":              ["concept:Material-Design", "concept:GOV.UK-Design-System", "concept:ARIA-Authoring-Practices-4.1", "concept:WCAG-2.1"],
    "toggle-switch":       ["concept:Material-Design", "concept:Carbon-Design-System", "concept:Apple-HIG", "concept:ARIA-Authoring-Practices-4.1"],
    "checkbox":            ["concept:ARIA-Authoring-Practices-4.1", "concept:WCAG-2.1", "concept:GOV.UK-Design-System", "concept:Carbon-Design-System"],
    "radio-button":        ["concept:ARIA-Authoring-Practices-4.1", "concept:WCAG-2.1", "concept:GOV.UK-Design-System", "concept:Material-Design"],
    "selectable-chip":     ["concept:Material-Design", "concept:Carbon-Design-System", "concept:ARIA-Authoring-Practices-4.1"],
    "text-input":          ["concept:ARIA-Authoring-Practices-4.1", "concept:WCAG-2.1", "concept:GOV.UK-Design-System", "concept:Carbon-Design-System"],
    "text-area":           ["concept:ARIA-Authoring-Practices-4.1", "concept:WCAG-2.1", "concept:GOV.UK-Design-System"],
    "select-dropdown":     ["concept:ARIA-Authoring-Practices-4.1", "concept:WCAG-2.1", "concept:Material-Design", "concept:Carbon-Design-System"],
    "date-picker":         ["concept:ARIA-Authoring-Practices-4.1", "concept:WCAG-2.1", "concept:Material-Design"],
    "form-field":          ["concept:ARIA-Authoring-Practices-4.1", "concept:WCAG-2.1", "concept:GOV.UK-Design-System", "concept:Material-Design"],
    "link":                ["concept:WCAG-2.1", "concept:ARIA-Authoring-Practices-4.1", "concept:GOV.UK-Design-System"],
    "tabs":                ["concept:ARIA-Authoring-Practices-4.1", "concept:WCAG-2.1", "concept:Material-Design"],
    "card":                ["concept:Material-Design", "concept:Atlassian-Design-System"],
    "modal-dialog":        ["concept:ARIA-Authoring-Practices-4.1", "concept:WCAG-2.1", "concept:Material-Design", "concept:Carbon-Design-System"],
    "data-table":          ["concept:ARIA-Authoring-Practices-4.1", "concept:WCAG-2.1", "concept:Carbon-Design-System"],
    "alert":               ["concept:ARIA-Authoring-Practices-4.1", "concept:WCAG-2.1", "concept:Material-Design"],
    "toast":               ["concept:ARIA-Authoring-Practices-4.1", "concept:WCAG-2.1", "concept:Material-Design", "concept:Carbon-Design-System"],
    "skeleton-loader":     ["concept:ARIA-Authoring-Practices-4.1", "concept:Material-Design"],
    "explanation-tooltip": ["concept:ARIA-Authoring-Practices-4.1", "concept:WCAG-2.1", "concept:Material-Design"],
    "confidence-badge":    ["concept:Nielsen-Norman-Group", "concept:XAI-domain-specific"],
    "command-palette":     ["concept:Material-Design", "concept:ARIA-Authoring-Practices-4.1"],
    "source-attribution":  ["concept:Nielsen-Norman-Group", "concept:ARIA-Authoring-Practices-4.1"],
    "audit-panel":         ["concept:Nielsen-Norman-Group", "concept:governance-domain-specific"],
    "typography":          ["concept:WCAG-2.1", "concept:Material-Design", "concept:Carbon-Design-System"],
    "icon":                ["concept:WCAG-2.1", "concept:Material-Design", "concept:ARIA-Authoring-Practices-4.1"],
}


def apply_patches(data: dict) -> int:
    changes = 0
    for component in data["components"]:
        cid = component["component_id"]

        # Apply description patches
        if cid in DESCRIPTION_PATCHES:
            patches = DESCRIPTION_PATCHES[cid]
            for rule in component.get("do") or []:
                new_text = patches["do"].get(rule["id"])
                if new_text:
                    rule["text"] = new_text
                    print(f"  Updated do [{rule['id']}]")
                    changes += 1
            for rule in component.get("dont") or []:
                new_text = patches["dont"].get(rule["id"])
                if new_text:
                    rule["text"] = new_text
                    print(f"  Updated dont [{rule['id']}]")
                    changes += 1

        # Add source basis provenance if not already present
        if cid in SOURCE_BASIS:
            key = "do_dont_source_basis"
            if key not in component["provenance"]:
                component["provenance"][key] = SOURCE_BASIS[cid]
                print(f"  Added provenance[do_dont_source_basis] for {cid}")
                changes += 1

    return changes


def main():
    data = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
    print(f"Loaded catalog: {len(data['components'])} components")

    n = apply_patches(data)

    CATALOG_PATH.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"\nDone. {n} changes applied.")


if __name__ == "__main__":
    main()
