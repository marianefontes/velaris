// ||| /oracle: conversational surface for Abraxos
// Velaris home → /main

import { BeatriceChatPage } from "../beatrice/pages/BeatriceChatPage";
import { BeatriceVisualFrame } from "./oracle/BeatriceVisualFrame";

export function OraclePage() {
  return (
    <BeatriceVisualFrame>
      <BeatriceChatPage />
    </BeatriceVisualFrame>
  );
}
