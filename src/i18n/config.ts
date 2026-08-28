export const locales = ["uk", "en", "de"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "uk";

export const localeNames: Record<Locale, string> = {
  uk: "UA",
  en: "EN",
  de: "DE",
};

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
