/**
 * Kontrast tekstu — pary kolorów, na których stoi system wizualny.
 *
 * Skrypt nie zgaduje: bierze wartości tokenów z `src/styles/global.css`
 * (blok `:root`), rozwiązuje łańcuchy `var(--x)` i liczy współczynnik
 * kontrastu WCAG 2.1. Dzięki temu check idzie za zmianą palety — jeśli
 * ktoś przyciemni `--accent-strong`, wynik zmienia się automatycznie.
 *
 * Progi (WCAG 2.1 AA):
 *   • 4,5:1 — tekst normalny,
 *   • 3,0:1 — tekst duży (≥ 24 px albo ≥ 18,66 px pogrubiony).
 *
 * Uruchomienie: node _tools/check-contrast.cjs
 */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const CSS_FILE = path.join(ROOT, 'src', 'styles', 'global.css');

/* ------------------------------------------------------------------ *
 * Tokeny z :root
 * ------------------------------------------------------------------ */

const css = fs.readFileSync(CSS_FILE, 'utf-8');

const rootBlock = css.match(/:root\s*\{([\s\S]*?)\n\}/);
if (!rootBlock) {
  console.error('Nie znaleziono bloku :root w src/styles/global.css');
  process.exit(1);
}

/** nazwa tokenu → wartość dosłowna (może być `var(--inny)` albo `#hex`). */
const rawTokens = new Map();
for (const line of rootBlock[1].split('\n')) {
  const match = line.match(/^\s*(--[a-z0-9-]+)\s*:\s*([^;]+);/i);
  if (match) rawTokens.set(match[1], match[2].trim());
}

/** Rozwiązuje łańcuch `var(--x)` i zwraca kolor w formacie `#rrggbb`. */
function resolveToken(name, seen = new Set()) {
  if (seen.has(name)) return null;
  seen.add(name);
  const raw = rawTokens.get(name);
  if (!raw) return null;
  const nested = raw.match(/^var\((--[a-z0-9-]+)\)$/i);
  if (nested) return resolveToken(nested[1], seen);
  const hex = raw.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const value = hex[1];
    if (value.length === 3) {
      return `#${value
        .split('')
        .map((c) => c + c)
        .join('')}`;
    }
    return `#${value.toLowerCase()}`;
  }
  return null;
}

/** Kolor może być tokenem (`--sand`) albo dosłownym heksem (`#a63a2a`). */
function resolveColor(value) {
  if (value.startsWith('--')) return resolveToken(value);
  const hex = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!hex) return null;
  const digits = hex[1];
  if (digits.length === 3) {
    return `#${digits
      .split('')
      .map((c) => c + c)
      .join('')}`;
  }
  return `#${digits.toLowerCase()}`;
}

/* ------------------------------------------------------------------ *
 * Kontrast (WCAG 2.1)
 * ------------------------------------------------------------------ */

