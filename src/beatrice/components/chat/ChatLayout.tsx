import type { ReactNode } from "react";
import { usePersonaContext } from "../../hooks/usePersonaContext";
import { useWorkspace } from "../../providers/WorkspaceProvider";

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
  const { settings } = useWorkspace();
  const density = {
    compact: {
      shell: "gap-5",
      stream: "px-5 py-6 sm:px-6",
      inner: "gap-5",
      composer: "px-5 py-4 sm:px-6",
    },
    comfortable: {
      shell: "gap-6",
      stream: "px-5 py-7 sm:px-8 sm:py-8",
      inner: "gap-6",
      composer: "px-5 py-5 sm:px-8",
    },
    dense: {
      shell: "gap-4",
      stream: "px-4 py-4 sm:px-5",
      inner: "gap-4",
      composer: "px-4 py-3 sm:px-5",
    },
  }[settings.density];
  const blur = {
    low: "backdrop-blur-lg",
    medium: "backdrop-blur-2xl",
    high: "backdrop-blur-3xl",
  }[settings.blurIntensity];

  return (
    <div className={`grid min-h-[calc(100vh-9rem)] ${density.shell} xl:grid-cols-[1fr_18rem]`}>
      {/* ── Oracle shell ──────────────────────────────────────────────────────
          Primary section: architectural container (border-radius, blur, border)
          with a persona-aware backdrop gradient as the identity accent layer.
      ───────────────────────────────────────────────────────────────────────── */}
      <section
        className={`relative flex min-h-[calc(100vh-9rem)] flex-col overflow-hidden rounded-[28px] border ${blur} ${strategy.theme.shell}`}
        style={{ isolation: "isolate" }}
      >
        {/* Backdrop gradient — persona-aware cognitive atmosphere, top-anchored */}
        <div className={`pointer-events-none absolute inset-x-0 top-0 h-48 ${strategy.theme.backdrop}`} />

        {/* Ambient floor glow — subtle depth from base, unifies the shell */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/40 to-transparent" />

        {overlay}
        {toolbar}

        <div className="flex flex-1 flex-col overflow-hidden">
          <div className={`beatrice-scrollbar flex-1 overflow-y-auto ${density.stream}`}>
            <div className={`mx-auto flex max-w-4xl flex-col ${density.inner}`}>{stream}</div>
          </div>
          <div className={`border-t border-white/[0.08] bg-background/65 ${density.composer} ${blur}`}>
            <div className="mx-auto max-w-3xl">{composer}</div>
          </div>
        </div>
      </section>
      {artifacts}
    </div>
  );
}
