#!/usr/bin/env node
/**
 * Sugerencias de búsqueda reales de Google (endpoint público `suggestqueries`).
 *
 * Es la fuente de datos más honesta que hay sin acceso a la API de Search
 * Console: NO devuelve posiciones ni volumen, pero SÍ devuelve las cadenas
 * que los usuarios escriben de verdad, con el orden deGoogle.
 *
 * Uso:  node _tools/suggest.mjs pl "obłóg dębowy" "lamela dębowa"
 *       node _tools/suggest.mjs en "oak trim battens"
 *       node _tools/suggest.mjs de "Eichen-Abschlussleiste"
 *       node _tools/suggest.mjs pl --expand "obłóg dębowy"   (añade a-z)
 */
const LOCALE = {
  pl: { hl: 'pl', gl: 'pl' },
  en: { hl: 'en', gl: 'us' },
  'en-gb': { hl: 'en', gl: 'gb' },
  de: { hl: 'de', gl: 'de' },
};

const argv = process.argv.slice(2);
const lang = argv[0];
const expand = argv.includes('--expand');
const seeds = argv.filter((a) => !a.startsWith('--') && a !== lang);

const { hl, gl } = LOCALE[lang] ?? LOCALE.pl;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function suggest(q) {
  const url = `https://suggestqueries.google.com/complete/search?client=firefox&hl=${hl}&gl=${gl}&q=${encodeURIComponent(q)}`;
  try {
    const res = await fetch(url, {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      },
    });
    const text = await res.text();
    const json = JSON.parse(text);
    return json[1] ?? [];
  } catch (err) {
    console.error(`  ERROR ${q}: ${err.message}`);
    return [];
  }
}

for (const seed of seeds) {
  const queries = [seed];
  if (expand) {
    for (const letter of 'abcdefghijklmnopqrstuvwxyz') queries.push(`${seed} ${letter}`);
  }
  const seen = new Set();
  const all = [];
  for (const q of queries) {
    for (const s of await suggest(q)) {
      if (!seen.has(s)) {
        seen.add(s);
        all.push(s);
      }
    }
    await sleep(120);
  }
  console.log(`\n### [${lang}] "${seed}" — ${all.length} sugerencias`);
  all.forEach((s, i) => console.log(`${String(i + 1).padStart(2)}. ${s}`));
}
