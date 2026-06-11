import type { CSSProperties, ReactNode } from "react";
import { Waypoints } from "lucide-react";
import { readCalibration, writeCalibration } from "../domain/perspective/calibration";
import type { Calibration as DomainCalibration } from "../domain/perspective/calibration";
import type { Depth } from "../domain/perspective/lensInstrumentation";
import { legacyProfileIdsFor, normalizeProfileId } from "../domain/perspective/profileIds";
import type { ProfileId } from "../types/beatrice";

export interface Calibration {
  depth: Depth;
  technicality: number;
  riskSensitivity: number;
}

export function loadCalibration(profileId: ProfileId): Calibration | null {
  const stored = readCalibration(profileId);
  if (!stored) return null;
  return {
    depth: stored.depth,
    technicality: stored.technicality,
    riskSensitivity: stored.risk_sensitivity,
  };
}

export function persistCalibration(profileId: ProfileId, calibration: Calibration) {
  const domain: DomainCalibration = {
    depth: calibration.depth,
    technicality: calibration.technicality,
    risk_sensitivity: calibration.riskSensitivity,
  };
  writeCalibration(profileId, domain);
}

export interface PersistedTrial {
  id: string;
  query: string;
  savedAt: number;
  primaryId: ProfileId;
  primaryText: string;
  comparisonId: ProfileId | null;
  comparisonText: string | null;
}

const TRIALS_KEY_PREFIX = "beatrice.perspectiveTrials";
export const MAX_TRIALS_PER_LENS = 8;

function trialsStorageKey(profileId: ProfileId): string {
  return `${TRIALS_KEY_PREFIX}.${profileId}`;
}

export function loadTrials(profileId: ProfileId): PersistedTrial[] {
  if (typeof window === "undefined") return [];
  try {
    const canonicalKey = trialsStorageKey(profileId);
    const legacyKeys = legacyProfileIdsFor(profileId)
      .map((legacyId) => `${TRIALS_KEY_PREFIX}.${legacyId}`);
    const storedValues = [
      window.localStorage.getItem(canonicalKey),
      ...legacyKeys.map((key) => window.localStorage.getItem(key)),
    ].filter((raw): raw is string => Boolean(raw));
    if (storedValues.length === 0) return [];
    const parsed = storedValues.flatMap((raw) => {
      const value = JSON.parse(raw);
      return Array.isArray(value) ? value : [];
    });
    const trials = parsed.flatMap((entry): PersistedTrial[] => {
      if (
        !entry ||
        typeof entry.id !== "string" ||
        typeof entry.query !== "string" ||
        typeof entry.savedAt !== "number" ||
        typeof entry.primaryText !== "string"
      ) {
        return [];
      }
      const primaryId = normalizeProfileId(entry.primaryId);
      const comparisonId = entry.comparisonId === null ? null : normalizeProfileId(entry.comparisonId);
      if (!primaryId || primaryId === "general" || (entry.comparisonId !== null && !comparisonId)) return [];
      return [{
        ...entry,
        primaryId,
        comparisonId,
        comparisonText: typeof entry.comparisonText === "string" ? entry.comparisonText : null,
      }];
    });
    if (legacyKeys.some((key) => window.localStorage.getItem(key))) {
      window.localStorage.setItem(canonicalKey, JSON.stringify(trials));
      legacyKeys.forEach((key) => window.localStorage.removeItem(key));
    }
    return trials;
  } catch {
    return [];
  }
}

export function saveTrials(profileId: ProfileId, trials: PersistedTrial[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(trialsStorageKey(profileId), JSON.stringify(trials));
}

export const ADAPTATION_EXAMPLES: Partial<Record<ProfileId, string>> = {
  dev: `[Architectural framing]
Both components are valid contracts. The decision turns on state ownership
and lifecycle.

[Contract impact]
- Modal: imperative open/close, focus-trap built in, blocks page state
- SideDrawer: persistent route or stack entry, composable with multi-step flows

[Migration cost]
If checkout uses SideDrawer earlier, switching introduces inconsistent
dismissal semantics, with high downstream cost.

[Recommendation]
SideDrawer. Reuse the established contract.`,
  designer: `[Visual observation]
Modal interrupts. SideDrawer slides. The rest of the canvas stays as
peripheral context, which on a small viewport competes with the task.

[Cognitive flow]
Confirmation narrows attention. SideDrawer residual context distracts.

[Hierarchy implication]
Modal compresses the scan path to a single block and matches confirmation intent.

[Recommendation]
Modal. Calm single-focus layout, no secondary CTAs.`,
  a11y: `[Primary concern]
Focus management at confirmation. Both work; contracts differ.

[Modal]
- Built-in focus trap
- Returns focus to invoker on close (must be tested)
- Canonical AT announcement on open

[SideDrawer]
- Focus trap is implementer's responsibility and a frequent failure point
- Off-canvas content may remain in AT tree
- Risk: double announcement of underlying page

[Recommendation]
Modal. Safer contract for AT users at the confirmation step.`,
};

export function ZoneShell({
  id,
  eyebrow,
  title,
  caption,
  icon,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  caption?: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mb-12 scroll-mt-24">
      <header className="mb-4 flex items-baseline gap-3">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">
          {icon ?? <Waypoints className="h-3.5 w-3.5" aria-hidden />}
          {eyebrow}
        </span>
      </header>
      <h2 className="mb-2 font-serif text-xl tracking-tight text-white sm:text-2xl">{title}</h2>
      {caption ? <p className="mb-6 max-w-3xl text-sm leading-relaxed text-slate-400">{caption}</p> : null}
      {children}
    </section>
  );
}

export function shortLabel(label: string): string {
  return label.replace(/^Beatrice\s+/i, "").replace(/^Abraxos\s+/i, "");
}

export function capitalize<T extends string>(value: T): Capitalize<T> {
  return (value.charAt(0).toUpperCase() + value.slice(1)) as Capitalize<T>;
}

export function semanticIntensity(value: number): "low" | "medium" | "high" {
  if (value < 0.34) return "low";
  if (value < 0.67) return "medium";
  return "high";
}

export function hexForId(id: ProfileId): string {
  const map: Record<ProfileId, string> = {
    general: "#a999c6",
    dev: "#60a5fa",
    designer: "#c4b5fd",
    product_designer: "#e879f9",
    qa: "#86efac",
    tech_writer: "#7dd3fc",
    a11y: "#67e8f9",
    maintainer: "#fda4af",
    design_system_manager: "#fcd34d",
  };
  return map[id];
}

export function classForId(id: ProfileId, kind: "border" | "bg"): string {
  const map: Record<ProfileId, { border: string; bg: string }> = {
    general: { border: "border-primary/20", bg: "bg-primary/[0.04]" },
    dev: { border: "border-blue-400/20", bg: "bg-blue-400/[0.04]" },
    designer: { border: "border-violet-300/20", bg: "bg-violet-300/[0.04]" },
    product_designer: { border: "border-fuchsia-300/20", bg: "bg-fuchsia-300/[0.04]" },
    qa: { border: "border-green-300/20", bg: "bg-green-300/[0.04]" },
    tech_writer: { border: "border-sky-300/20", bg: "bg-sky-300/[0.04]" },
    a11y: { border: "border-cyan-300/20", bg: "bg-cyan-300/[0.04]" },
    maintainer: { border: "border-rose-300/20", bg: "bg-rose-300/[0.04]" },
    design_system_manager: { border: "border-amber-300/20", bg: "bg-amber-300/[0.04]" },
  };
  return map[id][kind];
}

export function sliderStyle(accent: string): CSSProperties {
  return { accentColor: accent };
}
