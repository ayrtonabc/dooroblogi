import type { L } from './products';
import type { Locale } from '../i18n';

/**
 * Blok definicji i danych kluczowych — dla GEO i AEO.
 *
 * Dlaczego to osobny plik: to jest jedyny fragment strony, którego zadaniem
 * jest być **wydobyty** przez asystenta (ChatGPT, Perplexity, Gemini,
 * Claude, Copilot) albo wycięty w featured snippet. Dlatego:
 *   • definicja zaczyna się od nazwy produktu i mieści się w 1–2 zdaniach,
 *   • jest wersja jednozdaniowa (`oneLiner`) do cytowania w całości,
 *   • dane kluczowe są w tabeli etykieta → wartość (nie w prozie),
 *   • każdy wiersz ma `source`: skąd wiadomo, że wartość jest prawdziwa,
 *   • nie ma tu marketingu — tylko rzeczy, które da się sprawdzić.
 *
 * SERP — sprawdzone 26.10.2026:
 *   • Google Suggest (`suggestqueries.google.com`, hl=pl/gl=pl) na
 *     „obłóg dębowy" z rozwinięciem a–z: 31 podpowiedzi. Przeważa
 *     GRUBOŚĆ (2–10 mm), potem „2mm cena", „4mm cena", „co to jest",
 *     „co to", „do czego służy", „na schody", „na ścianę", „naturalny",
 *     „rustykalny", „albo", „olx" i miasta („białystok", „warszawa").
 *     → Pytania o GRUBOŚĆ i CENĘ są realne; pytanie o PRODUKCENTA też
 *     („obłogi dębowe producent"). Definicja i dane kluczowe muszą więc
 *     odpowiadać na „co to jest" i „co dostanę", nie hasłowo.
 *   • SERP (DuckDuckGo HTML) na „obłóg dębowy" / „obłogi dębowe":
 *     Allegro i OLX zajmują 4 z 10 miejsc (marketplace z ceną). Dalej
 *     oblogi24.pl (ficha z GRUBOŚCIĄ W TYTULE: „Obłogi 4 mm - DĄB -
 *     Natur"), oblogi.pl (producent: „Produkujemy w grubości 4 mm, inne
 *     są na zamówienie", „cięte a nie skrawane"), oblogi.pl/oblogi-dab-ceny/
 *     (TABELA CEN wg wymiaru, klasy Natur / Rustic / Pozaklasa),
 *     stol-dom.pl (zastosowania: stopnie schodowych, blatów, formatek
 *     meblowych) i olgawood.pl (mały producent z adresem i NIP).
 *     → Wspólny wzorzec: **konkretne wymiary i zastosowania w treści,
 *     nie ogólniki**. My nie publikujemy cen, więc wygrywamy opisem
 *     materiału, wymiarów pod zamówienie i zastosowań.
 *   • „obłóg dębowy cena": SERP jest w całości cenowa (Allegro, OLX,
 *     Sprzedajemy, tabela cen oblogi.pl, PDF cennika stol-dom.pl). Tej
 *     głowy nie da się wygrać bez publikowania cennika — dlatego strona
 *     /cennik/ pracuje na wariantach „wycena" i „cennik na zapytanie".
 *   • Wikipedia: **nie ma** artykułu „obłóg dębowy" (pl) ani „oak trim
 *     batten" (en). Nie ma więc strony referencyjnej, którą można
 *     cytować — tą rolę gra ten blok.
 *   • EN (hl=en, gl=us i gl=gb): „oak trim battens" → 0 podpowiedzi;
 *     „oak battens" → 10, z „oak battens uk" na czele; „oak cladding
 *     battens" → 3 (nasz język: „cladding battens size"); rynek EN
 *     miesza retail UK (B&Q, Screwfix, Wickes) z naszą niszą.
 *   • DE (hl=de, gl=de): „Eichenleiste" → 9 (m.in. „nach Maß",
 *     „massiv", „hornbach", „kaufen"); „Eichenlamellen wand",
 *     „vertikale Eichenlamellen", „Eichen Paneele wand/decke";
 *     „geräucherte Eiche" → 10, ale głównie podłoga i meble.
 *     Uwaga: poprawna forma „na wymiar" po niemiecku to **nach Maß**,
 *     nie „auf Maß" (0 podpowiedzi).
 */

