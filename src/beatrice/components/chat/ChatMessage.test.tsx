import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { I18nProvider } from "../../../i18n/I18nProvider";
import type { BeatriceSettings, ChatContent, ChatMessage as ChatMessageModel } from "../../types/beatrice";
import { ChatMessage } from "./ChatMessage";

const settings: BeatriceSettings = {
  streaming: true,
  autoScroll: true,
  showSources: true,
  showEvidenceSimilarity: true,
  density: "comfortable",
  blurIntensity: "medium",
  verbosity: "balanced",
  xaiDepth: "standard",
};

const message: ChatMessageModel = {
  id: "assistant-source",
  role: "assistant",
  content: "Use um Dialog com retorno de foco.",
  sources: [
    {
      title: "Modal Dialog",
      source: "Component Registry",
      similarity: 0.82,
      excerpt: "Use para decisões bloqueantes.",
    },
  ],
};

describe("ChatMessage source disclosure", () => {
  beforeEach(() => {
    window.localStorage.setItem("aetheris.locale", "pt-BR");
  });

  it("opens by button activation and closes with Escape", () => {
    render(
      <I18nProvider>
        <ChatMessage
          message={message}
          content={{} as ChatContent}
          settings={settings}
          evidenceLabel="Evidências"
          viewAllLabel="Ver todas"
        />
      </I18nProvider>,
    );

    const sourceButton = screen.getByRole("button", { name: /modal dialog/i });
    expect(sourceButton.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(sourceButton);
    expect(sourceButton.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("Component Registry")).toBeTruthy();

    fireEvent.keyDown(sourceButton, { key: "Escape" });
    expect(sourceButton.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByText("Component Registry")).toBeNull();
  });

  it("keeps long assistant responses in the conversation flow without an inner vertical scroller", () => {
    const longResponse = Array.from(
      { length: 24 },
      (_, index) => `Parágrafo ${index + 1}: conteúdo detalhado para validar leitura integral.`,
    ).join("\n\n");

    const { container } = render(
      <I18nProvider>
        <ChatMessage
          message={{ ...message, id: "assistant-long", content: longResponse, sources: [] }}
          content={{} as ChatContent}
          settings={settings}
          evidenceLabel="Evidências"
          viewAllLabel="Ver todas"
        />
      </I18nProvider>,
    );

    expect(screen.getByText(/Parágrafo 24:/)).toBeTruthy();
    expect(container.querySelector("article")?.className).not.toMatch(/max-h|overflow-y-auto/);
  });
});
