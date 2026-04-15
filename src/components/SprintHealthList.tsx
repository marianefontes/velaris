import type { SprintHealth } from "../types/dashboard";
import { useI18n } from "../i18n/I18nProvider";

interface SprintHealthListProps {
  items: SprintHealth[];
}

const toneStyles = {
  good: "from-emerald-500 to-emerald-400 text-emerald-300",
  warning: "from-amber-500 to-amber-400 text-amber-300",
  critical: "from-rose-500 to-rose-400 text-rose-300",
} as const;

export function SprintHealthList({ items }: SprintHealthListProps) {
  const { locale } = useI18n();
  const textToneMap = {
    good: "text-emerald-300",
    warning: "text-amber-300",
    critical: "text-rose-300",
  } as const;
  const copy =
    locale === "en-US"
      ? {
          eyebrow: "Model confidence",
          title: "Health overview",
        }
      : locale === "pt-PT"
        ? {
            eyebrow: "Confiança do modelo",
            title: "Saúde do sistema",
          }
        : {
            eyebrow: "Confiança do modelo",
            title: "Saúde do sistema",
          };

  return (
    <div className="glass-panel rounded-[32px] p-6">
      <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface-variant">
        {copy.eyebrow}
      </p>
      <h4 className="mt-2 text-xl font-bold text-white">{copy.title}</h4>
      <div className="mt-6 space-y-5">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-white">{item.label}</span>
              <span className={`text-sm font-black ${textToneMap[item.tone]}`}>
                {item.value}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-container-highest">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${toneStyles[item.tone]}`}
                style={{ width: `${item.value}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-on-surface-variant">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
