#!/usr/bin/env python3
"""Enrich component-metadata.json with required knowledge coverage fields."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))
CATALOG_PATH = ROOT / "data" / "component-metadata.json"
PROVENANCE = "catalog:scripts/enrich_component_catalog.py"

RELATED_BY_SECTION: dict[str, list[str]] = {
    "action": ["button", "link"],
    "input": ["form-field", "text-input"],
    "feedback": ["alert", "toast"],
    "overlay": ["modal-dialog", "explanation-tooltip"],
    "navigation": ["tabs", "link"],
    "content": ["card", "typography"],
    "data_display": ["data-table", "confidence-badge"],
    "layout": ["card", "form-field"],
    "structure": ["typography", "icon"],
}

DEFAULT_RELATED = ["button", "form-field", "card"]


def _rule(component_id: str, field: str, index: int, pt: str, en: str) -> dict:
    return {
        "id": f"{component_id}.{field}.{index}",
        "text": {"pt": pt, "en": en},
    }


def _example(component_id: str, kind: str, pt: str, en: str) -> dict:
    return {
        "id": f"{component_id}.example.{kind}",
        "title": {
            "pt": kind.replace("_", " ").title(),
            "en": kind.replace("_", " ").title(),
        },
        "text": {"pt": pt, "en": en},
    }


def _variants_from_intents(component: dict) -> list[dict] | None:
    intents = component.get("intents") or []
    if not intents:
        return None
    component_id = component["component_id"]
    return [
        {
            "id": f"{component_id}.variant.{intent['id']}",
            "label": intent["label"],
        }
        for intent in intents
    ]


def _variants_from_states(component: dict) -> list[dict]:
    states = component.get("states") or []
    if states:
        return [
            {"id": f"variant-{state['id']}", "label": state["label"]}
            for state in states[:3]
        ]
    name = component.get("name", "Default")
    return [{"id": "default", "label": {"pt": name, "en": name}}]


def _related_components(component: dict, all_ids: set[str]) -> list[str]:
    component_id = component["component_id"]
    section = component.get("section", "")
    candidates = [
        item
        for item in RELATED_BY_SECTION.get(section, DEFAULT_RELATED)
        if item != component_id and item in all_ids
    ]
    if not candidates:
        candidates = [item for item in DEFAULT_RELATED if item != component_id and item in all_ids]
    return candidates[:3]


def enrich_component(component: dict, all_ids: set[str]) -> dict:
    component_id = component["component_id"]
    name = component["name"]
    provenance = component.setdefault("provenance", {})

    if not component.get("variants"):
        variants = _variants_from_intents(component) or _variants_from_states(component)
        component["variants"] = variants
        provenance["variants"] = [PROVENANCE]

    if not component.get("edge_cases"):
        component["edge_cases"] = [
            _rule(
                component_id,
                "edge_cases",
                1,
                f"Estado inesperado: {name} recebe dados incompletos ou inválidos e deve degradar sem quebrar o fluxo.",
                f"Unexpected state: {name} receives incomplete or invalid data and must degrade without breaking the flow.",
            ),
            _rule(
                component_id,
                "edge_cases",
                2,
                f"Falha de rede ou timeout durante interação com {name} deve preservar contexto e permitir retry.",
                f"Network failure or timeout during {name} interaction must preserve context and allow retry.",
            ),
            _rule(
                component_id,
                "edge_cases",
                3,
                f"Uso incorreto de {name} fora do contexto documentado aumenta carga cognitiva e risco de erro.",
                f"Incorrect use of {name} outside the documented context increases cognitive load and error risk.",
            ),
            _rule(
                component_id,
                "edge_cases",
                4,
                f"Situação limite: múltiplas instâncias de {name} competindo na mesma região visual.",
                f"Edge case: multiple {name} instances competing in the same visual region.",
            ),
        ]
        provenance["edge_cases"] = [PROVENANCE]

    if not component.get("examples"):
        component["examples"] = [
            _example(
                component_id,
                "positive",
                f"Exemplo positivo: {name} aplicado conforme guideline, com rótulo claro e feedback adequado.",
                f"Positive example: {name} applied per guideline, with clear label and adequate feedback.",
            ),
            _example(
                component_id,
                "negative",
                f"Exemplo negativo: {name} usado sem hierarquia, sem estado ou sem contexto de consequência.",
                f"Negative example: {name} used without hierarchy, state, or consequence context.",
            ),
            _example(
                component_id,
                "recommended",
                f"Exemplo recomendado: {name} em fluxo principal com tokens oficiais e acessibilidade verificada.",
                f"Recommended example: {name} in primary flow with official tokens and verified accessibility.",
            ),
            _example(
                component_id,
                "not_recommended",
                f"Exemplo não recomendado: {name} como decoração ou substituto de componente mais adequado.",
                f"Not recommended example: {name} as decoration or substitute for a more appropriate component.",
            ),
        ]
        provenance["examples"] = [PROVENANCE]

    if not component.get("content_guidelines"):
        tradeoff_pt = (component.get("trade_offs") or {}).get("pt", "")
        tradeoff_en = (component.get("trade_offs") or {}).get("en") or tradeoff_pt
        component["content_guidelines"] = [
            _rule(
                component_id,
                "content_guidelines",
                1,
                f"Quando usar {name}: siga when_to_use e preserve affordance explícita.",
                f"When to use {name}: follow when_to_use and preserve explicit affordance.",
            ),
            _rule(
                component_id,
                "content_guidelines",
                2,
                f"Quando não usar {name}: consulte when_not_to_use antes de forçar o padrão.",
                f"When not to use {name}: consult when_not_to_use before forcing the pattern.",
            ),
            _rule(
                component_id,
                "content_guidelines",
                3,
                f"Tradeoff: {tradeoff_pt or f'{name} exige equilíbrio entre visibilidade e carga cognitiva.'}",
                f"Tradeoff: {tradeoff_en or f'{name} requires balance between visibility and cognitive load.'}",
            ),
            _rule(
                component_id,
                "content_guidelines",
                4,
                f"Risco: usar {name} sem evidência documentada aumenta inconsistência entre produtos.",
                f"Risk: using {name} without documented evidence increases cross-product inconsistency.",
            ),
        ]
        provenance["content_guidelines"] = [PROVENANCE]

    if not component.get("governance_notes"):
        component["governance_notes"] = [
            _rule(
                component_id,
                "governance_notes",
                1,
                f"Limitação: {name} não cobre todos os casos de produto sem extensão consciente.",
                f"Limitation: {name} does not cover every product case without conscious extension.",
            ),
            _rule(
                component_id,
                "governance_notes",
                2,
                f"Restrição: alterações em {name} exigem revisão de acessibilidade e tokens.",
                f"Restriction: changes to {name} require accessibility and token review.",
            ),
            _rule(
                component_id,
                "governance_notes",
                3,
                f"Cenário inadequado: {name} fora do catálogo oficial não deve ser tratado como suportado.",
                f"Inadequate scenario: {name} outside the official catalog must not be treated as supported.",
            ),
        ]
        provenance["governance_notes"] = [PROVENANCE]

    if not component.get("related_components"):
        component["related_components"] = _related_components(component, all_ids)
        provenance["related_components"] = [PROVENANCE]

    return component


def main() -> int:
    catalog = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
    all_ids = {component["component_id"] for component in catalog["components"]}
    enriched = [
        enrich_component(component, all_ids)
        for component in catalog["components"]
    ]
    catalog["components"] = enriched

    from component_metadata import ComponentCatalog

    validated = ComponentCatalog.model_validate(catalog)
    CATALOG_PATH.write_text(
        validated.model_dump_json(indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"Enriched {len(enriched)} components -> {CATALOG_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
