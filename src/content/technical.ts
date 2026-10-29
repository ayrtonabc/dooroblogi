import type { L } from './products';

/**
 * Dane techniczne drewna i lista danych potrzebnych do wyceny.
 *
 * KLIENT NIE POTWIERDZIŁ wilgotności, gęstości, twardości ani pochodzenia
 * drewna. Nie wpisujemy więc wartości, których nie kontrolujemy — zostawiamy
 * wiersze z odpowiedzią „potwierdzamy w ofercie". Gdy klient potwierdzi
 * parametry, wystarczy podmienić tekst w tym jednym pliku: nagłówek
 * „potwierdzamy" znika automatycznie, bo steruje go flaga `confirmed`.
 *
 * REGLA (ESTRATEGIA §5.0): cena się nie mówi. Technika odpowiada na pytanie
 * „co dokładnie dostanę" i „co muszę podać, żeby dostać wycenę".
 */
export interface TechnicalRow {
  label: L;
  value: L;
  confirmed: boolean;
}

export const woodTechnical: TechnicalRow[] = [
  {
    label: {
      pl: 'Drewno',
      en: 'Timber',
      de: 'Holz',
    },
    value: {
      pl: 'Dąb naturalny, dwie selekcje: bez sęków i z sękami.',
      en: 'Natural oak, two selections: knot-free and with knots.',
      de: 'Natürliche Eiche, zwei Selektionen: ohne Äste und mit Ästen.',
    },
    confirmed: true,
  },
  {
    label: {
      pl: 'Wykończenia',
      en: 'Finishes',
      de: 'Oberflächen',
    },
    value: {
      pl: 'Naturalne, szczotkowane i wędzone. Wędzenie zmienia kolor, nie właściwości drewna.',
      en: 'Natural, brushed and smoked. Smoking changes the colour, not the properties of the wood.',
      de: 'Natur, gebürstet und geräuchert. Das Räuchern ändert die Farbe, nicht die Eigenschaften des Holzes.',
    },
    confirmed: true,
  },
  {
    label: {
      pl: 'Profil',
      en: 'Profile',
      de: 'Profil',
    },
    value: {
      pl: 'Prosty, piętro-wpust albo do uzgodnienia. Robimy też profil na wymiar.',
      en: 'Straight, tongue and groove, or to be agreed. We also cut a profile to your drawing.',
      de: 'Gerade, Nut und Feder oder nach Absprache. Wir fertigen auch ein Profil nach Maß.',
    },
    confirmed: true,
  },
  {
    label: {
      pl: 'Wilgotność drewna',
      en: 'Wood moisture',
      de: 'Holzfeuchte',
    },
    value: {
      pl: 'Podajemy w wycenie dla konkretnej partii.',
      en: 'We state it in the quote for the specific batch.',
      de: 'Wir nennen sie im Angebot für die konkrete Charge.',
    },
    confirmed: false,
  },
  {
    label: {
      pl: 'Gęstość i twardość',
      en: 'Density and hardness',
      de: 'Dichte und Härte',
    },
    value: {
      pl: 'Dane techniczne wysyłamy wraz z wyceną.',
      en: 'We send the technical data with the quote.',
      de: 'Wir senden die technischen Daten mit dem Angebot.',
    },
    confirmed: false,
  },
  {
    label: {
      pl: 'Tolerancja długości',
      en: 'Length tolerance',
      de: 'Längentoleranz',
    },
    value: {
      pl: 'Ustalana przy cięciu — podajemy ją w wycenie.',
      en: 'Set during cutting — we state it in the quote.',
      de: 'Wird beim Zuschnitt festgelegt — wir nennen sie im Angebot.',
    },
    confirmed: false,
  },
  {
    label: {
      pl: 'Przekrój maksymalny',
      en: 'Maximum section',
      de: 'Maximaler Querschnitt',
    },
    value: {
      pl: 'Zależy od profilu — potwierdzamy w wycenie.',
      en: 'Depends on the profile — we confirm it in the quote.',
      de: 'Hängt vom Profil ab — wir bestätigen es im Angebot.',
    },
    confirmed: false,
  },
];

/**
 * Co potrzebujemy, żeby przygotować wycenę.
 *
 * To jest najbardziej użyteczny blok dla konwersji: odpowiada na pytanie
 * „co mam podać", zamiast zostawiać formularz z pustymi polami. Zawiera
 * wyłącznie dane, o które naprawdę pytamy.
 */
