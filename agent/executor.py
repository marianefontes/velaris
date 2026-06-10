from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from pydantic import BaseModel

from .evidence import (
    evidence_from_chunks,
    evidence_item_to_chunk,
    evidence_tier,
    top_similarity,
)
from .models import (
    AgentPlan,
    EvidenceItem,
    ToolExecutionResult,
    ToolExecutionSummary,
)
from .planner import parse_comparison_options
from .policies import ToolPolicyContext, authorize_tool, validate_plan
from .registry import ToolRegistry


class ToolExecutionError(RuntimeError):
    def __init__(self, tool_name: str, message: str):
        super().__init__(message)
        self.tool_name = tool_name


@dataclass(frozen=True)
class PlanExecution:
    results: list[ToolExecutionResult]
    evidence: list[EvidenceItem]
    top_similarity: float
    evidence_tier: str
    limitations: list[str]
    failed_tools: list[str] = None  # type: ignore[assignment]

    def __post_init__(self) -> None:
        if self.failed_tools is None:
            object.__setattr__(self, "failed_tools", [])

    @property
    def all_tools_failed(self) -> bool:
        return bool(self.failed_tools) and not any(
            result.tool.status == "completed" for result in self.results
        )


def _tool_payload(
    name: str,
    query: str,
    profile: str,
    retrieval_query: str,
) -> dict[str, Any]:
    if name in {
        "search_component",
        "search_pattern",
        "search_token",
        "search_design_decision",
        "search_explainability",
    }:
        return {"query": retrieval_query, "profile": profile}
    if name == "validate_against_design_system":
        return {"subject": retrieval_query, "profile": profile}
    if name == "compare_design_options":
        option_a, option_b = parse_comparison_options(query)
        return {
            "option_a": option_a,
            "option_b": option_b,
            "context": query,
            "profile": profile,
        }
    raise ToolExecutionError(name, f"No input builder exists for tool {name}")


def _output_evidence(output: BaseModel) -> list[EvidenceItem]:
    raw_items: list[EvidenceItem] = []
    for field in (
        "items",
        "option_a_evidence",
        "option_b_evidence",
        "shared_evidence",
        "relevant_components",
        "relevant_patterns",
        "relevant_tokens",
        "relevant_guidelines",
    ):
        value = getattr(output, field, None)
        if isinstance(value, list):
            raw_items.extend(item for item in value if isinstance(item, EvidenceItem))
    return evidence_from_chunks([
        evidence_item_to_chunk(item)
        for item in raw_items
    ])


def execute_plan(
    plan: AgentPlan,
    *,
    registry: ToolRegistry,
    query: str,
    profile: str,
) -> PlanExecution:
    validate_plan(plan, registry.names())
    results: list[ToolExecutionResult] = []
    all_evidence: list[EvidenceItem] = []
    limitations: list[str] = []
    failed_tools: list[str] = []

    for tool_name in plan.tools:
        definition = registry.get(tool_name)
        authorize_tool(ToolPolicyContext(
            name=definition.name,
            permission=definition.status,
            requires_confirmation=definition.requires_confirmation,
        ))
        try:
            output = registry.execute(
                tool_name,
                _tool_payload(
                    tool_name,
                    query,
                    profile,
                    plan.understanding.retrieval_query or query,
                ),
            )
        except Exception as error:
            # A single failing tool must not abort the whole plan. Record the
            # failure, keep the other tools running and let the runtime decide
            # whether catalog fallback or a controlled message applies.
            print(
                f"[beatrice:executor] tool '{tool_name}' failed: "
                f"{type(error).__name__}: {error}"
            )
            failed_tools.append(tool_name)
            results.append(ToolExecutionResult(
                tool=ToolExecutionSummary(
                    name=tool_name,
                    permission=definition.status,
                    status="failed",
                ),
                output={"error": f"{type(error).__name__}: {error}"},
            ))
            limitations.append(
                f"Tool {tool_name} failed during evidence retrieval."
            )
            continue

        output_dict = output.model_dump(mode="json")
        results.append(ToolExecutionResult(
            tool=ToolExecutionSummary(
                name=tool_name,
                permission=definition.status,
                status="completed",
            ),
            output=output_dict,
        ))
        all_evidence.extend(_output_evidence(output))
        output_limitations = getattr(output, "limitations", [])
        if isinstance(output_limitations, list):
            limitations.extend(str(item) for item in output_limitations if str(item))

    evidence = evidence_from_chunks([
        evidence_item_to_chunk(item)
        for item in all_evidence
    ])
    top = top_similarity(evidence)
    return PlanExecution(
        results=results,
        evidence=evidence,
        top_similarity=top,
        evidence_tier=evidence_tier(top, has_results=bool(evidence)),
        limitations=list(dict.fromkeys(limitations)),
        failed_tools=failed_tools,
    )
