/**
 * Kontrast zmierzony na RENDEROWANYM DOM, nie na tokenach.
 *
 * Dla każdego selektora bierze:
 *   • kolor tekstu (computed color),
 *   • tło REALNE — idzie w górę drzewa, aż znajdzie kolor nieprzezroczysty
 *     (bo `.section--dark .card` ma tło własne, a `.section--sand` też),
 *   • rozmiar i wagę fontu, żeby dobrać próg AA (3:1 dla tekstu dużego,
 *     4,5:1 dla normalnego).
 *
 * Użycie:
 *   node _tools/measure-contrast.cjs <ruta> [szerokość] [wysokość]
 *
 * Przykład:
 *   node _tools/measure-contrast.cjs /404.html 1280 900
 */
const { spawn } = require('node:child_process');
const os = require('node:os');
const path = require('node:path');
const fs = require('node:fs');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9224;
const BASE = 'http://127.0.0.1:4330';

const route = process.argv[2] || '/';
const width = Number(process.argv[3] || 1280);
const height = Number(process.argv[4] || 900);

/** Elementy sprawdzane — nowe bloki embudo + formularz. */
const SELECTORS = [
  '.how-it-works__step-title',
  '.how-it-works__step-text',
  '.how-it-works__num',
  '.trust-bar__title',
  '.trust-bar__text',
  '.trust-bar__icon',
  '.objections__question',
  '.objections__answer',
  '.section-cta__title',
  '.section-cta__lead',
  '.section-cta__microcopy',
  '.cta-band__title',
  '.cta-band__text',
  '.cta-band__microcopy',
  '.proof-figure__caption',
  '.proof-figure__caption-title',
  '.sticky-cta__label',
  '.sticky-cta__item--primary .sticky-cta__label',
  '.form__microcopy',
  '.form__microcopy-lead',
  '.form__more-summary',
  '.form__more-intro',
  '.form__noscript-hint',
  '.field__label',
  '.field__control',
  '.btn',
  '.btn--ghost',
  // Warianty CTA na powierzchni ciemnej.
  '.section-cta--dark .section-cta__title',
  '.section-cta--dark .section-cta__lead',
  '.section-cta--dark .section-cta__microcopy',
  '.section-cta--dark .btn',
  '.section-cta--dark .btn--ghost',
  '.cta-band--dark .cta-band__title',
  '.cta-band--dark .cta-band__text',
  '.cta-band--dark .cta-band__microcopy',
  '.cta-band--dark .btn',
  '.cta-band--dark .btn--ghost',
  '.cta-band--cream .btn--ghost',
  '.cta-band--sand .btn--ghost',
];

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-contrast-'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getWsUrl() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      const json = await res.json();
      if (json.webSocketDebuggerUrl) return json.webSocketDebuggerUrl;
    } catch {
      /* jeszcze nie */
    }
    await sleep(250);
  }
  throw new Error('Chrome nie wystartował');
}

let nextId = 1;

