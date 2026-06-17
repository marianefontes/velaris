from __future__ import annotations

import re

from .models import AgentPlan, QueryUnderstanding
from .understanding import analyze_query
from .pending_intent import PendingIntentResolution, apply_pending_resolution_to_route
from .professional_intent import requires_mandatory_rag, workflow_for_category


_AUDIT_TERMS = (
    "audite", "auditar", "audit", "valide", "validar", "validate",
    "violacao", "violação", "violation", "conformidade", "compliance",
    "trecho de codigo", "trecho de código", "code snippet", "jsx", "tsx",
    "isto esta certo", "isso esta certo", "esta certo", "esta errado",
    "tem problema usar", "posso usar assim", "faz sentido usar",
    "tenho tres botoes", "tenho 3 botoes", "multiplos botoes primary",
    "quais riscos", "como melhoro",
)

_IMPLEMENTATION_SIGNALS = (
    "implemento", "implementar", "implement",
    "como usar", "how to use", "como uso",
    "exemplo de", "me mostre", "show me",
    "codigo", "snippet", "como faço", "how to",
    "usando os intents", "usando intents", "usando states", "usando props",
)
_COMPARE_TERMS = (
    " vs ", " versus ", "compare", "comparar", "comparacao", "comparação",
    "diferenca entre", "diferença entre", "em vez de", "instead of",
)
_TOKEN_TERMS = (
    "token", "tokens", "tipografia", "typography", "spacing", "espacamento",
    "espaçamento", "palette", "paleta", "cor ", "color ",
)
_COMPONENT_TERMS = (
    "component", "componente", "dialog", "modal", "drawer", "button",
    "botao", "botão", "toast", "alert", "table", "input", "select",
    "checkbox", "radio", "switch", "date picker", "datepicker",
)
_PATTERN_TERMS = (
    "pattern", "padrao", "padrão", "layout", "fluxo", "flow", "onboarding",
    "dashboard", "estrutura de tela", "screen structure",
)
_DOCUMENTATION_TERMS = (
    "document", "documentacao", "documentação", "explique", "explain",
    "como funciona", "how does", "o que e", "o que é", "what is",
)
_DOMAIN_TERMS = (
    "aetheris", "velaris", "beatrice", "design system", "sistema de design", "interface", "ux",
    "acessibilidade", "accessibility", "governanca", "governança",
    "componente", "component", "pattern", "padrao", "padrão", "token",
)
_EXPLICIT_OUT_OF_SCOPE = (
    "previsao do tempo", "previsão do tempo", "weather forecast",
    "placar do jogo", "sports score", "receita culinaria", "receita culinária",
    "horoscopo", "horóscopo", "cotacao do dolar", "cotação do dólar",
)


_WORKFLOW_TOOLS: dict[str, list[str]] = {
    "greeting": [],
    "navigation_query": [],
    "semantic_navigation_query": [],
    "perspective_lookup": [],
    "entity_lookup": [],
    "unsupported_entity_lookup": [],
    "unsupported_entity_recommendation": [],
    "unknown_entity_lookup": [],
    "direct_entity_guidance": [],
    "single_choice_recommendation": [],
    "decision_rule_recommendation": [],
    "comparison_rule": [],
    "concept_query": [],
    "component_decision": ["search_component", "search_pattern"],
    "page_recommendation": ["search_component", "search_pattern"],
    "pattern_guidance": ["search_pattern"],
    "token_lookup": ["search_token"],
    "accessibility_guidance": ["validate_against_design_system"],
    "design_decision": ["search_design_decision"],
    "xai_explanation": ["search_explainability"],
    "design_audit": ["validate_against_design_system"],
    "compare_options": ["compare_design_options"],
    "decision_analysis": [
        "search_design_decision",
        "search_component",
        "search_pattern",
        "validate_against_design_system",
    ],
    "documentation_help": ["search_component", "search_pattern", "search_token"],
    "migration_advisor": [],
    "system_health": ["search_explainability"],
    "agent_identity": [],
    "governance_analysis": ["search_design_decision"],
    "simulation": [
        "search_design_decision",
        "search_component",
        "compare_design_options",
    ],
    "multi_agent_reasoning": ["search_design_decision", "search_pattern"],
    "out_of_scope": [],
}

_DRAFT_WORKFLOWS = {
    "component_decision",
    "pattern_guidance",
    "design_audit",
    "compare_options",
    "decision_analysis",
}

