import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { I18nProvider } from "../../../i18n/I18nProvider";
import { useAuditTrail } from "../../hooks/useAuditTrail";
import type { ChatMessage } from "../../types/beatrice";
import { AuditTrail } from "./AuditTrail";

vi.mock("../../hooks/useAuditTrail", () => ({
  useAuditTrail: vi.fn(),
}));

const message: ChatMessage = {
  id: "assistant-audit",
  role: "assistant",
  content: "Use Dialog.",
  decisionId: "dec_test",
  decisionStatus: "draft",
  sources: [
    {
      title: "Modal/Dialog",
      source: "Component Registry",
      similarity: 0.82,
      excerpt: "Use for blocking decisions that require explicit confirmation.",
    },
  ],
  auditMetadata: {
    request_id: "req_test",
    intent: "component_guidance",
    workflow: "component_decision",
    tools_used: [
      {
        name: "search_component",
        permission: "read_only",
        status: "completed",
      },
    ],
    steps: [
      {
        id: "request_received",
        label: "Request received",
        status: "completed",
      },
      {
        id: "tool_execution_failed",
        label: "Tool execution failed",
        status: "failed",
        details: "retrieval unavailable",
      },
    ],
    evidence_similarity: 0.82,
    evidence_tier: "strong",
    recommended_component: "Modal/Dialog",
    recommended_component_id: "modal-dialog",
    component_status: "stable",
    weighted_score: 0.902,
    selection_policy: "highest_weighted_score_among_active_candidates_with_partial_or_strong_evidence",
    selection_reason: "Modal/Dialog has the highest weighted_score among eligible candidates.",
    alternative_components: [
      {
        component_id: "alert",
        name: "Alert",
        status: "stable",
        weighted_score: 0.88,
        evidence_similarity: 0.79,
        evidence_tier: "strong",
      },
    ],
    used_do_rules: [
      {
        id: "modal-dialog.do.1",
        field: "do",
        text: "Use Dialog para decisões curtas que exigem confirmação.",
        rule_similarity: 0.76,
        sources: ["data/component-metadata.json#modal-dialog.do.1"],
      },
    ],
    missing_component_fields: ["intent", "accessibility.keyboard"],
    field_sources: {
      status: ["data/component-metadata.json#modal-dialog.status"],
    },
    response_validation_status: "fallback",
    validation_violation_type: "missing_required_limitation",
    fallback_used: true,
    fallback_reason: "The generated response omitted a required limitation.",
    limitations: ["Validation covers only retrieved corpus rules."],
    decision_id: "dec_test",
    decision_status: "draft",
    execution_status: "completed",
  },
};

function auditContext(updateDecisionStatus = vi.fn().mockResolvedValue(undefined)) {
  return {
    isOpen: true,
    mutationError: null,
    selectedMessage: message,
    updateDecisionStatus,
    updatingDecisionId: null,
    close: vi.fn(),
  } as unknown as ReturnType<typeof useAuditTrail>;
}

describe("AuditTrail", () => {
  beforeEach(() => {
    window.localStorage.setItem("aetheris.locale", "pt-BR");
  });

  it("renders real audit metadata, sources, evidence tier and failure steps", () => {
    vi.mocked(useAuditTrail).mockReturnValue(auditContext());

    render(
      <I18nProvider>
        <AuditTrail />
      </I18nProvider>,
    );

    expect(screen.getByText("component_decision")).toBeTruthy();
    expect(screen.getAllByText("strong").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Modal/Dialog").length).toBeGreaterThan(0);
    expect(screen.getByText("Alert")).toBeTruthy();
    expect(screen.getByText("modal-dialog.do.1")).toBeTruthy();
    expect(screen.getByText(/intent, accessibility.keyboard/)).toBeTruthy();
    expect(screen.getByText(/Fallback determinístico usado/)).toBeTruthy();
    expect(screen.getByText("Tool execution failed")).toBeTruthy();
    expect(screen.getByText("retrieval unavailable")).toBeTruthy();
  });

  it("requires an explicit action to confirm a decision draft", () => {
    const updateDecisionStatus = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useAuditTrail).mockReturnValue(auditContext(updateDecisionStatus));

    render(
      <I18nProvider>
        <AuditTrail />
      </I18nProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Confirmar decisão" }));

    expect(updateDecisionStatus).toHaveBeenCalledWith("dec_test", "confirmed");
  });
});