export const quoteChecklist: { label: L; value: L }[] = [
  {
    label: {
      pl: 'Produkt',
      en: 'Product',
      de: 'Produkt',
    },
    value: {
      pl: 'Obłóg dębowy cięty, obłóg wędzony, lamela 4 albo 8 mm, panele sufitowe i ścienne.',
      en: 'Cut oak trim, smoked oak trim, battens 4 or 8 mm, ceiling and wall panels.',
      de: 'Eichen-Abschlussleiste auf Maß, geräucherte Abschlussleiste, Lamellen 4 oder 8 mm, Decken- und Wandpaneele.',
    },
  },
  {
    label: {
      pl: 'Wymiary',
      en: 'Dimensions',
      de: 'Maße',
    },
    value: {
      pl: 'Długość i przekrój, np. 3 m × 40 × 20 mm. Wystarczy przybliżenie — resztę doprecyzujemy.',
      en: 'Length and section, e.g. 3 m × 40 × 20 mm. An approximation is enough — we confirm the rest.',
      de: 'Länge und Querschnitt, z. B. 3 m × 40 × 20 mm. Eine Näherung genügt — wir präzisieren nach.',
    },
  },
  {
    label: {
      pl: 'Ilość',
      en: 'Quantity',
      de: 'Menge',
    },
    value: {
      pl: 'Liczba sztuk albo metrów bieżących.',
      en: 'Number of pieces or linear metres.',
      de: 'Anzahl Stück oder laufende Meter.',
    },
  },
  {
    label: {
      pl: 'Profil',
      en: 'Profile',
      de: 'Profil',
    },
    value: {
      pl: 'Prosty, piętro-wpust albo do uzgodnienia.',
      en: 'Straight, tongue and groove, or to be agreed.',
      de: 'Gerade, Nut und Feder oder nach Absprache.',
    },
  },
  {
    label: {
      pl: 'Selekcja drewna',
      en: 'Wood selection',
      de: 'Holzselektion',
    },
    value: {
      pl: 'Bez sęków albo z sękami.',
      en: 'Knot-free or with knots.',
      de: 'Ohne Äste oder mit Ästen.',
    },
  },
  {
    label: {
      pl: 'Wykończenie',
      en: 'Finish',
      de: 'Oberfläche',
    },
    value: {
      pl: 'Naturalne, szczotkowane albo wędzone.',
      en: 'Natural, brushed or smoked.',
      de: 'Natur, gebürstet oder geräuchert.',
    },
  },
  {
    label: {
      pl: 'Zastosowanie',
      en: 'Application',
      de: 'Verwendung',
    },
    value: {
      pl: 'Podłoga, ściana, okno, drzwi przesuwne, meble — mówi nam, jakie tolerancje są ważne.',
      en: 'Floor, wall, window, sliding door, furniture — it tells us which tolerances matter.',
      de: 'Boden, Wand, Fenster, Schiebetür, Möbel — sagt uns, welche Toleranzen zählen.',
    },
  },
  {
    label: {
      pl: 'Miejsce dostawy',
      en: 'Delivery place',
      de: 'Lieferort',
    },
    value: {
      pl: 'Miejscowość i kraj. W całej Polsce kurierem, poza Polską wyceniamy indywidualnie.',
      en: 'Town and country. Within Poland by courier, outside Poland we quote individually.',
      de: 'Ort und Land. In Polen per Kurier, außerhalb Polens Angebot auf Anfrage.',
    },
  },
];

/** Nagłówek listy danych do wyceny. */
export const quoteChecklistHead: { kicker: L; title: L; lead: L } = {
  kicker: {
    pl: 'Do wyceny',
    en: 'For the quote',
    de: 'Für das Angebot',
  },
  title: {
    pl: 'Co potrzebujemy od Ciebie',
    en: 'What we need from you',
    de: 'Was wir von Ihnen brauchen',
  },
  lead: {
    pl: 'Osiem rzeczy. Resztę doprecyzujemy w odpowiedzi — wycena pisemna zawiera cenę, termin i warunki dostawy.',
    en: 'Eight things. We clarify the rest in the reply — the written quote covers the price, the lead time and the delivery terms.',
    de: 'Acht Angaben. Den Rest klären wir in der Antwort — das schriftliche Angebot enthält Preis, Lieferzeit und Lieferbedingungen.',
  },
};
