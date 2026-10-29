import type { Locale } from '../i18n';
import type { L } from './products';

/** Nazwa ikony z `src/components/Icon.astro`. */
export type FactIcon = 'oak' | 'ruler' | 'truck' | 'pin';

/** Fakt w hero: ikona przypisana do pojęcia + tekst w trzech językach. */
export type Fact = { icon: FactIcon; text: L };

/* ------------------------------------------------------------------ *
 * Strona główna
 * ------------------------------------------------------------------ */

export const home = {
  /**
   * Meta título y descripción de la portada. Viven aquí y no en la
   * plantilla: el copy se cambia en un solo sitio (regla 1 de AGENTS.md).
   */
  seo: {
    title: {
      pl: 'Obłóg dębowy — producent ze Słonecznika',
      en: 'Oak trim battens — manufacturer in Poland',
      de: 'Eichen-Abschlussleisten — Hersteller',
    } satisfies L,
    description: {
      pl: 'Obłogi dębowe cięte na wymiar, lamele 4–8 mm i gotowe panele sufitowe i ścienne. 100% naturalny dąb ze Słonecznika k. Olsztyna. Cennik na zapytanie.',
      en: 'Oak trim battens cut to size, oak battens 4–8 mm and ready-made ceiling and wall panels. 100% natural oak from Słonecznik near Olsztyn. Quote on request.',
      de: 'Eichen-Abschlussleisten auf Maß, Eichenlamellen 4–8 mm und fertige Decken- und Wandpaneele. 100 % natürliche Eiche aus Słonecznik. Angebot auf Anfrage.',
    } satisfies L,
  },
  hero: {
    eyebrow: {
      pl: 'Naturalny dąb · Olsztyn',
      en: 'Natural oak · Olsztyn',
      de: 'Natürliche Eiche · Olsztyn',
    } satisfies L,
    title: {
      /**
       * El titular pone los paneles delante, pero no pierde la keyword
       * principal de la home (`obłóg dębowy`): las dos cosas que vendemos
       * se nombran en la misma línea, en vez de dos titulares que compiten
       * entre sí.
       */
      pl: 'Obłóg dębowy i gotowe panele sufitowe',
      en: 'Oak trim battens and ready-made ceiling panels',
      de: 'Eichen-Abschlussleisten und fertige Deckenpaneele',
    } satisfies L,
    lead: {
      pl: 'Obłóg dębowy to listwa wykończeniowa z naturalnego dębu, cięta na wymiar — do podłóg, ścian, okien i drzwi przesuwnych. Do tego lamele 4–8 mm oraz gotowe panele sufitowe i ścienne. 100% dąb naturalny, dwie selekcje: bez sęków i z sękami. Wysyłka kurierem w całej Polsce, produkcja w Słoneczniku.',
      en: 'An oak trim batten is a finish board in natural oak, cut to size — for floors, walls, window reveals and sliding door frames. Plus 4–8 mm battens and ready-made ceiling and wall panels. 100% natural oak, two selections: knot-free and with knots. Courier delivery within Poland, produced in Słonecznik.',
      de: 'Eine Eichen-Abschlussleiste ist ein Abschlussbrett aus natürlicher Eiche, auf Maß geschnitten — für Boden, Wand, Fensterlaibung und Schiebetürrahmen. Dazu Lamellen 4–8 mm und fertige Decken- und Wandpaneele. 100 % natürliche Eiche, zwei Selektionen: ohne Äste und mit Ästen. Versand per Kurier in ganz Polen, Fertigung in Słonecznik.',
    } satisfies L,
    /**
     * Fakty w hero. Ikona jest przypisana do pojęcia, a tekst do języka —
     * dzięki temu kolejność pozycji nie rozspina się między językami.
     */
    facts: [
      { icon: 'oak', text: { pl: '100% naturalny dąb', en: '100% natural oak', de: '100 % natürliche Eiche' } },
      { icon: 'ruler', text: { pl: 'Cięcie na wymiar', en: 'Cut to size', de: 'Auf Maß geschnitten' } },
      { icon: 'stack', text: { pl: 'Dwie selekcje drewna', en: 'Two wood selections', de: 'Zwei Holzselektionen' } },
      { icon: 'pin', text: { pl: 'Słonecznik k. Olsztyna', en: 'Słonecznik near Olsztyn', de: 'Słonecznik bei Olsztyn' } },
    ] satisfies Fact[],
  },

  intro: {
    kicker: {
      pl: 'O obłogach',
      en: 'About the trim battens',
      de: 'Über die Abschlussleisten',
    } satisfies L,
    title: {
      pl: 'Drewno, które widać z bliska',
      en: 'Wood you get to see up close',
      de: 'Holz, das man aus der Nähe sieht',
    } satisfies L,
    body: {
      pl: [
        'Obłóg kładzie się tam, gdzie oko się zatrzymuje: przy podłodze, wokół okna, na ścianie, w przejściu między pokojami. Dlatego cięcie robimy pod wymiar, a nie pod stan magazynowy.',
        'Pracujemy z naturalnym dębem. Nie farbujemy i nie upodobniamy go do innego drewna — zostawiamy rysunek, sęki i kolor, jakie są w drewnie. W ofercie masz dwie selekcje: dąb bez sęków, w którym liczy się sama faktura, oraz dąb z sękami, w którym rysunek jest częścią wnętrza.',
        'Z tego samego materiału powstają gotowe panele sufitowe i ścienne — nasze obłogi są bazą dla paneli SEDO. Jeśli potrzebujesz konkretnego profilu albo gotowej długości, napisz: wycenimy i podamy termin realizacji.',
      ],
      en: [
        'A trim batten goes exactly where the eye stops: at the floor, around a window, on a wall, in the transition between rooms. That is why we cut to size rather than to stock dimensions.',
        'We work with natural oak. We do not stain it or make it look like another wood — we keep the figure, the knots and the colour that are in the wood itself. Two selections are available: knot-free oak, where the texture itself is the point, and oak with knots, where the figure becomes part of the interior.',
        'The same material becomes ready-made ceiling and wall panels — our trim battens are the base for SEDO panels. If you need a specific profile or a ready length, write to us: we will quote it and give you a lead time.',
      ],
      de: [
        'Eine Abschlussleiste liegt genau dort, wo das Auge stehen bleibt: am Boden, am Fenster, an der Wand, im Übergang zwischen Räumen. Deshalb schneiden wir auf Maß, nicht auf Lagerdimension.',
        'Wir arbeiten mit natürlicher Eiche. Wir färben sie nicht und lassen sie nicht wie ein anderes Holz aussehen — Figur, Äste und Farbe bleiben, wie sie im Holz sind. Zwei Selektionen stehen zur Wahl: Eiche ohne Äste, bei der die Struktur zählt, und Eiche mit Ästen, bei der die Figur Teil des Raums wird.',
        'Aus demselben Material entstehen fertige Decken- und Wandpaneele — unsere Abschlussleisten sind die Basis für die SEDO-Paneele. Wenn Sie ein bestimmtes Profil oder eine fertige Länge brauchen, schreiben Sie uns: Wir kalkulieren und nennen den Termin.',
      ],
    } satisfies Record<Locale, string[]>,
  },

  products: {
    kicker: {
      pl: 'Oferta',
      en: 'Range',
      de: 'Sortiment',
    } satisfies L,
    title: {
      pl: 'Cztery produkty, jeden materiał',
      en: 'Four products, one material',
      de: 'Vier Produkte, ein Material',
    } satisfies L,
    body: {
      pl: 'Obłóg cięty, obłóg wędzony, lamela i gotowe panele. Wszystko z tego samego naturalnego dębu, żeby w jednym wnętrzu nie kłóciły się ze sobą różne drewna.',
      en: 'A cut trim batten, a smoked trim batten, an oak batten and ready-made panels. All from the same natural oak, so a single room never mixes two different timbers.',
      de: 'Geschnittene Abschlussleiste, geräucherte Abschlussleiste, Lamelle und fertige Paneele. Alles aus derselben natürlichen Eiche, damit sich in einem Raum nie zwei Hölzer widersprechen.',
    } satisfies L,
  },

  applications: {
    kicker: {
      pl: 'Zastosowania',
      en: 'Applications',
      de: 'Anwendungen',
    } satisfies L,
    title: {
      pl: 'Gdzie wchodzi nasz dąb',
      en: 'Where our oak goes',
      de: 'Wohin unsere Eiche geht',
    } satisfies L,
    items: [
      {
        title: {
          pl: 'Boazeria i ściany',
          en: 'Cladding and walls',
          de: 'Verkleidung und Wände',
        } satisfies L,
        text: {
          pl: 'Rzędy lameli i szerokich obłogów, które porządkują dużą ścianę.',
          en: 'Rows of battens and wide trim battens that structure a large wall.',
          de: 'Reihen aus Lamellen und breiten Abschlussleisten, die eine große Wand ordnen.',
        } satisfies L,
      },
      {
        title: {
          pl: 'Panele sufitowe',
          en: 'Ceiling panels',
          de: 'Deckenpaneele',
        } satisfies L,
        text: {
          pl: 'Gotowe moduły z profiliem, przygotowane do montażu bez docinania.',
          en: 'Ready-made modules with a profile, installed without trimming.',
          de: 'Fertige Module mit Profil, montiert ohne Nachschneiden.',
        } satisfies L,
      },
      {
        title: {
          pl: 'Drzwi przesuwne i barn',
          en: 'Sliding and barn doors',
          de: 'Schiebe- und Barntüren',
        } satisfies L,
        text: {
          pl: 'Obłóg jako ramka i prowadnica w drzwiach przesuwnych.',
          en: 'The trim batten as frame and rail in sliding doors.',
          de: 'Die Abschlussleiste als Rahmen und Schiene in Schiebetüren.',
        } satisfies L,
      },
      {
        title: {
          pl: 'Listwy wykończeniowe',
          en: 'Trim and edging',
          de: 'Abschlussleisten',
        } satisfies L,
        text: {
          pl: 'Podłoga, progi, narożniki — miejsce, w którym widać, z czego zrobione.',
          en: 'Floor, thresholds, corners — the place where the material shows.',
          de: 'Boden, Schwellen, Ecken — die Stelle, an der das Material sichtbar wird.',
        } satisfies L,
      },
      {
        title: {
          pl: 'Meble',
          en: 'Furniture',
          de: 'Möbel',
        } satisfies L,
        text: {
          pl: 'Blaty, ramki, fronty — dąb w detalu, który da się dotknąć.',
          en: 'Tops, frames, fronts — oak in a detail you can touch.',
          de: 'Platten, Rahmen, Fronten — Eiche im Detail zum Anfassen.',
        } satisfies L,
      },
      {
        title: {
          pl: 'Domki letniskowe',
          en: 'Holiday cottages',
          de: 'Ferienhäuser',
        } satisfies L,
        text: {
          pl: 'Mazury, Pomorza, Zalew — drewno, które ma być odporne i naturalne.',
          en: 'Masuria, the Baltic coast, the lagoons — wood that has to last and stay natural.',
          de: 'Masuren, Ostseeküste, Lagunen — Holz, das halten und natürlich bleiben muss.',
        } satisfies L,
      },
    ],
  },

  partnership: {
    kicker: {
      pl: 'Gotowe panele',
      en: 'Ready-made panels',
      de: 'Fertige Paneele',
    } satisfies L,
    title: {
      pl: 'Dąb w gotowych panelach SEDO',
      en: 'Oak in SEDO ready-made panels',
      de: 'Eiche in fertigen SEDO-Paneelen',
    } satisfies L,
    body: {
      pl: [
        'Gotowe panele sufitowe i ścienne SEDO powstają z dębowych obłogów — w dwóch wariantach wykończenia: bez sęków oraz z sękami. Ten sam materiał, który obcinasz na wymiar.',
        'Szukasz konkretnego systemu pod swoje wnętrze? Napisz, czym się zajmujesz, a podpowiemy, który z naszych profili najlepiej pasuje.',
      ],
      en: [
        'SEDO ready-made ceiling and wall panels are made from oak trim battens — in two finishes: knot-free and knotty. The same material you order cut to size.',
        'Looking for a specific system for your interior? Write to us, tell us what you are building and we will point out which of our profiles fits best.',
      ],
      de: [
        'Fertige Decken- und Wandpaneele von SEDO entstehen aus Eichen-Abschlussleisten — in zwei Ausführungen: ohne Äste und mit Ästen. Dasselbe Material, das Sie auf Maß schneiden lassen.',
        'Sie suchen ein bestimmtes System für Ihren Innenraum? Schreiben Sie uns, was Sie planen — wir sagen Ihnen, welches unserer Profile am besten passt.',
      ],
    } satisfies Record<Locale, string[]>,
  },

  faq: {
    kicker: {
      pl: 'FAQ',
      en: 'FAQ',
      de: 'FAQ',
    } satisfies L,
    title: {
      pl: 'Najczęstsze pytania',
      en: 'Frequently asked questions',
      de: 'Häufige Fragen',
    } satisfies L,
    lead: {
      pl: 'Sześć pytań, które padają najczęściej — odpowiadamy krótko i wprost.',
      en: 'The six questions we get asked most — answered briefly and straight.',
      de: 'Die sechs häufigsten Fragen — kurz und direkt beantwortet.',
    } satisfies L,
  },
} as const;

