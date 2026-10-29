/**
 * Weryfikacja builda — działa na wygenerowanym `dist/`, nie na kodzie źródłowym.
 *
 * Sprawdza:
 *   1. każdy link/img wewnętrzny ma plik w dist (brak 404),
 *   2. tytuły stron są unikalne,
 *   3. JSON-LD parseuje się jako poprawny JSON,
 *   4. hreflang jest odwzorowany (reciprocity) i wskazuje istniejące strony,
 *   5. og:image wskazuje istniejący plik,
 *   6. sitemap zawiera komplet stron z xhtml:link.
 *
 * Uruchomienie: node _tools/verify-dist.cjs
 */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const problems = [];
const notes = [];
const redirects = [];

function fail(message) {
  problems.push(message);
}

function walk(dir, filter) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full, filter);
    return filter(full) ? [full] : [];
  });
}

const htmlFiles = walk(DIST, (f) => f.endsWith('.html'));
const distFiles = new Set(
  walk(DIST, () => true).map((f) => '/' + path.relative(DIST, f).split(path.sep).join('/')),
);

function urlToFile(url) {
  const clean = url.split('#')[0].split('?')[0];
  if (!clean.startsWith('/')) return null;
  if (/\.[a-z0-9]{2,5}$/i.test(clean)) return clean;
  return `${clean.replace(/\/$/, '')}/index.html`;
}

function existsInDist(url) {
  const file = urlToFile(url);
  if (!file) return true;
  return distFiles.has(file);
}

// ---------------------------------------------------------------- 1. linki
const pageData = [];

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf-8');
  const pageUrl = '/' + path.relative(DIST, file).split(path.sep).join('/').replace(/index\.html$/, '');

  // Strony przekierowania generowane przez Astro — sprawdzamy tylko, czy
  // wskazują istniejący cel.
  const redirectTo = (html.match(/<meta http-equiv="refresh" content="0;url=([^"]+)"/) || [])[1];
  if (redirectTo) {
    if (!existsInDist(redirectTo)) fail(`404: przekierowanie ${pageUrl} → ${redirectTo}`);
    redirects.push({ pageUrl, redirectTo });
    continue;
  }

  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '';
  const canonical = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1] || '';
  const ogImage = (html.match(/<meta property="og:image" content="([^"]+)"/) || [])[1] || '';

  // hreflang
  const hreflang = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map(
    (m) => ({ lang: m[1], href: m[2] }),
  );

  // JSON-LD
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(
    (m) => m[1],
  );

  // linki i zasoby
  const refs = [
    ...[...html.matchAll(/<a [^>]*href="([^"]+)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/<img [^>]*src="([^"]+)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/<link [^>]*href="([^"]+)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map((m) => m[1]),
  ];

  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:|data:|javascript:|#)/i.test(ref)) continue;
    if (!existsInDist(ref)) fail(`404: ${pageUrl} → ${ref}`);
  }

  // og:image
  if (ogImage) {
    const ogPath = ogImage.replace('https://doors-oblogi.pl', '');
    if (!existsInDist(ogPath)) fail(`404: ${pageUrl} → og:image ${ogPath}`);
  }

  // JSON-LD
  jsonLd.forEach((raw, index) => {
    try {
      JSON.parse(raw);
    } catch (error) {
      fail(`JSON-LD niepoprawny w ${pageUrl} (blok ${index + 1}): ${error.message}`);
    }
  });

  pageData.push({ file, pageUrl, title, canonical, hreflang, jsonLd: jsonLd.length, ogImage });
}

// ---------------------------------------------------------------- 2. tytuły
const titleMap = new Map();
for (const page of pageData) {
  const normalized = page.title.trim();
  if (!normalized) {
    fail(`Brak tytułu: ${page.pageUrl}`);
    continue;
  }
  if (!titleMap.has(normalized)) titleMap.set(normalized, []);
  titleMap.get(normalized).push(page.pageUrl);
}
for (const [title, urls] of titleMap) {
  if (urls.length > 1) fail(`Duplikat tytułu "${title}" → ${urls.join(', ')}`);
}

// długość tytułu
for (const page of pageData) {
  const len = page.title.trim().length;
  if (len > 60) notes.push(`Tytuł ${len} znaków (>60): ${page.pageUrl} → "${page.title.trim()}"`);
}

