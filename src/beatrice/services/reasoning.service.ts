import { buildEvidence, computeConfidence, reasoningStepsForEntry } from "../domain/reasoning";
import { intentColor, intentLabel } from "../domain/decision";

export const reasoningService = {
  buildEvidence,
  computeConfidence,
  intentColor,
  intentLabel,
  reasoningStepsForEntry,
};

