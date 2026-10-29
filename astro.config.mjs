// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createLastmod } from './_tools/lastmod.mjs';

/**
 * Doors Obłogi — witryna frontend-only (Astro, statyczny SSG).
 *
 * Zawartość jest trzymana w `src/content/*` jako czysty TypeScript/JSON,
 * żeby docelowo podmienić źródło na API CMS (SEO Grow) bez ruszania widoków.
 */

/** Mapa tras → odpowiedniki w trzech językach (hreflang + sitemap xhtml:link). */
const routesMap = JSON.parse(
  readFileSync(new URL('./src/content/routes-map.json', import.meta.url), 'utf-8'),
);

const site = 'https://doors-oblogi.pl';

/** Ścieżka → { pl, en, de }. */
const alternatesByPath = new Map();
for (const group of routesMap.groups) {
  const [pl, en, de] = group;
  // Każdy wariant dostaje ten sam zestaw odpowiedników.
  for (const path of group) {
    alternatesByPath.set(path, { pl, en, de });
  }
}

/** `lastmod` z daty modyfikacji plików źródłowych, nie z czasu buildu. */
const lastmodByPath = createLastmod(routesMap.groups);

/** Ścieżki przekierowań (301) po zmianie slugów EN/DE i nazwy galerii. */
const redirects = {
  // Galeria: „projects/projekte" → „gallery/galerie"
  '/en/projects': '/en/gallery/',
  '/de/projekte': '/de/galerie/',
  // Slugi produktów — EN
  '/en/products/cut-oak-lintel': '/en/products/oak-trim-battens/',
  '/en/products/smoked-oak-lintel': '/en/products/smoked-oak-trim/',
  '/en/products/oak-batten': '/en/products/oak-battens/',
  '/en/products/ceiling-and-wall-panels': '/en/products/oak-ceiling-and-wall-panels/',
  // Slugi produktów — DE
  '/de/produkte/geschnittenes-eichen-oblag': '/de/produkte/eichen-abschlussleiste-auf-mass/',
  '/de/produkte/geraucherte-eichen-oblag': '/de/produkte/geraeucherte-eichen-abschlussleiste/',
  '/de/produkte/eichen-lamelle': '/de/produkte/eichenlamelle/',
  '/de/produkte/decken-und-wandpaneele': '/de/produkte/eichen-decken-und-wandpaneele/',
};

/** Adresy starych slugów — nie wchodzą do sitemapa. */
const legacyPaths = Object.keys(redirects).map((route) => route.replace(/\/$/, ''));

export default defineConfig({
  site,
  trailingSlash: 'always',
  /**
   * Puerto fijo 4330 en desarrollo y en `preview`, igual que `_tools/serve.cjs`
   * y las herramientas de captura/verificación (`_tools/shot.cjs`,
   * `_design/capture.cjs`, `verify-browser.cjs`, …).
   *
   * `host: '127.0.0.1'` es deliberado: por defecto Vite escucha sólo en
   * `::1`, y entonces `http://127.0.0.1:4330` —la URL que usan todos los
   * scripts del repo— devuelve "conexión rechazada". Fijando la IPv4 los dos
   * formularios (`localhost` y `127.0.0.1`) responden, y el servidor no sale
   * a la red local.
   */
  server: { port: 4330, host: '127.0.0.1' },
  preview: { port: 4330, host: '127.0.0.1' },
  /**
   * Barra de desarrollo de Astro fuera. Se dibuja fija abajo en el centro y
   * tapa la barra de CTA móvil: al revisar el diseño en local se confunden las
   * dos. Para volver a tenerla, pon `enabled: true`.
   */
  devToolbar: { enabled: false },
  build: {
    format: 'directory',
  },
  redirects,
  integrations: [
    sitemap({
      // Strony 404, przekierowania i pliki techniczne poza indeksem.
      filter: (page) => {
        const path = page.replace(/\/$/, '');
        return (
          !page.includes('/_brand') &&
          !page.includes('/thank-you') &&
          !page.includes('/404') &&
          !page.includes('/_redirect') &&
          !legacyPaths.some((legacy) => path.endsWith(legacy))
        );
      },
      serialize(item) {
        const path = new URL(item.url).pathname;
        const alternates = alternatesByPath.get(path);
        const links = alternates
          ? [
              { lang: 'pl-PL', url: `${site}${alternates.pl}` },
              { lang: 'en', url: `${site}${alternates.en}` },
              { lang: 'de', url: `${site}${alternates.de}` },
              { lang: 'x-default', url: `${site}${alternates.pl}` },
            ]
          : undefined;

        /**
         * `lastmod` to data modyfikacji TREŚCI, nie data buildu. Jeśli trasa
         * wypadła z `routes-map.json`, nie podajemy daty wcale — wpisanie
         * dziśniejszej daty byłoby kłamstwem (i sitemap zacząłby „wygasać”
         * przy każdym przebudowaniu). `npm run verify` wtedy zgłosi brak
         * `<lastmod>` i przyciśnie do naprawy mapy tras.
         */
        const lastmod = lastmodByPath.get(path);
        if (!lastmod) {
          console.warn(
            `[sitemap] Brak lastmod dla ${path} — trasa nie ma wpisu w routes-map.json. ` +
              'Pominięto lastmod; popraw src/content/routes-map.json.',
          );
        }

        return {
          url: item.url,
          ...(lastmod ? { lastmod } : {}),
          changefreq: 'monthly',
          priority: path === '/' ? 1.0 : 0.7,
          ...(links ? { links } : {}),
        };
      },
    }),
  ],
  image: {
    // Jakościowo: WebP/AVIF, szerokości odpowiednie dla srcset.
    responsiveStyles: true,
  },
  vite: {
    build: {
      assetsInlineLimit: 2048,
    },
  },
});
