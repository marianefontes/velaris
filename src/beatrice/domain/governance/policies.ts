import type { CommandMode } from "./types";

export function detectCommandMode(input: string): CommandMode | null {
  const match = input.match(/^\/(enforce|migrate|history|why|tradeoff|score)\b/);
  return (match?.[1] as CommandMode | undefined) ?? null;
}

export function commandPlaceholder(command: CommandMode | null): string | null {
  const placeholders: Record<CommandMode, string> = {
    enforce: `/enforce\n<Button color="red">Delete account</Button>`,
    migrate: "/migrate LegacyDrawer -> ?",
    history: "/history why did we adopt SideDrawer for checkout mobile?",
    why: "/why does the ConfidenceMeter use a radial arc instead of a bar?",
    tradeoff: "/tradeoff SideDrawer vs ModalOverlay for mobile checkout",
    score: "/score ConfidenceMeter component",
  };
  return command ? placeholders[command] : null;
}

export function commandHint(command: CommandMode): string {
  const hints: Record<CommandMode, string> = {
    enforce: "paste JSX/TSX code to validate",
    migrate: "paste legacy component or describe the pattern",
    history: "ask about any architectural decision or component history",
    why: "ask why a rule, component or pattern exists",
    tradeoff: "compare two components, patterns or approaches",
    score: "evaluate architectural quality of a component or flow",
  };
  return hints[command];
}