// ---------------------------------------------------------------- 3. hreflang
const byUrl = new Map(pageData.map((p) => [p.pageUrl, p]));
for (const page of pageData) {
  if (page.pageUrl.includes('404')) {
    if (page.hreflang.length) fail(`404: strona 404 nie powinna emitować hreflang (${page.pageUrl})`);
    continue;
  }
  if (!page.hreflang.length) {
    fail(`Brak hreflang: ${page.pageUrl}`);
    continue;
  }
  const targets = new Map(page.hreflang.map((h) => [h.href.replace('https://doors-oblogi.pl', ''), h.lang]));

  for (const [target, lang] of targets) {
    const targetPage = byUrl.get(target) || byUrl.get(target.replace(/\/$/, '/'));
    if (!targetPage) {
      fail(`hreflang do nieistniejącej strony: ${page.pageUrl} (${lang}) → ${target}`);
      continue;
    }
    // reciprocity: strona docelowa musi wskazywać z powrotem
    const back = targetPage.hreflang.find(
      (h) => h.href.replace('https://doors-oblogi.pl', '') === page.pageUrl,
    );
    if (!back) fail(`hreflang nie jest odwzorowany: ${page.pageUrl} → ${target}`);
  }

  // x-default
  if (!page.hreflang.some((h) => h.lang === 'x-default')) {
    fail(`Brak x-default: ${page.pageUrl}`);
  }
}

// ---------------------------------------------------------------- 4. sitemap
const sitemapFile = path.join(DIST, 'sitemap-0.xml');
if (!fs.existsSync(sitemapFile)) {
  fail('Brak dist/sitemap-0.xml');
} else {
  const xml = fs.readFileSync(sitemapFile, 'utf-8');
  const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1]);
  notes.push(`Sitemap: ${entries.length} adresów URL`);

  for (const entry of entries) {
    const loc = (entry.match(/<loc>([^<]+)<\/loc>/) || [])[1];
    if (!loc) {
      fail('Wpis w sitemapie bez <loc>');
      continue;
    }
    const path = loc.replace('https://doors-oblogi.pl', '');
    if (!existsInDist(loc)) fail(`Sitemap: adres bez pliku w dist → ${loc}`);
    if (!entry.includes('xhtml:link')) fail(`Sitemap: brak xhtml:link → ${loc}`);
    if (!entry.includes('<lastmod>')) fail(`Sitemap: brak lastmod → ${loc}`);
    const links = [...entry.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)];
    if (links.length < 4) fail(`Sitemap: mało wariantów hreflang (${links.length}) → ${loc}`);
    for (const [, , href] of links) {
      if (!existsInDist(href)) fail(`Sitemap: hreflang bez pliku → ${href}`);
    }

    // Sitemap musi wskazywać te same warianty co <link hreflang> w HTML strony.
    const page = byUrl.get(path);
    if (page) {
      const fromHtml = page.hreflang
        .filter((h) => h.lang !== 'x-default')
        .map((h) => `${h.lang} ${h.href.replace('https://doors-oblogi.pl', '')}`)
        .sort();
      const fromSitemap = links
        .filter(([, lang]) => lang !== 'x-default')
        .map(([, lang, href]) => `${lang} ${href.replace('https://doors-oblogi.pl', '')}`)
        .sort();
      if (fromHtml.join(' | ') !== fromSitemap.join(' | ')) {
        fail(
          `Sitemap: hreflang różni się od strony → ${loc}\n     HTML: ${fromHtml.join(' | ')}\n     XML : ${fromSitemap.join(' | ')}`,
        );
      }
    }
  }
}

// ---------------------------------------------------------------- raport
console.log('Strony HTML:', htmlFiles.length);
console.log('Unikalne tytuły:', titleMap.size);
console.log('JSON-LD (bloki):', pageData.reduce((sum, p) => sum + p.jsonLd, 0));
console.log('Przekierowania (301):', redirects.length);

if (notes.length) {
  console.log('\nUwagi:');
  for (const note of notes) console.log(' -', note);
}

if (problems.length) {
  console.log('\nPROBLEMY:', problems.length);
  for (const problem of problems.slice(0, 60)) console.log(' ✗', problem);
  if (problems.length > 60) console.log(` … i ${problems.length - 60} więcej`);
  process.exit(1);
}

console.log('\nOK — brak problemów.');
