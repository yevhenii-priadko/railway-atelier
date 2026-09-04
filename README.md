# Railway Atelier — Next.js + MongoDB backend

Next.js 16 (App Router, TypeScript) site with 3 languages. The works/conversions archive is now backed by MongoDB instead of a hardcoded array, with a small password-protected `/admin` panel so new works can be added without touching code or redeploying.

## What changed vs. the static-export version

- **No longer a static export.** `next build` + `next start` now run as a real Node.js server (e.g. on Render), because the works archive reads from MongoDB on every request and `/admin` needs server-side sessions and file uploads. Everything else — layout, copy, styling — is unchanged.
- **Works archive → MongoDB (via Mongoose).** The 6 original conversions that used to live in `src/data/projects.ts` are now documents in a `works` collection, modeled with a Mongoose schema (`src/models/Work.ts`) and queried from `src/lib/works.ts`. Pagination, the homepage teaser, and project detail pages all read from there; the page-size and page-token logic is identical to before, just driven by real data instead of a static array + padding placeholders.
- **`/admin` panel.** A single shared password (`ADMIN_PASSWORD`) protects `/admin`. From there you can add a work (maker/article/scale, title/type/works-list/summary in uk/en/de, 3 photos), edit or delete an existing one, and reorder the archive with up/down buttons. No user accounts, no roles — see `src/lib/session.ts` for the (deliberately minimal) auth.
- **Photo uploads** go into MongoDB via GridFS (`src/lib/gridfs.ts`) and are served from `/api/images/[id]`. The 6 seeded works keep pointing at their original files in `/public/images/` — nothing to migrate there.
- **3 languages (uk / en / de)** unchanged: UI copy in `messages/{uk,en,de}.json`, per-work copy in the `translations.{uk,en,de}` field of each Mongo document.

## Environment variables

Copy `.env.example` to `.env.local` for local dev, or set these on the host in production:

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection string (Atlas free tier is fine) |
| `MONGODB_DB` | Database name (defaults to `railway_atelier`) |
| `ADMIN_PASSWORD` | The one password that unlocks `/admin` |
| `SESSION_SECRET` | Random string used to sign the login cookie (`openssl rand -hex 32`) |
| `NEXT_PUBLIC_SITE_URL` | Real production domain, used in `sitemap.xml`/`robots.txt` |

## Commands

```bash
npm install
npm run dev      # local dev server at http://localhost:3000
npm run build    # production build (Node server, not a static export anymore)
npm start        # run the production server
npm run seed     # one-off: populate MongoDB with the original 6 works
```

Seeding a fresh database:

```bash
MONGODB_URI="mongodb+srv://..." npm run seed
```

Safe to re-run — it skips any slug that already exists rather than duplicating it.

## Deploying

This needs a Node.js host now (not a static file host like GitHub Pages) — Render works well:

1. Create a MongoDB Atlas cluster (free tier is enough for this) and grab its connection string.
2. Create a Render Web Service pointed at this repo — build command `npm install && npm run build`, start command `npm start`.
3. Set the environment variables above on that service.
4. Run `npm run seed` once (locally, pointed at the Atlas connection string) to load the original 6 works.
5. If moving off a GitHub Pages *project* page (`username.github.io/repo-name/`), drop `NEXT_BASE_PATH` — it's no longer needed once you're not deploying under a sub-path.

## Project structure

```
messages/                     UI copy per locale (uk.json, en.json, de.json)
src/lib/work-types.ts         Shared Work/WorkTranslation TypeScript types
src/models/Work.ts            Mongoose schema/model for a work
src/lib/mongoose.ts           Cached Mongoose connection
src/lib/works.ts              All Mongo queries: pagination, CRUD, reorder
src/lib/work-form.ts          Parses the admin form's FormData into a Work
src/lib/gridfs.ts             Stores/serves uploaded photos (GridFS)
src/lib/session.ts            Minimal password + signed-cookie auth for /admin
src/i18n/                     Locale list + dictionary loader
src/components/               Nav, Hero, About, Services, Process, Gallery,
                               Pagination, ProjectCard, Contact, Footer, etc.
src/components/admin/         /admin UI: login form, works list, work form
src/app/[locale]/             Public routes: homepage, /works/, /works/page/[page]/,
                               /works/[slug]/ — all now dynamically rendered
src/app/admin/                /admin panel (outside /[locale] — Ukrainian-only, internal tool)
src/app/api/images/[id]/      Streams an uploaded photo out of GridFS
src/app/robots.ts             robots.txt (GPTBot / OAI-SearchBot / ClaudeBot allowed)
src/app/sitemap.ts            sitemap.xml (all locales × all pages, now built per-request)
scripts/seed.mjs              One-off migration: loads the original 6 works into Mongo
```

## Adding a work from now on

Go to `/admin`, log in with the shared password, and use "Додати роботу" — no code changes or redeploys needed. Editing `src/data/projects.ts` is no longer a thing; that file has been removed.
