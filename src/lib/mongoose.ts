import mongoose from "mongoose";

// Standard Next.js + Mongoose connection-caching pattern: in dev, Next
// reloads modules on every edit, which would otherwise open a fresh
// connection per request; caching the promise on `global` survives that.
// In production (one long-lived Node process on Render) this is just a
// simple singleton.

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "railway_atelier";

declare global {
  var _mongooseConnPromise: Promise<typeof mongoose> | undefined;
}

/** Awaiting this guarantees mongoose is connected before you touch a model or the GridFS bucket. */
export function connectMongoose(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Add it to your environment (see .env.example) — " +
        "the works archive and /admin cannot read or write data without it."
    );
  }

  if (!global._mongooseConnPromise) {
    // If the initial connection attempt fails (e.g. Atlas IP whitelist not
    // set up yet), don't cache the rejected promise forever — clear it so
    // the next request tries again instead of failing until the process
    // restarts.
    global._mongooseConnPromise = mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB }).catch((err) => {
      global._mongooseConnPromise = undefined;
      throw err;
    });
  }
  return global._mongooseConnPromise;
}
