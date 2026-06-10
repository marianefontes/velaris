"""Structured navigation actions for deterministic Abraxos responses."""

from __future__ import annotations

from component_metadata import ComponentMetadata

from agent.models import NavigationAction, NavigationConfidence
from agent.perspective_registry import PerspectiveEntry, PerspectiveMatch, get_perspective_entry
from agent.route_map import RouteResolution

PAGE_DESTINATION_LABELS: dict[str, tuple[str, str]] = {
    "tokens": ("Foundations", "Foundations"),
    "components": ("Components", "Components"),
    "patterns": ("Foundations", "Foundations"),
    "decisions": ("Foundations", "Foundations"),
    "foundations": ("Foundations", "Foundations"),
    "guidelines": ("Foundations", "Foundations"),
    "accessibility": ("Foundations", "Foundations"),
    "reasoning": ("Reasoning", "Reasoning"),
    "oracle": ("Oracle", "Oracle"),
    "perspectives": ("Perspectives", "Perspectives"),
    "architecture": ("Architecture", "Architecture"),
    "evaluation": ("Evaluation", "Evaluation"),
}

NAVIGATION_ACTION_LABELS: dict[str, tuple[str, str]] = {
    "tokens": ("Abrir Tokens", "Open Tokens"),
    "components": ("Abrir Componentes", "Open Components"),
    "patterns": ("Abrir Patterns", "Open Patterns"),
    "decisions": ("Abrir Decisões", "Open Decisions"),
    "foundations": ("Abrir Foundations", "Open Foundations"),
    "guidelines": ("Abrir Diretrizes", "Open Guidelines"),
    "accessibility": ("Abrir Acessibilidade", "Open Accessibility"),
    "reasoning": ("Abrir Reasoning", "Open Reasoning"),
    "oracle": ("Abrir chat completo", "Open full chat"),
    "perspectives": ("Abrir Perspectivas", "Open Perspectives"),
    "architecture": ("Abrir Architecture", "Open Architecture"),
    "evaluation": ("Abrir Evaluation", "Open Evaluation"),
}

COMPONENT_SECTIONS = frozenset({
    "accessibility",
    "states",
    "guidelines",
    "about",
})


def page_destination_label(section_key: str, *, english: bool = False) -> str:
    labels = PAGE_DESTINATION_LABELS.get(section_key, ("Velaris", "Velaris"))
    return labels[1 if english else 0]


def component_href(component_id: str, section: str | None = None) -> str:
    href = f"/components?component={component_id}"
    if section and section in COMPONENT_SECTIONS:
        return f"{href}&section={section}"
    return href


def _is_internal_href(href: str) -> bool:
    return href.startswith("/") and not href.startswith("//")


def navigation_action_for_route(
    resolution: RouteResolution,
    *,
    english: bool = False,
) -> NavigationAction:
    label_key = resolution.section_key
    label_pair = NAVIGATION_ACTION_LABELS.get(
        label_key,
        (f"Abrir {resolution.label_pt}", f"Open {resolution.label_en}"),
    )
    target_type = "section" if "?" in resolution.route else "page"
    return NavigationAction(
        label=label_pair[1 if english else 0],
        href=resolution.route,
        target_type=target_type,
        source="route_map",
        confidence="exact",
        metadata={
            "section_key": resolution.section_key,
            "internal": _is_internal_href(resolution.route),
        },
    )


def navigation_action_for_component(
    component: ComponentMetadata,
    *,
    english: bool = False,
    verb: str = "open",
    section: str | None = None,
    confidence: NavigationConfidence = "exact",
) -> NavigationAction:
    if verb == "view":
        label = (
            f"Ver {component.name}"
            if not english
            else f"View {component.name}"
        )
    else:
        label = (
            f"Abrir {component.name}"
            if not english
            else f"Open {component.name}"
        )
    resolved_section = section if section in COMPONENT_SECTIONS else None
    return NavigationAction(
        label=label,
        href=component_href(component.component_id, resolved_section),
        target_type="component",
        source="catalog",
        confidence=confidence,  # type: ignore[arg-type]
        anchor=resolved_section,
        metadata={
            "component_id": component.component_id,
            "component_name": component.name,
            "internal": True,
        },
    )


