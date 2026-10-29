import type { L } from './products';

/**
 * Warunki współpracy — blok, który klient widzi na /cennik/ i przy każdym produkcie.
 *
 * KLIENT NIE POTWIERDZIŁ jeszcze: minimalnego zamówienia, formy płatności,
 * terminu płatności, próbek ani tolerancji. dlatego każda wartość, która
 * nie jest potwierdzonym faktem, brzmi „potwierdzamy w wycenie" — a nie
 * zawiera zmyślonej liczby. Gdy klient potwierdzi warunki, wystarczy
 * podmienić tekst w tym pliku; układ strony się nie zmienia.
 *
 * REGLA (ESTRATEGIA §5.0): cena się nie mówi i nie sugeruje. Tabela
 * odpowiada na pytania o ZAKUP (minimalne zamówienie, termin, dokumenty,
 * dostawa, próbka), a nie na pytanie „ile to kosztuje".
 *
 * TODO(SEO Grow / klient): patrz `pendingClientData` w `src/content/funnel.ts`.
 */

export interface TermRow {
  label: L;
  value: L;
  /** Czy wartość jest już potwierdzona, czy czeka na potwierdzenie. */
  confirmed: boolean;
}

export const terms: {
  kicker: L;
  title: L;
  lead: L;
  rows: TermRow[];
} = {
  kicker: {
    pl: 'Warunki',
    en: 'Terms',
    de: 'Bedingungen',
  },
  title: {
    pl: 'Co potwierdzamy w wycenie',
    en: 'What we confirm in the quote',
    de: 'Was wir im Angebot bestätigen',
  },
  lead: {
    pl: 'Ceny nie publikujemy, bo zależą od profilu, długości i ilości. Za każdym razem dostajesz wycenę z terminem realizacji — na piśmie, z konkretnymi wartościami.',
    en: 'We do not publish prices, because they depend on profile, length and quantity. Every time you get a quote with a lead time — in writing, with the actual numbers.',
    de: 'Wir veröffentlichen keine Preise, weil sie von Profil, Länge und Menge abhängen. Sie erhalten jedes Mal ein Angebot mit Lieferzeit — schriftlich, mit konkreten Werten.',
  },
  rows: [
    {
      label: {
        pl: 'Minimalne zamówienie',
        en: 'Minimum order',
        de: 'Mindestbestellmenge',
      },
      value: {
        pl: 'Ustalane w wycenie — zależy od profilu i długości.',
        en: 'Set in the quote — it depends on the profile and the length.',
        de: 'Wird im Angebot festgelegt — hängt von Profil und Länge ab.',
      },
      confirmed: false,
    },
    {
      label: {
        pl: 'Termin realizacji',
        en: 'Lead time',
        de: 'Lieferzeit',
      },
      value: {
        pl: 'Zależy od profilu, długości i ilości.',
        en: 'Depends on the profile, the length and the quantity.',
        de: 'Hängt von Profil, Länge und Menge ab.',
      },
      confirmed: false,
    },
    {
      label: {
        pl: 'Forma płatności',
        en: 'Payment',
        de: 'Zahlung',
      },
      value: {
        pl: 'Ustalana w wycenie — przelew albo faktura.',
        en: 'Set in the quote — bank transfer or invoice.',
        de: 'Wird im Angebot festgelegt — Überweisung oder Rechnung.',
      },
      confirmed: false,
    },
    {
      label: {
        pl: 'Dostawa i opakowanie',
        en: 'Delivery and packaging',
        de: 'Lieferung und Verpackung',
      },
      value: {
        pl: 'Kurierem na terenie całej Polski, opakowanie dobieramy do zamówienia. Poza Polską — wycena indywidualnie.',
        en: 'By courier across Poland, packaging matched to the order. Outside Poland — quoted individually.',
        de: 'Per Kurier in ganz Polen, Verpackung passend zur Bestellung. Außerhalb Polens — Angebot auf Anfrage.',
      },
      confirmed: true,
    },
    {
      label: {
        pl: 'Próbka profilu',
        en: 'Sample profile',
        de: 'Musterprofil',
      },
      value: {
        pl: 'Dostępność i koszt wysyłki potwierdzamy w wycenie.',
        en: 'Availability and shipping cost are confirmed in the quote.',
        de: 'Verfügbarkeit und Versandkosten bestätigen wir im Angebot.',
      },
      confirmed: false,
    },
    {
      label: {
        pl: 'Tolerancje wymiarowe',
        en: 'Dimensional tolerances',
        de: 'Maßtoleranzen',
      },
      value: {
        pl: 'Podajemy je w wycenie dla konkretnego profilu.',
        en: 'We state them in the quote for the specific profile.',
        de: 'Wir nennen sie im Angebot für das konkrekte Profil.',
      },
      confirmed: false,
    },
    {
      label: {
        pl: 'Zakres wyceny',
        en: 'What the quote covers',
        de: 'Umfang des Angebots',
      },
      value: {
        pl: 'Cenę za jednostkę sprzedaży, termin realizacji, warunki dostawy i formę rozliczenia.',
        en: 'The price per sales unit, the lead time, the delivery terms and the settlement method.',
        de: 'Den Preis je Verkaufseinheit, die Lieferzeit, die Lieferbedingungen und die Abrechnungsart.',
      },
      confirmed: true,
    },
    {
      label: {
        pl: 'Dokumenty rozliczeniowe',
        en: 'Invoicing',
        de: 'Rechnungsstellung',
      },
      value: {
        pl: 'Faktura albo przelew — formę rozliczenia i termin płatności potwierdzamy w wycenie.',
        en: 'Invoice or bank transfer — we confirm the settlement method and the payment term in the quote.',
        de: 'Rechnung oder Überweisung — Abrechnungsart und Zahlungsziel bestätigen wir im Angebot.',
      },
      confirmed: false,
    },
  ],
};

