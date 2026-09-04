"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import { createWorkAction, updateWorkAction, type ActionState } from "@/app/admin/actions";
import type { Work } from "@/lib/work-types";

const LOCALE_LABEL: Record<Locale, string> = { uk: "Українська", en: "English", de: "Deutsch" };

const initialState: ActionState = {};

interface TranslationFields {
  title: string;
  type: string;
  worksList: string;
  summary: string;
}

function emptyTranslation(): TranslationFields {
  return { title: "", type: "", worksList: "", summary: "" };
}

export default function WorkForm({ mode, work }: { mode: "create" | "edit"; work?: Work }) {
  const action = mode === "edit" ? updateWorkAction : createWorkAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [activeLocale, setActiveLocale] = useState<Locale>("uk");
  const [previews, setPreviews] = useState<[string | null, string | null, string | null]>([
    work?.photos[0] ?? null,
    work?.photos[1] ?? null,
    work?.photos[2] ?? null,
  ]);
  const router = useRouter();

  // Text/textarea fields are controlled (kept in React state) rather than
  // left as plain defaultValue inputs. Reason: when a <form action={fn}>
  // submission finishes without redirecting — which is exactly what
  // happens on a validation error, e.g. a missing photo — React resets
  // every uncontrolled field in the form back to empty, on ALL tabs, not
  // just the one that failed. Without this, Anton could fill in every
  // language, hit one unrelated error (like forgetting a photo), and lose
  // everything he'd typed with no indication why.
  const [maker, setMaker] = useState(work?.maker ?? "");
  const [article, setArticle] = useState(work?.article ?? "");
  const [scale, setScale] = useState(work?.scale ?? "");
  const [translations, setTranslations] = useState<Record<Locale, TranslationFields>>(() => {
    const initial = {} as Record<Locale, TranslationFields>;
    for (const locale of locales) {
      const t = work?.translations[locale];
      initial[locale] = t
        ? { title: t.title, type: t.type, worksList: t.worksList.join("\n"), summary: t.summary }
        : emptyTranslation();
    }
    return initial;
  });

  function updateTranslation(locale: Locale, field: keyof TranslationFields, value: string) {
    setTranslations((prev) => ({ ...prev, [locale]: { ...prev[locale], [field]: value } }));
  }

  function onPhotoChange(index: 0 | 1 | 2, file: File | undefined) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviews((prev) => {
      const next = prev.slice() as typeof prev;
      next[index] = url;
      return next;
    });
  }

  return (
    <form action={formAction}>
      {mode === "edit" && work && <input type="hidden" name="workId" value={work.id} />}
      {state.error && <div className="admin-error">{state.error}</div>}

      <div className="admin-panel" style={{ marginBottom: 20 }}>
        <div className="admin-row">
          <div className="admin-field">
            <label htmlFor="maker">Виробник</label>
            <input
              id="maker"
              name="maker"
              type="text"
              value={maker}
              onChange={(e) => setMaker(e.target.value)}
              placeholder="напр. Roco"
              required
            />
          </div>
          <div className="admin-field">
            <label htmlFor="article">Артикул</label>
            <input
              id="article"
              name="article"
              type="text"
              value={article}
              onChange={(e) => setArticle(e.target.value)}
              placeholder="напр. 72161"
              required
            />
          </div>
          <div className="admin-field">
            <label htmlFor="scale">Масштаб</label>
            <input
              id="scale"
              name="scale"
              type="text"
              value={scale}
              onChange={(e) => setScale(e.target.value)}
              placeholder="напр. HO"
              required
            />
          </div>
        </div>
      </div>

      <div className="admin-panel" style={{ marginBottom: 20 }}>
        <p className="admin-hint" style={{ marginBottom: 12 }}>
          Фото (рівно 3) {mode === "edit" ? "— залиште порожнім, щоб не змінювати" : ""}
        </p>
        <div className="admin-photos">
          {[0, 1, 2].map((i) => (
            <div className="admin-photo-slot" key={i}>
              {previews[i] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previews[i]!} alt="" className="admin-photo-preview" />
              ) : (
                <div className="admin-photo-placeholder">Фото {i + 1}</div>
              )}
              <input
                type="file"
                name={`photo${i + 1}`}
                accept="image/*"
                required={mode === "create"}
                onChange={(e) => onPhotoChange(i as 0 | 1 | 2, e.target.files?.[0])}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-tabs">
          {locales.map((locale) => (
            <button
              key={locale}
              type="button"
              className="admin-tab"
              data-active={activeLocale === locale}
              onClick={() => setActiveLocale(locale)}
            >
              {LOCALE_LABEL[locale]}
            </button>
          ))}
        </div>

        {locales.map((locale) => {
          const t = translations[locale];
          return (
            <div key={locale} hidden={activeLocale !== locale}>
              <div className="admin-field">
                <label htmlFor={`title_${locale}`}>Назва</label>
                <input
                  id={`title_${locale}`}
                  name={`title_${locale}`}
                  type="text"
                  value={t.title}
                  onChange={(e) => updateTranslation(locale, "title", e.target.value)}
                  placeholder="напр. BR 01 — Паровоз DRG"
                />
              </div>
              <div className="admin-field">
                <label htmlFor={`type_${locale}`}>Тип робіт</label>
                <input
                  id={`type_${locale}`}
                  name={`type_${locale}`}
                  type="text"
                  value={t.type}
                  onChange={(e) => updateTranslation(locale, "type", e.target.value)}
                  placeholder="напр. Конверсія приводу"
                />
              </div>
              <div className="admin-field">
                <label htmlFor={`worksList_${locale}`}>Список робіт (кожен пункт — з нового рядка)</label>
                <textarea
                  id={`worksList_${locale}`}
                  name={`worksList_${locale}`}
                  value={t.worksList}
                  onChange={(e) => updateTranslation(locale, "worksList", e.target.value)}
                  placeholder={"Повне очищення механіки\nОбслуговування редуктора\n…"}
                />
              </div>
              <div className="admin-field">
                <label htmlFor={`summary_${locale}`}>Короткий опис</label>
                <textarea
                  id={`summary_${locale}`}
                  name={`summary_${locale}`}
                  value={t.summary}
                  onChange={(e) => updateTranslation(locale, "summary", e.target.value)}
                  placeholder="Один-два речення про результат"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="admin-form-actions">
        <button type="submit" className="admin-btn" disabled={pending}>
          {pending ? "Зберігаємо…" : "Зберегти"}
        </button>
        <button type="button" className="admin-btn admin-btn-secondary" onClick={() => router.push("/admin")}>
          Скасувати
        </button>
      </div>
    </form>
  );
}
