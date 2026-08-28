import "server-only";
import type { Locale } from "./config";

const dictionaries = {
  uk: () => import("../../messages/uk.json").then((m) => m.default),
  en: () => import("../../messages/en.json").then((m) => m.default),
  de: () => import("../../messages/de.json").then((m) => m.default),
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["uk"]>>;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
