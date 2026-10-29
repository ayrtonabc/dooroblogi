/**
 * Verificación del formulario de cotización, en navegador real (Chrome headless + CDP).
 *
 * Comprueba lo que se arregló en la tanda P0 y lo que se añadió con los dos
 * embudos (A = panele en m², B = obłogi i lamele en metros):
 *  1. El producto viaja de la ficha a la página de precio: `?produkt=<id>`
 *     llega preseleccionado en el desplegable (la página es estática, así que
 *     lo lee el script en el navegador, no el build).
 *  2. Sin endpoint, el bloque de resultado NO dice "zapytanie dotarło" (verde)
 *     sino "abrimos tu cliente de correo" (ámbar) y ofrece WhatsApp y
 *     teléfono. Un lead que se pierde no puede fingir que llegó.
 *  3. El cuerpo del correo lleva el contexto de la página y el producto.
 *  4. La CTA de la ficha apunta a `/cennik/?produkt=<id>#quote-form`.
 *  5. En `/cennik/` (que no sabe o co pytają) se ve UN juego pól: el que
 *     wybrał gość. Przełączenie radia przełącza pola.
 *  6. Wymagane pola dotyczą TYLKO wybranego embudu — brakujące `surface`
 *     w embudzie B nie blokuje wysyłki. W trybie `both` (strona /cennik/)
 *     domyślnie jest B (obłogi i lamele): tak zdecydowała maszyna klienta.
 *  7. W treści wiadomości są tylko pola wybranego embudu (plus wspólne),
 *     a na końcu linia o zgodzie (RODO art. 7.1).
 *  8. Na stronie produktu jest JEDEN zestaw pól i nie ma pytania o embudo.
 *
 * Uso: node _tools/verify-form.cjs
 */
