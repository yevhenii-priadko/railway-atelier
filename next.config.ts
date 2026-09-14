import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // No longer a static export: the works archive now reads from MongoDB
  // (see src/lib/works.ts) so it can change without a rebuild, and /admin
  // needs a real server for its login cookie + server actions. This now
  // deploys as a Node.js server (`next build` + `next start`), e.g. on
  // Render, rather than as a static `out/` folder.

  // Emit /works/2/index.html instead of /works/2.html — plays nicer with
  // most hosts and keeps the same URLs as the previous static-export version.
  trailingSlash: true,

  // Switched from plain <img> tags to next/image (PageSpeed flagged the
  // real work photos as oversized/unoptimized on mobile). All sources are
  // same-origin — /public files or the /api/images/[id] GridFS route — so
  // no remotePatterns/domains config is needed for the built-in optimizer.
  // This runs as a real Node server (see above), so `sharp` is required in
  // production for the optimizer; it's in package.json's dependencies.

  // If this site is deployed under a sub-path (e.g. GitHub Pages project
  // pages at username.github.io/repo-name/), set NEXT_BASE_PATH at build
  // time and Next.js will prefix all routes and assets with it.
  basePath: process.env.NEXT_BASE_PATH || '',
};

export default nextConfig;
