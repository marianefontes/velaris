import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultLocale,
  localeOptions,
  locales,
  translations,
  type Locale,
  type TranslationKey,
} from "./translations";

const STORAGE_KEY = "aetheris.locale";
const reportedMissingKeys = new Set<string>();

export type TranslationParams = Record<string, string | number>;

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, params?: TranslationParams) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function readKey(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, segment) => {
    if (current && typeof current === "object" && segment in current) {
      return (current as Record<string, unknown>)[segment];
    }

    return undefined;
  }, source);
}

function interpolate(value: string, params?: TranslationParams): string {
  if (!params) return value;

  return value.replace(/\{([a-zA-Z0-9_]+)\}/g, (placeholder, name: string) => {
    const replacement = params[name];
    return replacement === undefined ? placeholder : String(replacement);
  });
}

function reportMissingKey(locale: Locale, key: string) {
  if (!import.meta.env.DEV) return;

  const signature = `${locale}:${key}`;
  if (reportedMissingKeys.has(signature)) return;
  reportedMissingKeys.add(signature);
  console.warn(`[i18n] Missing translation key "${key}" for locale "${locale}".`);
}

export function translate(
  locale: Locale,
  key: TranslationKey,
  params?: TranslationParams,
): string {
  const localized = readKey(translations[locale], key);
  if (typeof localized === "string") return interpolate(localized, params);

  const fallback = readKey(translations[defaultLocale], key);
  reportMissingKey(locale, key);
  return typeof fallback === "string" ? interpolate(fallback, params) : key;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    const saved = typeof window === "undefined"
      ? null
      : window.localStorage.getItem(STORAGE_KEY) as Locale | null;

    return saved && locales.includes(saved) ? saved : defaultLocale;
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const t = useCallback(
    (key: TranslationKey, params?: TranslationParams) => translate(locale, key, params),
    [locale],
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t,
    }),
    [locale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }

  return context;
}

export { localeOptions };