(async () => {
  const chrome = spawn(CHROME, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    '--no-first-run',
    '--disable-gpu',
    '--hide-scrollbars',
    'about:blank',
  ], { stdio: 'ignore' });

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
        setTimeout(() => pending.has(id) && (pending.delete(id), reject(new Error('timeout ' + method))), 30000);
      });
    };

    const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
    await send('Page.enable', {}, sessionId);
    await send('Runtime.enable', {}, sessionId);
    await send(
      'Emulation.setDeviceMetricsOverride',
      { width, height, deviceScaleFactor: 1, mobile: width < 768 },
      sessionId,
    );
    await send('Page.navigate', { url: BASE + route }, sessionId);
    await sleep(2500);

    const selectors = JSON.stringify(SELECTORS);
    const result = await send(
      'Runtime.evaluate',
      {
        expression: `(() => {
          function parse(color) {
            const m = color.match(/rgba?\\(([^)]+)\\)/);
            if (!m) return null;
            const parts = m[1].split(/[,\\s\\/]+/).filter(Boolean).map(Number);
            return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
          }
          function over(fg, bg) {
            const a = fg.a;
            return {
              r: fg.r * a + bg.r * (1 - a),
              g: fg.g * a + bg.g * (1 - a),
              b: fg.b * a + bg.b * (1 - a),
              a: 1,
            };
          }
          function lum(c) {
            const ch = [c.r, c.g, c.b].map((v) => {
              const x = v / 255;
              return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
          }
          function ratio(fg, bg) {
            const a = lum(fg), b = lum(bg);
            const hi = Math.max(a, b), lo = Math.min(a, b);
            return (hi + 0.05) / (lo + 0.05);
          }
          function realBackground(el) {
            let node = el;
            let acc = null;
            while (node && node !== document.documentElement.parentNode) {
              const c = parse(getComputedStyle(node).backgroundColor);
              if (c && c.a > 0) {
                acc = acc ? over(acc, c) : c;
                if (acc.a >= 1) return acc;
              }
              node = node.parentElement;
            }
            return acc || { r: 255, g: 255, b: 255, a: 1 };
          }
          const out = [];
          for (const sel of ${selectors}) {
            const el = document.querySelector(sel);
            if (!el) { out.push({ sel, missing: true }); continue; }
            const cs = getComputedStyle(el);
            const fg = parse(cs.color);
            const bg = realBackground(el);
            const size = parseFloat(cs.fontSize);
            const weight = parseInt(cs.fontWeight, 10) || 400;
            const large = size >= 24 || (size >= 18.66 && weight >= 700);
            out.push({
              sel,
              fg: 'rgb(' + Math.round(fg.r) + ',' + Math.round(fg.g) + ',' + Math.round(fg.b) + ')',
              bg: 'rgb(' + Math.round(bg.r) + ',' + Math.round(bg.g) + ',' + Math.round(bg.b) + ')',
              size: Math.round(size * 10) / 10,
              weight,
              min: large ? 3 : 4.5,
              ratio: Math.round(ratio(fg, bg) * 100) / 100,
            });
          }
          // Barra flotante: wysokość i zarezerwowane miejsce pod treścią.
          const bar = document.querySelector('.sticky-cta');
          const barBox = bar ? bar.getBoundingClientRect() : null;
          const bodyPad = getComputedStyle(document.body).paddingBottom;
          const last = document.body.lastElementChild;
          out.push({
            sel: '[sticky-cta] wysokość / padding-body',
            fg: bar ? 'display:' + getComputedStyle(bar).display : 'brak',
            bg: 'padding-bottom body: ' + bodyPad,
            size: barBox ? Math.round(barBox.height * 10) / 10 : 0,
            weight: 0,
            min: 0,
            ratio: 0,
          });
          out.push({
            sel: '[sticky-cta] aria-hidden',
            fg: bar ? bar.getAttribute('aria-hidden') : 'brak',
            bg: 'ostatni element body: ' + (last ? last.tagName + '.' + last.className : '-'),
            size: 0,
            weight: 0,
            min: 0,
            ratio: 0,
          });
          // Czy position:fixed działa? Szukamy przodka, który tworzy
          // kontekst pozycjonowania (transform / filter / contain).
          if (bar) {
            const bcs = getComputedStyle(bar);
            const br = bar.getBoundingClientRect();
            out.push({
              sel: '[sticky-cta] pozycja w viewport',
              fg: 'position:' + bcs.position + ' top:' + Math.round(br.top),
              bg: 'viewport h:' + window.innerHeight + ' bottom:' + Math.round(br.bottom),
              size: 0, weight: 0, min: 0, ratio: 0,
            });
            let node = bar.parentElement, culprit = '-';
            while (node) {
              const ncs = getComputedStyle(node);
              if (ncs.transform !== 'none' || ncs.filter !== 'none' ||
                  ncs.perspective !== 'none' || ncs.contain !== 'none' ||
                  ncs.willChange !== 'auto' || ncs.backdropFilter !== 'none') {
                culprit = node.tagName + '.' + node.className +
                  ' [transform=' + ncs.transform + ' filter=' + ncs.filter +
                  ' contain=' + ncs.contain + ' willChange=' + ncs.willChange + ']';
                break;
              }
              node = node.parentElement;
            }
            out.push({
              sel: '[sticky-cta] przodek tworzący kontekst',
              fg: culprit,
              bg: 'fixed działa tylko bez takiego przodka',
              size: 0, weight: 0, min: 0, ratio: 0,
            });
          }
          return out;
        })()`,
        returnByValue: true,
      },
      sessionId,
    );

    const rows = result.result.value || [];
    console.log(`\nKontrast zmierzony na ${BASE + route} (${width}x${height})\n`);
    const pad = (v, n) => String(v).padEnd(n);
    console.log(pad('selektor', 42) + pad('tekst', 22) + pad('tło', 22) + 'ratio  min');
    console.log('-'.repeat(100));
    let fails = 0;
    for (const row of rows) {
      if (row.missing) {
        console.log(pad(row.sel, 42) + 'BRAK ELEMENTU');
        continue;
      }
      const ok = row.ratio >= row.min;
      if (!ok) fails++;
      console.log(
        (ok ? ' ✓ ' : ' ✗ ') +
          pad(row.sel, 40) +
          pad(row.fg, 22) +
          pad(row.bg, 22) +
          `${row.ratio.toFixed(2).padStart(5)}:1  ${row.min}  (${row.size}px/${row.weight})`,
      );
    }
    console.log(fails ? `\nPROBLEMY: ${fails}` : '\nWszystkie zmierzone pary przechodzą AA.');
    process.exitCode = fails ? 1 : 0;
  } finally {
    chrome.kill();
    try {
      fs.rmSync(profile, { recursive: true, force: true });
    } catch {
      /* tymczasowe */
    }
  }
})();
