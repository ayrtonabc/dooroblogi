#!/usr/bin/env node
/**
 * Mini-SERP multi-motor: consulta Bing / DuckDuckGo / Mojeek y devuelve
 * título + URL + snippet de los primeros resultados, más las SERP features
 * detectadas en el HTML crudo.
 *
 * Herramienta de INVESTIGACIÓN (no verifica el sitio).
 * Uso:  node _tools/serp.mjs "consulta" ["otra" ...]
 *       node _tools/serp.mjs --region pl-pl --engine bing "consulta"
 *
 * NOTA HONESTA: Bing / DuckDuckGo / Mojeek NO son Google. Sirven para
 * contrastar qué formatos y qué wording premia el buscador, no para
 * medir el ranking real de Google.
 */
const argv = process.argv.slice(2);
const regionIdx = argv.indexOf('--region');
const engineIdx = argv.indexOf('--engine');
const region = regionIdx > -1 ? argv[regionIdx + 1] : 'pl-pl';
const engine = engineIdx > -1 ? argv[engineIdx + 1] : 'bing';
const queries = argv.filter(
  (a, i) => !a.startsWith('--') && i !== regionIdx + 1 && i !== engineIdx + 1,
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const strip = (s) =>
  (s || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

function parseBing(html) {
  const out = [];
  const blocks = html.split(/<li class="b_algo"/).slice(1);
  for (const b of blocks) {
    const t = b.match(/<h2[^>]*>\s*<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
    if (!t) continue;
    const snip = b.match(/<p class="b_lineclamp[^"]*"[^>]*>([\s\S]*?)<\/p>/) ||
      b.match(/<p[^>]*>([\s\S]*?)<\/p>/);
    const cite = b.match(/<cite[^>]*>([\s\S]*?)<\/cite>/);
    out.push({
      title: strip(t[2]),
      url: t[1],
      snippet: strip(snip?.[1]).slice(0, 260),
      site: strip(cite?.[1]),
    });
    if (out.length >= 10) break;
  }
  return out;
}

function parseDdg(html) {
  const out = [];
  const blocks = html.split(/<div class="result results_links/).slice(1);
  for (const b of blocks) {
    const tm = b.match(/class="result__a"[^>]*>([\s\S]*?)<\/a>/);
    const hm = b.match(/class="result__a" href="([^"]+)"/);
    const sm = b.match(/class="result__snippet"[^>]*>([\s\S]*?)<\/a>/);
    if (!tm) continue;
    let url = hm ? hm[1] : '';
    const u = url.match(/[?&]uddg=([^&]+)/);
    if (u) url = decodeURIComponent(u[1]);
    out.push({ title: strip(tm[1]), url, snippet: strip(sm?.[1]).slice(0, 260) });
    if (out.length >= 10) break;
  }
  return out;
}

function parseMojeek(html) {
  const out = [];
  const blocks = html.split(/<li class="result"/).slice(1);
  for (const b of blocks) {
    const tm = b.match(/<a[^>]*class="ob"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
    const am = b.match(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
    const sm = b.match(/<p class="s">([\s\S]*?)<\/p>/);
    if (!tm && !am) continue;
    out.push({
      title: strip(tm ? tm[2] : am[2]),
      url: tm ? tm[1] : am[1],
      snippet: strip(sm?.[1]).slice(0, 260),
    });
    if (out.length >= 10) break;
  }
  return out;
}

/** Features presentes en el HTML crudo del SERP. */
function features(html, eng) {
  const f = [];
  const has = (cond) => cond && f.push(cond);
  if (eng === 'bing') {
    has('caja-respuesta (b_ans)' && /class="b_ans"/.test(html) ? 'caja-respuesta' : null);
    has(/b_pag/.test(html) ? 'paginacion' : null);
    has(/b_vt|b_ans.*video|Videos/.test(html) ? 'bloque-video' : null);
    has(/b_top.*b_ans.*People also ask|b_pagCarousel/.test(html) ? 'people-also-ask' : null);
    has(/class="b_ads"/.test(html) ? 'anuncios' : null);
    has(/class="b_shopping|b_shopping"/.test(html) ? 'bloque-producto' : null);
    has(/b_local|b_lh_an|local/i.test(html) ? 'panel-local' : null);
  } else if (eng === 'ddg') {
    has(/result--ad/.test(html) ? 'anuncios' : null);
    has(/result__icon.*youtube|youtube\.com/.test(html) ? 'video-youtube' : null);
  }
  return f;
}

async function run(engine, q) {
  const enc = encodeURIComponent(q);
  let url;
  if (engine === 'bing') url = `https://www.bing.com/search?q=${enc}&setlang=pl&cc=pl&count=20`;
  else if (engine === 'ddg') url = `https://html.duckduckgo.com/html/?q=${enc}&kl=${region}`;
  else url = `https://www.mojeek.com/search?q=${enc}`;

  const res = await fetch(url, {
    headers: { 'user-agent': UA, 'accept-language': 'pl-PL,pl;q=0.9,en;q=0.8,de;q=0.7' },
  });
  const html = await res.text();
  const results =
    engine === 'bing' ? parseBing(html) : engine === 'ddg' ? parseDdg(html) : parseMojeek(html);
  return { status: res.status, results, features: features(html, engine), len: html.length };
}

/** DDG responde 202 con un formulario de challenge cuando nos rate-limita. */
async function runWithBackoff(engine, q, tries = 4) {
  const waits = [0, 9000, 22000, 40000];
  for (let i = 0; i < tries; i++) {
    if (waits[i]) await sleep(waits[i]);
    const r = await run(engine, q);
    if (r.results.length > 0) return r;
    if (r.status === 202 || r.status === 429) {
      console.log(`  [${engine}] HTTP ${r.status} (rate-limit), reintento ${i + 2}/${tries}…`);
      continue;
    }
    return r;
  }
  return { status: 0, results: [], features: [], len: 0 };
}

for (const q of queries) {
  console.log(`\n${'='.repeat(78)}\n### "${q}"  [motor: ${engine}, region: ${region}]`);
  let ok = false;
  for (const eng of [engine, 'ddg']) {
    if (ok) break;
    try {
      const { status, results, features: feats } = await runWithBackoff(eng, q);
      if (status !== 200 || results.length === 0) {
        console.log(`  [${eng}] HTTP ${status}, ${results.length} resultados`);
        await sleep(900);
        continue;
      }
      ok = true;
      console.log(
        `  motor=${eng}  resultados=${results.length}  features=[${feats.join(', ') || 'ninguna detectable'}]`,
      );
      results.forEach((r, i) => {
        console.log(`${String(i + 1).padStart(2)}. ${r.title}`);
        console.log(`    ${r.url}`);
        if (r.snippet) console.log(`    ${r.snippet}`);
      });
    } catch (err) {
      console.log(`  [${eng}] ERROR ${err.message}`);
    }
    await sleep(2500);
  }
  if (!ok) console.log('  >>> sin resultados en ningún motor');
}
