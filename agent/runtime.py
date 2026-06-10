from __future__ import annotations

import json
import os
import re
import uuid
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any

from .evidence import RuleScorer, build_component_selection
from .executor import PlanExecution, ToolExecutionError, execute_plan
from .navigation_actions import (
    navigation_action_for_component,
    navigation_action_for_perspective,
    navigation_action_for_route,
    single_choice_navigation_actions,
)
from .models import (
    AgentPlan,
    AnswerConfidence,
    AuditMetadata,
    ComponentSelection,
    CreateDecisionRecordInput,
    EvidenceItem,
    ExecutionStep,
    NavigationAction,
    ResponseValidation,
    QueryUnderstanding,
    ToolExecutionSummary,
)
from .planner import build_agent_plan
from .policies import ToolPolicyContext, authorize_tool
from .registry import ToolRegistry
from .concept_map import concept_response, resolve_concept_key
from .operational_responses import (
    direct_entity_guidance_response,
    entity_lookup_response,
    greeting_response,
    legacy_name_response,
    legacy_navigation_response,
    navigation_response,
    perspective_lookup_response,
    semantic_navigation_response,
    small_talk_response,
)
from .perspective_registry import resolve_perspective_match
from .semantic_navigation import resolve_semantic_navigation
from .decision_rules import decision_rule_response, resolve_decision_rule
from .recommendation_policy import (
    is_single_choice_recommendation_query,
    single_choice_recommendation_response,
)
from .response_dedup import dedupe_response
from .response_validation import (
    deterministic_component_response,
    deterministic_token_response,
    validate_component_response,
    validate_token_response,
)
from .route_map import resolve_navigation_route
from .store import AgentStore
from .understanding import analyze_query
from component_metadata import component_registry


STEP_LABELS: dict[str, str] = {
    "request_received": "Request received",
    "intent_detected": "Intent detected",
    "workflow_selected": "Workflow selected",
    "tools_selected": "Tools selected",
    "policy_checked": "Policy checked",
    "retrieval_executed": "Retrieval executed",
    "sources_selected": "Sources selected",
    "evidence_scored": "Evidence scored",
    "tool_results_built": "Tool results built",
    "component_selection_completed": "Component selection completed",
    "llm_composition_started": "LLM composition started",
    "response_validated": "Response validated",
    "fallback_applied": "Deterministic fallback applied",
    "response_completed": "Response completed",
    "decision_draft_created": "Decision draft created",
    "memory_updated": "Memory updated",
    "out_of_scope_blocked": "Out of scope blocked",
    "tool_execution_failed": "Tool execution failed",
}


def _now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds")


def _debug_enabled() -> bool:
    return os.environ.get("BEATRICE_DEBUG", "").strip() in {"1", "true", "yes"}


def _debug(message: str) -> None:
    if _debug_enabled():
        print(f"[beatrice:runtime] {message}")


@dataclass
class StepRecorder:
    steps: list[ExecutionStep] = field(default_factory=list)

    def add(
        self,
        step_id: str,
        *,
        status: str = "completed",
        details: str | None = None,
    ) -> None:
        step = ExecutionStep(
            id=step_id,
            label=STEP_LABELS[step_id],
            status=status,
            details=details,
            timestamp=_now(),
        )
        for index, existing in enumerate(self.steps):
            if existing.id == step_id:
                self.steps[index] = step
                return
        self.steps.append(step)


