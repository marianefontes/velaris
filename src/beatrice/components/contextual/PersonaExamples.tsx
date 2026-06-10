import { MessageSquareMore } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "../../../i18n/I18nProvider";
import { usePersonaContext } from "../../hooks/usePersonaContext";

export function PersonaExamples() {
  const { t } = useI18n();
  const { activePersonaContext: strategy } = usePersonaContext();

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 backdrop-blur-2xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
          {t("beatrice.contextual.examplePrompts")}
        </p>
        <MessageSquareMore className="h-4 w-4 text-primary" />
      </div>
      <div className="grid gap-2">
        {strategy.examples.map((example) => (
          <Link
            key={example}
            to="/oracle"
            className="group rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-xs leading-5 text-slate-300 transition-colors hover:border-white/18 hover:bg-white/[0.06]"
          >
            <span className="mr-2 font-mono text-[10px] text-primary">{t("beatrice.contextual.ask")}</span>
            <span className="transition-colors group-hover:text-white">{example}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
