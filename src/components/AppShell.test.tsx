import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { I18nProvider } from "../i18n/I18nProvider";
import { AppShell } from "./AppShell";

vi.mock("../hooks/useStudyParticipantSession", () => ({
  useStudyParticipantSession: () => "none",
}));

vi.mock("../hooks/useLaboratorySnapshot", () => ({
  useLaboratorySnapshot: () => ({ snapshot: null }),
}));

vi.mock("../services/researchAdminAuth", () => ({
  readResearchAdminKey: () => null,
}));

vi.mock("../services/studyTracking", () => ({
  trackStudyEvent: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("./AppTopBar", () => ({
  AppTopBar: () => <header>Topbar</header>,
}));

vi.mock("./presence/BeatricePresence", () => ({
  BeatricePresence: () => null,
}));

vi.mock("./presence/AbraxosRouteTransition", () => ({
  AbraxosRouteTransition: () => null,
  getTransitionForPath: () => null,
  getPageEnterClass: () => "presence-page-enter-destination",
}));

vi.mock("../beatrice/components/assistant/AbraxosAssistantShell", () => ({
  AbraxosAssistantShell: () => (
    <button type="button" aria-label="Abrir Abraxos">
      Abraxos
    </button>
  ),
}));

describe("AppShell", () => {
  it("renders the skip link before a focusable main destination", () => {
    render(
      <MemoryRouter initialEntries={["/main"]}>
        <I18nProvider>
          <AppShell>
            <p>Conteúdo</p>
          </AppShell>
        </I18nProvider>
      </MemoryRouter>,
    );

    const skipLink = screen.getByRole("link", { name: "Pular para o conteúdo principal" });
    const main = screen.getByRole("main");

    expect(skipLink.getAttribute("href")).toBe("#main-content");
    expect(main.id).toBe("main-content");
    expect(main.getAttribute("tabindex")).toBe("-1");
  });

  it("renders the global Abraxos floating entry point", () => {
    render(
      <MemoryRouter initialEntries={["/components"]}>
        <I18nProvider>
          <AppShell>
            <p>Conteúdo</p>
          </AppShell>
        </I18nProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: "Abrir Abraxos" })).toBeTruthy();
  });
});
