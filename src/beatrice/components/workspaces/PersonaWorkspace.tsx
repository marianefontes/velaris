import type { ComponentType } from "react";
import { usePersonaContext } from "../../hooks/usePersonaContext";
import type { ProfileId } from "../../types/beatrice";
import { AccessibilityWorkspace } from "./AccessibilityWorkspace";
import { DesignSystemManagerWorkspace } from "./DesignSystemManagerWorkspace";
import { DesignerWorkspace } from "./DesignerWorkspace";
import { DeveloperWorkspace } from "./DeveloperWorkspace";
import { MaintainerWorkspace } from "./MaintainerWorkspace";
import { ProductDesignerWorkspace } from "./ProductDesignerWorkspace";
import { QAWorkspace } from "./QAWorkspace";
import { TechWriterWorkspace } from "./TechWriterWorkspace";

const WORKSPACE_REGISTRY: Partial<Record<Exclude<ProfileId, "general">, ComponentType>> = {
  designer: DesignerWorkspace,
  product_designer: ProductDesignerWorkspace,
  dev: DeveloperWorkspace,
  design_system_manager: DesignSystemManagerWorkspace,
  qa: QAWorkspace,
  tech_writer: TechWriterWorkspace,
  a11y: AccessibilityWorkspace,
  maintainer: MaintainerWorkspace,
};

export function PersonaWorkspace() {
  const { profileId } = usePersonaContext();
  // Every non-general profile now has a dedicated workspace; designer remains the
  // defensive fallback for the general lens and any future unmapped profile.
  const Workspace = WORKSPACE_REGISTRY[profileId === "general" ? "designer" : profileId] ?? DesignerWorkspace;

  return <Workspace />;
}
