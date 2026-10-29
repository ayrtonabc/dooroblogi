/**
 * Zrzut całego viewportu (bez wycinania po selektorze).
 *
 * `shot.cjs` tnie po współrzędnych dokumentu, więc element `position: fixed`
 * (np. mobilna barra CTA) wypada poza kadr. Ten skrypt robi zwykły
 * zrzut ekranu — do oceny kompozycji mobilnej.
 *
 * Użycie:
 *   node _tools/shot-viewport.cjs <ruta> <salida.png> [szerokość] [wysokość] [scrollY]
 */
const { spawn } = require('node:child_process');
const os = require('node:os');
const path = require('node:path');
const fs = require('node:fs');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9225;
const BASE = 'http://127.0.0.1:4330';

const [
  route = '/',
  out = 'viewport.png',
  width = '390',
  height = '844',
  scrollY = '0',
] = process.argv.slice(2);

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-viewport-'));
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
      {
        width: Number(width),
        height: Number(height),
        deviceScaleFactor: 2,
        mobile: Number(width) < 768,
      },
      sessionId,
    );
    await send('Page.navigate', { url: BASE + route }, sessionId);
    await sleep(2200);
    if (Number(scrollY) > 0) {
      await send(
        'Runtime.evaluate',
        { expression: `window.scrollTo(0, ${Number(scrollY)})` },
        sessionId,
      );
      await sleep(700);
    }

    const shot = await send('Page.captureScreenshot', { format: 'png' }, sessionId);
    fs.writeFileSync(out, Buffer.from(shot.data, 'base64'));
    console.log(`capturado ${out}  ${width}x${height} css px  (${route})`);
  } finally {
    chrome.kill();
    try {
      fs.rmSync(profile, { recursive: true, force: true });
    } catch {
      /* tymczasowe */
    }
  }
})();
