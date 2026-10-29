/**
 * Autocompletado de DuckDuckGo (endpoint `ac.duckduckgo.com/ac/`), que usa un
 * índice distinto del de Google. Sirve para contrastar: si Google y DuckDuckGo
 * coinciden en lo que la gente escribe, la señal es más fuerte.
 *
 * Uso: node _tools/ddg-ac.mjs "semilla" ["otra" ...]
 */
const seeds = process.argv.slice(2);
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  for (const seed of seeds) {
    const url = `https://ac.duckduckgo.com/ac/?q=${encodeURIComponent(seed)}&type=list`;
    try {
      const r = await fetch(url, { headers: { 'user-agent': UA } });
      const json = JSON.parse(await r.text());
      const list = json[1] ?? [];
      console.log(`\n### "${seed}" — ${list.length}`);
      list.forEach((s, i) => console.log(`${String(i + 1).padStart(2)}. ${s}`));
    } catch (err) {
      console.log(`\n### "${seed}" ERROR ${err.message}`);
    }
    await sleep(400);
  }
})();
