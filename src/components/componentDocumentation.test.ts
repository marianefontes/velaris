import { describe, expect, it } from "vitest";
import { COMPONENT_METADATA } from "./componentMetadata";
import { getComponentPractices } from "./componentPracticePresentation";
import { getComponentCatalog } from "./componentPresentation";
import {
  createInitialPlaygroundConfig,
  generateComponentSnippet,
} from "./componentWorkbench";

describe("component documentation contract", () => {
  it("keeps every component complete and equally structured", () => {
    const catalog = getComponentCatalog("pt-BR");

    expect(catalog).toHaveLength(25);
    catalog.forEach((component) => {
      const metadata = COMPONENT_METADATA.find((item) => item.component_id === component.id);
      const practices = getComponentPractices(component.id, "pt-BR");

      expect(metadata?.do).toHaveLength(5);
      expect(metadata?.dont).toHaveLength(5);
      expect(practices.dos).toHaveLength(5);
      expect(practices.donts).toHaveLength(5);
      expect(component.about.length).toBeGreaterThan(component.shortDescription.length);
      expect(component.aboutFeatures.length).toBeGreaterThanOrEqual(3);
      expect(component.aboutFeatures.length).toBeLessThanOrEqual(4);
      expect(component.commonUses.length).toBeGreaterThanOrEqual(4);
      expect(component.commonUses.length).toBeLessThanOrEqual(6);
      expect(new Set(component.aboutFeatures.map((feature) => feature.title)).size).toBe(
        component.aboutFeatures.length,
      );
      expect(component.aboutFeatures.every((feature) => (
        feature.icon.length > 0
        && feature.title.length > 3
        && feature.description.length > 20
      ))).toBe(true);
      expect(component.accessibility.summary.length).toBeGreaterThan(20);
      expect(component.accessibility.items.length).toBeGreaterThanOrEqual(5);
      expect(component.accessibility.criteria.length).toBeGreaterThanOrEqual(5);
      expect(new Set(component.accessibility.criteria.map((criterion) => criterion.title)).size).toBe(
        component.accessibility.criteria.length,
      );
      expect(component.accessibility.criteria.every((criterion) => (
        criterion.title.length > 3
        && criterion.description.length > 20
      ))).toBe(true);
      expect(component.beatriceGuidance.length).toBeGreaterThan(20);
      expect(component.states.length).toBeGreaterThan(0);
      expect(component.intents.length).toBeGreaterThan(0);
    });
  });

  it("generates a specific snippet for every component", () => {
    const catalog = getComponentCatalog("pt-BR");
    const snippets = catalog.map((component) => {
      const config = createInitialPlaygroundConfig(
        component.id,
        component.states,
        component.intents,
      );
      return generateComponentSnippet(component.id, config, "pt-BR");
    });

    expect(snippets.every((snippet) => snippet.trim().length > 20)).toBe(true);
    expect(new Set(snippets).size).toBe(catalog.length);
  });

  it("does not give Button an exclusive documentation contract", () => {
    const catalog = getComponentCatalog("pt-BR");
    const completeComponents = catalog.filter((component) => {
      const practices = getComponentPractices(component.id, "pt-BR");
      return (
        component.about.length > 0
        && component.aboutFeatures.length >= 3
        && component.commonUses.length >= 4
        && component.accessibility.items.length >= 5
        && component.accessibility.criteria.length >= 5
        && practices.dos.length === 5
        && practices.donts.length === 5
      );
    });

    expect(completeComponents).toHaveLength(catalog.length);
    expect(completeComponents.some((component) => component.id !== "button")).toBe(true);
    expect(new Set(catalog.map((component) => component.about)).size).toBe(catalog.length);
  });
});
