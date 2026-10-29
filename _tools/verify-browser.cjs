/**
 * Weryfikacja w przeglądarce (Chrome headless + CDP) — bez zależności.
 *
 * Sprawdza rzeczy, których nie da się zobaczyć w statycznym HTML:
 *   • błędy w konsoli i nieobsłużone wyjątki na każdej stronie,
 *   • hierarchię nagłówków (brak skoków h1 → h3),
 *   • przepływ walidacji formularza: zgoda, komunikat błędu, `data-invalid`,
 *     fokus po zaznaczeniu,
 *   • menu mobilne na 390 px (przycisk zmienia etykietę, `aria-expanded`),
 *   • atrybuty formularza (`novalidate` tylko w JS, nie w HTML),
 *   • realny kontrast wyrenderowanych par tekst/tło.
 *
 * Wymaga uruchomionego serwera statycznego: node _tools/serve.cjs
 * Uruchomienie: node _tools/verify-browser.cjs
 */
const { spawn } = require('node:child_process');
const os = require('node:os');
const path = require('node:path');
const fs = require('node:fs');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9224;
const BASE = 'http://127.0.0.1:4330';
const SHOTS = path.join(os.tmpdir(), 'doorso-verify');

const PAGES = ['/', '/cennik/', '/produkty/oblog-debowy-ciety/', '/de/produkte/', '/produkty/', '/dla-firm/'];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getWsUrl() {
  for (let i = 0; i < 80; i++) {
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
  fs.mkdirSync(SHOTS, { recursive: true });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-verify-'));
  const chrome = spawn(
    CHROME,
    [
      '--headless=new',
      `--remote-debugging-port=${PORT}`,
      `--user-data-dir=${profile}`,
      '--no-first-run',
      '--disable-gpu',
      '--hide-scrollbars',
      'about:blank',
    ],
    { stdio: 'ignore' },
  );

  const problems = [];

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
    await send('Log.enable', {}, sessionId);

    const consoleErrors = [];
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') {
        consoleErrors.push(msg.params.entry.text);
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        consoleErrors.push(
          msg.params.exceptionDetails.exception?.description ||
            msg.params.exceptionDetails.text,
        );
      }
    });

    const evaluate = async (expression) => {
      const res = await send(
        'Runtime.evaluate',
        { expression, returnByValue: true, awaitPromise: true },
        sessionId,
      );
      if (res.exceptionDetails) {
        throw new Error(res.exceptionDetails.exception?.description || res.exceptionDetails.text);
      }
      return res.result.value;
    };

    const setViewport = (width, height, mobile) =>
      send(
        'Emulation.setDeviceMetricsOverride',
        { width, height, deviceScaleFactor: 1, mobile },
        sessionId,
      );

    /* ---------------------------------------------------------------- *
     * 1. Każda strona: błędy konsoli + hierarchia nagłówków
     * ---------------------------------------------------------------- */
    for (const route of PAGES) {
      consoleErrors.length = 0;
      await setViewport(1440, 900, false);
      await send('Page.navigate', { url: BASE + route }, sessionId);
      await sleep(1600);

      const headings = await evaluate(`(() => {
        const out = [];
        for (const el of document.querySelectorAll('h1,h2,h3,h4,h5,h6')) {
          out.push({
            level: Number(el.tagName.slice(1)),
            text: (el.textContent || '').trim().slice(0, 48),
          });
        }
        return out;
      })()`);

      const skips = [];
      for (let i = 1; i < headings.length; i++) {
        if (headings[i].level > headings[i - 1].level + 1) {
          skips.push(
            `h${headings[i - 1].level} → h${headings[i].level} („${headings[i].text}”)`,
          );
        }
      }
      const h1count = headings.filter((h) => h.level === 1).length;

      console.log(
        `  ${route.padEnd(32)} nagłówki=${String(headings.length).padStart(2)} h1=${h1count} ` +
          `błędy konsoli=${consoleErrors.length}${skips.length ? ' SKOKI: ' + skips.join('; ') : ''}`,
      );
      if (h1count !== 1) problems.push(`${route}: jest ${h1count} elementów h1 (powinno być 1)`);
      for (const skip of skips) problems.push(`${route}: skok nagłówków ${skip}`);
      for (const error of consoleErrors) problems.push(`${route}: błąd w konsoli — ${error}`);
    }

    /* ---------------------------------------------------------------- *
     * 2. Formularz wyceny: przepływ walidacji i zgody
     * ---------------------------------------------------------------- */
    await setViewport(1440, 900, false);
    await send('Page.navigate', { url: BASE + '/cennik/' }, sessionId);
    await sleep(1600);

    const formAttrs = await evaluate(`(async () => {
      const form = document.querySelector('[data-quote-form]');
      if (!form) return null;
      // Ustawienie form.noValidate = true odbija się w atrybut, więc atrybutu
      // szukamy w SUROWYM HTML — tam decyduje ścieżka bez JavaScriptu.
      const raw = await fetch(location.href).then((r) => r.text());
      const rawTag = (raw.match(/<form[^>]*data-quote-form[^>]*>/) || [''])[0];
      return {
        rawHasNovalidate: /\\snovalidate(\\s|=|>)/i.test(rawTag),
        rawTag,
        noValidateProp: form.noValidate,
        method: form.getAttribute('method'),
        enctype: form.getAttribute('enctype'),
        action: form.getAttribute('action'),
      };
    })()`);
    console.log('\n  Formularz:', JSON.stringify(formAttrs));
    if (!formAttrs) problems.push('/cennik/: nie znaleziono formularza');
    else {
      if (formAttrs.rawHasNovalidate) {
        problems.push('/cennik/: w surowym HTML jest atrybut novalidate — walidacja przeglądarki nie działa');
      }
      if (formAttrs.noValidateProp !== true) {
        problems.push('/cennik/: skrypt nie przejął walidacji (form.noValidate !== true)');
      }
    }

    const consentFlow = await evaluate(`(async () => {
      const form = document.querySelector('[data-quote-form]');
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      const consent = form.querySelector('[data-field="consent"]');
      const box = form.querySelector('input[name="consent"]');
      const errorEl = form.querySelector('[data-error-for$="-consent"]');
      const status = form.querySelector('[data-status]');

      // Wypełniamy pozostałe pola, żeby jedynym błędem była zgoda.
      const set = (id, value) => {
        const el = form.querySelector('#' + id);
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      };
      set('quote-form-name', 'Jan Kowalski');
      set('quote-form-email', 'jan@example.com');
      set('quote-form-message', '3 m, 40x20 mm');

      form.querySelector('[data-submit]').click();
      await sleep(250);
      const before = {
        invalid: consent.getAttribute('data-invalid'),
        error: (errorEl.textContent || '').trim(),
        status: (status.textContent || '').trim(),
        focused: document.activeElement ? document.activeElement.id || document.activeElement.tagName : null,
      };

      box.click();
      await sleep(250);
      const after = {
        invalid: consent.getAttribute('data-invalid'),
        error: (errorEl.textContent || '').trim(),
        checked: box.checked,
      };

      // Odznaczenie czyści komunikat tak samo jak w pozostałych polach —
      // błąd wraca dopiero przy ponownym wysłaniu.
      box.click();
      await sleep(250);
      const unchecked = {
        invalid: consent.getAttribute('data-invalid'),
        error: (errorEl.textContent || '').trim(),
      };

      form.querySelector('[data-submit]').click();
      await sleep(250);
      const resubmitted = {
        invalid: consent.getAttribute('data-invalid'),
        error: (errorEl.textContent || '').trim(),
        focused: document.activeElement ? document.activeElement.id || document.activeElement.tagName : null,
      };

      return { before, after, unchecked, resubmitted };
    })()`);
    console.log('  Zgoda — przed zaznaczeniem:', JSON.stringify(consentFlow.before));
    console.log('  Zgoda — po zaznaczeniu:   ', JSON.stringify(consentFlow.after));
    console.log('  Zgoda — po odznaczeniu:   ', JSON.stringify(consentFlow.unchecked));
    console.log('  Zgoda — po ponownym wysłaniu:', JSON.stringify(consentFlow.resubmitted));

    if (consentFlow.before.invalid !== 'true') {
      problems.push('zgoda: brak data-invalid="true" po wysłaniu formularza bez zgody');
    }
    if (!consentFlow.before.error) problems.push('zgoda: brak komunikatu o braku zgody');
    if (consentFlow.before.focused !== 'quote-form-consent') {
      problems.push(`zgoda: fokus nie trafił na checkbox (było: ${consentFlow.before.focused})`);
    }
    if (consentFlow.after.invalid !== 'false') {
      problems.push('zgoda: komunikat nie zniknął po zaznaczeniu');
    }
    if (consentFlow.after.error) problems.push('zgoda: tekst błędu nie zniknął po zaznaczeniu');
    if (consentFlow.resubmitted.invalid !== 'true') {
      problems.push('zgoda: brak data-invalid="true" po ponownym wysłaniu bez zgody');
    }
    if (consentFlow.resubmitted.focused !== 'quote-form-consent') {
      problems.push(`zgoda: fokus nie wrócił na checkbox (było: ${consentFlow.resubmitted.focused})`);
    }

    /* ---------------------------------------------------------------- *
     * 3. Menu mobilne (390 px)
     * ---------------------------------------------------------------- */
    await setViewport(390, 844, true);
    await send('Page.navigate', { url: BASE + '/' }, sessionId);
    await sleep(1400);

    const menu = await evaluate(`(async () => {
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      const toggle = document.querySelector('[data-nav-toggle]');
      const panel = document.querySelector('[data-mobile-nav]');
      const label = toggle.querySelector('[data-nav-label]');
      const before = { expanded: toggle.getAttribute('aria-expanded'), label: label.textContent.trim() };
      toggle.click();
      await sleep(250);
      const open = {
        expanded: toggle.getAttribute('aria-expanded'),
        label: label.textContent.trim(),
        panelOpen: panel.getAttribute('data-open'),
        panelHidden: panel.getAttribute('aria-hidden'),
        visible: getComputedStyle(panel).display !== 'none',
      };
      toggle.click();
      await sleep(250);
      const closed = { expanded: toggle.getAttribute('aria-expanded'), label: label.textContent.trim() };
      return { before, open, closed };
    })()`);
    console.log('\n  Menu mobilne:', JSON.stringify(menu));
    if (menu.open.expanded !== 'true') problems.push('menu mobilne: aria-expanded nie zmieniło się na true');
    if (menu.open.label === menu.before.label) {
      problems.push('menu mobilne: etykieta przycisku nie zmieniła się');
    }
    if (!menu.open.visible) problems.push('menu mobilne: panel się nie otworzył');
    if (menu.closed.expanded !== 'false') problems.push('menu mobilne: panel się nie zamknął');

    /* ---------------------------------------------------------------- *
     * 4. Realny kontrast wyrenderowanych elementów
     * ---------------------------------------------------------------- */
    const CONTRAST_FN = `(() => {
      const lum = (rgb) => {
        const c = rgb.map((v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
        return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
      };
      const parse = (value) => {
        const m = value.match(/rgba?\\(([^)]+)\\)/);
        if (!m) return null;
        const parts = m[1].split(',').map((p) => parseFloat(p));
        return { rgb: parts.slice(0, 3), a: parts.length > 3 ? parts[3] : 1 };
      };
      const bgOf = (el) => {
        let node = el;
        while (node) {
          const c = parse(getComputedStyle(node).backgroundColor);
          if (c && c.a > 0) return c.rgb;
          node = node.parentElement;
        }
        return [255, 255, 255];
      };
      const ratio = (el) => {
        const fg = parse(getComputedStyle(el).color);
        if (!fg) return null;
        const bg = bgOf(el);
        const a = lum(fg.rgb), b = lum(bg);
        return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      };
      const out = [];
      const add = (sel, note) => {
        const el = document.querySelector(sel);
        if (!el) { out.push({ sel, note, missing: true }); return; }
        const r = ratio(el);
        out.push({ sel, note, ratio: r ? Math.round(r * 100) / 100 : null, size: getComputedStyle(el).fontSize });
      };
      add('.section--sand .kicker', 'kicker na piasku');
      add('.section--sand .highlight__title', 'nagłówek na piasku');
      add('.section--dark .card .field__label', 'etykieta w karcie na ciemnym tle');
      add('.section--dark .card .form__fallback', 'fallback w karcie na ciemnym tle');
      add('.section--dark .card .form__fallback strong', 'telefon w karcie na ciemnym tle');
      add('.hero .kicker', 'kicker w hero');
      add('.card__text', 'tekst karty produktu');
      add('.consent label', 'etykieta zgody');
      return out;
    })()`;

    for (const route of ['/', '/produkty/', '/cennik/', '/produkty/oblog-debowy-ciety/']) {
      await setViewport(1440, 900, false);
      await send('Page.navigate', { url: BASE + route }, sessionId);
      await sleep(1400);
      const rows = await evaluate(CONTRAST_FN);
      console.log(`\n  Kontrast na ${route}:`);
      for (const row of rows) {
        if (row.missing) { console.log(`    – ${row.sel} (brak elementu)`); continue; }
        const mark = row.ratio >= 4.5 ? '✓' : '✗';
        console.log(`    ${mark} ${row.note.padEnd(38)} ${row.ratio}:1  (${row.size})`);
        if (row.ratio < 4.5) {
          problems.push(`${route}: ${row.sel} — kontrast ${row.ratio}:1 poniżej 4,5:1`);
        }
      }
    }

    /* ---------------------------------------------------------------- *
     * 5. Zrzuty ekranu (desktop 1440 + mobil 390)
     * ---------------------------------------------------------------- */
    for (const route of ['/', '/cennik/', '/produkty/oblog-debowy-ciety/', '/de/produkte/']) {
      for (const [label, width, height, mobile] of [
        ['desktop', 1440, 900, false],
        ['mobile', 390, 844, true],
      ]) {
        await setViewport(width, height, mobile);
        await send('Page.navigate', { url: BASE + route }, sessionId);
        await sleep(1600);
        const shot = await send(
          'Page.captureScreenshot',
          { format: 'png', captureBeyondViewport: false },
          sessionId,
        );
        const name = route.replace(/[\\/]/g, '_') + '-' + label + '.png';
        fs.writeFileSync(path.join(SHOTS, name), Buffer.from(shot.data, 'base64'));
      }
    }
    console.log('\n  Zrzuty:', SHOTS);

    if (problems.length) {
      console.log('\nPROBLEMY:', problems.length);
      for (const problem of problems) console.log(' ✗', problem);
      process.exitCode = 1;
    } else {
      console.log('\nOK — brak problemów.');
    }
  } finally {
    chrome.kill();
    try {
      fs.rmSync(profile, { recursive: true, force: true });
    } catch {
      /* tymczasowe */
    }
  }
})();
