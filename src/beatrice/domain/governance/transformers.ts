import { COMMAND_META } from "./models";
import type { CommandMode } from "./types";

export function commandLabel(command: CommandMode): string {
  return COMMAND_META[command].label;
}

