import type { TranslationKey } from "../../../i18n/translations";
import type { Locale } from "../../../i18n/translations";
import { appRoutes } from "../../../routes";
import type { AbraxosSurfaceContext } from "./types";
import { localeShortCode } from "./types";

const ROUTE_LABEL_KEYS: Record<string, TranslationKey> = Object.fromEntries(
  appRoutes.map((route) => [route.path, route.labelKey]),
);

const EXTRA_ROUTE_LABELS: Record<string, TranslationKey> = {
  "/oracle": "routes.beatriceChat",
};

function resolvePageTitle(
  pathname: string,
  search: string,
  t: (key: TranslationKey) => string,
): string {
  const labelKey = ROUTE_LABEL_KEYS[pathname] ?? EXTRA_ROUTE_LABELS[pathname];
  if (labelKey) return t(labelKey);

  if (pathname.startsWith("/study/")) return "Study";
  if (pathname === "/research") return "Research";

  const focus = new URLSearchParams(search).get("focus");
  if (pathname === "/foundations" && focus) {
    const focusLabels: Record<string, TranslationKey> = {
      patterns: "routes.patterns",
      tokens: "routes.tokens",
      manifesto: "routes.guidelines",
      foundations: "routes.foundations",
    };
    return t(focusLabels[focus] ?? "routes.foundations");
  }

  return pathname;
}

export function buildRouteSurfaceContext(
  pathname: string,
  search: string,
  locale: Locale,
  activePerspective: string | undefined,
  t: (key: TranslationKey) => string,
): AbraxosSurfaceContext {
  return {
    surface: "floating_assistant",
    route: pathname,
    page_title: resolvePageTitle(pathname, search, t),
    active_perspective: activePerspective,
    locale: localeShortCode(locale),
  };
}
