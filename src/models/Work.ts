import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const exactlyThree = {
  validator: (v: string[]) => Array.isArray(v) && v.length === 3,
  message: "Потрібно рівно 3 значення (маємо {VALUE}).",
};

const translationSchema = new Schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    worksList: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: "Список робіт не може бути порожнім.",
      },
    },
    summary: { type: String, required: true },
    photoAlts: { type: [String], required: true, validate: exactlyThree },
  },
  { _id: false }
);

const workSchema = new Schema(
  {
    // Auto-generated from maker + article (see src/lib/slugify.ts) — never
    // edited through /admin, just the archive's stable, unique URL key.
    slug: { type: String, required: true, unique: true },
    maker: { type: String, required: true },
    article: { type: String, required: true },
    scale: { type: String, required: true },
    // Either a static "/images/foo.jpg" path (the 6 originally-seeded
    // works) or "/api/images/<gridfsId>" for anything uploaded via /admin.
    photos: { type: [String], required: true, validate: exactlyThree },
    translations: {
      uk: { type: translationSchema, required: true },
      en: { type: translationSchema, required: true },
      de: { type: translationSchema, required: true },
    },
    // Ascending display order in the archive; only ever changed via the
    // reorder buttons in /admin (src/app/admin/actions.ts).
    sortOrder: { type: Number, required: true, default: 0, index: true },
  },
  { timestamps: true }
);

export type WorkDocument = InferSchemaType<typeof workSchema>;

// `models.Work ||` avoids Next.js's "Cannot overwrite `Work` model" error
// when this module is re-evaluated on every hot-reload in dev. Cast so
// TypeScript keeps the real field types instead of collapsing to the
// loosely-typed `models.Work` branch.
export const WorkModel = (models.Work as Model<WorkDocument>) || model<WorkDocument>("Work", workSchema);
