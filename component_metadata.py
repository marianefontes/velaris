from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator


ROOT = Path(__file__).resolve().parent
DEFAULT_CATALOG_PATH = ROOT / "data" / "component-metadata.json"

ComponentStatus = Literal["draft", "experimental", "stable", "deprecated", "legacy"]
ComponentSection = Literal[
    "structure",
    "action",
    "input",
    "feedback",
    "navigation",
    "content",
    "layout",
    "overlay",
    "data_display",
]


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class LocalizedText(StrictModel):
    pt: str = Field(min_length=1)
    en: str | None = None


class LocalizedRule(StrictModel):
    id: str = Field(min_length=1)
    text: LocalizedText


class NamedItem(StrictModel):
    id: str = Field(min_length=1)
    label: LocalizedText


class IntentItem(NamedItem):
    description: LocalizedText | None
    example: LocalizedText | None


class AriaRule(StrictModel):
    id: str = Field(min_length=1)
    attribute: str = Field(min_length=1)
    value: str | None
    text: LocalizedText


class ExampleItem(StrictModel):
    id: str = Field(min_length=1)
    title: LocalizedText | None
    text: LocalizedText


AccessibilityCriterionIcon = Literal["keyboard", "quality", "semantics"]
AccessibilityAudience = Literal["designer", "developer", "product-designer", "qa"]
AccessibilitySeverity = Literal["essential", "recommended"]


class AccessibilityItem(StrictModel):
    id: str = Field(min_length=1)
    title: LocalizedText
    description: LocalizedText
    icon: AccessibilityCriterionIcon = "quality"
    applies_to: list[AccessibilityAudience] | None = None
    severity: AccessibilitySeverity = "essential"


class AccessibilityMetadata(StrictModel):
    summary: LocalizedText | None
    keyboard: list[LocalizedRule] | None
    aria: list[AriaRule] | None
    items: list[AccessibilityItem] | None = None


class ComponentAboutFeature(StrictModel):
    icon: str = Field(min_length=1)
    title: LocalizedText
    description: LocalizedText


class ComponentMetadata(StrictModel):
    component_id: str = Field(min_length=1)
    name: str = Field(min_length=1)
    status: ComponentStatus
    section: ComponentSection
    description: LocalizedText | None
    about: LocalizedText
    about_features: list[ComponentAboutFeature] = Field(min_length=3, max_length=4)
    common_uses: list[LocalizedText] = Field(min_length=4, max_length=6)
    logic: LocalizedText | None
    structure: LocalizedText | None
    intent: IntentItem | None
    intents: list[IntentItem] | None
    variants: list[NamedItem] | None
    states: list[NamedItem] | None
    do: list[LocalizedRule] | None
    dont: list[LocalizedRule] | None
    when_to_use: list[LocalizedRule] | None
    when_not_to_use: list[LocalizedRule] | None
    accessibility: AccessibilityMetadata | None
    edge_cases: list[LocalizedRule] | None
    content_guidelines: list[LocalizedRule] | None
    governance_notes: list[LocalizedRule] | None
    related_components: list[str] | None
    examples: list[ExampleItem] | None
    anti_patterns: list[LocalizedRule] | None
    trade_offs: LocalizedText | None
    rag_relation: LocalizedText | None
    aetheris_insight: LocalizedText | None
    provenance: dict[str, list[str]]

    @model_validator(mode="after")
    def validate_local_ids_and_provenance(self) -> "ComponentMetadata":
        local_ids: list[str] = []
        for items in (
            self.intents,
            self.variants,
            self.states,
            self.do,
            self.dont,
            self.when_to_use,
            self.when_not_to_use,
            self.edge_cases,
            self.content_guidelines,
            self.governance_notes,
            self.examples,
            self.anti_patterns,
            self.accessibility.keyboard if self.accessibility else None,
            self.accessibility.aria if self.accessibility else None,
            self.accessibility.items if self.accessibility else None,
        ):
            if items is not None:
                local_ids.extend(item.id for item in items)
        if len(local_ids) != len(set(local_ids)):
            raise ValueError(f"Duplicate item id in component {self.component_id}")
        if any(not sources for sources in self.provenance.values()):
            raise ValueError(f"Empty provenance source list in {self.component_id}")
        return self


class ComponentCatalog(StrictModel):
    schema_version: Literal["1.0.0"]
    components: list[ComponentMetadata]

    @model_validator(mode="after")
    def validate_catalog(self) -> "ComponentCatalog":
        component_ids = [component.component_id for component in self.components]
        if len(component_ids) != len(set(component_ids)):
            raise ValueError("Duplicate component_id")

        all_item_ids: list[str] = []
        for component in self.components:
            for items in (
                component.do,
                component.dont,
                component.when_to_use,
                component.when_not_to_use,
                component.edge_cases,
                component.content_guidelines,
                component.governance_notes,
                component.examples,
                component.anti_patterns,
                component.accessibility.keyboard if component.accessibility else None,
                component.accessibility.aria if component.accessibility else None,
            ):
                if items is not None:
                    all_item_ids.extend(item.id for item in items)
            for related_id in component.related_components or []:
                if related_id not in component_ids:
                    raise ValueError(
                        f"Unknown related component {related_id} in {component.component_id}"
                    )
        if len(all_item_ids) != len(set(all_item_ids)):
            raise ValueError("Rule, intent, or example IDs must be globally unique")
        return self


