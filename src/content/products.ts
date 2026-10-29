import type { Locale } from '../i18n';

/** Tekst wielojęzyczny — jeden obiekt, trzy wartości. */
export type L = Record<Locale, string>;

export interface ProductImage {
  src: string;
  alt: L;
  /**
   * Proporción real de la foto cuando NO se puede recortar (imágenes con
   * rótulos impresos dentro del encuadre). Si falta, la ficha usa 3/4.
   */
  ratio?: string;
  /**
   * Banda a lo ancho (una fila entera de la rejilla). Para fotos que no
   * admiten recorte, como el gráfico de SEDO con los rótulos «Bez nud» y
   * «Z nudami».
   */
  full?: boolean;
}

export interface ProductSpec {
  /**
   * Ikona wiersza. «Co dostajesz» se lee como el bloque SEDO de la home:
   * un icono por dato, para escanear sin leer la ficha entera.
   */
  icon: string;
  label: L;
  value: L;
}

export interface ProductFaq {
  question: L;
  answer: L;
}

export interface Product {
  id: string;
  slug: L;
  name: L;
  /**
   * CTA propio de la ficha. «Zapytaj o wycenę obłogu» dice QUÉ se pide;
   * un «Zapytaj o wycenę» genérico no dice nada y se pierde entre las
   * tres fichas.
   */
  ctaLabel: L;
  /** Jedno zdanie — używane na kaflu, w meta description i w JSON-LD. */
  summary: L;
  /** Akapity opisu. Bez marketingowego bełkotu — konkret. */
  body: Record<Locale, string[]>;
  image: ProductImage;
  gallery: ProductImage[];
  specs: ProductSpec[];
  /**
   * Entradilla de la banda «Co dostajesz»: una frase con el material, la
   * unidad de venta y qué se ajusta al pedido. No repite el `summary` del
   * hero —aquí el lector ya está mirando los datos.
   */
  specsLead: L;
  /** Trzy powody, dla których ktoś kupuje ten produkt. */
  highlights: { icon: string; title: L; text: L }[];
  /** Trzy pytania do FAQPage na karcie produktu. */
  faq: ProductFaq[];
  /** Tytuł strony — bez marki, markę dokleja layout. */
  seoTitle: L;
  /** Opis w wynikach — maks. 160 znaków. */
  seoDescription: L;
  /** Słowa kluczowe z intencją zakupową — podstawa dla agenta SEO. */
  keywords: L;
  /**
   * Kolor w sensie schema.org. Uczciwie: drewno naturalne nie ma jednego
   * odcienia, więc wartość mówi o tym wprost, zamiast udawać konkretny kolor.
   */
  color: L;
  /** Wymiar w sensie schema.org — tu: format sprzedawany (na wymiar / mm). */
  size: L;
  order: number;
}

