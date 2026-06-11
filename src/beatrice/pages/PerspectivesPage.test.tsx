import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { I18nProvider } from "../../i18n/I18nProvider";
import { PersonaProvider } from "../providers/PersonaProvider";
import { PerspectivesPage } from "./PerspectivesPage";

function renderPage(initialEntry = "/perspectives") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <I18nProvider>
        <PersonaProvider locale="pt-BR">
          <PerspectivesPage />
        </PersonaProvider>
      </I18nProvider>
    </MemoryRouter>,
  );
}

describe("PerspectivesPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders identity section by default with persona selector", () => {
    renderPage();

    expect(screen.getByRole("tab", { name: /perspectivas/i })).toBeTruthy();
    expect(screen.getByRole("radiogroup", { name: "Perspectivas profissionais disponíveis" })).toBeTruthy();
    expect(screen.getByText("Responsabilidade principal")).toBeTruthy();
    expect(screen.queryByRole("slider")).toBeNull();
  });

  it("switches to cognition section via tab and shows calibration sliders", () => {
    renderPage();

    fireEvent.click(screen.getByRole("tab", { name: /cognição/i }));

    expect(screen.getByRole("slider", { name: "Tecnicalidade" })).toBeTruthy();
    expect(screen.getByRole("slider", { name: "Sensibilidade a risco" })).toBeTruthy();
    expect(screen.queryByRole("radiogroup")).toBeNull();
  });

  it("opens cognition section when focus query param is set", () => {
    renderPage("/perspectives?focus=cognition");

    expect(screen.getByRole("slider", { name: "Tecnicalidade" })).toBeTruthy();
  });
});
