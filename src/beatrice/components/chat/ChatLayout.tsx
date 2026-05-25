import type { ReactNode } from "react";

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
  return (
    <div className="grid min-h-[calc(100vh-9rem)] gap-6 xl:grid-cols-[1fr_18rem]">
      <section className="relative flex min-h-[calc(100vh-9rem)] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-surface-container-high/40 backdrop-blur-3xl">
        {overlay}
        {toolbar}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-8 py-8">
            <div className="mx-auto flex max-w-4xl flex-col gap-6">{stream}</div>
          </div>
          <div className="border-t border-white/10 bg-background/60 px-8 py-5 backdrop-blur-xl">
            <div className="mx-auto max-w-3xl">{composer}</div>
          </div>
        </div>
      </section>
      {artifacts}
    </div>
  );
}

