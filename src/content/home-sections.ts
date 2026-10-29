import type { L } from './products';

/**
 * Bloques NUEVOS de la home, alineados con el brief del cliente:
 *
 *   1. Prioridad a los paneles de techo prefabricados.
 *   2. Dos beneficios concretos de los techos.
 *   3. Servicios: puertas, escaleras y techos (con los techos destacados).
 *   4. Cennik / wycena visibles y canal de contacto directo.
 *
 * Reglas que se respetan aquí (AGENTS.md):
 *   • Sólo datos comprobables: no se inventan precios, plazos, certificados
 *     ni años de experiencia. El cennik es «bajo petición» porque el cliente
 *     todavía no lo ha entregado (lo prepara el Sr. Artur).
 *   • Tono corto y declarativo, como el cliente escribe en Facebook.
 *   • Todo el texto en PL/EN/DE, nada de literales en las plantillas.
 */

/** Cabecera de la home: ahora los techos van primero. */
export const hero = {
  eyebrow: {
    pl: 'Sufity · Ściany · Drzwi — naturalny dąb',
    en: 'Ceilings · walls · doors — natural oak',
    de: 'Decken · Wände · Türen — natürliche Eiche',
  } satisfies L,
  lead: {
    /**
     * El subtítulo NO repite lo que dicen las etiquetas de abajo: aquí va
     * el catálogo (qué vendemos) y la promesa de una respuesta individual;
     * los datos duros (100 % dąb, cięcie na wymiar, dwie selekcje,
     * Słonecznik) van en `home.hero.facts`.
     */
    pl: 'Panele dębowe, obłogi i lamele do wykończenia wnętrz. Gotowe panele z naszych obłogów, wycena indywidualna.',
    en: 'Oak panels, trim battens and slats for interior finishes. Ready-made panels from our own battens, an individual quote.',
    de: 'Eichenpaneele, Abschlussleisten und Lamellen für den Innenausbau. Fertige Paneele aus unseren eigenen Abschlussleisten, individuelles Angebot.',
  } satisfies L,
};

/**
 * Bloque estrella: paneles de techo. Es la sección que el cliente quiere
 * que domine, y sustituye a la antigua sección de «colaboración SEDO»
 * (que ahora es la prueba dentro de este mismo bloque).
 *
 * Copy del cliente (28/10). La «prueba» que antes iba aquí —los paneles
 * salen de nuestros propios obłogi— no desaparece: pasa al entradilla, que
 * ahora lo dice de entrada, y los dos variantes de madera, que antes
 * estaban en el pie de foto, tienen su propio apartado.

/**
 * La definición deja de ser una tabla de trece filas. En la home queda una
 * frase grande y cuatro cifras que resumen el producto; la especificación
 * completa vive en la ficha, que es donde se consulta.
 */
export const definitionStats = {
  kicker: {
    pl: 'Obłóg dębowy',
    en: 'Oak trim batten',
    de: 'Eichen-Abschlussleiste',
  } satisfies L,
  /** El kicker ya lleva la palabra clave: el H2 dice qué se cuenta. */
  title: {
    pl: 'Czym jest i jakie ma parametry',
    en: 'What it is and how it is specified',
    de: 'Was sie ist und wie sie spezifiziert wird',
  } satisfies L,
  facts: [
    {
      value: { pl: '100%', en: '100%', de: '100 %' } satisfies L,
      label: { pl: 'naturalny dąb', en: 'natural oak', de: 'natürliche Eiche' } satisfies L,
    },
    {
      value: { pl: '4–8 mm', en: '4–8 mm', de: '4–8 mm' } satisfies L,
      label: { pl: 'grubość lamele', en: 'batten thickness', de: 'Lamellenstärke' } satisfies L,
    },
    {
      value: { pl: '2', en: '2', de: '2' } satisfies L,
      label: { pl: 'selekcje drewna', en: 'wood selections', de: 'Holzselektionen' } satisfies L,
    },
    {
      value: { pl: 'na wymiar', en: 'cut to size', de: 'auf Maß' } satisfies L,
      label: { pl: 'długość i przekrój', en: 'length and section', de: 'Länge und Querschnitt' } satisfies L,
    },
  ],
  /** Enlace a la ficha donde está la tabla completa de parámetros. */
  specsLink: {
    pl: 'Pełna specyfikacja produktu',
    en: 'Full product specification',
    de: 'Vollständige Produktspezifikation',
  } satisfies L,
};