/**
 * Nazwa pojęcia, którą definiujemy. To jest `name` w `DefinedTerm`
 * i kotwica do sekcji w `llms.txt`.
 */
const term = {
  pl: 'Obłóg dębowy',
  en: 'Oak trim batten',
  de: 'Eichen-Abschlussleiste',
} satisfies L;

/**
 * Jedno zdanie. To jest wersja, którą asystent może przytoczyć w całości
 * bez skracania — dlatego jest samodzielna i nie zawiera żadnego
 * „innowacyjnego" ani „premium".
 *
 * UWAGA: to jest JEDYNA definicja w projekcie. `lead` składa się z tego
 * zdania plus zdania o zastosowaniu, `llms.txt` cytuje to samo, a
 * `DefinedTerm` w JSON-LD bierze to samo. Trzy różne definicje w trzech
 * miejscach to trzy różne odpowiedzi dla asystenta — i jedna z nich
 * zawsze jest zła.
 */
const oneLiner = {
  pl: 'Obłóg dębowy to listwa wykończeniowa z naturalnego dębu, cięta na wymiar pod konkretny profil, długość i przekrój.',
  en: 'An oak trim batten is a finish board made of natural oak, cut to size to a given profile, length and section.',
  de: 'Eine Eichen-Abschlussleiste ist ein Abschlussbrett aus natürlicher Eiche, auf Maß nach Profil, Länge und Querschnitt geschnitten.',
} satisfies L;

/**
 * Drugie zdanie definicji: gdzie ten materiał widać z bliska.
 * Nie jest to osobna definicja — tylko uzupełnienie `oneLiner`.
 */
const application = {
  pl: 'Montuje się ją tam, gdzie drewno jest widoczne z bliska: przy podłodze, na ścianie, wokół okna i w ramie drzwi przesuwnych.',
  en: 'It goes where the wood is seen up close: at floor level, on a wall, around a window and inside a sliding door frame.',
  de: 'Sie kommt dorthin, wo das Holz aus der Nähe gesehen wird: am Boden, an der Wand, um das Fenster und in den Schiebetürrahmen.',
} satisfies L;

/**
 * Definicja podzielona na trzy części, żeby można było oznaczyć sam termin
 * znacznikiem `<dfn>` (to, co szukają wyszukiwarki i asystenci) bez
 * powtarzania słowa w tekście.
 *
 * `oneLiner` zaczyna się od nazwy pojęcia, ale nie zawsze od niej *zaczyna
 * się* zdanie: po polsku „Obłóg dębowy to listwa…", po angielsku „An oak
 * trim batten is a finish board…", po niemiecku „Eine Eichen-Abschlussleiste
 * ist…". Dlatego szukamy terminu w zdaniu (bez rozróżniania wielkości
 * liter) i dzielimy zdanie w tym miejscu.
 */
export interface DefinitionParts {
  /** Część przed terminem — np. „An ", „Eine ". */
  before: string;
  /** Sam termin, tak jak stoi w zdaniu. */
  term: string;
  /** Reszta zdania. */
  after: string;
}

export function definitionParts(locale: Locale): DefinitionParts {
  const sentence = oneLiner[locale];
  const needle = term[locale];
  const index = sentence.toLocaleLowerCase(locale).indexOf(needle.toLocaleLowerCase(locale));
  if (index === -1) {
    // Nie powinno się zdarzyć — ale gdyby jednak, zwracamy całe zdanie
    // jako „after", żeby nic nie zniknęło z HTML.
    return { before: '', term: '', after: sentence };
  }
  return {
    before: sentence.slice(0, index),
    term: sentence.slice(index, index + needle.length),
    after: sentence.slice(index + needle.length),
  };
}