/* ------------------------------------------------------------------ *
 * Opisy zdjęć — teksty alternatywne i podpisy pod fotografiami.
 * Trzymamy je obok treści, do której dotyczą, a nie w szablonach.
 * ------------------------------------------------------------------ */

export const media = {
  /** Mapa Polski z flagą — opis alternatywny. */
  mapAlt: {
    pl: 'Mapa Polski z flagą w województwie warmińsko-mazurskim, gdzie znajduje się pracownia Doors Obłogi w Słoneczniku pod Olsztynem.',
    en: 'Map of Poland with the flag in the Warmian-Masurian Voivodeship, where the Doors Obłogi workshop in Słonecznik, near Olsztyn, is located.',
    de: 'Karte von Polen mit der Flagge im Ermland-Masuren, wo die Werkstatt von Doors Obłogi in Słonecznik bei Olsztyn liegt.',
  } satisfies L,
  home: {
    wallAlt: {
      pl: 'Obłóg dębowy zamontowany pionowo na drewnianej ścianie',
      en: 'An oak trim batten mounted vertically on a wooden wall',
      de: 'Eine vertikal an einer Holzwand montierte Eichen-Abschlussleiste',
    },
    wallCaption: {
      pl: 'Obłóg dębowy w drewnianej ścianie',
      en: 'The trim batten in a wooden wall',
      de: 'Die Abschlussleiste in einer Holzwand',
    },
  },
  about: {
    workshopAlt: {
      /**
       * Foto del cliente (28/10): la pila de obłogi en la nave, con el
       * perfil y la krawędź a la vista. Encaja con el título de la página
       * («pracownia obłogów dębowych») mejor que la foto de dąb wędzony,
       * que se queda en la ficha del producto ahumado.
       */
      pl: 'Obłogi dębowe ułożone w hali — widać przekrój i profil wykończenia',
      en: 'Oak trim battens stacked in the workshop — the cross-section and the finish profile are visible',
      de: 'Eichen-Abschlussleisten in der Halle gestapelt — Querschnitt und Abschlussprofil sichtbar',
    },
    battensAlt: {
      pl: 'Obłogi dębowe w pracowni: na pierwszym planie wędzony dąb, za nim naturalny',
      en: 'Oak trim battens in the workshop: smoked oak in front, natural oak behind',
      de: 'Eichen-Abschlussleisten in der Werkstatt: geräucherte Eiche vorn, natürliche Eiche dahinter',
    },
    battensCaption: {
      pl: 'W pracowni: naturalny i wędzony dąb stoją obok siebie — tak je dobieramy.',
      en: 'In the workshop: natural and smoked oak stand side by side — that is how we match them.',
      de: 'In der Werkstatt: natürliche und geräucherte Eiche stehen nebeneinander — so wählen wir sie aus.',
    },
  },
} as const;

