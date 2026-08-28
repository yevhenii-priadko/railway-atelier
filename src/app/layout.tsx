import "./globals.css";

// This root layout is intentionally minimal: it only provides the
// <html>/<body> shell. Fonts, <head> metadata and language are set per
// locale in src/app/[locale]/layout.tsx, since every real page of the
// site lives under a /[locale]/ segment.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