def load_component_catalog(path: Path = DEFAULT_CATALOG_PATH) -> ComponentCatalog:
    return ComponentCatalog.model_validate_json(path.read_text(encoding="utf-8"))


@lru_cache(maxsize=1)
def component_catalog() -> ComponentCatalog:
    return load_component_catalog()


@lru_cache(maxsize=1)
def component_registry() -> dict[str, ComponentMetadata]:
    return {
        component.component_id: component
        for component in component_catalog().components
    }


def component_metadata(component_id: str) -> ComponentMetadata | None:
    return component_registry().get(component_id)


def localized_text(value: LocalizedText | None, locale: str = "pt") -> str:
    if value is None:
        return ""
    if locale.startswith("en") and value.en:
        return value.en
    return value.pt


def localized_rules(
    rules: list[LocalizedRule] | None,
    locale: str = "pt",
) -> list[str] | None:
    if rules is None:
        return None
    return [localized_text(rule.text, locale) for rule in rules]


def component_document_text(
    component: ComponentMetadata,
    locale: str = "pt",
) -> str:
    fields: list[tuple[str, str]] = [
        ("Name", component.name),
        ("Status", component.status),
        ("Section", component.section),
        ("Description", localized_text(component.description, locale)),
        ("About", localized_text(component.about, locale)),
        (
            "About Features",
            "; ".join(
                (
                    f"{localized_text(item.title, locale)}: "
                    f"{localized_text(item.description, locale)}"
                )
                for item in component.about_features
            ),
        ),
        (
            "Common Uses",
            "; ".join(
                localized_text(item, locale)
                for item in component.common_uses
            ),
        ),
        ("Logic", localized_text(component.logic, locale)),
        ("Structure", localized_text(component.structure, locale)),
        (
            "Intent",
            localized_text(component.intent.label, locale) if component.intent else "",
        ),
        (
            "Intents",
            "; ".join(
                localized_text(intent.label, locale)
                for intent in component.intents or []
            ),
        ),
        (
            "Variants",
            "; ".join(
                localized_text(variant.label, locale)
                for variant in component.variants or []
            ),
        ),
        (
            "States",
            "; ".join(
                localized_text(state.label, locale)
                for state in component.states or []
            ),
        ),
        ("Do", "; ".join(localized_rules(component.do, locale) or [])),
        ("Don't", "; ".join(localized_rules(component.dont, locale) or [])),
        (
            "When To Use",
            "; ".join(localized_rules(component.when_to_use, locale) or []),
        ),
        (
            "When Not To Use",
            "; ".join(localized_rules(component.when_not_to_use, locale) or []),
        ),
        (
            "Accessibility",
            localized_text(
                component.accessibility.summary if component.accessibility else None,
                locale,
            ),
        ),
        (
            "Accessibility Items",
            "; ".join(
                (
                    f"{localized_text(item.title, locale)}: "
                    f"{localized_text(item.description, locale)}"
                )
                for item in (
                    component.accessibility.items
                    if component.accessibility
                    and component.accessibility.items is not None
                    else []
                )
            ),
        ),
        (
            "Keyboard",
            "; ".join(
                localized_rules(
                    component.accessibility.keyboard
                    if component.accessibility else None,
                    locale,
                ) or []
            ),
        ),
        (
            "ARIA",
            "; ".join(
                localized_text(rule.text, locale)
                for rule in (
                    component.accessibility.aria
                    if component.accessibility
                    and component.accessibility.aria is not None
                    else []
                )
            ),
        ),
        (
            "Edge Cases",
            "; ".join(localized_rules(component.edge_cases, locale) or []),
        ),
        (
            "Content Guidelines",
            "; ".join(localized_rules(component.content_guidelines, locale) or []),
        ),
        (
            "Governance Notes",
            "; ".join(localized_rules(component.governance_notes, locale) or []),
        ),
        (
            "Related Components",
            "; ".join(component.related_components or []),
        ),
        (
            "Examples",
            "; ".join(
                localized_text(example.text, locale)
                for example in component.examples or []
            ),
        ),
        (
            "Anti Patterns",
            "; ".join(localized_rules(component.anti_patterns, locale) or []),
        ),
        ("Trade Offs", localized_text(component.trade_offs, locale)),
        ("RAG Relation", localized_text(component.rag_relation, locale)),
        ("Aetheris Insight", localized_text(component.aetheris_insight, locale)),
    ]
    return " | ".join(f"{label}: {value}" for label, value in fields if value)


def component_to_json(component: ComponentMetadata) -> dict:
    return json.loads(component.model_dump_json())
