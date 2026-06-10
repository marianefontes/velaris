from __future__ import annotations

from agent.models import CreateDecisionRecordInput, CreateDecisionRecordOutput
from agent.registry import ToolDefinition
from agent.store import AgentStore


def build_create_decision_record_tool(store: AgentStore) -> ToolDefinition:
    def execute(payload: CreateDecisionRecordInput) -> CreateDecisionRecordOutput:
        decision = store.create_decision(payload)
        return CreateDecisionRecordOutput(
            decision_id=decision["decision_id"],
            status="draft",
            created_at=decision["timestamp"],
        )

    return ToolDefinition(
        name="create_decision_record",
        description="Persist a Beatrice recommendation as a local draft decision.",
        input_schema=CreateDecisionRecordInput,
        output_schema=CreateDecisionRecordOutput,
        executor=execute,
        status="write_action",
        requires_confirmation=False,
    )
