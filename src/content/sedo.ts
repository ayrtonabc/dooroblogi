import type { L } from './products';

/**
 * Bloque de paneles SEDO en la home.
 *
 * Maqueta del cliente (28/10): dos franjas seguidas.
 *  1. Franja alta: texto a la izquierda con tres características con icono y
 *     la foto a sangre a la derecha.
 *  2. Franja baja: las dos selecciones (leyenda + fotos del material) y la
 *     tarjeta del «sistema» a la derecha.
 *
 * El copy de la franja alta es el que el cliente escribió en la ronda 5
 * (entradilla, dos beneficios, cierre). Los huecos que la maqueta añade y que
 * el cliente no había escrito —la tercera característica, la leyenda, la
 * tarjeta— llevan el texto de la maqueta.
 */
export const sedoPanels = {
  kicker: {
    pl: 'Sufity dębowe — panele SEDO',
    en: 'Oak ceilings — SEDO panels',
    de: 'Eichendecken — SEDO-Paneele',
  } satisfies L,
  title: {
    pl: 'Panele sufitowe i ścienne z naszych obłogów',
    en: 'Ceiling and wall panels from our trim battens',
    de: 'Decken- und Wandpaneele aus unseren Abschlussleisten',
  } satisfies L,
  lead: {
    pl: 'Sufit to przestrzeń, w której dąb prezentuje całe swoje piękno na największej powierzchni. Panele sufitowe i ścienne SEDO powstają z naszych obłogów dębowych — profil i krawędź gotowe do montażu.',
    en: 'A ceiling is the space where oak shows all its beauty across the largest surface. SEDO ceiling and wall panels are made from our own oak trim battens — profile and edge ready to install.',
    de: 'Die Decke ist der Raum, in dem Eiche ihre ganze Schönheit auf der größten Fläche zeigt. Die Decken- und Wandpaneele SEDO entstehen aus unseren Eichen-Abschlussleisten — Profil und Kante montierfertig.',
  } satisfies L,
  /** Las tres características con icono, en tres columnas con filete. */
  features: [
    {
      icon: 'stack',
      title: {
        pl: 'Kompleksowe wykończenie',
        en: 'Complete finish',
        de: 'Komplette Oberfläche',
      } satisfies L,
      text: {
        pl: 'Dostarczamy w pełni wykończone: profil i krawędzie gotowe do montażu, co skraca czas prac na inwestycji. Format każdego modułu dopasowujemy w wycenie, pod Twój system montażowy.',
        en: 'We deliver fully finished material: the profile and the edges are ready to install, which shortens the work on site. We adapt the format of each module in the quote, to your installation system.',
        de: 'Wir liefern vollständig ausgearbeitet: Profil und Kanten sind montierfertig, das verkürzt die Arbeiten auf der Baustelle. Das Format jedes Moduls passen wir im Angebot an, an Ihr Montagesystem.',
      } satisfies L,
    },
    {
      icon: 'oak',
      title: {
        pl: 'Jednolita selekcja na całej powierzchni',
        en: 'One selection across the whole surface',
        de: 'Einheitliche Selektion auf der gesamten Fläche',
      } satisfies L,
      text: {
        pl: 'Wybierasz jeden wariant na cały sufit — deski pasują do siebie i tworzą spójną kompozycję.',
        en: 'You choose one variant for the entire ceiling — the boards match each other and form a coherent composition.',
        de: 'Sie wählen eine Variante für die gesamte Decke — die Bretter passen zueinander und ergeben eine stimmige Komposition.',
      } satisfies L,
    },
    {
      icon: 'leaf',
      title: {
        pl: 'Naturalny dąb',
        en: 'Natural oak',
        de: 'Natürliche Eiche',
      } satisfies L,
      text: {
        pl: 'Bez farbowania i cieniowania. Kolor i rysunek pochodzą z drewna.',
        en: 'No staining and no toning. The colour and the figure come from the wood.',
        de: 'Ohne Färbung und ohne Tonung. Farbe und Maserung kommen aus dem Holz.',
      } satisfies L,
    },
  ],
  /** Cierre antes de los botones: la pregunta que lleva al formulario. */
  closing: {
    pl: 'Szukasz idealnego rozwiązania na swój sufit lub ścianę?',
    en: 'Looking for the right solution for your ceiling or wall?',
    de: 'Suchen Sie die passende Lösung für Ihre Decke oder Wand?',
  } satisfies L,
  cta: {
    pl: 'Zapytaj o panele sufitowe',
    en: 'Ask about ceiling panels',
    de: 'Deckenpaneele anfragen',
  } satisfies L,
  ctaSecondary: {
    pl: 'Zobacz produkty',
    en: 'See the products',
    de: 'Produkte ansehen',
  } satisfies L,
  photo: {
    src: 'sufit-sedo-realny.jpg',
    alt: {
      pl: 'Sufit z paneli dębowych z wpuszczonymi punktami świetlnymi',
      en: 'Oak panel ceiling with recessed spotlights',
      de: 'Eichenpaneel-Decke mit eingelassenen Spots',
    } satisfies L,
    caption: {
      pl: 'Gotowe panele sufitowe SEDO w dwóch wariantach wykończenia drewna: bez sęków i z sękami.',
      en: 'SEDO ready-made ceiling panels in two wood finishes: knot-free and with knots.',
      de: 'Fertige SEDO-Deckenpaneele in zwei Holzausführungen: ohne Äste und mit Ästen.',
    } satisfies L,
  },
};

