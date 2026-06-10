from __future__ import annotations

import re

from agent.evidence import (
    evidence_from_chunks,
    evidence_item_to_chunk,
    evidence_tier,
    top_similarity,
)
from agent.models import (
    EvidenceItem,
    EvidenceStatement,
    ValidateDesignSystemInput,
    ValidateDesignSystemOutput,
)
from agent.registry import ToolDefinition
from agent.tools.retrieval_tools import RetrievalFunction


_VIOLATION_MARKERS = (
    "must", "should", "avoid", "do not", "when not", "required",
    "deve", "evite", "nao use", "não use", "obrigatorio", "obrigatório",
)
_RECOMMENDATION_MARKERS = (
    "use ", "recommended", "recommendation", "prefer", "usar ", "utilize",
    "recomendado", "prefira",
)


def _statements(
    items: list[EvidenceItem],
    markers: tuple[str, ...],
    *,
    limit: int,
) -> list[EvidenceStatement]:
    statements: list[EvidenceStatement] = []
    seen: set[str] = set()
    for item in items:
        for segment in re.split(r"\s*\|\s*|(?<=[.!?])\s+", item.excerpt):
            text = segment.strip()
            normalized = text.lower()
            if not text or not any(marker in normalized for marker in markers):
                continue
            key = normalized
            if key in seen:
                continue
            seen.add(key)
            statements.append(EvidenceStatement(text=text, source_titles=[item.title]))
            if len(statements) >= limit:
                return statements
    return statements


def build_validate_design_system_tool(retrieve: RetrievalFunction) -> ToolDefinition:
    def execute(payload: ValidateDesignSystemInput) -> ValidateDesignSystemOutput:
        components = evidence_from_chunks(retrieve(
            payload.subject,
            "component_guidance",
            4,
            payload.profile,
        ))
        patterns = evidence_from_chunks(retrieve(
            payload.subject,
            "pattern_guidance",
            3,
            payload.profile,
        ))
        tokens = evidence_from_chunks(retrieve(
            payload.subject,
            "token_lookup",
            3,
            payload.profile,
        ))
        guidelines = evidence_from_chunks(retrieve(
            payload.subject,
            "when_not_to_use",
            4,
            payload.profile,
        ))
        all_items = evidence_from_chunks([
            evidence_item_to_chunk(item)
            for item in [*components, *patterns, *tokens, *guidelines]
        ])
        top = top_similarity(all_items)
        limitations = [] if all_items else ["No design-system rule was retrieved for validation."]
        violations = _statements(all_items, _VIOLATION_MARKERS, limit=8)
        recommendations = _statements(all_items, _RECOMMENDATION_MARKERS, limit=8)
        if all_items and not violations:
            limitations.append("No explicit violation rule matched the retrieved evidence.")
        return ValidateDesignSystemOutput(
            relevant_components=components,
            relevant_patterns=patterns,
            relevant_tokens=tokens,
            relevant_guidelines=guidelines,
            possible_violations=violations,
            recommendations=recommendations,
            top_similarity=top,
            evidence_tier=evidence_tier(top, has_results=bool(all_items)),
            limitations=limitations,
        )

    return ToolDefinition(
        name="validate_against_design_system",
        description="Validate a screen, component or code description against official evidence.",
        input_schema=ValidateDesignSystemInput,
        output_schema=ValidateDesignSystemOutput,
        executor=execute,
        status="read_only",
        requires_confirmation=False,
    )
