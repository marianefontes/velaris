import type { ReactNode } from "react";
import { useState } from "react";
import { AppTopBar } from "./AppTopBar";
import { Sidebar } from "./Sidebar";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <div className="flex min-h-screen">
        <Sidebar searchQuery={searchQuery} />
        <div className="flex min-w-0 flex-1 flex-col">
          <AppTopBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
