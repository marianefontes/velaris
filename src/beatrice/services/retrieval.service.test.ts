import { afterEach, describe, expect, it, vi } from "vitest";
import { checkApiHealth } from "./retrieval.service";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("Abraxos health check", () => {
  it("reports healthy using the configured backend URL", async () => {
    vi.stubEnv(
      "VITE_ORACLE_API_URL",
      "https://abraxos.example.com/api/chat",
    );
    vi.spyOn(console, "debug").mockImplementation(() => undefined);
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      status: "ok",
      corpus_chunks: 42,
      rag_active: true,
      embedder: "BAAI/bge-m3",
    }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await checkApiHealth();

    expect(result.healthy).toBe(true);
    expect(result.status).toBe(200);
    expect(result.url).toBe("https://abraxos.example.com/api/health");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://abraxos.example.com/api/health",
      expect.objectContaining({ cache: "no-store" }),
    );
  });

  it("reports unavailable when the health request cannot connect", async () => {
    vi.stubEnv("VITE_ORACLE_API_URL", "");
    vi.stubEnv("VITE_API_BASE_URL", "");
    vi.spyOn(console, "debug").mockImplementation(() => undefined);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("Failed to fetch")),
    );

    const result = await checkApiHealth();

    expect(result.healthy).toBe(false);
    expect(result.status).toBeNull();
    expect(result.url).toBe("/api/health");
  });
});
