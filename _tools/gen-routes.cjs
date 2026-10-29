/**
 * Generuje pliki tras (route stubs) dla Astro.
 * Każda trasa to cienki wrapper: layout + widok + metadane SEO.
 * Slugi URL są przetłumaczone (SEO wymaga osobnych adresów per język).
 */
const fs = require('fs');
const path = require('path');

const root = 'C:/Users/Ayrton/Desktop/doorso/src/pages';
const src = 'C:/Users/Ayrton/Desktop/doorso/src';

const PAGES = [
  {
    view: 'HomeView',
    dirs: { pl: '', en: 'en', de: 'de' },
    path: { pl: '/', en: '/en/', de: '/de/' },
    title: {
      pl: 'Obłóg dębowy cięty na wymiar — naturalne listwy dębowe',
      en: 'Cut oak lintel — natural oak trim battens to size',
      de: 'Geschnittenes Eichen-Oblag — natürliche Abschlussleisten auf Maß',
    },
    description: {
      pl: 'Obłogi dębowe, lamele 4–8 mm i gotowe panele sufitowe i ścienne. Naturalny dąb, selekcja bez sęków i z sękami. Cennik i wycena na zapytanie.',
      en: 'Oak lintels, 4–8 mm battens and ready-made ceiling and wall panels. Natural oak, knot-free and knotty selections. Price list on request.',
      de: 'Eichen-Obläge, Lamellen 4–8 mm und fertige Decken- und Wandpaneele. Natürliche Eiche, ohne Äste und mit Ästen. Preisliste auf Anfrage.',
    },
  },
  {
    view: 'CatalogView',
    dirs: { pl: 'produkty', en: 'en/products', de: 'de/produkte' },
    path: { pl: '/produkty/', en: '/en/products/', de: '/de/produkte/' },
    title: {
      pl: 'Produkty — obłogi dębowe, lamele i panele',
      en: 'Products — oak lintels, battens and panels',
      de: 'Produkte — Eichen-Obläge, Lamellen und Paneele',
    },
    description: {
      pl: 'Obłóg dębowy cięty, obłóg wędzony, lamela dębowa 4–8 mm i gotowe panele sufitowe i ścienne z naturalnego dębu.',
      en: 'Cut and smoked oak lintels, 4–8 mm oak battens and ready-made ceiling and wall panels in natural oak.',
      de: 'Geschnittene und geräucherte Eichen-Obläge, Eichen-Lamellen 4–8 mm und fertige Decken- und Wandpaneele aus natürlicher Eiche.',
    },
  },
  {
    view: 'AboutView',
    dirs: { pl: 'o-nas', en: 'en/about', de: 'de/ueber-uns' },
    path: { pl: '/o-nas/', en: '/en/about/', de: '/de/ueber-uns/' },
    title: {
      pl: 'O nas — pracownia naturalnego dębu w Słoneczniku',
      en: 'About us — a natural oak workshop near Olsztyn',
      de: 'Über uns — Werkstatt für natürliche Eiche bei Olsztyn',
    },
    description: {
      pl: 'Doors Obłogi to pracownia obróbki naturalnego dębu w warmińsko-mazurskim. Obłogi, lamele i panele — cięte na wymiar.',
      en: 'Doors Obłogi is a natural oak workshop in the Warmian-Masurian region. Lintels, battens and panels, cut to size.',
      de: 'Doors Obłogi ist eine Werkstatt für natürliche Eiche im Ermland-Masuren. Obläge, Lamellen und Paneele, auf Maß geschnitten.',
    },
  },
  {
    view: 'GalleryView',
    dirs: { pl: 'realizacje', en: 'en/projects', de: 'de/projekte' },
    path: { pl: '/realizacje/', en: '/en/projects/', de: '/de/projekte/' },
    title: {
      pl: 'Galeria — zdjęcia obłogów dębowych i paneli',
      en: 'Gallery — photos of oak lintels and panels',
      de: 'Galerie — Fotos von Eichen-Oblägen und Paneelen',
    },
    description: {
      pl: 'Zdjęcia naszych obłogów, lameli i paneli dębowych: naturalny dąb, dąb z sękami, wędzony dąb i panele ścienne.',
      en: 'Photos of our lintels, battens and oak panels: natural oak, oak with knots, smoked oak and wall panels.',
      de: 'Fotos unserer Obläge, Lamellen und Eichenpaneele: natürliche Eiche, Eiche mit Ästen, geräucherte Eiche und Wandpaneele.',
    },
  },
  {
    view: 'QuoteView',
    dirs: { pl: 'cennik', en: 'en/price-list', de: 'de/preisliste' },
    path: { pl: '/cennik/', en: '/en/price-list/', de: '/de/preisliste/' },
    title: {
      pl: 'Cennik i wycena — poproś o cennik obłogów dębowych',
      en: 'Price list & quote — request oak lintel pricing',
      de: 'Preisliste & Angebot — Preise für Eichen-Obläge anfragen',
    },
    description: {
      pl: 'Cennik zależy od profilu, długości, grubości i ilości. Opisz zastosowanie — wyślemy cennik i termin realizacji na Twój e-mail.',
      en: 'The price list depends on profile, length, thickness and quantity. Describe your application and we will send the price list and a lead time.',
      de: 'Die Preisliste hängt von Profil, Länge, Stärke und Menge ab. Beschreiben Sie Ihr Projekt — wir senden Preisliste und Liefertermin.',
    },
  },
  {
    view: 'ContactView',
    dirs: { pl: 'kontakt', en: 'en/contact', de: 'de/kontakt' },
    path: { pl: '/kontakt/', en: '/en/contact/', de: '/de/kontakt/' },
    title: {
      pl: 'Kontakt — Doors Obłogi, Słonecznik k. Olsztyna',
      en: 'Contact — Doors Obłogi, near Olsztyn',
      de: 'Kontakt — Doors Obłogi, bei Olsztyn',
    },
    description: {
      pl: 'Telefon 696 741 679, Szymon Małoszek. Zapytanie o wycenę obłogów dębowych, lameli i paneli. Wysyłka w całej Polsce.',
      en: 'Phone 696 741 679, Szymon Małoszek. Enquire about oak lintels, battens and panels. Shipping across Poland.',
      de: 'Telefon 696 741 679, Szymon Małoszek. Anfrage zu Eichen-Oblägen, Lamellen und Paneelen. Versand in ganz Polen.',
    },
  },
];

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('wrote', path.relative(root, filePath).replace(/\\/g, '/'));
}

for (const page of PAGES) {
  for (const locale of ['pl', 'en', 'de']) {
    const dir = page.dirs[locale];
    const target = path.join(root, dir, 'index.astro');

    // Ścieżka importu liczona względem pliku trasy.
    const rel = (target) => path.relative(path.dirname(target), src).replace(/\\/g, '/');
    const viewImport = `${rel(target)}/views/${page.view}.astro`;
    const layoutImport = `${rel(target)}/layouts/BaseLayout.astro`;

    const alternates = JSON.stringify(page.path);

    const content = `---
import BaseLayout from '${layoutImport}';
import ${page.view} from '${viewImport}';

const locale = '${locale}' as const;
const path = '${page.path[locale]}';

const alternates = ${alternates} as Partial<Record<typeof locale, string>>;
---

<BaseLayout
  locale={locale}
  path={path}
  title="${page.title[locale].replace(/"/g, '&quot;')}"
  description="${page.description[locale].replace(/"/g, '&quot;')}"
  alternates={alternates}
>
  <${page.view} locale={locale} />
</BaseLayout>
`;
    writeFile(target, content);
  }
}

console.log('done');
