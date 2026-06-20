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
    "unsupported_entity_lookup",
    "unsupported_entity_recommendation",
    "unknown_entity_lookup",
    "direct_entity_guidance",
    "single_choice_recommendation",
    "decision_rule_recommendation",
    "comparison_rule",
    "concept_query",
    "component_decision",
    "pattern_guidance",
    "token_lookup",
    "accessibility_guidance",
    "design_decision",
    "xai_explanation",
    "design_audit",
    "compare_options",
    "decision_analysis",
    "documentation_help",
    "migration_advisor",
    "system_health",
    "agent_identity",
    "agent_capability",
    "roadmap_capability",
    "governance_analysis",
    "simulation",
    "multi_agent_reasoning",
    "page_recommendation",
    "out_of_scope",
]
OperationalIntent = Literal[
    "greeting",
    "small_talk",
    "navigation_query",
    "semantic_navigation_query",
    "perspective_lookup",
    "entity_lookup",
    "unsupported_entity_lookup",
    "unsupported_entity_recommendation",
    "unknown_entity_lookup",
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
    "system_health",
    "agent_identity",
    "agent_capability",
    "roadmap_capability",
    "governance_analysis",
    "simulation",
    "multi_agent_reasoning",
    "page_architecture",
    "component_discovery",
    "out_of_scope",
]
ProfessionalIntentCategory = Literal[
    "ENTITY_LOOKUP",
    "KNOWLEDGE_EXPLANATION",
    "DESIGN_AUDIT",
    "DESIGN_RATIONALE",
    "ACCESSIBILITY_REVIEW",
    "ARCHITECTURE_REVIEW",
    "GENERAL_PROFESSIONAL_GUIDANCE",
    "MIGRATION_ADVISOR",
]

KnowledgeSource = Literal[
    "institutional_knowledge",
    "professional_knowledge",
    "analytical_capability",
]

