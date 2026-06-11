"""Unified navigation action builder for Abraxos responses."""

from __future__ import annotations

from dataclasses import dataclass, field

from component_metadata import component_registry

from agent.models import ComponentSelection, NavigationAction, QueryUnderstanding, WorkflowName
from agent.navigation_actions import (
    navigation_action_for_component,
    navigation_action_for_external_reference,
    navigation_action_for_internal_alternative,
    navigation_action_for_route,
    route_resolution_for_section,
)
from agent.unsupported_entity_detection import is_registered_absent_entity
from agent.route_map import resolve_navigation_route


@dataclass
class ActionPayload:
    navigation_action: NavigationAction | None = None
    secondary_navigation_actions: list[NavigationAction] = field(default_factory=list)


def _component_actions(
    component_ids: tuple[str, ...],
    *,
    english: bool,
    section: str | None = None,
) -> list[NavigationAction]:
    registry = component_registry()
    actions: list[NavigationAction] = []
    for component_id in component_ids:
        component = registry.get(component_id)
        if component is None:
            continue
        actions.append(
            navigation_action_for_component(
                component,
                english=english,
                verb="view",
                section=section,
            )
        )
    return actions


def _route_action(section_key: str, *, english: bool) -> NavigationAction | None:
    resolution = route_resolution_for_section(section_key)
    if resolution is None:
        return None
    return navigation_action_for_route(resolution, english=english)


def _guidance_section(query: str, understanding: QueryUnderstanding) -> str | None:
    normalized = query.lower()
    if understanding.entities.accessibility_constraints or "acessibilidade" in normalized or "accessibility" in normalized:
        return "accessibility"
    if understanding.entities.states or "estado" in normalized or "states" in normalized:
        return "states"
    return None


def build_actions_for_context(
    *,
    workflow: WorkflowName,
    query: str,
    understanding: QueryUnderstanding,
    component_selection: ComponentSelection | None = None,
    english: bool = False,
    comparison_component_ids: tuple[str, ...] | None = None,
) -> ActionPayload:
    if workflow == "component_decision" and component_selection and component_selection.recommended:
        primary = navigation_action_for_component(
            component_selection.recommended.component,
            english=english,
            verb="view",
        )
        secondary: list[NavigationAction] = []
        registry = component_registry()
        for alternative in component_selection.alternative_components[:2]:
            component = registry.get(alternative.component_id)
            if component is not None:
                secondary.append(
                    navigation_action_for_component(component, english=english, verb="view")
                )
        return ActionPayload(primary, secondary)

    if workflow in {
        "unsupported_entity_lookup",
        "unsupported_entity_recommendation",
    }:
        resolution = understanding.catalog_entity_resolution
        if resolution is not None and is_registered_absent_entity(resolution):
            primary: NavigationAction | None = None
            secondary: list[NavigationAction] = []
            for alternative in resolution.internal_alternatives[:1]:
                primary = navigation_action_for_internal_alternative(
                    alternative,
                    english=english,
                )
                if primary is not None:
                    break
            if resolution.external_reference is not None:
                external_action = navigation_action_for_external_reference(
                    resolution.external_reference,
                    english=english,
                )
                if primary is None:
                    primary = external_action
                else:
                    secondary = [external_action]
            if primary is not None:
                return ActionPayload(primary, secondary)
        return ActionPayload()

    if workflow in {"direct_entity_guidance", "entity_lookup"}:
        match = understanding.exact_entity_matches[0] if understanding.exact_entity_matches else None
        if match is not None:
            component = component_registry().get(match.component_id)
            if component is not None:
                section = _guidance_section(query, understanding)
                return ActionPayload(
                    navigation_action_for_component(
                        component,
                        english=english,
                        verb="open" if workflow == "entity_lookup" else "view",
                        section=section,
                    )
                )

    if workflow == "compare_options":
        component_ids = list(comparison_component_ids or ())
        if len(component_ids) < 2:
            registry = component_registry()
            for name in understanding.entities.components[:2]:
                for component in registry.values():
                    if component.name == name:
                        component_ids.append(component.component_id)
                        break
        if len(component_ids) >= 2:
            actions = _component_actions(tuple(component_ids[:2]), english=english)
            if actions:
                return ActionPayload(actions[0], actions[1:])

    if workflow == "token_lookup":
        action = _route_action("tokens", english=english)
        if action is not None:
            return ActionPayload(action)

    if workflow == "pattern_guidance":
        action = _route_action("patterns", english=english)
        if action is not None:
            return ActionPayload(action)

    if workflow == "accessibility_guidance":
        action = _route_action("accessibility", english=english)
        if action is not None:
            return ActionPayload(action)

    if workflow == "design_decision":
        action = _route_action("decisions", english=english)
        if action is not None:
            return ActionPayload(action)

    if workflow == "documentation_help":
        resolution = resolve_navigation_route(query)
        if resolution is not None:
            return ActionPayload(navigation_action_for_route(resolution, english=english))
        if understanding.resolved_route:
            for section_key in ("components", "tokens", "patterns", "foundations", "reasoning"):
                resolution = route_resolution_for_section(section_key)
                if resolution and resolution.route == understanding.resolved_route:
                    return ActionPayload(navigation_action_for_route(resolution, english=english))

    if understanding.exact_entity_matches:
        component = component_registry().get(understanding.exact_entity_matches[0].component_id)
        if component is not None:
            return ActionPayload(
                navigation_action_for_component(component, english=english, verb="view")
            )

    return ActionPayload()
