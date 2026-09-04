import "./admin.css";

// /admin lives outside the /[locale] segment (it's an internal tool, not a
// public, translated page), so — unlike every other route — it needs its
// own <html>/<body>: the root layout (src/app/layout.tsx) is intentionally
// bare and relies on [locale]/layout.tsx to supply that for public pages.
export const metadata = {
  title: "Адмінка · Railway Atelier",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body className="admin-body">{children}</body>
    </html>
  );
}
