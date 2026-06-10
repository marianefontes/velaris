from __future__ import annotations

from collections.abc import Callable

from agent.evidence import evidence_from_chunks, evidence_tier, top_similarity
from agent.models import (
    SearchComponentInput,
    SearchEvidenceInput,
    SearchPatternInput,
    SearchResult,
    SearchTokenInput,
)
from agent.registry import ToolDefinition


RetrievalFunction = Callable[[str, str, int, str], list[dict]]


def _search(
    retrieve: RetrievalFunction,
    *,
    query: str,
    intent: str,
    profile: str,
    top_k: int = 5,
) -> SearchResult:
    items = evidence_from_chunks(retrieve(query, intent, top_k, profile))
    top = top_similarity(items)
    tier = evidence_tier(top, has_results=bool(items))
    limitations = [] if items else ["No official Aetheris evidence was retrieved."]
    return SearchResult(
        items=items,
        top_similarity=top,
        evidence_tier=tier,
        limitations=limitations,
    )


def build_search_component_tool(retrieve: RetrievalFunction) -> ToolDefinition:
    def execute(payload: SearchComponentInput) -> SearchResult:
        return _search(
            retrieve,
            query=payload.query,
            intent="component_guidance",
            profile=payload.profile,
        )

    return ToolDefinition(
        name="search_component",
        description="Search official Aetheris component evidence.",
        input_schema=SearchComponentInput,
        output_schema=SearchResult,
        executor=execute,
        status="read_only",
        requires_confirmation=False,
    )


def build_search_pattern_tool(retrieve: RetrievalFunction) -> ToolDefinition:
    def execute(payload: SearchPatternInput) -> SearchResult:
        return _search(
            retrieve,
            query=payload.query,
            intent="pattern_guidance",
            profile=payload.profile,
        )

    return ToolDefinition(
        name="search_pattern",
        description="Search official Aetheris pattern evidence.",
        input_schema=SearchPatternInput,
        output_schema=SearchResult,
        executor=execute,
        status="read_only",
        requires_confirmation=False,
    )


def build_search_token_tool(retrieve: RetrievalFunction) -> ToolDefinition:
    def execute(payload: SearchTokenInput) -> SearchResult:
        query = payload.query
        if payload.category:
            query = f"{query} category: {payload.category}"
        return _search(
            retrieve,
            query=query,
            intent="token_lookup",
            profile=payload.profile,
        )

    return ToolDefinition(
        name="search_token",
        description="Search official Aetheris token evidence.",
        input_schema=SearchTokenInput,
        output_schema=SearchResult,
        executor=execute,
        status="read_only",
        requires_confirmation=False,
    )


def _build_search_evidence_tool(
    retrieve: RetrievalFunction,
    *,
    name: str,
    description: str,
    intent: str,
) -> ToolDefinition:
    def execute(payload: SearchEvidenceInput) -> SearchResult:
        return _search(
            retrieve,
            query=payload.query,
            intent=intent,
            profile=payload.profile,
        )

    return ToolDefinition(
        name=name,
        description=description,
        input_schema=SearchEvidenceInput,
        output_schema=SearchResult,
        executor=execute,
        status="read_only",
        requires_confirmation=False,
    )


def build_search_design_decision_tool(
    retrieve: RetrievalFunction,
) -> ToolDefinition:
    return _build_search_evidence_tool(
        retrieve,
        name="search_design_decision",
        description="Search official Aetheris design-decision evidence.",
        intent="design_decision",
    )


def build_search_explainability_tool(
    retrieve: RetrievalFunction,
) -> ToolDefinition:
    return _build_search_evidence_tool(
        retrieve,
        name="search_explainability",
        description="Search official Aetheris explainability evidence.",
        intent="xai_explanation",
    )
