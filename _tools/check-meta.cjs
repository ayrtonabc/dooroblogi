/**
 * Kontrola długości metatagów: tytuł ≤ 60 znaków, opis ≤ 160 znaków.
 *
 * Uruchomienie: node _tools/check-meta.cjs
 */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return full.endsWith('.html') ? [full] : [];
  });
}

let issues = 0;
let count = 0;

for (const file of walk(DIST)) {
  const html = fs.readFileSync(file, 'utf-8');
  if (html.includes('http-equiv="refresh"')) continue;

  const url = '/' + path.relative(DIST, file).split(path.sep).join('/').replace(/index\.html$/, '');
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '';
  const description = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  count += 1;

  if (title.length > 60) {
    issues += 1;
    console.log(`✗ tytuł ${title.length} znaków: ${url}`);
    console.log(`   ${title}`);
  }
  if (description.length > 160) {
    issues += 1;
    console.log(`✗ opis ${description.length} znaków: ${url}`);
    console.log(`   ${description}`);
  }
  if (!title.includes('| Doors Obłogi')) {
    issues += 1;
    console.log(`✗ brak wzorca tytułu "${title} | Doors Obłogi": ${url}`);
  }
}

console.log(`\nStrony: ${count}, problemy: ${issues}`);
process.exit(issues ? 1 : 0);
