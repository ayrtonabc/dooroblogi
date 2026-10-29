import type { L } from './products';

/**
 * Jednostki sprzedaży i czynniki wyceny.
 *
 * KLIENT NIE PUBLIKUJE CEN — cennik wysyłamy na zapytanie. Dlatego ten
 * plik NIE zawiera żadnych kwot. Zawiera natomiast:
 *   • jednostkę sprzedaży (mb / m² / szt.),
 *   • czynniki, od których zależy cena,
 *   • co obejmuje wycena pisemna (bez ceny — same warunki),
 *   • pusty slot `published`, w którym klient wstawi kwoty, gdy zdecyduje
 *     się opublikować cennik.
 *
 * Gdy `published` jest ustawione, interfejs sam pokazuje kwotę zamiast
 * wezwania do kontaktu, a schema.org dostaje `price`. Nic więcej nie trzeba
 * zmieniać w kodzie strony.
 *
 * REGLA (ESTRATEGIA §5.0): cena się nie mówi i nie sugeruje. Ten plik
 * odpowiada na pytanie „co dokładnie dostanę za to, o co pytam" — na
 * jednostkę, na czynniki i na zakres wyceny pisemnej.
 *
 * TODO(SEO Grow / klient): minimalne zamówienie, termin płatności, forma
 * rozliczenia, próbka, tolerancje — patrz `src/content/terms.ts` i lista
 * `pendingClientData` w `src/content/funnel.ts`.
 */

export interface PriceEntry {
  /** Jednostka sprzedaży — etykieta dla użytkownika. */
  unit: L;
  /** Kod jednostki wg UN/CEFACT (używany w schema.org). */
  unitCode: string;
  /** Od czego zależy cena. */
  factors: L;
  /**
   * Co obejmuje wycena przy tym produkcie — bez kwoty. Opis przedmiotu
   * sprzedaży, nie obietnica handlowa.
   */
  includes: L;
  /**
   * Opublikowany cennik — do czasu wypełnienia `null`.
   * Uzupełnia klient, np. { min: 0, max: 0, currency: 'PLN' }.
   */
  published: {
    min: number;
    max: number;
    currency: string;
  } | null;
}

export const pricing: Record<string, PriceEntry> = {
  'oblog-debowy-ciety': {
    unit: {
      pl: 'mb (metr bieżący)',
      en: 'linear metre',
      de: 'lfm (laufender Meter)',
    },
    unitCode: 'MTR',
    factors: {
      pl: 'długość, przekrój, profil, ilość, selekcja drewna (bez sęków / z sękami)',
      en: 'length, section, profile, quantity, wood selection (knot-free / with knots)',
      de: 'Länge, Querschnitt, Profil, Menge, Holzselektion (ohne Äste / mit Ästen)',
    },
    includes: {
      pl: 'Element przygotowany na wymiar: długość, przekrój i profil wg zamówienia. Rozliczany w metrach bieżących.',
      en: 'A piece prepared to size: length, section and profile as ordered. Charged per linear metre.',
      de: 'Ein auf Maß gefertigtes Stück: Länge, Querschnitt und Profil nach Bestellung. Abrechnung je laufender Meter.',
    },
    published: null,
  },
  'oblog-debowy-wedzony': {
    unit: {
      pl: 'mb (metr bieżący)',
      en: 'linear metre',
      de: 'lfm (laufender Meter)',
    },
    unitCode: 'MTR',
    factors: {
      pl: 'długość, przekrój, profil, ilość, stopień wędzenia',
      en: 'length, section, profile, quantity, depth of smoking',
      de: 'Länge, Querschnitt, Profil, Menge, Rauchtiefe',
    },
    includes: {
      pl: 'Element przygotowany na wymiar i wędzony w naszej pracowni. Rozliczany w metrach bieżących.',
      en: 'A piece prepared to size and smoked in our own workshop. Charged per linear metre.',
      de: 'Ein auf Maß gefertigtes und in unserer Werkstatt geräuchertes Stück. Abrechnung je laufender Meter.',
    },
    published: null,
  },
  'lamela-debowa': {
    unit: {
      pl: 'mb (metr bieżący) albo szt. (element)',
      en: 'linear metre or piece',
      de: 'lfm oder Stück',
    },
    unitCode: 'MTR',
    factors: {
      pl: 'grubość (4 / 8 mm), długość, profil, ilość',
      en: 'thickness (4 / 8 mm), length, profile, quantity',
      de: 'Stärke (4 / 8 mm), Länge, Profil, Menge',
    },
    includes: {
      pl: 'Element przygotowany na wymiar, grubość 4 albo 8 mm. Rozliczany w metrach bieżących albo w sztukach.',
      en: 'A piece prepared to size, 4 or 8 mm thick. Charged per linear metre or per piece.',
      de: 'Ein auf Maß gefertigtes Stück, 4 oder 8 mm stark. Abrechnung je laufender Meter oder Stück.',
    },
    published: null,
  },
  'panele-dabowe': {
    unit: {
      pl: 'm² (metr kwadratowy) albo szt. (moduł)',
      en: 'm² or module',
      de: 'm² oder Modul',
    },
    unitCode: 'MTK',
    factors: {
      pl: 'format modułu, wykończenie, ilość',
      en: 'module size, finish, quantity',
      de: 'Modulformat, Oberfläche, Menge',
    },
    includes: {
      pl: 'Gotowy moduł z dębowych profili, do montażu bez docinania. Rozliczany w m² albo w sztukach.',
      en: 'A ready module made from oak profiles, installed without cutting on site. Charged per m² or per piece.',
      de: 'Ein fertiges Modul aus Eichenprofilen, montagefertig ohne Nachschnitt. Abrechnung je m² oder Stück.',
    },
    published: null,
  },
};

