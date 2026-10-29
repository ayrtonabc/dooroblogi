#!/usr/bin/env node
/**
 * Dump SEO state of every generated page: title, description, canonical,
 * hreflang set, JSON-LD types, robots.
 *
 * Read-only. Usage: node _tools/audit-seo.cjs [--json]
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function pick(html, re) {
  const m = html.match(re);
  return m ? m[1] : null;
}

const pages = walk(dist)
  .map((file) => {
    const html = fs.readFileSync(file, 'utf8');
    const rel = path.relative(dist, file).replace(/\\/g, '/');
    const title = pick(html, /<title>([\s\S]*?)<\/title>/);
    const description = pick(html, /<meta name="description" content="([^"]*)"/);
    const canonical = pick(html, /<link rel="canonical" href="([^"]*)"/);
    const robots = pick(html, /<meta name="robots" content="([^"]*)"/);
    const ogImage = pick(html, /<meta property="og:image" content="([^"]*)"/);
    const ogLocale = pick(html, /<meta property="og:locale" content="([^"]*)"/);
    const ogType = pick(html, /<meta property="og:type" content="([^"]*)"/);
    const ogTitle = pick(html, /<meta property="og:title" content="([^"]*)"/);
    const ogDesc = pick(html, /<meta property="og:description" content="([^"]*)"/);
    const ogAlt = pick(html, /<meta property="og:image:alt" content="([^"]*)"/);
    const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) =>
      m[1].replace(/<[^>]+>/g, '').trim(),
    );
    const alternates = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map(
      (m) => ({ lang: m[1], href: m[2] }),
    );
    const ldBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
      (m) => m[1],
    );
    const types = [];
    const ldErrors = [];
    for (const block of ldBlocks) {
      try {
        const parsed = JSON.parse(block);
        const list = Array.isArray(parsed) ? parsed : [parsed];
        for (const entry of list) {
          if (entry['@type']) types.push(entry['@type']);
          for (const sub of entry['@graph'] ?? []) {
            if (sub['@type']) types.push(sub['@type']);
          }
        }
      } catch (err) {
        ldErrors.push(String(err));
      }
    }
    return {
      file: rel,
      title,
      titleLen: title ? title.length : 0,
      description,
      descLen: description ? description.length : 0,
      canonical,
      robots,
      ogImage,
      ogLocale,
      ogType,
      ogTitle,
      ogDesc,
      ogAlt,
      h1s,
      alternates,
      ldTypes: types,
      ldErrors,
      ldRaw: ldBlocks,
      html,
    };
  })
  .sort((a, b) => a.file.localeCompare(b.file));

if (process.argv.includes('--json')) {
  console.log(
    JSON.stringify(
      pages.map(({ html, ldRaw, ...rest }) => rest),
      null,
      2,
    ),
  );
  process.exit(0);
}

if (process.argv.includes('--table')) {
  console.log('RUTA'.padEnd(46) + 'T' + 'D'.padEnd(6) + 'TITLE');
  for (const p of pages) {
    if (p.robots && /noindex/.test(p.robots)) continue;
    console.log(
      p.file.padEnd(46) +
        String(p.titleLen).padStart(3) +
        ' ' +
        String(p.descLen).padStart(3) +
        '  ' +
        p.title,
    );
  }
  console.log('\nRUTA'.padEnd(46) + 'DESCRIPTION');
  for (const p of pages) {
    if (p.robots && /noindex/.test(p.robots)) continue;
    console.log(p.file.padEnd(46) + '  ' + p.description);
  }
  process.exit(0);
}

console.log(`Strony: ${pages.length}\n`);
for (const p of pages) {
  console.log('='.repeat(90));
  console.log(p.file);
  console.log(`  title(${p.titleLen}): ${p.title}`);
  console.log(`  desc(${p.descLen}): ${p.description}`);
  console.log(`  canonical: ${p.canonical}`);
  console.log(`  robots: ${p.robots ?? '(index)'}`);
  console.log(`  og:type=${p.ogType} og:locale=${p.ogLocale} og:image=${p.ogImage}`);
  console.log(`  og:title=${p.ogTitle}`);
  console.log(`  og:desc=${p.ogDesc}`);
  console.log(`  og:image:alt=${p.ogAlt}`);
  console.log(`  h1: ${JSON.stringify(p.h1s)}`);
  console.log(`  hreflang: ${p.alternates.map((a) => `${a.lang}=${a.href}`).join(' | ')}`);
  console.log(`  ld types: ${p.ldTypes.join(', ')}`);
  if (p.ldErrors.length) console.log(`  LD ERRORS: ${p.ldErrors.join('; ')}`);
}

// Global stats
const titles = new Map();
for (const p of pages) {
  const list = titles.get(p.title) ?? [];
  list.push(p.file);
  titles.set(p.title, list);
}
console.log('\n' + '='.repeat(90));
console.log('TÍTULOS DUPLICADOS:');
for (const [t, files] of titles) if (files.length > 1) console.log(`  "${t}" -> ${files.join(', ')}`);

console.log('\nTÍTULOS > 60:');
for (const p of pages) if (p.titleLen > 60) console.log(`  ${p.titleLen} ${p.file}: ${p.title}`);

console.log('\nDESCRIPCIONES > 160:');
for (const p of pages) if (p.descLen > 160) console.log(`  ${p.descLen} ${p.file}: ${p.description}`);

console.log('\nCANONICAL no absoluto o distinto de la URL esperada:');
for (const p of pages) {
  const expected = `https://doors-oblogi.pl/${p.file.replace(/index\.html$/, '')}`;
  if (p.canonical !== expected) console.log(`  ${p.file}\n    got:      ${p.canonical}\n    expected: ${expected}`);
}