/**
 * Franja baja de la maqueta: las dos selecciones y la tarjeta del sistema.
 * Sustituye a la antigua sección «Selección» de la home, que ocupaba más
 * alto que el texto que explicaba.
 */
export const sedoVariants = {
  kicker: {
    pl: 'Dwa warianty wykończenia',
    en: 'Two finish variants',
    de: 'Zwei Ausführungen',
  } satisfies L,
  title: {
    pl: 'Bez sęków i z sękami',
    en: 'Knot-free and with knots',
    de: 'Ohne Äste und mit Ästen',
  } satisfies L,
  lead: {
    pl: 'Różnica jest tylko w selekcji. Twardość, geometria i sposób montażu są takie same — zmienia się charakter wnętrza.',
    en: 'Only the selection differs. Hardness, geometry and installation are identical — what changes is the character of the room.',
    de: 'Nur die Selektion unterscheidet sich. Härte, Geometrie und Montage sind identisch — verändert wird der Charakter des Raums.',
  } satisfies L,
  /**
   * Leyenda bajo el texto: miniatura redonda, nombre y una línea.
   *
   * El texto es corto a propósito: en la maqueta las dos entradas van en
   * fila dentro de una columna estrecha y una frase larga las convierte en
   * un ribbons de texto estrecho.
   */
  legend: [
    {
      title: { pl: 'Bez sęków', en: 'Knot-free', de: 'Ohne Äste' } satisfies L,
      text: {
        pl: 'Równa faktura, spokojna powierzchnia.',
        en: 'An even texture, a calm surface.',
        de: 'Gleichmäßige Struktur, ruhige Fläche.',
      } satisfies L,
    },
    {
      title: { pl: 'Z sękami', en: 'With knots', de: 'Mit Ästen' } satisfies L,
      text: {
        pl: 'Naturalny rysunek drewna, więcej charakteru.',
        en: 'The natural figure of the wood, more character.',
        de: 'Natürliche Maserung, mehr Charakter.',
      } satisfies L,
    },
  ],
  /** Las dos fotos del material, con su chapa y su pie. */
  shots: [
    {
      src: 'sedo-bez-sedkow.jpg',
      chip: { pl: 'Bez sęków', en: 'Knot-free', de: 'Ohne Äste' } satisfies L,
      alt: {
        pl: 'Panele dębowe bez sęków — gładka faktura drewna',
        en: 'Knot-free oak panels — the even texture of the wood',
        de: 'Eichenpaneele ohne Äste — die gleichmäßige Struktur des Holzes',
      } satisfies L,
      caption: {
        pl: 'Panele sufitowe SEDO — selekcja bez sęków',
        en: 'SEDO ceiling panels — knot-free selection',
        de: 'SEDO-Deckenpaneele — Selektion ohne Äste',
      } satisfies L,
    },
    {
      src: 'sedo-z-sedkami.jpg',
      chip: { pl: 'Z sękami', en: 'With knots', de: 'Mit Ästen' } satisfies L,
      alt: {
        pl: 'Panele dębowe z sękami — naturalny rysunek drewna',
        en: 'Oak panels with knots — the natural figure of the wood',
        de: 'Eichenpaneele mit Ästen — die natürliche Maserung des Holzes',
      } satisfies L,
      caption: {
        pl: 'Panele sufitowe SEDO — selekcja z sękami',
        en: 'SEDO ceiling panels — selection with knots',
        de: 'SEDO-Deckenpaneele — Selektion mit Ästen',
      } satisfies L,
    },
  ],
  /** Tarjeta de la derecha: el sistema completo y sus dos salidas. */
  system: {
    title: {
      pl: 'Gotowy system do Twojego wnętrza',
      en: 'A ready system for your interior',
      de: 'Ein fertiges System für Ihren Innenraum',
    } satisfies L,
    text: {
      pl: 'Panele SEDO z naszych obłogów to szybki montaż, precyzyjne wykończenie i naturalne piękno dębu w każdej przestrzeni.',
      en: 'SEDO panels made from our own battens mean quick installation, precise finishing and the natural beauty of oak in every room.',
      de: 'SEDO-Paneele aus unseren eigenen Abschlussleisten bedeuten schnelle Montage, präzise Ausarbeitung und die natürliche Schönheit der Eiche in jedem Raum.',
    } satisfies L,
    uses: [
      { icon: 'house', label: { pl: 'Sufity', en: 'Ceilings', de: 'Decken' } satisfies L },
      { icon: 'panel', label: { pl: 'Ściany', en: 'Walls', de: 'Wände' } satisfies L },
      { icon: 'door', label: { pl: 'Drzwi', en: 'Doors', de: 'Türen' } satisfies L },
    ],
    cta: {
      pl: 'Poproś o wycenę',
      en: 'Request a quote',
      de: 'Angebot anfordern',
    } satisfies L,
    ctaCall: {
      pl: 'Zadzwoń',
      en: 'Call',
      de: 'Anrufen',
    } satisfies L,
  },
};
