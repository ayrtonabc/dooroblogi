/**
 * Contraste real del formulario: mide el color del texto de la etiqueta contra
 * el fondo REAL pintado (sube por el árbol hasta el primer fondo opaco), sin
 * suponer que el formulario vive dentro de una `.card`.
 *
 * Uso: node _tools/check-form-contrast.cjs
 */
const { spawn } = require('node:child_process');
const os = require('node:os');
const path = require('node:path');
const fs = require('node:fs');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = 'http://127.0.0.1:4330';
const PORT = 9225;

const PAGES = [
  '/produkty/oblog-debowy-ciety/',
  '/dla-firm/',
  '/en/products/oak-trim-battens/',
  '/de/fuer-handwerk/',
  '/cennik/',
  '/kontakt/',
];

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-fc-'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getWsUrl() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      const j = await res.json();
      if (j.webSocketDebuggerUrl) return j.webSocketDebuggerUrl;
    } catch {
      /* aún no */
    }
    await sleep(250);
  }
  throw new Error('Chrome no arrancó');
}

let nextId = 1;

(async () => {
  const chrome = spawn(
    CHROME,
    [
      '--headless=new',
      `--remote-debugging-port=${PORT}`,
      `--user-data-dir=${profile}`,
      '--no-first-run',
      '--disable-gpu',
      'about:blank',
    ],
    { stdio: 'ignore' },
  );

  let failures = 0;
  try {
    const ws = new WebSocket(await getWsUrl());
    await new Promise((r) => ws.addEventListener('open', r, { once: true }));
    const pending = new Map();
    ws.addEventListener('message', (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id && pending.has(m.id)) {
        const { resolve, reject } = pending.get(m.id);
        pending.delete(m.id);
        m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result);
      }
    });
    const send = (method, params = {}, sessionId) => {
      const id = nextId++;
      ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
        setTimeout(() => pending.has(id) && (pending.delete(id), reject(new Error('timeout ' + method))), 30000);
      });
    };

    const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
    await send('Page.enable', {}, sessionId);
    await send('Runtime.enable', {}, sessionId);
    await send(
      'Emulation.setDeviceMetricsOverride',
      { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false },
      sessionId,
    );

    for (const url of PAGES) {
      await send('Page.navigate', { url: BASE + url }, sessionId);
      await sleep(1500);

      const res = await send(
        'Runtime.evaluate',
        {
          expression: `(() => {
            const out = { labels: [], h2: null, card: null };
            const label = document.querySelector('.field__label');
            if (!label) return { error: 'sin formulario' };

            const paintedBg = (el) => {
              let n = el;
              while (n && n !== document.documentElement) {
                const c = getComputedStyle(n).backgroundColor;
                const m = c.match(/rgba?\\(([^)]+)\\)/);
                if (m) {
                  const p = m[1].split(',').map(v => parseFloat(v));
                  if (p.length < 4 || p[3] > 0.05) return c;
                }
                n = n.parentElement;
              }
              return getComputedStyle(document.body).backgroundColor;
            };

            const cs = getComputedStyle(label);
            out.labels.push({ color: cs.color, bg: paintedBg(label), size: cs.fontSize });

            const h2 = document.querySelector('.section--dark h2');
            if (h2) {
              const c2 = getComputedStyle(h2);
              out.h2 = { color: c2.color, bg: paintedBg(h2), size: c2.fontSize };
            }
            const card = document.querySelector('.section--dark .card');
            out.card = card ? 'card' : 'sin card (formulario sobre la seccion)';
            return out;
          })()`,
          returnByValue: true,
        },
        sessionId,
      );

      const m = res.result.value;
      if (m.error) {
        console.log(`AVISO ${url}: ${m.error}`);
        continue;
      }

      const srgb = (rgb) => {
        const p = rgb.match(/[\d.]+/g).map(Number);
        const f = (c) => {
          const v = c / 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * f(p[0]) + 0.7152 * f(p[1]) + 0.0722 * f(p[2]);
      };
      const ratio = (a, b) => {
        const [l1, l2] = [srgb(a), srgb(b)].sort((x, y) => y - x);
        return (l1 + 0.05) / (l2 + 0.05);
      };

      const parts = [];
      let bad = false;
      for (const [name, e] of [
        ['label', m.labels[0]],
        ['h2', m.h2],
      ]) {
        if (!e) continue;
        const r = ratio(e.color, e.bg);
        const grande = parseFloat(e.size) >= 24 || (parseFloat(e.size) >= 18.66 && /bold|[6-9]00/.test(''));
        const min = grande ? 3 : 4.5;
        const ok = r >= min;
        if (!ok) bad = true;
        parts.push(`${name}=${r.toFixed(2)}:1${ok ? '' : ' FALLA(min ' + min + ')'}`);
      }

      if (bad) failures++;
      console.log(`${bad ? 'FALLA' : 'OK   '} ${url.padEnd(34)} ${parts.join('  ')}  [${m.card}]`);
    }
  } finally {
    chrome.kill();
    try {
      fs.rmSync(profile, { recursive: true, force: true });
    } catch {
      /* temporal */
    }
  }

  console.log(`\n${failures === 0 ? 'TODO OK' : failures + ' FALLOS'}`);
  process.exit(failures ? 1 : 0);
})();
