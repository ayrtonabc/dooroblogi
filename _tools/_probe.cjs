const q = process.argv[2] ?? 'obłóg dębowy';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
(async () => {
  const targets = [
    ['ddg-api', `https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1&skip_disambig=1`],
    ['ddg-ac', `https://ac.duckduckgo.com/ac/?q=${encodeURIComponent(q)}&type=list`],
    ['ddg-ab', `https://duckduckgo.com/ac/?q=${encodeURIComponent(q)}&type=list`],
    ['wikipedia-pl', `https://pl.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(q)}&limit=5&format=json`],
  ];
  for (const [name, url] of targets) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': UA } });
      const t = await r.text();
      console.log(`\n=== ${name} HTTP ${r.status} len=${t.length}`);
      console.log(t.slice(0, 900));
    } catch (e) {
      console.log(`\n=== ${name} ERR ${e.message.slice(0, 60)}`);
    }
  }
})();
