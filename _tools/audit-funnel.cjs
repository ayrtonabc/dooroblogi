#!/usr/bin/env node
/**
 * Diagnostyka lejka sprzedażowego — liczy na wygenerowanym HTML w `dist/`.
 *
 * Mierzy, dla każdego typu strony:
 *   • ile jest przycisków `.btn` i które z nich są pierwotne (bez `--ghost`),
 *   • ile linków prowadzi do telefonu (`tel:`), WhatsAppa (`wa.me`) i do
 *     strony wyceny,
 *   • ile pól ma formularz i które z nich są wymagane,
 *   • czy na stronie jest dokładnie jeden CTA pierwotny do wyceny.
 *
 * Użycie: node _tools/audit-funnel.cjs
 */

const fs = require('node:fs');
const path = require('node:path');

const DIST = path.join(__dirname, '..', 'dist');

const PAGES = [
  { key: 'home', file: 'index.html' },
  { key: 'catalog', file: 'produkty/index.html' },
  { key: 'product', file: 'produkty/oblog-debowy-ciety/index.html' },
  { key: 'price-list', file: 'cennik/index.html' },
  { key: 'for-trade', file: 'dla-firm/index.html' },
  { key: 'contact', file: 'kontakt/index.html' },
  { key: 'about', file: 'o-nas/index.html' },
  { key: 'delivery', file: 'dostawa/index.html' },
  { key: 'gallery', file: 'realizacje/index.html' },
];

const count = (html, re) => (html.match(re) || []).length;

function read(rel) {
  const full = path.join(DIST, rel);
  if (!fs.existsSync(full)) return null;
  return fs.readFileSync(full, 'utf8');
}

const rows = [];

for (const page of PAGES) {
  const html = read(page.file);
  if (!html) {
    rows.push({ page: page.key, missing: true });
    continue;
  }

  const btnTotal = count(html, /<a[^>]*class="[^"]*\bbtn\b[^"]*"/g);
  const btnGhost = count(html, /<a[^>]*class="[^"]*\bbtn--ghost\b[^"]*"/g);
  const btnPrimary = btnTotal - btnGhost;
  const tel = count(html, /href="tel:/g);
  const wa = count(html, /wa\.me/g);
  const quoteLink = count(
    html,
    /href="[^"]*(cennik|price-list|preisliste)[^"]*"/g,
  );
  const forms = count(html, /<form[\s>]/g);
  const fields = count(html, /<(input|select|textarea)\b[^>]*name="/g);
  const required = count(html, /<(input|select|textarea)\b[^>]*\brequired\b/g);
  const h1 = count(html, /<h1[\s>]/g);
  const sticky = count(html, /sticky-cta|data-sticky-cta/g);

  rows.push({
    page: page.key,
    btnTotal,
    btnPrimary,
    btnGhost,
    tel,
    wa,
    quoteLink,
    forms,
    fields,
    required,
    h1,
    sticky,
  });
}

const pad = (v, n) => String(v).padEnd(n);

console.log('\n== CTA i pola formularza na wygenerowanym HTML (dist/) ==\n');
console.log(
  pad('strona', 14) +
    pad('btn', 6) +
    pad('prim', 6) +
    pad('ghost', 7) +
    pad('tel', 5) +
    pad('wa', 4) +
    pad('wycena', 8) +
    pad('form', 6) +
    pad('pola', 6) +
    pad('wymag', 7) +
    'sticky',
);
console.log('-'.repeat(74));

for (const r of rows) {
  if (r.missing) {
    console.log(pad(r.page, 14) + 'BRAK PLIKU w dist/');
    continue;
  }
  console.log(
    pad(r.page, 14) +
      pad(r.btnTotal, 6) +
      pad(r.btnPrimary, 6) +
      pad(r.btnGhost, 7) +
      pad(r.tel, 5) +
      pad(r.wa, 4) +
      pad(r.quoteLink, 8) +
      pad(r.forms, 6) +
      pad(r.fields, 6) +
      pad(r.required, 7) +
      String(r.sticky),
  );
}

// Ile stron ma formularz i ile campos visibles tiene.
const formsPages = rows.filter((r) => r.forms > 0);
if (formsPages.length) {
  const totalFields = formsPages.reduce((s, r) => s + r.fields, 0);
  const totalRequired = formsPages.reduce((s, r) => s + r.required, 0);
  console.log(
    `\nFormularios: ${formsPages.length} páginas · ${totalFields} campos en total · ${totalRequired} obligatorios`,
  );
}

const stickyPages = rows.filter((r) => r.sticky > 0);
console.log(
  `Barra flotante móvil: ${stickyPages.length}/${rows.length} páginas con barra fija`,
);
console.log('');