@dataclass
class AgentExecutionContext:
    request_id: str
    session_id: str
    project_id: str
    query: str
    profile: str
    preferred_detail_level: str
    plan: AgentPlan
    recorder: StepRecorder
    execution: PlanExecution | None = None
    component_selection: ComponentSelection | None = None
    response_validation: ResponseValidation = field(
        default_factory=ResponseValidation
    )
    limitations: list[str] = field(default_factory=list)
    should_compose: bool = True
    deterministic_response: str | None = None
    navigation_action: NavigationAction | None = None
    secondary_navigation_actions: list[NavigationAction] = field(default_factory=list)

    def evidence_not_required(self) -> bool:
        return self.plan.understanding.user_intent in {
            "greeting",
            "small_talk",
            "help_request",
            "navigation_query",
            "semantic_navigation_query",
            "perspective_lookup",
            "entity_lookup",
            "direct_entity_guidance",
            "concept_query",
            "legacy_name_query",
            "out_of_scope",
        }

    def confidence(self) -> tuple[AnswerConfidence, str]:
        if self.evidence_not_required():
            return (
                "not_determined",
                "This deterministic response does not require retrieval evidence.",
            )
        execution = self.execution
        # Component selection via catalog injection provides partial evidence
        # even when semantic retrieval returned no results. Check component
        # selection first so catalog-injected components get a meaningful tier.
        if self.component_selection and self.component_selection.recommended:
            pass  # fall through to the component selection logic below
        elif execution is None or not execution.evidence:
            return (
                "not_determined",
                "No official evidence was available to calibrate the answer.",
            )

        if self.component_selection and self.component_selection.recommended:
            recommended = self.component_selection.recommended
            selection = self.component_selection
            coverage = recommended.perspective_coverage.coverage_ratio
            if selection.recommendation_firmness == "partial_match":
                return (
                    "medium",
                    "The answer is based on a partial semantic match and should not be stated as a firm recommendation.",
                )
            if (
                selection.recommendation_firmness == "firm"
                and recommended.evidence_tier == "strong"
                and coverage >= 0.75
            ):
                return (
                    "high",
                    "Direct component evidence is strong and the required metadata coverage is sufficient.",
                )
            if selection.recommendation_firmness == "firm":
                return (
                    "medium",
                    "The recommendation has direct evidence, but some required component fields are missing or partial.",
                )
            if recommended.evidence_tier in {"strong", "partial"}:
                return (
                    "low",
                    "The available component evidence is partial and should not support a definitive recommendation.",
                )
            return (
                "low",
                "The available component evidence is weak and should not support a definitive recommendation.",
            )

        if execution.evidence_tier == "strong":
            return (
                "high",
                "The corpus contains direct, strongly matching evidence for this answer.",
            )
        if execution.evidence_tier == "partial":
            return (
                "medium",
                "The corpus supports the answer partially and some details require inference.",
            )
        if execution.evidence_tier == "weak":
            return (
                "low",
                "Only indirect or weakly matching evidence was recovered.",
            )
        return (
            "not_determined",
            "The corpus did not provide enough evidence to calibrate the answer.",
        )

    def audit_metadata(
        self,
        *,
        execution_status: str = "running",
        decision_id: str | None = None,
        decision_status: str | None = None,
    ) -> AuditMetadata:
        execution = self.execution
        selection = self.component_selection
        recommended = selection.recommended if selection else None
        validation = self.response_validation
        confidence, confidence_rationale = self.confidence()
        return AuditMetadata(
            request_id=self.request_id,
            query=self.query,
            intent=self.plan.intent,
            workflow=self.plan.workflow,
            user_intent=self.plan.understanding.user_intent,
            answer_strategy=self.plan.understanding.answer_strategy,
            language=self.plan.understanding.language,
            entities=self.plan.understanding.entities,
            tools_used=[
                result.tool
                for result in execution.results
            ] if execution else [],
            steps=self.recorder.steps,
            sources=execution.evidence if execution else [],
            evidence_similarity=(
                selection.evidence_similarity
                if selection else execution.top_similarity if execution else 0.0
            ),
            evidence_tier=(
                "not_required"
                if self.evidence_not_required()
                else (
                    selection.evidence_tier
                    if selection
                    else execution.evidence_tier if execution else "insufficient"
                )
            ),
            confidence=confidence,
            confidence_rationale=confidence_rationale,
            recommended_component=(
                recommended.component.name if recommended else None
            ),
            recommended_component_id=(
                recommended.component.component_id if recommended else None
            ),
            component_status=(
                recommended.component.status if recommended else None
            ),
            weighted_score=selection.weighted_score if selection else 0.0,
            alternative_components=(
                selection.alternative_components if selection else []
            ),
            alternative_threshold=(
                selection.alternative_threshold if selection else 0.03
            ),
            alternative_limit=selection.alternative_limit if selection else 3,
            rejected_components=(
                selection.rejected_components if selection else []
            ),
            selection_reason=(
                selection.selection_reason if selection else None
            ),
            selection_policy=(
                selection.selection_policy if selection else None
            ),
            status_policy_applied=(
                selection.status_policy_applied if selection else False
            ),
            component_intent=(
                recommended.component.intent if recommended else None
            ),
            used_do_rules=(
                recommended.selected_do_rules if recommended else []
            ),
            used_dont_rules=(
                recommended.selected_dont_rules if recommended else []
            ),
            used_when_to_use=(
                recommended.selected_when_to_use if recommended else []
            ),
            used_when_not_to_use=(
                recommended.selected_when_not_to_use if recommended else []
            ),
            when_to_use=(
                recommended.component.when_to_use if recommended else None
            ),
            when_not_to_use=(
                recommended.component.when_not_to_use if recommended else None
            ),
            missing_component_fields=(
                recommended.missing_fields if recommended else []
            ),
            field_sources=(
                recommended.field_sources if recommended else {}
            ),
            component_evidence=recommended,
            response_validation_status=validation.status,
            validation_violation_type=validation.violation_type,
            validation_violations=validation.violations,
            promoted_component_detected=validation.promoted_component_detected,
            expected_recommended_component=(
                validation.expected_recommended_component
            ),
            fallback_used=validation.fallback_used,
            fallback_reason=validation.fallback_reason,
            limitations=list(dict.fromkeys([
                *self.limitations,
                *(execution.limitations if execution else []),
            ])),
            decision_id=decision_id,
            decision_status=decision_status,
            execution_status=execution_status,
        )


