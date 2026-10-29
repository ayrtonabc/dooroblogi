/**
 * Czysci zapis `? '...' \n : de:\n '...'` — poprawna składnia JS,
 * ale zapisana jako `de:` (etykieta obiektu) wewnątrz wyrażenia ternary.
 */
const fs = require('fs');
const path = require('path');

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.astro')) out.push(full);
  }
  return out;
}

let total = 0;
for (const file of walk('C:/Users/Ayrton/Desktop/doorso/src')) {
  const before = fs.readFileSync(file, 'utf8');
  const after = before.replace(/^([ \t]*): de:\n[ \t]*/gm, '$1: ');
  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    total += 1;
    console.log('fixed', path.relative('C:/Users/Ayrton/Desktop/doorso', file).replace(/\\/g, '/'));
  }
}
console.log('files fixed:', total);
