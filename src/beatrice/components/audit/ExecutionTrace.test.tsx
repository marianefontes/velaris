import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ExecutionStep } from "../../types/beatrice";
import { ExecutionTrace } from "./ExecutionTrace";

describe("ExecutionTrace", () => {
  it("renders the required fallback when steps are absent", () => {
    render(<ExecutionTrace locale="pt-BR" />);

    expect(
      screen.getByText("Trilha de execução indisponível para esta resposta"),
    ).toBeTruthy();
  });

  it("renders only real steps supplied by audit metadata", () => {
    const steps: ExecutionStep[] = [
      {
        id: "request_received",
        label: "Request received",
        status: "completed",
        details: "Request accepted by the API.",
      },
      {
        id: "policy_checked",
        label: "Policy checked",
        status: "completed",
      },
    ];

    render(<ExecutionTrace steps={steps} locale="en-US" />);

    expect(screen.getByText("Request received")).toBeTruthy();
    expect(screen.getByText("Policy checked")).toBeTruthy();
    expect(screen.queryByText("LLM composition started")).toBeNull();
  });
});
