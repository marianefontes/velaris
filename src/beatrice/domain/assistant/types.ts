import type { Locale } from "../../../i18n/translations";

export interface AbraxosSurfaceContext {
  surface?: "floating_assistant";
  route?: string;
  page_title?: string;
  page?: string;
  section?: string;
  entity_type?: "component" | "pattern" | "token" | "decision" | "page";
  entity_name?: string;
  active_perspective?: string;
  locale?: string;
}

export interface AbraxosOpenContext extends Partial<AbraxosSurfaceContext> {
  page?: string;
}

export function mergeSurfaceContext(
  base: AbraxosSurfaceContext,
  override?: Partial<AbraxosSurfaceContext> | null,
): AbraxosSurfaceContext {
  if (!override) return base;
  return {
    ...base,
    ...override,
    surface: "floating_assistant",
  };
}

export function contextSignature(context: AbraxosSurfaceContext): string {
  return [
    context.route ?? "",
    context.page_title ?? context.page ?? "",
    context.section ?? "",
    context.entity_type ?? "",
    context.entity_name ?? "",
  ].join("|");
}

export function localeShortCode(locale: Locale): string {
  if (locale === "en-US") return "en";
  if (locale === "pt-PT") return "pt-PT";
  return "pt";
}
