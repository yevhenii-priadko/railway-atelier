import 'server-only';
import { connectMongoose } from './mongoose';
import { WorkModel, type WorkDocument } from '@/models/Work';
import { deleteImage } from './gridfs';
import { slugify } from './slugify';
import { isEngine, type Engine } from './engines';
import type { Work, WorkInput } from './work-types';
import { Types, type HydratedDocument } from 'mongoose';

// 6 per page — a full row-and-a-half on the archive's 2-column mobile grid,
// exactly two rows of 3 on its desktop grid (see .works-grid in globals.css).
// Eugene asked for 6 instead of the original 4 once the archive moved to a
// dedicated page with no homepage pagination competing for the same data.
export const WORKS_PER_PAGE = 6;

function toWork(doc: HydratedDocument<WorkDocument>): Work {
  const plain = doc.toObject();
  return {
    id: plain._id.toString(),
    slug: plain.slug,
    maker: plain.maker,
    article: plain.article,
    scale: plain.scale,
    engine: isEngine(plain.engine) ? plain.engine : null,
    photos: plain.photos as [string, string, string],
    translations: plain.translations as Work['translations'],
    sortOrder: plain.sortOrder,
  };
}

export async function getTotalWorkPages(): Promise<number> {
  await connectMongoose();
  const count = await WorkModel.countDocuments();
  return Math.max(1, Math.ceil(count / WORKS_PER_PAGE));
}

export async function getWorksForPage(page: number): Promise<Work[]> {
  await connectMongoose();
  const docs = await WorkModel.find({})
    .sort({ sortOrder: 1 })
    .skip((page - 1) * WORKS_PER_PAGE)
    .limit(WORKS_PER_PAGE);
  return docs.map(toWork);
}

export async function getWorkBySlug(slug: string): Promise<Work | null> {
  await connectMongoose();
  const doc = await WorkModel.findOne({ slug });
  return doc ? toWork(doc) : null;
}

export async function getWorkById(id: string): Promise<Work | null> {
  if (!Types.ObjectId.isValid(id)) return null;
  await connectMongoose();
  const doc = await WorkModel.findById(id);
  return doc ? toWork(doc) : null;
}

export async function getWorkNeighbors(
  slug: string
): Promise<{ prev: Work | null; next: Work | null }> {
  await connectMongoose();
  const all = await WorkModel.find({}, { slug: 1 }).sort({ sortOrder: 1 });
  const index = all.findIndex((w) => w.slug === slug);
  if (index === -1) return { prev: null, next: null };

  const [prev, next] = await Promise.all([
    index > 0 ? getWorkBySlug(all[index - 1].slug) : Promise.resolve(null),
    index < all.length - 1
      ? getWorkBySlug(all[index + 1].slug)
      : Promise.resolve(null),
  ]);
  return { prev, next };
}

/** Slug + engine (everything a work's URL is built from), in display order — cheap enough to call from sitemap.ts on every request. */
export async function getAllWorkUrlParts(): Promise<{ slug: string; engine: Engine | null }[]> {
  await connectMongoose();
  const docs = await WorkModel.find({}, { slug: 1, engine: 1 }).sort({ sortOrder: 1 });
  return docs.map((d) => ({ slug: d.slug, engine: isEngine(d.engine) ? d.engine : null }));
}

/** Full list, sorted for display in /admin. Same data as the public site sees. */
export async function getAllWorksForAdmin(): Promise<Work[]> {
  await connectMongoose();
  const docs = await WorkModel.find({}).sort({ sortOrder: 1 });
  return docs.map(toWork);
}

async function assertSlugAvailable(slug: string, excludeId?: string) {
  const existing = await WorkModel.findOne({ slug });
  if (existing && existing._id.toString() !== excludeId) {
    throw new Error(`Слаг "${slug}" вже використовується іншою роботою.`);
  }
}

export async function createWork(input: WorkInput): Promise<Work> {
  await connectMongoose();
  await assertSlugAvailable(input.slug);

  const highest = await WorkModel.findOne({}, { sortOrder: 1 }).sort({
    sortOrder: -1,
  });
  const sortOrder = (highest?.sortOrder ?? -1) + 1;

  const doc = await WorkModel.create({ ...input, sortOrder });
  return toWork(doc);
}

export async function updateWork(id: string, input: WorkInput): Promise<Work> {
  if (!Types.ObjectId.isValid(id))
    throw new Error('Невірний ідентифікатор роботи.');
  await connectMongoose();
  await assertSlugAvailable(input.slug, id);

  const doc = await WorkModel.findById(id);
  if (!doc) throw new Error('Роботу не знайдено.');
  const oldPhotos = [...doc.photos];

  doc.set(input);
  await doc.save();

  // Any photo that was replaced (new upload took its place) is no longer
  // referenced anywhere — clean it up. Photos still in use are untouched.
  const stillUsed = new Set(input.photos);
  await Promise.all(
    oldPhotos
      .filter((url) => !stillUsed.has(url))
      .map((url) => deleteImage(url))
  );

  return toWork(doc);
}

export async function deleteWork(id: string): Promise<void> {
  if (!Types.ObjectId.isValid(id))
    throw new Error('Невірний ідентифікатор роботи.');
  await connectMongoose();
  const doc = await WorkModel.findByIdAndDelete(id);
  if (!doc) return;
  // Clean up any uploaded (GridFS-backed) photos; static /images/... paths
  // from the original seed are left alone since they're not ours to delete.
  await Promise.all(doc.photos.map((url) => deleteImage(url)));
}

/** Persists a new top-to-bottom order for the archive. */
export async function reorderWorks(orderedIds: string[]): Promise<void> {
  await connectMongoose();
  const validIds = orderedIds.filter((id) => Types.ObjectId.isValid(id));
  if (validIds.length === 0) return;
  await WorkModel.bulkWrite(
    validIds.map((id, index) => ({
      updateOne: {
        filter: { _id: new Types.ObjectId(id) },
        update: { $set: { sortOrder: index } },
      },
    }))
  );
}

/** Builds a URL-safe, unique slug from a work's maker + article, e.g. "roco-72161". Never shown to or edited by the admin user. */
export async function generateUniqueSlug(base: string): Promise<string> {
  await connectMongoose();
  const root = slugify(base);
  let candidate = root;
  let suffix = 2;
  while (await WorkModel.exists({ slug: candidate })) {
    candidate = `${root}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}
