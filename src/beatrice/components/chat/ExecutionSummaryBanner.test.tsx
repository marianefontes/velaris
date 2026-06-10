import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { I18nProvider } from "../../../i18n/I18nProvider";
import type { ChatMessage } from "../../types/beatrice";
import { ExecutionSummaryBanner } from "./ExecutionSummaryBanner";

function deterministicMessage(
  userIntent: "greeting" | "help_request",
): ChatMessage {
  return {
    id: `assistant-${userIntent}`,
    role: "assistant",
    content: "Deterministic response",
    auditMetadata: {
      workflow: userIntent === "greeting" ? "greeting" : "documentation_help",
      user_intent: userIntent,
      evidence_tier: "not_required",
      tools_used: [],
    },
  };
}

describe("ExecutionSummaryBanner deterministic responses", () => {
  beforeEach(() => {
    window.localStorage.setItem("aetheris.locale", "pt-BR");
  });

  it("shows Greeting without an insufficient evidence label", () => {
    render(
      <I18nProvider>
        <ExecutionSummaryBanner message={deterministicMessage("greeting")} />
      </I18nProvider>,
    );

    expect(screen.getByText("Greeting")).toBeTruthy();
    expect(screen.queryByText(/evidência/i)).toBeNull();
    expect(screen.queryByText(/insufficient/i)).toBeNull();
  });

  it("shows Help Request without an evidence label", () => {
    render(
      <I18nProvider>
        <ExecutionSummaryBanner message={deterministicMessage("help_request")} />
      </I18nProvider>,
    );

    expect(screen.getByText("Help Request")).toBeTruthy();
    expect(screen.queryByText(/evidência/i)).toBeNull();
  });
});
