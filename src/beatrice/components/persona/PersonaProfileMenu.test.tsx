import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { I18nProvider } from "../../../i18n/I18nProvider";
import { PersonaProvider } from "../../providers/PersonaProvider";
import { PersonaProfileMenu } from "./PersonaProfileMenu";

function renderMenu() {
  return render(
    <I18nProvider>
      <PersonaProvider locale="pt-BR">
        <PersonaProfileMenu />
      </PersonaProvider>
    </I18nProvider>,
  );
}

describe("PersonaProfileMenu", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("exposes an accessible name and expanded state on the trigger", () => {
    renderMenu();

    const trigger = screen.getByRole("button", {
      name: /abrir menu da perspectiva/i,
    });

    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("menu")).toBeTruthy();
    expect(screen.getAllByRole("menuitemradio", { checked: true })).toHaveLength(1);
  });

  it("closes with Escape and returns focus to the trigger", () => {
    renderMenu();

    const trigger = screen.getByRole("button", {
      name: /abrir menu da perspectiva/i,
    });
    fireEvent.click(trigger);
    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("menu")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("does not render the expandable profile detail sheet", () => {
    renderMenu();

    fireEvent.click(screen.getByRole("button", { name: /abrir menu da perspectiva/i }));

    expect(screen.queryByText("Responsabilidade principal")).toBeNull();
    expect(screen.queryByText("Estilo de análise e estrutura mental")).toBeNull();
  });
});
