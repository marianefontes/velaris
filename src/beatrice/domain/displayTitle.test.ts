import { describe, expect, it } from "vitest";
import { toDisplayTitle } from "./displayTitle";

describe("toDisplayTitle", () => {
  it("capitalizes Portuguese perspective titles", () => {
    expect(toDisplayTitle("escaneabilidade", "pt-BR")).toBe("Escaneabilidade");
    expect(toDisplayTitle("entropia visual", "pt-BR")).toBe("Entropia Visual");
    expect(toDisplayTitle("qualidade da hierarquia visual", "pt-BR")).toBe("Qualidade da Hierarquia Visual");
  });

  it("keeps English titles unchanged", () => {
    expect(toDisplayTitle("scanability", "en-US")).toBe("scanability");
  });
});
