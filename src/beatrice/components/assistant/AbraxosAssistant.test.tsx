import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { I18nProvider } from "../../../i18n/I18nProvider";
import { PersonaProvider } from "../../providers/PersonaProvider";
import { AbraxosAssistantProvider } from "../../providers/AbraxosAssistantProvider";
import { AbraxosAssistantShell } from "./AbraxosAssistantShell";
import { AskAbraxosButton } from "./AskAbraxosButton";
import { buildWelcomeMessage } from "../../domain/assistant/welcomeMessage";
import { resetAbraxosOnboardingSeen } from "../../domain/assistant/onboardingStorage";

vi.mock("../../hooks/useChatStream", () => ({
  useChatStream: () => vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../../storage/beatriceStorage", () => ({
  readBeatriceSettings: () => ({
    streaming: true,
    autoScroll: true,
    showSources: true,
    showEvidenceSimilarity: true,
    density: "comfortable",
    blurIntensity: "medium",
    verbosity: "balanced",
    xaiDepth: "standard",
  }),
}));

function renderAssistant(initialEntry = "/components") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <I18nProvider>
        <PersonaProvider locale="pt-BR">
          <AbraxosAssistantProvider>
            <Routes>
              <Route path="/components" element={<AbraxosAssistantShell />} />
              <Route path="/oracle" element={<AbraxosAssistantShell />} />
              <Route path="/main" element={<AbraxosAssistantShell />} />
            </Routes>
          </AbraxosAssistantProvider>
        </PersonaProvider>
      </I18nProvider>
    </MemoryRouter>,
  );
}

describe("Abraxos floating assistant", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetAbraxosOnboardingSeen();
  });

  it("renders the floating button on primary pages", () => {
    renderAssistant("/components");
    expect(screen.getByRole("button", { name: "Abrir Abraxos" })).toBeTruthy();
  });

  it("opens and closes the mini chat", async () => {
    renderAssistant("/components");

    fireEvent.click(screen.getByRole("button", { name: "Abrir Abraxos" }));
    expect(screen.getByRole("dialog", { name: /Abraxos/i })).toBeTruthy();
    expect(screen.getByText("Bem-vindo ao Abraxos.")).toBeTruthy();
    expect(screen.getByPlaceholderText("Pergunte algo sobre esta seção...")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Fechar painel do Abraxos" }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: /Abraxos/i })).toBeNull();
    });
  });

  it("shows the how-to guide on demand", () => {
    renderAssistant("/components");
    fireEvent.click(screen.getByRole("button", { name: "Abrir Abraxos" }));
    fireEvent.click(screen.getByRole("button", { name: "Começar conversa" }));
    fireEvent.click(screen.getByRole("button", { name: "Como usar o Abraxos" }));
    expect(screen.getByText("O que o agente faz")).toBeTruthy();
    expect(screen.getByText("João Fontes — Designer")).toBeTruthy();
  });

  it("does not auto-focus the input when the mini chat opens", () => {
    renderAssistant("/components");
    fireEvent.click(screen.getByRole("button", { name: "Abrir Abraxos" }));

    expect(document.activeElement).not.toBe(screen.getByPlaceholderText("Pergunte algo sobre esta seção..."));
  });

  it("navigates to full chat from the mini chat", async () => {
    function LocationProbe() {
      const location = useLocation();
      return <div data-testid="location">{location.pathname}</div>;
    }

    render(
      <MemoryRouter initialEntries={["/components"]}>
        <I18nProvider>
          <PersonaProvider locale="pt-BR">
            <AbraxosAssistantProvider>
              <LocationProbe />
              <Routes>
                <Route path="/components" element={<AbraxosAssistantShell />} />
                <Route path="/oracle" element={<AbraxosAssistantShell />} />
              </Routes>
            </AbraxosAssistantProvider>
          </PersonaProvider>
        </I18nProvider>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Abrir Abraxos" }));
    fireEvent.click(screen.getByRole("button", { name: "Abrir chat completo" }));

    await waitFor(() => {
      expect(screen.getByTestId("location").textContent).toBe("/oracle");
    });
  });

  it("hides the floating button on the full chat route", () => {
    renderAssistant("/oracle");
    expect(screen.queryByRole("button", { name: "Abrir Abraxos" })).toBeNull();
  });
});

describe("openAbraxos context", () => {
  beforeEach(() => {
    resetAbraxosOnboardingSeen();
  });

  it("opens with component-specific welcome copy", async () => {
    render(
      <MemoryRouter initialEntries={["/components"]}>
        <I18nProvider>
          <PersonaProvider locale="pt-BR">
            <AbraxosAssistantProvider>
              <AskAbraxosButton
                context={{
                  page: "Components",
                  section: "Button",
                  entity_type: "component",
                  entity_name: "Button",
                }}
              />
              <AbraxosAssistantShell />
            </AbraxosAssistantProvider>
          </PersonaProvider>
        </I18nProvider>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Perguntar ao Abraxos" }));

    expect(
      screen.getByText(buildWelcomeMessage({
        surface: "floating_assistant",
        page: "Components",
        section: "Button",
        entity_type: "component",
        entity_name: "Button",
      }, "pt-BR")),
    ).toBeTruthy();
    expect(screen.getByText("Components > Button")).toBeTruthy();
  });
});

describe("welcome message builder", () => {
  it("uses generic copy without specific section context", () => {
    expect(buildWelcomeMessage({ surface: "floating_assistant" }, "pt-BR")).toContain("componentes");
  });
});