/** Nagłówek sekcji. */
export const definition = {
  kicker: {
    pl: 'Co to jest obłóg dębowy',
    en: 'What is an oak trim batten',
    de: 'Was ist eine Eichen-Abschlussleiste',
  } satisfies L,

  title: {
    pl: 'Obłóg dębowy — definicja i parametry',
    en: 'Oak trim battens — definition and specification',
    de: 'Eichen-Abschlussleisten — Definition und Spezifikation',
  } satisfies L,

  term,
  oneLiner,
  application,

  /**
   * Definicja w dwóch zdaniach — to, co widać na stronie. Składa się
   * z `oneLiner` + `application`, żeby definicja w HTML, w `llms.txt` i
   * w JSON-LD była ta sama.
   */
  lead: {
    pl: `${oneLiner.pl} ${application.pl}`,
    en: `${oneLiner.en} ${application.en}`,
    de: `${oneLiner.de} ${application.de}`,
  } satisfies L,

  /** Podtytuł pod definicją — jedno zdanie o tym, co z tego wynika. */
  note: {
    pl: 'Ten sam materiał wchodzi w skład lameli 4–8 mm oraz gotowych paneli sufitowych i ściennych.',
    en: 'The same material goes into 4–8 mm battens and into ready-made ceiling and wall panels.',
    de: 'Dasselbe Material steckt in 4–8-mm-Lamellen und in fertigen Decken- und Wandpaneelen.',
  } satisfies L,

  /**
   * Adres strony, na której ten blok jest publikowany. Pomocne dla
   * asystenta, który musi podać źródło cytatu.
   */
  source: {
    pl: 'https://doors-oblogi.pl/',
    en: 'https://doors-oblogi.pl/en/',
    de: 'https://doors-oblogi.pl/de/',
  } satisfies L,
} as const;

/** Bloque temático al que pertenece un dato. */
export type DefinitionFactGroup = 'material' | 'wymiary' | 'dostawa';

/**
 * Títulos de los tres bloques. Se muestran SIEMPRE en este orden y agrupan
 * los trece datos. Sin ellos la lista era una tabla de trece filas que no
 * se podía escanear.
 */
export const definitionGroups: { id: DefinitionFactGroup; title: L }[] = [
  {
    id: 'material',
    title: {
      pl: 'Materiał i obróbka',
      en: 'Material and finish',
      de: 'Material und Bearbeitung',
    },
  },
  {
    id: 'wymiary',
    title: {
      pl: 'Wymiary i montaż',
      en: 'Dimensions and fitting',
      de: 'Maße und Montage',
    },
  },
  {
    id: 'dostawa',
    title: {
      pl: 'Dostawa i wycena',
      en: 'Delivery and pricing',
      de: 'Lieferung und Preis',
    },
  },
];

/** Wiersz tabeli „dane kluczowe". */
export interface DefinitionFact {
  label: L;
  value: L;
  /** Bloque al que pertenece (ver `definitionGroups`). */
  group: DefinitionFactGroup;
  /**
   * Skąd wiadomo, że wartość jest prawdziwa. Trzy poziomy:
   *   • `oferta`  — parametry produktu (src/content/products.ts)
   *   • `terms`  — warunki współpracy potwierdzone przez klienta
   *                (src/content/terms.ts, wiersze z `confirmed: true`)
   *   • `poduszka`— fakt ogólny o warsztacie lub rynku
   */
  source: 'oferta' | 'terms' | 'poduszka';
}

/**
 * Tabela danych kluczowych. Każda wartość jest potwierdzalna:
 * materiał, wymiary, selekcja i wykończenia wynikają z oferty,
 * a cena i dostawa z zasad, które klient już komunikuje.
 */
