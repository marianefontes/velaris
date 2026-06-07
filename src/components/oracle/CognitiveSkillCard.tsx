import { useI18n } from "../../i18n/I18nProvider";
import type { CognitiveSkillInfo } from "../../types/oracle";

// ||| One cognitive skill, framed as function → impact → example.
// The three-tier structure mirrors the academic claim: a skill is only
// meaningful if it changes the answer and can be demonstrated.

export function CognitiveSkillCard({ skill }: { skill: CognitiveSkillInfo }) {
  const { t } = useI18n();
  const Icon = skill.icon;
  return (
    <article className="content-card h-full">
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <h3 className="font-serif text-base font-semibold text-white">{skill.name}</h3>
      </div>

      <p className="mb-3 text-sm leading-relaxed text-slate-400">{skill.does}</p>

      <div className="mb-3 border-l-2 border-primary/25 pl-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{t("pages.intelligence.labels.howItChanges")}</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-300">{skill.impact}</p>
      </div>

      <div className="rounded-lg border border-white/[0.06] bg-surface-container/60 px-3 py-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{t("pages.intelligence.labels.example")}</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-400">{skill.example}</p>
      </div>
    </article>
  );
}
