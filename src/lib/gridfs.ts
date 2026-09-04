import "server-only";
import mongoose, { Types } from "mongoose";
import { connectMongoose } from "./mongoose";

const BUCKET_NAME = "workPhotos";
const IMAGE_URL_PREFIX = "/api/images/";

async function getBucket() {
  await connectMongoose();
  const db = mongoose.connection.db;
  if (!db) throw new Error("Mongoose connection has no database handle yet.");
  // mongoose.mongo is the underlying MongoDB driver it depends on anyway —
  // reusing it here avoids adding a second, separately-versioned `mongodb`
  // package dependency just for GridFS.
  return new mongoose.mongo.GridFSBucket(db, { bucketName: BUCKET_NAME });
}

/**
 * Saves an uploaded photo's bytes into GridFS and returns the URL the rest
 * of the app should store/render — e.g. in a Work's `photos` array, exactly
 * like a static "/images/foo.jpg" path from the original seed data.
 */
export async function storeImage(
  bytes: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  const bucket = await getBucket();
  const id = new Types.ObjectId();
  await new Promise<void>((resolve, reject) => {
    // Newer GridFS dropped the top-level `contentType` field in favor of
    // storing it inside `metadata` (see readImage below, which reads it
    // back from there).
    const uploadStream = bucket.openUploadStreamWithId(id, filename, {
      metadata: { contentType },
    });
    uploadStream.on("error", reject);
    uploadStream.on("finish", () => resolve());
    uploadStream.end(bytes);
  });
  return `${IMAGE_URL_PREFIX}${id.toString()}`;
}

export function isGridfsUrl(url: string): boolean {
  return url.startsWith(IMAGE_URL_PREFIX);
}

function idFromUrl(url: string): Types.ObjectId | null {
  if (!isGridfsUrl(url)) return null;
  const idPart = url.slice(IMAGE_URL_PREFIX.length);
  return Types.ObjectId.isValid(idPart) ? new Types.ObjectId(idPart) : null;
}

/** No-op for static /images/... paths from the original seed — only ever deletes our own uploads. */
export async function deleteImage(url: string): Promise<void> {
  const id = idFromUrl(url);
  if (!id) return;
  const bucket = await getBucket();
  try {
    await bucket.delete(id);
  } catch {
    // Already gone / never existed — fine, deletion is best-effort.
  }
}

export interface StoredImage {
  stream: NodeJS.ReadableStream;
  contentType: string;
  length: number;
}

export async function readImage(id: string): Promise<StoredImage | null> {
  if (!Types.ObjectId.isValid(id)) return null;
  const bucket = await getBucket();
  const _id = new Types.ObjectId(id);
  const files = await bucket.find({ _id }).toArray();
  const file = files[0];
  if (!file) return null;
  return {
    stream: bucket.openDownloadStream(_id),
    contentType: (file.metadata?.contentType as string) || "application/octet-stream",
    length: file.length,
  };
}
