from __future__ import annotations

import re

from agent.evidence import (
    evidence_from_chunks,
    evidence_item_to_chunk,
    evidence_tier,
    top_similarity,
)
from agent.models import (
    CompareDesignOptionsInput,
    CompareDesignOptionsOutput,
    EvidenceItem,
    EvidenceStatement,
)
from agent.registry import ToolDefinition
from agent.tools.retrieval_tools import RetrievalFunction


_TRADEOFF_MARKERS = (
    "trade-off", "tradeoff", "when not", "avoid", "risk", "limitation",
    "vantagem", "desvantagem", "evitar", "risco", "limite",
)


def _shared_items(a_items: list[EvidenceItem], b_items: list[EvidenceItem]) -> list[EvidenceItem]:
    b_keys = {(item.source, item.title) for item in b_items}
    return [item for item in a_items if (item.source, item.title) in b_keys]


def _tradeoff_signals(items: list[EvidenceItem]) -> list[EvidenceStatement]:
    statements: list[EvidenceStatement] = []
    for item in items:
        for segment in re.split(r"\s*\|\s*|(?<=[.!?])\s+", item.excerpt):
            normalized = segment.lower()
            if segment.strip() and any(marker in normalized for marker in _TRADEOFF_MARKERS):
                statements.append(EvidenceStatement(
                    text=segment.strip(),
                    source_titles=[item.title],
                ))
    return statements[:8]


def build_compare_design_options_tool(retrieve: RetrievalFunction) -> ToolDefinition:
    def execute(payload: CompareDesignOptionsInput) -> CompareDesignOptionsOutput:
        a_items = evidence_from_chunks(retrieve(
            f"{payload.option_a} {payload.context}",
            "comparison_query",
            5,
            payload.profile,
        ))
        b_items = evidence_from_chunks(retrieve(
            f"{payload.option_b} {payload.context}",
            "comparison_query",
            5,
            payload.profile,
        ))
        all_items = evidence_from_chunks([
            evidence_item_to_chunk(item)
            for item in [*a_items, *b_items]
        ])
        top = top_similarity(all_items)
        limitations = [] if all_items else ["No evidence was found for either design option."]
        return CompareDesignOptionsOutput(
            option_a_evidence=a_items,
            option_b_evidence=b_items,
            shared_evidence=_shared_items(a_items, b_items),
            tradeoff_signals=_tradeoff_signals(all_items),
            top_similarity=top,
            evidence_tier=evidence_tier(top, has_results=bool(all_items)),
            limitations=limitations,
        )

    return ToolDefinition(
        name="compare_design_options",
        description="Compare two design options using official corpus evidence.",
        input_schema=CompareDesignOptionsInput,
        output_schema=CompareDesignOptionsOutput,
        executor=execute,
        status="read_only",
        requires_confirmation=False,
    )
