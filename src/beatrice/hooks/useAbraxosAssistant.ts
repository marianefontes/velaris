import { useContext } from "react";
import { AbraxosAssistantContext } from "../providers/AbraxosAssistantProvider";

export function useAbraxosAssistant() {
  const context = useContext(AbraxosAssistantContext);
  if (!context) {
    throw new Error("useAbraxosAssistant must be used within AbraxosAssistantProvider");
  }
  return context;
}
