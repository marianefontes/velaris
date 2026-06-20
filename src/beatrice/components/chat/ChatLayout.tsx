import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePersonaContext } from "../../hooks/usePersonaContext";
import { useWorkspacePreferences } from "../../providers/WorkspaceProvider";
import { ContextPanelDrawer, ContextPanelRail } from "./ContextPanel";

export function useChatViewport() {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(min-width: 1024px)").matches : false,
  );

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return { isDesktop };
}

export function ChatLayout({
  composer,
  contextOpen,
  onContextOpenChange,
  isDesktop,
  overlay,
  stream,
  toolbar,
}: {
  composer: ReactNode;
  contextOpen: boolean;
  onContextOpenChange: (open: boolean) => void;
  isDesktop: boolean;
  overlay: ReactNode;
  stream: ReactNode;
  toolbar: ReactNode;
}) {
  const { activePersonaContext: strategy } = usePersonaContext();
  const { settings } = useWorkspacePreferences();

  const density = {
    compact: {
      shell: "gap-0",
      stream: "px-4 py-4 sm:px-6 lg:px-8",
      inner: "gap-5 pb-4",
    },
    comfortable: {
      shell: "gap-0",
      stream: "px-4 py-5 sm:px-8 lg:px-10",
      inner: "gap-6 pb-6",
    },
    dense: {
      shell: "gap-0",
      stream: "px-3 py-3 sm:px-5 lg:px-6",
      inner: "gap-4 pb-4",
    },
  }[settings.density];

  const showRail = contextOpen && isDesktop;

  return (
    <div className={`beatrice-chat grid min-h-0 flex-1 ${density.shell} ${showRail ? "lg:grid-cols-[minmax(0,1fr)_19rem]" : "grid-cols-1"}`}>
      <section
        aria-labelledby="beatrice-chat-title"
        className="beatrice-chat-shell relative grid min-h-0 min-w-0 grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden overflow-x-clip bg-background"
        style={{ isolation: "isolate" }}
      >
        <div className={`pointer-events-none absolute inset-x-0 top-0 z-0 h-32 opacity-40 ${strategy.theme.backdrop}`} />

        {overlay}

        <div className="relative z-20 shrink-0 bg-background/90">{toolbar}</div>

        <div className={`beatrice-scrollbar beatrice-chat-stream relative z-10 min-h-0 overflow-y-auto overscroll-contain ${density.stream}`}>
          <div className={`mx-auto flex min-h-full w-full max-w-[52rem] flex-col ${density.inner}`}>{stream}</div>
        </div>

        <div className="relative z-30 shrink-0">{composer}</div>
      </section>

      {showRail ? <ContextPanelRail onClose={() => onContextOpenChange(false)} /> : null}
      <ContextPanelDrawer isOpen={contextOpen && !isDesktop} onClose={() => onContextOpenChange(false)} />
    </div>
  );
}
