from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator
from component_metadata import (
    AccessibilityMetadata,
    ComponentMetadata,
    ComponentStatus,
    IntentItem,
    LocalizedRule,
)
from prompts.perspective_ids import normalize_profile_id


WorkflowName = Literal[
    "greeting",
    "navigation_query",
    "semantic_navigation_query",
    "perspective_lookup",
    "entity_lookup",
    "direct_entity_guidance",
    "single_choice_recommendation",
    "decision_rule_recommendation",
    "concept_query",
    "component_decision",
    "pattern_guidance",
    "token_lookup",
    "accessibility_guidance",
    "design_decision",
    "xai_explanation",
    "design_audit",
    "compare_options",
    "documentation_help",
    "out_of_scope",
]
OperationalIntent = Literal[
    "greeting",
    "small_talk",
    "navigation_query",
    "semantic_navigation_query",
    "perspective_lookup",
    "entity_lookup",
    "direct_entity_guidance",
    "concept_query",
    "component_recommendation",
    "component_comparison",
    "pattern_guidance",
    "token_lookup",
    "accessibility_guidance",
    "design_decision",
    "xai_explanation",
    "catalog",
    "language_followup",
    "help_request",
    "general_design_system",
    "legacy_name_query",
    "out_of_scope",
]
UserIntent = Literal[
    "greeting",
    "small_talk",
    "navigation_query",
    "semantic_navigation_query",
    "perspective_lookup",
    "entity_lookup",
    "direct_entity_guidance",
    "concept_query",
    "component_recommendation",
    "component_comparison",
    "pattern_guidance",
    "token_lookup",
    "accessibility_guidance",
    "design_decision",
    "xai_explanation",
    "catalog",
    "language_followup",
    "help_request",
    "general_design_system",
    "legacy_name_query",
    "out_of_scope",
]
AnswerStrategy = Literal[
    "greeting",
    "navigation_query",
    "entity_lookup",
    "direct_entity_guidance",
    "concept_query",
    "component_recommendation",
    "component_comparison",
    "pattern_guidance",
    "token_lookup",
    "accessibility_guidance",
    "design_decision",
    "xai_explanation",
    "catalog",
    "documentation_help",
    "legacy_name_query",
    "out_of_scope",
]
UserLanguage = Literal["pt-BR", "pt-PT", "en", "unknown"]
AnswerConfidence = Literal["high", "medium", "low", "not_determined"]
ToolPermission = Literal["read_only", "write_action"]
EvidenceTier = Literal[
    "strong",
    "partial",
    "weak",
    "insufficient",
    "not_required",
]
EvidenceSource = Literal["semantic_retrieval", "canonical_catalog"]
StepStatus = Literal["pending", "running", "completed", "failed", "blocked", "skipped"]
RunStatus = Literal["running", "completed", "limited", "failed", "blocked"]
DecisionStatus = Literal["draft", "confirmed", "rejected"]
SelectionRejectionReason = Literal[
    "weak_evidence",
    "insufficient_evidence",
    "deprecated_status",
    "legacy_status",
    "unresolved_component_id",
    "unsupported_page_type",
    "superseded_by_exact_match",
]
ResponseValidationStatus = Literal["pass", "fallback", "not_applicable"]
NavigationTargetType = Literal[
    "page",
    "section",
    "component",
    "token",
    "pattern",
    "decision",
    "concept",
    "perspective",
]
NavigationActionSource = Literal[
    "route_map",
    "catalog",
    "search_index",
    "rag",
    "manual_alias",
    "perspective_registry",
]
NavigationConfidence = Literal["exact", "partial"]
ValidationViolationType = Literal[
    "promoted_alternative",
    "invented_component",
    "invented_token",
    "invented_confidence",
    "contradicted_recommended_component",
    "unsupported_claim",
    "missing_required_limitation",
]


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class NavigationAction(StrictModel):
    label: str = Field(min_length=1, max_length=120)
    href: str = Field(min_length=1, max_length=500)
    target_type: NavigationTargetType
    source: NavigationActionSource
    confidence: NavigationConfidence
    anchor: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)


