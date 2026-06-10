import type { ReactNode } from "react";
import { usePersonaContext } from "../../hooks/usePersonaContext";
import { useWorkspacePreferences } from "../../providers/WorkspaceProvider";

export function ChatLayout({
  artifacts,
  composer,
  overlay,
  stream,
  toolbar,
}: {
  artifacts: ReactNode;
  composer: ReactNode;
  overlay: ReactNode;
  stream: ReactNode;
  toolbar: ReactNode;
}) {
  const { activePersonaContext: strategy } = usePersonaContext();
  const { settings } = useWorkspacePreferences();
  const density = {
    compact: {
      shell: "gap-5",
      stream: "px-5 py-6 sm:px-6",
      inner: "gap-5",
      composer: "px-5 py-3 sm:px-6",
    },
    comfortable: {
      shell: "gap-6",
      stream: "px-5 py-7 sm:px-8 sm:py-8",
      inner: "gap-6",
      composer: "px-5 py-3.5 sm:px-8",
    },
    dense: {
      shell: "gap-4",
      stream: "px-4 py-4 sm:px-5",
      inner: "gap-4",
      composer: "px-4 py-2.5 sm:px-5",
    },
  }[settings.density];
  const blur = {
    low: "backdrop-blur-lg",
    medium: "backdrop-blur-2xl",
    high: "backdrop-blur-3xl",
  }[settings.blurIntensity];

  return (
    <div className={`beatrice-chat grid min-h-0 flex-1 ${density.shell} min-[1360px]:grid-cols-[minmax(0,1fr)_14rem]`}>
      <section
        aria-labelledby="beatrice-chat-title"
        className={`beatrice-chat-shell relative flex min-w-0 flex-col overflow-hidden rounded-[22px] border sm:rounded-[28px] ${blur} ${strategy.theme.shell}`}
        style={{ isolation: "isolate" }}
      >
        <div className={`pointer-events-none absolute inset-x-0 top-0 h-36 opacity-70 ${strategy.theme.backdrop}`} />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/30 to-transparent" />

        {overlay}
        {toolbar}

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className={`beatrice-scrollbar min-h-0 flex-1 overscroll-contain overflow-y-auto ${density.stream}`}>
            <div className={`mx-auto flex w-full max-w-[54rem] flex-col ${density.inner}`}>{stream}</div>
          </div>
          <div className={`beatrice-composer shrink-0 border-t border-white/[0.07] bg-background/80 ${density.composer} ${blur}`}>
            <div className="mx-auto w-full max-w-[50rem]">{composer}</div>
          </div>
        </div>
      </section>
      {artifacts}
    </div>
  );
}
