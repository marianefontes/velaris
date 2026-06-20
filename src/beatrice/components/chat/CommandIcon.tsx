import type { LucideIcon } from "lucide-react";
import { COMMAND_ICON_STROKE } from "../../domain/governance/commandIcons";

const SIZE_CLASS = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
} as const;

type CommandIconSize = keyof typeof SIZE_CLASS;

interface CommandIconProps {
  icon: LucideIcon;
  size?: CommandIconSize;
  className?: string;
}

export function CommandIcon({ icon: Icon, size = "sm", className = "" }: CommandIconProps) {
  return (
    <Icon
      aria-hidden
      className={`shrink-0 ${SIZE_CLASS[size]} ${className}`.trim()}
      strokeWidth={COMMAND_ICON_STROKE}
    />
  );
}
