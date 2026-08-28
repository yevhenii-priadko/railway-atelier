# Railway Atelier — Next.js port

Static-export port of the original GitHub Pages site (`index.html` + `/projects/*.html`) to Next.js (App Router), with pagination and 3 languages — all computed at build time, no backend/API involved.

## What changed vs. the old site

- **Framework**: plain HTML/CSS → Next.js 16 (App Router, TypeScript), `output: 'export'`. `next build` produces a static `out/` folder — deployable anywhere (GitHub Pages, Netlify, S3, Vercel, etc.), same as before.
- **Pagination without a backend**: all 6 works/projects live in `src/data/projects.ts`. `generateStaticParams` reads that array at build time and pre-renders one HTML page per gallery page (`/works/`, `/works/page/2/`, …) and one per project. Add a 7th project to the array and `npm run build` produces the extra page automatically — no server, no API route.
- **3 languages (uk / en / de)**: every route is nested under `/[locale]/`. UI copy lives in `messages/{uk,en,de}.json`; per-project copy (title, works list, summary) lives inline in `src/data/projects.ts` under `translations.{uk,en,de}`. `/` redirects to `/uk/` (the default locale) since a static host can't do a real server-side redirect.
- **Fixes BUG-001 / BUG-002** from `bug-report-002.docx`: prev/next project links were hand-written per HTML file and could desync. They're now derived automatically from the order of `projects` in `src/data/projects.ts`.
- **Addresses RESEARCH-001 / RESEARCH-002**: every page is pre-rendered to full static HTML (visible in "view source", no client JS required to see content), and `robots.txt` explicitly allows `GPTBot`, `OAI-SearchBot`, and `ClaudeBot`, same as the site's existing `robots.txt`.
- All copy, colors, fonts and layout (`styles.css`) were carried over as-is into `src/app/globals.css` — only pagination and the language switcher are new additions, marked as such in the CSS.

## Before you deploy

1. **Set the real site URL** for the sitemap: create `.env.production` (or set the env var in your host) with
   ```
   NEXT_PUBLIC_SITE_URL=https://your-real-domain.com
   ```
   Without it, `sitemap.xml` and `robots.txt` fall back to `https://example.com`.
2. **If deploying to a GitHub Pages *project* page again** (i.e. `username.github.io/repo-name/`, not a custom domain), set `NEXT_BASE_PATH=/repo-name` at build time so links and assets get the right prefix. Skip this for a custom domain or root deployment (Vercel, Netlify, GitHub Pages user site).
3. **Have the EN/DE copy proof-read** by a native speaker before publishing. The English and German text in `messages/en.json`, `messages/de.json`, and the `translations.en` / `translations.de` blocks in `src/data/projects.ts` was translated for this migration and is understandable and accurate, but wasn't reviewed by a native speaker of either language — worth a pass, especially for German, before it goes live.

## Commands

```bash
npm install
npm run dev      # local dev server at http://localhost:3000
npm run build    # builds the static site into ./out
```

Serving `out/` locally to double check the export:

```bash
npx serve out
```

## Project structure

```
messages/                 UI copy per locale (uk.json, en.json, de.json)
src/data/projects.ts       The 6 portfolio projects — single source of truth
                            for the gallery, pagination and project pages
src/i18n/                  Locale list + dictionary loader (no external
                            i18n library — just the pattern Next.js
                            documents for static export)
src/components/            Nav, Hero, About, Services, Process, Gallery,
                            Pagination, ProjectCard, Contact, Footer, etc.
src/app/[locale]/          All real routes: homepage, /works/, /works/page/[page]/,
                            /works/[slug]/
src/app/robots.ts          robots.txt (GPTBot / OAI-SearchBot / ClaudeBot allowed)
src/app/sitemap.ts         sitemap.xml (all locales × all pages)
```

## Adding a 7th project

Add an entry to the `projects` array in `src/data/projects.ts` (slug, maker, article, scale, 3 images, and `translations.uk/en/de`). Pagination, prev/next links and the sitemap all pick it up automatically on the next `npm run build`.
