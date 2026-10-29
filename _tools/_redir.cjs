const fs = require('node:fs');
for (const p of process.argv.slice(2)) {
  const h = fs.readFileSync(p, 'utf8');
  const g = (re) => (h.match(re) || [])[1];
  console.log(p);
  console.log('  redirect :', g(/http-equiv="refresh" content="0;url=([^"]+)"/));
  console.log('  canonical:', g(/<link rel="canonical" href="([^"]+)"/));
  console.log('  robots   :', g(/<meta name="robots" content="([^"]+)"/));
  console.log('  title    :', g(/<title>([\s\S]*?)<\/title>/));
}