export const definitionFacts: DefinitionFact[] = [
  {
    label: { pl: 'Materiał', en: 'Material', de: 'Material' },
    value: {
      pl: '100% naturalny dąb, bez farbowania i cieniowania',
      en: '100% natural oak, no staining and no toning',
      de: '100 % natürliche Eiche, nicht eingefärbt und nicht getönt',
    },
    source: 'oferta',
    group: 'material',
  },
  {
    label: { pl: 'Zastosowanie', en: 'Application', de: 'Anwendung' },
    value: {
      pl: 'Wykończenie podłóg, ścian, zabudowy meblowej, framug i okien',
      en: 'Finishing floors, walls, fitted furniture, door frames and windows',
      de: 'Abschluss von Böden, Wänden, Möbeln, Zargen und Fenstern',
    },
    source: 'oferta',
    group: 'wymiary',
  },
  {
    label: { pl: 'Miejsce montażu', en: 'Where it is fitted', de: 'Montageort' },
    value: {
      pl: 'Przy podłodze, na ścianie, wokół okna, w ramie drzwi przesuwnych',
      en: 'At floor level, on a wall, around a window, in a sliding door frame',
      de: 'Am Boden, an der Wand, um das Fenster, im Schiebetürrahmen',
    },
    source: 'oferta',
    group: 'wymiary',
  },
  {
    label: { pl: 'Grubość lameli', en: 'Batten thickness', de: 'Lamellenstärke' },
    value: {
      pl: '4 mm albo 8 mm',
      en: '4 mm or 8 mm',
      de: '4 mm oder 8 mm',
    },
    source: 'oferta',
    group: 'material',
  },
  {
    label: { pl: 'Długość i przekrój', en: 'Length and section', de: 'Länge und Querschnitt' },
    value: {
      pl: 'Na wymiar — wg zamówienia',
      en: 'Cut to order',
      de: 'Auf Maß — nach Bestellung',
    },
    source: 'oferta',
    group: 'wymiary',
  },
  {
    label: { pl: 'Profil', en: 'Profile', de: 'Profil' },
    value: {
      pl: 'Prosty, piętro-wpust lub do uzgodnienia',
      en: 'Plain, tongue and groove, or to be agreed',
      de: 'Einfach, Nut und Feder oder nach Absprache',
    },
    source: 'oferta',
    group: 'wymiary',
  },
  {
    label: { pl: 'Selekcja drewna', en: 'Wood selection', de: 'Holzselektion' },
    value: {
      pl: 'Bez sęków / z sękami',
      en: 'Knot-free / with knots',
      de: 'Ohne Äste / mit Ästen',
    },
    source: 'oferta',
    group: 'material',
  },
  {
    label: { pl: 'Wykończenia', en: 'Finishes', de: 'Oberflächen' },
    value: {
      pl: 'Naturalne, szczotkowane, wędzone',
      en: 'Natural, brushed, smoked',
      de: 'Natur, gebürstet, geräuchert',
    },
    source: 'oferta',
    group: 'material',
  },
  {
    label: { pl: 'Jednostka sprzedaży', en: 'Sales unit', de: 'Verkaufseinheit' },
    value: {
      pl: 'Metr bieżący (mb); panele w m² lub w sztukach',
      en: 'Linear metre; panels per m² or per piece',
      de: 'Laufender Meter; Paneele je m² oder je Stück',
    },
    source: 'oferta',
    group: 'dostawa',
  },
  {
    label: { pl: 'Dostawa', en: 'Delivery', de: 'Lieferung' },
    value: {
      pl: 'Kurierem w całej Polsce; poza Polską wycena indywidualnie',
      en: 'By courier within Poland; outside Poland quoted individually',
      de: 'Per Kurier in ganz Polen; außerhalb einzeln kalkuliert',
    },
    source: 'terms',
    group: 'dostawa',
  },
  {
    label: { pl: 'Termin realizacji', en: 'Lead time', de: 'Lieferzeit' },
    value: {
      pl: 'Podajemy w wycenie, po potwierdzeniu wymiarów',
      en: 'We state it in the quote, after dimension confirmation',
      de: 'Wir nennen sie im Angebot, nach Bestätigung der Maße',
    },
    source: 'terms',
    group: 'dostawa',
  },
  {
    label: { pl: 'Produkcja', en: 'Production', de: 'Fertigung' },
    value: {
      pl: 'Słonecznik k. Olsztyna, województwo warmińsko-mazurskie',
      en: 'Słonecznik near Olsztyn, Warmian-Masurian Voivodeship',
      de: 'Słonecznik bei Olsztyn, Ermland-Masuren',
    },
    source: 'poduszka',
    group: 'material',
  },
  {
    label: { pl: 'Ceny', en: 'Prices', de: 'Preise' },
    value: {
      pl: 'Na zapytanie — wycenę wysyłamy pisemnie',
      en: 'On request — we send the quote in writing',
      de: 'Auf Anfrage — Angebot schriftlich',
    },
    source: 'terms',
    group: 'dostawa',
  },
];
