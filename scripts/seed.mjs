// One-off migration: populates MongoDB with the 6 original conversions
// that used to live in the static src/data/projects.ts array, so the
// archive isn't empty the first time the site points at the database.
// Safe to re-run — existing slugs are skipped, nothing is duplicated or
// overwritten.
//
// Uses mongoose (same as the app, src/lib/mongoose.ts / src/models/Work.ts)
// rather than a separate MongoClient, so there's only one Mongo-related
// package in package.json.
//
// Usage:
//   MONGODB_URI="mongodb+srv://..." npm run seed
import mongoose from "mongoose";
import { seedWorks } from "./seed-data.mjs";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is not set. Example:\n  MONGODB_URI="mongodb+srv://..." npm run seed');
  process.exit(1);
}
const dbName = process.env.MONGODB_DB || "railway_atelier";

async function main() {
  await mongoose.connect(uri, { dbName });
  // Plain collection access here (not the Work model / schema) — this is a
  // one-off bulk insert of already-known-good data, no per-field validation
  // needed, and it keeps this script independent of the TypeScript model.
  const collection = mongoose.connection.db.collection("works");

  await collection.createIndex({ slug: 1 }, { unique: true });
  await collection.createIndex({ sortOrder: 1 });

  const existingCount = await collection.countDocuments();
  console.log(`Знайдено ${existingCount} робіт(и) у базі "${dbName}".`);

  let inserted = 0;
  let skipped = 0;
  for (let i = 0; i < seedWorks.length; i++) {
    const work = seedWorks[i];
    const already = await collection.findOne({ slug: work.slug });
    if (already) {
      skipped += 1;
      continue;
    }
    const now = new Date();
    await collection.insertOne({
      ...work,
      sortOrder: i,
      createdAt: now,
      updatedAt: now,
    });
    inserted += 1;
  }

  console.log(`Готово: додано ${inserted}, пропущено (вже існували) ${skipped}.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