/** Servicios: los tres del brief, con los techos en primer lugar. */
export const services = {
  kicker: {
    pl: 'Usługi',
    en: 'Services',
    de: 'Leistungen',
  } satisfies L,
  title: {
    pl: 'Sufity, drzwi, schody',
    en: 'Ceilings, doors, stairs',
    de: 'Decken, Türen, Treppen',
  } satisfies L,
  lead: {
    pl: 'Trzy miejsca, w których nasz dąb trafia najczęściej. Sufity prowadzimy jako gotowe panele, drzwi i schody jako obłóg cięty na wymiar.',
    en: 'Three places where our oak ends up most often. Ceilings we deliver as ready-made panels; doors and stairs as trim battens cut to size.',
    de: 'Drei Stellen, an denen unsere Eiche am häufigsten landet. Decken liefern wir als fertige Paneele, Türen und Treppen als auf Maß geschnittene Abschlussleisten.',
  } satisfies L,
  /**
   * Los tres del brief, con los techos en primer lugar.
   *
   * CON FOTO PROPIA del cliente en los techos (`sufit-sedo-realny.jpg`, una
   * instalación real con focos). En escaleras sigue una foto de stock: es un
   * demo y el bloque tiene que verse completo; cuando el cliente mande la
   * suya, se cambia el nombre en este archivo y ya está — el markup no cambia.
   */
  items: [
    {
      name: { pl: 'Sufity', en: 'Ceilings', de: 'Decken' } satisfies L,
      image: 'sufit-sedo-realny.jpg',
      alt: {
        /**
         * Foto del cliente: un techo de paneles de roble con focos
         * empotrados. El `alt` describe lo que se ve; la afirmación
         * comercial («gotowe panele») vive en el texto que acompaña a la
         * imagen, no en el `alt`.
         */
        pl: 'Sufit z paneli dębowych z wpuszczonymi punktami świetlnymi',
        en: 'Oak panel ceiling with recessed spotlights',
        de: 'Eichenpaneel-Decke mit eingelassenen Spots',
      } satisfies L,
      text: {
        pl: 'Gotowe panele sufitowe z profilem i krawędzią — profil i krawędź są już wykonane.',
        en: 'Ready-made ceiling panels with profile and edge — the profile and the edge are already made.',
        de: 'Fertige Deckenpaneele mit Profil und Kante — Profil und Kante sind bereits gefertigt.',
      } satisfies L,
    },
    {
      name: { pl: 'Drzwi', en: 'Doors', de: 'Türen' } satisfies L,
      image: 'profil-oblogu.jpg',
      alt: {
        pl: 'Przekrój obłogu dębowego — profil do ramek i prowadnic',
        en: 'Cross-section of an oak trim batten — profile for frames and rails',
        de: 'Querschnitt einer Eichen-Abschlussleiste — Profil für Rahmen und Schienen',
      } satisfies L,
      text: {
        pl: 'Obłóg jako ramka i prowadnica, także w drzwiach przesuwnych.',
        en: 'The trim batten as frame and rail, including sliding doors.',
        de: 'Die Abschlussleiste als Rahmen und Schiene, auch in Schiebetüren.',
      } satisfies L,
    },
    {
      name: { pl: 'Schody', en: 'Stairs', de: 'Treppen' } satisfies L,
      image: 'service-schody-stock.jpg',
      alt: {
        pl: 'Dębowe schody z drewnianym wykończeniem ściany',
        en: 'Oak stairs with a wooden wall finish',
        de: 'Eichentreppe mit Holzverkleidung an der Wand',
      } satisfies L,
      text: {
        pl: 'Obłóg na stopnie i wykończenie schodów — ten sam dąb co w sufitach.',
        en: 'Trim battens for treads and stair edges — the same oak as the ceilings.',
        de: 'Abschlussleisten für Stufen und Treppenkanten — dieselbe Eiche wie an der Decke.',
      } satisfies L,
    },
  ],
};

