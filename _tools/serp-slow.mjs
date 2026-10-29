#!/usr/bin/env node
/**
 * SERP con ritmo lento: DuckDuckGo HTML rate-limita a ~2-3 consultas por
 * ventana, así que aquí se espacia cada consulta 90 s y se reintenta con
 * esperas largas. Los resultados se anexan a un archivo de texto.
 *
 * Uso: node _tools/serp-slow.mjs "consulta" ["otra" ...]
 */
import fs from 'node:fs';

const queries = process.argv.slice(2);
const OUT = '_tools/serp-log.txt';
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const strip = (s) =>
  (s || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

function parse(html) {
  const out = [];
  for (const b of html.split(/<div class="result results_links/).slice(1)) {
    const tm = b.match(/class="result__a"[^>]*>([\s\S]*?)<\/a>/);
    const hm = b.match(/class="result__a" href="([^"]+)"/);
    const sm = b.match(/class="result__snippet"[^>]*>([\s\S]*?)<\/a>/);
    if (!tm) continue;
    let url = hm ? hm[1] : '';
    const u = url.match(/[?&]uddg=([^&]+)/);
    if (u) url = decodeURIComponent(u[1]);
    out.push({ title: strip(tm[1]), url, snippet: strip(sm?.[1]).slice(0, 240) });
    if (out.length >= 10) break;
  }
  return out;
}

/** Versión "lite" del HTML de DuckDuckGo: mismos resultados, otro endpoint. */
function parseLite(html) {
  const out = [];
  const links = [...html.matchAll(/<a rel="nofollow" href="([^"]+)" class='result-link'>([\s\S]*?)<\/a>/g)];
  for (const [, href, title] of links) {
    let url = href;
    const u = url.match(/[?&]uddg=([^&]+)/);
    if (u) url = decodeURIComponent(u[1]);
    out.push({ title: strip(title), url, snippet: '' });
    if (out.length >= 10) break;
  }
  return out;
}

const ENDPOINTS = [
  { url: (q) => `https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}&kl=pl-pl`, parse },
  { url: (q) => `https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(q)}&kl=pl-pl`, parse: parseLite },
  { url: (q) => `https://duckduckgo.com/html/?q=${encodeURIComponent(q)}&kl=pl-pl`, parse },
];

const waits = [0, 20000, 45000, 90000, 150000, 240000];

for (const q of queries) {
  let done = false;
  for (let i = 0; i < waits.length && !done; i++) {
    if (waits[i]) await sleep(waits[i]);
    for (const endpoint of ENDPOINTS) {
      try {
        const res = await fetch(endpoint.url(q), {
          headers: { 'user-agent': UA, 'accept-language': 'pl-PL,pl;q=0.9' },
        });
        const html = await res.text();
        const results = endpoint.parse(html);
        if (results.length) {
          const lines = [`\n### "${q}"  [DuckDuckGo, ${new Date().toISOString().slice(0, 10)}]`];
          results.forEach((r, i) => {
            lines.push(`${i + 1}. ${r.title}`);
            lines.push(`   ${r.url}`);
            if (r.snippet) lines.push(`   ${r.snippet}`);
          });
          fs.appendFileSync(OUT, lines.join('\n') + '\n', 'utf8');
          console.log(lines.join('\n'));
          done = true;
          break;
        }
      } catch (err) {
        console.log(`  [${q}] ERROR ${err.message}`);
      }
    }
    if (!done) console.log(`  [${q}] HTTP rate-limit, reintento ${i + 2}`);
  }
  if (!done) console.log(`  >>> "${q}" sin resultados (rate-limit persistente)`);
  await sleep(30000);
}
