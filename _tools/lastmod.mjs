/**
 * `lastmod` w sitemapie — data modyfikacji treści, która zasila trasę.
 *
 * Poprzednio `astro.config.mjs` wpisywał `new Date().toISOString()`, czyli
 * znacznik czasu buildu. Efekt: każde przebudowanie oznaczało wszystkie
 * 39 adresów jako zmodyfikowane, nawet gdy nic się nie zmieniło.
 *
 * Teraz data pochodzi z modyfikacji plików źródłowych, z których zbudowana
 * jest dana strona. Przebudowanie bez zmian w treści nie rusza `lastmod`.
 *
 * Uwaga o ziarnistości: strony, które biorą treść z tego samego pliku
 * (`src/content/pages.ts` zawiera wszystkie sekcje poza produktami), mają
 * wspólną datę. Żeby ją rozdzielić, trzeba rozbić `pages.ts` na osobne
 * pliki per sekcja.
 */
import { statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Pliki współdzielone przez wszystkie trasy. */
const SHARED = ['src/content/company.ts', 'src/i18n/ui.ts', 'src/i18n/index.ts'];

/**
 * Pliki z treścią dla każdej grupy tras. Kolejność musi odpowiadać
 * kolejności grup w `src/content/routes-map.json` (indeks = numer grupy).
 * Niezgodność długości listy jest błędem buildu, nie cichym pominięciem.
 */
const GROUP_SOURCES = [
  // 0 — strona główna
  ['src/content/pages.ts'],
  // 1 — katalog produktów
  ['src/content/pages.ts', 'src/content/products.ts', 'src/content/pricing.ts'],
  // 2–5 — strony produktów
  ['src/content/products.ts', 'src/content/pricing.ts', 'src/content/technical.ts'],
  ['src/content/products.ts', 'src/content/pricing.ts', 'src/content/technical.ts'],
  ['src/content/products.ts', 'src/content/pricing.ts', 'src/content/technical.ts'],
  ['src/content/products.ts', 'src/content/pricing.ts', 'src/content/technical.ts'],
  // 6 — galeria
  ['src/content/pages.ts'],
  // 7 — o nas
  ['src/content/pages.ts'],
  // 8 — cennik i wycena
  ['src/content/pages.ts', 'src/content/pricing.ts', 'src/content/terms.ts'],
  // 9 — kontakt
  ['src/content/pages.ts'],
  // 10 — współpraca hurtowa
  ['src/content/pages.ts'],
  // 11 — dostawa
  ['src/content/pages.ts', 'src/content/terms.ts'],
  // 12 — polityka prywatności
  ['src/content/pages.ts'],
];

function modifiedAt(relativePath) {
  const absolute = path.join(ROOT, relativePath);
  try {
    return statSync(absolute).mtime;
  } catch {
    // Plik nie istnieje — nie blokujemy buildu, tylko go pomijamy.
    return null;
  }
}

/**
 * Data w lokalnym kalendarzu, nie w UTC.
 *
 * `toISOString()` przesuwa znacznik o kilka godzin do tyłu: plik zmieniony
 * o 00:30 w CEST to 22:30 UTC z dnia poprzedniego, więc `lastmod` wypadał
 * o jeden dzień wcześniej. Google porównuje daty jako dni, więc liczy się
 * data lokalna, w której ktoś naprawdę edytował plik.
 */
function localDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Buduje mapę `ścieżka → data modyfikacji (YYYY-MM-DD)`.
 * @param {Array<Array<string>>} groups grupy tras z `routes-map.json`
 */
export function createLastmod(groups) {
  if (groups.length !== GROUP_SOURCES.length) {
    throw new Error(
      `routes-map.json ma ${groups.length} grup tras, a _tools/lastmod.mjs zna ${GROUP_SOURCES.length}. ` +
        'Uzupełnij GROUP_SOURCES albo popraw mapę tras.',
    );
  }

  /** Ścieżka → data. */
  const map = new Map();

  groups.forEach((group, index) => {
    const sources = [...SHARED, ...GROUP_SOURCES[index]];
    let newest = null;
    for (const source of sources) {
      const mtime = modifiedAt(source);
      if (mtime && (!newest || mtime > newest)) newest = mtime;
    }
    const value = newest ? localDate(newest) : undefined;
    for (const route of group) map.set(route, value);
  });

  return map;
}
