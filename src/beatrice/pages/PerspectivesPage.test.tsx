import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { I18nProvider } from "../../i18n/I18nProvider";
import { PersonaProvider } from "../providers/PersonaProvider";
import { PerspectivesPage } from "./PerspectivesPage";

describe("PerspectivesPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("provides a unique programmatic name for each calibration slider", () => {
    render(
      <I18nProvider>
        <PersonaProvider locale="pt-BR">
          <PerspectivesPage />
        </PersonaProvider>
      </I18nProvider>,
    );

    expect(screen.getByRole("slider", { name: "Tecnicalidade" })).toBeTruthy();
    expect(screen.getByRole("slider", { name: "Sensibilidade a risco" })).toBeTruthy();
  });
});
