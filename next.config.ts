import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: every route (all locales x all pages) is pre-rendered
  // to plain HTML at build time. No Node.js server is required to run
  // pagination or the language switcher — it all happens at `next build`.
  output: "export",

  // Emit /works/2/index.html instead of /works/2.html — plays nicer with
  // most static hosts (GitHub Pages, Netlify, S3, etc.).
  trailingSlash: true,

  // We use plain <img> tags (like the original site) instead of next/image,
  // so no image loader configuration is required for the static export.
  images: {
    unoptimized: true,
  },

  // If this site is deployed under a sub-path again (e.g. GitHub Pages
  // project pages at username.github.io/repo-name/), set NEXT_BASE_PATH
  // at build time and Next.js will prefix all routes and assets with it.
  basePath: process.env.NEXT_BASE_PATH || "",
};

export default nextConfig;