ExactEntityMatchType = Literal["component_id", "name", "alias"]


class ExactEntityMatch(StrictModel):
    component_id: str
    name: str
    match_type: ExactEntityMatchType
    matched_alias: str


class ExtractedEntities(StrictModel):
    components: list[str] = Field(default_factory=list)
    patterns: list[str] = Field(default_factory=list)
    tokens: list[str] = Field(default_factory=list)
    token_categories: list[str] = Field(default_factory=list)
    states: list[str] = Field(default_factory=list)
    interaction_intents: list[str] = Field(default_factory=list)
    contexts: list[str] = Field(default_factory=list)
    accessibility_constraints: list[str] = Field(default_factory=list)
    risks: list[str] = Field(default_factory=list)


class QueryUnderstanding(StrictModel):
    user_intent: UserIntent = "general_design_system"
    operational_intent: OperationalIntent = "general_design_system"
    answer_strategy: AnswerStrategy = "documentation_help"
    language: UserLanguage = "unknown"
    entities: ExtractedEntities = Field(default_factory=ExtractedEntities)
    exact_entity_matches: list[ExactEntityMatch] = Field(default_factory=list)
    resolved_route: str | None = None
    resolved_section_label: str | None = None
    resolved_perspective_id: str | None = None
    goal: str = "answer_design_system_question"
    retrieval_query: str = ""


class AgentPlan(StrictModel):
    intent: str
    workflow: WorkflowName
    tools: list[str]
    steps: list[str]
    needs_confirmation: bool
    rationale: str
    creates_decision_draft: bool = False
    understanding: QueryUnderstanding = Field(default_factory=QueryUnderstanding)


class ExecutionStep(StrictModel):
    id: str
    label: str
    status: StepStatus
    details: str | None = None
    timestamp: str | None = None


class EvidenceItem(StrictModel):
    title: str
    source: str
    page_type: str
    excerpt: str
    semantic_text: str = ""
    component_id: str | None = None
    status: ComponentStatus | None = None
    section: str | None = None
    when_to_use: list[LocalizedRule] | None = None
    when_not_to_use: list[LocalizedRule] | None = None
    accessibility: AccessibilityMetadata | None = None
    aetheris_insight: dict[str, str | None] | None = None
    component_metadata: ComponentMetadata | None = None
    similarity: float = Field(ge=-1.0, le=1.0)
    retrieval_weight: float = Field(default=1.0, ge=0.0)
    weighted_score: float = Field(default=0.0)


class SelectedRule(StrictModel):
    id: str
    field: Literal["do", "dont", "when_to_use", "when_not_to_use"]
    text: str
    rule_similarity: float = Field(ge=0.0, le=1.0)
    sources: list[str] = Field(default_factory=list)


class PerspectiveCoverage(StrictModel):
    profile: str
    required_fields: list[str]
    present_required_fields: list[str]
    missing_required_fields: list[str]
    coverage_ratio: float = Field(ge=0.0, le=1.0)


class ComponentEvidence(StrictModel):
    component: ComponentMetadata
    excerpt: str
    similarity: float = Field(ge=0.0, le=1.0)
    retrieval_weight: float = Field(ge=0.0)
    weighted_score: float
    evidence_tier: EvidenceTier
    evidence_source: EvidenceSource = "semantic_retrieval"
    present_fields: list[str]
    missing_fields: list[str]
    empty_fields: list[str]
    field_sources: dict[str, list[str]]
    selected_do_rules: list[SelectedRule]
    selected_dont_rules: list[SelectedRule]
    selected_when_to_use: list[SelectedRule]
    selected_when_not_to_use: list[SelectedRule]
    perspective_coverage: PerspectiveCoverage


class ComponentCandidate(StrictModel):
    component_id: str
    name: str
    status: ComponentStatus
    weighted_score: float
    evidence_similarity: float = Field(ge=0.0, le=1.0)
    evidence_tier: EvidenceTier


