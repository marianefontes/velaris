import { beforeAll, describe, expect, it } from "vitest";
import legacySnapshot from "../../tests/fixtures/component-metadata-legacy-snapshot.json";
import {
  ensureComponentCatalog,
  getComponentMetadataList,
  validateComponentCatalog,
} from "./componentMetadata";

describe("component metadata catalog", () => {
  beforeAll(async () => {
    await ensureComponentCatalog();
  });

  it("preserves the legacy frontend and RAG component IDs", () => {
    const components = getComponentMetadataList();
    const ids = components.map((component) => component.component_id);
    expect(ids).toEqual(legacySnapshot.frontend_component_ids);
    expect(ids).toEqual(legacySnapshot.rag_component_ids);
    expect(ids).toHaveLength(legacySnapshot.component_count);
  });

  it("distinguishes legacy nullable fields from structured reviewed lists", () => {
    const components = getComponentMetadataList();
    const button = components.find((component) => component.component_id === "button");
    expect(button?.intent).toBeNull();
    expect(button?.intents?.length).toBeGreaterThan(0);

    const modal = components.find((component) => component.component_id === "modal-dialog");
    expect(modal?.edge_cases?.length).toBeGreaterThan(0);
    expect(modal?.examples?.length).toBeGreaterThan(0);
  });

  it("rejects unsupported status values", () => {
    const components = getComponentMetadataList();
    const invalid = structuredClone({
      schema_version: "1.0.0",
      components,
    }) as unknown as { components: Array<Record<string, unknown>> };
    invalid.components[0].status = "unknown";
    expect(() => validateComponentCatalog(invalid)).toThrow(/status/);
  });

  it("requires structured about content for every component", () => {
    const components = getComponentMetadataList();
    const invalid = structuredClone({
      schema_version: "1.0.0",
      components,
    }) as unknown as { components: Array<Record<string, unknown>> };
    invalid.components[0].about_features = [];
    expect(() => validateComponentCatalog(invalid)).toThrow(/about_features/);
  });
});
