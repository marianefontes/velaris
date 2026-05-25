import type { ComponentType } from "react";
import { usePersonaContext } from "../../hooks/usePersonaContext";
import type { ProfileId } from "../../types/beatrice";
import { DesignerWorkspace } from "./DesignerWorkspace";
import { DeveloperWorkspace } from "./DeveloperWorkspace";
import { ProductManagerWorkspace } from "./ProductManagerWorkspace";
import { QAWorkspace } from "./QAWorkspace";
import { TechWriterWorkspace } from "./TechWriterWorkspace";

const WORKSPACE_REGISTRY: Record<Exclude<ProfileId, "general">, ComponentType> = {
  designer: DesignerWorkspace,
  dev: DeveloperWorkspace,
  pm: ProductManagerWorkspace,
  qa: QAWorkspace,
  writer: TechWriterWorkspace,
};

export function PersonaWorkspace() {
  const { profileId } = usePersonaContext();
  const Workspace = WORKSPACE_REGISTRY[profileId === "general" ? "designer" : profileId];

  return <Workspace />;
}
