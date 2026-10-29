/**
 * Presupuesto de JavaScript por página (regla 12 de AGENTS.md).
 *
 * Mide sobre `dist/` lo que el navegador baja de verdad:
 *   · los `<script src>` (chunk externo, comprimido con gzip) + el JS inline.
 * El límite son 60 KB gzip por página.
 *
 * Uso: node _tools/check-budget.cjs
 */
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const DIST = path.join(__dirname, '..', 'dist');
const LIMIT_KB = 60;

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

if (!fs.existsSync(DIST)) {
  console.error('No existe dist/ — ejecuta `npm run build` antes.');
  process.exit(1);
}

const htmls = walk(DIST).filter((file) => file.endsWith('.html'));
const chunkSizes = new Map();

/** Tamaño gzip de un chunk del dist (cacheado: un chunk se repite en muchas páginas). */
function chunkSize(file) {
  if (!chunkSizes.has(file)) {
    chunkSizes.set(file, zlib.gzipSync(fs.readFileSync(file)).length);
  }
  return chunkSizes.get(file);
}

let worst = { bytes: 0, file: '' };
const over = [];

for (const html of htmls) {
  const source = fs.readFileSync(html, 'utf8');
  let total = 0;

  for (const match of source.matchAll(/<script[^>]*\bsrc="([^"]+)"/g)) {
    const asset = match[1].split('?')[0].replace(/^\//, '');
    const file = path.join(DIST, asset);
    if (fs.existsSync(file)) total += chunkSize(file);
  }

  for (const match of source.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
    total += zlib.gzipSync(Buffer.from(match[1], 'utf8')).length;
  }

  if (total > worst.bytes) worst = { bytes: total, file: path.relative(DIST, html) };
  if (total > LIMIT_KB * 1024) over.push({ file: path.relative(DIST, html), kb: total / 1024 });
}

let totalJs = 0;
for (const size of chunkSizes.values()) totalJs += size;

console.log(`Páginas HTML: ${htmls.length}`);
console.log(
  `JS más pesado por página: ${(worst.bytes / 1024).toFixed(1)} KB gzip  →  ${worst.file}`,
);
console.log(`Chunks JS distintos: ${chunkSizes.size}  (${(totalJs / 1024).toFixed(1)} KB gzip en total)`);
console.log(`Presupuesto: ${LIMIT_KB} KB gzip por página`);

if (over.length) {
  console.log(`\n✗ ${over.length} página(s) por encima del presupuesto:`);
  for (const item of over) console.log(`   ${item.kb.toFixed(1)} KB  ${item.file}`);
  process.exit(1);
}

console.log('\n✓ Todas las páginas dentro del presupuesto.');
