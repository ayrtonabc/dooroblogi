/**
 * Verificación de los dos P0 del auditor, en navegador real (Chrome headless + CDP):
 *  1. El menú móvil abre (antes: SyntaxError en cada página).
 *  2. Las etiquetas del formulario dentro de una tarjeta clara en sección
 *     oscura se leen (antes: 1,07:1).
 *
 * Uso: node _tools/verify-p0.cjs
 */
const { spawn } = require('node:child_process');
const os = require('node:os');
const path = require('node:path');
const fs = require('node:fs');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = 'http://127.0.0.1:4330';
const PORT = 9222;

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-p0-'));

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getWsUrl() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      const json = await res.json();
      if (json.webSocketDebuggerUrl) return json.webSocketDebuggerUrl;
    } catch {
      /* aún no está listo */
    }
    await sleep(250);
  }
  throw new Error('Chrome no arrancó');
}

let nextId = 1;

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.pending = new Map();
    this.events = [];
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
      } else if (msg.method) {
        this.events.push(msg);
      }
    });
  }

  send(method, params = {}, sessionId) {
    const id = nextId++;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    this.ws.send(JSON.stringify(payload));
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`timeout: ${method}`));
        }
      }, 30000);
    });
  }
}

async function evaluate(cdp, sessionId, expression) {
  const res = await cdp.send(
    'Runtime.evaluate',
    { expression, returnByValue: true, awaitPromise: true },
    sessionId,
  );
  if (res.exceptionDetails) {
    throw new Error(res.exceptionDetails.text + ' ' + JSON.stringify(res.exceptionDetails.exception || {}));
  }
  return res.result.value;
}

(async () => {
  const chrome = spawn(CHROME, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--hide-scrollbars',
    'about:blank',
  ], { stdio: 'ignore' });

  let failures = 0;
  try {
    const wsUrl = await getWsUrl();
    const ws = new WebSocket(wsUrl);
    await new Promise((r) => ws.addEventListener('open', r, { once: true }));
    const cdp = new Cdp(ws);

    const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
    await cdp.send('Runtime.enable', {}, sessionId);
    await cdp.send('Log.enable', {}, sessionId);
    await cdp.send('Page.enable', {}, sessionId);

    // ---------- 1. Menú móvil ----------
    await cdp.send(
      'Emulation.setDeviceMetricsOverride',
      { width: 390, height: 844, deviceScaleFactor: 2, mobile: true },
      sessionId,
    );

    for (const url of ['/', '/cennik/', '/produkty/oblog-debowy-ciety/', '/en/']) {
      cdp.events.length = 0;
      await cdp.send('Page.navigate', { url: BASE + url }, sessionId);

      // Espera activa a que exista el botón de menú.
      let found = false;
      for (let i = 0; i < 40; i++) {
        await sleep(150);
        found = await evaluate(cdp, sessionId, `!!document.querySelector('[data-nav-toggle]')`);
        if (found) break;
      }
      await sleep(500);

      const errs = cdp.events
        .filter((e) => e.method === 'Runtime.exceptionThrown' || (e.method === 'Log.entryAdded' && e.params.entry.level === 'error'))
        .map((e) => JSON.stringify(e.params).slice(0, 200));

      const before = await evaluate(
        cdp,
        sessionId,
        `(() => {
          const t = document.querySelector('[data-nav-toggle]');
          const p = document.querySelector('[data-mobile-nav]');
          return {
            tieneToggle: !!t,
            visible: t ? getComputedStyle(t).display !== 'none' : false,
            expandedAntes: t ? t.getAttribute('aria-expanded') : null,
            panelAntes: p ? getComputedStyle(p).display : null,
            labelAntes: t ? t.getAttribute('aria-label') : null,
          };
        })()`,
      );

      const after = found
        ? await evaluate(
            cdp,
            sessionId,
            `(() => {
          const t = document.querySelector('[data-nav-toggle]');
          const p = document.querySelector('[data-mobile-nav]');
          t.click();
          return {
            expandedDespues: t.getAttribute('aria-expanded'),
            panelDespues: getComputedStyle(p).display,
            labelDespues: t.getAttribute('aria-label'),
            textoBoton: t.querySelector('[data-nav-label]')?.textContent?.trim(),
            hiddenDespues: p.getAttribute('aria-hidden'),
          };
        })()`,
          )
        : { expandedDespues: null, panelDespues: 'n/a', labelDespues: null, textoBoton: null, hiddenDespues: null };

      const ok = after.expandedDespues === 'true' && after.panelDespues !== 'none' && after.hiddenDespues === 'false';
      if (!ok || errs.length) failures++;
      console.log(
        `${ok && !errs.length ? 'OK  ' : 'FALLA'} menu móvil ${url.padEnd(32)} toggle visible=${before.visible} expande=${after.expandedDespues} panel=${after.panelDespues} label="${after.labelDespues}" texto="${after.textoBoton}" errores=${errs.length}`,
      );
      if (errs.length) console.log('        ' + errs[0]);
    }

    // ---------- 2. Contraste del formulario en tarjeta clara sobre sección oscura ----------
    await cdp.send(
      'Emulation.setDeviceMetricsOverride',
      { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false },
      sessionId,
    );

    const srgb = (rgb) => {
      const [r, g, b] = rgb;
      const f = (c) => {
        const v = c / 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const ratio = (a, b) => {
      const [l1, l2] = [srgb(a), srgb(b)].sort((x, y) => y - x);
      return (l1 + 0.05) / (l2 + 0.05);
    };
    const parse = (c) => c.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number);

    for (const url of [
      '/produkty/oblog-debowy-ciety/',
      '/dla-firm/',
      '/en/products/oak-trim-battens/',
      '/de/fuer-handwerk/',
    ]) {
      cdp.events.length = 0;
      await cdp.send('Page.navigate', { url: BASE + url }, sessionId);
      await sleep(1400);

      const m = await evaluate(
        cdp,
        sessionId,
        `(() => {
          const card = document.querySelector('.section--dark .card');
          if (!card) return { error: 'no card' };
          const label = card.querySelector('.field__label');
          const h2 = card.querySelector('h2');
          const fallback = card.querySelector('.form__fallback');
          const bg = getComputedStyle(card).backgroundColor;
          const out = { bg, elementos: [] };
          for (const [nombre, el] of [['label', label], ['h2', h2], ['fallback', fallback]]) {
            if (!el) continue;
            const cs = getComputedStyle(el);
            out.elementos.push({ nombre, color: cs.color, bg: cs.backgroundColor, sz: cs.fontSize });
          }
          // el <strong> del teléfono
          const strong = card.querySelector('.form__fallback strong');
          if (strong) {
            const cs = getComputedStyle(strong);
            out.elementos.push({ nombre: 'strong', color: cs.color, bg: cs.backgroundColor, sz: cs.fontSize });
          }
          return out;
        })()`,
      );

      if (m.error) {
        console.log(`FALLA ${url}: ${m.error}`);
        failures++;
        continue;
      }

      const cardBg = parse(m.bg);
      const line = m.elementos
        .map((e) => {
          const r = ratio(parse(e.color), cardBg);
          return `${e.nombre}=${r.toFixed(2)}:1${r < 4.5 ? ' <-- FALLA' : ''}`;
        })
        .join('  ');
      const bad = m.elementos.some((e) => ratio(parse(e.color), cardBg) < 4.5);
      if (bad) failures++;
      console.log(`${bad ? 'FALLA' : 'OK  '} contraste ${url.padEnd(32)} fondo=${m.bg}  ${line}`);
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