/**
 * Podsumowanie warunków dla karty produktu.
 *
 * Pełna tabela ośmiu pozycji (`terms.rows`) zostaje tam, gdzie hace falta:
 * na /dostawa/, /kontakt/ y /dla-firm/. En la ficha de producto bastan
 * cinco filas: el cliente lee parámetros, no un reglamento.
 *
 * Los valores son los mismos hechos que ya estaban confirmados en
 * `terms.rows` — ni uno más. Lo que no está confirmado (cantidad mínima,
 * tolerancias, disponibilidad) se dice aquí como lo que es: se confirma
 * en la oferta.
 */
export const orderSummary: {
  kicker: L;
  title: L;
  /**
   * Filas con icono: la banda «Co potwierdzamy w wycenie» se lee como el
   * bloque de la home (un icono por punto), no como una tabla.
   */
  rows: { icon: string; label: L; value: L }[];
} = {
  kicker: {
    pl: 'Zamówienie',
    en: 'Order',
    de: 'Bestellung',
  },
  title: {
    pl: 'Co potwierdzamy w wycenie',
    en: 'What we confirm in the quote',
    de: 'Was wir im Angebot bestätigen',
  },
  rows: [
    {
      icon: 'tag',
      label: { pl: 'Cena', en: 'Price', de: 'Preis' },
      value: {
        pl: 'Cena jednostkowa i wartość zamówienia.',
        en: 'Unit price and order value.',
        de: 'Stückpreis und Bestellwert.',
      },
    },
    {
      icon: 'calendar',
      label: { pl: 'Termin', en: 'Lead time', de: 'Termin' },
      value: {
        pl: 'Przewidywany termin realizacji — potwierdzamy po ustaleniu wymiarów.',
        en: 'Estimated lead time — confirmed once the dimensions are set.',
        de: 'Voraussichtliche Lieferzeit — bestätigt nach Festlegung der Maße.',
      },
    },
    {
      icon: 'truck',
      label: { pl: 'Dostawa', en: 'Delivery', de: 'Lieferung' },
      value: {
        pl: 'Kurierem na terenie całej Polski, opakowanie do zamówienia. Poza Polską — wycena indywidualnie.',
        en: 'By courier across Poland, packing to order. Outside Poland — quoted individually.',
        de: 'Per Kurier in ganz Polen, Verpackung nach Auftrag. Außerhalb Polen — individuelles Angebot.',
      },
    },
    {
      icon: 'stack',
      label: { pl: 'Dostępność', en: 'Availability', de: 'Verfügbarkeit' },
      value: {
        pl: 'Dostępność materiału dla konkretnej partii — potwierdzamy w wycenie.',
        en: 'Availability of the material for the specific batch — confirmed in the quote.',
        de: 'Materialverfügbarkeit für die konkrete Charge — bestätigen wir im Angebot.',
      },
    },
    {
      icon: 'document',
      label: { pl: 'Dokumenty', en: 'Documents', de: 'Dokumente' },
      value: {
        pl: 'Faktura albo przelew — formę rozliczenia i termin płatności potwierdzamy w wycenie.',
        en: 'Invoice or bank transfer — we confirm the settlement method and the payment term in the quote.',
        de: 'Rechnung oder Überweisung — Abrechnungsart und Zahlungsziel bestätigen wir im Angebot.',
      },
    },
  ],
};