_PROFESSIONAL_ROUTING_EXEMPT_WORKFLOWS = {
    "greeting",
    "navigation_query",
    "semantic_navigation_query",
    "perspective_lookup",
    "entity_lookup",
    "unsupported_entity_lookup",
    "unsupported_entity_recommendation",
    "unknown_entity_lookup",
    "direct_entity_guidance",
    "concept_query",
    "single_choice_recommendation",
    "decision_rule_recommendation",
    "comparison_rule",
    "agent_identity",
    "out_of_scope",
    "component_decision",
    "compare_options",
    "token_lookup",
    "migration_advisor",
    "page_recommendation",
    "governance_analysis",
    "simulation",
    "multi_agent_reasoning",
    "system_health",
}


def _apply_professional_routing(
    understanding: QueryUnderstanding,
    workflow: str,
    tools: list[str],
    rationale: str,
) -> tuple[str, list[str], str]:
    if understanding.professional_category == "MIGRATION_ADVISOR":
        return (
            workflow_for_category("MIGRATION_ADVISOR"),
            [],
            (
                "Migration advisor: produce an adoption and modernization plan; "
                "institutional RAG is optional enrichment only."
            ),
        )
    if requires_mandatory_rag(understanding):
        return workflow, tools, rationale
    if workflow in _PROFESSIONAL_ROUTING_EXEMPT_WORKFLOWS:
        return workflow, tools, rationale
    category = understanding.professional_category
    routed_workflow = workflow_for_category(category)
    return (
        routed_workflow,
        [],
        (
            f"Professional category {category}: respond with specialized "
            "expertise; institutional RAG is optional."
        ),
    )


def _decision_analysis_tools(
    query: str,
    understanding: QueryUnderstanding,
) -> list[str]:
    normalized = " ".join(query.lower().split())
    tools = ["search_design_decision"]
    if understanding.entities.components or _contains_any(normalized, _COMPONENT_TERMS):
        tools.append("search_component")
    if understanding.entities.patterns or _contains_any(normalized, _PATTERN_TERMS):
        tools.append("search_pattern")
    if (
        _contains_any(normalized, _COMPARE_TERMS)
        or understanding.user_intent == "component_comparison"
    ):
        tools.append("compare_design_options")
    tools.append("validate_against_design_system")
    return list(dict.fromkeys(tools))


def _contains_any(query: str, terms: tuple[str, ...]) -> bool:
    return any(term in query for term in terms)


def _comparison_options(query: str) -> tuple[str, str] | None:
    match = re.search(r"(.+?)\s+(?:vs\.?|versus|em vez de|instead of)\s+(.+)", query, re.I)
    if not match:
        return None
    return match.group(1).strip(), match.group(2).strip()


