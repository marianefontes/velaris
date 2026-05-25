import type { CommandMode, ProfileId } from "../../types/beatrice";

export function resolvePersonaForRequest(profileId: ProfileId, commandMode?: CommandMode): string {
  return commandMode ?? profileId;
}

export function togglePersona(current: ProfileId, next: ProfileId): ProfileId {
  return current === next ? "general" : next;
}
