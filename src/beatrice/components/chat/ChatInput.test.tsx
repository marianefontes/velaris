import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { I18nProvider } from "../../../i18n/I18nProvider";
import { usePersonaContext } from "../../hooks/usePersonaContext";
import {
  useWorkspaceComposer,
  useWorkspacePreferences,
} from "../../providers/WorkspaceProvider";
import { ChatInput } from "./ChatInput";

vi.mock("../../hooks/usePersonaContext", () => ({
  usePersonaContext: vi.fn(),
}));

vi.mock("../../providers/WorkspaceProvider", () => ({
  useWorkspaceComposer: vi.fn(),
  useWorkspacePreferences: vi.fn(),
}));

describe("ChatInput", () => {
  beforeEach(() => {
    window.localStorage.setItem("aetheris.locale", "pt-BR");
    vi.mocked(usePersonaContext).mockReturnValue({
      activePersonaContext: {
        label: "Accessibility Specialist",
        examples: ["Revise este fluxo"],
        theme: { panel: "border-white/10" },
      },
    } as unknown as ReturnType<typeof usePersonaContext>);
    vi.mocked(useWorkspacePreferences).mockReturnValue({
      settings: { density: "comfortable" },
    } as unknown as ReturnType<typeof useWorkspacePreferences>);
  });

  it("keeps a persistent accessible label and disables empty submission", () => {
    vi.mocked(useWorkspaceComposer).mockReturnValue({
      activeCommand: null,
      input: "",
      isLoading: false,
      setInput: vi.fn(),
      submitPrompt: vi.fn(),
      retryPrompt: vi.fn(),
    });

    render(
      <I18nProvider>
        <ChatInput />
      </I18nProvider>,
    );

    expect(screen.getByRole("textbox", { name: "Pergunta para Abraxos" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Enviar pergunta ao Abraxos" }).hasAttribute("disabled")).toBe(true);
  });

  it("enables submission when the composer contains text", () => {
    vi.mocked(useWorkspaceComposer).mockReturnValue({
      activeCommand: null,
      input: "Como tornar este componente acessível?",
      isLoading: false,
      setInput: vi.fn(),
      submitPrompt: vi.fn(),
      retryPrompt: vi.fn(),
    });

    render(
      <I18nProvider>
        <ChatInput />
      </I18nProvider>,
    );

    expect(screen.getByRole("button", { name: "Enviar pergunta ao Abraxos" }).hasAttribute("disabled")).toBe(false);
  });
});
