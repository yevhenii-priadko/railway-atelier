import { NextResponse } from 'next/server';
import { readImage } from '@/lib/gridfs';

export const dynamic = 'force-dynamic';

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
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Buffered on purpose, not streamed. Since the next/image migration,
  // Next's built-in image optimizer calls this route *internally* on the
  // server (not a real HTTP fetch) to resize/re-encode same-origin images
  // like this one, capturing the Response body into a buffer itself. That
  // internal capture doesn't reliably wait for a streamed body
  // (Readable.toWeb over the GridFS download stream, which is what this
  // route used to return) — it sometimes grabbed an empty/partial buffer,
  // which is exactly the "requested resource isn't a valid image ...
  // received null" errors flooding the prod logs. Reading the whole file
  // into memory first removes that race: the Response body is a plain,
  // already-complete buffer by the time it's returned. These are
  // individual product photos, not large enough for the memory cost to
  // matter.
  const chunks: Buffer[] = [];
  for await (const chunk of image.stream) {
    chunks.push(chunk as Buffer);
  }
  const body = new Uint8Array(Buffer.concat(chunks));

  return new Response(body, {
    headers: {
      'Content-Type': image.contentType,
      'Content-Length': String(body.length),
      // Uploaded photos are immutable (a re-upload creates a new id), so
      // this can be cached hard.
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
