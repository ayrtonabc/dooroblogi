/**
 * Comprobación de la deriva infinita del hero (Chrome headless + CDP).
 *
 * La deriva del hero es una pista con TRES copias de la foto (la original, su
 * reflejo y la original otra vez) que se desplaza dos anchuras de pantalla.
 * Eso tiene que cumplir tres cosas, y las tres se rompen fácil al tocar el
 * CSS:
 *
 *  1. El reinicio del bucle es invisible: al terminar el recorrido, la
 *     tercera copia ocupa exactamente el sitio de la primera.
 *  2. La ventana nunca queda al descubierto: en mitad del camino la tapan
 *     dos copias (la cola de una y la cabeza de la siguiente), y no puede
 *     quedar un hueco entre ellas.
 *  3. Con `prefers-reduced-motion: reduce` no hay deriva ni respiración: el
 *     hero se queda quieto.
 *
 * Uso: node _tools/verify-hero.cjs
 */
const { spawn } = require('node:child_process');
const os = require('node:os');
const path = require('node:path');
const fs = require('node:fs');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = 'http://127.0.0.1:4330';
const PORT = 9226;

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-hero-'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

  let failures = 0;
  const ok = (cond, label, detail) => {
    if (!cond) failures++;
    console.log(`${cond ? 'OK  ' : 'FALLA'} ${label}${detail ? '  ' + detail : ''}`);
  };

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
        setTimeout(() => {
          if (pending.has(id)) {
            pending.delete(id);
            reject(new Error(`timeout: ${method}`));
          }
        }, 30000);
      });
    };
    const evaluate = async (sessionId, expression) => {
      const res = await send('Runtime.evaluate', { expression, returnByValue: true }, sessionId);
      if (res.exceptionDetails) throw new Error(res.exceptionDetails.text);
      return res.result.value;
    };

    const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
    await send('Page.enable', {}, sessionId);
    await send('Runtime.enable', {}, sessionId);
    await send(
      'Emulation.setDeviceMetricsOverride',
      { width: 1440, height: 820, deviceScaleFactor: 1, mobile: false },
      sessionId,
    );
    await send('Page.navigate', { url: BASE + '/' }, sessionId);
    await sleep(2500);

    // ---------- 1. Cierre del bucle ----------
    const medidas = await evaluate(
      sessionId,
      `(() => {
        const track = document.querySelector('.hero__track');
        const hero = document.querySelector('.hero');
        const copies = [...document.querySelectorAll('.hero__copy')];
        const w = hero.getBoundingClientRect().width;
        track.style.animation = 'none';
        const leer = (offset, indice) => {
          track.style.transform = 'translate3d(' + offset + 'px, 0, 0)';
          const img = copies[indice].querySelector('img');
          const r = img.getBoundingClientRect();
          return { izquierda: Math.round(r.left), derecha: Math.round(r.right), src: img.src };
        };
        // Al empezar se ve la primera copia; al terminar el recorrido, la
        // tercera ocupa exactamente ese sitio.
        const inicio = leer(0, 0);
        const final = leer(-2 * w, 2);
        return { w: Math.round(w), copias: copies.length, inicio, final };
      })()`,
    );

    ok(medidas.copias === 3, 'la pista lleva tres copias', `copias=${medidas.copias}`);
    ok(
      medidas.inicio.izquierda === medidas.final.izquierda &&
        medidas.inicio.derecha === medidas.final.derecha &&
        medidas.inicio.src === medidas.final.src,
      'el reinicio del bucle devuelve la misma imagen',
      `inicio x=${medidas.inicio.izquierda}..${medidas.inicio.derecha} · final x=${medidas.final.izquierda}..${medidas.final.derecha}`,
    );

    // ---------- 2. La ventana nunca queda al descubierto ----------
    const huecos = await evaluate(
      sessionId,
      `(() => {
        const track = document.querySelector('.hero__track');
        const hero = document.querySelector('.hero');
        const w = hero.getBoundingClientRect().width;
        track.style.animation = 'none';
        const malos = [];
        for (let i = 0; i <= 20; i++) {
          const offset = -(2 * w * i) / 20;
          track.style.transform = 'translate3d(' + offset + 'px, 0, 0)';
          const rects = Array.from(document.querySelectorAll('.hero__copy img'))
            .map((img) => img.getBoundingClientRect())
            .sort((a, b) => a.left - b.left);
          let cursor = 0;
          let hueco = false;
          for (const r of rects) {
            if (r.left > cursor + 1) { hueco = true; break; }
            if (r.right > cursor) cursor = r.right;
          }
          if (hueco || cursor < w - 1) malos.push(Math.round(offset));
        }
        return malos;
      })()`,
    );
    ok(
      huecos.length === 0,
      'la ventana nunca queda al descubierto',
      huecos.length ? `huecos en ${huecos}` : '21 posiciones comprobadas',
    );

    // ---------- 3. Movimiento reducido ----------
    await send(
      'Emulation.setEmulatedMedia',
      { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] },
      sessionId,
    );
    await send('Page.navigate', { url: BASE + '/' }, sessionId);
    await sleep(2200);

    const reducido = await evaluate(
      sessionId,
      `(() => {
        const track = document.querySelector('.hero__track');
        const img = document.querySelector('.hero__copy img');
        return {
          animacion: getComputedStyle(track).animationName,
          imgAnimacion: getComputedStyle(img).animationName,
        };
      })()`,
    );
    ok(
      reducido.animacion === 'none' && reducido.imgAnimacion === 'none',
      'con prefers-reduced-motion no hay deriva ni respiración',
      `pista=${reducido.animacion} foto=${reducido.imgAnimacion}`,
    );
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
