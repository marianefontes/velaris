import ptBR from "./locales/pt-BR";

export const locales = ["pt-BR", "pt-PT", "en-US"] as const;

export type Locale = (typeof locales)[number];

export interface LocaleOption {
  code: Locale;
  label: string;
  flag: string;
}

export const localeOptions: LocaleOption[] = [
  { code: "pt-BR", label: "PT-BR", flag: "🇧🇷" },
  { code: "pt-PT", label: "PT-PT", flag: "🇵🇹" },
  { code: "en-US", label: "EN-US", flag: "🇺🇸" },
];

export const defaultLocale: Locale = "pt-BR";

export const translations = {
  "pt-BR": ptBR,
} as const;

type NestedTranslationKey<Value> = Value extends string
  ? never
  : {
      [Key in Extract<keyof Value, string>]:
        Value[Key] extends string
          ? Key
          : `${Key}.${NestedTranslationKey<Value[Key]>}`;
    }[Extract<keyof Value, string>];

export type TranslationKey = NestedTranslationKey<(typeof translations)[typeof defaultLocale]>;
