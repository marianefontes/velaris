import { useI18n } from "../../../i18n/I18nProvider";
import { usePersonaContext } from "../../hooks/usePersonaContext";

export function ChatEmptyState() {
  const { t } = useI18n();
  const { activePersonaContext: strategy } = usePersonaContext();
  const Icon = strategy.icon;
  const operationalProfile = strategy.operationalProfile;

  return (
    <div className="flex flex-col items-center justify-center px-4 pb-4 pt-10 text-center">

      {/* ── Oracle symbolic presence ──────────────────────────────────────
          The 30% cognitive layer: ambient glow + layered rings + icon.
          Keeps the clean bounding box from the architectural version,
          adds depth without noise.
      ──────────────────────────────────────────────────────────────────── */}
      <div className="relative mb-7 flex items-center justify-center">

        {/* Ambient radial atmosphere — furthest layer, very soft */}
        <div
          className={`pointer-events-none absolute inset-0 scale-[3.2] rounded-full opacity-30 blur-3xl ${strategy.theme.accentBg}`}
        />

        {/* Outer symbolic ring — subtle spatial marker */}
        <div
          className={`pointer-events-none absolute -inset-[10px] rounded-[30px] border ${strategy.theme.accentBorder} opacity-20`}
        />

        {/* Secondary ring — creates depth layering */}
        <div
          className={`pointer-events-none absolute -inset-[4px] rounded-[26px] border ${strategy.theme.accentBorder} opacity-12`}
        />

        {/* Icon container — the focal symbol */}
        <div
          className={`relative flex h-[72px] w-[72px] items-center justify-center rounded-[24px] border oracle-icon-shell ${strategy.theme.accentBorder} ${strategy.theme.accentBg}`}
        >
          <Icon className={`h-9 w-9 ${strategy.theme.accentText}`} />
        </div>
      </div>

      {/* Session identity */}
      <h2 className="text-[1.65rem] font-black tracking-tight text-white leading-tight">
        {strategy.sessionTitle}
      </h2>
      <p className={`mt-2 text-xs font-semibold tracking-wide ${strategy.theme.accentText}`}>
        {operationalProfile.fullName} · {operationalProfile.title}
      </p>

      {/* Cognitive rhythm divider */}
      <div className="cognitive-divider mt-5 mb-5" />

      {/* Primary pain / context description */}
      <p className="max-w-md text-sm leading-[1.75] text-slate-400">
        {operationalProfile.primaryPain || t("chat.description")}
      </p>
    </div>
  );
}
