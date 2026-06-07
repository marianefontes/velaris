import type { ReactNode } from "react";

export function PersonaWorkspaceShell({
  banner,
  header,
  status,
  switcher,
  workspace,
}: {
  banner: ReactNode;
  header: ReactNode;
  status: ReactNode;
  switcher: ReactNode;
  workspace: ReactNode;
}) {
  return (
    <main className="relative overflow-hidden rounded-[28px] border border-white/10 bg-surface-container-high/45 p-4 shadow-panel backdrop-blur-3xl lg:p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-haze opacity-60" />
      <div className="relative z-10 grid gap-5 xl:grid-cols-[15rem_1fr]">
        <div className="xl:sticky xl:top-6 xl:self-start">{switcher}</div>
        <div className="space-y-5">
          {header}
          {banner}
          {status}
          {workspace}
        </div>
      </div>
    </main>
  );
}
