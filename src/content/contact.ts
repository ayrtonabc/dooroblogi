import type { L } from './products';

/**
 * Página de contacto — contenido propio de la página.
 *
 * Por qué un módulo aparte (y no dentro de `pages.ts`): esta página tiene
 * estructura propia —hero con foto, datos de contacto con icono, formulario,
 * los tres pasos y la franja de cierre— y copy propio. `pages.ts` se queda con
 * las páginas simples.
 *
 * TODO lo que aquí se dice es comprobable. Donde el cliente no ha confirmado
 * un dato (las horas de trabajo), la página NO lo publica: usa el texto
 * honesto de `company.hoursText()`.
 */
export const contact = {
  seo: {
    title: {
      pl: 'Kontakt — obłogi dębowe ze Słonecznika',
      en: 'Contact — oak trim battens from Słonecznik',
      de: 'Kontakt — Eichenleisten aus Słonecznik',
    } satisfies L,
    description: {
      pl: 'Telefon +48 696 741 679, Szymon Małoszek. Zapytania o obłogi dębowe, lamele i panele ze Słonecznika k. Olsztyna. Odpowiadamy w godzinach pracy.',
      en: 'Phone +48 696 741 679, Szymon Małoszek. Enquiries about oak trim battens, oak battens and panels from Słonecznik near Olsztyn, Poland.',
      de: 'Telefon +48 696 741 679, Szymon Małoszek. Anfragen zu Eichen-Abschlussleisten, Lamellen und Paneelen aus Słonecznik bei Olsztyn.',
    } satisfies L,
  },

  /* — 01 · Hero — */
  kicker: {
    pl: 'Kontakt',
    en: 'Contact',
    de: 'Kontakt',
  } satisfies L,
  title: {
    pl: 'Porozmawiajmy o Twoim projekcie',
    en: 'Let’s talk about your project',
    de: 'Sprechen wir über Ihr Projekt',
  } satisfies L,
  lead: {
    pl: 'Szukasz obłogów dębowych, lameli lub gotowych paneli? Opisz, czego potrzebujesz — pomożemy dobrać materiał i przygotujemy indywidualną wycenę.',
    en: 'Looking for oak trim battens, slats or ready-made panels? Describe what you need — we will help you choose the material and prepare an individual quote.',
    de: 'Suchen Sie Eichen-Abschlussleisten, Lamellen oder fertige Paneele? Beschreiben Sie, was Sie brauchen — wir helfen beim Material und erstellen ein individuelles Angebot.',
  } satisfies L,
  /** Pie de foto del hero: la frase que resume el material. */
  photoCaption: {
    pl: 'Naturalny dąb — materiał, który pracuje z przeznaczeniem.',
    en: 'Natural oak — a material that works with the purpose.',
    de: 'Natürliche Eiche — ein Material, das mit dem Zweck arbeitet.',
  } satisfies L,
  heroPhoto: {
    src: 'deski-na-placu.jpg',
    alt: {
      pl: 'Deseki dębowe ułożone w stos na placu, w tle kłody drewna',
      en: 'Oak boards stacked in a yard, with logs in the background',
      de: 'Eichenbretter auf einem Hof gestapelt, im Hintergrund Baumstämme',
    } satisfies L,
  },

  /* — 02 · Datos de contacto — */
  contactBlock: {
    kicker: {
      pl: 'Dane kontaktowe',
      en: 'Contact details',
      de: 'Kontaktdaten',
    } satisfies L,
    title: {
      pl: 'Doors Obłogi',
      en: 'Doors Obłogi',
      de: 'Doors Obłogi',
    } satisfies L,
    phoneLabel: {
      pl: 'Telefon',
      en: 'Phone',
      de: 'Telefon',
    } satisfies L,
    personLabel: {
      pl: 'Kontakt handlowy',
      en: 'Sales contact',
      de: 'Vertriebskontakt',
    } satisfies L,
    /**
     * Etykieta wiersza z adresem. Wartością jest adres, więc i etykieta
     * musi być adresem — wcześniej stało tu „Pracownia" (Workshop),
     * a pod spodem był adres, więc etykieta i wartość nie pasowały.
     * Sama pracownia jest opisana w `lead` i w schema (LocalBusiness).
     */
    placeLabel: {
      pl: 'Adres',
      en: 'Address',
      de: 'Adresse',
    } satisfies L,
    /**
     * Etykieta wiersza z godzinami. Konkretne godziny klient nie
     * potwierdził, więc wartość pochodzi z `company.hoursText()`.
     */
    hoursLabel: {
      pl: 'Odpowiadamy',
      en: 'We reply',
      de: 'Wir antworten',
    } satisfies L,
    shippingLabel: {
      pl: 'Dostawa',
      en: 'Delivery',
      de: 'Lieferung',
    } satisfies L,
    mapLabel: {
      pl: 'Zobacz na mapie',
      en: 'View on the map',
      de: 'Auf der Karte ansehen',
    } satisfies L,
    emailLabel: {
      pl: 'E-mail',
      en: 'Email',
      de: 'E-Mail',
    } satisfies L,
    facebookLabel: {
      pl: 'Facebook',
      en: 'Facebook',
      de: 'Facebook',
    } satisfies L,
    whatsappLabel: {
      pl: 'WhatsApp',
      en: 'WhatsApp',
      de: 'WhatsApp',
    } satisfies L,
    messengerLabel: {
      pl: 'Messenger',
      en: 'Messenger',
      de: 'Messenger',
    } satisfies L,
    /**
     * Wiersze listy. `icon` es el pictograma; `value` es lo que se ve en
     * grande; `note` es la línea en pequeño (puede venir del contenido o ser
     * un texto fijo de la página).
     */
    items: [
      {
        icon: 'pin',
        value: {
          pl: 'Słonecznik k. Olsztyna',
          en: 'Słonecznik near Olsztyn',
          de: 'Słonecznik bei Olsztyn',
        } satisfies L,
        note: {
          pl: 'województwo warmińsko-mazurskie, Polska',
          en: 'Warmian-Masurian Voivodeship, Poland',
          de: 'Ermland-Masuren, Polen',
        } satisfies L,
      },
      {
        icon: 'person',
        value: {
          pl: 'Szymon Małoszek',
          en: 'Szymon Małoszek',
          de: 'Szymon Małoszek',
        } satisfies L,
        note: {
          pl: 'kontakt handlowy',
          en: 'sales contact',
          de: 'Vertriebskontakt',
        } satisfies L,
      },
      {
        icon: 'phone',
        value: {
          pl: '696 741 679',
          en: '696 741 679',
          de: '696 741 679',
        } satisfies L,
        /** Aquí va `company.hoursText()`: las horas no están confirmadas. */
        note: null,
      },
      {
        icon: 'mail',
        value: {
          pl: 'kontakt@doors-oblogi.pl',
          en: 'kontakt@doors-oblogi.pl',
          de: 'kontakt@doors-oblogi.pl',
        } satisfies L,
        note: {
          /*
           * La maqueta del cliente trae aquí «odpowiadamy w ciągu 24 godzin»,
           * pero ese plazo NO está confirmado: `src/content/funnel.ts` lo
           * prohíbe explícitamente («✘ Odpowiadamy w 24 h») y el buzón es
           * provisional. Se publica el mismo texto honesto que el resto del
           * sitio: «odpowiadamy w godzinach pracy». Si el cliente confirma
           * el plazo, se devuelve aquí y en un solo sitio.
           */
          pl: 'odpowiadamy w godzinach pracy',
          en: 'we reply during working hours',
          de: 'wir antworten in den Geschäftszeiten',
        } satisfies L,
      },
      {
        icon: 'truck',
        value: {
          pl: 'Wysyłka kurierem na terenie całej Polski',
          en: 'Courier shipping within Poland',
          de: 'Versand per Kurier innerhalb Polens',
        } satisfies L,
        note: {
          pl: 'Możliwość transportu poza Polskę — wycena indywidualnie.',
          en: 'Shipping outside Poland is possible — quoted individually.',
          de: 'Versand außerhalb Polens ist möglich — Angebot auf Anfrage.',
        } satisfies L,
      },
    ],
    /** Último bloque: WhatsApp, separado por filete. */
    whatsapp: {
      value: {
        pl: 'Napisz na WhatsApp',
        en: 'Write on WhatsApp',
        de: 'Schreiben Sie uns auf WhatsApp',
      } satisfies L,
      note: {
        pl: 'Szybki kontakt — odpowiedzi na pytania.',
        en: 'Quick contact — answers to your questions.',
        de: 'Schneller Kontakt — Antworten auf Ihre Fragen.',
      } satisfies L,
    },
  },

  /* — 03 · Los tres pasos — */
  steps: {
    kicker: {
      pl: 'Jak wygląda zapytanie?',
      en: 'How the enquiry works',
      de: 'Wie die Anfrage abläuft',
    } satisfies L,
    title: {
      pl: 'Trzy kroki do wyceny',
      en: 'Three steps to a quote',
      de: 'Drei Schritte zum Angebot',
    } satisfies L,
    items: [
      {
        title: {
          pl: 'Opisujesz potrzeby',
          en: 'You describe what you need',
          de: 'Sie beschreiben den Bedarf',
        } satisfies L,
        text: {
          pl: 'Podajesz rodzaj produktu, wymiary, ilość i miejsce dostawy.',
          en: 'You give the product type, the dimensions, the quantity and the delivery address.',
          de: 'Sie nennen Produktart, Maße, Menge und Lieferort.',
        } satisfies L,
      },
      {
        title: {
          pl: 'Potwierdzamy parametry',
          en: 'We confirm the parameters',
          de: 'Wir bestätigen die Parameter',
        } satisfies L,
        text: {
          pl: 'Weryfikujemy szczegóły i przygotowujemy indywidualną ofertę.',
          en: 'We check the details and prepare an individual quote.',
          de: 'Wir prüfen die Angaben und erstellen ein individuelles Angebot.',
        } satisfies L,
      },
      {
        title: {
          pl: 'Otrzymujesz wycenę',
          en: 'You receive the quote',
          de: 'Sie erhalten das Angebot',
        } satisfies L,
        text: {
          pl: 'Wraz z ceną, terminem realizacji i warunkami dostawy.',
          en: 'With the price, the lead time and the delivery terms.',
          de: 'Mit Preis, Lieferzeit und Lieferbedingungen.',
        } satisfies L,
      },
    ],
  },

  /* — 04 · El formulario — */
  form: {
    kicker: {
      pl: 'Wycena indywidualna',
      en: 'Individual quote',
      de: 'Individuelles Angebot',
    } satisfies L,
    title: {
      pl: 'Zapytaj o wycenę',
      en: 'Request a quote',
      de: 'Angebot anfordern',
    } satisfies L,
    lead: {
      pl: 'Im więcej szczegółów podasz, tym dokładniejsza oferta będzie.',
      en: 'The more detail you give, the more accurate the quote will be.',
      de: 'Je mehr Details Sie angeben, desto genauer wird das Angebot.',
    } satisfies L,
  },

  /* — 05 · Franja de cierre — */
  closing: {
    title: {
      pl: 'Wolisz porozmawiać?',
      en: 'Would you rather talk?',
      de: 'Lieber sprechen?',
    } satisfies L,
    phoneLabel: {
      pl: 'Zadzwoń:',
      en: 'Call:',
      de: 'Anrufen:',
    } satisfies L,
    text: {
      pl: 'Chętnie odpowiemy na wszystkie pytania i doradzimy najlepsze rozwiązanie.',
      en: 'We are happy to answer every question and to advise the best solution.',
      de: 'Wir beantworten gerne alle Fragen und empfehlen die beste Lösung.',
    } satisfies L,
    photo: {
      src: 'oblog-na-desce.jpg',
      alt: {
        pl: 'Obłóg dębowy ułożony na desce, naturalny, bez farbowania',
        en: 'An oak trim batten laid on a board, natural and unstained',
        de: 'Eichen-Abschlussleiste auf einem Brett, natur und unbehandelt',
      } satisfies L,
    },
  },
} as const;
