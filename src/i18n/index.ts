/**
 * i18n — trzy języki, polski domyślny.
 *
 * EN + DE są wersjami równorzędnymi (nie tłumaczeniami automatycznymi):
 * klient sprzedaje dąb w Polsce, ale trafia do odbiorców w UE, więc EN/DE
 * mają własne słowo kluczowe, własne slugi URL i własne tytuły SEO.
 */

export const locales = ['pl', 'en', 'de'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'pl';

export interface LocaleInfo {
  /** Nazwa języka w nawigacji (po polsku, bo dekorator jest polski). */
  navLabel: string;
  /** Pełna nazwa języka. */
  name: string;
  /** Flaga jako emoji — ma być widoczna, nie ukryta w menu. */
  flag: string;
  htmlLang: string;
  ogLocale: string;
  /** Sufiks hreflang / prefiks URL dla wersji przetłumaczonych. */
  prefix: string;
}

export const localeInfo: Record<Locale, LocaleInfo> = {
  pl: {
    navLabel: 'Polski',
    name: 'Polski',
    flag: '🇵🇱',
    htmlLang: 'pl-PL',
    ogLocale: 'pl_PL',
    prefix: '',
  },
  en: {
    navLabel: 'English',
    name: 'English',
    flag: '🇬🇧',
    htmlLang: 'en',
    ogLocale: 'en_GB',
    prefix: '/en',
  },
  de: {
    navLabel: 'Deutsch',
    name: 'Deutsch',
    flag: '🇩🇪',
    htmlLang: 'de',
    ogLocale: 'de_DE',
    prefix: '/de',
  },
};

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** Ścieżki w poszczególnych językach. Klucz → lokalizowana ścieżka. */
export const routes = {
  home: { pl: '/', en: '/en/', de: '/de/' },
  catalog: { pl: '/produkty/', en: '/en/products/', de: '/de/produkte/' },
  about: { pl: '/o-nas/', en: '/en/about/', de: '/de/ueber-uns/' },
  gallery: { pl: '/realizacje/', en: '/en/gallery/', de: '/de/galerie/' },
  quote: { pl: '/cennik/', en: '/en/price-list/', de: '/de/preisliste/' },
  contact: { pl: '/kontakt/', en: '/en/contact/', de: '/de/kontakt/' },
  trade: { pl: '/dla-firm/', en: '/en/for-trade/', de: '/de/fuer-handwerk/' },
  delivery: { pl: '/dostawa/', en: '/en/delivery/', de: '/de/lieferung/' },
  privacy: { pl: '/polityka-prywatnosci/', en: '/en/privacy-policy/', de: '/de/datenschutz/' },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof routes;

export function pathFor(locale: Locale, key: RouteKey): string {
  return routes[key][locale];
}

/** Ścieżka produktu w danym języku (slugi są przetłumaczone, nie transliterowane). */
export function productPath(locale: Locale, slug: string): string {
  const base = pathFor(locale, 'catalog');
  return `${base}${slug}/`;
}

/**
 * Link do formularza wyceny.
 *
 * KAŻDY CTA, które zaprasza do poproszenia o wycenę, idzie z kotwicą
 * `#quote-form`. Bez niej użytkownik ląduje na nagłówku strony cenowej i
 * musi formularz jeszcze poszukać — a to jest najczęstszy powód porzucenia
 * zapytania. `query` wchodzi PRZED kotwicą (`?produkt=…#quote-form`).
 *
 * W nawigacji i w stopce zostaje `pathFor(locale, 'quote')` — tam link ma
 * sens strony, nie formularza.
 */
export function quoteHref(locale: Locale, query = ''): string {
  return `${pathFor(locale, 'quote')}${query}#quote-form`;
}

/**
 * Link do formularza na stronie innej niż cennik.
 *
 * `/dla-firm/` ma własny formularz (z polem NIP), więc CTA „Zapytaj o
 * wycenę" z katalogu musi trafić tam, a nie do ogólnego formularza cenowego.
 */
export function formHref(locale: Locale, route: RouteKey, query = ''): string {
  return `${pathFor(locale, route)}${query}#quote-form`;
}

/** Buduje link do tej samej strony w innym języku. */
export function switchLocalePath(currentLocale: Locale, targetLocale: Locale, currentPath: string): string {
  if (currentLocale === targetLocale) return currentPath;
  // Usuwamy prefiks języka źródłowego, by dostać ścieżkę bazową.
  const srcPrefix = localeInfo[currentLocale].prefix;
  const bare = srcPrefix && currentPath.startsWith(srcPrefix)
    ? currentPath.slice(srcPrefix.length)
    : currentPath;
  const targetPrefix = localeInfo[targetLocale].prefix;
  const normalized = bare.startsWith('/') ? bare : `/${bare}`;
  return `${targetPrefix}${normalized}` || '/';
}