class RejectedComponent(ComponentCandidate):
    reason: SelectionRejectionReason


RecommendationFirmness = Literal["firm", "partial_match", "insufficient"]


class ComponentSelection(StrictModel):
    recommended: ComponentEvidence | None
    alternative_components: list[ComponentCandidate]
    rejected_components: list[RejectedComponent]
    weighted_score: float = 0.0
    evidence_similarity: float = Field(default=0.0, ge=0.0, le=1.0)
    evidence_tier: EvidenceTier = "insufficient"
    evidence_source: EvidenceSource = "semantic_retrieval"
    exact_entity_match: ExactEntityMatch | None = None
    recommendation_firmness: RecommendationFirmness = "insufficient"
    alternative_threshold: float = 0.03
    alternative_limit: int = 3
    selection_reason: str
    selection_policy: str
    status_policy_applied: bool = True


class ResponseValidation(StrictModel):
    status: ResponseValidationStatus = "not_applicable"
    violation_type: ValidationViolationType | None = None
    violations: list[ValidationViolationType] = Field(default_factory=list)
    promoted_component_detected: str | None = None
    expected_recommended_component: str | None = None
    fallback_used: bool = False
    fallback_reason: str | None = None


class EvidenceStatement(StrictModel):
    text: str
    source_titles: list[str] = Field(default_factory=list)


class SearchComponentInput(StrictModel):
    query: str = Field(min_length=1, max_length=10_000)
    profile: str = "general"


class SearchPatternInput(StrictModel):
    query: str = Field(min_length=1, max_length=10_000)
    profile: str = "general"


class SearchTokenInput(StrictModel):
    query: str = Field(min_length=1, max_length=10_000)
    category: str | None = Field(default=None, max_length=120)
    profile: str = "general"


class SearchEvidenceInput(StrictModel):
    query: str = Field(min_length=1, max_length=10_000)
    profile: str = "general"


class SearchResult(StrictModel):
    items: list[EvidenceItem]
    top_similarity: float = Field(ge=0.0, le=1.0)
    evidence_tier: EvidenceTier
    limitations: list[str] = Field(default_factory=list)


class CompareDesignOptionsInput(StrictModel):
    option_a: str = Field(min_length=1, max_length=5_000)
    option_b: str = Field(min_length=1, max_length=5_000)
    context: str = Field(min_length=1, max_length=10_000)
    profile: str = "general"


class CompareDesignOptionsOutput(StrictModel):
    option_a_evidence: list[EvidenceItem]
    option_b_evidence: list[EvidenceItem]
    shared_evidence: list[EvidenceItem]
    tradeoff_signals: list[EvidenceStatement]
    top_similarity: float = Field(ge=0.0, le=1.0)
    evidence_tier: EvidenceTier
    limitations: list[str] = Field(default_factory=list)


class ValidateDesignSystemInput(StrictModel):
    subject: str = Field(min_length=1, max_length=20_000)
    profile: str = "general"


class ValidateDesignSystemOutput(StrictModel):
    relevant_components: list[EvidenceItem]
    relevant_patterns: list[EvidenceItem]
    relevant_tokens: list[EvidenceItem]
    relevant_guidelines: list[EvidenceItem]
    possible_violations: list[EvidenceStatement]
    recommendations: list[EvidenceStatement]
    top_similarity: float = Field(ge=0.0, le=1.0)
    evidence_tier: EvidenceTier
    limitations: list[str] = Field(default_factory=list)


class ToolExecutionSummary(StrictModel):
    name: str
    permission: ToolPermission
    status: Literal["completed", "failed", "blocked"]
    details: str | None = None


class ToolExecutionResult(StrictModel):
    tool: ToolExecutionSummary
    output: dict[str, Any] | None = None


