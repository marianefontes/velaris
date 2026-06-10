import { describe, expect, it } from "vitest";
import { ABRAXOS_DRAGON_VIEWBOX } from "./AbraxosDragon";
import { NAVIGATION_PATH_VIEWBOX } from "./KnowledgeNavigationPath";

describe("Abraxos entity and navigation path", () => {
  it("uses separate viewBoxes for dragon entity and navigation path", () => {
    expect(ABRAXOS_DRAGON_VIEWBOX.width).toBe(512);
    expect(ABRAXOS_DRAGON_VIEWBOX.height).toBe(768);
    expect(NAVIGATION_PATH_VIEWBOX.width).toBe(140);
    expect(NAVIGATION_PATH_VIEWBOX.height).toBe(700);
  });
});