/* ------------------------------------------------------------------ *
 * FAQ — wspólne dla całej witryny
 * ------------------------------------------------------------------ */

export interface FaqItem {
  question: L;
  answer: L;
}

/**
 * FAQ — jedna lista dla całej witryny (strona główna, katalog, kontakt).
 *
 * Odpowiedzi celowo są krótkie: jedno–dwa zdania, fakt na pierwszym
 * miejscu, bez zwrotów. Taki format daje się wyrwać w featured snippet
 * i w odpowiedzi asystenta (AEO/GEO) bez ucinania zdania w połowie.
 *
 * Pytania to te, które naprawdę wpadają na Messengerze i w telefonie.
 * Pierwsze pytanie brzmiało „Czym jest obłóg dębowy?" — zastąpiliśmy je
 * pytaniem o selekcje, bo definicja produktu ma już własny blok na stronie
 * głównej (`src/content/definitions.ts`) i powtarzanie jej w dwóch miejscach
 * na jednej stronie tylko rozcieńcza odpowiedź.
 */
export const faq: FaqItem[] = [
  {
    question: {
      pl: 'Czym różni się selekcja bez sęków od selekcji z sękami?',
      en: 'What is the difference between the knot-free and the knotty selection?',
      de: 'Worin unterscheidet sich die Selektion ohne Äste von der Selektion mit Ästen?',
    },
    answer: {
      pl: 'To ten sam dąb i te same wymiary — różni się tylko naturalna struktura drewna. Do selekcji bez sęków wchodzą deski czyste, do selekcji z sękami te z naturalnymi sękami, których nie usuwamy. Cena zależy od selekcji, więc podaj ją w zapytaniu.',
      en: 'Same oak, same sizes — only the natural structure of the timber differs. The knot-free selection takes clean boards, the knotty selection keeps the boards with natural knots, which we do not remove. The price depends on the selection, so name it in your enquiry.',
      de: 'Dieselbe Eiche, dieselben Maße — unterschiedlich ist nur die natürliche Struktur des Holzes. In die Selektion ohne Äste gehen saubere Bretter, in die Selektion mit Ästen die mit natürlichen Ästen, die wir nicht entfernen. Der Preis hängt von der Selektion ab, nennen Sie sie also in Ihrer Anfrage.',
    },
  },
  {
    question: {
      pl: 'Czy sprzedajecie tylko hurtowo?',
      en: 'Do you sell only in wholesale quantities?',
      de: 'Verkaufen Sie nur im Großhandel?',
    },
    answer: {
      pl: 'Nie tylko hurtowo — pracujemy głównie ze stolarzami, wykonawcami zabudowy i firmami wykończeniowymi, ale obsługujemy też inwestorów prywatnych. Napisz skalę zamówienia, a dobierzemy format dostawy i wycenę do niej.',
      en: 'Not wholesale only — we work mainly with joiners, fit-out contractors and finishing companies, but we also serve private clients. Tell us the scale of your order and we will match the delivery format and the quote to it.',
      de: 'Nicht nur Großhandel — wir arbeiten hauptsächlich mit Schreinern, Ausbauunternehmen und Innenausbaubetrieben, bedienen aber auch private Bauherren. Nennen Sie uns die Bestellgröße, wir passen Lieferform und Angebot daran an.',
    },
  },
  {
    question: {
      pl: 'Jak uzyskać cennik?',
      en: 'How do I get the price list?',
      de: 'Wie bekomme ich die Preisliste?',
    },
    answer: {
      pl: 'Wycenę przygotowujemy indywidualnie, bo zależy od profilu, długości, grubości i ilości. Wypełnij formularz wyceny albo zadzwoń — wycenę wyślemy na wskazany e-mail, razem z terminem realizacji.',
      en: 'We prepare the quote individually, because it depends on profile, length, thickness and quantity. Fill in the quote form or call us — we send the quote to the email you give, together with the lead time.',
      de: 'Wir erstellen das Angebot individuell, weil es von Profil, Länge, Stärke und Menge abhängt. Füllen Sie das Anfrageformular aus oder rufen Sie an — das Angebot geht an die angegebene E-Mail, zusammen mit der Lieferzeit.',
    },
  },
  {
    question: {
      pl: 'Czy dostarczacie drewno na wymiar?',
      en: 'Do you supply timber cut to size?',
      de: 'Liefern Sie Holz auf Maß?',
    },
    answer: {
      pl: 'Tak — to podstawa naszej pracy. Podaj długość, przekrój i ilość, a przygotujemy elementy gotowe do montażu. Przy lamelach dodatkowo ustalasz grubość: 4 mm albo 8 mm.',
      en: 'Yes — that is the core of what we do. Give us the length, section and quantity and we will prepare elements ready for installation. For battens you also set the thickness: 4 mm or 8 mm.',
      de: 'Ja — das ist der Kern unserer Arbeit. Nennen Sie Länge, Querschnitt und Menge, wir fertigen montagebereite Elemente. Bei Lamellen legen Sie zusätzlich die Stärke fest: 4 mm oder 8 mm.',
    },
  },
  {
    question: {
      pl: 'Jakie wykończenia są dostępne?',
      en: 'Which finishes are available?',
      de: 'Welche Oberflächen gibt es?',
    },
    answer: {
      pl: 'Naturalna, szczotkowana i wędzona. Wędzienie zmienia kolor drewna, nie jego właściwości techniczne — twardość i geometria zostają takie same.',
      en: 'Natural, brushed and smoked. Smoking changes the colour of the wood, not its technical properties — hardness and geometry stay the same.',
      de: 'Natur, gebürstet und geräuchert. Das Räuchern ändert die Farbe des Holzes, nicht seine technischen Eigenschaften — Härte und Geometrie bleiben gleich.',
    },
  },
  {
    question: {
      pl: 'Gdzie dostarczacie i jak długo trwa realizacja?',
      en: 'Where do you deliver and how long does it take?',
      de: 'Wo liefern Sie hin und wie lange dauert es?',
    },
    answer: {
      pl: 'Wysyłamy kurierem na terenie całej Polski, a dostawę poza Polską wyceniamy indywidualnie. Termin realizacji podajemy przy wycenie, po potwierdzeniu wymiarów.',
      en: 'We ship by courier across Poland, and quote delivery outside Poland individually. We state the lead time with the quote, after dimension confirmation.',
      de: 'Wir versenden per Kurier in ganz Polen, außerhalb kalkulieren wir einzeln. Die Lieferzeit nennen wir mit dem Angebot, nach Bestätigung der Maße.',
    },
  },
];

