/**
 * Captura de una zona concreta de la página (Chrome headless + CDP).
 * El scroll del navegador embebido no siempre responde, así que para
 * revisar secciones concretas se recorta la imagen por coordenadas.
 *
 * Uso: node _tools/shot.cjs <ruta> <selector> <salida.png> [ancho] [alto]
 */
const { spawn } = require('node:child_process');
const os = require('node:os');
const path = require('node:path');
const fs = require('node:fs');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9223;
const BASE = 'http://127.0.0.1:4330';

const [route = '/', selector = 'body', out = 'shot.png', width = '1280', height = '900'] = process.argv.slice(2);

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-shot-'));
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
      { width: Number(width), height: Number(height), deviceScaleFactor: 2, mobile: false },
      sessionId,
    );
    await send('Page.navigate', { url: BASE + route }, sessionId);
    await sleep(2200);

    // Primero el scroll, luego la medida: con `scroll-behavior: smooth` el
    // rectángulo medido en el mismo tick todavía era el de antes del
    // desplazamiento y el recorte salía desplazado.
    await send(
      'Runtime.evaluate',
      {
        expression: `(() => {
          const el = document.querySelector(${JSON.stringify(selector)});
          if (!el) return false;
          el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'instant' });
          return true;
        })()`,
        returnByValue: true,
      },
      sessionId,
    );
    await sleep(900);

    const box = await send(
      'Runtime.evaluate',
      {
        expression: `(() => {
          const el = document.querySelector(${JSON.stringify(selector)});
          if (!el) return null;
          const r = el.getBoundingClientRect();
          const pad = 12;
          // El recorte de Page.captureScreenshot va en coordenadas de
          // DOCUMENTO, no de ventana: con la página scrolleada, usar el
          // rectángulo del viewport recortaba la cabecera en lugar del
          // elemento pedido.
          return {
            x: r.left + window.scrollX - pad,
            y: r.top + window.scrollY - pad,
            w: r.width + pad * 2,
            h: r.height + pad * 2,
          };
        })()`,
        returnByValue: true,
      },
      sessionId,
    );

    const b = box.result.value;
    if (!b) throw new Error('selector no encontrado: ' + selector);

    await sleep(700);

    const shot = await send(
      'Page.captureScreenshot',
      {
        format: 'png',
        captureBeyondViewport: true,
        clip: {
          x: Math.max(0, b.x),
          y: Math.max(0, b.y),
          width: b.w,
          height: b.h,
          scale: 1,
        },
      },
      sessionId,
    );

    fs.writeFileSync(out, Buffer.from(shot.data, 'base64'));
    console.log(`capturado ${out}  ${Math.round(b.w)}x${Math.round(b.h)} css px  (${route} · ${selector})`);
  } finally {
    chrome.kill();
    try {
      fs.rmSync(profile, { recursive: true, force: true });
    } catch {
      /* temporal */
    }
  }
})();
