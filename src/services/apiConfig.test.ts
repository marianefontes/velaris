import { afterEach, describe, expect, it, vi } from "vitest";
import { getApiConfiguration } from "./apiConfig";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("API configuration", () => {
  it("derives health from the explicit chat endpoint", () => {
    vi.stubEnv(
      "VITE_ORACLE_API_URL",
      "https://abraxos.example.com/api/chat",
    );
    vi.stubEnv("VITE_API_BASE_URL", "");

    expect(getApiConfiguration()).toEqual({
      apiBaseUrl: "https://abraxos.example.com/api",
      chatUrl: "https://abraxos.example.com/api/chat",
      configuredValue: "https://abraxos.example.com/api/chat",
      healthUrl: "https://abraxos.example.com/api/health",
      source: "VITE_ORACLE_API_URL",
    });
  });

  it("uses the shared API base when no chat endpoint is configured", () => {
    vi.stubEnv("VITE_ORACLE_API_URL", "");
    vi.stubEnv("VITE_API_BASE_URL", "https://abraxos.example.com");

    expect(getApiConfiguration()).toMatchObject({
      chatUrl: "https://abraxos.example.com/api/chat",
      healthUrl: "https://abraxos.example.com/api/health",
      source: "VITE_API_BASE_URL",
    });
  });

  it("falls back to the Vite proxy endpoints", () => {
    vi.stubEnv("VITE_ORACLE_API_URL", "");
    vi.stubEnv("VITE_API_BASE_URL", "");

    expect(getApiConfiguration()).toMatchObject({
      chatUrl: "/api/chat",
      healthUrl: "/api/health",
      source: "vite_proxy",
    });
  });
});
