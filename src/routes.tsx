import type { LucideIcon } from "lucide-react";
import type { TranslationKey } from "./i18n/translations";
import {
  Activity,
  BarChart3,
  Blocks,
  BrainCircuit,
  Component,
  FlaskConical,
  House,
  Telescope,
  Workflow,
} from "lucide-react";

export interface AppRouteItem {
  path: string;
  label: string;
  labelKey: TranslationKey;
  badgeKey: TranslationKey;
  icon: LucideIcon;
}

// ||| Information architecture
// 9 primary surfaces. Keep this list aligned with the primary navigation contract.
// Legacy and research destinations remain available by route.
// Removed from menu:
//   /intelligence → /reasoning
//   /principles → /foundations
//   /dashboard → /main
//   /comparison → /evaluation?focus=baseline

export const appRoutes: AppRouteItem[] = [
  {
    path: "/main",
    label: "Home",
    labelKey: "routes.main",
    badgeKey: "badges.main",
    icon: House,
  },
  {
    path: "/foundations",
    label: "Foundations",
    labelKey: "routes.foundations",
    badgeKey: "badges.foundations",
    icon: Blocks,
  },
  {
    path: "/components",
    label: "Components",
    labelKey: "routes.components",
    badgeKey: "badges.components",
    icon: Component,
  },
  {
    path: "/reasoning",
    label: "Reasoning",
    labelKey: "routes.reasoning",
    badgeKey: "badges.reasoning",
    icon: BrainCircuit,
  },
  {
    path: "/perspectives",
    label: "Perspectives",
    labelKey: "routes.perspectives",
    badgeKey: "badges.perspectives",
    icon: Telescope,
  },
  {
    path: "/architecture",
    label: "Architecture",
    labelKey: "routes.architecture",
    badgeKey: "badges.architecture",
    icon: Workflow,
  },
  {
    path: "/laboratory",
    label: "Laboratory",
    labelKey: "routes.laboratory",
    badgeKey: "badges.laboratory",
    icon: FlaskConical,
  },
  {
    path: "/evaluation",
    label: "Evaluation",
    labelKey: "routes.evaluation",
    badgeKey: "badges.evaluation",
    icon: Activity,
  },
  {
    path: "/results",
    label: "Results",
    labelKey: "routes.results",
    badgeKey: "badges.results",
    icon: BarChart3,
  },
];
