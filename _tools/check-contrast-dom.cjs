/**
 * Contraste EFECTIVO en el navegador real (Chrome headless + CDP).
 *
 * Por qué existe: `_tools/check-contrast.cjs` compara **tokens** de color
 * (--ink sobre --oak, etc.). Eso no ve la `opacity` del texto. Un bloque con
 * `opacity: 0.85` sobre `--oak` pasa el chequeo de tokens y en pantalla baja
 * de 4,5:1 a 3,81:1 — por debajo de AA. Este script mide lo que se ve:
 * color real, opacidad acumulada de la cadena de ancestros y fondo real
 * (con composición alfa), y aplica el umbral correcto según tamaño y peso.
 *
 * No sustituye al chequeo de tokens: lo complementa. El texto que queda
 * ENCIMA de una foto se salta (no hay un color de fondo con el que comparar).
 *
 * Uso:
 *   node _tools/check-contrast-dom.cjs                    # rutas clave
 *   node _tools/check-contrast-dom.cjs /kontakt/ /en/contact/
 *   node _tools/check-contrast-dom.cjs --all              # todas las rutas de dist/
 */
const { spawn } = require('node:child_process');
const os = require('node:os');
const path = require('node:path');
const fs = require('node:fs');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9228;
const BASE = 'http://127.0.0.1:4330';
const DIST = path.resolve(__dirname, '..', 'dist');

/** Rutas por defecto: las que tienen bloques propios de alto contraste. */
const DEFAULT_ROUTES = [
  '/',
  '/kontakt/',
  '/en/contact/',
  '/de/kontakt/',
  '/dla-firm/',
  '/cennik/',
  '/produkty/oblog-debowy-ciety/',
  '/produkty/panele-sufitowe-i-scienne/',
];

const args = process.argv.slice(2);
const all = args.includes('--all');

/** Rutas de `dist/` con su `index.html`, en orden. */
function rutasDist(dir, prefijo = '') {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const sub = path.join(dir, entry.name);
    if (fs.existsSync(path.join(sub, 'index.html'))) out.push(prefijo + '/' + entry.name + '/');
    out.push(...rutasDist(sub, prefijo + '/' + entry.name));
  }
  return out;
}

const rutasPedidas = args.filter((a) => !a.startsWith('--'));
const routes = all
  ? ['/', ...rutasDist(DIST)]
  : rutasPedidas.length
    ? rutasPedidas
    : DEFAULT_ROUTES;

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-contrast-'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getWsUrl() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      const json = await res.json();
      if (json.webSocketDebuggerUrl) return json.webSocketDebuggerUrl;
    } catch {
      /* aún no */
    }
    await sleep(250);
  }
  throw new Error('Chrome no arrancó');
}

let nextId = 1;

/**
 * Se ejecuta dentro de la página: mide el contraste de todo el texto visible.
 *
 * OJO con el parser de color: hay que cubrir CUATRO formatos, porque Chrome
 * devuelve el color calculado tal cual —
 *   `rgb(106, 93, 80)` · `rgba(0, 0, 0, 0.88)` · `rgb(0 0 0 / 88%)` ·
 *   `color(srgb 0.98 0.97 0.94 / 0.88)`  ← la cabecera usa este último.
 * Leer los números a pelo convertía ese 0.98 en un casi negro y daba
 * contrastes de 1,08:1 sobre una superficie clarísima.
 */
