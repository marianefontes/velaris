import { COMMAND_META, COMMAND_ORDER } from "../../domain/governance";
import { useI18n } from "../../../i18n/I18nProvider";
import { useWorkspace } from "../../providers/WorkspaceProvider";

export function ChatSuggestions() {
  const { locale } = useI18n();
  const { content, setInput, submitPrompt } = useWorkspace();

  return (
    <>
      <div className="mx-auto grid w-full max-w-3xl gap-3 md:grid-cols-2">
        {content.suggestedPrompts.map((prompt) => {
          const Icon = prompt.icon;
          return (
            <button
              key={prompt.title}
              type="button"
              onClick={() => {
                setInput(prompt.body);
                void submitPrompt(prompt.body);
              }}
              className="glass-panel rounded-2xl p-4 text-left transition-colors hover:border-primary/30"
            >
              <Icon className="mb-2 h-4 w-4 text-primary" />
              <p className="mb-1 text-sm font-bold text-white">{prompt.title}</p>
              <p className="text-xs leading-5 text-slate-400">{prompt.body}</p>
            </button>
          );
        })}
      </div>

      <div className="mx-auto w-full max-w-3xl">
        <div className="flex items-center gap-1.5">
          {COMMAND_ORDER.map((command) => {
            const meta = COMMAND_META[command];
            return (
              <button
                key={command}
                type="button"
                onClick={() => setInput(`/${command} `)}
                className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest transition-colors ${meta.borderClass} ${meta.bgClass} ${meta.colorClass} hover:opacity-80`}
              >
                <span>{meta.icon}</span>/{command}
              </button>
            );
          })}
          <span className="ml-1 text-[9px] text-slate-700">
            {locale === "en-US" ? "governance commands" : "comandos de governança"}
          </span>
        </div>
      </div>
    </>
  );
}

