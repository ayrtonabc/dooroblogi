#!/usr/bin/env node
/**
 * Kontrola mapy keyword → strona (`src/content/keywords.ts`) na buildzie.
 *
 * Reguły twarde (błąd → build pada):
 *   1. Każda trasa z mapy musi istnieć w `dist/`.
 *   2. Każda strona w `dist/` (poza 404 i przekierowaniami) musi być w mapie.
 *   3. Dwie strony tego samego języka nie mogą mieć tej samej keyword głównej
 *      → kanibalizacja. (Ta sama keyword w pl i de to OK: son mercados distintos.)
 *
 * Reguły miękkie (uwaga → raport):
 *   4. Keyword główna jednej strony jest fragmentem keyword głównej innej
 *      (np. „obłóg dębowy" ⊂ „obłóg dębowy Olsztyn") — to klaster tematyczny,
 *      ale trzeba go widzieć, bo przy una intención fuerte puede robar
 *      resultados.
 *   5. Un término exacto aparece en el set de dos páginas → hay que saber si
 *      es deliberado (`contested`) o un descuido.
 *   6. Tytuł strony nie zawiera keyword głównej.
 *
 * Uruchomienie: node _tools/check-keywords.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '..');
const DIST = path.join(ROOT, 'dist');

// Node 24 odpala TypeScript bezpośrednio (type stripping), więc mapa keyword
// jest jednym źródłem prawdy dla skryptu i dla strony.
const { keywordMap } = await import(pathToFileURL(path.join(ROOT, 'src/content/keywords.ts')).href);

const problems = [];
const notes = [];
const fail = (m) => problems.push(m);
const note = (m) => notes.push(m);
const LOCALES = ['pl', 'en', 'de'];

// ---------------------------------------------------------------- 1. dist
function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

if (!fs.existsSync(DIST)) {
  console.error('Brak dist/ — najpierw npm run build.');
  process.exit(1);
}

const pages = new Map(); // route → { title, isRedirect, noindex }
for (const file of walk(DIST).filter((f) => f.endsWith('.html'))) {
  const html = fs.readFileSync(file, 'utf8');
  const rel = '/' + path.relative(DIST, file).split(path.sep).join('/');
  const route = rel.replace(/index\.html$/, '');
  const isRedirect = /<meta http-equiv="refresh"/.test(html);
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '';
  const noindex = /<meta name="robots" content="noindex/.test(html);
  pages.set(route, { title, isRedirect, noindex });
}

const indexable = [...pages.entries()].filter(
  ([route, p]) => !p.isRedirect && !p.noindex && !route.includes('404'),
);

// ---------------------------------------------------- 1–2. pokrycie tras
const mappedRoutes = new Set();
for (const entry of keywordMap) {
  for (const [locale, route] of Object.entries(entry.routes)) {
    mappedRoutes.add(route);
    if (!pages.has(route)) {
      fail(`Mapa keywords: trasa ${route} (${locale}) nie istnieje w dist/`);
    }
  }
}
for (const [route] of indexable) {
  if (!mappedRoutes.has(route)) {
    fail(`Mapa keywords: strona ${route} nie ma wpisu w src/content/keywords.ts`);
  }
}

// ------------------------------------------- 3. unikalność keyword głównych
/** locale → keyword(lowercase) → [strony] */
const primaries = new Map();
/** locale → keyword(lowercase) → [strony] (primary + secondary + longTail) */
const allTerms = new Map();

for (const entry of keywordMap) {
  for (const locale of LOCALES) {
    const profile = entry.keywords[locale];
    if (!profile) {
      fail(`Mapa keywords: ${entry.key} nie ma profilu dla języka ${locale}`);
      continue;
    }
    const pKey = profile.primary.trim().toLowerCase();
    const pMap = primaries.get(locale) ?? new Map();
    pMap.set(pKey, [...(pMap.get(pKey) ?? []), entry.key]);
    primaries.set(locale, pMap);

    const aMap = allTerms.get(locale) ?? new Map();
    const terms = [...profile.secondary, ...profile.longTail];
    for (const term of terms) {
      const t = term.trim().toLowerCase();
      aMap.set(t, [...(aMap.get(t) ?? []), entry.key]);
    }
    allTerms.set(locale, aMap);
  }
}

for (const [locale, map] of primaries) {
  for (const [keyword, owners] of map) {
    if (owners.length > 1) {
      fail(
        `Kanibalizacja [${locale}]: keyword główna "${keyword}" należy do kilku stron → ` +
          owners.join(' + '),
      );
    }
  }
}

// ------------------------------- 4. keyword główna jako fragment cudzej
for (const [locale, map] of primaries) {
  const keys = [...map.keys()];
  for (const a of keys) {
    for (const b of keys) {
      if (a === b) continue;
      if (b.includes(a) && a.length >= 6) {
        note(
          `Klaster tematyczny [${locale}]: "${a}" (${map.get(a).join(', ')}) jest fragmentem ` +
            `"${b}" (${map.get(b).join(', ')}). Strona szersza powinna oddawać stronę węższą — ` +
            `sprawdź w Search Console.`,
        );
      }
    }
  }
}

// ------------------------------- 5. termin dokładnie wspólny dwóm stronom
// Interesa solo cuando el término es PRIMARY de una página y aparece en los
// sets de otra: eso sí es canibalización. Dos páginas que comparten una
// secundaria es racimo temático normal, no un conflicto.
for (const [locale, pMap] of primaries) {
  const aMap = allTerms.get(locale) ?? new Map();
  for (const [keyword, owners] of pMap) {
    for (const owner of owners) {
      const others = aMap.get(keyword) ?? [];
      for (const other of [...new Set(others)]) {
        if (other === owner) continue;
        const declared = keywordMap
          .filter((e) => e.key === owner || e.key === other)
          .every((e) => (e.contested ?? []).some((c) => c.term.trim().toLowerCase() === keyword));
        if (!declared) {
          note(
            `Kolizja [${locale}]: "${keyword}" jest keyword główną strony ${owner} ` +
              `i pojawia się w zestawie strony ${other} bez wpisu w \`contested\`.`,
          );
        }
      }
    }
  }
}

// ------------------------------------------- 6. tytuł zawiera keyword główną
for (const entry of keywordMap) {
  for (const [locale, route] of Object.entries(entry.routes)) {
    const page = pages.get(route);
    if (!page || page.isRedirect) continue;
    const primary = entry.keywords[locale]?.primary;
    if (!primary) continue;
    if (!page.title.toLowerCase().includes(primary.toLowerCase())) {
      note(
        `Tytuł bez keyword głównej: ${route} → "${page.title}" ` +
          `(powinno zawierać "${primary}")`,
      );
    }
  }
}

// ---------------------------------------------------------------- raport
console.log(`Strony w mapie keywords: ${keywordMap.length}`);
console.log(`Trasy w dist (indeksowalne): ${indexable.length}`);
for (const locale of LOCALES) {
  console.log(`  ${locale}: ${primaries.get(locale)?.size ?? 0} keyword głównych`);
}

if (notes.length) {
  console.log('\nUwagi:');
  for (const n of [...new Set(notes)]) console.log(' -', n);
}

if (problems.length) {
  console.log('\nPROBLEMY:', problems.length);
  for (const p of problems) console.log(' ✗', p);
  process.exit(1);
}

console.log('\nOK — mapa keywords spójna.');