const { spawn } = require('node:child_process');
const os = require('node:os');
const path = require('node:path');
const fs = require('node:fs');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = 'http://127.0.0.1:4330';
const PORT = 9223;

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-form-'));

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
    throw new Error(
      res.exceptionDetails.text + ' ' + JSON.stringify(res.exceptionDetails.exception || {}),
    );
  }
  return res.result.value;
}

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
    const wsUrl = await getWsUrl();
    const ws = new WebSocket(wsUrl);
    await new Promise((r) => ws.addEventListener('open', r, { once: true }));
    const cdp = new Cdp(ws);

    const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
    await cdp.send('Runtime.enable', {}, sessionId);
    await cdp.send('Log.enable', {}, sessionId);
    await cdp.send('Page.enable', {}, sessionId);
    await cdp.send(
      'Emulation.setDeviceMetricsOverride',
      { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false },
      sessionId,
    );

    // ---------- 1. `?produkt=` llega preseleccionado ----------
    cdp.events.length = 0;
    await cdp.send(
      'Page.navigate',
      { url: `${BASE}/cennik/?produkt=oblog-debowy-ciety` },
      sessionId,
    );
    await sleep(1500);

    const preselect = await evaluate(
      cdp,
      sessionId,
      `(() => {
        const sel = document.querySelector('#quote-form-product');
        if (!sel) return { error: 'no select' };
        const opt = sel.selectedOptions[0];
        return {
          value: sel.value,
          texto: opt ? opt.textContent.trim() : '',
          id: opt ? opt.getAttribute('data-product-id') : null,
          opciones: sel.options.length,
        };
      })()`,
    );

    ok(
      preselect.id === 'oblog-debowy-ciety' && preselect.value.length > 0,
      '?produkt= preselecciona el producto',
      `id=${preselect.id} valor="${preselect.value}" opciones=${preselect.opciones}`,
    );

    // ---------- 2. Solo se ve UN juego de campos ----------
    const embudos = await evaluate(
      cdp,
      sessionId,
      `(() => {
        const form = document.getElementById('quote-form');
        const grupos = [...form.querySelectorAll('.form__group[data-funnel]')];
        const radio = form.querySelector('.form__choice');
        return {
          grupos: grupos.length,
          visibles: grupos.filter((g) => getComputedStyle(g).display !== 'none').map((g) => g.getAttribute('data-funnel')),
          pregunta: radio ? getComputedStyle(radio).display !== 'none' : false,
          marcado: form.querySelector('input[name$="-funnel"]:checked')?.value || null,
        };
      })()`,
    );

    ok(
      embudos.grupos === 2 && embudos.visibles.length === 1 && embudos.visibles[0] === 'B',
      'el producto del enlace (?produkt=) decide el embudo: obłóg → B',
      `visibles=${embudos.visibles.join(',')} marcados=${embudos.marcado}`,
    );
    ok(embudos.pregunta, 'el guest ve la pregunta de qué se trata');

    // ---------- 3. Cambiar de embudo cambia los campos ----------
    const cambio = await evaluate(
      cdp,
      sessionId,
      `(() => {
        const form = document.getElementById('quote-form');
        const radio = form.querySelector('#quote-form-funnel-A');
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
        const grupos = [...form.querySelectorAll('.form__group[data-funnel]')];
        return {
          visibles: grupos.filter((g) => getComputedStyle(g).display !== 'none').map((g) => g.getAttribute('data-funnel')),
          tieneLength: !!document.querySelector('#quote-form-length'),
          tieneSurface: !!document.querySelector('#quote-form-surface'),
        };
      })()`,
    );

    ok(
      cambio.visibles.length === 1 && cambio.visibles[0] === 'A',
      'al cambiar el embudo se ven los campos del otro',
      `visibles=${cambio.visibles.join(',')}`,
    );
    ok(
      cambio.tieneLength && cambio.tieneSurface,
      'los dos juegos de campos existen en el DOM (nombres distintos)',
      'length + surface',
    );

    // ---------- 3b. Sin producto, el embudo por defecto es B (obłogi) ----------
    await cdp.send('Page.navigate', { url: `${BASE}/cennik/` }, sessionId);
    await sleep(1300);

    const porDefecto = await evaluate(
      cdp,
      sessionId,
      `(() => {
        const form = document.getElementById('quote-form');
        const grupos = [...form.querySelectorAll('.form__group[data-funnel]')];
        return {
          visibles: grupos.filter((g) => getComputedStyle(g).display !== 'none').map((g) => g.getAttribute('data-funnel')),
          producto: form.querySelector('#quote-form-product')?.value || '',
          marcado: form.querySelector('input[name$="-funnel"]:checked')?.value || null,
        };
      })()`,
    );

    ok(
      porDefecto.visibles.length === 1 &&
        porDefecto.visibles[0] === porDefecto.marcado &&
        !porDefecto.producto,
      'sin producto se ve UN juego de campos: el del embudo marcado',
      `visibles=${porDefecto.visibles.join(',')} marcado=${porDefecto.marcado} producto="${porDefecto.producto}"`,
    );
    ok(
      porDefecto.marcado === 'B',
      'sin producto, el embudo por defecto es B (obłogi i lamele)',
      `marcado=${porDefecto.marcado}`,
    );

    // ---------- 4. Envío sin endpoint: resultado honesto ----------
    // Se vuelve a la URL con producto: el cuerpo del mensaje tiene que
    // llevar el producto que pidió el visitante.
    await cdp.send(
      'Page.navigate',
      { url: `${BASE}/cennik/?produkt=oblog-debowy-ciety` },
      sessionId,
    );
    await sleep(1400);

    // Todo en una sola evaluación: hay que leer el DOM ANTES de que el
    // navegador procese la navegación a `mailto:`.
    const envio = await evaluate(
      cdp,
      sessionId,
      `(async () => {
        const form = document.getElementById('quote-form');
        // El formulario está en el embudo A (por defecto): esta comprobación
        // es del B, así que se cambia explícitamente.
        const radio = form.querySelector('#quote-form-funnel-B');
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
        const set = (id, v) => {
          const el = document.querySelector('#' + id);
          if (!el) return 'falta #' + id;
          el.value = v;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          return null;
        };
        const fallos = [];
        const add = (r) => {
          if (r) fallos.push(r);
        };
        add(set('quote-form-name', 'Jan Kowalski'));
        add(set('quote-form-email', 'jan@example.com'));
        add(set('quote-form-length', '2500'));
        add(set('quote-form-section', '40 x 20 mm'));
        add(set('quote-form-quantity', '20'));
        add(set('quote-form-message', 'Proszę o wycenę 20 mb obłogu 40x20.'));
        const consent = document.querySelector('#quote-form-consent');
        consent.checked = true;

        const result = form.querySelector('[data-result]');
        const config = {
          endpoint: form.getAttribute('data-endpoint') || '',
          action: form.getAttribute('action') || '',
          enctype: form.getAttribute('enctype') || '',
          method: (form.getAttribute('method') || '').toLowerCase(),
        };

        const send = form.querySelector('[data-submit]');
        form.requestSubmit ? form.requestSubmit() : send.click();

        // Con endpoint el envío sale por fetch: hay que ESPERAR al
        // resultado. Sin endpoint el resultado se pinta en el mismo tick
        // (y la navegación al mailto no debe interrumpir la evaluación).
        if (config.endpoint) {
          const limite = Date.now() + 8000;
          while (Date.now() < limite && !result?.getAttribute('data-state')) {
            await new Promise((r) => setTimeout(r, 100));
          }
        }

        const actions = form.querySelector('[data-result-actions]');
        const wa = form.querySelector('[data-result-whatsapp]');
        const tel = form.querySelector('[data-result-actions] a[href^="tel:"]');
        return {
          fallos,
          config,
          estado: result ? result.getAttribute('data-state') : null,
          visible: result ? getComputedStyle(result).display : null,
          titulo: result?.querySelector('[data-result-title]')?.textContent?.trim(),
          texto: result?.querySelector('[data-result-text]')?.textContent?.trim(),
          accionesVisibles: actions ? getComputedStyle(actions).display : null,
          waHref: wa ? wa.getAttribute('href') : null,
          telHref: tel ? tel.getAttribute('href') : null,
          status: form.querySelector('[data-status]')?.textContent?.trim(),
        };
      })()`,
    );

    ok(envio.fallos.length === 0, 'todos los campos del embudo B existen', envio.fallos.join('; '));

    // El formulario tiene DOS modos y el comprobador mira el que hay:
    // con endpoint el envío sale por la web; sin él, se compone un mailto.
    const config = envio.config;

    if (config.endpoint) {
      // --- Con endpoint: formulario web convencional ---
      ok(
        /^https?:\/\//.test(config.action),
        'con endpoint el action es una URL web',
        `action=${config.action}`,
      );
      ok(config.method === 'post', 'con endpoint el formulario envía por POST', `method=${config.method}`);
      ok(
        config.enctype === 'multipart/form-data',
        'con endpoint el formulario es multipart, como uno web normal',
        `enctype=${config.enctype}`,
      );
      ok(envio.estado === 'sent', 'con endpoint el resultado es "sent"', `data-state=${envio.estado}`);
      ok(
        envio.visible === 'block',
        'con endpoint el bloque de éxito SE VE (no solo existe en el DOM)',
        `display=${envio.visible}`,
      );
      ok(
        /Zapytanie wysłane|Enquiry sent|Anfrage gesendet/i.test(envio.titulo || ''),
        'el título dice que el envío ha salido',
        `"${envio.titulo}"`,
      );
      ok(
        /dotarło do nas|reached us|angebommen/i.test(envio.texto || ''),
        'el texto confirma la recepción',
        `"${envio.texto}"`,
      );
      ok(
        envio.accionesVisibles !== 'flex',
        'con endpoint no se ofrecen salidas de emergencia (el lead ya está)',
        `display=${envio.accionesVisibles}`,
      );
    } else {
      // --- Sin endpoint: mailto honesto ---
      ok(
        config.action.startsWith('mailto:'),
        'sin endpoint el action es mailto:',
        `action=${config.action}`,
      );
      ok(
        config.enctype === 'text/plain',
        'sin endpoint el enctype es text/plain (el cuerpo lo rellena el navegador)',
        `enctype=${config.enctype}`,
      );
      ok(envio.estado === 'prepared', 'sin endpoint el resultado NO es "success"', `data-state=${envio.estado}`);
      ok(
        envio.visible === 'block',
        'sin endpoint el bloque de resultado SE VE',
        `display=${envio.visible}`,
      );
      ok(
        envio.estado === 'prepared' && /program pocztowy|mail app|E-Mail-Programm/i.test(envio.texto || ''),
        'el texto dice que se abrió el cliente de correo',
        `"${envio.texto}"`,
      );
      ok(envio.accionesVisibles === 'flex', 'el bloque ofrece WhatsApp y teléfono', `display=${envio.accionesVisibles}`);
      ok(
        /wa\.me/.test(envio.waHref || '') && /tel:\+48/.test(envio.telHref || ''),
        'los enlaces de salida son reales',
        `wa=${String(envio.waHref).slice(0, 42)}… tel=${envio.telHref}`,
      );
      ok(
        /price-list/.test(decodeURIComponent(envio.waHref || '')),
        'el mensaje incluye el contexto de la página',
        'context=price-list',
      );
      ok(
        /Obłóg dębowy cięty/.test(decodeURIComponent(envio.waHref || '')),
        'el mensaje incluye el producto',
        'producto=Obłóg dębowy cięty',
      );
    }

    // ---------- 5. En el cuerpo solo hay campos del embudo elegido ----------
    // El cuerpo del WhatsApp solo existe en el modo mailto: con endpoint el
    // lead va por JSON al servidor y no hay mensaje que inspeccionar.
    if (!config.endpoint) {
      const cuerpo = decodeURIComponent(envio.waHref || '');

      ok(
        /Zakres zapytania: Obłogi i lamele/.test(cuerpo),
        'el cuerpo nombra el embudo elegido',
        '[lead] Zakres zapytania: Obłogi i lamele',
      );
      ok(
        /Długość \(mm\): 2500/.test(cuerpo) && /Ilość \(mb\): 20/.test(cuerpo),
        'el cuerpo lleva los datos del embudo B',
        'length + quantity',
      );
      ok(
        !/Powierzchnia|Przybliżona powierzchnia/.test(cuerpo),
        'el cuerpo NO lleva campos del embudo A',
        'sin surface',
      );
      ok(
        /Zgoda na kontakt w sprawie tej wyceny: tak/.test(cuerpo),
        'el cuerpo incluye la línea de consentimiento (RODO 7.1)',
        'consent line',
      );
      ok(
        /Język: pl/.test(cuerpo),
        'el cuerpo dice de qué página y en qué idioma vino',
        'Język: pl',
      );
    }

    const errs = cdp.events
      .filter(
        (e) =>
          e.method === 'Runtime.exceptionThrown' ||
          (e.method === 'Log.entryAdded' && e.params.entry.level === 'error'),
      )
      .map((e) => JSON.stringify(e.params).slice(0, 220));
    ok(errs.length === 0, 'sin errores de consola en la página de precio', errs[0] || '');

    // ---------- 6. Campo obligatorio del embudo activo ----------
    // La comprobación mira el embudo que está activo AHORA, no uno fijo:
    // el juego de campos cambia con el radio (por defecto B en /cennik/).
    await cdp.send('Page.navigate', { url: `${BASE}/cennik/` }, sessionId);
    await sleep(1300);

    const validacion = await evaluate(
      cdp,
      sessionId,
      `(() => {
        const form = document.getElementById('quote-form');
        const set = (id, v) => {
          const el = document.querySelector('#' + id);
          el.value = v;
          el.dispatchEvent(new Event('input', { bubbles: true }));
        };
        set('quote-form-name', 'Jan Kowalski');
        set('quote-form-email', 'jan@example.com');
        document.querySelector('#quote-form-consent').checked = true;
        form.requestSubmit ? form.requestSubmit() : form.querySelector('[data-submit]').click();
        const grupo = form.querySelector('.form__group[data-active]');
        const requeridos = [...(grupo?.querySelectorAll('.field[data-field]') ?? [])]
          .map((field) => field.getAttribute('data-field'))
          .filter(
            (name) =>
              name && grupo.querySelector('#quote-form-' + name)?.hasAttribute('data-required'),
          );
        const bloqueados = requeridos.filter(
          (name) =>
            form.querySelector('[data-field="' + name + '"]')?.getAttribute('data-invalid') ===
            'true',
        );
        const mensajes = requeridos.map((name) => {
          const err = document.querySelector('[data-error-for="quote-form-' + name + '"]');
          return err ? err.textContent.trim() : '';
        });
        const resultado = form.querySelector('[data-result]');
        return {
          embudo: grupo?.getAttribute('data-funnel') || null,
          requeridos,
          bloqueados,
          mensajes,
          estadoResultado: resultado ? resultado.getAttribute('data-state') : null,
          status: form.querySelector('[data-status]')?.textContent?.trim(),
        };
      })()`,
    );

    ok(
      validacion.requeridos.length > 0 &&
        validacion.bloqueados.length === validacion.requeridos.length,
      'sin los campos del embudo activo NO se envía',
      `embudo=${validacion.embudo} bloqueados=${validacion.bloqueados.join(',')} de ${validacion.requeridos.join(',')}`,
    );
    ok(
      validacion.mensajes.every((m) => /wymagane|required|erforderlich/i.test(m || '')),
      'cada campo obligatorio dice que es obligatorio',
      validacion.mensajes.join(' | '),
    );
    ok(
      validacion.estadoResultado === null,
      'no se muestra un resultado falso cuando falta un campo',
      `data-state=${validacion.estadoResultado}`,
    );

    // ---------- 6b. El embudo A (paneles) bloquea con la superficie ----------
    const validacionA = await evaluate(
      cdp,
      sessionId,
      `(() => {
        const form = document.getElementById('quote-form');
        const radio = form.querySelector('#quote-form-funnel-A');
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
        const set = (id, v) => {
          const el = document.querySelector('#' + id);
          el.value = v;
          el.dispatchEvent(new Event('input', { bubbles: true }));
        };
        set('quote-form-name', 'Jan Kowalski');
        set('quote-form-email', 'jan@example.com');
        document.querySelector('#quote-form-consent').checked = true;
        form.requestSubmit ? form.requestSubmit() : form.querySelector('[data-submit]').click();
        const campo = document.querySelector('[data-field="surface"]');
        const error = document.querySelector('[data-error-for="quote-form-surface"]');
        const resultado = form.querySelector('[data-result]');
        return {
          invalido: campo ? campo.getAttribute('data-invalid') : null,
          error: error ? error.textContent.trim() : null,
          estadoResultado: resultado ? resultado.getAttribute('data-state') : null,
        };
      })()`,
    );

    ok(
      validacionA.invalido === 'true' &&
        /wymagane|required|erforderlich/i.test(validacionA.error || ''),
      'embudo A (paneles): sin superficie NO se envía (campo obligatorio del embudo A)',
      `"${validacionA.error}"`,
    );
    ok(
      validacionA.estadoResultado === null,
      'embudo A: tampoco se muestra un resultado falso',
      `data-state=${validacionA.estadoResultado}`,
    );

    // ---------- 7. La CTA de la ficha lleva el producto y el ancla ----------
    await cdp.send('Page.navigate', { url: `${BASE}/produkty/oblog-debowy-ciety/` }, sessionId);
    await sleep(1400);

    const cta = await evaluate(
      cdp,
      sessionId,
      `(() => {
        const a = [...document.querySelectorAll('a')].find((el) =>
          (el.getAttribute('href') || '').includes('produkt='),
        );
        const h = a ? a.getAttribute('href') : null;
        return {
          href: h,
          tieneAncla: !!h && h.includes('#quote-form'),
          tieneProducto: !!h && h.includes('produkt=oblog-debowy-ciety'),
        };
      })()`,
    );

    ok(
      cta.tieneAncla && cta.tieneProducto,
      'la CTA de la ficha apunta a /cennik/?produkt=…#quote-form',
      cta.href || 'no encontrada',
    );

    // ---------- 8. La ficha tiene UN juego de campos, sin pregunta ----------
    const ficha = await evaluate(
      cdp,
      sessionId,
      `(() => {
        const form = document.getElementById('quote-form');
        const sels = [...document.querySelectorAll('select[name="product"]')];
        const sel = sels[sels.length - 1];
        const opt = sel ? sel.selectedOptions[0] : null;
        const grupos = [...form.querySelectorAll('.form__group[data-funnel]')];
        return {
          id: opt ? opt.getAttribute('data-product-id') : null,
          grupos: grupos.map((g) => g.getAttribute('data-funnel')),
          pregunta: !!form.querySelector('.form__choice'),
          required: !!document.querySelector('#quote-form-length[data-required]'),
        };
      })()`,
    );

    ok(
      ficha.id === 'oblog-debowy-ciety',
      'la ficha mantiene el producto preseleccionado',
      `id=${ficha.id}`,
    );
    ok(
      ficha.grupos.length === 1 && ficha.grupos[0] === 'B' && !ficha.pregunta,
      'la ficha del obłóg pide SOLO datos de obłóg (sin pregunta de embudo)',
      `grupos=${ficha.grupos.join(',')}`,
    );
    ok(ficha.required, 'la longitud está marcada como obligatoria');

    // ---------- 9. La ficha de paneles pide superficie, no metros ----------
    await cdp.send('Page.navigate', { url: `${BASE}/produkty/panele-sufitowe-i-scienne/` }, sessionId);
    await sleep(1400);

    const paneles = await evaluate(
      cdp,
      sessionId,
      `(() => {
        const form = document.getElementById('quote-form');
        const grupos = [...form.querySelectorAll('.form__group[data-funnel]')];
        return {
          grupos: grupos.map((g) => g.getAttribute('data-funnel')),
          surface: !!document.querySelector('#quote-form-surface[data-required]'),
          length: !!document.querySelector('#quote-form-length'),
          pregunta: !!form.querySelector('.form__choice'),
        };
      })()`,
    );

    ok(
      paneles.grupos.length === 1 &&
        paneles.grupos[0] === 'A' &&
        paneles.surface &&
        !paneles.length &&
        !paneles.pregunta,
      'la ficha de paneles pide superficie (m²), no longitud',
      `grupos=${paneles.grupos.join(',')}`,
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
