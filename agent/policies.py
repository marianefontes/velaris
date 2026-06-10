from __future__ import annotations

from dataclasses import dataclass

from .models import AgentPlan, ToolPermission


class PolicyViolation(ValueError):
    pass


@dataclass(frozen=True)
class ToolPolicyContext:
    name: str
    permission: ToolPermission
    requires_confirmation: bool
    requested_status: str | None = None
    confirmed: bool = False


def validate_plan(plan: AgentPlan, registered_tools: set[str]) -> None:
    if plan.workflow == "out_of_scope":
        if plan.tools:
            raise PolicyViolation("out_of_scope plans cannot select tools")
        return

    unknown = [tool for tool in plan.tools if tool not in registered_tools]
    if unknown:
        raise PolicyViolation(f"Unknown tools selected: {', '.join(unknown)}")


def authorize_tool(context: ToolPolicyContext) -> None:
    if context.permission == "read_only":
        return
    if context.name == "create_decision_record" and context.requested_status == "draft":
        return
    if context.requires_confirmation and not context.confirmed:
        raise PolicyViolation(f"Tool {context.name} requires confirmation")
    if not context.confirmed:
        raise PolicyViolation(f"Write action {context.name} is not authorized")