/* ------------------------------------------------------------------ *
 * O nas
 * ------------------------------------------------------------------ */

export const about = {
  kicker: {
    pl: 'O nas',
    en: 'About us',
    de: 'Über uns',
  } satisfies L,
  title: {
    pl: 'Pracownia obłogów dębowych w Słoneczniku pod Olsztynem',
    en: 'Oak trim batten workshop in Słonecznik near Olsztyn',
    de: 'Werkstatt für Eichen-Abschlussleisten in Słonecznik bei Olsztyn',
  } satisfies L,
  lead: {
    pl: 'Doors Obłogi to pracownia obróbki naturalnego dębu w warmińsko-mazurskim. Robimy listwy wykończeniowe, lamele i gotowe panele — i dostarczamy je stolarzom, wykonawcom oraz ludziom budującym dom.',
    en: 'Doors Obłogi is a natural oak workshop in the Warmian-Masurian region. We produce trim battens, oak battens and ready-made panels — and deliver them to joiners, contractors and people building their own homes.',
    de: 'Doors Obłogi ist eine Werkstatt für natürliche Eiche im Ermland-Masuren. Wir fertigen Abschlussleisten, Lamellen und fertige Paneele — und liefern an Schreinere, Ausbauunternehmen und Menschen, die selbst bauen.',
  } satisfies L,
  body: {
    pl: [
      'Nazwa firmy wprost mówi, czym się zajmujemy: obłogi to dębowe listwy wykończeniowe. Nie robimy mebli i nie jesteśmy marką wykończeniową — robimy drewno, z którego inni wykańczają.',
      'Pracujemy z naturalnym dębem: bez farbowania, bez cieniowania, bez udawania gatunków, których nie ma. Każda sztuka wychodzi z jednego kawałka drewna, więc rysunek na każdej liście jest inny — i tak ma być.',
      'Dla stolarza liczy się powtarzalność: ten sam profil, ta sama selekcja, kolejne partie dostarczone na czas. Dla inwestora prywatnego liczy się drewno, które da się zobaczyć z bliska i które będzie takie samo za pięć lat.',
    ],
    en: [
      'The company name says it plainly: trim battens are oak finish battens. We do not make furniture and we are not a finishing brand — we make the wood other people finish with.',
      'We work with natural oak: no staining, no toning, no pretending to be a species we do not have. Every piece comes from one block of timber, so the figure on every leaf is different — and that is the point.',
      'For a joiner what matters is repeatability: the same profile, the same selection, the next batch delivered on time. For a private client what matters is wood you can look at closely and that will still be there in five years.',
    ],
    de: [
      'Der Firmenname sagt es deutlich: Abschlussleisten sind Eichen-Feinleisten. Wir fertigen keine Möbel und sind keine Marke für Ausbau — wir machen das Holz, mit dem andere ausbauen.',
      'Wir arbeiten mit natürlicher Eiche: ohne Färbung, ohne Tonung, ohne so zu tun, als wären wir eine andere Holzart. Jedes Stück kommt aus einem Block, deshalb ist die Figur auf jedem Blatt anders — und so soll es sein.',
      'Für den Schreiner zählt die Wiederholbarkeit: dasselbe Profil, dieselbe Selektion, die nächste Charge pünktlich. Für private Bauherren zählt Holz, das man aus der Nähe ansehen und auch in fünf Jahren noch vorfinden kann.',
    ],
  } satisfies Record<Locale, string[]>,
  values: {
    kicker: {
      pl: 'Zasady',
      en: 'Principles',
      de: 'Grundsätze',
    } satisfies L,
    title: {
      pl: 'Trzy rzeczy, których u nas nie zmieniamy',
      en: 'Three things we do not change',
      de: 'Drei Dinge, die wir nicht ändern',
    } satisfies L,
    items: [
      {
        title: {
          pl: 'Drewno jest naturalne',
          en: 'The wood stays natural',
          de: 'Das Holz bleibt natürlich',
        } satisfies L,
        text: {
          pl: 'Nie farbujemy i nie cieniujemy. Sęk zostaje sękiem, a jasny dąb nie udaje brązowego.',
          en: 'We do not stain and we do not tone. A knot stays a knot, and pale oak does not pretend to be brown oak.',
          de: 'Wir färben nicht und tonen nicht. Ein Ast bleibt ein Ast, und helle Eiche gibt nicht vor, braun zu sein.',
        } satisfies L,
      },
      {
        title: {
          pl: 'Wymiar jest ustalany przed cięciem',
          en: 'Size is agreed before cutting',
          de: 'Das Maß wird vor dem Schnitt festgelegt',
        } satisfies L,
        text: {
          pl: 'Nie wysyłamy elementów „w przybliżeniu" — na budowie nie ma nic do docinania.',
          en: 'We do not ship elements "roughly" — there is nothing to trim on site.',
          de: 'Wir versenden keine Elemente „ungefähr" — auf der Baustelle wird nichts geschnitten.',
        } satisfies L,
      },
      {
        title: {
          pl: 'Termin jest ustalany przed wysyłką',
          en: 'The date is agreed before shipping',
          de: 'Der Termin wird vor dem Versand festgelegt',
        } satisfies L,
        text: {
          pl: 'Mówimy, kiedy drewno dotrze, i dotrze wtedy. Nie przesuwa się terminu bez uprzedzenia.',
          en: 'We say when the wood will arrive, and it arrives then. We do not move a date without telling you.',
          de: 'Wir sagen, wann das Holz ankommt, und es kommt dann an. Ein Termin wird nicht ohne Nachricht verschoben.',
        } satisfies L,
      },
    ],
  },
} as const;

