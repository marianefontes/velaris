import type { Locale } from "./translations";
import { translations } from "./translations";

type LocaleTable = Record<string, unknown>;

const localeLoaders: Record<Exclude<Locale, "pt-BR">, () => Promise<{ default: LocaleTable }>> = {
  "pt-PT": () => import("./locales/pt-PT"),
  "en-US": () => import("./locales/en-US"),
};

const localeCache = new Map<Locale, LocaleTable>();

export function getCachedLocaleTable(locale: Locale): LocaleTable | undefined {
  return localeCache.get(locale);
}

export function primeLocaleTable(locale: Locale, table: LocaleTable): void {
  localeCache.set(locale, table);
}

export async function loadLocaleTable(locale: Locale): Promise<LocaleTable> {
  const cached = localeCache.get(locale);
  if (cached) return cached;

  if (locale === "pt-BR") {
    const table = translations["pt-BR"] as LocaleTable;
    localeCache.set(locale, table);
    return table;
  }

  const mod = await localeLoaders[locale]();
  localeCache.set(locale, mod.default);
  return mod.default;
}

export function preloadLocale(locale: Locale): void {
  if (localeCache.has(locale)) return;
  void loadLocaleTable(locale);
}