class AuditMetadata(StrictModel):
    request_id: str
    query: str = ""
    intent: str
    workflow: WorkflowName
    user_intent: UserIntent = "general_design_system"
    answer_strategy: AnswerStrategy = "documentation_help"
    language: UserLanguage = "unknown"
    entities: ExtractedEntities = Field(default_factory=ExtractedEntities)
    tools_used: list[ToolExecutionSummary] = Field(default_factory=list)
    steps: list[ExecutionStep] = Field(default_factory=list)
    sources: list[EvidenceItem] = Field(default_factory=list)
    evidence_similarity: float = Field(default=0.0, ge=0.0, le=1.0)
    evidence_tier: EvidenceTier = "insufficient"
    confidence: AnswerConfidence = "not_determined"
    confidence_rationale: str = ""
    recommended_component: str | None = None
    recommended_component_id: str | None = None
    component_status: ComponentStatus | None = None
    weighted_score: float = 0.0
    alternative_components: list[ComponentCandidate] = Field(default_factory=list)
    alternative_threshold: float = 0.03
    alternative_limit: int = 3
    rejected_components: list[RejectedComponent] = Field(default_factory=list)
    selection_reason: str | None = None
    selection_policy: str | None = None
    status_policy_applied: bool = False
    component_intent: IntentItem | None = None
    used_do_rules: list[SelectedRule] = Field(default_factory=list)
    used_dont_rules: list[SelectedRule] = Field(default_factory=list)
    used_when_to_use: list[SelectedRule] = Field(default_factory=list)
    used_when_not_to_use: list[SelectedRule] = Field(default_factory=list)
    when_to_use: list[LocalizedRule] | None = None
    when_not_to_use: list[LocalizedRule] | None = None
    missing_component_fields: list[str] = Field(default_factory=list)
    field_sources: dict[str, list[str]] = Field(default_factory=dict)
    component_evidence: ComponentEvidence | None = None
    response_validation_status: ResponseValidationStatus = "not_applicable"
    validation_violation_type: ValidationViolationType | None = None
    validation_violations: list[ValidationViolationType] = Field(default_factory=list)
    promoted_component_detected: str | None = None
    expected_recommended_component: str | None = None
    fallback_used: bool = False
    fallback_reason: str | None = None
    limitations: list[str] = Field(default_factory=list)
    decision_id: str | None = None
    decision_status: DecisionStatus | None = None
    execution_status: RunStatus = "running"


class CreateDecisionRecordInput(StrictModel):
    request_id: str
    session_id: str
    project_id: str
    user_query: str
    profile: str
    workflow: WorkflowName
    recommendation: str
    alternatives_considered: list[str] = Field(default_factory=list)
    tradeoffs: list[str] = Field(default_factory=list)
    evidence_sources: list[EvidenceItem] = Field(default_factory=list)
    top_similarity: float = Field(ge=0.0, le=1.0)
    evidence_tier: EvidenceTier
    model: str
    status: Literal["draft"] = "draft"

    @field_validator("profile", mode="before")
    @classmethod
    def canonical_profile(cls, value: object) -> str:
        return normalize_profile_id(value)

    @field_validator("status")
    @classmethod
    def draft_only(cls, value: str) -> str:
        if value != "draft":
            raise ValueError("Decision records can only be created as draft")
        return value


class CreateDecisionRecordOutput(StrictModel):
    decision_id: str
    status: Literal["draft"]
    created_at: str


class DecisionPatch(StrictModel):
    status: Literal["confirmed", "rejected"]


class AgentChatMessage(StrictModel):
    role: Literal["user", "assistant"]
    content: str = Field(max_length=100_000)


class AgentChatRequest(StrictModel):
    messages: list[AgentChatMessage]
    profile: str = "general"
    command_mode: str | None = None
    calibration: dict[str, Any] | None = None
    session_id: str = Field(default="default-session", min_length=1, max_length=200)
    project_id: str = Field(default="default", min_length=1, max_length=200)
    preferred_detail_level: Literal["concise", "balanced", "detailed"] = "balanced"
    surface_context: dict[str, Any] | None = None

    @field_validator("profile", mode="before")
    @classmethod
    def canonical_profile(cls, value: object) -> str:
        return normalize_profile_id(value)
