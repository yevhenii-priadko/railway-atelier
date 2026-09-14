const GRIDFS_URL_PREFIX = '/api/images/';

/**
 * Makes a photo URL safe to pass as a next/image `src`.
 *
 * next.config.ts sets `trailingSlash: true`, so any app route requested
 * without a trailing slash gets a 308 redirect back to the same path with
 * one — including /api/images/[id]. A real browser request follows that
 * redirect fine, but next/image's built-in optimizer doesn't fetch
 * same-origin images over real HTTP: it re-invokes the route handler
 * in-process and captures whatever that first response is. It never
 * follows the redirect, so it captures the tiny redirect body instead of
 * the photo and rejects it with "isn't a valid image ... received null".
 *
 * GridFS-backed photos (uploaded through /admin, served from
 * /api/images/<id>) are stored without a trailing slash, so this adds one
 * before they're ever used as an <Image src>. Not a plain filesystem
 * route — those come straight from /public and aren't affected — so they
 * pass through untouched.
 */
export function imageSrc(url: string): string {
  if (url.startsWith(GRIDFS_URL_PREFIX) && !url.endsWith('/')) {
    return `${url}/`;
  }
  return url;
}
