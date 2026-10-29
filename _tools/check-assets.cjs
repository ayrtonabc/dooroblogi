/**
 * Sprawdza, czy wszystkie assety Astro (src + srcset) istnieją w dist/.
 *
 * Uruchomienie: node _tools/check-assets.cjs
 */
const fs = require('fs');
const path = require('path');

const dist = path.resolve(__dirname, '..', 'dist');

function checkPage(rel) {
  const file = path.join(dist, rel);
  const html = fs.readFileSync(file, 'utf8');
  const urls = new Set();
  for (const m of html.matchAll(/(?:src|srcset)="([^"]+)"/g)) {
    for (const part of m[1].split(',')) {
      const p = (part.trim().split(' ')[0] || '').replace(/&amp;/g, '&');
      if (p.startsWith('/_astro/')) urls.add(p);
    }
  }
  let missing = 0;
  for (const u of urls) {
    if (!fs.existsSync(path.join(dist, u.replace(/^\//, '')))) {
      missing += 1;
      console.log('  MISSING', u);
    }
  }
  const imgs = (html.match(/<img/g) || []).length;
  const lazy = (html.match(/loading="lazy"/g) || []).length;
  console.log(`${rel.padEnd(34)} assets=${String(urls.size).padStart(3)} missing=${missing} imgs=${String(imgs).padStart(3)} lazy=${lazy}`);
  return missing;
}

let totalMissing = 0;
for (const page of [
  'index.html',
  'produkty/index.html',
  'produkty/oblog-debowy-ciety/index.html',
  'cennik/index.html',
  'kontakt/index.html',
  'realizacje/index.html',
  'o-nas/index.html',
  'en/index.html',
  'de/index.html',
  // Realna karta produktu po niemiecku. Wcześniej wskazywaliśmy na
  // `de/produkte/geschnittenes-eichen-oblag/`, który jest dziś tylko
  // przekierowaniem 301 po zmianie sluga — skrypt sprawdzał stub,
  // a nie żadną stronę produktu.
  'de/produkte/eichen-abschlussleiste-auf-mass/index.html',
]) {
  totalMissing += checkPage(page);
}
console.log('\nTOTAL MISSING:', totalMissing);
process.exit(totalMissing ? 1 : 0);
