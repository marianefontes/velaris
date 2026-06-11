// ||| Perspectives · cognition section : how the active lens thinks.

import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { Archive, ChevronDown, Layers, ListOrdered, Play, ScanLine, SlidersHorizontal, Sparkles, Square, Trash2 } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import type { TranslationKey } from "../../i18n/translations";
import type { Depth, LensInstrumentation, TrustStyle } from "../domain/perspective/lensInstrumentation";
import { LENS_INSTRUMENTATION } from "../domain/perspective/lensInstrumentation";
import { normalizeProfileId } from "../domain/perspective/profileIds";
import { usePersonaContext } from "../hooks/usePersonaContext";
import {
  ADAPTATION_EXAMPLES,
  capitalize,
  classForId,
  hexForId,
  loadCalibration,
  loadTrials,
  MAX_TRIALS_PER_LENS,
  persistCalibration,
  saveTrials,
  semanticIntensity,
  shortLabel,
  sliderStyle,
  ZoneShell,
  type Calibration,
  type PersistedTrial,
} from "./perspectivePageShared";
import { runPerspectiveTrial } from "../services/perspectiveTrial.service";
import type { PersonaStrategy, ProfileId } from "../types/beatrice";

const CognitiveRadarChart = lazy(() =>
  import("../components/perspective/CognitiveRadarChart").then((module) => ({
    default: module.CognitiveRadarChart,
  })),
);