class AgentRuntime:
    def __init__(
        self,
        *,
        registry: ToolRegistry,
        store: AgentStore,
        model: str,
        rule_scorer: RuleScorer | None = None,
    ):
        self.registry = registry
        self.store = store
        self.model = model
        self.rule_scorer = rule_scorer

    def prepare(
        self,
        *,
        query: str,
        profile: str,
        routed_intent: str,
        command_mode: str | None,
        session_id: str,
        project_id: str,
        preferred_detail_level: str,
        catalog_mode: bool = False,
        understanding: QueryUnderstanding | None = None,
    ) -> AgentExecutionContext:
        request_id = f"req_{uuid.uuid4().hex[:16]}"
        recorder = StepRecorder()
        recorder.add("request_received")
        plan = build_agent_plan(
            query,
            routed_intent=routed_intent,
            command_mode=command_mode,
            catalog_mode=catalog_mode,
            understanding=understanding or analyze_query(query),
        )
        recorder.add("intent_detected", details=plan.intent)
        recorder.add("workflow_selected", details=plan.workflow)
        recorder.add(
            "tools_selected",
            details=", ".join(plan.tools) if plan.tools else "none",
        )
        context = AgentExecutionContext(
            request_id=request_id,
            session_id=session_id,
            project_id=project_id,
            query=query,
            profile=profile,
            preferred_detail_level=preferred_detail_level,
            plan=plan,
            recorder=recorder,
        )
        self.store.create_run(
            request_id=request_id,
            session_id=session_id,
            project_id=project_id,
            user_query=query,
            profile=profile,
            intent=plan.intent,
            workflow=plan.workflow,
            plan=plan.model_dump(mode="json"),
            model=self.model,
            steps=[step.model_dump(mode="json") for step in recorder.steps],
        )

        understanding = plan.understanding
        exact = understanding.exact_entity_matches[0] if understanding.exact_entity_matches else None
        _non_rag_workflows = {
            "greeting",
            "navigation_query",
            "semantic_navigation_query",
            "perspective_lookup",
            "entity_lookup",
            "direct_entity_guidance",
            "concept_query",
            "single_choice_recommendation",
            "decision_rule_recommendation",
            "legacy_name_query",
            "out_of_scope",
        }
        _debug(
            "orchestration: "
            f"query={query[:120]!r} "
            f"user_intent={understanding.user_intent} "
            f"operational_intent={understanding.operational_intent} "
            f"retrieval_intent={plan.intent} "
            f"workflow={plan.workflow} "
            f"language={understanding.language} "
            f"components={understanding.entities.components} "
            f"exact_entity_match={exact.component_id if exact else None} "
            f"resolved_route={understanding.resolved_route} "
            f"rag_required={plan.workflow not in _non_rag_workflows}"
        )

        if plan.workflow == "out_of_scope":
            recorder.add("policy_checked", details="Request blocked by scope policy.")
            recorder.add("out_of_scope_blocked", status="blocked")
            context.should_compose = False
            context.limitations.append("The request is outside Beatrice's design-system scope.")
            context.deterministic_response = self._out_of_scope_response(query)
            _debug("blocked: out_of_scope (Caso B)")
            self._finalize(context, status="blocked")
            return context

        if plan.understanding.user_intent == "navigation_query":
            resolution = resolve_navigation_route(query)
            legacy_name = self._legacy_navigation_name(query)
            recorder.add(
                "policy_checked",
                details="Deterministic navigation_query response approved.",
            )
            recorder.add("response_completed")
            context.should_compose = False
            if resolution is None:
                context.deterministic_response = dedupe_response(
                    self._navigation_fallback_response(query)
                )
            elif legacy_name:
                context.deterministic_response = legacy_navigation_response(
                    resolution,
                    legacy_name=legacy_name,
                    english=self._is_english(query),
                )
                context.navigation_action = navigation_action_for_route(
                    resolution,
                    english=self._is_english(query),
                )
            else:
                context.deterministic_response = dedupe_response(
                    navigation_response(
                        resolution,
                        english=self._is_english(query),
                    )
                )
                context.navigation_action = navigation_action_for_route(
                    resolution,
                    english=self._is_english(query),
                )
            _debug(f"answered deterministically: navigation_query route={resolution.route if resolution else None}")
            self._finalize(context, status="completed")
            return context

        if plan.understanding.user_intent == "perspective_lookup":
            perspective_match = resolve_perspective_match(query)
            recorder.add(
                "policy_checked",
                details="Deterministic perspective_lookup response approved.",
            )
            recorder.add("response_completed")
            context.should_compose = False
            english = self._is_english(query)
            if perspective_match is None:
                context.deterministic_response = dedupe_response(
                    self._navigation_fallback_response(query)
                )
            else:
                context.deterministic_response = perspective_lookup_response(
                    perspective_match,
                    english=english,
                )
                primary_action, secondary_actions = navigation_action_for_perspective(
                    perspective_match,
                    english=english,
                )
                context.navigation_action = primary_action
                context.secondary_navigation_actions = secondary_actions
            _debug(
                "answered deterministically: perspective_lookup "
                f"profile={understanding.resolved_perspective_id}"
            )
            self._finalize(context, status="completed")
            return context

        if plan.understanding.user_intent == "semantic_navigation_query":
            semantic = resolve_semantic_navigation(query)
            recorder.add(
                "policy_checked",
                details="Deterministic semantic_navigation_query response approved.",
            )
            recorder.add("response_completed")
            context.should_compose = False
            english = self._is_english(query)
            if semantic is None or semantic.route is None or semantic.section_key is None:
                context.deterministic_response = dedupe_response(
                    self._navigation_fallback_response(query)
                )
            elif semantic.kind == "perspective" and semantic.perspective is not None:
                context.deterministic_response = perspective_lookup_response(
                    semantic.perspective,
                    english=english,
                )
                primary_action, secondary_actions = navigation_action_for_perspective(
                    semantic.perspective,
                    english=english,
                )
                context.navigation_action = primary_action
                context.secondary_navigation_actions = secondary_actions
            else:
                from agent.route_map import CANONICAL_ROUTES

                resolution = CANONICAL_ROUTES.get(semantic.section_key)
                if resolution is None:
                    context.deterministic_response = dedupe_response(
                        self._navigation_fallback_response(query)
                    )
                else:
                    context.deterministic_response = dedupe_response(
                        semantic_navigation_response(
                            label_pt=semantic.label_pt,
                            label_en=semantic.label_en,
                            section_key=semantic.section_key,
                            english=english,
                        )
                    )
                    context.navigation_action = navigation_action_for_route(
                        resolution,
                        english=english,
                    )
            _debug("answered deterministically: semantic_navigation_query")
            self._finalize(context, status="completed")
            return context

        if plan.understanding.user_intent == "concept_query":
            concept_key = resolve_concept_key(query)
            recorder.add(
                "policy_checked",
                details="Deterministic concept_query response approved.",
            )
            recorder.add("response_completed")
            context.should_compose = False
            context.deterministic_response = dedupe_response(
                concept_response(
                    concept_key or "abraxos",
                    english=self._is_english(query),
                )
            )
            _debug(f"answered deterministically: concept_query={concept_key}")
            self._finalize(context, status="completed")
            return context

        if plan.understanding.user_intent == "direct_entity_guidance":
            recorder.add(
                "policy_checked",
                details="Deterministic direct_entity_guidance response approved.",
            )
            recorder.add("response_completed")
            context.should_compose = False
            context.deterministic_response = self._direct_entity_guidance_response(
                query,
                understanding,
            )
            component = self._resolved_component(understanding)
            if component is not None:
                self._attach_entity_navigation(
                    context,
                    component,
                    english=self._is_english(query),
                    verb="view",
                )
            _debug(
                "answered deterministically: direct_entity_guidance "
                f"match={understanding.exact_entity_matches[0].component_id if understanding.exact_entity_matches else None}"
            )
            self._finalize(context, status="completed")
            return context

        if plan.workflow == "single_choice_recommendation":
            recorder.add(
                "policy_checked",
                details="Deterministic single_choice_recommendation approved.",
            )
            recorder.add("response_completed")
            context.should_compose = False
            context.deterministic_response = dedupe_response(
                single_choice_recommendation_response(
                    english=self._is_english(query),
                )
            )
            primary_action, secondary_actions = single_choice_navigation_actions(
                english=self._is_english(query),
            )
            context.navigation_action = primary_action
            context.secondary_navigation_actions = secondary_actions
            _debug("answered deterministically: single_choice_recommendation")
            self._finalize(context, status="completed")
            return context

        if plan.workflow == "decision_rule_recommendation":
            english = self._is_english(query)
            rule = resolve_decision_rule(query, english=english)
            recorder.add(
                "policy_checked",
                details="Deterministic decision_rule_recommendation approved.",
            )
            recorder.add("response_completed")
            context.should_compose = False
            if rule is None:
                context.deterministic_response = self._component_not_found_response(query)
            else:
                context.deterministic_response = dedupe_response(
                    decision_rule_response(rule, english=english)
                )
                context.navigation_action = rule.navigation_action
                context.secondary_navigation_actions = list(
                    rule.secondary_navigation_actions
                )
            _debug(
                "answered deterministically: decision_rule_recommendation "
                f"rule={rule.rule_id if rule else None}"
            )
            self._finalize(context, status="completed")
            return context

        if plan.understanding.user_intent == "entity_lookup":
            recorder.add(
                "policy_checked",
                details="Deterministic entity_lookup response approved.",
            )
            recorder.add("response_completed")
            context.should_compose = False
            context.deterministic_response = self._entity_lookup_response(query, understanding)
            component = self._resolved_component(understanding)
            if component is not None:
                self._attach_entity_navigation(
                    context,
                    component,
                    english=self._is_english(query),
                    verb="open",
                )
            _debug(
                "answered deterministically: entity_lookup "
                f"match={understanding.exact_entity_matches[0].component_id if understanding.exact_entity_matches else None}"
            )
            self._finalize(context, status="completed")
            return context

        if plan.understanding.user_intent == "legacy_name_query":
            recorder.add(
                "policy_checked",
                details="Deterministic legacy_name_query response approved.",
            )
            recorder.add("response_completed")
            context.should_compose = False
            context.deterministic_response = self._legacy_name_response(query)
            _debug("answered deterministically: legacy_name_query")
            self._finalize(context, status="completed")
            return context

        if plan.understanding.user_intent in {
            "greeting",
            "small_talk",
            "help_request",
        }:
            # Social and capability questions are deterministic: no retrieval,
            # no LLM and no evidence requirement.
            intent = plan.understanding.user_intent
            recorder.add(
                "policy_checked",
                details=f"Deterministic {intent} response approved.",
            )
            recorder.add("response_completed")
            context.should_compose = False
            if intent == "greeting":
                context.deterministic_response = self._greeting_response(
                    query,
                    understanding=understanding,
                )
            elif intent == "small_talk":
                context.deterministic_response = self._small_talk_response(
                    query,
                    understanding=understanding,
                )
            else:
                context.deterministic_response = self._capabilities_response(query)
            _debug(f"answered deterministically: {intent}")
            self._finalize(context, status="completed")
            return context

        recorder.add("policy_checked", details="Tool permissions and scope approved.")
        try:
            execution = execute_plan(
                plan,
                registry=self.registry,
                query=query,
                profile=profile,
            )
        except ToolExecutionError as error:
            # Internal plan or payload errors. Even here, a named component
            # that exists in the canonical catalog can still be answered.
            print(
                f"[beatrice:runtime] plan execution error for "
                f"{error.tool_name}: {error}"
            )
            recorder.add(
                "tool_execution_failed",
                status="failed",
                details=f"{error.tool_name}: {error}",
            )
            context.limitations.append(
                f"Tool execution failed for {error.tool_name}."
            )
            recovered = self._recover_from_catalog(context)
            if recovered:
                return context
            context.should_compose = False
            context.deterministic_response = self._technical_failure_response(query)
            _debug(f"blocked: tool failure without catalog fallback (Caso C); tool={error.tool_name}")
            self._finalize(context, status="failed")
            return context

        context.execution = execution
        if execution.failed_tools:
            recorder.add(
                "tool_execution_failed",
                status="failed",
                details=", ".join(execution.failed_tools),
            )
        if plan.workflow == "component_decision":
            context.component_selection = build_component_selection(
                execution.evidence,
                query=query,
                profile=profile,
                rule_scorer=self.rule_scorer,
                named_components=list(plan.understanding.entities.components),
                exact_entity_matches=list(plan.understanding.exact_entity_matches),
                workflow=plan.workflow,
            )
            selection = context.component_selection
            context.recorder.add(
                "component_selection_completed",
                details=(
                    selection.recommended.component.name
                    if selection.recommended
                    else "no eligible component"
                ),
            )
            _debug(
                "component selection: "
                f"recommended={selection.recommended.component.name if selection.recommended else None} "
                f"tier={selection.evidence_tier} source={selection.evidence_source} "
                f"rejected={[(item.name, item.reason) for item in selection.rejected_components]}"
            )
            if selection.recommended:
                if selection.recommended.evidence_source == "canonical_catalog":
                    context.limitations.append(
                        "Encontrei evidência parcial no catálogo. A resposta "
                        "usa confiança moderada e indica as limitações."
                    )
                for missing_field in (
                    selection.recommended.perspective_coverage
                    .missing_required_fields
                ):
                    context.limitations.append(
                        f"Component field '{missing_field}' is not documented."
                    )
                self._attach_selection_navigation(context)
        recorder.add(
            "retrieval_executed",
            details=f"{len(execution.evidence)} evidence item(s) recovered.",
        )
        recorder.add(
            "sources_selected",
            details=f"{len(execution.evidence)} source excerpt(s) selected.",
        )
        recorder.add(
            "evidence_scored",
            details=(
                f"{execution.evidence_tier}; "
                f"top similarity {execution.top_similarity:.3f}"
            ),
        )
        recorder.add(
            "tool_results_built",
            details=f"{len(execution.results)} tool result(s) structured.",
        )
        _debug(
            f"evidence: {len(execution.evidence)} item(s), "
            f"tier={execution.evidence_tier}, "
            f"top_similarity={execution.top_similarity:.3f}, "
            f"failed_tools={execution.failed_tools}"
        )

        if plan.workflow == "component_decision" and context.component_selection:
            if context.component_selection.recommended is None:
                # All candidates were rejected and catalog injection also
                # failed. Distinguish a component that does not exist in the
                # catalog (Caso A) from a technical retrieval failure (Caso C).
                context.should_compose = False
                if execution.all_tools_failed:
                    context.limitations.append(
                        "Evidence retrieval failed and no canonical catalog "
                        "match was available."
                    )
                    context.deterministic_response = (
                        self._technical_failure_response(query)
                    )
                    _debug("blocked: all tools failed, no catalog match (Caso C)")
                    self._finalize(context, status="failed")
                else:
                    context.limitations.append(
                        "No active component candidate met the deterministic "
                        "selection policy."
                    )
                    context.deterministic_response = (
                        self._component_not_found_response(query)
                    )
                    _debug("blocked: component not in catalog (Caso A)")
                    self._finalize(context, status="limited")
            # If recommended is not None (including catalog injection), proceed to compose.
        elif (
            plan.workflow != "component_decision"
            and execution.evidence_tier == "insufficient"
        ):
            # Before blocking, try the canonical catalog for any named
            # component (e.g. "modal vs drawer" still has Modal/Dialog data).
            if self._catalog_selection_for_named(context):
                _debug(
                    "insufficient retrieval recovered via canonical catalog "
                    f"for workflow {plan.workflow}"
                )
                return context
            context.should_compose = False
            if execution.all_tools_failed:
                # Technical failure (Caso C), not an evidence gap.
                context.limitations.append(
                    "Evidence retrieval failed for every selected tool."
                )
                context.deterministic_response = (
                    self._technical_failure_response(query)
                )
                _debug("blocked: all tools failed (Caso C)")
                self._finalize(context, status="failed")
            else:
                context.limitations.append("No official evidence was retrieved.")
                context.deterministic_response = (
                    self._insufficient_evidence_response(query)
                )
                _debug("blocked: insufficient evidence for non-component workflow")
                self._finalize(context, status="limited")
        return context

    def _catalog_selection_for_named(
        self,
        context: AgentExecutionContext,
    ) -> bool:
        """Populate component_selection from the canonical catalog.

        Used when semantic retrieval came back empty but the query names at
        least one documented component. Keeps the response composable with
        partial catalog evidence instead of blocking.
        """
        named = list(context.plan.understanding.entities.components)
        if not named:
            return False
        selection = build_component_selection(
            [],
            query=context.query,
            profile=context.profile,
            rule_scorer=self.rule_scorer,
            named_components=named,
            exact_entity_matches=list(context.plan.understanding.exact_entity_matches),
            workflow=context.plan.workflow,
        )
        if selection.recommended is None:
            return False
        context.component_selection = selection
        context.limitations.append(
            "Encontrei evidência parcial no catálogo. A resposta usa "
            "confiança moderada e indica as limitações."
        )
        context.recorder.add(
            "component_selection_completed",
            details=selection.recommended.component.name,
        )
        return True

    def _recover_from_catalog(self, context: AgentExecutionContext) -> bool:
        """Catalog fallback after a technical retrieval failure (Caso C).

        Returns True when a named component was resolved from the canonical
        catalog and the pipeline can continue composing a response.
        """
        if not self._catalog_selection_for_named(context):
            return False
        selection = context.component_selection
        context.execution = PlanExecution(
            results=[],
            evidence=[],
            top_similarity=selection.evidence_similarity,
            evidence_tier=selection.evidence_tier,
            limitations=[],
        )
        context.limitations.append(
            "Não consegui acessar a base de evidências agora. A resposta usa "
            "o catálogo canônico."
        )
        _debug(
            "recovered from tool failure via canonical catalog: "
            f"{selection.recommended.component.name}"
        )
        return True

    def start_composition(self, context: AgentExecutionContext) -> None:
        context.recorder.add(
            "llm_composition_started",
            status="running",
            details="The LLM received structured tool results.",
        )

    def structured_context(self, context: AgentExecutionContext) -> str:
        execution = context.execution
        session_memory = self.store.get_session_memory(context.session_id)
        project_memory = self.store.get_project_memory(context.project_id)
        payload = {
            "request_id": context.request_id,
            "workflow": context.plan.workflow,
            "planner_rationale": context.plan.rationale,
            "query_understanding": context.plan.understanding.model_dump(
                mode="json"
            ),
            "preferred_detail_level": context.preferred_detail_level,
            "evidence_tier": (
                context.component_selection.evidence_tier
                if context.component_selection
                and context.component_selection.recommended
                else execution.evidence_tier if execution else "insufficient"
            ),
            "evidence_similarity": (
                context.component_selection.evidence_similarity
                if context.component_selection
                and context.component_selection.recommended
                else execution.top_similarity if execution else 0.0
            ),
            "evidence_source": (
                context.component_selection.evidence_source
                if context.component_selection else "semantic_retrieval"
            ),
            "component_selection": (
                context.component_selection.model_dump(mode="json")
                if context.component_selection else None
            ),
            "limitations": list(dict.fromkeys([
                *context.limitations,
                *(execution.limitations if execution else []),
            ])),
            "confidence": {
                "label": context.confidence()[0],
                "rationale": context.confidence()[1],
                "rule": (
                    "Use a textual label only. Do not invent a percentage. "
                    "Evidence similarity is retrieval relevance, not answer confidence."
                ),
            },
            "tool_results": [
                {
                    "tool": result.tool.model_dump(mode="json"),
                    "output": result.output,
                }
                for result in (execution.results if execution else [])
            ],
            "session_memory": session_memory,
            "project_memory": project_memory,
            "component_response_contract": (
                {
                    "required_sections": [
                        "Componente recomendado",
                        "Motivo",
                        "Limites",
                        "Campos ausentes",
                        "Evidência",
                    ],
                    "alternatives_section_allowed": bool(
                        context.component_selection
                        and context.component_selection.alternative_components
                    ),
                    "evidence_similarity_label": (
                        "similaridade da evidência, never answer confidence"
                    ),
                }
                if context.plan.workflow == "component_decision"
                else None
            ),
            "composer_boundary": (
                "Compose the final answer from this structured context. "
                "Do not choose tools, execute actions, invent sources, change "
                "recommended_component, promote an alternative, fill null "
                "component fields with generic knowledge or expose internal "
                "reasoning. State documented limitations explicitly."
            ),
        }
        return (
            "# Governed Agent Context\n\n"
            + json.dumps(payload, ensure_ascii=False, indent=2)
        )

    def validate_response(
        self,
        context: AgentExecutionContext,
        response_text: str,
    ) -> str:
        if (
            context.plan.workflow == "component_decision"
            and context.component_selection is not None
        ):
            validation = validate_component_response(
                response_text,
                context.component_selection,
            )
            fallback = deterministic_component_response(
                context.component_selection,
                english=self._is_english(context.query),
            )
        elif context.plan.workflow == "token_lookup":
            validation = validate_token_response(
                response_text,
                context.execution.evidence if context.execution else [],
            )
            fallback = deterministic_token_response(
                context.execution.evidence if context.execution else [],
                english=self._is_english(context.query),
            )
        else:
            context.response_validation = ResponseValidation(
                status="not_applicable"
            )
            return dedupe_response(response_text)

        context.response_validation = validation
        context.recorder.add(
            "response_validated",
            status="completed",
            details=validation.status,
        )
        if not validation.fallback_used:
            return dedupe_response(response_text)
        context.recorder.add(
            "fallback_applied",
            status="completed",
            details=validation.violation_type,
        )
        return dedupe_response(fallback)

    def finalize_success(
        self,
        context: AgentExecutionContext,
        response_text: str,
    ) -> AuditMetadata:
        context.recorder.add(
            "llm_composition_started",
            status="completed",
            details="Structured composition completed.",
        )
        context.recorder.add("response_completed")
        decision_id: str | None = None
        decision_status: str | None = None
        execution = context.execution

        if (
            context.plan.creates_decision_draft
            and execution is not None
            and execution.evidence_tier in {"partial", "strong"}
            and response_text.strip()
        ):
            alternatives, tradeoffs = self._decision_signals(execution)
            definition = self.registry.get("create_decision_record")
            authorize_tool(ToolPolicyContext(
                name=definition.name,
                permission=definition.status,
                requires_confirmation=definition.requires_confirmation,
                requested_status="draft",
            ))
            decision_output = self.registry.execute(
                definition.name,
                CreateDecisionRecordInput(
                    request_id=context.request_id,
                    session_id=context.session_id,
                    project_id=context.project_id,
                    user_query=context.query,
                    profile=context.profile,
                    workflow=context.plan.workflow,
                    recommendation=response_text.strip(),
                    alternatives_considered=alternatives,
                    tradeoffs=tradeoffs,
                    evidence_sources=execution.evidence,
                    top_similarity=execution.top_similarity,
                    evidence_tier=execution.evidence_tier,
                    model=self.model,
                ).model_dump(mode="json"),
            )
            decision_id = str(decision_output.decision_id)
            decision_status = "draft"
            context.recorder.add(
                "decision_draft_created",
                details=decision_id,
            )

        self.store.update_memory(
            session_id=context.session_id,
            project_id=context.project_id,
            profile=context.profile,
            intent=context.plan.intent,
            preferred_detail_level=context.preferred_detail_level,
            topics=self._memory_topics(context),
            decision_id=decision_id,
        )
        context.recorder.add(
            "memory_updated",
            details=f"Session {context.session_id}; project {context.project_id}.",
        )
        self._finalize(
            context,
            status="completed",
            decision_id=decision_id,
        )
        return context.audit_metadata(
            execution_status="completed",
            decision_id=decision_id,
            decision_status=decision_status,
        )

    def finalize_provider_fallback(
        self,
        context: AgentExecutionContext,
        *,
        limitation: str,
    ) -> tuple[str, AuditMetadata] | None:
        if context.plan.workflow not in {
            "component_decision",
            "token_lookup",
        }:
            return None

        response_text = self.validate_response(context, "")
        if not response_text.strip():
            return None

        if any(
            step.id == "llm_composition_started"
            for step in context.recorder.steps
        ):
            context.recorder.add(
                "llm_composition_started",
                status="failed",
                details=limitation,
            )
        context.limitations.append(limitation)
        context.recorder.add(
            "response_completed",
            details="Deterministic evidence fallback completed.",
        )
        self._finalize(context, status="limited")
        return (
            response_text,
            context.audit_metadata(execution_status="limited"),
        )

    def finalize_failure(
        self,
        context: AgentExecutionContext,
        *,
        limitation: str,
    ) -> AuditMetadata:
        if any(
            step.id == "llm_composition_started"
            for step in context.recorder.steps
        ):
            context.recorder.add(
                "llm_composition_started",
                status="failed",
                details=limitation,
            )
        context.limitations.append(limitation)
        self._finalize(context, status="failed")
        return context.audit_metadata(execution_status="failed")

    def _finalize(
        self,
        context: AgentExecutionContext,
        *,
        status: str,
        decision_id: str | None = None,
    ) -> None:
        audit = context.audit_metadata(
            execution_status=status,
            decision_id=decision_id,
            decision_status="draft" if decision_id else None,
        )
        self.store.finalize_run(
            context.request_id,
            tools_used=[
                tool.model_dump(mode="json")
                for tool in audit.tools_used
            ],
            steps=[
                step.model_dump(mode="json")
                for step in audit.steps
            ],
            sources=[
                source.model_dump(mode="json")
                for source in audit.sources
            ],
            top_similarity=audit.evidence_similarity,
            evidence_tier=audit.evidence_tier,
            limitations=audit.limitations,
            status=status,
            decision_id=decision_id,
        )

    @staticmethod
    def _decision_signals(execution: PlanExecution) -> tuple[list[str], list[str]]:
        alternatives: list[str] = []
        tradeoffs: list[str] = []
        for result in execution.results:
            output = result.output or {}
            for key in ("option_a_evidence", "option_b_evidence", "shared_evidence"):
                for item in output.get(key, []):
                    title = str(item.get("title", "")).strip()
                    if title and title not in alternatives:
                        alternatives.append(title)
            for item in output.get("tradeoff_signals", []):
                text = str(item.get("text", "")).strip()
                if text and text not in tradeoffs:
                    tradeoffs.append(text)
            for item in output.get("possible_violations", []):
                text = str(item.get("text", "")).strip()
                if text and text not in tradeoffs:
                    tradeoffs.append(text)
        return alternatives[:10], tradeoffs[:10]

    @staticmethod
    def _memory_topics(context: AgentExecutionContext) -> list[str]:
        topics = [context.plan.workflow]
        if context.execution:
            topics.extend(item.title for item in context.execution.evidence[:5])
        return list(dict.fromkeys(topics))

    @staticmethod
    def _is_english(query: str) -> bool:
        english_markers = {"what", "which", "how", "should", "use", "compare", "weather"}
        words = set(re.findall(r"[a-z]+", query.lower()))
        return len(words & english_markers) >= 2

    def _out_of_scope_response(self, query: str) -> str:
        from agent.comprehension import comprehend

        result = comprehend(query)
        hints = result.suggestion_hints
        if self._is_english(query):
            base = (
                "I could not find that in the Velaris scope. I can help with "
                "components, tokens, patterns, perspectives, accessibility, "
                "audits and documented decisions."
            )
            if hints:
                return (
                    f"{base} You might be looking for "
                    f"{', '.join(hints)}."
                )
            return base
        base = (
            "Não encontrei isso no escopo do Velaris. Posso ajudar com "
            "componentes, tokens, padrões, perspectivas, acessibilidade, "
            "auditorias e decisões documentadas."
        )
        if hints:
            return (
                f"{base} Talvez estejas a procurar "
                f"{', '.join(hints)}."
            )
        return base

    def _component_not_found_response(self, query: str) -> str:
        # Caso A: a entidade nomeada nao existe no catalogo canonico.
        if self._is_english(query):
            return (
                "I could not find that component in the Velaris catalog. I can "
                "help if you rephrase with the component name or the intended "
                "use case."
            )
        return (
            "Não encontrei esse componente no catálogo do Velaris. Posso "
            "ajudar se você reformular com o nome do componente ou intenção "
            "de uso."
        )

    def _technical_failure_response(self, query: str) -> str:
        # Caso C: erro tecnico real de RAG/backend, sem fallback disponivel.
        if self._is_english(query):
            return (
                "I could not reach the evidence base right now. I can still "
                "answer from the canonical catalog when the question names a "
                "documented component, token or pattern."
            )
        return (
            "Não consegui acessar a base de evidências agora. Ainda posso "
            "responder com base no catálogo canônico se a pergunta citar um "
            "componente, token ou pattern documentado."
        )

    def _insufficient_evidence_response(self, query: str) -> str:
        if self._is_english(query):
            return (
                "The official corpus did not provide enough evidence to answer "
                "this request without speculation. Naming a specific component, "
                "token or pattern helps me ground the answer."
            )
        return (
            "O corpus oficial não forneceu evidência suficiente para responder "
            "a este pedido sem especulação. Citar um componente, token ou "
            "pattern específico me ajuda a fundamentar a resposta."
        )

    def _navigation_fallback_response(self, query: str) -> str:
        if self._is_english(query):
            return (
                "I could not map that section to a canonical Velaris route. "
                "Try naming tokens, components, patterns, foundations, "
                "reasoning or the full Abraxos chat."
            )
        return (
            "Não consegui mapear essa seção para uma rota canônica do Velaris. "
            "Tente citar tokens, componentes, padrões, fundamentos, "
            "raciocínio ou o chat completo do Abraxos."
        )

    def _resolved_component(
        self,
        understanding: QueryUnderstanding,
    ):
        from component_metadata import component_registry

        if understanding.exact_entity_matches:
            return component_registry().get(
                understanding.exact_entity_matches[0].component_id
            )
        if understanding.entities.components:
            registry = component_registry()
            for name in understanding.entities.components:
                for candidate in registry.values():
                    if candidate.name == name:
                        return candidate
        return None

    def _entity_lookup_response(
        self,
        query: str,
        understanding: QueryUnderstanding,
    ) -> str:
        exact = (
            understanding.exact_entity_matches[0]
            if understanding.exact_entity_matches
            else None
        )
        english = self._is_english(query)
        if exact is None:
            return self._component_not_found_response(query)
        component = component_registry().get(exact.component_id)
        if component is None:
            return self._component_not_found_response(query)
        return dedupe_response(
            entity_lookup_response(
                component,
                english=english,
            )
        )

    def _attach_entity_navigation(
        self,
        context: AgentExecutionContext,
        component,
        *,
        english: bool,
        verb: str = "open",
    ) -> None:
        context.navigation_action = navigation_action_for_component(
            component,
            english=english,
            verb=verb,
        )

    def _attach_selection_navigation(self, context: AgentExecutionContext) -> None:
        selection = context.component_selection
        if selection is None or selection.recommended is None:
            return
        english = self._is_english(context.query)
        recommended = selection.recommended.component
        context.navigation_action = navigation_action_for_component(
            recommended,
            english=english,
            verb="view",
        )
        secondary: list[NavigationAction] = []
        from component_metadata import component_registry

        registry = component_registry()
        for alternative in selection.alternative_components[:2]:
            component = registry.get(alternative.component_id)
            if component is None:
                continue
            secondary.append(
                navigation_action_for_component(
                    component,
                    english=english,
                    verb="view",
                )
            )
        if secondary:
            context.secondary_navigation_actions = secondary

    def _direct_entity_guidance_response(
        self,
        query: str,
        understanding: QueryUnderstanding,
    ) -> str:
        component = None
        if understanding.exact_entity_matches:
            component = component_registry().get(
                understanding.exact_entity_matches[0].component_id
            )
        elif understanding.entities.components:
            registry = component_registry()
            for name in understanding.entities.components:
                for candidate in registry.values():
                    if candidate.name == name:
                        component = candidate
                        break
                if component is not None:
                    break
        if component is None:
            return dedupe_response(self._component_not_found_response(query))
        return dedupe_response(
            direct_entity_guidance_response(
                component,
                query,
                english=self._is_english(query),
            )
        )

    @staticmethod
    def _legacy_navigation_name(query: str) -> str | None:
        normalized = re.sub(r"[^a-z]+", " ", query.lower())
        for legacy_name in ("aetheris", "beatrice"):
            if legacy_name in normalized:
                return legacy_name
        return None

    def _legacy_name_response(self, query: str) -> str:
        normalized = re.sub(r"[^a-z]+", " ", query.lower())
        english = self._is_english(query)
        if "beatrice" in normalized:
            return legacy_name_response(
                english=english,
                legacy="Beatrice",
                current="Abraxos",
            )
        if "aetheris" in normalized:
            return legacy_name_response(
                english=english,
                legacy="Aetheris",
                current="Velaris",
            )
        return self._capabilities_response(query)

    def _social_response_english(
        self,
        query: str,
        understanding: QueryUnderstanding,
    ) -> bool:
        if understanding.language == "en":
            return True
        if understanding.language in {"pt-BR", "pt-PT"}:
            return False
        return self._is_english(query)

    def _greeting_response(
        self,
        query: str,
        *,
        understanding: QueryUnderstanding,
    ) -> str:
        return greeting_response(
            english=self._social_response_english(query, understanding),
        )

    def _small_talk_response(
        self,
        query: str,
        *,
        understanding: QueryUnderstanding,
    ) -> str:
        return small_talk_response(
            query,
            english=self._social_response_english(query, understanding),
        )

    def _capabilities_response(self, query: str) -> str:
        if self._is_english(query):
            return (
                "I am Abraxos, the Velaris design-system oracle. I can help "
                "you with:\n\n"
                "- Components: when to use, when not to use, intents, states and usage examples\n"
                "- Patterns: screen structure, flows and composition\n"
                "- Tokens: color, typography, spacing and semantic roles\n"
                "- Guidelines and accessibility: WCAG, keyboard, ARIA and focus\n"
                "- Design decisions: documented rationale and trade-offs\n"
                "- Interface audits: review an existing usage against the documented rules\n"
                "- Comparisons: decision criteria between two alternatives\n"
                "- Documentation for developers, designers, QA, product designers, "
                "tech writers and design system managers\n\n"
                "Ask, for example: \"When should I use Button?\", \"Which token "
                "for brand emphasis?\" or \"Modal or Toast for confirmation?\""
            )
        return (
            "Sou o Abraxos, o oráculo do design system Velaris. Posso ajudar com:\n\n"
            "- Componentes: quando usar, quando não usar, intents, estados e exemplos de uso\n"
            "- Patterns: estrutura de telas, fluxos e composição\n"
            "- Tokens: cor, tipografia, espaçamento e papéis semânticos\n"
            "- Guidelines e acessibilidade: WCAG, teclado, ARIA e foco\n"
            "- Decisões de design: racional documentado e trade-offs\n"
            "- Auditoria de interface: revisar um uso existente contra as regras documentadas\n"
            "- Comparação entre alternativas: critérios de decisão entre duas opções\n"
            "- Documentação para developers, designers, QA, product designers, "
            "tech writers e design system managers\n\n"
            "Pergunte, por exemplo: \"Quando usar Button?\", \"Qual token para "
            "destaque da marca?\" ou \"Modal ou Toast para confirmação?\""
        )
