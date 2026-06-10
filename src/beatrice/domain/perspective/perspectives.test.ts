import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { submitChatRequest } from "../../orchestrators/chat.orchestrator";
import { readBeatriceHistory, BEATRICE_HISTORY_STORAGE_KEY } from "../../storage/beatriceStorage";
import { defaultBeatriceSettings } from "../../storage/beatriceStorage";
import { readCalibration } from "./calibration";
import { PERSONA_STRATEGIES } from "./lenses";
import { getPersonaOptions } from "./models";
import { normalizeProfileId, PROFESSIONAL_PROFILE_IDS } from "./profileIds";

const PROFESSIONAL_NAMES = [
  "Developer",
  "Designer",
  "Product Designer",
  "QA",
  "Tech Writer",
  "Accessibility Specialist",
  "Maintainer",
  "Design System Manager",
];

const FICTIONAL_NAMES = [
  "Adrian Vale",
  "Elena Voss",
  "Sofia Mercer",
  "Maya Sterling",
  "Lucien Ward",
  "Iris Holloway",
  "Kai Renner",
];

describe("professional Abraxos perspectives", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("exposes the eight canonical options with professional names", () => {
    const options = getPersonaOptions();

    expect(options.map((option) => option.id)).toEqual(PROFESSIONAL_PROFILE_IDS);
    expect(options.map((option) => option.label)).toEqual(PROFESSIONAL_NAMES);
  });

  it("keeps Designer, Product Designer and Design System Manager separate", () => {
    expect(PERSONA_STRATEGIES.designer.cognitiveProfile.vocabulary).toContain("tokens");
    expect(PERSONA_STRATEGIES.product_designer.cognitiveProfile.vocabulary).toContain("validation");
    expect(PERSONA_STRATEGIES.design_system_manager.cognitiveProfile.vocabulary).toContain("roadmap");

    expect(PERSONA_STRATEGIES.product_designer.identityStatement).toContain("research");
    expect(PERSONA_STRATEGIES.design_system_manager.identityStatement).toContain("governance");
    expect(PERSONA_STRATEGIES.product_designer.identityStatement).not.toContain("Product Manager");
  });

  it("contains no fictional professional identities in UI strategy data", () => {
    const serialized = JSON.stringify(PERSONA_STRATEGIES);
    FICTIONAL_NAMES.forEach((name) => expect(serialized).not.toContain(name));
  });

  it("normalizes only supported legacy aliases", () => {
    expect(normalizeProfileId("pm")).toBe("design_system_manager");
    expect(normalizeProfileId("writer")).toBe("tech_writer");
    expect(normalizeProfileId("product_designer")).toBe("product_designer");
    expect(normalizeProfileId("unknown")).toBeNull();
  });

  it("migrates legacy conversation profiles on read", () => {
    window.localStorage.setItem(BEATRICE_HISTORY_STORAGE_KEY, JSON.stringify({
      activeConversationId: "conversation-1",
      conversations: [{
        id: "conversation-1",
        title: "Legacy",
        profileId: "pm",
        messages: [],
        history: [],
      }],
    }));

    expect(readBeatriceHistory().conversations[0].profileId).toBe("design_system_manager");
  });

  it("migrates legacy calibration keys and removes the alias key", () => {
    window.localStorage.setItem("beatrice.calibration.writer", JSON.stringify({
      depth: "high",
      technicality: 0.45,
      risk_sensitivity: 0.4,
    }));

    expect(readCalibration("tech_writer")).toEqual({
      depth: "high",
      technicality: 0.45,
      risk_sensitivity: 0.4,
    });
    expect(window.localStorage.getItem("beatrice.calibration.writer")).toBeNull();
    expect(window.localStorage.getItem("beatrice.calibration.tech_writer")).not.toBeNull();
  });

  it("sends a canonical profile id in new chat requests", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await submitChatRequest(
      [{ role: "user", content: "Avalie a governança." }],
      "design_system_manager",
      undefined,
      defaultBeatriceSettings,
      "session-test",
    );

    const request = fetchMock.mock.calls[0][1] as RequestInit;
    expect(JSON.parse(String(request.body)).profile).toBe("design_system_manager");
  });
});