export function PerspectivesCognitionSection() {
  const [searchParams] = useSearchParams();
  const { profileId, setProfileId, options, activePersonaContext: activeLens } = usePersonaContext();
  const defaults = LENS_INSTRUMENTATION[profileId];

  useEffect(() => {
    const requestedProfile = normalizeProfileId(searchParams.get("profile"));
    if (requestedProfile && requestedProfile !== "general" && requestedProfile !== profileId) {
      setProfileId(requestedProfile);
    }
  }, [profileId, searchParams, setProfileId]);

  const [calibration, setCalibration] = useState<Calibration>(() => {
    return (
      loadCalibration(profileId) ?? {
        depth: defaults.depth,
        technicality: defaults.technicality,
        riskSensitivity: defaults.riskSensitivity,
      }
    );
  });

  // When the active lens changes, reload its calibration (stored or defaults).
  useEffect(() => {
    const stored = loadCalibration(profileId);
    setCalibration(stored ?? {
      depth: LENS_INSTRUMENTATION[profileId].depth,
      technicality: LENS_INSTRUMENTATION[profileId].technicality,
      riskSensitivity: LENS_INSTRUMENTATION[profileId].riskSensitivity,
    });
  }, [profileId]);

  // Persist on calibration change.
  useEffect(() => {
    persistCalibration(profileId, calibration);
  }, [profileId, calibration]);

  const [comparisonId, setComparisonId] = useState<ProfileId | null>(null);
  const [technicalOpen, setTechnicalOpen] = useState(false);

  // Filter to operational lenses (exclude 'general' from selectable list : that's the fallback).
  const lenses = useMemo(() => options.filter((option) => option.id !== "general"), [options]);

  // ── Trial persistence : list reloads when the active lens changes
  const [trials, setTrials] = useState<PersistedTrial[]>(() => loadTrials(profileId));
  const [trialToResume, setTrialToResume] = useState<PersistedTrial | null>(null);

  useEffect(() => {
    setTrials(loadTrials(profileId));
  }, [profileId]);

  const handleTrialPersist = useCallback(
    (trial: PersistedTrial) => {
      setTrials((current) => {
        const next = [trial, ...current.filter((entry) => entry.id !== trial.id)].slice(0, MAX_TRIALS_PER_LENS);
        saveTrials(profileId, next);
        return next;
      });
    },
    [profileId],
  );

  const handleTrialDelete = useCallback(
    (trialId: string) => {
      setTrials((current) => {
        const next = current.filter((entry) => entry.id !== trialId);
        saveTrials(profileId, next);
        return next;
      });
    },
    [profileId],
  );

  const handleTrialClear = useCallback(() => {
    saveTrials(profileId, []);
    setTrials([]);
  }, [profileId]);

  const handleTrialResume = useCallback((trial: PersistedTrial) => {
    // If the trial used a different comparison, set it so the preview reads correctly.
    setComparisonId(trial.comparisonId);
    setTrialToResume(trial);
  }, []);

  return (
    <>
      <ActiveLensIndicator lens={activeLens} calibration={calibration} />

      <ComparePinZone
        lenses={lenses}
        activeId={profileId}
        comparisonId={comparisonId}
        onCompare={(id) => setComparisonId((current) => (current === id ? null : id))}
      />

      {/* ZONE 5 : Cognitive profile visualization (radar) */}
      <CognitiveRadarZone
        primaryLabel={shortLabel(activeLens.label)}
        primaryAccent={hexForId(profileId)}
        primaryCalibration={calibration}
        comparisonLens={comparisonId ? lenses.find((lens) => lens.id === comparisonId) ?? null : null}
        comparisonCalibration={comparisonId ? LENS_INSTRUMENTATION[comparisonId] : null}
      />

      {/* ZONE 6 : Reasoning adaptation preview (worked example or live trial) */}
      <AdaptationPreviewZone
        primaryId={profileId}
        primaryLabel={shortLabel(activeLens.label)}
        comparisonId={comparisonId}
        comparisonLabel={comparisonId ? shortLabel(lenses.find((lens) => lens.id === comparisonId)?.label ?? "") : null}
        trials={trials}
        onTrialPersist={handleTrialPersist}
        resumeTrial={trialToResume}
        onResumed={() => setTrialToResume(null)}
      />

      {/* ZONE 6b : Trial history (per active lens) */}
      <TrialHistoryZone
        trials={trials}
        lenses={lenses}
        onResume={handleTrialResume}
        onDelete={handleTrialDelete}
        onClear={handleTrialClear}
      />

      {/* ZONE 7 : Information hierarchy diagram */}
      <InformationHierarchyZone hierarchy={defaults.informationHierarchy} accent={hexForId(profileId)} />

      {/* ZONE 8 : Perspective-specific signals */}
      <SignalsZone lens={activeLens} />

      {/* ZONE 9 : Trust calibration visualization */}
      <TrustCalibrationZone activeStyle={defaults.trustStyle} />

      {/* Calibrate panel : opens via ActiveLensIndicator CTA */}
      <CalibratePanel
        calibration={calibration}
        defaults={{
          depth: defaults.depth,
          technicality: defaults.technicality,
          riskSensitivity: defaults.riskSensitivity,
        }}
        onChange={setCalibration}
        accent={hexForId(profileId)}
      />

      {/* ZONE 10 : How Beatrice adapts (technical block, collapsed by default) */}
      <TechnicalDisclosure
        open={technicalOpen}
        onToggle={() => setTechnicalOpen((value) => !value)}
        lens={activeLens}
        profileId={profileId}
        calibration={calibration}
        defaults={defaults}
      />
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Active lens indicator
// ──────────────────────────────────────────────────────────────────────────

function ActiveLensIndicator({ lens, calibration }: { lens: PersonaStrategy; calibration: Calibration }) {
  const { t } = useI18n();
  const customised =
    calibration.depth !== LENS_INSTRUMENTATION[lens.id].depth ||
    Math.abs(calibration.technicality - LENS_INSTRUMENTATION[lens.id].technicality) > 0.001 ||
    Math.abs(calibration.riskSensitivity - LENS_INSTRUMENTATION[lens.id].riskSensitivity) > 0.001;

  return (
    <div
      className={`mb-10 flex items-center justify-between rounded-2xl border ${lens.theme.accentBorder} ${lens.theme.accentBg} px-5 py-3.5`}
      role="status"
      aria-live="polite"
      aria-label={t("perspectives.activeLens.status")}
    >
      <div className="flex min-w-0 items-center gap-4">
        <span className={`text-[10px] font-bold uppercase tracking-[0.28em] ${lens.theme.accentText}`}>
          {t("perspectives.activeLens.label")}
        </span>
        <span className="hidden h-4 w-px bg-white/15 sm:block" />
        <span className={`truncate text-sm font-semibold ${lens.theme.accentText}`}>
          {shortLabel(lens.label)}
        </span>
        <span className="hidden truncate text-xs text-slate-500 lg:block">: {lens.role}</span>
        {customised ? (
          <span className="ml-2 hidden rounded-full border border-white/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-slate-300 sm:inline">
            {t("perspectives.activeLens.calibratedBadge")}
          </span>
        ) : null}
      </div>
      <a
        href="#calibrate"
        className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-300 transition-colors hover:border-white/30 hover:text-white"
      >
        <SlidersHorizontal className="h-3 w-3" aria-hidden />
        {t("perspectives.activeLens.calibrateCta")}
      </a>
    </div>
  );
}

function ComparePinZone({
  lenses,
  activeId,
  comparisonId,
  onCompare,
}: {
  lenses: PersonaStrategy[];
  activeId: ProfileId;
  comparisonId: ProfileId | null;
  onCompare: (id: ProfileId) => void;
}) {
  const { t } = useI18n();
  return (
    <ZoneShell
      eyebrow={t("cognition.compare.eyebrow")}
      title={t("cognition.compare.title")}
      caption={t("cognition.compare.caption")}
    >
      <div className="flex flex-wrap gap-2">
        {lenses.map((lens) => {
          const isActive = lens.id === activeId;
          const isCompared = lens.id === comparisonId;
          if (isActive) return null;
          return (
            <button
              key={lens.id}
              type="button"
              onClick={() => onCompare(lens.id)}
              aria-pressed={isCompared}
              aria-label={t("perspectives.selector.pinAria").replace("{label}", shortLabel(lens.label))}
              className={`focus-ring rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                isCompared
                  ? `${lens.theme.accentBorder} ${lens.theme.accentBg} ${lens.theme.accentText}`
                  : "border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"
              }`}
            >
              {isCompared ? t("perspectives.selector.pinned") : shortLabel(lens.label)}
            </button>
          );
        })}
      </div>
    </ZoneShell>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// ZONE 5 : Cognitive radar visualization
// ──────────────────────────────────────────────────────────────────────────

function CognitiveRadarZone({
  primaryLabel,
  primaryAccent,
  primaryCalibration,
  comparisonLens,
  comparisonCalibration,
}: {
  primaryLabel: string;
  primaryAccent: string;
  primaryCalibration: Calibration;
  comparisonLens: PersonaStrategy | null;
  comparisonCalibration: LensInstrumentation | null;
}) {
  const { t } = useI18n();

  const radarData = useMemo(() => {
    const depthValue = (depth: Depth) => (depth === "low" ? 0.25 : depth === "medium" ? 0.55 : 0.9);
    return [
      {
        axis: t("perspectives.radar.axisDepth"),
        primary: depthValue(primaryCalibration.depth),
        comparison: comparisonCalibration ? depthValue(comparisonCalibration.depth) : 0,
      },
      {
        axis: t("perspectives.radar.axisTechnicality"),
        primary: primaryCalibration.technicality,
        comparison: comparisonCalibration?.technicality ?? 0,
      },
      {
        axis: t("perspectives.radar.axisRisk"),
        primary: primaryCalibration.riskSensitivity,
        comparison: comparisonCalibration?.riskSensitivity ?? 0,
      },
      {
        axis: t("perspectives.radar.axisTrust"),
        primary: primaryCalibration.technicality > 0.6 ? 0.85 : 0.45,
        comparison: comparisonCalibration
          ? comparisonCalibration.technicality > 0.6
            ? 0.85
            : 0.45
          : 0,
      },
      {
        axis: t("perspectives.radar.axisHierarchy"),
        primary: 0.6 + primaryCalibration.riskSensitivity * 0.3,
        comparison: comparisonCalibration ? 0.6 + comparisonCalibration.riskSensitivity * 0.3 : 0,
      },
    ];
  }, [primaryCalibration, comparisonCalibration, t]);

  return (
    <ZoneShell
      eyebrow={t("perspectives.radar.eyebrow")}
      title={t("perspectives.radar.title")}
      caption={t("perspectives.radar.caption")}
      icon={<ScanLine className="h-3.5 w-3.5" aria-hidden />}
    >
      <div className="grid gap-8 rounded-2xl border border-white/8 bg-white/[0.02] p-6 lg:grid-cols-[1fr_320px]">
        <div className="aspect-square w-full max-w-[480px] sm:aspect-[5/4]">
          <Suspense fallback={<div className="h-full w-full animate-pulse rounded-2xl bg-white/[0.03]" />}>
            <CognitiveRadarChart
              data={radarData}
              primaryLabel={primaryLabel}
              primaryAccent={primaryAccent}
              comparisonLabel={comparisonLens ? shortLabel(comparisonLens.label) : ""}
              showComparison={Boolean(comparisonCalibration)}
            />
          </Suspense>
        </div>

        {/* AT-friendly table fallback : same values, accessible to screen readers. */}
        <table className="hidden text-xs lg:block">
          <caption className="sr-only">
            {comparisonLens
              ? t("perspectives.radar.comparisonCaption")
              : t("perspectives.radar.tableCaption")}
          </caption>
          <thead>
            <tr className="border-b border-white/10 text-left text-[10px] uppercase tracking-widest text-slate-500">
              <th className="py-2 pr-4 font-semibold">{t("perspectives.radar.dimensionColumn")}</th>
              <th className="py-2 pr-4 font-semibold" style={{ color: primaryAccent }}>{primaryLabel}</th>
              {comparisonLens ? (
                <th className="py-2 font-semibold text-slate-400">{shortLabel(comparisonLens.label)}</th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {radarData.map((row) => (
              <tr key={row.axis}>
                <td className="py-2 pr-4 text-slate-400">{row.axis}</td>
                <td className="py-2 pr-4 font-mono">{Math.round(row.primary * 100)}%</td>
                {comparisonLens ? (
                  <td className="py-2 font-mono text-slate-500">{Math.round(row.comparison * 100)}%</td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ZoneShell>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// ZONE 6 : Reasoning adaptation preview (worked example, side-by-side)
// ──────────────────────────────────────────────────────────────────────────

function AdaptationPreviewZone({
  primaryId,
  primaryLabel,
  comparisonId,
  comparisonLabel,
  trials,
  onTrialPersist,
  resumeTrial,
  onResumed,
}: {
  primaryId: ProfileId;
  primaryLabel: string;
  comparisonId: ProfileId | null;
  comparisonLabel: string | null;
  trials: PersistedTrial[];
  onTrialPersist: (trial: PersistedTrial) => void;
  resumeTrial: PersistedTrial | null;
  onResumed: () => void;
}) {
  const { t } = useI18n();
  const [trialQuery, setTrialQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  const [primaryText, setPrimaryText] = useState("");
  const [comparisonText, setComparisonText] = useState("");
  const [primaryStatus, setPrimaryStatus] = useState<TrialStatus>("idle");
  const [comparisonStatus, setComparisonStatus] = useState<TrialStatus>("idle");
  const abortRef = useRef<AbortController | null>(null);

  const persistRef = useRef(onTrialPersist);
  persistRef.current = onTrialPersist;

  const runTrial = async () => {
    const query = trialQuery.trim();
    if (!query) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setSubmittedQuery(query);
    setPrimaryText("");
    setComparisonText("");
    setPrimaryStatus("streaming");
    setComparisonStatus(comparisonId ? "streaming" : "idle");

    let finalPrimary = "";
    let finalComparison = "";

    const primaryRun = runPerspectiveTrial({
      query,
      profileId: primaryId,
      signal: controller.signal,
      onDelta: (text) => {
        finalPrimary = text;
        setPrimaryText(text);
      },
    })
      .then(() => setPrimaryStatus("done"))
      .catch((error) => {
        if (controller.signal.aborted) return;
        setPrimaryStatus("error");
        finalPrimary = `${friendlyError(error, t)}`;
        setPrimaryText(finalPrimary);
      });

    const comparisonRun = comparisonId
      ? runPerspectiveTrial({
          query,
          profileId: comparisonId,
          signal: controller.signal,
          onDelta: (text) => {
            finalComparison = text;
            setComparisonText(text);
          },
        })
          .then(() => setComparisonStatus("done"))
          .catch((error) => {
            if (controller.signal.aborted) return;
            setComparisonStatus("error");
            finalComparison = `${friendlyError(error, t)}`;
            setComparisonText(finalComparison);
          })
      : Promise.resolve();

    await Promise.all([primaryRun, comparisonRun]);

    // Persist if the primary actually produced text (avoid storing aborted nothings).
    if (!controller.signal.aborted && finalPrimary && !finalPrimary.startsWith("")) {
      persistRef.current({
        id: `trial-${Date.now()}`,
        query,
        savedAt: Date.now(),
        primaryId,
        primaryText: finalPrimary,
        comparisonId: comparisonId ?? null,
        comparisonText: finalComparison || null,
      });
    }
  };

  const stopTrial = () => {
    abortRef.current?.abort();
    setPrimaryStatus((s) => (s === "streaming" ? "stopped" : s));
    setComparisonStatus((s) => (s === "streaming" ? "stopped" : s));
  };

  const isStreaming = primaryStatus === "streaming" || comparisonStatus === "streaming";

  useEffect(() => () => abortRef.current?.abort(), []);

  // When the user changes lens or pinning, clear current trial view.
  useEffect(() => {
    if (submittedQuery) {
      setPrimaryText("");
      setComparisonText("");
      setSubmittedQuery(null);
      setPrimaryStatus("idle");
      setComparisonStatus("idle");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primaryId, comparisonId]);

  // Replay a saved trial.
  useEffect(() => {
    if (!resumeTrial) return;
    abortRef.current?.abort();
    setSubmittedQuery(resumeTrial.query);
    setTrialQuery(resumeTrial.query);
    setPrimaryText(resumeTrial.primaryText);
    setComparisonText(resumeTrial.comparisonText ?? "");
    setPrimaryStatus("done");
    setComparisonStatus(resumeTrial.comparisonText ? "done" : "idle");
    onResumed();
  }, [resumeTrial, onResumed]);

  const showLive = submittedQuery !== null;

  return (
    <ZoneShell
      eyebrow={showLive ? t("perspectives.adaptation.eyebrowLive") : t("perspectives.adaptation.eyebrowStatic")}
      title={t("perspectives.adaptation.title")}
      caption={
        comparisonId
          ? t("perspectives.adaptation.captionPin")
          : t("perspectives.adaptation.captionNoPin")
      }
      icon={<Layers className="h-3.5 w-3.5" aria-hidden />}
    >
      {/* Trial query input */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!isStreaming) void runTrial();
        }}
        className="mb-4 flex min-w-0 items-stretch gap-2 rounded-2xl border border-white/10 bg-black/30 p-2"
      >
        <label htmlFor="trial-query" className="sr-only">
          {t("perspectives.adaptation.inputAriaLabel")}
        </label>
        <input
          id="trial-query"
          type="text"
          value={trialQuery}
          onChange={(event) => setTrialQuery(event.target.value)}
          placeholder={t("perspectives.adaptation.inputPlaceholder")}
          disabled={isStreaming}
          className="focus-ring min-h-11 min-w-0 flex-1 rounded-lg bg-transparent px-3 py-2 font-mono text-xs text-slate-200 placeholder:text-slate-600 disabled:opacity-50"
        />
        {isStreaming ? (
          <button
            type="button"
            onClick={stopTrial}
            className="focus-ring inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] px-3.5 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-200 transition-colors hover:border-white/30"
          >
            <Square className="h-3 w-3" aria-hidden />
            {t("perspectives.adaptation.stop")}
          </button>
        ) : (
          <button
            type="submit"
            disabled={!trialQuery.trim()}
            className="focus-ring inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/15 px-3.5 py-2 text-[10px] font-bold uppercase tracking-widest text-primary transition-colors hover:bg-primary/25 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Play className="h-3 w-3" aria-hidden />
            {t("perspectives.adaptation.runLive")}
          </button>
        )}
      </form>

      {showLive ? (
        <LiveAdaptationResult
          query={submittedQuery!}
          primaryId={primaryId}
          primaryLabel={primaryLabel}
          primaryText={primaryText}
          primaryStatus={primaryStatus}
          comparisonId={comparisonId}
          comparisonLabel={comparisonLabel}
          comparisonText={comparisonText}
          comparisonStatus={comparisonStatus}
        />
      ) : (
        <StaticAdaptationExample />
      )}

      <p className="mt-4 text-xs leading-relaxed text-slate-500">
        {showLive
          ? t("perspectives.adaptation.footnoteLive")
          : t("perspectives.adaptation.footnoteStatic")}
      </p>

      {/* Hint about persisted trials, surfaced only when there are saved entries */}
      {trials.length > 0 ? (
        <p className="mt-2 text-[11px] text-slate-600">
          {t("perspectives.trials.eyebrow")} · {trials.length}
        </p>
      ) : null}
    </ZoneShell>
  );
}

type TrialStatus = "idle" | "streaming" | "done" | "stopped" | "error";

function StaticAdaptationExample() {
  const { t } = useI18n();
  const lensIds: ProfileId[] = ["dev", "designer", "a11y"];
  return (
    <>
      <div className="mb-4 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-xs text-slate-300">
        <span className="mr-2 text-[10px] uppercase tracking-widest text-slate-500">
          {t("perspectives.adaptation.labelExample")}
        </span>
        {t("perspectives.adaptation.inputPlaceholder")}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {lensIds.map((id) => (
          <article
            key={id}
            className={`flex flex-col rounded-2xl border ${classForId(id, "border")} ${classForId(id, "bg")} p-5`}
          >
            <header
              className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-widest"
              style={{ color: hexForId(id) }}
            >
              <span>{t(`perspectives.lensTitle.${id}`)}</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-500">{t(`perspectives.trust.styles.${LENS_INSTRUMENTATION[id].trustStyle}`)}</span>
            </header>
            <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-slate-300">
              {ADAPTATION_EXAMPLES[id]}
            </pre>
          </article>
        ))}
      </div>
    </>
  );
}

function LiveAdaptationResult({
  query,
  primaryId,
  primaryLabel,
  primaryText,
  primaryStatus,
  comparisonId,
  comparisonLabel,
  comparisonText,
  comparisonStatus,
}: {
  query: string;
  primaryId: ProfileId;
  primaryLabel: string;
  primaryText: string;
  primaryStatus: TrialStatus;
  comparisonId: ProfileId | null;
  comparisonLabel: string | null;
  comparisonText: string;
  comparisonStatus: TrialStatus;
}) {
  const { t } = useI18n();
  const columns = comparisonId ? 2 : 1;
  return (
    <>
      <div className="mb-4 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-xs text-slate-300">
        <span className="mr-2 text-[10px] uppercase tracking-widest text-slate-500">
          {t("perspectives.adaptation.labelTrial")}
        </span>
        {query}
      </div>
      <div className={`grid gap-4 ${columns === 2 ? "lg:grid-cols-2" : "lg:grid-cols-1"}`}>
        <LiveLensColumn
          lensId={primaryId}
          label={primaryLabel}
          text={primaryText}
          status={primaryStatus}
        />
        {comparisonId && comparisonLabel ? (
          <LiveLensColumn
            lensId={comparisonId}
            label={comparisonLabel}
            text={comparisonText}
            status={comparisonStatus}
          />
        ) : null}
      </div>
    </>
  );
}

function LiveLensColumn({
  lensId,
  label,
  text,
  status,
}: {
  lensId: ProfileId;
  label: string;
  text: string;
  status: TrialStatus;
}) {
  const { t } = useI18n();
  return (
    <article
      className={`flex flex-col rounded-2xl border ${classForId(lensId, "border")} ${classForId(lensId, "bg")} p-5`}
      aria-busy={status === "streaming"}
    >
      <header
        className="mb-3 flex items-center justify-between gap-2 text-[10px] uppercase tracking-widest"
        style={{ color: hexForId(lensId) }}
      >
        <div className="flex items-center gap-2">
          <span>{label}</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-500">{t(`perspectives.trust.styles.${LENS_INSTRUMENTATION[lensId].trustStyle}`)}</span>
        </div>
        <span className={`font-mono ${statusToneClass(status)}`}>{t(`perspectives.adaptation.status.${status === "idle" ? "ready" : status}`)}</span>
      </header>
      {text ? (
        <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-slate-300">{text}</pre>
      ) : (
        <div className="flex h-32 items-center justify-center text-[11px] text-slate-600">
          {status === "streaming"
            ? t("perspectives.adaptation.waitingDelta")
            : t("perspectives.adaptation.empty")}
        </div>
      )}
    </article>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// ZONE 6b : Saved trials history
// ──────────────────────────────────────────────────────────────────────────

function TrialHistoryZone({
  trials,
  lenses,
  onResume,
  onDelete,
  onClear,
}: {
  trials: PersistedTrial[];
  lenses: PersonaStrategy[];
  onResume: (trial: PersistedTrial) => void;
  onDelete: (trialId: string) => void;
  onClear: () => void;
}) {
  const { t, locale } = useI18n();
  const lensLabel = useCallback(
    (id: ProfileId) => shortLabel(lenses.find((lens) => lens.id === id)?.label ?? id),
    [lenses],
  );
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    [locale],
  );

  return (
    <ZoneShell
      eyebrow={t("perspectives.trials.eyebrow")}
      title={t("perspectives.trials.title")}
      caption={t("perspectives.trials.caption")}
      icon={<Archive className="h-3.5 w-3.5" aria-hidden />}
    >
      {trials.length === 0 ? (
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-5 py-10 text-center text-xs text-slate-500">
          {t("perspectives.trials.empty")}
        </div>
      ) : (
        <>
          <ul className="divide-y divide-white/8 overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02]">
            {trials.map((trial) => (
              <li key={trial.id} className="flex items-stretch gap-3 px-4 py-3">
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="truncate font-mono text-xs text-slate-200">{trial.query}</p>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-widest text-slate-500">
                    <span style={{ color: hexForId(trial.primaryId) }}>{lensLabel(trial.primaryId)}</span>
                    {trial.comparisonId ? (
                      <>
                        <span className="text-slate-600">{t("perspectives.trials.comparedWith")}</span>
                        <span style={{ color: hexForId(trial.comparisonId) }}>{lensLabel(trial.comparisonId)}</span>
                      </>
                    ) : null}
                    <span className="text-slate-600">·</span>
                    <span className="font-normal normal-case tracking-normal text-slate-500">
                      {t("perspectives.trials.savedAt")} {dateFormatter.format(trial.savedAt)}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onResume(trial)}
                    className="rounded-full border border-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-200 transition-colors hover:border-white/30 hover:text-white"
                  >
                    {t("perspectives.trials.replay")}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(trial.id)}
                    aria-label={t("perspectives.trials.delete")}
                    className="rounded-full border border-white/10 p-1.5 text-slate-500 transition-colors hover:border-white/25 hover:text-slate-200"
                  >
                    <Trash2 className="h-3 w-3" aria-hidden />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={onClear}
              className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500 transition-colors hover:border-white/25 hover:text-slate-200"
            >
              {t("perspectives.trials.clear")}
            </button>
          </div>
        </>
      )}
    </ZoneShell>
  );
}

function statusToneClass(status: TrialStatus): string {
  switch (status) {
    case "streaming":
      return "text-primary animate-pulse";
    case "done":
      return "text-green-400";
    case "stopped":
      return "text-amber-400";
    case "error":
      return "text-red-400";
    default:
      return "text-slate-500";
  }
}

function friendlyError(error: unknown, t: (key: TranslationKey) => string): string {
  if (error instanceof Error) {
    if (error.message.startsWith("backend_error:")) {
      return `${t("perspectives.adaptation.errorPrefix")} (${error.message.split(":").slice(1).join(":")})`;
    }
    return error.message;
  }
  return t("perspectives.adaptation.errorGeneric");
}

// ──────────────────────────────────────────────────────────────────────────
// ZONE 7 : Information hierarchy diagram
// ──────────────────────────────────────────────────────────────────────────

function InformationHierarchyZone({ hierarchy, accent }: { hierarchy: string[]; accent: string }) {
  const { t } = useI18n();
  return (
    <ZoneShell
      eyebrow={t("perspectives.hierarchy.eyebrow")}
      title={t("perspectives.hierarchy.title")}
      caption={t("perspectives.hierarchy.caption")}
      icon={<ListOrdered className="h-3.5 w-3.5" aria-hidden />}
    >
      <ol className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02]">
        {hierarchy.map((section, index) => (
          <li key={section} className="flex items-stretch border-b border-white/5 last:border-b-0">
            <div
              className="flex w-14 shrink-0 items-center justify-center border-r border-white/8 font-mono text-xs"
              style={{ color: accent }}
            >
              {String(index + 1).padStart(2, "0")}
            </div>
            <div className="flex flex-1 items-center px-5 py-3.5 text-sm text-slate-200">{section}</div>
            <div className="flex shrink-0 items-center pr-5 text-[10px] uppercase tracking-widest text-slate-500">
              {index === 0
                ? t("perspectives.hierarchy.tagLead")
                : index === hierarchy.length - 1
                  ? t("perspectives.hierarchy.tagClose")
                  : t("perspectives.hierarchy.tagBuild")}
            </div>
          </li>
        ))}
      </ol>
    </ZoneShell>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// ZONE 8 : Perspective signals
// ──────────────────────────────────────────────────────────────────────────

function SignalsZone({ lens }: { lens: PersonaStrategy }) {
  const { t } = useI18n();
  const flags = lens.cognitiveProfile.alertPatterns.slice(0, 6);
  const vocabulary = lens.cognitiveProfile.vocabulary.slice(0, 8);
  const deprioritised = lens.cognitiveProfile.tradeOffs.slice(0, 3);

  return (
    <ZoneShell
      eyebrow={t("perspectives.signals.eyebrow")}
      title={t("perspectives.signals.title")}
      caption={t("perspectives.signals.caption")}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <SignalPanel title={t("perspectives.signals.panelFlags")}>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {flags.map((flag) => (
              <li key={flag} className="flex items-start gap-2">
                <span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${lens.theme.signal}`} aria-hidden />
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </SignalPanel>
        <SignalPanel title={t("perspectives.signals.panelVocab")}>
          <div className="flex flex-wrap gap-1.5">
            {vocabulary.map((term) => (
              <span
                key={term}
                className={`rounded-full border ${lens.theme.accentBorder} ${lens.theme.accentBg} px-2.5 py-0.5 text-[11px] ${lens.theme.accentText}`}
              >
                {term}
              </span>
            ))}
          </div>
        </SignalPanel>
        <SignalPanel title={t("perspectives.signals.panelResists")}>
          <ul className="space-y-2 text-xs text-slate-300">
            {deprioritised.map((tradeOff) => (
              <li key={tradeOff.resists}>
                <div className="text-slate-500">{t("perspectives.signals.favors")}</div>
                <div className="text-slate-200">{tradeOff.favors}</div>
                <div className="mt-1 text-slate-500">{t("perspectives.signals.resists")}</div>
                <div className="text-slate-400">{tradeOff.resists}</div>
              </li>
            ))}
          </ul>
        </SignalPanel>
      </div>
    </ZoneShell>
  );
}

function SignalPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
      <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">{title}</h3>
      {children}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// ZONE 9 : Trust calibration visualization
// ──────────────────────────────────────────────────────────────────────────

function TrustCalibrationZone({ activeStyle }: { activeStyle: TrustStyle }) {
  const { t } = useI18n();
  const styles: TrustStyle[] = ["quantified", "qualitative", "comparative"];

  return (
    <ZoneShell
      eyebrow={t("perspectives.trust.eyebrow")}
      title={t("perspectives.trust.title")}
      caption={t("perspectives.trust.caption")}
    >
      <div className="grid gap-3 lg:grid-cols-3">
        {styles.map((style) => {
          const isActive = style === activeStyle;
          return (
            <div
              key={style}
              className={`rounded-2xl border p-4 transition-all ${
                isActive ? "border-primary/30 bg-primary/[0.06]" : "border-white/8 bg-white/[0.02]"
              }`}
            >
              <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.22em]">
                <span className={isActive ? "text-primary" : "text-slate-500"}>{t(`perspectives.trust.styles.${style}`)}</span>
                {isActive ? <span className="text-primary">{t("perspectives.trust.active")}</span> : null}
              </div>
              <div
                className={`mb-3 inline-flex rounded-full px-2.5 py-1 text-[11px] font-mono ${
                  isActive ? "bg-primary/15 text-primary" : "bg-white/[0.06] text-slate-300"
                }`}
              >
                {t(`perspectives.trust.sample.${style}`)}
              </div>
              <p className="text-xs leading-relaxed text-slate-400">{t(`perspectives.trust.rationale.${style}`)}</p>
            </div>
          );
        })}
      </div>
    </ZoneShell>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Calibrate panel : the user-tunable knobs
// ──────────────────────────────────────────────────────────────────────────

function CalibratePanel({
  calibration,
  defaults,
  onChange,
  accent,
}: {
  calibration: Calibration;
  defaults: { depth: Depth; technicality: number; riskSensitivity: number };
  onChange: (next: Calibration) => void;
  accent: string;
}) {
  const { t } = useI18n();
  const accentStyle = sliderStyle(accent);
  const isDirty =
    calibration.depth !== defaults.depth ||
    Math.abs(calibration.technicality - defaults.technicality) > 0.001 ||
    Math.abs(calibration.riskSensitivity - defaults.riskSensitivity) > 0.001;

  const depthLabel = (depth: Depth) => t(`perspectives.calibrate.depth${capitalize(depth)}`);
  const depthCaption = (depth: Depth) => t(`perspectives.calibrate.depth${capitalize(depth)}Caption`);
  const intensity = (value: number) => t(`perspectives.calibrate.intensity${capitalize(semanticIntensity(value))}`);

  return (
    <ZoneShell
      id="calibrate"
      eyebrow={t("perspectives.calibrate.eyebrow")}
      title={t("perspectives.calibrate.title")}
      caption={t("perspectives.calibrate.caption")}
      icon={<SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />}
    >
      <div className="grid gap-6 rounded-2xl border border-white/8 bg-white/[0.02] p-6 lg:grid-cols-3">
        {/* Depth : radio group */}
        <fieldset className="space-y-3">
          <legend className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
            {t("perspectives.calibrate.fieldDepth")}
          </legend>
          {(["low", "medium", "high"] as Depth[]).map((depth) => (
            <label
              key={depth}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 transition-all ${
                calibration.depth === depth
                  ? "border-white/30 bg-white/[0.06]"
                  : "border-white/8 hover:border-white/15"
              }`}
            >
              <input
                type="radio"
                name="depth"
                value={depth}
                checked={calibration.depth === depth}
                onChange={() => onChange({ ...calibration, depth })}
                className="mt-0.5"
                style={accentStyle}
              />
              <span className="flex flex-col text-xs leading-snug">
                <span className="font-semibold text-slate-200">{depthLabel(depth)}</span>
                <span className="text-slate-500">{depthCaption(depth)}</span>
              </span>
            </label>
          ))}
        </fieldset>

        {/* Technicality : slider */}
        <div>
          <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
            <label id="technicality-label" htmlFor="technicality-slider">
              {t("perspectives.calibrate.fieldTechnicality")}
            </label>
            <span className="font-mono text-slate-300">{Math.round(calibration.technicality * 100)}%</span>
          </div>
          <input
            id="technicality-slider"
            type="range"
            min={0}
            max={100}
            value={Math.round(calibration.technicality * 100)}
            aria-labelledby="technicality-label"
            aria-valuetext={`${intensity(calibration.technicality)} ${t("perspectives.calibrate.fieldTechnicality")}`}
            onChange={(event) =>
              onChange({ ...calibration, technicality: Number(event.target.value) / 100 })
            }
            className="w-full"
            style={accentStyle}
          />
          <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{t("perspectives.calibrate.technicalityCaption")}</p>
        </div>

        {/* Risk sensitivity : slider */}
        <div>
          <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
            <label id="risk-sensitivity-label" htmlFor="risk-sensitivity-slider">
              {t("perspectives.calibrate.fieldRisk")}
            </label>
            <span className="font-mono text-slate-300">{Math.round(calibration.riskSensitivity * 100)}%</span>
          </div>
          <input
            id="risk-sensitivity-slider"
            type="range"
            min={0}
            max={100}
            value={Math.round(calibration.riskSensitivity * 100)}
            aria-labelledby="risk-sensitivity-label"
            aria-valuetext={`${intensity(calibration.riskSensitivity)} ${t("perspectives.calibrate.fieldRisk")}`}
            onChange={(event) =>
              onChange({ ...calibration, riskSensitivity: Number(event.target.value) / 100 })
            }
            className="w-full"
            style={accentStyle}
          />
          <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{t("perspectives.calibrate.riskCaption")}</p>
        </div>
      </div>

      {isDirty ? (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span>{t("perspectives.calibrate.savedNotice")}</span>
          <button
            type="button"
            onClick={() =>
              onChange({
                depth: defaults.depth,
                technicality: defaults.technicality,
                riskSensitivity: defaults.riskSensitivity,
              })
            }
            className="rounded-full border border-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-300 transition-colors hover:border-white/30 hover:text-white"
          >
            {t("perspectives.calibrate.reset")}
          </button>
        </div>
      ) : null}
    </ZoneShell>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// ZONE 10: Technical disclosure about how Abraxos adapts
// ──────────────────────────────────────────────────────────────────────────

function TechnicalDisclosure({
  open,
  onToggle,
  lens,
  profileId,
  calibration,
  defaults,
}: {
  open: boolean;
  onToggle: () => void;
  lens: PersonaStrategy;
  profileId: ProfileId;
  calibration: Calibration;
  defaults: LensInstrumentation;
}) {
  const { t } = useI18n();
  const runtimeFrame = useMemo(
    () =>
      [
        `# Runtime Orchestration Frame`,
        ``,
        `- user_profile: ${profileId}`,
        `- retrieval_intent: design_decision`,
        `- response_intent: design_decision`,
        `- command_mode: none`,
        `- catalog_mode: inactive`,
        `- perspective_depth: ${calibration.depth}`,
        `- perspective_technicality: ${Math.round(calibration.technicality * 100)}%`,
        `- perspective_risk_sensitivity: ${Math.round(calibration.riskSensitivity * 100)}%`,
        `- perspective_trust_style: ${defaults.trustStyle}`,
      ].join("\n"),
    [profileId, calibration, defaults],
  );

  return (
    <section className="mt-12">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls="technical-disclosure"
        className="flex w-full items-center justify-between rounded-2xl border border-white/8 bg-white/[0.02] px-5 py-4 text-left transition-colors hover:bg-white/[0.04]"
      >
        <span className="flex items-center gap-3">
          <Sparkles className="h-4 w-4 text-slate-500" aria-hidden />
          <span className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
              {t("perspectives.audit.eyebrow")}
            </span>
            <span className="text-sm font-semibold text-slate-200">{t("perspectives.audit.title")}</span>
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open ? (
        <div id="technical-disclosure" className="mt-3 space-y-4 rounded-2xl border border-white/8 bg-white/[0.02] p-6">
          <TechBlock title={t("perspectives.audit.blockFrame")}>
            <pre className="overflow-x-auto rounded-xl bg-black/40 p-4 font-mono text-[11px] leading-relaxed text-slate-300">
              {runtimeFrame}
            </pre>
          </TechBlock>

          <TechBlock title={t("perspectives.audit.blockWeights")}>
            <ul className="grid gap-1 font-mono text-[11px] text-slate-300 sm:grid-cols-2">
              {Object.entries(lens.retrievalWeighting).map(([chunkType, weight]) => (
                <li key={chunkType} className="flex items-center justify-between rounded-lg border border-white/8 px-3 py-1.5">
                  <span className="text-slate-400">{chunkType}</span>
                  <span style={{ color: hexForId(profileId) }}>×{Number(weight).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
              {t("perspectives.audit.weightsFootnote")}
            </p>
          </TechBlock>

          <TechBlock title={t("perspectives.audit.blockVocab")}>
            <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
              {lens.cognitiveProfile.vocabulary.map((term) => (
                <span key={term} className="rounded border border-white/10 bg-white/[0.04] px-2 py-0.5 text-slate-300">
                  {term}
                </span>
              ))}
            </div>
          </TechBlock>
        </div>
      ) : null}
    </section>
  );
}

function TechBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">{title}</h4>
      {children}
    </div>
  );
}

