"""Trusted external references for UI patterns not in the Velaris catalog."""

from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache


@dataclass(frozen=True)
class ExternalReferenceEntry:
    reference_id: str
    label: str
    url: str
    source_type: str
    topic: str
    aliases: tuple[str, ...]
    trusted: bool = True
    last_verified_at: str | None = None


EXTERNAL_REFERENCE_REGISTRY: dict[str, ExternalReferenceEntry] = {
    "material-navigation-drawer": ExternalReferenceEntry(
        reference_id="material-navigation-drawer",
        label="Material Design: Navigation drawer",
        url="https://m3.material.io/components/navigation-drawer/overview",
        source_type="official_docs",
        topic="side-drawer",
        aliases=("navigation drawer", "side drawer", "drawer lateral"),
        last_verified_at="2026-06-01",
    ),
    "material-combobox": ExternalReferenceEntry(
        reference_id="material-combobox",
        label="Material Design: Menus and combobox",
        url="https://m3.material.io/components/menus/overview",
        source_type="official_docs",
        topic="combobox",
        aliases=("combobox", "combo box", "autocomplete"),
        last_verified_at="2026-06-01",
    ),
    "wai-aria-combobox": ExternalReferenceEntry(
        reference_id="wai-aria-combobox",
        label="WAI-ARIA: Combobox Pattern",
        url="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/",
        source_type="official_docs",
        topic="combobox",
        aliases=("combobox accessibility", "combo box accessibility"),
        last_verified_at="2026-06-01",
    ),
    "material-date-range": ExternalReferenceEntry(
        reference_id="material-date-range",
        label="Material Design: Date pickers",
        url="https://m3.material.io/components/date-pickers/overview",
        source_type="official_docs",
        topic="date-range-picker",
        aliases=("date range picker", "date range", "intervalo de datas"),
        last_verified_at="2026-06-01",
    ),
    "carbon-breadcrumb": ExternalReferenceEntry(
        reference_id="carbon-breadcrumb",
        label="Carbon Design System: Breadcrumb",
        url="https://carbondesignsystem.com/components/breadcrumb/usage",
        source_type="official_docs",
        topic="breadcrumb",
        aliases=("breadcrumb", "breadcrumbs", "migalhas de pao", "migalhas de pão"),
        last_verified_at="2026-06-01",
    ),
    "material-stepper": ExternalReferenceEntry(
        reference_id="material-stepper",
        label="Material Design: Steppers",
        url="https://m2.material.io/components/steppers",
        source_type="official_docs",
        topic="stepper",
        aliases=("stepper", "steppers", "wizard steps", "passo a passo"),
        last_verified_at="2026-06-01",
    ),
    "carbon-side-panel": ExternalReferenceEntry(
        reference_id="carbon-side-panel",
        label="Carbon Design System: Side panel",
        url="https://carbondesignsystem.com/patterns/side-panel-pattern",
        source_type="official_docs",
        topic="side-drawer",
        aliases=("side panel", "painel lateral", "lateral panel"),
        last_verified_at="2026-06-01",
    ),
}


@lru_cache(maxsize=1)
def external_reference_index() -> list[ExternalReferenceEntry]:
    return list(EXTERNAL_REFERENCE_REGISTRY.values())


def references_for_topic(topic: str) -> list[ExternalReferenceEntry]:
    return [
        entry
        for entry in external_reference_index()
        if entry.topic == topic and entry.trusted
    ]


def reference_by_id(reference_id: str) -> ExternalReferenceEntry | None:
    return EXTERNAL_REFERENCE_REGISTRY.get(reference_id)


def is_trusted_external_url(url: str) -> bool:
    return any(entry.url == url and entry.trusted for entry in external_reference_index())
