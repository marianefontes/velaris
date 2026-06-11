import { describe, expect, it } from "vitest";
import { buildOracleHref } from "./oracleNavigation";

describe("buildOracleHref", () => {
  it("returns plain oracle route without a prompt", () => {
    expect(buildOracleHref()).toBe("/oracle");
    expect(buildOracleHref("   ")).toBe("/oracle");
  });

  it("encodes prompts for deep links", () => {
    expect(buildOracleHref("Qual componente usar?")).toBe(
      "/oracle?q=Qual%20componente%20usar%3F",
    );
    expect(buildOracleHref("/governance")).toBe("/oracle?q=%2Fgovernance");
  });
});
