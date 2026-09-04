import "server-only";
import { locales, type Locale } from "@/i18n/config";
import { storeImage } from "./gridfs";
import type { WorkTranslation } from "./work-types";

// Word for "photo" in each locale, used to auto-build alt text so the
// admin form never has to ask Anton to type nine alt-text variants by hand.
const PHOTO_WORD: Record<Locale, string> = { uk: "фото", en: "photo", de: "Foto" };

export interface ParsedWorkFields {
  maker: string;
  article: string;
  scale: string;
  translations: Record<Locale, WorkTranslation>;
}

function requiredText(formData: FormData, field: string): string {
  const value = String(formData.get(field) ?? "").trim();
  if (!value) throw new Error(`Поле "${field}" обов'язкове.`);
  return value;
}

function parseWorksList(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

const LOCALE_LABEL: Record<Locale, string> = { uk: "укр.", en: "англ.", de: "нім." };

export function parseWorkFields(formData: FormData): ParsedWorkFields {
  const maker = requiredText(formData, "maker");
  const article = requiredText(formData, "article");
  const scale = requiredText(formData, "scale");

  const translations = {} as Record<Locale, WorkTranslation>;
  for (const locale of locales) {
    const title = String(formData.get(`title_${locale}`) ?? "").trim();
    const type = String(formData.get(`type_${locale}`) ?? "").trim();
    const summary = String(formData.get(`summary_${locale}`) ?? "").trim();
    const worksList = parseWorksList(String(formData.get(`worksList_${locale}`) ?? ""));

    if (!title || !type || !summary || worksList.length === 0) {
      throw new Error(
        `Заповніть усі поля для мови (${LOCALE_LABEL[locale]}): назва, тип робіт, опис і список робіт (хоч один рядок).`
      );
    }

    translations[locale] = {
      title,
      type,
      summary,
      worksList,
      photoAlts: [
        `${title} — ${PHOTO_WORD[locale]} 1`,
        `${title} — ${PHOTO_WORD[locale]} 2`,
        `${title} — ${PHOTO_WORD[locale]} 3`,
      ],
    };
  }

  return { maker, article, scale, translations };
}

const MAX_PHOTO_BYTES = 10 * 1024 * 1024; // 10MB

/**
 * Resolves the 3 photo slots: a freshly uploaded file wins, otherwise the
 * existing photo (when editing) is kept. Throws if a slot ends up with
 * neither — every work needs exactly 3 photos, same as before.
 */
export async function parsePhotos(
  formData: FormData,
  existingPhotos: [string, string, string] | null
): Promise<[string, string, string]> {
  const results: string[] = [];

  for (let i = 1; i <= 3; i++) {
    const file = formData.get(`photo${i}`);
    if (file instanceof File && file.size > 0) {
      if (!file.type.startsWith("image/")) {
        throw new Error(`Фото ${i}: файл має бути зображенням.`);
      }
      if (file.size > MAX_PHOTO_BYTES) {
        throw new Error(`Фото ${i}: файл завеликий (максимум 10 МБ).`);
      }
      const bytes = Buffer.from(await file.arrayBuffer());
      const url = await storeImage(bytes, file.name, file.type);
      results.push(url);
    } else if (existingPhotos?.[i - 1]) {
      results.push(existingPhotos[i - 1]);
    } else {
      throw new Error(`Завантажте фото ${i}.`);
    }
  }

  return results as [string, string, string];
}