export const products: Product[] = [
  {
    id: 'oblog-debowy-ciety',
    slug: {
      pl: 'oblog-debowy-ciety',
      en: 'oak-trim-battens',
      de: 'eichen-abschlussleiste-auf-mass',
    },
    name: {
      pl: 'Obłóg dębowy cięty',
      en: 'Oak trim battens',
      de: 'Eichen-Abschlussleiste auf Maß',
    },
    ctaLabel: {
      pl: 'Zapytaj o wycenę obłogu',
      en: 'Ask for a trim batten quote',
      de: 'Angebot für Abschlussleisten anfordern',
    },
    summary: {
      pl: 'Dębowe listwy wykończeniowe cięte na wymiar: długość, przekrój i profil pod Twoją realizację.',
      en: 'Oak trim battens cut to size: length, section and profile matched to your project.',
      de: 'Eichen-Abschlussleisten auf Maß geschnitten: Länge, Querschnitt und Profil passend zu Ihrem Projekt.',
    },
    body: {
      pl: [
        'Obłóg dębowy to element wykończeniowy, który widać z bliska — przy podłodze, na ścianie, wokół okna czy przy drzwiach przesuwnych. Dlatego cięcie robimy pod wymiar, a nie pod stan magazynowy.',
        'Pracujemy na naturalnym dębie. W ofercie masz dwie selekcje: dąb bez sęków, w którym liczy się sama faktura, oraz dąb z sękami, w którym rysunek drewna jest częścią charakteru wnętrza. Oba warianty mają tę samą twardość i tę samą geometrię — różni je tylko selekcja.',
        'Długość, przekrój i profil ustalamy na podstawie Twojego zapytania. Wyślij wymiary, a przygotujemy wycenę wraz z terminem realizacji.',
      ],
      en: [
        'An oak trim batten is a finish element people see up close — at the floor, on the wall, around a window or beside a sliding door. That is why we cut to size rather than to stock dimensions.',
        'We work with natural oak. Two selections are available: knot-free oak, where the grain itself is the point, and oak with knots, where the figure of the wood becomes part of the character of the room. Both share the same hardness and the same geometry — only the selection differs.',
        'Length, section and profile are set from your enquiry. Send us the dimensions and we will reply with a written quote and a lead time.',
      ],
      de: [
        'Eine Eichen-Abschlussleiste ist ein Abschlusselement, das man aus der Nähe sieht — am Boden, an der Wand, am Fenster oder neben Schiebetüren. Deshalb schneiden wir auf Maß, nicht auf Lagerdimension.',
        'Wir arbeiten mit natürlicher Eiche. Zwei Selektionen stehen zur Wahl: Eiche ohne Äste, bei der die Maserung selbst zählt, und Eiche mit Ästen, bei der die Zeichnung des Holzes zum Charakter des Raums wird. Beide haben dieselbe Härte und dieselbe Geometrie — nur die Selektion unterscheidet sich.',
        'Länge, Querschnitt und Profil ergeben sich aus Ihrer Anfrage. Senden Sie uns die Maße, wir antworten mit einem schriftlichen Angebot und einer Lieferzeit.',
      ],
    },
    image: {
      src: 'oblog-na-desce.jpg',
      alt: {
        pl: 'Obłóg dębowy cięty położony na drewnianym tarasie w ciepłym świetle',
        en: 'An oak trim batten resting on a wooden deck in warm light',
        de: 'Eine Eichen-Abschlussleiste auf einem Holzhof im warmen Licht',
      },
    },
    gallery: [
      {
        src: 'profil-oblogu.jpg',
        alt: {
          pl: 'Przekrój obłogu dębowego — widoczny profil wykończenia i naturalna faktura',
          en: 'Cross-section of an oak trim batten showing the finish profile and the natural grain',
          de: 'Querschnitt einer Eichen-Abschlussleiste mit sichtbarem Abschlussprofil und natürlicher Maserung',
        },
      },
      {
        src: 'oblog-w-scianie.jpg',
        alt: {
          pl: 'Obłóg dębowy zamontowany pionowo na drewnianej ścianie',
          en: 'An oak trim batten mounted vertically on a wooden wall',
          de: 'Eine vertikal an einer Holzwand montierte Eichen-Abschlussleiste',
        },
      },
      {
        src: 'oblog-w-hali.jpg',
        alt: {
          pl: 'Obłogi dębowe ułożone na warsztacie — widać przekrój i profil wykończenia',
          en: 'Oak trim battens stacked in the workshop — the cross-section and the finish profile are visible',
          de: 'Eichen-Abschlussleisten in der Werkstatt gestapelt — Querschnitt und Abschlussprofil sichtbar',
        },
      },
      {
        src: 'pomiar-oblogu.jpg',
        alt: {
          pl: 'Deska dębowa z taśmą mierniczą — długość ustalana pod wymiar',
          en: 'An oak board with a measuring tape — the length is set to the required size',
          de: 'Ein Eichenbrett mit Maßband — die Länge wird nach Maß festgelegt',
        },
      },
      {
        src: 'deska-debowa-naturalna.jpg',
        alt: {
          pl: 'Naturalne deski dębowe z widocznym układem sęków',
          en: 'Natural oak boards with a visible knot pattern',
          de: 'Natürliche Eichenbretter mit sichtbarem Astmuster',
        },
      },
      {
        src: 'hero-oblog-debowy.jpg',
        alt: {
          pl: 'Obłóg dębowy z naturalną krawędzią na stosie desek',
          en: 'An oak trim batten with a natural edge resting on a stack of boards',
          de: 'Eine Eichen-Abschlussleiste mit Naturkante auf einem Stapel Bretter',
        },
      },
    ],
    specsLead: {
      pl: 'Naturalny dąb (100%) — naturalny, szczotkowany lub wędzony. Rozliczamy w metrach bieżących: długość, przekrój i profil ustalamy pod Twoją realizację.',
      en: 'Natural oak (100 %) — natural, brushed or smoked. Charged per linear metre: length, section and profile are agreed for your project.',
      de: 'Natürliche Eiche (100 %) — natur, gebürstet oder geräuchert. Abrechnung je laufender Meter: Länge, Querschnitt und Profil stimmen wir auf Ihr Projekt ab.',
    },
    specs: [
      {
        icon: 'oak',
        label: {
          pl: 'Materiał',
          en: 'Material',
          de: 'Material',
        },
        value: {
          pl: 'Naturalny dąb (100%)',
          en: 'Natural oak (100%)',
          de: 'Natürliche Eiche (100 %)',
        },
      },
      {
        icon: 'ruler',
        label: {
          pl: 'Długość i przekrój',
          en: 'Length and section',
          de: 'Länge und Querschnitt',
        },
        value: {
          pl: 'Na wymiar, wg zamówienia',
          en: 'Cut to order',
          de: 'Nach Maß gefertigt',
        },
      },
      {
        icon: 'door',
        label: {
          pl: 'Profil',
          en: 'Profile',
          de: 'Profil',
        },
        value: {
          pl: 'Do uzgodnienia (np. piętro-wpust)',
          en: 'To be agreed (e.g. tongue and groove)',
          de: 'Nach Absprache (z. B. Nut und Feder)',
        },
      },
      {
        icon: 'stack',
        label: {
          pl: 'Selekcja',
          en: 'Selection',
          de: 'Selektion',
        },
        value: {
          pl: 'Bez sęków / z sękami',
          en: 'Knot-free / with knots',
          de: 'Ohne Äste / mit Ästen',
        },
      },
      {
        icon: 'leaf',
        label: {
          pl: 'Wykończenie',
          en: 'Finish',
          de: 'Oberfläche',
        },
        value: {
          pl: 'Naturalne, szczotkowane lub wędzone',
          en: 'Natural, brushed or smoked',
          de: 'Natur, gebürstet oder geräuchert',
        },
      },
      {
        icon: 'truck',
        label: {
          pl: 'Wysyłka',
          en: 'Shipping',
          de: 'Versand',
        },
        value: {
          pl: 'Kurierem, na terenie całej Polski',
          en: 'By courier within Poland',
          de: 'Per Kurier innerhalb Polens',
        },
      },
    ],
    highlights: [
      {
        icon: 'ruler',
        title: {
          pl: 'Wymiar pod Twoją realizację',
          en: 'Sized for your project',
          de: 'Maß für Ihr Projekt',
        },
        text: {
          pl: 'Nie kupujesz listwy „w przybliżeniu" — dostajesz długość, którą wycinasz na budowie.',
          en: 'You do not buy a batten "roughly" — you get the length you cut on site.',
          de: 'Sie kaufen keine Leiste „ungefähr" — Sie erhalten die Länge, die Sie auf der Baustelle schneiden.',
        },
      },
      {
        icon: 'oak',
        title: {
          pl: 'Dwie selekcje drewna',
          en: 'Two wood selections',
          de: 'Zwei Holzselektionen',
        },
        text: {
          pl: 'Bez sęków albo z sękami — ten sam materiał, dwa zupełnie różne charakterystyki wnętrza.',
          en: 'Knot-free or with knots — the same material, two entirely different room characters.',
          de: 'Ohne Äste oder mit Ästen — dasselbe Material, zwei völlig verschiedene Raumcharaktere.',
        },
      },
      {
        icon: 'stack',
        title: {
          pl: 'Naturalny dąb, bez farbowania',
          en: 'Natural oak, no staining',
          de: 'Natürliche Eiche, nicht eingefärbt',
        },
        text: {
          pl: 'Kolor, rysunek i faktura pochodzą z samego drewna, a nie z warstwy wykończenia.',
          en: 'Colour, figure and texture come from the wood itself, not from a surface layer.',
          de: 'Farbe, Zeichnung und Struktur kommen aus dem Holz selbst, nicht aus einer Oberflächenschicht.',
        },
      },
    ],
    faq: [
      {
        question: {
          pl: 'Czy obłóg dębowy sprzedajecie w stałych długościach?',
          en: 'Do you sell oak trim battens in fixed lengths?',
          de: 'Verkaufen Sie Eichen-Abschlussleisten in festen Längen?',
        },
        answer: {
          pl: 'Nie. Cięcie robimy pod wymiar — długość, przekrój i profil podajesz w zapytaniu, a my wyceniamy konkretną sztukę.',
          en: 'No. We cut to size — send the length, section and profile in your enquiry and we quote that exact piece.',
          de: 'Nein. Wir schneiden auf Maß — senden Sie Länge, Querschnitt und Profil in Ihrer Anfrage, wir kalkulieren genau dieses Stück.',
        },
      },
      {
        question: {
          pl: 'Jakie selekcje drewna są dostępne?',
          en: 'Which wood selections do you offer?',
          de: 'Welche Holzselektionen bieten Sie an?',
        },
        answer: {
          pl: 'Dwie, obie z naturalnego dębu: bez sęków (liczy się sama faktura) oraz z sękami (rysunek drewna wchodzi w charakter wnętrza).',
          en: 'Two, both from natural oak: knot-free (the grain alone is the point) and with knots (the figure of the wood becomes part of the room).',
          de: 'Zwei, beide aus natürlicher Eiche: ohne Äste (die Maserung allein zählt) und mit Ästen (die Zeichnung des Holzes prägt den Raum).',
        },
      },
      {
        question: {
          pl: 'Ile kosztuje obłóg dębowy?',
          en: 'How much does an oak trim batten cost?',
          de: 'Was kostet eine Eichen-Abschlussleiste?',
        },
        answer: {
          pl: 'Cena zależy od długości, przekroju, profilu i ilości, więc podajemy ją w wycenie pisemnej — razem z terminem realizacji i dostawą.',
          en: 'The price depends on length, section, profile and quantity, so we put it in a written quote — together with the lead time and delivery.',
          de: 'Der Preis hängt von Länge, Querschnitt, Profil und Menge ab, deshalb nennen wir ihn im schriftlichen Angebot — mit Lieferzeit und Lieferung.',
        },
      },
    ],
    seoTitle: {
      pl: 'Obłóg dębowy cięty na wymiar',
      en: 'Oak trim battens cut to size',
      de: 'Eichen-Abschlussleiste auf Maß',
    },
    seoDescription: {
      pl: 'Obłóg dębowy cięty na wymiar: naturalne listwy wykończeniowe z dębu, selekcja bez sęków lub z sękami. Cena za mb — wycena pisemna z terminem.',
      en: 'Oak trim battens cut to size: natural oak, knot-free or with knots. Price per linear metre — written quote with a lead time.',
      de: 'Eichen-Abschlussleiste auf Maß: natürliche Eiche, ohne Äste oder mit Ästen. Preis je lfm — schriftliches Angebot mit Lieferzeit.',
    },
    keywords: {
      pl: 'obłóg dębowy, obłogi dębowe, obłóg dębowy cięty, listwy dębowe, obłóg dębowy na wymiar, listwa dębowa wykończeniowa',
      // „oak edging" wypadło: SERP dla tej frazy to okleiny do mebli (furniture
      // edge banding), a nie listwy wykończeniowe — zły zamiar.
      en: 'oak trim batten, oak trim battens, cut oak battens, oak battens to size',
      de: 'Eichen-Abschlussleiste, Eichen-Abschlussleisten, Eichenleiste auf Maß, Eichenleiste nach Maß, Abschlussleiste Eiche',
    },
    color: {
      pl: 'Naturalny dąb — odcień zależny od deski',
      en: 'Natural oak — shade varies by board',
      de: 'Natürliche Eiche — Farbton je nach Brett',
    },
    size: {
      pl: 'Na wymiar: długość, przekrój i profil wg zamówienia',
      en: 'Cut to size: length, section and profile to order',
      de: 'Auf Maß: Länge, Querschnitt und Profil nach Bestellung',
    },
    order: 1,
  },
  {
    id: 'oblog-debowy-wedzony',
    slug: {
      pl: 'oblog-debowy-wedzony',
      en: 'smoked-oak-trim',
      de: 'geraeucherte-eichen-abschlussleiste',
    },
    ctaLabel: {
      pl: 'Zapytaj o wycenę obłogu wędzonego',
      en: 'Ask for a smoked trim batten quote',
      de: 'Angebot für geräucherte Abschlussleisten anfordern',
    },
    name: {
      pl: 'Obłóg dębowy wędzony',
      en: 'Smoked oak trim battens',
      de: 'Geräucherte Eichen-Abschlussleiste',
    },
    summary: {
      pl: 'Ten sam naturalny dąb, poddany wędzieniu — głębszy, chłodniejszy odcień i wyraźniejszy rysunek.',
      en: 'The same natural oak, smoked — a deeper, cooler tone with a more pronounced grain.',
      de: 'Dieselbe natürliche Eiche, geräuchert — ein tieferer, kühlerer Ton mit kräftigerer Maserung.',
    },
    body: {
      pl: [
        'Wędzenie to nie farba. Drewno przejmuje dym, który wchodzi w rysunek i ciemni go głęboko, ale nie zabija struktury. Efekt jest niepowtarzalny: żadna farba nie da dwóch takich samych desek.',
        'Wędzony obłóg wygląda zupełnie inaczej niż naturalny — przy tym ma dokładnie tę samą twardość, tę samą geometrię i tak samo dobrze trzyma się podłogi i ściany.',
        'Zamawiając wędzony obłóg, podaj w zapytaniu, czy ma to być materiał samodzielny, czy do pary z naturalnym dębem w jednym wnętrzu — podpowiedzimy, jak się te dwa kolory zachowują obok siebie.',
      ],
      en: [
        'Smoking is not a stain. The wood takes in smoke, which works deep into the grain and darkens it without flattening the structure. The result cannot be reproduced: no paint gives you two identical boards.',
        'Smoked oak looks completely different from natural oak — and it has exactly the same hardness, the same geometry and holds floors and walls just as well.',
        'When you order smoked oak, tell us in your enquiry whether it will be a standalone material or part of a room that also uses natural oak — we will advise on how the two colours behave side by side.',
      ],
      de: [
        'Räuchern ist keine Farbe. Das Holz nimmt Rauch auf, der tief in die Maserung einzieht und sie dunkel färbt, ohne die Struktur zu töten. Das Ergebnis ist nicht reproduzierbar: keine Farbe liefert zwei identische Bretter.',
        'Geräucherte Eiche sieht völlig anders aus als natürliche Eiche — bei identischer Härte, identischer Geometrie und genauso gutem Halt an Boden und Wand.',
        'Bei der Bestellung geben Sie bitte an, ob das Material eigenständig eingesetzt wird oder zusammen mit natürlicher Eiche in einem Raum — wir beraten, wie die beiden Farben nebeneinander wirken.',
      ],
    },
    image: {
      src: 'oblog-wedzony.jpg',
      alt: {
        pl: 'Wędzony obłóg dębowy — ciemne deski dębowe stojące w pracowni',
        en: 'Smoked oak trim battens — dark oak boards standing in the workshop',
        de: 'Geräucherte Eichen-Abschlussleisten — dunkle Eichenbretter in der Werkstatt',
      },
    },
    gallery: [
      {
        src: 'dab-wedzony-beczka.jpg',
        alt: {
          pl: 'Obłogi dębowe w pracowni: na pierwszym planie wędzony dąb, za nim naturalny',
          en: 'Oak trim battens in the workshop: smoked oak in front, natural oak behind',
          de: 'Eichen-Abschlussleisten in der Werkstatt: geräucherte Eiche vorn, natürliche Eiche dahinter',
        },
      },
      {
        src: 'panele-scienne-dab.jpg',
        alt: {
          pl: 'Ściana z poziomych desek dębowych',
          en: 'A wall of horizontal oak boards',
          de: 'Eine Wand aus waagerechten Eichenbohlen',
        },
      },
    ],
    specsLead: {
      pl: 'Naturalny dąb (100%), wędzony w naszej pracowni. Rozliczamy w metrach bieżących — długość, przekrój i profil ustalamy pod Twoją realizację.',
      en: 'Natural oak (100 %), smoked in our own workshop. Charged per linear metre — length, section and profile are agreed for your project.',
      de: 'Natürliche Eiche (100 %), in unserer Werkstatt geräuchert. Abrechnung je laufender Meter — Länge, Querschnitt und Profil stimmen wir auf Ihr Projekt ab.',
    },
    specs: [
      {
        icon: 'oak',
        label: {
          pl: 'Materiał',
          en: 'Material',
          de: 'Material',
        },
        value: {
          pl: 'Naturalny dąb (100%), wędzony',
          en: 'Natural oak (100%), smoked',
          de: 'Natürliche Eiche (100 %), geräuchert',
        },
      },
      {
        icon: 'smoke',
        label: {
          pl: 'Wykończenie',
          en: 'Finish',
          de: 'Oberfläche',
        },
        value: {
          pl: 'Wędzony — odcień zależny od czasu w komorze',
          en: 'Smoked — the shade depends on time in the chamber',
          de: 'Geräuchert — der Farbton hängt von der Zeit in der Kammer ab',
        },
      },
      {
        icon: 'ruler',
        label: {
          pl: 'Długość i przekrój',
          en: 'Length and section',
          de: 'Länge und Querschnitt',
        },
        value: {
          pl: 'Na wymiar, wg zamówienia',
          en: 'Cut to order',
          de: 'Nach Maß gefertigt',
        },
      },
      {
        icon: 'door',
        label: {
          pl: 'Profil',
          en: 'Profile',
          de: 'Profil',
        },
        value: {
          pl: 'Do uzgodnienia',
          en: 'To be agreed',
          de: 'Nach Absprache',
        },
      },
      {
        icon: 'stack',
        label: {
          pl: 'Selekcja',
          en: 'Selection',
          de: 'Selektion',
        },
        value: {
          pl: 'Bez sęków / z sękami',
          en: 'Knot-free / with knots',
          de: 'Ohne Äste / mit Ästen',
        },
      },
      {
        icon: 'truck',
        label: {
          pl: 'Wysyłka',
          en: 'Shipping',
          de: 'Versand',
        },
        value: {
          pl: 'Kurierem, na terenie całej Polski',
          en: 'By courier within Poland',
          de: 'Per Kurier innerhalb Polens',
        },
      },
    ],
    highlights: [
      {
        icon: 'workshop',
        title: {
          pl: 'Dym w rysunku, nie na wierzchu',
          en: 'Smoke in the grain, not on top',
          de: 'Rauch in der Maserung, nicht obendrauf',
        },
        text: {
          pl: 'Wędzenie wnika w drewno i ciemni je głęboko, zostawiając strukturę czytelną.',
          en: 'Smoke works into the wood and darkens it deeply while keeping the structure readable.',
          de: 'Der Rauch zieht ins Holz ein und dunkelt es tief, ohne die Struktur zu verlieren.',
        },
      },
      {
        icon: 'oak',
        title: {
          pl: 'Niepowtarzalny odcień',
          en: 'A shade that cannot be repeated',
          de: 'Ein Farbton, der nicht wiederholbar ist',
        },
        text: {
          pl: 'Dwie deski z tej samej partii nigdy nie będą identyczne — tak działa naturalne drewno.',
          en: 'Two boards from the same batch are never identical — that is what natural wood does.',
          de: 'Zwei Bretter aus derselben Charge sind nie identisch — so arbeitet natürliches Holz.',
        },
      },
      {
        icon: 'stack',
        title: {
          pl: 'Ta sama twardość co naturalny dąb',
          en: 'The same hardness as natural oak',
          de: 'Dieselbe Härte wie natürliche Eiche',
        },
        text: {
          pl: 'Wędzenie zmienia kolor, nie właściwości techniczne drewna.',
          en: 'Smoking changes the colour, not the technical properties of the wood.',
          de: 'Das Räuchern ändert die Farbe, nicht die technischen Eigenschaften des Holzes.',
        },
      },
    ],
    faq: [
      {
        question: {
          pl: 'Czy wędzony dąb jest bejcowany?',
          en: 'Is smoked oak stained?',
          de: 'Ist geräucherte Eiche gebeizt?',
        },
        answer: {
          pl: 'Nie. Wędzenie to dym w rysunku drewna, a nie warstwa barwnika — dlatego dwie deski nigdy nie wyglądają identycznie.',
          en: 'No. Smoking is smoke in the grain, not a layer of dye — which is why no two boards look the same.',
          de: 'Nein. Räuchern ist Rauch in der Maserung, keine Farbschicht — deshalb sehen nie zwei Bretter gleich aus.',
        },
      },
      {
        question: {
          pl: 'Czy wędzony obłóg ma te same wymiary co naturalny?',
          en: 'Do smoked battens have the same dimensions as natural ones?',
          de: 'Haben geräucherte Leisten dieselben Maße wie natürliche?',
        },
        answer: {
          pl: 'Tak. Wędzenie zmienia kolor i rysunek, a nie geometrię ani twardość drewna.',
          en: 'Yes. Smoking changes colour and grain, not the geometry or the hardness of the wood.',
          de: 'Ja. Das Räuchern ändert Farbe und Maserung, nicht Geometrie oder Härte.',
        },
      },
      {
        question: {
          pl: 'Czy mogę zamówić wędzony i naturalny dąb w jednym wnętrzu?',
          en: 'Can I order smoked and natural oak for the same room?',
          de: 'Kann ich geräucherte und natürliche Eiche für einen Raum bestellen?',
        },
        answer: {
          pl: 'Tak. Napisz w zapytaniu, czy to materiał samodzielny, czy ma współgrać z naturalnym dębem — podpowiedzimy, jak oba kolory zachowują się obok siebie.',
          en: 'Yes. Tell us in the enquiry whether it is a standalone material or has to live together with natural oak — we will advise on how the two colours behave side by side.',
          de: 'Ja. Schreiben Sie in die Anfrage, ob das Material eigenständig ist oder mit natürlicher Eiche zusammenleben soll — wir beraten zu beiden Farben nebeneinander.',
        },
      },
    ],
    seoTitle: {
      pl: 'Obłóg dębowy wędzony na wymiar',
      en: 'Smoked oak trim battens cut to size',
      de: 'Geräucherte Eichen-Abschlussleiste',
    },
    seoDescription: {
      pl: 'Obłóg dębowy wędzony — dąb wędzony, cięty na wymiar. Głębszy odcień, mocniejszy rysunek. Cena za mb — wycena pisemna.',
      en: 'Smoked oak trim battens — natural oak smoked and cut to size. A deeper tone, a stronger grain. Price per linear metre — written quote.',
      de: 'Geräucherte Eichen-Abschlussleiste — Eiche geräuchert und auf Maß geschnitten. Tieferer Ton, kräftigere Maserung. Preis je lfm — schriftliches Angebot.',
    },
    keywords: {
      pl: 'obłóg dębowy wędzony, dąb wędzony, obłogi dębowe wędzone, dąb wędzony na wymiar, obłóg wędzony dębowy',
      en: 'smoked oak trim, smoked oak battens, smoked oak trim battens, oak smoked to size',
      de: 'geräucherte Eichen-Abschlussleiste, Geräucherte Eiche, Eichenleiste geräuchert, geräucherte Eichenleiste auf Maß',
    },
    color: {
      pl: 'Dąb wędzony — głębszy odcień',
      en: 'Smoked oak — a deeper tone',
      de: 'Geräucherte Eiche — ein tieferer Ton',
    },
    size: {
      pl: 'Na wymiar: długość, przekrój i profil wg zamówienia',
      en: 'Cut to size: length, section and profile to order',
      de: 'Auf Maß: Länge, Querschnitt und Profil nach Bestellung',
    },
    order: 2,
  },
  {
    id: 'lamela-debowa',
    slug: {
      pl: 'lamela-debowa',
      en: 'oak-battens',
      de: 'eichenlamelle',
    },
    ctaLabel: {
      pl: 'Zapytaj o wycenę lameli',
      en: 'Ask for a slat quote',
      de: 'Angebot für Lamellen anfordern',
    },
    name: {
      pl: 'Lamela dębowa 4–8 mm',
      en: 'Oak battens 4–8 mm',
      de: 'Eichenlamelle 4–8 mm',
    },
    summary: {
      pl: 'Wąskie listwy dębowe do zabudowy ściennej i sufitowej — ten sam materiał, zupełnie inna skala.',
      en: 'Narrow oak battens for wall and ceiling cladding — the same material on a completely different scale.',
      de: 'Schmale Eichenlamellen für Wand- und Deckenbekleidung — dasselbe Material, völlig andere Maßstäbe.',
    },
    body: {
      pl: [
        'Lamela to obłóg w mniejszej skali: wąski, prosty element, który układa się w rzędy i tworzy rytm ściany albo sufitu. Grubość dobieramy do konstrukcji: od 4 mm w systemach lekkich do 8 mm tam, gdzie potrzebna jest sztywność i mocniejszy profil.',
        'Dzięki temu, że lamele powstają z tego samego obłogu dębowego, w jednym wnętrzu możesz połączyć szerokie listwy wykończeniowe z rzędami lameli — materiał zostaje ten sam, zmienia się tylko skala.',
        'Najczęściej lamele zamawiają producenci mebli, stolarze i wykonawcy zabudowy na wymiar. Wyślij zapytanie z wymiarami i liczbą elementów, a przygotujemy wycenę.',
      ],
      en: [
        'A batten is an oak trim batten on a smaller scale: a narrow, plain element that is laid in rows to build a rhythm across a wall or a ceiling. We match the thickness to the construction — from 4 mm in lightweight systems up to 8 mm where stiffness and a stronger profile are needed.',
        'Because battens are made from the same oak, a single room can combine wide trim battens with rows of oak battens — the material stays the same, only the scale changes.',
        'Battens are usually ordered by furniture makers, joiners and fit-out contractors. Send an enquiry with the dimensions and the quantity and we will prepare a quote.',
      ],
      de: [
        'Eine Lamelle ist eine Abschlussleiste in kleinerem Maßstab: ein schmales, glattes Element, das in Reihen verlegt wird und einen Rhythmus an Wand oder Decke erzeugt. Die Stärke wählen wir passend zur Konstruktion — von 4 mm in leichten Systemen bis 8 mm dort, wo Steifigkeit und ein kräftigeres Profil gefordert sind.',
        'Da Lamellen aus derselben Eiche entstehen, lässt sich in einem Raum breite Abschlussleiste mit Lamellenreihen kombinieren — das Material bleibt gleich, nur der Maßstab ändert sich.',
        'Lamellen bestellen meist Tischlerei, Schreinere und Ausbauunternehmen. Senden Sie Maße und Stückzahl, wir erstellen das Angebot.',
      ],
    },
    image: {
      src: 'profil-oblogu.jpg',
      alt: {
        pl: 'Profil dębowej listwy wykończeniowej widziany z boku',
        en: 'The profile of an oak trim batten seen from the side',
        de: 'Das Profil einer Eichen-Abschlussleiste von der Seite',
      },
    },
    gallery: [
      {
        src: 'panele-scienne-dab.jpg',
        alt: {
          pl: 'Poziome deski dębowe na ścianie',
          en: 'Horizontal oak boards on a wall',
          de: 'Waagerechte Eichenbretter an einer Wand',
        },
      },
      {
        src: 'dab-z-sakami.jpg',
        alt: {
          pl: 'Dąb z sękami — zbliżenie na naturalny rysunek drewna',
          en: 'Oak with knots — a close-up of the natural grain',
          de: 'Eiche mit Ästen — Nahaufnahme der natürlichen Maserung',
        },
      },
    ],
    specsLead: {
      pl: 'Naturalny dąb (100%), bez farbowania. Grubość 4 albo 8 mm, długość i profil pod Twoją realizację.',
      en: 'Natural oak (100 %), unstained. 4 or 8 mm thick, with length and profile matched to your project.',
      de: 'Natürliche Eiche (100 %), unbehandelt. 4 oder 8 mm stark, Länge und Profil passend zu Ihrem Projekt.',
    },
    specs: [
      {
        icon: 'oak',
        label: {
          pl: 'Materiał',
          en: 'Material',
          de: 'Material',
        },
        value: {
          pl: 'Naturalny dąb (100%)',
          en: 'Natural oak (100%)',
          de: 'Natürliche Eiche (100 %)',
        },
      },
      {
        icon: 'panel',
        label: {
          pl: 'Grubość',
          en: 'Thickness',
          de: 'Stärke',
        },
        value: {
          pl: '4 mm lub 8 mm',
          en: '4 mm or 8 mm',
          de: '4 mm oder 8 mm',
        },
      },
      {
        icon: 'ruler',
        label: {
          pl: 'Długość',
          en: 'Length',
          de: 'Länge',
        },
        value: {
          pl: 'Na wymiar, wg zamówienia',
          en: 'Cut to order',
          de: 'Nach Maß gefertigt',
        },
      },
      {
        icon: 'door',
        label: {
          pl: 'Profil',
          en: 'Profile',
          de: 'Profil',
        },
        value: {
          pl: 'Prosty lub piętro-wpust',
          en: 'Plain or tongue and groove',
          de: 'Einfach oder Nut und Feder',
        },
      },
      {
        icon: 'truck',
        label: {
          pl: 'Wysyłka',
          en: 'Shipping',
          de: 'Versand',
        },
        value: {
          pl: 'Kurierem, na terenie całej Polski',
          en: 'By courier within Poland',
          de: 'Per Kurier innerhalb Polens',
        },
      },
    ],
    highlights: [
      {
        icon: 'stack',
        title: {
          pl: 'Dwie grubości do wyboru',
          en: 'Two thicknesses to choose from',
          de: 'Zwei Stärken zur Wahl',
        },
        text: {
          pl: '4 mm do systemów lekkich, 8 mm tam, gdzie liczy się sztywność i profil.',
          en: '4 mm for lightweight systems, 8 mm where stiffness and profile matter.',
          de: '4 mm für leichte Systeme, 8 mm dort, wo Steifigkeit und Profil zählen.',
        },
      },
      {
        icon: 'oak',
        title: {
          pl: 'Ten sam dąb co obłogi',
          en: 'The same oak as the trim battens',
          de: 'Dieselbe Eiche wie bei den Abschlussleisten',
        },
        text: {
          pl: 'Jeden materiał w całym wnętrzu — od szerokiej listwy po rzadź lameli.',
          en: 'One material throughout the room — from a wide trim batten to a row of narrow battens.',
          de: 'Ein Material im ganzen Raum — von der breiten Leiste bis zur Lamellenreihe.',
        },
      },
      {
        icon: 'ruler',
        title: {
          pl: 'Wymiar pod zabudowę',
          en: 'Sized for the fit-out',
          de: 'Maß für den Ausbau',
        },
        text: {
          pl: 'Wysyłamy elementy gotowe do montażu, bez docinania na budowie.',
          en: 'We ship elements ready for installation, without trimming on site.',
          de: 'Wir liefern montagefertige Elemente, ohne Nachschneiden auf der Baustelle.',
        },
      },
    ],
    faq: [
      {
        question: {
          pl: 'Którą grubość wybrać — 4 mm czy 8 mm?',
          en: 'Which thickness should I choose — 4 mm or 8 mm?',
          de: 'Welche Stärke — 4 mm oder 8 mm?',
        },
        answer: {
          pl: '4 mm do systemów lekkich, gdzie liczy się waga. 8 mm tam, gdzie potrzebna jest sztywność i mocniejszy profil.',
          en: '4 mm for lightweight systems where weight matters. 8 mm where stiffness and a stronger profile are needed.',
          de: '4 mm für leichte Systeme, bei denen das Gewicht zählt. 8 mm dort, wo Steifigkeit und ein kräftigeres Profil gefordert sind.',
        },
      },
      {
        question: {
          pl: 'Czy lamele sprzedajecie w stałych długościach?',
          en: 'Do you sell battens in fixed lengths?',
          de: 'Verkaufen Sie Lamellen in festen Längen?',
        },
        answer: {
          pl: 'Nie — długość ustalamy pod zabudowę. Podaj w zapytaniu wymiar elementu i liczbę sztuk.',
          en: 'No — the length follows the fit-out. Send the element size and the number of pieces in your enquiry.',
          de: 'Nein — die Länge richtet sich nach dem Ausbau. Senden Sie Elementmaß und Stückzahl in Ihrer Anfrage.',
        },
      },
      {
        question: {
          pl: 'Czy to ten sam materiał co obłogi dębowe?',
          en: 'Is it the same material as the oak trim battens?',
          de: 'Ist es dasselbe Material wie die Eichen-Abschlussleisten?',
        },
        answer: {
          pl: 'Tak — ta sama naturalna Eiche i ta sama selekcja drewna (bez sęków albo z sękami).',
          en: 'Yes — the same natural oak and the same selection (knot-free or with knots).',
          de: 'Ja — dieselbe natürliche Eiche und dieselbe Selektion (ohne Äste oder mit Ästen).',
        },
      },
    ],
    seoTitle: {
      pl: 'Lamela dębowa 4–8 mm',
      en: 'Oak battens 4–8 mm',
      de: 'Eichenlamelle 4–8 mm',
    },
    seoDescription: {
      pl: 'Lamela dębowa 4–8 mm z naturalnego dębu, cięta na wymiar: do zabudowy ściennej i sufitowej, profil prosty lub piętro-wpust. Cena za mb — wycena pisemna.',
      en: 'Oak battens 4–8 mm in natural oak, cut to size for wall and ceiling cladding, plain or tongue and groove. Price per linear metre — written quote.',
      de: 'Eichenlamelle 4–8 mm aus natürlicher Eiche, auf Maß geschnitten: Leisten für Wand- und Deckenbekleidung. Preis je lfm — schriftliches Angebot.',
    },
    keywords: {
      pl: 'lamela dębowa, lamele dębowe, listwa dębowa 4 mm, listwa dębowa 8 mm, lamela dębowa zabudowa, listwy dębowe boazeria',
      // „oak cladding battens" — SERP z samymi producentami i „made to order",
      // dokładnie nasz zamiar. „Eichenlamelle" jednym słowem, nie z myślnikiem:
      // zapytanie z myślnikiem daje parkiet, a nie lamele ścienne.
      en: 'oak batten, oak battens, oak cladding battens, oak slats, wooden slats 4 mm, wooden slats 8 mm, oak slat wall',
      de: 'Eichenlamelle, Eichenlamellen, Eichenleiste, Holzlamelle 4 mm, Holzlamelle 8 mm, Lamellenwand Eiche',
    },
    color: {
      pl: 'Naturalny dąb — odcień zależny od deski',
      en: 'Natural oak — shade varies by board',
      de: 'Natürliche Eiche — Farbton je nach Brett',
    },
    size: {
      pl: 'Grubość 4 mm albo 8 mm, długość na wymiar',
      en: 'Thickness 4 mm or 8 mm, length cut to size',
      de: 'Stärke 4 mm oder 8 mm, Länge auf Maß',
    },
    order: 3,
  },
  {
    id: 'panele-dabowe',
    slug: {
      pl: 'panele-sufitowe-i-scienne',
      en: 'oak-ceiling-and-wall-panels',
      de: 'eichen-decken-und-wandpaneele',
    },
    ctaLabel: {
      pl: 'Zapytaj o panele sufitowe',
      en: 'Ask for ceiling panels',
      de: 'Deckenpaneele anfragen',
    },
    name: {
      pl: 'Panele sufitowe i ścienne z obłogów',
      en: 'Oak ceiling and wall panels',
      de: 'Eichen-Decken- und Wandpaneele',
    },
    summary: {
      pl: 'Gotowe panele z naszych dębowych obłogów — boazeria i okładziny sufitowe w jednej selekcji drewna.',
      en: 'Ready-made panels from our oak trim battens — cladding and ceiling finishes in one wood selection.',
      de: 'Fertige Paneele aus unseren Eichen-Abschlussleisten — Wandverkleidung und Deckenbekleidung in einer Holzselektion.',
    },
    body: {
      pl: [
        'To najbardziej praktyczna forma pracy z naszym drewnem. Z obłogów dębowych powstają gotowe panele sufitowe i ścienne — z gotowymi profilami i krawędziami, przygotowane do montażu.',
        'Panele robimy w różnych selekcjach drewna: od dębu bez sęków, w którym wnętrze jest spokojne i jednolite, po dąb z sękami, który wypełnia ścianę i nadaje jej charakter. Ten sam materiał, zupełnie inne wnętrze.',
        'Gotowe panele sufitowe i ścienne SEDO powstają z obłogów dębowych — w dwóch selekcjach: bez sęków i z sękami. Jeśli szukasz konkretnego systemu, napisz do nas: podpowiemy, który z naszych profili pasuje do Twojego projektu.',
      ],
      en: [
        'This is the most practical way to work with our wood. Oak trim battens become ready-made ceiling and wall panels — with finished profiles and edges, prepared for installation.',
        'We produce panels in different wood selections: from knot-free oak, which gives a calm and uniform interior, to oak with knots, which fills the wall and gives it character. The same material, a completely different room.',
        'SEDO ready-made ceiling and wall panels are made from oak trim battens — in two selections: knot-free and with knots. If you are looking for a specific system, write to us and we will tell you which of our profiles fits your project.',
      ],
      de: [
        'So wird am praktischsten mit unserem Holz gearbeitet. Aus Eichen-Abschlussleisten entstehen fertige Decken- und Wandpaneele — mit fertigen Profilen und Kanten, montagebereit.',
        'Wir fertigen Paneele in verschiedenen Holzselektionen: von Eiche ohne Äste, die einen ruhigen, einheitlichen Raum ergibt, bis zur Eiche mit Ästen, die die Wand füllt und ihr Charakter gibt. Dasselbe Material, ein völlig anderer Raum.',
        'Fertige Decken- und Wandpaneele von SEDO entstehen aus Eichen-Abschlussleisten — in zwei Selektionen: ohne Äste und mit Ästen. Wenn Sie ein bestimmtes System suchen, schreiben Sie uns: Wir sagen Ihnen, welches unserer Profile zu Ihrem Projekt passt.',
      ],
    },
    image: {
      src: 'panele-scienne-dab.jpg',
      alt: {
        pl: 'Ściana wykończona poziomymi deskami dębowymi',
        en: 'A wall finished with horizontal oak boards',
        de: 'Eine Wand mit waagerechten Eichenbrettern',
      },
    },
    gallery: [
      {
        src: 'sedo-warianty.png',
        alt: {
          pl: 'Dwa warianty paneli sufitowych SEDO: bez sęków i z sękami',
          en: 'Two SEDO ceiling panel variants: knot-free and with knots',
          de: 'Zwei Varianten von SEDO-Deckenpaneelen: ohne Äste und mit Ästen',
        },
        // Gráfico con rótulos impresos: banda a lo ancho con su proporción
        // real. Recortado a 3/4 perdía las etiquetas «Bez nud» / «Z nudami».
        ratio: '3 / 2',
        full: true,
      },
      {
        src: 'sufit-sedo-realny.jpg',
        alt: {
          pl: 'Sufit z paneli dębowych z wpuszczonymi punktami świetlnymi',
          en: 'Oak panel ceiling with recessed spotlights',
          de: 'Eichenpaneel-Decke mit eingelassenen Spots',
        },
      },
      {
        src: 'deski-z-sakami.jpg',
        alt: {
          pl: 'Dwie deski dębowe z sękami w naturalnej selekcji',
          en: 'Two oak boards with knots in the natural selection',
          de: 'Zwei Eichenbretter mit Ästen in natürlicher Selektion',
        },
      },
      {
        src: 'deska-debowa-naturalna.jpg',
        alt: {
          pl: 'Deski dębowe w naturalnej selekcji',
          en: 'Oak boards in the natural selection',
          de: 'Eichenbretter in natürlicher Selektion',
        },
      },
    ],
    specsLead: {
      pl: 'Naturalny dąb (100%), bez farbowania. Gotowy moduł z profili i krawędzią — do montażu bez docinania.',
      en: 'Natural oak (100 %), unstained. A ready module with profiles and edges — installed without cutting on site.',
      de: 'Natürliche Eiche (100 %), unbehandelt. Ein fertiges Modul mit Profilen und Kanten — montagefertig ohne Nachschnitt.',
    },
    specs: [
      {
        icon: 'oak',
        label: {
          pl: 'Materiał',
          en: 'Material',
          de: 'Material',
        },
        value: {
          pl: 'Naturalny dąb (100%)',
          en: 'Natural oak (100%)',
          de: 'Natürliche Eiche (100 %)',
        },
      },
      {
        icon: 'house',
        label: {
          pl: 'Rodzaj',
          en: 'Type',
          de: 'Art',
        },
        value: {
          pl: 'Panele sufitowe i ścienne',
          en: 'Ceiling and wall panels',
          de: 'Decken- und Wandpaneele',
        },
      },
      {
        icon: 'stack',
        label: {
          pl: 'Selekcja',
          en: 'Selection',
          de: 'Selektion',
        },
        value: {
          pl: 'Bez sęków / z sękami',
          en: 'Knot-free / with knots',
          de: 'Ohne Äste / mit Ästen',
        },
      },
      {
        icon: 'leaf',
        label: {
          pl: 'Wykończenie',
          en: 'Finish',
          de: 'Oberfläche',
        },
        value: {
          pl: 'Naturalne / szczotkowane / wędzone',
          en: 'Natural / brushed / smoked',
          de: 'Natur / gebürstet / geräuchert',
        },
      },
      {
        icon: 'truck',
        label: {
          pl: 'Wysyłka',
          en: 'Shipping',
          de: 'Versand',
        },
        value: {
          pl: 'Kurierem, na terenie całej Polski',
          en: 'By courier within Poland',
          de: 'Per Kurier innerhalb Polens',
        },
      },
    ],
    highlights: [
      {
        icon: 'workshop',
        title: {
          pl: 'Gotowe do montażu',
          en: 'Ready for installation',
          de: 'Montagefertig',
        },
        text: {
          pl: 'Profile i krawędzie są już wykonane.',
          en: 'Profiles and edges are already there.',
          de: 'Profil und Kante sind bereits gefertigt.',
        },
      },
      {
        icon: 'oak',
        title: {
          pl: 'Dwie selekcje, dwa wnętrza',
          en: 'Two selections, two interiors',
          de: 'Zwei Selektionen, zwei Räume',
        },
        text: {
          pl: 'Dąb bez sęków albo z sękami — wybierasz, jak ma wyglądać ściana.',
          en: 'Knot-free or knotty oak — you decide how the wall should look.',
          de: 'Eiche ohne Äste oder mit Ästen — Sie bestimmen, wie die Wand wirken soll.',
        },
      },
      {
        icon: 'stack',
        title: {
          pl: 'Gotowe panele',
          en: 'Ready-made panels',
          de: 'Fertige Paneele',
        },
        text: {
          pl: 'Z naszych obłogów powstają gotowe panele sufitowe i ścienne SEDO.',
          en: 'SEDO ready-made ceiling and wall panels are made from our trim battens.',
          de: 'Fertige Decken- und Wandpaneele von SEDO entstehen aus unseren Abschlussleisten.',
        },
      },
    ],
    faq: [
      {
        question: {
          pl: 'Czy panele są gotowe do montażu?',
          en: 'Are the panels ready for installation?',
          de: 'Sind die Paneele montagefertig?',
        },
        answer: {
          pl: 'Tak. Profile i krawędzie są gotowe — na budowie nie trzeba docinać.',
          en: 'Yes. Profiles and edges are finished — nothing needs trimming on site.',
          de: 'Ja. Profile und Kanten sind fertig — auf der Baustelle wird nichts nachgeschnitten.',
        },
      },
      {
        question: {
          pl: 'W jakich wariantach robicie panele?',
          en: 'Which variants do you produce?',
          de: 'Welche Varianten fertigen Sie?',
        },
        answer: {
          pl: 'W dwóch selekcjach drewna (bez sęków i z sękami) oraz w trzech wykończeniach: naturalne, szczotkowane i wędzone.',
          en: 'In two wood selections (knot-free and with knots) and three finishes: natural, brushed and smoked.',
          de: 'In zwei Holzselektionen (ohne Äste und mit Ästen) und drei Oberflächen: natur, gebürstet und geräuchert.',
        },
      },
      {
        question: {
          pl: 'Czy format paneli ustalamy pod projekt?',
          en: 'Do you set the panel format to the project?',
          de: 'Richten Sie das Paneelformat nach dem Projekt?',
        },
        answer: {
          pl: 'Tak. Format modułu i sposób montażu potwierdzamy w wycenie — napisz, jaki system realizujesz.',
          en: 'Yes. The module format and the fixing method are confirmed in the quote — tell us which system you are building.',
          de: 'Ja. Modulformat und Befestigungsart bestätigen wir im Angebot — schreiben Sie, welches System Sie realisieren.',
        },
      },
    ],
    seoTitle: {
      pl: 'Panele sufitowe i ścienne z dębu',
      en: 'Oak ceiling and wall panels',
      de: 'Eichen-Decken- und Wandpaneele',
    },
    seoDescription: {
      pl: 'Panele sufitowe i ścienne z naturalnego dębu, z naszych obłogów. Selekcja bez sęków i z sękami, wykończenie naturalne lub wędzone. Cena za m² — wycena pisemna.',
      en: 'Oak ceiling and wall panels made from our oak trim battens. Knot-free and knotty selections, natural or smoked finish. Price per m² — written quote.',
      de: 'Eichen-Decken- und Wandpaneele aus unseren Abschlussleisten. Selektion ohne Äste und mit Ästen, natur oder geräuchert. Preis je m² — schriftliches Angebot.',
    },
    keywords: {
      pl: 'panele sufitowe dębowe, panele ścienne dębowe, boazeria dębowa, panele dębowe na wymiar, okładzina dębowa, panele dębowe SEDO',
      en: 'oak ceiling panels, oak wall panels, oak cladding, oak wall panelling, SEDO oak panels',
      de: 'Eichen-Deckenpaneele, Eichen-Wandpaneele, Eichen-Verkleidung, Wandpaneele Eiche, SEDO Eichenpaneele',
    },
    color: {
      pl: 'Naturalny dąb — wykończenie naturalne lub wędzone',
      en: 'Natural oak — natural or smoked finish',
      de: 'Natürliche Eiche — natur oder geräuchert',
    },
    size: {
      pl: 'Moduł na wymiar — wg zamówienia',
      en: 'Module cut to size — to order',
      de: 'Modul auf Maß — nach Bestellung',
    },
    order: 4,
  },
];

export const sortedProducts = [...products].sort((a, b) => a.order - b.order);
