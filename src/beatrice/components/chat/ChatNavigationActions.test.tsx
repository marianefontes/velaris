import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { PersonaProvider } from "../../providers/PersonaProvider";
import { ChatNavigationActions } from "./ChatNavigationActions";

function LocationProbe() {
  const location = useLocation();
  return <div data-testid="location">{`${location.pathname}${location.search}`}</div>;
}

describe("ChatNavigationActions", () => {
  it("navigates internal routes without full reload", () => {
    render(
      <MemoryRouter initialEntries={["/main"]}>
        <PersonaProvider locale="pt-BR">
          <Routes>
            <Route
              path="*"
              element={(
                <>
                  <ChatNavigationActions
                    navigationAction={{
                      label: "Abrir Tokens",
                      href: "/foundations?focus=tokens",
                      target_type: "section",
                      source: "route_map",
                      confidence: "exact",
                    }}
                  />
                  <LocationProbe />
                </>
              )}
            />
          </Routes>
        </PersonaProvider>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Abrir Tokens" }));
    expect(screen.getByTestId("location").textContent).toBe("/foundations?focus=tokens");
  });

  it("exposes an accessible label on the action button", () => {
    render(
      <MemoryRouter>
        <PersonaProvider locale="pt-BR">
          <ChatNavigationActions
            navigationAction={{
              label: "Abrir Button",
              href: "/components?component=button",
              target_type: "component",
              source: "catalog",
              confidence: "exact",
            }}
          />
        </PersonaProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: "Abrir Button" })).toBeTruthy();
  });

  it("opens external links in a new tab safely", () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    render(
      <MemoryRouter>
        <PersonaProvider locale="pt-BR">
          <ChatNavigationActions
            navigationAction={{
              label: "Open docs",
              href: "https://example.com/docs",
              target_type: "page",
              source: "manual_alias",
              confidence: "exact",
            }}
          />
        </PersonaProvider>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Open docs" }));
    expect(openSpy).toHaveBeenCalledWith(
      "https://example.com/docs",
      "_blank",
      "noopener,noreferrer",
    );
    openSpy.mockRestore();
  });

  it("sets the active profile and navigates for perspective actions", () => {
    render(
      <MemoryRouter initialEntries={["/oracle"]}>
        <PersonaProvider locale="pt-BR" initialProfileId="dev">
          <Routes>
            <Route
              path="*"
              element={(
                <>
                  <ChatNavigationActions
                    navigationAction={{
                      label: "Usar perspectiva Designer",
                      href: "/perspectives?profile=designer",
                      target_type: "perspective",
                      source: "perspective_registry",
                      confidence: "exact",
                      metadata: {
                        profileId: "designer",
                        action_type: "set_profile",
                      },
                    }}
                  />
                  <LocationProbe />
                </>
              )}
            />
          </Routes>
        </PersonaProvider>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Usar perspectiva Designer" }));
    expect(screen.getByTestId("location").textContent).toBe("/perspectives?profile=designer");
    expect(window.localStorage.getItem("beatrice.activePersona")).toBe("designer");
  });
});