/* ------------------------------------------------------------------ *
 * Galeria
 * ------------------------------------------------------------------ */

export const gallery = {
  kicker: {
    pl: 'Galeria',
    en: 'Gallery',
    de: 'Galerie',
  } satisfies L,
  title: {
    pl: 'Realizacje z obłogów dębowych',
    en: 'Oak trim projects and photos',
    de: 'Projekte mit Eichen-Abschlussleisten',
  } satisfies L,
  lead: {
    pl: 'Obłogi, lamele i panele z naturalnego dębu — zdjęcia z pracowni i z realizacji.',
    en: 'Trim battens, oak battens and panels in natural oak — photographed in the workshop and on site.',
    de: 'Abschlussleisten, Lamellen und Paneele aus natürlicher Eiche — in der Werkstatt und auf der Baustelle fotografiert.',
  } satisfies L,
  /** Blok tekstowy — daje galerii temat i słowa kluczowe (realizacje, zabudowa). */
  body: {
    pl: [
      'Zdjęcia obłogów dębowych z pracowni w Słoneczniku: profile, wymiary i selekcje drewna widoczne z bliska. Wszystkie zdjęcia są nasze — publikujemy je również na profilu na Facebooku.',
      'Widać tu też realizacje z obłogów dębowych: panele sufitowe z dębu w zabudowie, listwy wykończeniowe przy podłodze i wokół okna, obłóg dębowy w zabudowie meblowej. Każda taka realizacja zaczyna się od obłogu — od listwy, która wchodzi w ścianę, w sufit albo w ramę drzwi przesuwnych.',
      'Najczęściej pytacie o realizacje z paneli SEDO — gotowe panele sufitowe i ścienne powstają z naszych obłogów dębowych. Zdjęcia z pracowni pokazują też dąb wędzony: ten sam materiał, głębszy odcień, ten sam profil.',
    ],
    en: [
      'Photographs of oak trim battens from the workshop in Słonecznik: profiles, dimensions and wood selections seen up close. All the photos are ours — we also post them on our Facebook profile.',
      'You also see oak trim projects here: oak ceiling panels in a fit-out, trim battens along the floor and around a window, oak trim battens inside built-in furniture. Every such project starts with a batten — with the strip that goes into a wall, into a ceiling or into a sliding door frame.',
      'The projects we are asked about most are the SEDO panels — ready-made ceiling and wall panels are made from our oak trim battens. The workshop photographs also show smoked oak: the same material, a deeper tone, the same profile.',
    ],
    de: [
      'Fotos von Eichen-Abschlussleisten aus der Werkstatt in Słonecznik: Profile, Maße und Holzselektionen aus der Nähe. Alle Fotos sind von uns — wir veröffentlichen sie auch auf unserem Facebook-Profil.',
      'Zu sehen sind außerdem Projekte mit Eichen-Abschlussleisten: Eichen-Deckenpaneele im Ausbau, Abschlussleisten am Boden und am Fenster, Eichen-Abschlussleisten im Innenausbau. Jedes solche Projekt beginnt mit der Leiste — mit dem Stück, das in Wand, Decke oder Schiebetürrahmen kommt.',
      'Am häufigsten wird nach den SEDO-Projekten gefragt — fertige Decken- und Wandpaneele entstehen aus unseren Eichen-Abschlussleisten. Die Werkstattfotos zeigen auch geräucherte Eiche: dasselbe Material, ein tieferer Ton, dasselbe Profil.',
    ],
  } satisfies Record<Locale, string[]>,
} as const;

