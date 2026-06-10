import type { LucideIcon } from "lucide-react";

// ||| Static descriptors for the /intelligence explanatory page.
// These document Abraxos cognitive architecture for the academic narrative.
// They are not runtime state : the live signals live in the chat (/oracle).

export interface CognitiveSkillInfo {
  id: string;
  name: string;
  // What the skill does mechanically.
  does: string;
  // How it changes the Abraxos answer compared with a generic generation.
  impact: string;
  // A small, concrete example grounded in the design-system domain.
  example: string;
  icon: LucideIcon;
}

export interface OracleEngineInfo {
  id: string;
  name: string;
  input: string;
  process: string;
  output: string;
  // The engine's contribution to explainability.
  xaiRole: string;
  icon: LucideIcon;
}

export interface CognitiveFlowStep {
  label: string;
  detail: string;
}
