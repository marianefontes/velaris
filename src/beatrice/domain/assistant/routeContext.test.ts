import { describe, expect, it } from "vitest";
import { buildRouteSurfaceContext } from "./routeContext";

describe("buildRouteSurfaceContext", () => {
  it("captures route, page title, perspective and locale", () => {
    const context = buildRouteSurfaceContext(
      "/components",
      "",
      "pt-BR",
      "Product Designer",
      (key) => (key === "routes.components" ? "Componentes" : key),
    );

    expect(context).toMatchObject({
      surface: "floating_assistant",
      route: "/components",
      page_title: "Componentes",
      active_perspective: "Product Designer",
      locale: "pt",
    });
  });
});