def navigation_action_for_perspective(
    match: PerspectiveMatch,
    *,
    english: bool = False,
    prefer_profile_action: bool = True,
) -> tuple[NavigationAction, list[NavigationAction]]:
    entry = match.entry
    profile_label = (
        f"Use {entry.label_en} perspective"
        if english
        else f"Usar perspectiva {entry.label}"
    )
    open_label = (
        f"Open {entry.label_en} perspective"
        if english
        else f"Abrir perspectiva {entry.label}"
    )
    primary = NavigationAction(
        label=profile_label if prefer_profile_action else open_label,
        href=entry.route,
        target_type="perspective",
        source="perspective_registry",
        confidence=match.confidence,  # type: ignore[arg-type]
        metadata={
            "profileId": entry.profile_id,
            "action_type": "set_profile" if prefer_profile_action else "navigate",
            "internal": True,
        },
    )
    secondary: list[NavigationAction] = [
        NavigationAction(
            label=(
                "Open Perspectives overview"
                if english
                else "Abrir explicação das perspectivas"
            ),
            href="/perspectives",
            target_type="page",
            source="perspective_registry",
            confidence="exact",
            metadata={"internal": True},
        ),
    ]
    if entry.secondary_profile_id:
        secondary_entry = get_perspective_entry(entry.secondary_profile_id)
        if secondary_entry is not None and match.matched_alias in {
            "design",
            "designer",
            "perspectiva de design",
            "visao de design",
            "visão de design",
            "parte de design",
        }:
            secondary.insert(
                0,
                NavigationAction(
                    label=(
                        f"Open {secondary_entry.label_en} perspective"
                        if english
                        else f"Abrir perspectiva {secondary_entry.label}"
                    ),
                    href=secondary_entry.route,
                    target_type="perspective",
                    source="perspective_registry",
                    confidence="partial",
                    metadata={
                        "profileId": secondary_entry.profile_id,
                        "action_type": "set_profile",
                        "internal": True,
                    },
                ),
            )
    if prefer_profile_action:
        secondary.insert(
            0,
            NavigationAction(
                label=open_label,
                href=entry.route,
                target_type="perspective",
                source="perspective_registry",
                confidence=match.confidence,  # type: ignore[arg-type]
                metadata={
                    "profileId": entry.profile_id,
                    "action_type": "navigate",
                    "internal": True,
                },
            ),
        )
    return primary, secondary


def perspective_entry_action(
    entry: PerspectiveEntry,
    *,
    english: bool = False,
) -> NavigationAction:
    return NavigationAction(
        label=(
            f"Open {entry.label_en} perspective"
            if english
            else f"Abrir perspectiva {entry.label}"
        ),
        href=entry.route,
        target_type="perspective",
        source="perspective_registry",
        confidence="exact",
        metadata={
            "profileId": entry.profile_id,
            "action_type": "navigate",
            "internal": True,
        },
    )


def single_choice_navigation_actions(
    *,
    english: bool = False,
) -> tuple[NavigationAction, list[NavigationAction]]:
    primary = NavigationAction(
        label="Ver Radio Button" if not english else "View Radio Button",
        href=component_href("radio-button"),
        target_type="component",
        source="catalog",
        confidence="exact",
        metadata={"component_id": "radio-button", "internal": True},
    )
    secondary = [
        NavigationAction(
            label="Ver Select" if not english else "View Select",
            href=component_href("select-dropdown"),
            target_type="component",
            source="catalog",
            confidence="exact",
            metadata={"component_id": "select-dropdown", "internal": True},
        ),
    ]
    return primary, secondary


def serialize_navigation_payload(
    navigation_action: NavigationAction | None,
    secondary_navigation_actions: list[NavigationAction] | None = None,
) -> dict:
    payload: dict = {}
    if navigation_action is not None:
        payload["navigation_action"] = navigation_action.model_dump(mode="json")
    if secondary_navigation_actions:
        payload["secondary_navigation_actions"] = [
            action.model_dump(mode="json")
            for action in secondary_navigation_actions
        ]
    return payload


def route_resolution_for_section(section_key: str) -> RouteResolution | None:
    from agent.route_map import CANONICAL_ROUTES

    return CANONICAL_ROUTES.get(section_key)