def build_agent_plan(
    query: str,
    *,
    routed_intent: str = "general",
    command_mode: str | None = None,
    catalog_mode: bool = False,
    understanding: QueryUnderstanding | None = None,
    pending_resolution: PendingIntentResolution | None = None,
) -> AgentPlan:
    if pending_resolution is not None:
        understanding = apply_pending_resolution_to_route(
            pending_resolution,
            understanding=analyze_query(pending_resolution.original_query),
        )
        workflow = pending_resolution.workflow
        if pending_resolution.professional_category == "MIGRATION_ADVISOR":
            workflow = workflow_for_category("MIGRATION_ADVISOR")
        tools = list(_WORKFLOW_TOOLS.get(workflow, []))
        rationale = (
            "Pending intent resumed after conversational clarification: "
            f"{pending_resolution.action}."
        )
        steps = [
            "detect_intent",
            "resolve_pending_intent",
            "select_workflow",
            "select_tools",
            "check_policies",
        ]
        if tools:
            steps.extend([
                "execute_tools",
                "score_evidence",
                "build_tool_results",
                "compose_response",
            ])
        else:
            steps.append("compose_response")
        return AgentPlan(
            intent=pending_resolution.retrieval_intent,
            workflow=workflow,  # type: ignore[arg-type]
            tools=tools,
            steps=steps,
            needs_confirmation=False,
            rationale=rationale,
            creates_decision_draft=workflow in _DRAFT_WORKFLOWS,
            understanding=understanding,
        )

    understanding = understanding or analyze_query(query)
    normalized = " ".join(query.lower().split())

    if (
        command_mode is None
        and (
            understanding.user_intent == "out_of_scope"
            or _contains_any(normalized, _EXPLICIT_OUT_OF_SCOPE)
        )
    ):
        workflow = "out_of_scope"
        rationale = "The request is explicitly outside the design-system domain."
    elif _contains_any(normalized, _AUDIT_TERMS):
        workflow = "design_audit"
        rationale = "The request asks for validation or a design-system audit."
    elif (
        understanding.user_intent == "accessibility_guidance"
        and not understanding.entities.components
        and not _contains_any(normalized, _IMPLEMENTATION_SIGNALS)
    ):
        # Pure accessibility guidance only when no specific component is named
        # and the user is not asking how to implement something.
        workflow = "accessibility_guidance"
        rationale = "The request needs grounded accessibility guidance and test criteria."
    elif (
        understanding.user_intent == "accessibility_guidance"
        and (understanding.entities.components or _contains_any(normalized, _IMPLEMENTATION_SIGNALS))
    ):
        # Component named + accessibility concern = component decision with a11y focus
        workflow = "component_decision"
        rationale = "The request needs component implementation guidance with accessibility constraints."
    elif understanding.user_intent == "navigation_query":
        workflow = "navigation_query"
        rationale = "The request asks where to find a Velaris section."
    elif understanding.user_intent == "semantic_navigation_query":
        workflow = "semantic_navigation_query"
        rationale = "The request uses natural language to locate a Velaris section."
    elif understanding.user_intent == "perspective_lookup":
        workflow = "perspective_lookup"
        rationale = "The request asks for a professional perspective in Velaris."
    elif understanding.user_intent == "entity_lookup":
        workflow = "entity_lookup"
        rationale = "The request asks whether a catalog entity exists."
    elif understanding.user_intent == "unsupported_entity_lookup":
        workflow = "unsupported_entity_lookup"
        rationale = "The request cites a known UI entity absent from the Velaris catalog."
    elif understanding.user_intent == "unsupported_entity_recommendation":
        workflow = "unsupported_entity_recommendation"
        rationale = "The request asks for guidance on an entity absent from the Velaris catalog."
    elif understanding.user_intent == "unknown_entity_lookup":
        workflow = "unknown_entity_lookup"
        rationale = "The request cites an unrecognized entity and needs clarification."
    elif understanding.user_intent == "direct_entity_guidance":
        workflow = "direct_entity_guidance"
        rationale = "The request asks for direct usage guidance on a named entity."
    elif understanding.user_intent == "concept_query":
        workflow = "concept_query"
        rationale = "The request asks for a product or oracle concept definition."
    elif understanding.user_intent == "agent_identity":
        workflow = "agent_identity"
        rationale = "The request asks how Abraxos differs from a chatbot or generic oracle."
    elif understanding.user_intent == "system_health":
        workflow = "system_health"
        rationale = "The request asks about system health metrics or reliability diagnostics."
    elif understanding.user_intent == "governance_analysis":
        workflow = "governance_analysis"
        rationale = "The request asks about governance state, alerts or catalog hygiene."
    elif understanding.user_intent == "simulation":
        workflow = "simulation"
        rationale = "The request asks to simulate a design-system change or scenario."
    elif understanding.user_intent == "multi_agent_reasoning":
        workflow = "multi_agent_reasoning"
        rationale = "The request needs deliberation across professional perspectives."
    elif understanding.user_intent == "legacy_name_query":
        workflow = "documentation_help"
        rationale = "The request asks about a legacy product name."
    elif understanding.user_intent in {"greeting", "small_talk"}:
        workflow = "greeting"
        rationale = (
            "The request is a simple greeting."
            if understanding.user_intent == "greeting"
            else "The request is light small talk."
        )
    elif understanding.user_intent == "help_request":
        # Capability meta questions get a deterministic capabilities answer in
        # the runtime; no retrieval is needed.
        workflow = "documentation_help"
        rationale = "The request asks what Beatrice can help with."
    elif understanding.user_intent == "xai_explanation":
        workflow = "xai_explanation"
        rationale = "The request asks how evidence, confidence or a recommendation is explained."
    elif understanding.decision_analysis_mode and understanding.user_intent not in {
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
        "out_of_scope",
    }:
        workflow = "decision_analysis"
        rationale = (
            "The request asks for a decision with tradeoffs, impact and rationale."
        )
    elif understanding.user_intent == "design_decision":
        workflow = "design_decision"
        rationale = "The request asks for documented rationale and trade-offs."
    elif (
        understanding.user_intent == "component_comparison"
        or _contains_any(normalized, _COMPARE_TERMS)
        or routed_intent == "comparison_query"
    ):
        from agent.decision_rules import resolve_comparison_rule

        if resolve_comparison_rule(query) is not None:
            workflow = "comparison_rule"
            rationale = "The request matches a canonical comparison rule."
        else:
            workflow = "compare_options"
            rationale = "The request compares design alternatives."
    elif (
        understanding.user_intent == "token_lookup"
        or _contains_any(normalized, _TOKEN_TERMS)
        or routed_intent == "token_lookup"
    ):
        workflow = "token_lookup"
        rationale = "The request asks for design-token guidance."
    elif understanding.user_intent == "page_architecture":
        workflow = "page_recommendation"
        rationale = "The request needs page architecture and component composition guidance."
    elif understanding.user_intent == "component_discovery":
        workflow = "page_recommendation"
        rationale = "The request needs capability-based component discovery."
    elif (
        understanding.user_intent == "component_recommendation"
        and understanding.page_type
        and not understanding.entities.components
    ):
        workflow = "page_recommendation"
        rationale = "The request needs page-level component recommendations."
    elif (
        understanding.user_intent == "component_recommendation"
        or (
            _contains_any(normalized, _COMPONENT_TERMS)
            and understanding.user_intent != "general_design_system"
        )
        or routed_intent in {
        "component_guidance",
        "when_not_to_use",
        }
    ):
        from agent.decision_rules import resolve_decision_rule
        from agent.recommendation_policy import is_single_choice_recommendation_query

        if is_single_choice_recommendation_query(query):
            workflow = "single_choice_recommendation"
            rationale = "The request needs a conditional single-choice recommendation."
        elif resolve_decision_rule(query) is not None:
            workflow = "decision_rule_recommendation"
            rationale = "The request matches a canonical decision rule."
        else:
            workflow = "component_decision"
            rationale = "The request needs component selection or usage guidance."
    elif (
        understanding.user_intent == "pattern_guidance"
        or _contains_any(normalized, _PATTERN_TERMS)
        or routed_intent in {
        "pattern_guidance",
        "new_product_scaffolding",
        }
    ):
        workflow = "pattern_guidance"
        rationale = "The request needs pattern or layout guidance."
    elif (
        catalog_mode
        or understanding.user_intent in {
            "language_followup",
            "general_design_system",
        }
        or _contains_any(normalized, _DOCUMENTATION_TERMS)
        or _contains_any(normalized, _DOMAIN_TERMS)
        or routed_intent in {"design_decision", "xai_explanation"}
        or command_mode is not None
    ):
        workflow = "documentation_help"
        rationale = "The request is an in-domain documentation or explanation request."
    else:
        workflow = "out_of_scope"
        rationale = "No design-system domain signal was detected."

    tools = list(_WORKFLOW_TOOLS.get(workflow, []))
    if workflow == "decision_analysis":
        tools = _decision_analysis_tools(query, understanding)
    if understanding.user_intent in {
        "greeting",
        "small_talk",
        "help_request",
        "navigation_query",
        "semantic_navigation_query",
        "perspective_lookup",
        "entity_lookup",
        "unsupported_entity_lookup",
        "unsupported_entity_recommendation",
        "unknown_entity_lookup",
        "direct_entity_guidance",
        "concept_query",
        "legacy_name_query",
        "agent_identity",
    }:
        tools = []
    steps = [
        "detect_intent",
        "select_workflow",
        "select_tools",
        "check_policies",
    ]
    if tools:
        steps.extend(["execute_tools", "score_evidence", "build_tool_results", "compose_response"])
    elif understanding.user_intent in {
        "greeting",
        "small_talk",
        "help_request",
        "navigation_query",
        "semantic_navigation_query",
        "perspective_lookup",
        "entity_lookup",
        "unsupported_entity_lookup",
        "unsupported_entity_recommendation",
        "unknown_entity_lookup",
        "direct_entity_guidance",
        "concept_query",
        "single_choice_recommendation",
        "decision_rule_recommendation",
        "comparison_rule",
        "legacy_name_query",
        "agent_identity",
    }:
        steps.append("compose_response")
    else:
        steps.append("block_out_of_scope")

    workflow, tools, rationale = _apply_professional_routing(
        understanding,
        workflow,
        tools,
        rationale,
    )
    if not tools and "execute_tools" in steps:
        steps = [
            step
            for step in steps
            if step
            not in {
                "execute_tools",
                "score_evidence",
                "build_tool_results",
            }
        ]
        if "compose_response" not in steps:
            steps.append("compose_response")

    return AgentPlan(
        intent=routed_intent,
        workflow=workflow,
        tools=tools,
        steps=steps,
        needs_confirmation=False,
        rationale=rationale,
        creates_decision_draft=workflow in _DRAFT_WORKFLOWS,
        understanding=understanding,
    )


def parse_comparison_options(query: str) -> tuple[str, str]:
    parsed = _comparison_options(query)
    if parsed:
        return parsed
    components = analyze_query(query).entities.components
    if len(components) >= 2:
        return components[0], components[1]
    return query, query