/* ------------------------------------------------------------------ *
 * Cennik i wycena
 * ------------------------------------------------------------------ */

export const quote = {
  kicker: {
    pl: 'Cennik i wycena',
    en: 'Price list & quote',
    de: 'Preisliste & Angebot',
  } satisfies L,
  /**
   * Nagłówek strony. Był wpisany na sztywno w `QuoteView.astro` —
   * przeniesiony tu, bo treść nie mieszka w szablonach (AGENTS.md, pkt 8).
   */
  h1: {
    pl: 'Cennik obłogów dębowych — wycena na wymiar',
    en: 'Price list for oak trim battens — quote to measure',
    de: 'Preisliste für Eichen-Abschlussleisten — Angebot nach Maß',
  } satisfies L,
  title: {
    pl: 'Poproś o cennik',
    en: 'Request the price list',
    de: 'Preisliste anfordern',
  } satisfies L,
  lead: {
    pl: 'Cena zależy od profilu, długości, grubości i ilości, więc nie publikujemy jej na stronie. Wypełnij formularz — przygotujemy wycenę i termin realizacji na wskazany e-mail, a przy okazji podpowiemy, który profil pasuje do Twojego zastosowania.',
    en: 'The price depends on profile, length, thickness and quantity, which is why we do not publish it on the site. Fill in the form and we will prepare a quote and a lead time for your email — and, while we are at it, advise which profile fits your application.',
    de: 'Der Preis hängt von Profil, Länge, Stärke und Menge ab, deshalb steht er nicht auf der Website. Füllen Sie das Formular aus — wir erstellen ein Angebot mit Lieferzeit für die angegebene E-Mail und sagen Ihnen, welches Profil zu Ihrem Einsatz passt.',
  } satisfies L,
} as const;


/* ------------------------------------------------------------------ *
 * Katalog produktów
 * ------------------------------------------------------------------ */

export const catalog = {
  /**
   * Nagłówek i wstęp strony. Były wpisane na sztywno w `CatalogView.astro`
   * — przeniesione tu, bo treść nie mieszka w szablonach (AGENTS.md, pkt 8).
   *
   * SERP (sprawdzone 21.10.2026): na zapytanie „obłóg dębowy" Google
   * i DuckDuckGo mieszają marketplace’y z stronami producentów. Wygrywa
   * strona kategorii, która w pierwszym zdaniu wymienia produkty
   * i wymiary — stąd „4–8 mm" w pierwszych 120 znakach.
   */
  h1: {
    pl: 'Obłogi dębowe, lamele dębowe i panele',
    en: 'Oak trim battens, oak battens and panels',
    de: 'Eichen-Abschlussleisten, Eichenlamellen und Paneele',
  } satisfies L,
  lead: {
    pl: 'Obłogi dębowe, lamele dębowe 4–8 mm oraz panele sufitowe i ścienne — cztery produkty z jednego naturalnego dębu. Różni je zastosowanie, nie materiał, dlatego w jednym wnętrzu wszystko się zgadza.',
    en: 'Oak trim battens, 4–8 mm oak battens and ready-made ceiling and wall panels — four products from one natural oak. What differs is the application, not the material, which is why everything in a single room works together.',
    de: 'Eichen-Abschlussleisten, 4–8-mm-Eichenlamellen und fertige Decken- und Wandpaneele — vier Produkte aus einer natürlichen Eiche. Unterschiedlich ist die Anwendung, nicht das Material, deshalb passt alles in einem Raum zusammen.',
  } satisfies L,
} as const;

/* ------------------------------------------------------------------ *
 * Strona 404
 * ------------------------------------------------------------------ */

export const notFound = {
  title: {
    pl: 'Nie znaleziono strony',
    en: 'Page not found',
    de: 'Seite nicht gefunden',
  } satisfies L,
  lead: {
    pl: 'Ta strona nie istnieje albo została przeniesiona. Poniżej znajdziesz wszystkie sekcje.',
    en: 'This page does not exist or has moved. All sections are listed below.',
    de: 'Diese Seite existiert nicht oder wurde verschoben. Alle Bereiche finden Sie unten.',
  } satisfies L,
  home: {
    pl: 'Strona główna',
    en: 'Home',
    de: 'Startseite',
  } satisfies L,
  products: {
    pl: 'Produkty',
    en: 'Products',
    de: 'Produkte',
  } satisfies L,
  contact: {
    pl: 'Kontakt',
    en: 'Contact',
    de: 'Kontakt',
  } satisfies L,
} as const;

/* ------------------------------------------------------------------ *
 * FAQ cennikowy — strona /cennik/ (FAQPage)
 * ------------------------------------------------------------------ */

