import type { ProfileId } from "./types";

export type Depth = "low" | "medium" | "high";
export type TrustStyle = "quantified" | "qualitative" | "comparative";

export interface LensInstrumentation {
  depth: Depth;
  technicality: number;
  riskSensitivity: number;
  trustStyle: TrustStyle;
  informationHierarchy: string[];
}

export const LENS_INSTRUMENTATION: Record<ProfileId, LensInstrumentation> = {
  general: {
    depth: "medium",
    technicality: 0.5,
    riskSensitivity: 0.5,
    trustStyle: "qualitative",
    informationHierarchy: ["answer", "evidence", "trade-off", "boundary"],
  },
  designer: {
    depth: "medium",
    technicality: 0.35,
    riskSensitivity: 0.55,
    trustStyle: "qualitative",
    informationHierarchy: ["composition diagnosis", "hierarchy and tokens", "visual states", "design recommendation"],
  },
  product_designer: {
    depth: "medium",
    technicality: 0.4,
    riskSensitivity: 0.65,
    trustStyle: "qualitative",
    informationHierarchy: ["experience diagnosis", "interface and flow quality", "evidence and assumptions", "alternatives and validation"],
  },
  dev: {
    depth: "high",
    technicality: 0.9,
    riskSensitivity: 0.65,
    trustStyle: "quantified",
    informationHierarchy: ["architecture diagnosis", "contract impact", "implementation path", "UX consequence"],
  },
  design_system_manager: {
    depth: "medium",
    technicality: 0.3,
    riskSensitivity: 0.5,
    trustStyle: "comparative",
    informationHierarchy: ["strategic value", "adoption and impact", "governance criteria", "roadmap recommendation"],
  },
  qa: {
    depth: "high",
    technicality: 0.7,
    riskSensitivity: 0.95,
    trustStyle: "quantified",
    informationHierarchy: ["primary risk", "warning", "validation coverage", "release-safe solution"],
  },
  tech_writer: {
    depth: "high",
    technicality: 0.45,
    riskSensitivity: 0.4,
    trustStyle: "qualitative",
    informationHierarchy: ["mental model", "canonical concept", "correct vs incorrect use", "documentation-ready wording"],
  },
  a11y: {
    depth: "high",
    technicality: 0.75,
    riskSensitivity: 0.9,
    trustStyle: "quantified",
    informationHierarchy: ["modality at risk", "semantic gap", "AT impact", "inclusive recommendation"],
  },
  maintainer: {
    depth: "high",
    technicality: 0.55,
    riskSensitivity: 0.8,
    trustStyle: "comparative",
    informationHierarchy: ["maintenance risk", "coupling and duplication", "simplification path", "evolution cost"],
  },
};
