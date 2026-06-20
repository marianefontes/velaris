import type { ProfileId } from "../../types/beatrice";

export const PROFESSIONAL_PROFILE_IDS = [
  "dev",
  "designer",
  "product_designer",
  "qa",
  "tech_writer",
  "a11y",
  "maintainer",
  "design_system_manager",
] as const satisfies readonly ProfileId[];

export const INTERNAL_PROFILE_IDS = [
  "general",
  ...PROFESSIONAL_PROFILE_IDS,
] as const satisfies readonly ProfileId[];

export const LEGACY_PROFILE_ALIASES = {
  pm: "design_system_manager",
  writer: "tech_writer",
  // Partial migrations may still store the reframed lens id in localStorage.
  ux_specialist: "product_designer",
} as const;

const PROFILE_ID_SET = new Set<string>(INTERNAL_PROFILE_IDS);

export function normalizeProfileId(value: unknown): ProfileId | null {
  if (typeof value !== "string") return null;
  const candidate = value.trim();
  const normalized = LEGACY_PROFILE_ALIASES[candidate as keyof typeof LEGACY_PROFILE_ALIASES] ?? candidate;
  return PROFILE_ID_SET.has(normalized) ? normalized as ProfileId : null;
}

export function profileIdOrDefault(value: unknown, fallback: ProfileId = "general"): ProfileId {
  return normalizeProfileId(value) ?? fallback;
}

export function legacyProfileIdsFor(profileId: ProfileId): string[] {
  return Object.entries(LEGACY_PROFILE_ALIASES)
    .filter(([, canonical]) => canonical === profileId)
    .map(([legacy]) => legacy);
}

export function isCanonicalProfileId(value: unknown): value is ProfileId {
  return typeof value === "string" && PROFILE_ID_SET.has(value);
}