export const quoteFaq: FaqItem[] = [
  {
    question: {
      pl: 'Ile kosztuje obłóg dębowy?',
      en: 'How much does an oak trim batten cost?',
      de: 'Was kostet eine Eichen-Abschlussleiste?',
    },
    answer: {
      pl: 'Cena zależy od długości, przekroju, profilu i ilości, więc nie publikujemy jej na stronie. Podaj wymiary w zapytaniu — wyślemy wycenę pisemną z ceną za jednostkę sprzedaży i terminem realizacji.',
      en: 'The price depends on length, section, profile and quantity, which is why we do not publish it. Send the dimensions in your enquiry — we reply with a written quote that states the price per sales unit and the lead time.',
      de: 'Der Preis hängt von Länge, Querschnitt, Profil und Menge ab, deshalb steht er nicht auf der Website. Senden Sie die Maße — Sie erhalten ein schriftliches Angebot mit dem Preis je Verkaufseinheit und der Lieferzeit.',
    },
  },
  {
    question: {
      pl: 'W jakiej jednostce sprzedajecie?',
      en: 'Which unit do you sell in?',
      de: 'In welcher Einheit verkaufen Sie?',
    },
    answer: {
      pl: 'Obłogi i lamele sprzedajemy w metrach bieżących, panele w metrach kwadratowych albo w sztukach. Jednostkę podajemy w wycenie.',
      en: 'Trim battens and oak battens are sold per linear metre, panels per square metre or per piece. The unit is stated in the quote.',
      de: 'Abschlussleisten und Lamellen verkaufen wir je laufender Meter, Paneele je Quadratmeter oder Stück. Die Einheit steht im Angebot.',
    },
  },
  {
    question: {
      pl: 'Czy cena zależy od selekcji drewna?',
      en: 'Does the price depend on the wood selection?',
      de: 'Hängt der Preis von der Holzselektion ab?',
    },
    answer: {
      pl: 'Tak. Dąb bez sęków i dąb z sękami to dwie różne selekcje, więc wyceniamy je oddzielnie — zawsze tej, której dotyczy zapytanie.',
      en: 'Yes. Knot-free oak and oak with knots are two different selections, so we quote them separately — always the one your enquiry is about.',
      de: 'Ja. Eiche ohne Äste und Eiche mit Ästen sind zwei Selektionen, wir kalkulieren sie getrennt — immer die, um die es in der Anfrage geht.',
    },
  },
  {
    question: {
      pl: 'Czy wycena jest wiążąca?',
      en: 'Is the quote binding?',
      de: 'Ist das Angebot verbindlich?',
    },
    answer: {
      pl: 'Tak — wycena obowiązuje na wskazaną partię drewna i na termin, który podajemy. Po akceptacji przygotowujemy zamówienie.',
      en: 'Yes — the quote applies to the stated batch of timber and to the date we give. Once you accept it, we prepare the order.',
      de: 'Ja — das Angebot gilt für die genannte Holzcharge und den genannten Termin. Nach Ihrer Bestätigung bereiten wir den Auftrag vor.',
    },
  },
  {
    question: {
      pl: 'Jak najszybciej dostanę wycenę?',
      en: 'How do I get a quote fastest?',
      de: 'Wie bekomme ich am schnellsten ein Angebot?',
    },
    answer: {
      pl: 'Odpowiadamy w godzinach pracy. Najszybciej telefonicznie albo przez Facebook — tam napiszemy też wymiar, którego nie macie na liście.',
      en: 'We reply during working hours. The fastest way is the phone or Facebook — there you can also send the dimension you do not have on a list.',
      de: 'Wir antworten in den Geschäftszeiten. Am schnellsten telefonisch oder über Facebook — dort schicken Sie auch das Maß, das Ihnen nicht vorliegt.',
    },
  },
  {
    question: {
      pl: 'Czy mogę otrzymać próbkę profilu?',
      en: 'Can I get a sample profile?',
      de: 'Kann ich ein Musterprofil bekommen?',
    },
    answer: {
      pl: 'Dostępność próbki i koszt wysyłki potwierdzamy w wycenie — napisz, jakiego profilu potrzebujesz.',
      en: 'Availability and shipping cost of a sample are confirmed in the quote — tell us which profile you need.',
      de: 'Verfügbarkeit und Versandkosten eines Musters bestätigen wir im Angebot — nennen Sie uns das benötigte Profil.',
    },
  },
];

/* ------------------------------------------------------------------ *
 * Dostawa i płatności
 * ------------------------------------------------------------------ */

export const delivery = {
  kicker: {
    pl: 'Dostawa i płatności',
    en: 'Delivery and payment',
    de: 'Lieferung und Zahlung',
  } satisfies L,
  title: {
    pl: 'Jak wysyłamy obłogi dębowe',
    en: 'How we ship oak trim battens',
    de: 'Wie wir Eichen-Abschlussleisten versenden',
  } satisfies L,
  lead: {
    pl: 'Wszystko wysyłamy kurierem. Opakowanie dobieramy do zamówienia, a termin realizacji podajemy w wycenie, po potwierdzeniu wymiarów.',
    en: 'Everything goes by courier. We match the packaging to the order and state the lead time in the quote, after dimension confirmation.',
    de: 'Alles liefern wir per Kurier. Die Verpackung passen wir an die Bestellung an, die Lieferzeit nennen wir im Angebot, nach Bestätigung der Maße.',
  } satisfies L,
  body: {
    pl: [
      'Zwykłe zlecenie jedzie do Ciebie kurierem na terenie całej Polski. Opakowanie dobieramy do długości i ilości, żeby listwy nie jechały luzem — przy dużych ilościach dostawa idzie na palecie.',
      'Termin realizacji potwierdzamy w wycenie, po ustaleniu profilu, długości i ilości.',
      'Dostawa poza Polską jest możliwa, ale wyceniamy ją indywidualnie — napisz, dokąd i ile drewna, a podamy koszt i czas transportu.',
    ],
    en: [
      'An ordinary order reaches you by courier within Poland. We match the packaging to length and quantity so the battens do not travel loose — larger quantities go on a pallet.',
      'We confirm the lead time in the quote, once profile, length and quantity are agreed.',
      'Shipping outside Poland is possible, but we quote it individually — write to us where and how much timber, and we will give you the cost and the transit time.',
    ],
    de: [
      'Eine normale Bestellung kommt per Kurier innerhalb Polens zu Ihnen. Die Verpackung richten wir nach Länge und Menge, damit die Leisten nicht lose transportiert werden — größere Mengen gehen auf einem Palett.',
      'Die Lieferzeit bestätigen wir im Angebot, sobald Profil, Länge und Menge abgestimmt sind.',
      'Lieferungen außerhalb Polens sind möglich, kalkulieren wir aber einzeln — schreiben Sie uns w welcher Menge und w welche Richtung, wir nennen Kosten und Laufzeit.',
    ],
  } satisfies Record<Locale, string[]>,
} as const;

/* ------------------------------------------------------------------ *
 * Polityka prywatności (RODO / GDPR)
 * ------------------------------------------------------------------ */

