const ONBOARDING_SEEN_KEY = "aetheris.abraxos.onboarding.seen";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function hasSeenAbraxosOnboarding(): boolean {
  if (!canUseStorage()) return false;
  try {
    return window.localStorage.getItem(ONBOARDING_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

export function markAbraxosOnboardingSeen() {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(ONBOARDING_SEEN_KEY, "1");
  } catch {
    // localStorage may be unavailable in private browsing.
  }
}

export function resetAbraxosOnboardingSeen() {
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(ONBOARDING_SEEN_KEY);
  } catch {
    // ignore
  }
}
