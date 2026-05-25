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
    <main className="relative overflow-hidden rounded-[28px] border border-white/8 bg-surface-container-high/25 p-6 lg:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_0%,rgba(222,204,253,0.10),transparent_30%),radial-gradient(circle_at_90%_20%,rgba(99,179,237,0.08),transparent_28%)]" />
      <div className="relative z-10 space-y-6">
        {header}
        {switcher}
        {banner}
        {status}
        {workspace}
      </div>
    </main>
  );
}