/**
 * Bloque comercial: cennik y vía directa de contacto (teléfono, e-mail,
 * Facebook). El cennik se envía por escrito: el cliente lo prepara.
 */
export const pricing = {
  kicker: {
    pl: 'Cennik',
    en: 'Price list',
    de: 'Preisliste',
  } satisfies L,
  title: {
    pl: 'Indywidualna wycena dopasowana do zamówienia',
    en: 'An individual quote for your order',
    de: 'Ein individuelles Angebot für Ihre Bestellung',
  } satisfies L,
  lead: {
    pl: 'Nie publikujemy cennika, bo jeden profil w czterech długościach to cztery różne wyceny. Wysyłamy ją pisemnie — z ceną jednostkową, terminem realizacji i warunkami dostawy.',
    en: 'We do not publish a price list, because one profile in four lengths means four different quotes. We send it in writing — with the unit price, the lead time and the delivery terms.',
    de: 'Wir veröffentlichen keine Preisliste, weil ein Profil in vier Längen vier verschiedene Angebote bedeutet. Wir senden es schriftlich — mit Stückpreis, Lieferzeit und Lieferbedingungen.',
  } satisfies L,
  bullets: [
    {
      pl: 'Cena jednostkowa dla Twojego profilu i długości',
      en: 'A unit price for your profile and length',
      de: 'Ein Stückpreis für Ihr Profil und Ihre Länge',
    } satisfies L,
    {
      pl: 'Termin realizacji od potwierdzenia wymiarów',
      en: 'A lead time counted from dimension confirmation',
      de: 'Eine Lieferzeit ab Bestätigung der Maße',
    } satisfies L,
    {
      pl: 'Dostawa kurierem w całej Polsce',
      en: 'Courier delivery across Poland',
      de: 'Kurierlieferung in ganz Polen',
    } satisfies L,
  ],
  cta: {
    pl: 'Poproś o wycenę',
    en: 'Request a quote',
    de: 'Angebot anfordern',
  } satisfies L,
  priceListLink: {
    pl: 'Jak liczymy cenę',
    en: 'How we price the work',
    de: 'Wie wir kalkulieren',
  } satisfies L,
};

/**
 * Bloque oscuro «Materiał» (guía visual: cabecera + filas con icono).
 * Cuatro hechos del producto, los mismos que ya publica la web, con una
 * línea de apoyo cada uno. No hay dato nuevo: sólo cambia la forma.
 */
export const material = {
  kicker: { pl: 'Materiał', en: 'Material', de: 'Material' } satisfies L,
  title: {
    pl: 'Dąb, który zostaje drewnem',
    en: 'Oak that stays wood',
    de: 'Eiche, die Holz bleibt',
  } satisfies L,
  rows: [
    {
      icon: 'oak',
      title: { pl: '100% naturalny dąb', en: '100% natural oak', de: '100 % natürliche Eiche' } satisfies L,
      text: {
        pl: 'Bez farbowania i cieniowania: kolor i rysunek pochodzą z drewna.',
        en: 'No staining and no toning: colour and figure come from the wood.',
        de: 'Nicht gefärbt, nicht getönt: Farbe und Maserung kommen vom Holz.',
      } satisfies L,
    },
    {
      icon: 'ruler',
      title: { pl: 'Cięcie na wymiar', en: 'Cut to size', de: 'Auf Maß geschnitten' } satisfies L,
      text: {
        pl: 'Długość, przekrój i profil pod Twoją realizację.',
        en: 'Length, section and profile for your project.',
        de: 'Länge, Querschnitt und Profil für Ihr Projekt.',
      } satisfies L,
    },
    {
      icon: 'stack',
      title: { pl: 'Dwie selekcje', en: 'Two selections', de: 'Zwei Selektionen' } satisfies L,
      text: {
        pl: 'Bez sęków albo z sękami — ten sam materiał, dwa charaktery.',
        en: 'Knot-free or with knots — the same material, two characters.',
        de: 'Ohne Äste oder mit Ästen — dasselbe Material, zwei Charaktere.',
      } satisfies L,
    },
    {
      icon: 'truck',
      title: { pl: 'Wysyłka w całej Polsce', en: 'Delivery across Poland', de: 'Versand in ganz Polen' } satisfies L,
      text: {
        pl: 'Kurierem; poza Polską wycena indywidualnie.',
        en: 'By courier; outside Poland quoted individually.',
        de: 'Per Kurier; außerhalb Polens einzeln kalkuliert.',
      } satisfies L,
    },
  ],
};

