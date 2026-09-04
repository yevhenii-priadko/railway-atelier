import { NextResponse } from "next/server";
import { Readable } from "node:stream";
import { readImage } from "@/lib/gridfs";

export const dynamic = "force-dynamic";

// Serves a photo uploaded through /admin (stored in MongoDB via GridFS).
// Photos migrated from the original static seed just live in /public and
// never hit this route at all.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const image = await readImage(id);
  if (!image) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const webStream = Readable.toWeb(image.stream as Readable) as ReadableStream;
  return new Response(webStream, {
    headers: {
      "Content-Type": image.contentType,
      "Content-Length": String(image.length),
      // Uploaded photos are immutable (a re-upload creates a new id), so
      // this can be cached hard.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