function relativeLuminance(hex) {
  const channels = [1, 3, 5].map((offset) => {
    const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(fg, bg) {
  const a = relativeLuminance(fg);
  const b = relativeLuminance(bg);
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

/* ------------------------------------------------------------------ *
 * Pary do sprawdzenia
 * ------------------------------------------------------------------ */

/**
 * `min` — minimalny współczynnik kontrastu.
 * `large` — true, jeśli to tekst duży (próg 3:1 zamiast 4,5:1).
 */
const pairs = [
  // --- Kicker i etykiety -------------------------------------------
  { what: '.kicker na jasnym tle', fg: '--accent-strong', bg: '--paper', min: 4.5 },
  { what: '.section--cream .kicker', fg: '--accent-strong', bg: '--cream', min: 4.5 },
  { what: '.section--sand .kicker', fg: '--accent-strong', bg: '--sand', min: 4.5 },
  { what: '.section--dark .kicker', fg: '--straw', bg: '--ink', min: 4.5 },
  { what: '.hero .kicker', fg: '--straw', bg: '--ink', min: 4.5 },
  { what: '.field__label', fg: '--accent-strong', bg: '--paper', min: 4.5 },

  // --- Tekst bieżny ------------------------------------------------
  { what: '.lede / .prose p', fg: '--text-soft', bg: '--paper', min: 4.5 },
  { what: '.lede / .prose p na kremie', fg: '--text-soft', bg: '--cream', min: 4.5 },
  { what: '.lede / .prose p na piasku', fg: '--text-soft', bg: '--sand', min: 4.5 },
  { what: '.card__text', fg: '--text-soft', bg: '--paper', min: 4.5 },
  { what: '.highlight__text', fg: '--text-soft', bg: '--paper', min: 4.5 },
  { what: '.app__text', fg: '--text-soft', bg: '--paper', min: 4.5 },
  { what: '.specs__label', fg: '--text-soft', bg: '--paper', min: 4.5 },
  // Datos clave de la home (bloques agrupados sobre superficie `sand`).
  { what: '.def__label', fg: '--accent-strong', bg: '--sand', min: 4.5 },
  { what: '.def__value', fg: '--text', bg: '--sand', min: 4.5 },
  { what: '.def__group-title', fg: '--text', bg: '--sand', min: 4.5 },
  { what: '.def__note', fg: '--text-soft', bg: '--sand', min: 4.5 },
  { what: '.figure__caption', fg: '--text-soft', bg: '--paper', min: 4.5 },

  // --- Home editorial (bloques del brief) ---------------------------
  { what: '.feature__lead', fg: '#e4dac9', bg: '--ink', min: 4.5 },
  { what: '.benefit__title', fg: '--cream', bg: '--ink', min: 4.5 },
  { what: '.benefit__text', fg: '--text-invert-soft', bg: '--ink', min: 4.5 },
  { what: '.feature__proof', fg: '--straw', bg: '--ink', min: 4.5 },
  { what: '.statement__text', fg: '--text', bg: '--paper', min: 4.5 },
  { what: '.statement__note', fg: '--text-soft', bg: '--paper', min: 4.5 },
  { what: '.stats__value', fg: '--text', bg: '--paper', min: 4.5 },
  { what: '.stats__label', fg: '--text-soft', bg: '--paper', min: 4.5 },
  { what: '.service__name', fg: '--text', bg: '--sand', min: 4.5 },
  { what: '.service__text', fg: '--text-soft', bg: '--sand', min: 4.5 },
  { what: '.quote-block__lead', fg: '--text', bg: '--cream', min: 4.5 },
  { what: '.quote-block__bullets li', fg: '--text-soft', bg: '--cream', min: 4.5 },
  { what: '.contact-card__value', fg: '--text', bg: '--paper', min: 4.5 },
  { what: '.contact-card__label', fg: '--text-soft', bg: '--paper', min: 4.5 },
  { what: '.consent label', fg: '--text-soft', bg: '--paper', min: 4.5 },
  { what: '.form__fallback', fg: '--text-soft', bg: '--paper', min: 4.5 },
  { what: '.form__fallback a', fg: '--accent-strong', bg: '--paper', min: 4.5 },

  // --- Jasna karta (.card) wewnątrz ciemnej sekcji -----------------
  { what: '.section--dark .card .field__label', fg: '--text', bg: '--paper', min: 4.5 },
  { what: '.section--dark .card h2 / h3', fg: '--text', bg: '--paper', min: 4.5 },
  { what: '.section--dark .card .kicker', fg: '--accent-strong', bg: '--paper', min: 4.5 },
  { what: '.section--dark .card .form__fallback', fg: '--text-soft', bg: '--paper', min: 4.5 },
  { what: '.section--dark .card .form__fallback a', fg: '--accent-strong', bg: '--paper', min: 4.5 },
  { what: '.section--dark .card .field__error', fg: '#a63a2a', bg: '--paper', min: 4.5 },

  // --- Ciemna sekcja ------------------------------------------------
  { what: '.section--dark .lede / .prose p', fg: '--text-invert-soft', bg: '--ink', min: 4.5 },
  { what: '.section--dark .field__label', fg: '--cream', bg: '--ink', min: 4.5 },
  { what: '.section--dark .form__fallback', fg: '--text-invert-soft', bg: '--ink', min: 4.5 },
  { what: '.section--dark .form__fallback a', fg: '--straw', bg: '--ink', min: 4.5 },
  { what: '.section--dark .field__error', fg: '#e9a196', bg: '--ink', min: 4.5 },

  // --- Komunikaty o błędach -----------------------------------------
  { what: '.field__error', fg: '#a63a2a', bg: '--paper', min: 4.5 },
  { what: '.form__status[data-state=error]', fg: '#7d2a1c', bg: '#fdf1ef', min: 4.5 },
  { what: '.form__status[data-state=success]', fg: '#33502a', bg: '#f1f6ee', min: 4.5 },
  { what: '.form__status[data-state=prepared]', fg: '--bark', bg: '--cream', min: 4.5 },

  // --- Pas CTA -------------------------------------------------------
  { what: '.cta-band', fg: '--ink', bg: '--oak', min: 4.5 },
  { what: '::selection', fg: '--paper', bg: '--accent-strong', min: 4.5 },

  // --- Nagłówki (tekst duży) ----------------------------------------
  { what: '.card__title', fg: '--text-soft', bg: '--paper', min: 4.5 },
  { what: '.highlight__title', fg: '--text-soft', bg: '--paper', min: 4.5 },
  { what: '.app__title', fg: '--text-soft', bg: '--paper', min: 4.5 },
  { what: '.section--dark h2 / h3', fg: '--cream', bg: '--ink', min: 4.5 },
  { what: '.hero__title', fg: '--paper', bg: '--ink', min: 4.5 },

  // --- Stopka i nagłówek ---------------------------------------------
  { what: '.footer__title', fg: '--straw', bg: '--ink', min: 4.5 },
  { what: '.footer__brand p', fg: '--text-invert-soft', bg: '--ink', min: 4.5 },
  { what: '.footer__bottom', fg: '--text-invert-soft', bg: '--ink', min: 4.5 },
];

/* ------------------------------------------------------------------ *
 * Raport
 * ------------------------------------------------------------------ */

const problems = [];
const rows = [];

for (const pair of pairs) {
  const fg = resolveColor(pair.fg);
  const bg = resolveColor(pair.bg);
  if (!fg || !bg) {
    problems.push(`Nie udało się rozwiązać kolorów: ${pair.what} (${pair.fg} / ${pair.bg})`);
    continue;
  }
  const ratio = contrastRatio(fg, bg);
  const passed = ratio >= pair.min;
  rows.push({ what: pair.what, fg, bg, ratio, min: pair.min, passed });
  if (!passed) {
    problems.push(
      `Kontrast ${pair.what}: ${ratio.toFixed(2)}:1 (potrzeba ${pair.min}:1) — ${fg} na ${bg}`,
    );
  }
}

const width = Math.max(...rows.map((row) => row.what.length));
console.log('Pary tekst/tło — kontrast (WCAG 2.1 AA):');
for (const row of rows) {
  const mark = row.passed ? '✓' : '✗';
  console.log(
    ` ${mark} ${row.what.padEnd(width)}  ${row.ratio.toFixed(2).padStart(6)}:1  (min ${row.min})  ${row.fg} na ${row.bg}`,
  );
}

if (problems.length) {
  console.log('\nPROBLEMY:', problems.length);
  for (const problem of problems) console.log(' ✗', problem);
  process.exit(1);
}

console.log('\nOK — wszystkie pary mieszczą się w progu AA.');