UserIntent = Literal[
    "greeting",
    "small_talk",
    "navigation_query",
    "semantic_navigation_query",
    "perspective_lookup",
    "entity_lookup",
    "unsupported_entity_lookup",
    "unsupported_entity_recommendation",
    "unknown_entity_lookup",
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
    "system_health",
    "agent_identity",
    "agent_capability",
    "roadmap_capability",
    "governance_analysis",
    "simulation",
    "multi_agent_reasoning",
    "page_architecture",
    "component_discovery",
    "out_of_scope",
]
AnswerStrategy = Literal[
    "greeting",
    "navigation_query",
    "entity_lookup",
    "unsupported_entity_lookup",
    "unsupported_entity_recommendation",
    "unknown_entity_lookup",
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
    "system_health",
    "agent_identity",
    "agent_capability",
    "roadmap_capability",
    "governance_analysis",
    "simulation",
    "multi_agent_reasoning",
    "page_architecture",
    "component_discovery",
    "out_of_scope",
]
EntityCatalogStatus = Literal[
    "supported",
    "partial",
    "unknown",
]
EntityKind = Literal[
    "component",
    "component_or_pattern",
    "pattern",
    "token",
    "state",
    "variant",
    "guideline",
    "accessibility_rule",
    "concept",
    "decision",
]
UserLanguage = Literal["pt-BR", "pt-PT", "en", "es", "fr", "ar", "other", "unknown"]
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
DecisionStatus = Literal[
    "draft",
    "confirmed",
    "deprecated",
    "rejected",
    "superseded",
]
ImpactLevel = Literal["low", "medium", "high", "critical"]
SelectionRejectionReason = Literal[
    "weak_evidence",
    "insufficient_evidence",
    "deprecated_status",
    "legacy_status",
    "unresolved_component_id",
    "unsupported_page_type",
    "superseded_by_exact_match",
    "dont_rule_violation",
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
    "missing_recommendation",
    "missing_tradeoff",
    "missing_benefit",
    "missing_cost",
    "missing_system_impact",
    "missing_decision_reference",
    "missing_alternatives",
    "missing_consequence_prediction",
    "missing_second_order_effects",
    "missing_perspective_divergence",
    "missing_council_perspectives",
    "missing_council_synthesis",
    "missing_consensus_classification",
    "missing_scenario_analysis",
    "missing_historical_timeline",
]
ClaimConfidence = Literal["strong", "medium", "weak", "absent"]
EvidenceIntegrityStatus = Literal["pass", "blocked", "not_applicable"]
EvidenceIntegrityViolationType = Literal[
    "unknown_entity_inference",
    "claim_without_evidence",
    "internal_audit_leak",
    "confidence_without_source",
    "pretrained_only_recommendation",
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


class InternalAlternative(StrictModel):
    entity_id: str
    name: str
    target_type: Literal["component", "pattern"]
    use_case: str | None = None


class ExternalReferenceAction(StrictModel):
    label: str
    url: str
    source_type: str
    trusted: bool = True
    reference_id: str | None = None


class DesignSystemGap(StrictModel):
    entity_label: str
    entity_type: EntityKind
    reason: str
    suggested_action: str


class CatalogEntityResolution(StrictModel):
    entity_key: str | None = None
    entity_label: str | None = None
    entity_type: EntityKind | None = None
    entity_status: EntityCatalogStatus = "unknown"
    internal_alternatives: list[InternalAlternative] = Field(default_factory=list)
    external_reference: ExternalReferenceAction | None = None
    design_system_gap: DesignSystemGap | None = None
    matched_alias: str | None = None
    response_guidance: str | None = None


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
    catalog_entity_resolution: CatalogEntityResolution | None = None
    resolved_route: str | None = None
    resolved_section_label: str | None = None
    resolved_perspective_id: str | None = None
    goal: str = "answer_design_system_question"
    retrieval_query: str = ""
    decision_analysis_mode: bool = False
    architect_review_mode: bool = False
    professional_category: ProfessionalIntentCategory = "KNOWLEDGE_EXPLANATION"
    knowledge_source: KnowledgeSource = "professional_knowledge"
    page_type: str = ""
    discovery_capability: str = ""


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
    field: Literal["do", "dont", "when_to_use", "when_not_to_use", "anti_pattern"]
    text: str
    rule_similarity: float = Field(ge=0.0, le=1.0)
    sources: list[str] = Field(default_factory=list)


class ContextRuleViolation(StrictModel):
    rule_id: str
    field: Literal["dont", "when_not_to_use", "anti_pattern"]
    text: str
    violation_strength: float = Field(ge=0.0, le=1.0)
    context_profiles: list[str] = Field(default_factory=list)


class ContextFitAssessment(StrictModel):
    fit_score: float = Field(ge=0.0, le=1.0)
    documented_purpose: str = ""
    positive_signal: float = Field(default=0.0, ge=0.0, le=1.0)
    negative_signal: float = Field(default=0.0, ge=0.0, le=1.0)
    violations: list[ContextRuleViolation] = Field(default_factory=list)
    combined_ranking_score: float = Field(default=0.0, ge=0.0, le=1.0)


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
    selected_anti_pattern_rules: list[SelectedRule] = Field(default_factory=list)
    context_fit: ContextFitAssessment | None = None
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
    documented_purpose: str = ""
    ranking_policy: str = "combined_context_fit_and_retrieval"


class ComparisonSideBrief(StrictModel):
    name: str
    catalog_status: Literal["cataloged", "not_cataloged"]
    purpose: str
    use_when: list[str] = Field(default_factory=list)
    avoid_when: list[str] = Field(default_factory=list)
    risks: list[str] = Field(default_factory=list)
    supporting_rules: list[str] = Field(default_factory=list)


class ComponentComparisonBrief(StrictModel):
    rule_id: str
    title: str
    objective: str
    recommended_choice: str
    rationale: str
    tradeoffs: list[str] = Field(default_factory=list)
    design_decision_id: str = ""
    sides: list[ComparisonSideBrief] = Field(default_factory=list)
    institutional_evidence: list[str] = Field(default_factory=list)


class AntiPatternHit(StrictModel):
    pattern_id: str
    component_id: str
    component_name: str
    violated_rule_id: str
    violated_field: str
    rule_text: str
    principle: str
    recommended_alternative: str
    severity: Literal["high", "medium", "low"] = "high"


EvidenceConfidenceStatus = Literal["pass", "warn", "fail"]


class EvidenceConfidenceItem(StrictModel):
    key: str
    label: str
    status: EvidenceConfidenceStatus
    detail: str


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


class Claim(StrictModel):
    id: str
    claim: str
    evidence_source: str | None = None
    evidence_strength: float = Field(default=0.0, ge=0.0, le=1.0)
    confidence: ClaimConfidence = "absent"


class EvidenceIntegrityResult(StrictModel):
    status: EvidenceIntegrityStatus = "not_applicable"
    violations: list[EvidenceIntegrityViolationType] = Field(default_factory=list)
    blocked_claim_ids: list[str] = Field(default_factory=list)
    audit_warnings: list[str] = Field(default_factory=list)
    fallback_used: bool = False
    fallback_reason: str | None = None


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
    entity_status: EntityCatalogStatus | None = None
    entity_type: EntityKind | None = None
    entity_label: str | None = None
    design_system_gap: DesignSystemGap | None = None
    claims: list[Claim] = Field(default_factory=list)
    evidence_integrity_status: EvidenceIntegrityStatus = "not_applicable"
    evidence_integrity_violations: list[EvidenceIntegrityViolationType] = Field(
        default_factory=list
    )
    audit_warnings: list[str] = Field(default_factory=list)


class TradeoffAnalysis(StrictModel):
    recommendation: str = ""
    benefits: list[str] = Field(default_factory=list)
    costs: list[str] = Field(default_factory=list)
    risks: list[str] = Field(default_factory=list)
    debts: list[str] = Field(default_factory=list)
    alternatives: list[str] = Field(default_factory=list)


class SystemImpactAnalysis(StrictModel):
    level: ImpactLevel = "low"
    affected_areas: list[str] = Field(default_factory=list)
    required_changes: list[str] = Field(default_factory=list)
    affected_entities: list[str] = Field(default_factory=list)


class DecisionMemoryEntry(StrictModel):
    decision_id: str
    decision_code: str | None = None
    title: str = ""
    recommended_option: str = ""
    rejected_options: list[str] = Field(default_factory=list)
    status: DecisionStatus = "draft"
    relevance: str = ""


class DecisionMemoryContext(StrictModel):
    related_decisions: list[DecisionMemoryEntry] = Field(default_factory=list)


RiskForecastLevel = Literal["high", "medium", "low"]
ConsensusLevel = Literal["consensus", "partial_consensus", "conflict"]
ScenarioCaseType = Literal["best", "expected", "worst"]


class PredictedConsequence(StrictModel):
    description: str
    probability: RiskForecastLevel


class ConsequenceSimulation(StrictModel):
    change_summary: str = ""
    dependencies: list[str] = Field(default_factory=list)
    impacts: list[str] = Field(default_factory=list)
    consequences: list[PredictedConsequence] = Field(default_factory=list)
    future_risks: list[str] = Field(default_factory=list)


class EntityHistoryEntry(StrictModel):
    entity: str
    version_before: str = ""
    decision_code: str | None = None
    decision_date: str = ""
    change_summary: str = ""
    impacts: list[str] = Field(default_factory=list)


class EntityTimeline(StrictModel):
    entity: str
    entries: list[EntityHistoryEntry] = Field(default_factory=list)


class PerspectiveOpinion(StrictModel):
    perspective: str
    perspective_label: str
    preferred_option: str
    rationale: str


class CouncilPerspectiveOpinion(StrictModel):
    perspective: str
    perspective_label: str
    recommendation: str
    justification: str
    risks: list[str] = Field(default_factory=list)
    confidence: str = "medium"


class CouncilSynthesis(StrictModel):
    consensus: ConsensusLevel = "partial_consensus"
    consensus_percent: int = Field(ge=0, le=100, default=0)
    executive_summary: str = ""
    points_of_agreement: list[str] = Field(default_factory=list)
    points_of_disagreement: list[str] = Field(default_factory=list)
    divergence_reason: str = ""
    final_recommendation: str = ""


class MultiAgentCouncilAnalysis(StrictModel):
    perspectives: list[CouncilPerspectiveOpinion] = Field(default_factory=list)
    synthesis: CouncilSynthesis = Field(default_factory=CouncilSynthesis)


CriterionStatus = Literal["pass", "warn", "fail"]
PerspectiveStance = Literal["favors", "cautions"]


class StakeholderObjection(StrictModel):
    perspective: str
    perspective_label: str
    objection: str


class DecisionChallenger(StrictModel):
    recommendation: str
    objections: list[StakeholderObjection] = Field(default_factory=list)
    acceptance_conditions: list[str] = Field(default_factory=list)
    residual_risks: list[str] = Field(default_factory=list)


class PerspectiveContrastLine(StrictModel):
    perspective: str
    perspective_label: str
    stance: PerspectiveStance
    summary: str


class CatalogGapNote(StrictModel):
    entity_label: str
    closest_alternative_name: str | None = None
    closest_alternative_id: str | None = None
    explanation: str = ""


class RelevantAlternative(StrictModel):
    component_id: str
    name: str
    why_alternative: str
    key_differences: str
    when_to_choose: str


class DecisionReasoningBrief(StrictModel):
    direct_answer: str
    justification_paragraphs: list[str] = Field(default_factory=list)
    institutional_evidence: list[str] = Field(default_factory=list)
    limitations: list[str] = Field(default_factory=list)
    alternatives: list[RelevantAlternative] = Field(default_factory=list)
    use_when: list[str] = Field(default_factory=list)
    avoid_when: list[str] = Field(default_factory=list)
    acceptance_conditions: list[str] = Field(default_factory=list)
    residual_risks: list[str] = Field(default_factory=list)
    conclusion: str = ""
    catalog_gaps: list[CatalogGapNote] = Field(default_factory=list)


class PerceptionIntelligence(StrictModel):
    recommendation: str
    reasoning: DecisionReasoningBrief
    active_perspective: str | None = None


class MissingEvidenceItem(StrictModel):
    code: str
    label: str


class EvidenceGapExplanation(StrictModel):
    reason: str
    missing_items: list[MissingEvidenceItem] = Field(default_factory=list)
    needed_inputs: list[str] = Field(default_factory=list)
    workflow: WorkflowName
    query: str = ""


class PerspectiveDivergenceAnalysis(StrictModel):
    opinions: list[PerspectiveOpinion] = Field(default_factory=list)
    synthesis: str = ""
    consensus: ConsensusLevel = "partial_consensus"


class ScenarioCase(StrictModel):
    case_type: ScenarioCaseType
    outcomes: list[str] = Field(default_factory=list)


class ScenarioAnalysis(StrictModel):
    scenarios: list[ScenarioCase] = Field(default_factory=list)


class SecondOrderEffects(StrictModel):
    direct: list[str] = Field(default_factory=list)
    indirect: list[str] = Field(default_factory=list)


class StrategicReasoningAnalysis(StrictModel):
    architect_review_mode: bool = False
    consequence_simulation: ConsequenceSimulation = Field(
        default_factory=ConsequenceSimulation
    )
    entity_timelines: list[EntityTimeline] = Field(default_factory=list)
    perspective_divergence: PerspectiveDivergenceAnalysis = Field(
        default_factory=PerspectiveDivergenceAnalysis
    )
    scenario_analysis: ScenarioAnalysis = Field(default_factory=ScenarioAnalysis)
    second_order_effects: SecondOrderEffects = Field(
        default_factory=SecondOrderEffects
    )
    confidence_rationale: str = ""


class CreateDecisionRecordInput(StrictModel):
    request_id: str
    session_id: str
    project_id: str
    user_query: str
    profile: str
    workflow: WorkflowName
    recommendation: str
    title: str = ""
    context: str = ""
    recommended_option: str = ""
    alternatives_considered: list[str] = Field(default_factory=list)
    rejected_options: list[str] = Field(default_factory=list)
    tradeoffs: list[str] = Field(default_factory=list)
    tradeoff_analysis: TradeoffAnalysis | None = None
    risks: list[str] = Field(default_factory=list)
    affected_entities: list[str] = Field(default_factory=list)
    system_impact: SystemImpactAnalysis | None = None
    evidence_sources: list[EvidenceItem] = Field(default_factory=list)
    top_similarity: float = Field(ge=0.0, le=1.0)
    evidence_tier: EvidenceTier
    model: str
    author: str = "beatrice"
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
    decision_code: str | None = None
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
