import { useContext } from "react";
import { PersonaContext } from "../providers/PersonaProvider";

export function usePersonaContext() {
  const context = useContext(PersonaContext);
  if (!context) {
    throw new Error("usePersonaContext must be used within PersonaProvider");
  }
  return context;
}