/** Franja de realizaciones: cuatro fotos de la galería, con su pie. */
export const realizations = {
  kicker: { pl: 'Realizacje', en: 'Projects', de: 'Projekte' } satisfies L,
  title: {
    pl: 'Zobacz, jak wygląda nasz dąb',
    en: 'See how our oak looks in place',
    de: 'Sehen Sie unsere Eiche im Einsatz',
  } satisfies L,
  lead: {
    pl: 'Zdjęcia z pracowni i z montażu — ten sam materiał, różne zastosowania.',
    en: 'Shots from the workshop and from installation — the same material, different uses.',
    de: 'Aufnahmen aus der Werkstatt und von der Montage — dasselbe Material, verschiedene Einsätze.',
  } satisfies L,
  items: [
    {
      src: 'sufit-sedo-realny.jpg',
      caption: { pl: 'Sufit SEDO', en: 'SEDO ceiling', de: 'SEDO-Decke' } satisfies L,
    },
    {
      src: 'oblog-w-hali.jpg',
      caption: { pl: 'Obłogi w hali', en: 'Battens in the workshop', de: 'Leisten in der Werkstatt' } satisfies L,
    },
    {
      src: 'oblog-na-desce.jpg',
      caption: { pl: 'Obłóg cięty', en: 'Cut batten', de: 'Geschnittene Leiste' } satisfies L,
    },
    {
      src: 'pomiar-oblogu.jpg',
      caption: { pl: 'Pomiar na wymiar', en: 'Cut to measure', de: 'Auf Maß zugeschnitten' } satisfies L,
    },
    {
      src: 'profil-oblogu.jpg',
      caption: { pl: 'Profil wykończenia', en: 'Finish profile', de: 'Abschlussprofil' } satisfies L,
    },
    {
      src: 'oblog-w-scianie.jpg',
      caption: { pl: 'Obłóg w ścianie', en: 'Trim batten in a wall', de: 'Leiste in der Wand' } satisfies L,
    },
    {
      src: 'panele-scienne-dab.jpg',
      caption: { pl: 'Panele ścienne', en: 'Wall panels', de: 'Wandpaneele' } satisfies L,
    },
    {
      src: 'hero-oblog-debowy.jpg',
      caption: { pl: 'Naturalna krawędź', en: 'Natural edge', de: 'Naturkante' } satisfies L,
    },
    {
      src: 'deska-debowa-naturalna.jpg',
      caption: { pl: 'Dąb naturalny', en: 'Natural oak', de: 'Natürliche Eiche' } satisfies L,
    },
    {
      src: 'dab-z-sakami.jpg',
      caption: { pl: 'Dąb z sękami', en: 'Oak with knots', de: 'Eiche mit Ästen' } satisfies L,
    },
    {
      src: 'oblog-wedzony.jpg',
      caption: { pl: 'Dąb wędzony', en: 'Smoked oak', de: 'Geräucherte Eiche' } satisfies L,
    },
    {
      src: 'deski-na-placu.jpg',
      caption: { pl: 'Drewno na placu', en: 'Timber in the yard', de: 'Holz auf dem Hof' } satisfies L,
    },
  ],
  link: {
    pl: 'Wszystkie realizacje',
    en: 'All projects',
    de: 'Alle Projekte',
  } satisfies L,
};
