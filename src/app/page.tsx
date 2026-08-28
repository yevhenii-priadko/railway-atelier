import { defaultLocale } from "@/i18n/config";

// The site is fully static (output: 'export'), so there is no server to
// perform a real HTTP redirect from "/" to "/uk/". Instead we render a
// tiny static HTML page that redirects via <meta refresh> (works even
// with JS disabled) and a JS fallback for instant redirects.
export default function RootPage() {
  const target = `/${defaultLocale}/`;
  return (
    <html lang={defaultLocale}>
      <head>
        <meta httpEquiv="refresh" content={`0; url=${target}`} />
        <title>Railway Atelier</title>
      </head>
      <body>
        <p>
          Redirecting to <a href={target}>{target}</a>…
        </p>
        <script
          // Fires immediately on load, before the meta-refresh timer in
          // some browsers, and works regardless of the configured
          // basePath since it uses a relative navigation.
          dangerouslySetInnerHTML={{
            __html: `window.location.replace(${JSON.stringify(target)});`,
          }}
        />
      </body>
    </html>
  );
}