/**
 * Co obejmuje wycena pisemna — to, co klient dostaje w odpowiedzi.
 * Lista warunków, nie lista kwot.
 */
export const quoteIncludes: L = {
  pl: 'Cenę za jednostkę sprzedaży, termin realizacji, warunki dostawy i formę rozliczenia.',
  en: 'The price per sales unit, the lead time, the delivery terms and the settlement method.',
  de: 'Den Preis je Verkaufseinheit, die Lieferzeit, die Lieferbedingungen und die Abrechnungsart.',
};

/**
 * Jak liczymy cenę — dlaczego jej nie ma na stronie.
 */
export const priceFlow: {
  kicker: L;
  title: L;
  lead: L;
  steps: { title: L; text: L }[];
} = {
  kicker: {
    pl: 'Jak liczymy cenę',
    en: 'How we price',
    de: 'So kalkulieren wir',
  },
  title: {
    pl: 'Cena zależy od profilu, długości i ilości',
    en: 'The price depends on profile, length and quantity',
    de: 'Der Preis hängt von Profil, Länge und Menge ab',
  },
  lead: {
    pl: 'Nie publikujemy cen, bo przy obłogach jeden profil w czterech długościach to cztery różne wyceny. Zamiast tabelki z złotówkami dostajesz wycenę pisemną: cena, termin i ilość, która wchodzi w dostawę.',
    en: 'We do not publish prices, because one profile in four lengths is four different quotes. Instead of a table with zlotys you get a written quote: the price, the lead time and the quantity that goes into the delivery.',
    de: 'Wir veröffentlichen keine Preise, weil ein Profil in vier Längen vier verschiedene Angebote sind. Statt einer Tabelle mit Złoty bekommen Sie ein schriftliches Angebot: Preis, Lieferzeit und die Menge, die in die Lieferung geht.',
  },
  steps: [
    {
      title: {
        pl: 'Podaj profil i wymiary',
        en: 'Give the profile and the dimensions',
        de: 'Profil und Maße angeben',
      },
      text: {
        pl: 'Długość, przekrój, ilość. Przy lamelach dodatkowo 4 albo 8 mm.',
        en: 'Length, section, quantity. For battens, 4 or 8 mm as well.',
        de: 'Länge, Querschnitt, Menge. Bei Lamellen zusätzlich 4 oder 8 mm.',
      },
    },
    {
      title: {
        pl: 'Otrzymujesz wycenę pisemną',
        en: 'You get a written quote',
        de: 'Sie erhalten ein schriftliches Angebot',
      },
      text: {
        pl: 'Cena za jednostkę sprzedaży, termin realizacji i warunki dostawy.',
        en: 'Price per sales unit, lead time and delivery terms.',
        de: 'Preis je Verkaufseinheit, Lieferzeit und Lieferbedingungen.',
      },
    },
    {
      title: {
        pl: 'Potwierdzasz pisemnie',
        en: 'You confirm in writing',
        de: 'Sie bestätigen schriftlich',
      },
      text: {
        pl: 'Cena obowiązuje na konkretną partię drewna i konkretny termin.',
        en: 'The price applies to a specific batch of timber and a specific date.',
        de: 'Der Preis gilt für eine konkrete Holzcharge und einen konkreten Termin.',
      },
    },
  ],
};
