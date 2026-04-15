import type { LucideIcon } from "lucide-react";
import {
  Blocks,
  BookOpenText,
  Brain,
  CircleGauge,
  Command,
  Component,
  FileSliders,
  Home,
  LayoutDashboard,
  LibraryBig,
  MessageSquareMore,
  Palette,
  UserRound,
} from "lucide-react";

export interface AppRouteItem {
  path: string;
  label: string;
  labelKey: string;
  badgeKey: string;
  icon: LucideIcon;
}

export const appRoutes: AppRouteItem[] = [
  {
    path: "/main",
    label: "Main",
    labelKey: "routes.main",
    badgeKey: "badges.main",
    icon: Home,
  },
  {
    path: "/dashboard",
    label: "Oracle Dashboard",
    labelKey: "routes.dashboard",
    badgeKey: "badges.dashboard",
    icon: LayoutDashboard,
  },
  {
    path: "/components",
    label: "Components",
    labelKey: "routes.components",
    badgeKey: "badges.components",
    icon: Component,
  },
  {
    path: "/foundations",
    label: "Foundations",
    labelKey: "routes.foundations",
    badgeKey: "badges.foundations",
    icon: Blocks,
  },
  {
    path: "/guidelines",
    label: "Guidelines",
    labelKey: "routes.guidelines",
    badgeKey: "badges.guidelines",
    icon: BookOpenText,
  },
  {
    path: "/persona",
    label: "Persona",
    labelKey: "routes.persona",
    badgeKey: "badges.persona",
    icon: UserRound,
  },
  {
    path: "/patterns",
    label: "Patterns",
    labelKey: "routes.patterns",
    badgeKey: "badges.patterns",
    icon: Palette,
  },
  {
    path: "/reasoning",
    label: "Reasoning",
    labelKey: "routes.reasoning",
    badgeKey: "badges.reasoning",
    icon: Brain,
  },
  {
    path: "/system-evaluation",
    label: "System Evaluation",
    labelKey: "routes.systemEvaluation",
    badgeKey: "badges.systemEvaluation",
    icon: CircleGauge,
  },
  {
    path: "/tokens",
    label: "Tokens",
    labelKey: "routes.tokens",
    badgeKey: "badges.tokens",
    icon: LibraryBig,
  },
  {
    path: "/beatrice-chat",
    label: "Beatrice Chat",
    labelKey: "routes.beatriceChat",
    badgeKey: "badges.beatriceChat",
    icon: MessageSquareMore,
  },
  {
    path: "/dev-integration",
    label: "Dev Integration",
    labelKey: "routes.devIntegration",
    badgeKey: "badges.devIntegration",
    icon: Command,
  },
  {
    path: "/design-decisions",
    label: "Design Decisions",
    labelKey: "routes.designDecisions",
    badgeKey: "badges.designDecisions",
    icon: FileSliders,
  },
];
