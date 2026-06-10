import { afterEach, describe, expect, it, vi } from "vitest";
import { updateDecisionRecord } from "./decision.service";

describe("updateDecisionRecord", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("patches an explicit confirmed status", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        decision_id: "dec_test",
        status: "confirmed",
        confirmed_by_user: true,
        updated_at: "2026-06-07T00:00:00Z",
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await updateDecisionRecord("dec_test", "confirmed");

    expect(result.status).toBe("confirmed");
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/decisions/dec_test",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ status: "confirmed" }),
      }),
    );
  });

  it("preserves the API error instead of reporting a successful transition", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      status: 409,
      json: async () => ({ detail: "decision_status_conflict" }),
    }));

    await expect(
      updateDecisionRecord("dec_test", "rejected"),
    ).rejects.toThrow("decision_status_conflict");
  });
});