export const privacy = {
  kicker: {
    pl: 'Dokumenty',
    en: 'Legal',
    de: 'Rechtliches',
  } satisfies L,
  title: {
    pl: 'Polityka prywatności',
    en: 'Privacy policy',
    de: 'Datenschutzerklärung',
  } satisfies L,
  lead: {
    pl: 'Jak przetwarzamy dane, które zostawiasz w formularzu wyceny. Bez prawniczej waty — sam mechanizm.',
    en: 'How we handle the data you leave in the quote form. No legal padding — just the mechanism.',
    de: 'Wie wir mit den Daten umgehen, die Sie im Anfrageformular hinterlassen. Ohne juristisches Beiwerk — nur der Mechanismus.',
  } satisfies L,
  sections: [
    {
      heading: {
        pl: 'Kto przetwarza Twoje dane',
        en: 'Who processes your data',
        de: 'Wer Ihre Daten verarbeitet',
      } satisfies L,
      body: {
        pl: [
          'Administratorem danych jest Doors Obłogi — pracownia obróbki naturalnego dębu w Słoneczniku k. Olsztyna, woj. warmińsko-mazurskie. Kontakt: telefon +48 696 741 679, e-mail kontakt@doors-oblogi.pl.',
        ],
        en: [
          'The data controller is Doors Obłogi — a natural oak workshop in Słonecznik near Olsztyn, Warmian-Masurian Voivodeship, Poland. Contact: phone +48 696 741 679, email kontakt@doors-oblogi.pl.',
        ],
        de: [
          'Verantwortlicher ist Doors Obłogi — eine Werkstatt für natürliche Eiche in Słonecznik bei Olsztyn, Ermland-Masuren, Polen. Kontakt: Telefon +48 696 741 679, E-Mail kontakt@doors-oblogi.pl.',
        ],
      } satisfies Record<Locale, string[]>,
    },
    {
      heading: {
        pl: 'Jakie dane zbieramy',
        en: 'What data we collect',
        de: 'Welche Daten wir erheben',
      } satisfies L,
      body: {
        pl: [
          'Tylko te, które sam nam podasz w formularzu wyceny: imię i nazwisko, nazwa firmy, e-mail, numer telefonu, numer NIP (jeśli go podasz) oraz treść zapytania — czyli co chcesz zrobić, jakie wymiary i ile sztuk.',
        ],
        en: [
          'Only what you give us in the quote form: first and last name, company name, email, phone number, tax ID (if you give it) and the content of your enquiry — what you want made, the dimensions and the quantity.',
        ],
        de: [
          'Nur was Sie im Anfrageformular angeben: Vor- und Nachname, Firmenname, E-Mail, Telefonnummer, Steuernummer (falls angegeben) und den Inhalt Ihrer Anfrage — was entstehen soll, welche Maße und wie viele Stück.',
        ],
      } satisfies Record<Locale, string[]>,
    },
    {
      heading: {
        pl: 'W jakim celu i na jakiej podstawie',
        en: 'Why and on what basis',
        de: 'Zweck und Rechtsgrundlage',
      } satisfies L,
      body: {
        pl: [
          'Dane przetwarzamy, żeby przygotować wycenę, ustalić profil i termin realizacji oraz odpowiedzieć na zapytanie. Podstawą jest Twoja zgoda (art. 6 ust. 1 lit. a RODO) oraz działania przed zawarciem umowy (art. 6 ust. 1 lit. b RODO).',
        ],
        en: [
          'We process the data to prepare a quote, settle the profile and the lead time, and answer your enquiry. The basis is your consent (Art. 6(1)(a) GDPR) and steps taken before entering into a contract (Art. 6(1)(b) GDPR).',
        ],
        de: [
          'Wir verarbeiten die Daten, um ein Angebot zu erstellen, Profil und Lieferzeit zu klären und Ihre Anfrage zu beantworten. Grundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) und Maßnahmen vor Vertragsschluss (Art. 6 Abs. 1 lit. b DSGVO).',
        ],
      } satisfies Record<Locale, string[]>,
    },
    {
      heading: {
        pl: 'Jak długo je przechowujemy',
        en: 'How long we keep them',
        de: 'Wie lange wir sie speichern',
      } satisfies L,
      body: {
        pl: [
          'Przez czas, w którym przygotowujemy wycenę i prowadzimy z Tobą korespondencję, a następnie przez okres przedawnienia roszczeń. Po tym czasie dane usuwamy.',
        ],
        en: [
          'For as long as we prepare the quote and correspond with you, and then for the statutory limitation period. After that we delete the data.',
        ],
        de: [
          'So lange wir das Angebot erstellen und mit Ihnen korrespondieren, danach für die gesetzliche Verjährungsfrist. Anschließend löschen wir die Daten.',
        ],
      } satisfies Record<Locale, string[]>,
    },
    {
      heading: {
        pl: 'Twoje prawa',
        en: 'Your rights',
        de: 'Ihre Rechte',
      } satisfies L,
      body: {
        pl: [
          'Masz prawo dostępu do swoich danych, ich ich poprawienia, usunięcia, ograniczenia przetwarzania, sprześciwu wobec przetwarzania oraz przenoszenia danych. Zgodę możesz cofnąć w każdej chwili. Skargę możesz złożyć do Urzędu Ochrony Danych Osobowych.',
        ],
        en: [
          'You have the right to access your data, to have it corrected or erased, to restrict or object to processing, and to data portability. You can withdraw consent at any time. You can lodge a complaint with the data protection authority.',
        ],
        de: [
          'Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch und Datenübertragbarkeit. Ihre Einwilligung können Sie jederzeit widerrufen. Beschwerden richten Sie an die Datenschutzaufsichtsbehörde.',
        ],
      } satisfies Record<Locale, string[]>,
    },
    {
      heading: {
        pl: 'Cookies i analityka',
        en: 'Cookies and analytics',
        de: 'Cookies und Analyse',
      } satisfies L,
      body: {
        pl: [
          'Ta strona nie używa plików cookies ani narzędzi analitycznych. Nie mierzymy, gdzie klikasz — po prostu odbieramy Twoją wiadomość.',
        ],
        en: [
          'This site uses no cookies and no analytics tools. We do not track where you click — we simply receive your message.',
        ],
        de: [
          'Diese Seite nutzt keine Cookies und keine Analysewerkzeuge. Wir messen nicht, wo Sie klicken — wir bekommen einfach Ihre Nachricht.',
        ],
      } satisfies Record<Locale, string[]>,
    },
  ],
} as const;
