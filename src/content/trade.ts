import type { L } from './products';

/**
 * Página «Dla firm» (B2B) — contenido propio de la página.
 *
 * Por qué un módulo aparte y no dentro de `pages.ts`: esta página tiene su
 * propia estructura (hero a dos columnas, banda de cuatro características con
 * icono, los tres pasos de la colaboración, la tabla de datos técnicos y el
 * formulario), y su copy es más largo que el resto. `pages.ts` se queda con
 * las páginas simples.
 *
 * TODO lo que aquí se dice es comprobable: ni precios publicados, ni plazos
 * inventados, ni condiciones que el cliente no haya confirmado. Donde el
 * valor depende de la partida se dice explícitamente que se confirma en la
 * oferta.
 */
export const trade = {
  kicker: {
    pl: 'Współpraca hurtowa',
    en: 'Trade supply',
    de: 'Großhandel',
  } satisfies L,

  /** H1 de la página. */
  title: {
    pl: 'Obłogi dębowe dla stolarzy i firm wykończeniowych',
    en: 'Oak trim battens for joiners and fit-out companies',
    de: 'Eichen-Abschlussleisten für Schreinere und Ausbauunternehmen',
  } satisfies L,

  /** Entradilla del hero: qué es y para qué proyecto. */
  lead: {
    pl: 'Naturalny dąb cięty na wymiar. Dobór selekcji, profilu i ilości do konkretnego projektu.',
    en: 'Natural oak, cut to size. We match the selection, the profile and the quantity to your project.',
    de: 'Natürliche Eiche, auf Maß geschnitten. Selektion, Profil und Menge passen wir an Ihr Projekt an.',
  } satisfies L,

  /** Hero: foto a sangre y las dos salidas. */
  hero: {
    photo: {
      src: 'oblog-w-hali.jpg',
      alt: {
        pl: 'Obłogi dębowe ułożone w stosie w pracowni, z profilem i krawędzią na widoku',
        en: 'Oak trim battens stacked in the workshop, with the profile and the edge in view',
        de: 'Eichen-Abschlussleisten in der Werkstatt gestapelt, Profil und Kante sichtbar',
      } satisfies L,
    },
    cta: {
      pl: 'Wyceń swoje zamówienie',
      en: 'Get a quote',
      de: 'Angebot einholen',
    } satisfies L,
    ctaSecondary: {
      pl: 'Zobacz parametry',
      en: 'See the parameters',
      de: 'Parameter ansehen',
    } satisfies L,
  },

  /**
   * Banda de las cuatro cosas que el comprador profesional necesita saber
   * antes de escribir: perfil estable, precio de partida, entrega y forma
   * de cierre.
   */
  features: {
    lead: {
      pl: 'Pracujemy głównie ze stolarzami, wykonawcami zabudowy i firmami wykończeniowymi. Najczęstszy scenariusz to seria zamówień na ten sam profil, tylko w innym wymiarze — dlatego trzymamy profil i selekcję drewna między partiami.',
      en: 'We work mainly with joiners, fit-out contractors and finishing companies. The most common case is a series of orders for the same profile in a different size — that is why we keep the profile and the wood selection across batches.',
      de: 'Wir arbeiten hauptsächlich mit Schreinern, Ausbauunternehmen und Innenausbaubetrieben. Der häufigste Fall ist eine Serie von Bestellungen für dasselbe Profil in anderen Maßen — deshalb halten wir Profil und Selektion über Chargen hinweg.',
    } satisfies L,
    items: [
      {
        icon: 'oak',
        title: {
          pl: 'Stały profil i selekcja',
          en: 'Same profile and selection',
          de: 'Gleiches Profil, gleiche Selektion',
        } satisfies L,
        text: {
          pl: 'Przy zamówieniach powtarzalnych ustalamy profil i selekcję raz i trzymamy się ich w kolejnych partiach.',
          en: 'With repeat orders we settle the profile and the selection once and stick to them across the following batches.',
          de: 'Bei Wiederholungsbestellungen legen wir Profil und Selektion einmal fest und bleiben in den folgenden Chargen dabei.',
        } satisfies L,
      },
      {
        icon: 'stack',
        title: {
          pl: 'Wycena na całą partię',
          en: 'Quote for the whole batch',
          de: 'Angebot für die ganze Charge',
        } satisfies L,
        text: {
          pl: 'Cena za jednostkę i cena za partię — dwie liczby w jednej wycenie, bez ukrytych pozycji.',
          en: 'Price per unit and price per batch — two numbers in one quote, without hidden line items.',
          de: 'Preis je Einheit und Preis je Charge — zwei Zahlen in einem Angebot, ohne versteckte Posten.',
        } satisfies L,
      },
      {
        icon: 'truck',
        title: {
          pl: 'Dostawa kurierem',
          en: 'Delivery by courier',
          de: 'Lieferung per Kurier',
        } satisfies L,
        text: {
          pl: 'Wysyłka kurierem na terenie całej Polski. Poza Polską wyceniamy indywidualnie.',
          en: 'Courier delivery within Poland. Outside Poland we quote individually.',
          de: 'Versand per Kurier innerhalb Polens. Außerhalb Polens kalkulieren wir einzeln.',
        } satisfies L,
      },
      {
        icon: 'document',
        title: {
          pl: 'Warunki potwierdzamy pisemnie',
          en: 'Terms confirmed in writing',
          de: 'Bedingungen schriftlich bestätigt',
        } satisfies L,
        text: {
          pl: 'Minimalne zamówienie, forma płatności i termin dostawy potwierdzamy w wycenie.',
          en: 'Minimum order, payment method and delivery date are confirmed in the quote.',
          de: 'Mindestbestellmenge, Zahlungsart und Liefertermin bestätigen wir im Angebot.',
        } satisfies L,
      },
    ],
  },

  /** Los tres pasos de la colaboración. */
  steps: {
    kicker: {
      pl: 'Jak wygląda współpraca?',
      en: 'How the cooperation works',
      de: 'Wie die Zusammenarbeit abläuft',
    } satisfies L,
    title: {
      pl: 'Prosto i konkretnie',
      en: 'Simple and concrete',
      de: 'Einfach und konkret',
    } satisfies L,
    items: [
      {
        title: {
          pl: 'Przesyłasz wymiary i ilości',
          en: 'You send the dimensions and quantities',
          de: 'Sie senden Maße und Mengen',
        } satisfies L,
        text: {
          pl: 'Napisz, czego potrzebujesz — podaj wymiary, rodzaj produktu i orientacyjną ilość.',
          en: 'Tell us what you need — the dimensions, the product type and an approximate quantity.',
          de: 'Schreiben Sie, was Sie brauchen — Maße, Produktart und die ungefähre Menge.',
        } satisfies L,
      },
      {
        title: {
          pl: 'Potwierdzamy profil, selekcję i termin',
          en: 'We confirm the profile, the selection and the lead time',
          de: 'Wir bestätigen Profil, Selektion und Termin',
        } satisfies L,
        text: {
          pl: 'Sprawdzamy dostępność materiału i przygotowujemy ofertę.',
          en: 'We check material availability and prepare the offer.',
          de: 'Wir prüfen die Materialverfügbarkeit und erstellen das Angebot.',
        } satisfies L,
      },
      {
        title: {
          pl: 'Otrzymujesz wycenę i warunki dostawy',
          en: 'You receive the quote and the delivery terms',
          de: 'Sie erhalten Angebot und Lieferbedingungen',
        } satisfies L,
        text: {
          pl: 'Wysyłamy indywidualną wycenę z ceną, terminem realizacji i warunkami dostawy.',
          en: 'We send an individual quote with the price, the lead time and the delivery terms.',
          de: 'Wir senden ein individuelles Angebot mit Preis, Lieferzeit und Lieferbedingungen.',
        } satisfies L,
      },
    ],
  },

  /** Tabla de datos técnicos: sólo lo que se puede comprobar. */
  specs: {
    kicker: {
      pl: 'Obłogi dębowe',
      en: 'Oak trim battens',
      de: 'Eichen-Abschlussleisten',
    } satisfies L,
    title: {
      pl: 'Dane techniczne',
      en: 'Technical data',
      de: 'Technische Daten',
    } satisfies L,
    lead: {
      pl: 'Najważniejsze informacje o materiałach.',
      en: 'The key facts about the material.',
      de: 'Die wichtigsten Angaben zum Material.',
    } satisfies L,
    note: {
      pl: 'Dokładny profil, wymiary i termin potwierdzamy w wycenie. Cennika nie publikujemy — zależy od profilu, długości i ilości.',
      en: 'We confirm the exact profile, the dimensions and the lead time in the quote. We do not publish a price list — it depends on the profile, the length and the quantity.',
      de: 'Profil, Maße und Termin bestätigen wir im Angebot. Eine Preisliste veröffentlichen wir nicht — sie hängt von Profil, Länge und Menge ab.',
    } satisfies L,
    rows: [
      {
        label: { pl: 'Grubość', en: 'Thickness', de: 'Stärke' } satisfies L,
        value: { pl: '4 mm albo 8 mm', en: '4 mm or 8 mm', de: '4 mm oder 8 mm' } satisfies L,
      },
      {
        label: {
          pl: 'Długość i szerokość',
          en: 'Length and width',
          de: 'Länge und Breite',
        } satisfies L,
        value: {
          pl: 'według dostępnego materiału',
          en: 'according to the material available',
          de: 'nach verfügbarem Material',
        } satisfies L,
      },
      {
        label: { pl: 'Selekcja', en: 'Selection', de: 'Selektion' } satisfies L,
        value: {
          pl: 'bez sęków / z sękami',
          en: 'knot-free / with knots',
          de: 'ohne Äste / mit Ästen',
        } satisfies L,
      },
      {
        label: { pl: 'Wycena', en: 'Quote', de: 'Angebot' } satisfies L,
        value: {
          pl: 'zależna od wymiarów i ilości',
          en: 'depends on the dimensions and the quantity',
          de: 'abhängig von Maßen und Menge',
        } satisfies L,
      },
    ],
  },

  /** Banda del formulario. */
  form: {
    kicker: {
      pl: 'Współpraca hurtowa',
      en: 'Trade supply',
      de: 'Großhandel',
    } satisfies L,
    title: {
      pl: 'Zapytanie hurtowe',
      en: 'Trade enquiry',
      de: 'Großhandelsanfrage',
    } satisfies L,
    lead: {
      pl: 'Podaj profil, długość i ilość na całą partię. Odpowiadamy z wyceną jednostki i całości, terminem realizacji i warunkami dostawy.',
      en: 'Give the profile, the length and the quantity for the whole batch. We reply with a quote for the unit and the batch, a lead time and the delivery terms.',
      de: 'Nennen Sie Profil, Länge und Menge für die ganze Charge. Wir antworten mit einem Angebot für Einheit und Charge, Lieferzeit und Lieferbedingungen.',
    } satisfies L,
  },

  /** Banda de cierre, antes del pie. */
  cta: {
    title: {
      pl: 'Masz projekt lub stałe zapotrzebowanie?',
      en: 'Do you have a project or a standing order?',
      de: 'Haben Sie ein Projekt oder einen laufenden Bedarf?',
    } satisfies L,
    text: {
      pl: 'Skontaktuj się z nami — przygotujemy indywidualną ofertę dopasowaną do Twoich potrzeb.',
      en: 'Get in touch — we will prepare an individual quote matched to your needs.',
      de: 'Sprechen Sie uns an — wir erstellen ein individuelles Angebot, passend zu Ihrem Bedarf.',
    } satisfies L,
    label: {
      pl: 'Porozmawiajmy o zamówieniu',
      en: 'Talk about your order',
      de: 'Über Ihre Bestellung sprechen',
    } satisfies L,
    /** Foto de la franja de cierre: el corte a medida, en la foto. */
    photo: {
      src: 'pomiar-oblogu.jpg',
      alt: {
        pl: 'Tolerancja cięcia w desce dębowej mierzona taśmą',
        en: 'Cutting tolerance on an oak board measured with a tape',
        de: 'Schnittoleranz auf einer Eichenbohle, mit Maßband gemessen',
      } satisfies L,
    },
  },
} as const;
