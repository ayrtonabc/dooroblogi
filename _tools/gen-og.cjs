/**
 * Generator obrazów Open Graph (1200×630) — sharp.
 *
 * Uruchomienie:  npm run og
 *
 * Źródło zdjęć: zdjęcia klienta z `src/assets/images/` (bez generowania,
 * bez podmiany). Nakładka to gradient + tekst (SVG) złożony przez sharp.
 *
 * Wyniki:
 *   public/og-default.png          — karta marki (Organization logo/image)
 *   public/og/doors-oblogi-*.jpg   — strona główna, wariant per język
 *   public/og/{produkt}-{lang}.jpg — karta produktu
 */
const sharp = require('sharp');
const { mkdirSync } = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const IMAGES = path.join(ROOT, 'src', 'assets', 'images');
const OUT_DIR = path.join(ROOT, 'public', 'og');
const OUT_FILE = path.join(ROOT, 'public', 'og-default.png');

const W = 1200;
const H = 630;

const INK = '#1b1611';
const CREAM = '#f5f0e6';
const OAK = '#9d7a4f';
const SAND = '#d6c3a4';

const esc = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/** Nakładka: gradient + tekst. */
function overlay({ eyebrow, title, sub, footer }) {
  const titleSize = title.length > 34 ? 54 : title.length > 24 ? 62 : 70;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${INK}" stop-opacity="0.15"/>
      <stop offset="42%" stop-color="${INK}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${INK}" stop-opacity="0.93"/>
    </linearGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${OAK}"/>
      <stop offset="100%" stop-color="${SAND}" stop-opacity="0.2"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#grad)"/>
  <rect x="72" y="118" width="120" height="6" fill="url(#bar)"/>
  <text x="72" y="188" font-family="Segoe UI, Arial, sans-serif" font-size="26" letter-spacing="6" fill="${OAK}">${esc(
    eyebrow,
  ).toUpperCase()}</text>
  <text x="72" y="272" font-family="Georgia, 'Times New Roman', serif" font-size="${titleSize}" fill="${CREAM}">${esc(
    title,
  )}</text>
  <text x="72" y="${sub ? 336 : 300}" font-family="Segoe UI, Arial, sans-serif" font-size="27" fill="${SAND}">${esc(
    sub || '',
  )}</text>
  <text x="72" y="574" font-family="Segoe UI, Arial, sans-serif" font-size="24" letter-spacing="2" fill="${CREAM}" fill-opacity="0.72">${esc(
    footer,
  )}</text>
</svg>`);
}

/** Złożenie karty OG: zdjęcie + nakładka. */
async function card({ photo, ...text }) {
  const base = sharp(path.join(IMAGES, photo))
    .resize(W, H, { fit: 'cover', position: 'attention' })
    .modulate({ brightness: 0.92, saturation: 0.95 });

  return base
    .composite([{ input: overlay(text), top: 0, left: 0 }])
    .jpeg({ quality: 82, progressive: true, chromaSubsampling: '4:4:4' })
    .toBuffer();
}

const HOME = {
  pl: {
    eyebrow: 'Doors Obłogi',
    title: 'Obłóg dębowy cięty na wymiar',
    sub: 'Naturalny dąb · lamele · panele sufitowe',
    footer: 'doors-oblogi.pl · Słonecznik k. Olsztyna',
  },
  en: {
    eyebrow: 'Doors Obłogi',
    title: 'Oak trim battens, cut to your size',
    sub: 'Natural oak · slats · ceiling panels',
    footer: 'doors-oblogi.pl · Słonecznik near Olsztyn',
  },
  de: {
    eyebrow: 'Doors Obłogi',
    title: 'Eichen-Abschlussleisten auf Maß',
    sub: 'Natürliche Eiche · Lamellen · Deckenpaneele',
    footer: 'doors-oblogi.pl · Słonecznik bei Olsztyn',
  },
};

const PRODUCTS = [
  {
    id: 'oblog-debowy-ciety',
    photo: 'oblog-na-desce.jpg',
    pl: 'Obłóg dębowy cięty na wymiar',
    en: 'Oak trim battens cut to size',
    de: 'Eichen-Abschlussleiste auf Maß',
  },
  {
    id: 'oblog-debowy-wedzony',
    photo: 'oblog-wedzony.jpg',
    pl: 'Obłóg dębowy wędzony',
    en: 'Smoked oak trim battens',
    de: 'Geräucherte Eichen-Abschlussleiste',
  },
  {
    id: 'lamela-debowa',
    photo: 'profil-oblogu.jpg',
    pl: 'Lamela dębowa 4–8 mm',
    en: 'Oak battens 4–8 mm',
    de: 'Eichenlamelle 4–8 mm',
  },
  {
    id: 'panele-dabowe',
    photo: 'panele-scienne-dab.jpg',
    pl: 'Panele sufitowe i ścienne z dębu',
    en: 'Oak ceiling and wall panels',
    de: 'Eichen-Decken- und Wandpaneele',
  },
];

const PRODUCT_SUB = {
  pl: 'Obłogi dębowe · Słonecznik k. Olsztyna',
  en: 'Oak trim battens · Słonecznik near Olsztyn',
  de: 'Eichen-Abschlussleisten · Słonecznik bei Olsztyn',
};

const PRODUCT_FOOTER = {
  pl: 'Cennik i wycena na zapytanie · doors-oblogi.pl',
  en: 'Price list and quote on request · doors-oblogi.pl',
  de: 'Preisliste und Angebot auf Anfrage · doors-oblogi.pl',
};

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  // 1. Strona główna — wariant per język.
  for (const [locale, text] of Object.entries(HOME)) {
    const buffer = await card({ photo: 'hero-oblog-debowy.jpg', ...text });
    await sharp(buffer).toFile(path.join(OUT_DIR, `doors-oblogi-${locale}.jpg`));
    console.log('ok  og/doors-oblogi-%s.jpg', locale);
  }

  // 2. Produkty — wariant per język.
  for (const product of PRODUCTS) {
    for (const locale of ['pl', 'en', 'de']) {
      const buffer = await card({
        photo: product.photo,
        eyebrow: 'Doors Obłogi',
        title: product[locale],
        sub: PRODUCT_SUB[locale],
        footer: PRODUCT_FOOTER[locale],
      });
      await sharp(buffer).toFile(path.join(OUT_DIR, `${product.id}-${locale}.jpg`));
      console.log('ok  og/%s-%s.jpg', product.id, locale);
    }
  }

  // 3. Karta marki — Organization (logo + image).
  const logoSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${INK}"/>
  <rect x="72" y="150" width="120" height="6" fill="${OAK}"/>
  <text x="72" y="262" font-family="Georgia, 'Times New Roman', serif" font-size="84" fill="${CREAM}">Doors Obłogi</text>
  <text x="72" y="330" font-family="Segoe UI, Arial, sans-serif" font-size="30" letter-spacing="3" fill="${SAND}">OBŁOGI DĘBOWE · LAMELLE · PANELE</text>
  <text x="72" y="560" font-family="Segoe UI, Arial, sans-serif" font-size="26" fill="${CREAM}" fill-opacity="0.7">doors-oblogi.pl · Słonecznik k. Olsztyna · +48 696 741 679</text>
</svg>`);

  await sharp({
    create: { width: W, height: H, channels: 3, background: INK },
  })
    .composite([{ input: logoSvg, top: 0, left: 0 }])
    .png({ compressionLevel: 9 })
    .toFile(OUT_FILE);
  console.log('ok  og-default.png');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
