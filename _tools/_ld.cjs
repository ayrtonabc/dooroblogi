const fs = require('node:fs');
const file = process.argv[2];
const html = fs.readFileSync(file, 'utf8');
const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
console.log(`BLOQUES: ${blocks.length}`);
blocks.forEach((b, i) => {
  console.log(`\n--- bloque ${i + 1} ---`);
  console.log(JSON.stringify(JSON.parse(b[1]), null, 2));
});