const MEASURE = `(() => {
  const parse = (c) => {
    if (!c) return null;
    const s = String(c).trim();
    if (s === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };

    const num = (v) => {
      if (v === undefined) return undefined;
      const t = String(v).trim();
      if (t.endsWith('%')) return (parseFloat(t) / 100) * 255;
      return parseFloat(t);
    };
    const alfa = (v) => {
      if (v === undefined) return 1;
      const t = String(v).trim();
      return t.endsWith('%') ? parseFloat(t) / 100 : parseFloat(t);
    };

    let m = s.match(/^color\\(\\s*srgb(?:-linear)?\\s+([^)]*)\\)/i);
    if (m) {
      const partes = m[1].split('/');
      const nums = partes[0].trim().split(/\\s+/).map(parseFloat);
      return {
        r: nums[0] * 255,
        g: nums[1] * 255,
        b: nums[2] * 255,
        a: alfa(partes[1]),
      };
    }

    m = s.match(/^rgba?\\(([^)]*)\\)/i);
    if (m) {
      const partes = m[1].split('/');
      const nums = partes[0].trim().split(/[\\s,]+/).filter(Boolean);
      return {
        r: num(nums[0]),
        g: num(nums[1]),
        b: num(nums[2]),
        a: alfa(partes[1] !== undefined ? partes[1] : nums[3]),
      };
    }
    return null;
  };

  const over = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  });
  const lum = (c) => {
    const f = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  const ratio = (a, b) => {
    const l1 = lum(a), l2 = lum(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };
  const bgOf = (el) => {
    let node = el;
    while (node && node !== document.documentElement) {
      const cs = getComputedStyle(node);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return null; // foto de fondo
      const bg = parse(cs.backgroundColor);
      if (bg && bg.a > 0) {
        const parent = bgOf(node.parentElement);
        return bg.a >= 1 ? bg : over(bg, parent || { r: 255, g: 255, b: 255, a: 1 });
      }
      node = node.parentElement;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };

  // Las fotos del sitio son <img>, no background-image: el texto que queda
  // encima no tiene un color de fondo con el que compararlo.
  const fotos = [...document.querySelectorAll('img')].map((img) => img.getBoundingClientRect());
  const sobreFoto = (rect) =>
    fotos.some(
      (f) =>
        f.left < rect.right && f.right > rect.left && f.top < rect.bottom && f.bottom > rect.top,
    );

  const fallos = [];
  let medidos = 0;
  let sobreFotoCount = 0;

  for (const el of document.querySelectorAll('body *')) {
    const texto = [...el.childNodes]
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent.trim())
      .join(' ')
      .trim();
    if (!texto) continue;

    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    const rect = el.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) continue;
    if (parseFloat(cs.opacity) === 0) continue;

    const bg = bgOf(el);
    if (!bg || sobreFoto(rect)) {
      sobreFotoCount++;
      continue; // sobre foto: no hay color de fondo con el que comparar
    }

    let fg = parse(cs.color);
    if (!fg) continue;
    let op = 1;
    let node = el;
    while (node && node !== document.documentElement) {
      op *= parseFloat(getComputedStyle(node).opacity);
      node = node.parentElement;
    }
    const fgEff = op < 1 ? over({ ...fg, a: fg.a * op }, bg) : fg;

    const size = parseFloat(cs.fontSize);
    const weight = parseInt(cs.fontWeight, 10) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const min = large ? 3 : 4.5;
    const r = ratio(fgEff, bg);
    medidos++;

    if (r < min) {
      fallos.push({
        sel:
          el.tagName.toLowerCase() +
          '.' +
          (el.className || '').toString().trim().split(/\\s+/).slice(0, 2).join('.'),
        texto: texto.slice(0, 42),
        ratio: Math.round(r * 100) / 100,
        min,
        size: Math.round(size),
        weight,
        op: Math.round(op * 100) / 100,
      });
    }
  }
  return { medidos, sobreFoto: sobreFotoCount, fallos: fallos.slice(0, 25), total: fallos.length };
})()`;

(async () => {
  const chrome = spawn(
    CHROME,
    [
      '--headless=new',
      `--remote-debugging-port=${PORT}`,
      `--user-data-dir=${profile}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-gpu',
      '--hide-scrollbars',
      'about:blank',
    ],
    { stdio: 'ignore' },
  );

  try {
    const ws = new WebSocket(await getWsUrl());
    await new Promise((r) => ws.addEventListener('open', r, { once: true }));

    const pending = new Map();
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
      }
    });
    const send = (method, params = {}, sessionId) => {
      const id = nextId++;
      ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
        setTimeout(
          () => pending.has(id) && (pending.delete(id), reject(new Error('timeout ' + method))),
          30000,
        );
      });
    };

    const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
    await send('Page.enable', {}, sessionId);
    await send('Runtime.enable', {}, sessionId);
    await send(
      'Emulation.setDeviceMetricsOverride',
      { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false },
      sessionId,
    );

    let problemas = 0;

    for (const route of routes) {
      await send('Page.navigate', { url: BASE + route }, sessionId);
      await sleep(1800);
      const res = await send(
        'Runtime.evaluate',
        { expression: MEASURE, returnByValue: true },
        sessionId,
      );
      if (res.exceptionDetails) {
        console.log(`✗ ${route} — no se pudo medir:`, res.exceptionDetails.text);
        problemas++;
        continue;
      }
      const { medidos, sobreFoto, fallos, total } = res.result.value;
      if (!total) {
        console.log(
          `✓ ${route}  ${medidos} textos medidos (${sobreFoto} sobre foto, sin medir), 0 por debajo de AA`,
        );
      } else {
        problemas += total;
        console.log(`✗ ${route}  ${medidos} textos medidos, ${total} por debajo de AA:`);
        for (const f of fallos) {
          console.log(
            `   ${f.ratio}:1 (mín ${f.min})  ${f.size}px/${f.weight} op=${f.op}  ${f.sel}  «${f.texto}»`,
          );
        }
        if (total > fallos.length) console.log(`   … y ${total - fallos.length} más`);
      }
    }

    console.log(
      `\n${problemas === 0 ? 'TODO OK' : problemas + ' TEXTOS POR DEBAJO DE AA'}  (${routes.length} rutas)`,
    );
    process.exit(problemas ? 1 : 0);
  } finally {
    chrome.kill();
    try {
      fs.rmSync(profile, { recursive: true, force: true });
    } catch {
      /* temporal */
    }
  }
})();
