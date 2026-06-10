import { describe, expect, it } from "vitest";
import legacySnapshot from "../../tests/fixtures/component-metadata-legacy-snapshot.json";
import {
  COMPONENT_METADATA,
  validateComponentCatalog,
} from "./componentMetadata";

describe("component metadata catalog", () => {
  it("preserves the legacy frontend and RAG component IDs", () => {
    const ids = COMPONENT_METADATA.map((component) => component.component_id);
    expect(ids).toEqual(legacySnapshot.frontend_component_ids);
    expect(ids).toEqual(legacySnapshot.rag_component_ids);
    expect(ids).toHaveLength(legacySnapshot.component_count);
  });

  it("distinguishes undocumented fields from reviewed empty lists", () => {
    const modal = COMPONENT_METADATA.find((component) => component.component_id === "modal-dialog");
    expect(modal?.edge_cases).toBeNull();
    expect(modal?.examples).toEqual([]);
  });

  it("rejects unsupported status values", () => {
    const invalid = structuredClone({
      schema_version: "1.0.0",
      components: COMPONENT_METADATA,
    }) as unknown as { components: Array<Record<string, unknown>> };
    invalid.components[0].status = "unknown";
    expect(() => validateComponentCatalog(invalid)).toThrow(/status/);
  });

  it("requires structured about content for every component", () => {
    const invalid = structuredClone({
      schema_version: "1.0.0",
      components: COMPONENT_METADATA,
    }) as unknown as { components: Array<Record<string, unknown>> };
    invalid.components[0].about_features = [];
    expect(() => validateComponentCatalog(invalid)).toThrow(/about_features/);
  });
});
