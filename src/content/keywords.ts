import type { Locale } from '../i18n';

/**
 * Mapa de keywords → página. **Fuente única de verdad** del SEO de este sitio.
 *
 * Reglas que aplica este archivo:
 *
 * 1. **Una intención por página.** Cada ruta tiene exactamente una `intent`.
 *    Dos páginas no pueden reclamar la misma keyword principal: si lo hacen,
 *    se canibalizan (Google elige una y la otra se queda sin impresiones).
 *    La regla se comprueba automáticamente en `_tools/check-keywords.mjs`.
 *
 * 2. **Terminología por idioma, no traducción literal.** EN y DE son mercados
 *    distintos. En inglés "oak lintel" es una viga estructural, así que no se
 *    usa nunca. En alemán "Oblag" no existe: se dice Eichen-Abschlussleiste,
 *    Eichenleiste, Eichenlamelle.
 *
 * 3. **Lo que se sabe de verdad.** Cada keyword lleva `evidence`:
 *      · `serp`     → comprobada contra el buscador (fecha + motor + qué se vio)
 *      · `sugerido` → deducida del volumen del término, no medida
 *      · `razonado` → deducida del negocio, sin comprobación externa
 *    Google Suggest (`suggestqueries.google.com`, 26.10.2026) es la fuente
 *    más honesta que hay sin Search Console: devuelve las cadenas que la
 *    gente escribe de verdad, ordenadas por Google. **El autocompletado NO es
 *    volumen**: una consulta con 0 sugerencias puede tener búsquedas reales
 *    (p. ej. "obłóg dębowy Olsztyn"), y una con 10 puede ser un mercado
 *    hinchado de marketplace (p. ej. "panele sufitowe" → solo PVC y Castorama).
 *
 * 4. **Nada de precio.** El cennik no se publica (§ ESTRATEGIA 1). Ninguna
 *    página apunta a una búsqueda que solo se puede ganar publicando precios.
 *
 * 5. **Unakeyword principal = una Dueña.** Lo que una página NO tiene que
 *    apuntar se declara en `contested`: los términos que dos páginas comparten
 *    a propósito, con la página que debe ganar. Es el mapa de canibalización.
 */

// --------------------------------------------------------------------- tipos

/** Intención de búsqueda. Una por página. */
export type SearchIntent =
  /** "Co to jest", "do czego służy" — saber qué es el producto. */
  | 'informational'
  /** "Obłóg dębowy", "lamela dębowa" — elegir producto dentro del rango. */
  | 'commercial'
  /** "cena", "wycena", "hurtowo" — pedir presupuesto o lote. */
  | 'transactional'
  /** "obłóg dębowy Olsztyn" — fabricante de la zona. */
  | 'local'
  /** "Doors Obłogi kontakt" — llegar al taller. */
  | 'navigational'
  /** Textos legales. No persiguen ninguna búsqueda. */
  | 'legal';

/** Cómo se ha verificado una keyword. */
export type Evidence = 'serp' | 'sugerido' | 'razonado';

/** Conjunto de keywords de una página en un idioma. */
export interface KeywordProfile {
  /** Keyword principal: la que va en `<title>`, `<h1>` y en el schema. */
  primary: string;
  /** Keywords secundarias: el racimo temático de la página. */
  secondary: string[];
  /** Long-tails (2–3). */
  longTail: string[];
  /** De dónde sale lo que sabemos de esta keyword. */
  evidence: Evidence;
}

/** Término que dos páginas comparten a propósito. */
export interface ContestedTerm {
  /** El término tal cual se escribe. */
  term: string;
  /** La otra página con la que se comparte. */
  with: string;
  /** Quién debe ganar y por qué. */
  resolution: string;
}

/** Lo que se observó en el buscador para esta página. */
export interface SerpNote {
  /** Fecha de la comprobación (ISO). */
  checked: string;
  /** Motor usado. */
  engine: string;
  /** Qué se vio, en una línea. */
  observed: string;
}

/** Una página del mapa. */
export interface PageKeyword {
  /** Clave interna de la página. */
  key: string;
  /** Ruta por idioma (con prefijo: `/`, `/en/`, `/de/`). */
  routes: Record<Locale, string>;
  /** Una sola intención por página. */
  intent: SearchIntent;
  /** Qué contesta esta página, en una frase. */
  answers: string;
  keywords: Record<Locale, KeywordProfile>;
  /**
   * Términos compartidos con otra página, con el reparto de responsabilidades.
   * Esto es el mapa de canibalización: si dos páginas se pelean el mismo
   * término, aquí está escrito quién cede.
   */
  contested?: ContestedTerm[];
  /** Evidencia del SERP para esta página, si la hay. */
  serp?: SerpNote;
}

// ------------------------------------------------------- evidencia SERP (PL)

/**
 * Lo que se vio en el buscador el 26.10.2026 con DuckDuckGo HTML
 * (`html.duckduckgo.com/html/`), y el autocompletado real de Google
 * (`suggestqueries.google.com`). Es el punto de partida de todo el mapa.
 */
export const serpFindings: {
  query: string;
  engine: string;
  checked: string;
  observed: string;
}[] = [
  {
    query: 'obłóg dębowy / obłogi dębowe',
    engine: 'DuckDuckGo HTML',
    checked: '2026-10-26',
    observed:
      'Allegro y OLX ocupan 4 de las 10 posiciones (marketplace con precio). ' +
      'El resto: oblogi24.pl (ficha con GRUESOR EN EL TÍTULO — "Obłogi 4 mm - DĄB - Natur"), ' +
      'oblogi.pl (fabricante: "Produkujemy w grubości 4 mm, inne są na zamówienie", ' +
      '"cięte a nie skrawane"), oblogi.pl/oblogi-dab-ceny/ (TABLA DE PRECIOS por dimensión ' +
      'con clases Natur / Rustic / Pozaklasa), stol-dom.pl (usos: stopnie schodowych, blatów, ' +
      'formatek meblowych), olgawood.pl (fabricante con dirección y NIP).',
  },
  {
    query: 'obłóg dębowy cena',
    engine: 'DuckDuckGo HTML',
    checked: '2026-10-26',
    observed:
      'Cabeza dominada por precio: Allegro, OLX, Sprzedajemy, tabla de precios de oblogi.pl ' +
      'y un PDF de cennik (stol-dom.pl/sites/default/files/plik/cennik-oblogi-lamale-debowe.pdf, ' +
      'PLN/szt, grubość 4 mm, długości do 300 cm). Nadie publica "na wymiar" con precio.',
  },
  {
    query: 'obłóg dębowy (autocompletado Google, hl=pl gl=pl)',
    engine: 'Google Suggest',
    checked: '2026-10-26',
    observed:
      '31 sugerencias al expandir a–z. Predomina el GROSOR: 2mm, 2,5mm, 3mm, 4mm, 5mm, 6mm, 10mm. ' +
      'Después: "2mm cena", "4mm cena", "co to jest", "co to", "a fornir", "do czego służy", ' +
      '"na schody", "na ścianę", "naturalny", "rustykalny", "ryflowany", "allegro", "olx", ' +
      '"białystok", "warszawa".',
  },
  {
    query: 'obłogi dębowe (autocompletado Google, hl=pl gl=pl)',
    engine: 'Google Suggest',
    checked: '2026-10-26',
    observed:
      '"obłogi dębowe 6mm", "4 mm", "2mm", "3mm", "co to jest", "CIĘTE", "PRODUCENT", ' +
      '"olx", "allegro". → "cięte" y "producent" son entradas reales del mercado.',
  },
  {
    query: 'obłóg dębowy na wymiar / obłóg dębowy Olsztyn / obłóg dębowy cena',
    engine: 'Google Suggest',
    checked: '2026-10-26',
    observed:
      '"obłóg dębowy cena" → 3 sugerencias ("2mm cena", "4mm cena"). ' +
      '"obłóg dębowy na wymiar" → 0. "obłóg dębowy Olsztyn" → 0. ' +
      'PERO "listwy dębowe na wymiar" → 1 y "dębowa listwa wykończeniowa" → 1: ' +
      'la forma viva en polaco es "listwy dębowe", no "obłóg … na wymiar".',
  },
  {
    query: 'listwa dębowa / boazeria dębowa (autocompletado Google)',
    engine: 'Google Suggest',
    checked: '2026-10-26',
    observed:
      'Mercado DIY/retail, no nuestro: "castorama", "leroy merlin", "obi", "przypodłogowa", ' +
      '"ozdobna", "20x40", "surowa", "lita". Mismo patrón en "boazeria dębowa". ' +
      'NO son keywords que debamos perseguir: la intención (comprar una pieza en tienda) ' +
      'y el canal (marketplace) son otros.',
  },
  {
    query: 'lamela dębowa (autocompletado Google + DuckDuckGo AC)',
    engine: 'Google Suggest / DuckDuckGo AC',
    checked: '2026-10-26',
    observed:
      'Google: "lamela dębowa" → "lamela dębowa 4mm". DuckDuckGo: 0 sugerencias. ' +
      'Volumen bajo pero intención perfecta (nosotros cortamos a medida).',
  },
  {
    query: 'dąb wędzony (autocompletado Google + DuckDuckGo AC)',
    engine: 'Google Suggest / DuckDuckGo AC',
    checked: '2026-10-26',
    observed:
      'Google: "dąb wędzony deska", "fornir", "meble", "jak zrobić", "cena", "kolor", ' +
      '"botaniczny". DuckDuckGo: "dąb wędzony botaniczny", "fornir". ' +
      'La cabeza es suelo y mobiliario (otro mercado); nuestra página es de listón ahumado.',
  },
  {
    query: 'panele sufitowe z dębu / panele sufitowe / panele dębowe (autocompletado)',
    engine: 'Google Suggest / DuckDuckGo AC',
    checked: '2026-10-26',
    observed:
      '"panele sufitowe z dębu" → 0 sugerencias. "panele sufitowe" → 10, TODAS de PVC, ' +
      'Castorama, Leroy Merlin. "panele dębowe" → "podłogowe", "castorama", "jodełka", ' +
      '"ciemne", "jasne", "leroy merlin". DuckDuckGo añade "panele drewniane na sufit". ' +
      'La página de paneles es de demanda MUY baja y con SERP dominada por plástico y retail.',
  },
  {
    query: 'oak trim battens / oak battens / oak edging (autocompletado Google)',
    engine: 'Google Suggest',
    checked: '2026-10-26',
    observed:
      'hl=en gl=us y hl=en gl=gb dan las mismas cadenas. "oak trim battens" → 0. ' +
      '"oak trim batten" → "oak top trim batten" + ruido de "board and batten siding". ' +
      '"oak battens" → "uk", "near me", "b&q", "2.4 m", "nz", "fence", "timber battens", ' +
      '"2x1", "tasmanian oak battens". "oak edging" / "oak edge trim" → "strip", "tape", ' +
      '"b&q", "wickes", "screwfix", "iron on", "veneer", "40mm", "garden". ' +
      '"oak cladding battens" → 3, muy nuestros: "cladding battens size", ' +
      '"distance between battens for cladding". "oak panel ceiling" → 8. ' +
      'EN mezcla nuestro mercado con el retail UK (B&Q, Screwfix, Wickes) y con la madera en bruto.',
  },
  {
    query: 'Eichenleiste / Eichenlamelle / Eichen Paneele (autocompletado Google)',
    engine: 'Google Suggest',
    checked: '2026-10-26',
    observed:
      'hl=de gl=de. "Eichen-Abschlussleiste" → 1. "Eichenleiste" → "20x40", "40x40", ' +
      '"20x20", "massiv", "hornbach", "kaufen", "NACH MAß". "Eichenlamelle" → "wand", ' +
      '"kaufen", "vertikale". "Eichen Paneele" → "wand", "decke". "Eichenleiste auf Maß" → 0, ' +
      'pero "eichenleisten nach maß" → 2 ("eichenplatte nach maß", "eiche leiste nach maß"). ' +
      '"geräucherte Eiche" → "holz", "parkett", "beize", "furnier", "tischplatte", "kaufen". ' +
      'La forma correcta para "a medida" en alemán es "nach Maß", no "auf Maß".',
  },
  {
    query: 'Wikipedia pl/en/de',
    engine: 'MediaWiki opensearch',
    checked: '2026-10-26',
    observed:
      'NO existe artículo en Wikipedia para "obłóg dębowy" (pl), ni para ' +
      '"oak trim batten" (en). Consecuencia GEO: no hay entidad de referencia que citar — ' +
      'el bloque de definición de la home es la respuesta citable de referencia.',
  },
];

// ------------------------------------------------------------------- el mapa

export const keywordMap: PageKeyword[] = [
  {
    key: 'home',
    routes: { pl: '/', en: '/en/', de: '/de/' },
    intent: 'commercial',
    answers:
      'Qué es y qué hace este taller: obłogi dębowe cortados a medida, lamelas y paneles, ' +
      'con precio y plazo por escrito.',
    keywords: {
      pl: {
        primary: 'obłóg dębowy',
        secondary: ['obłóg dębowy naturalny', 'obłóg dębowy co to jest', 'obłóg dębowy na wymiar'],
        longTail: ['obłóg dębowy do czego służy', 'obłóg dębowy na schody', 'obłóg dębowy rustykalny'],
        evidence: 'serp',
      },
      en: {
        primary: 'oak trim battens',
        secondary: ['oak cladding battens', 'oak edging trim', 'oak battens 4–8 mm'],
        longTail: ['oak trim batten', 'cladding battens size', 'oak panel ceiling'],
        evidence: 'serp',
      },
      de: {
        primary: 'Eichen-Abschlussleisten',
        secondary: ['Eichenleiste', 'Abschlussleiste Holz', 'Eichenleisten massiv'],
        longTail: ['Eichen-Abschlussleiste auf Maß', 'Abschlussleiste Holz Wand', 'Eichenleiste natur'],
        evidence: 'serp',
      },
    },
    contested: [
      {
        term: 'obłóg dębowy',
        with: 'catalog',
        resolution:
          'Gana la home (plural "obłogi dębowe" → catálogo). El SERP devuelve las MISMAS ' +
          'páginas para singular y plural: si Search Console muestra solapamiento, el ' +
          'catálogo pasa a noindex y la home se queda con definición y fabricante.',
      },
      {
        term: 'oak trim battens',
        with: 'product-trim',
        resolution:
          'Gana la home para la categoría; la ficha de producto para "oak trim battens cut ' +
          'to size". La ficha debe enlazar y no repetir la definición.',
      },
      {
        term: 'Eichen-Abschlussleisten',
        with: 'product-trim',
        resolution:
          'Gana la home para el término de categoría; la ficha para "Eichenleisten nach Maß".',
      },
      {
        term: 'oak trim battens',
        with: 'catalog',
        resolution:
          'El catálogo lo usa como secundaria (el hub), no como principal: lo principal ' +
          'del catálogo es el compuesto "oak battens and panels".',
      },
      {
        term: 'oak ceiling and wall panels',
        with: 'catalog',
        resolution:
          'El catálogo lo nombra para que el hub cubra la línea; la ficha lo gana con ' +
          'el grosor y el formato.',
      },
      {
        term: 'Eichen-Abschlussleisten',
        with: 'catalog',
        resolution:
          'El catálogo lo nombra al enumerar el surtido; la home gana el término de ' +
          'categoría y la ficha el de "nach Maß".',
      },
      {
        term: 'Eichen-Deckenpaneele',
        with: 'catalog',
        resolution: 'La ficha de producto gana; el catálogo solo la enumera.',
      },
    ],
    serp: {
      checked: '2026-10-26',
      engine: 'DuckDuckGo HTML + Google Suggest',
      observed:
        'La SERP PL de "obłóg dębowy" la ganas un marketplace (Allegro/OLX) o un fabricante ' +
        'que pone el GROSOR en el título (oblogi24.pl: "Obłogi 4 mm - DĄB - Natur"). ' +
        'La home no puede ganar ese puesto: el cennik no se publica. Apunta a la definición ' +
        'y al fabricante, que son las dos cosas que la SERP no cubre bien.',
    },
  },
  {
    key: 'catalog',
    routes: { pl: '/produkty/', en: '/en/products/', de: '/de/produkte/' },
    intent: 'commercial',
    answers: 'Qué cuatro líneas de producto salen de un mismo roble y cuál es cuál.',
    keywords: {
      pl: {
        primary: 'obłogi dębowe',
        secondary: ['lamele dębowe', 'obłogi dębowe do zabudowy', 'panele dębowe'],
        longTail: ['obłogi dębowe 4 mm', 'obłogi dębowe 6mm', 'obłogi dębowe 3mm'],
        evidence: 'serp',
      },
      en: {
        primary: 'oak battens and panels',
        secondary: ['oak trim battens', 'oak battens 4–8 mm', 'oak ceiling and wall panels'],
        longTail: ['vertical oak battens', 'cladding battens size', 'oak battens near me'],
        evidence: 'serp',
      },
      de: {
        primary: 'Eichenleisten',
        secondary: ['Eichen-Abschlussleisten', 'Eichenlamellen', 'Eichen-Deckenpaneele'],
        longTail: ['Eichenleisten kaufen', 'Eichenleisten 20x20', 'Eichenleisten massiv'],
        evidence: 'serp',
      },
    },
    contested: [
      {
        term: 'obłogi dębowe',
        with: 'home',
        resolution: 'Gana el catálogo (plural). La home se queda con el singular.',
      },
      {
        term: 'oak battens and panels',
        with: 'product-lamella',
        resolution:
          'Es el término compuesto del hub; la ficha de lamela gana "oak battens" a secas.',
      },
      {
        term: 'Eichenleisten',
        with: 'product-trim',
        resolution:
          'El catálogo gana la plural genérica; la ficha de producto gana ' +
          '"Eichenleisten nach Maß".',
      },
      {
        term: 'oak trim battens',
        with: 'home',
        resolution:
          'La home gana la categoría; el catálogo lo enumera, pero su keyword principal ' +
          'es el compuesto "oak battens and panels".',
      },
      {
        term: 'oak ceiling and wall panels',
        with: 'product-panels',
        resolution: 'La ficha de producto gana; el catálogo solo la enumera.',
      },
      {
        term: 'Eichen-Abschlussleisten',
        with: 'home',
        resolution:
          'La home gana la categoría; el catálogo lo nombra al enumerar el surtido.',
      },
      {
        term: 'Eichen-Deckenpaneele',
        with: 'product-panels',
        resolution: 'La ficha de producto gana; el catálogo solo la enumera.',
      },
    ],
    serp: {
      checked: '2026-10-26',
      engine: 'DuckDuckGo HTML',
      observed:
        'Riesgo real de canibalización con la home: en el SERP, "obłóg dębowy" y ' +
        '"obłogi dębowe" devuelven EL MISMO conjunto de páginas (Allegro, OLX, oblogi.pl, ' +
        'oblogi24.pl, stol-dom.pl, sprzedajemy.pl). Singular y plural son la misma búsqueda.',
    },
  },
  {
    key: 'product-trim',
    routes: {
      pl: '/produkty/oblog-debowy-ciety/',
      en: '/en/products/oak-trim-battens/',
      de: '/de/produkte/eichen-abschlussleiste-auf-mass/',
    },
    intent: 'commercial',
    answers: 'El producto principal: listón de remate de roble cortado a medida.',
    keywords: {
      pl: {
        primary: 'obłóg dębowy cięty',
        secondary: ['obłogi dębowe cięte', 'obłóg dębowy na wymiar', 'obłóg dębowy naturalny'],
        longTail: [
          'listwy dębowe na wymiar',
          'dębowa listwa wykończeniowa',
          'obłóg dębowy na schody',
        ],
        evidence: 'serp',
      },
      en: {
        primary: 'oak trim battens cut to size',
        secondary: ['oak trim batten', 'oak cladding battens', 'oak edging strip'],
        longTail: [
          'cladding battens size',
          'distance between battens for cladding',
          'oak edge trim',
        ],
        evidence: 'serp',
      },
      de: {
        primary: 'Eichenleisten nach Maß',
        secondary: ['Eichen-Abschlussleiste auf Maß', 'Abschlussleiste Holz', 'Eichenleiste Wand'],
        longTail: ['eiche leiste nach maß', 'Eichenleisten 20x40', 'Abschlussleiste Holz Wand'],
        evidence: 'serp',
      },
    },
    contested: [
      {
        term: 'obłóg dębowy cięty',
        with: 'home',
        resolution: 'Gana la ficha; la home no debe repetir el término en su `<h1>`.',
      },
      {
        term: 'Eichenleisten nach Maß',
        with: 'catalog',
        resolution:
          'Gana la ficha (es la página del producto a medida); el catálogo pierde el modificador.',
      },
      {
        term: 'oak trim battens cut to size',
        with: 'product-smoked',
        resolution:
          'La ficha de listón cortado gana; la de ahumado usa la variante "smoked oak ' +
          'trim battens" para no competir por el mismo término.',
      },
      {
        term: 'Eichen-Abschlussleiste auf Maß',
        with: 'home',
        resolution:
          'La ficha gana la variante "auf Maß"; la home usa el plural de categoría.',
      },
    ],
    serp: {
      checked: '2026-10-26',
      engine: 'DuckDuckGo HTML + Google Suggest',
      observed:
        'oblogi.pl (fabricante nº 1 del SERP) escribe: "Produkujemy w grubości 4 mm, inne są ' +
        'na zamówienie" y repite "cięte, nie skrawane". El rasgo que el mercado premia es ' +
        'exactamente el nuestro: cortado, no cepillado. Google no sugiere "obłóg dębowy ' +
        'na wymiar" (0) pero sí "listwy dębowe na wymiar" (1) — por eso el long-tail va en plural.',
    },
  },
  {
    key: 'product-smoked',
    routes: {
      pl: '/produkty/oblog-debowy-wedzony/',
      en: '/en/products/smoked-oak-trim/',
      de: '/de/produkte/geraeucherte-eichen-abschlussleiste/',
    },
    intent: 'commercial',
    answers: 'El mismo listón en roble ahumado: tono más profundo, veta más marcada.',
    keywords: {
      pl: {
        primary: 'obłóg dębowy wędzony',
        secondary: ['dąb wędzony', 'obłogi dębowe wędzony', 'dąb wędzony kolor'],
        longTail: ['dąb wędzony w obłogach', 'obłóg dębowy wędzony naturalny', 'dąb wędzony meble'],
        evidence: 'serp',
      },
      en: {
        primary: 'smoked oak trim battens',
        secondary: ['smoked oak', 'smoked oak battens', 'oak trim battens cut to size'],
        longTail: ['smoked oak battens', 'smoked oak trim', 'oak cladding battens'],
        evidence: 'razonado',
      },
      de: {
        primary: 'Geräucherte Eichen-Abschlussleiste',
        secondary: ['geräucherte Eiche', 'Raucheiche', 'Eichen-Abschlussleiste auf Maß'],
        longTail: ['geräucherte Eiche Holz', 'geräucherte Eiche furnier', 'Eichenleiste geräuchert'],
        evidence: 'sugerido',
      },
    },
    contested: [
      {
        term: 'oak trim battens cut to size',
        with: 'product-trim',
        resolution:
          'La ficha de listón cortado gana; la de ahumado usa la variante "smoked oak ' +
          'trim battens" para no competir por el mismo término.',
      },
    ],
    serp: {
      checked: '2026-10-26',
      engine: 'Google Suggest',
      observed:
        'La cabeza "dąb wędzony" es de suelo y mobiliario ("deska", "meble", "fornier", ' +
        '"botaniczny") — otro mercado. Por eso la keyword principal de esta página es ' +
        '"obłóg dębowy wędzony" y "dąb wędzony" queda como secundaria: cubre la cabeza ' +
        'sin meterse en un mercado que no es el nuestro.',
    },
  },
  {
    key: 'product-lamella',
    routes: {
      pl: '/produkty/lamela-debowa/',
      en: '/en/products/oak-battens/',
      de: '/de/produkte/eichenlamelle/',
    },
    intent: 'commercial',
    answers: 'Lámina de roble de 4–8 mm para revestimiento de pared y techo.',
    keywords: {
      pl: {
        primary: 'lamela dębowa',
        secondary: ['lamele dębowe', 'lamele dębowe 8 mm'],
        longTail: ['lamela dębowa 4 mm', 'lamela dębowa na ścianę', 'lamele dębowe do zabudowy'],
        evidence: 'serp',
      },
      en: {
        primary: 'oak battens',
        secondary: ['oak battens 4–8 mm', 'vertical oak battens', 'oak cladding battens'],
        longTail: [
          'oak battens 4–8 mm',
          'cladding battens size',
          'distance between battens for cladding',
        ],
        evidence: 'serp',
      },
      de: {
        primary: 'Eichenlamelle',
        secondary: ['Eichenlamellen Wand', 'vertikale Eichenlamellen', 'Eichenlamellen 4 mm'],
        longTail: ['eichenlamellen wand', 'vertikale eichenlamellen', 'Eichenlamellen kaufen'],
        evidence: 'serp',
      },
    },
    contested: [
      {
        term: 'oak battens',
        with: 'catalog',
        resolution:
          'Gana la ficha ("oak battens" a secas, con el grosor en la ficha). ' +
          'El catálogo usa el compuesto "oak battens and panels".',
      },
    ],
    serp: {
      checked: '2026-10-26',
      engine: 'Google Suggest + DuckDuckGo AC',
      observed:
        'Google sugiere solo "lamela dębowa 4mm"; DuckDuckGo, 0. Volumen bajo, intención ' +
        'perfecta: el resto del mercado de láminas es tableros preconfeccionados. ' +
        'Aquí el factor de corte a medida y el espesor son el argumento.',
    },
  },
  {
    key: 'product-panels',
    routes: {
      pl: '/produkty/panele-sufitowe-i-scienne/',
      en: '/en/products/oak-ceiling-and-wall-panels/',
      de: '/de/produkte/eichen-decken-und-wandpaneele/',
    },
    intent: 'commercial',
    answers: 'Panel de techo o pared ya montado, hecho con los mismos listones.',
    keywords: {
      pl: {
        primary: 'panele sufitowe z dębu',
        secondary: ['panele drewniane na sufit', 'panele sufitowe dębowe'],
        longTail: ['panele dębowe na ścianę', 'panele sufitowe z drewna', 'panele sufitowe dąb'],
        evidence: 'serp',
      },
      en: {
        primary: 'oak ceiling and wall panels',
        secondary: ['oak paneling for walls', 'oak panel ceiling', 'wooden ceiling panels'],
        longTail: ['oak panel ceiling', 'oak paneling for walls', 'wooden ceiling panels'],
        evidence: 'serp',
      },
      de: {
        primary: 'Eichen-Deckenpaneele',
        secondary: ['Eichen Paneele Wand', 'Eichen Paneele Decke', 'Eichen Deckenpaneele'],
        longTail: ['eichen paneele decke', 'eichen paneele wand', 'Eichen Deckenpaneele'],
        evidence: 'serp',
      },
    },
    contested: [
      {
        term: 'oak ceiling and wall panels',
        with: 'catalog',
        resolution:
          'La ficha gana: el catálogo solo la enumera al listar el surtido.',
      },
      {
        term: 'Eichen-Deckenpaneele',
        with: 'catalog',
        resolution: 'La ficha gana; el catálogo solo la enumera al listar el surtido.',
      },
    ],
    serp: {
      checked: '2026-10-26',
      engine: 'Google Suggest + DuckDuckGo AC',
      observed:
        'PÁGINA DE DEMANDA MUY BAJA, y hay que decirlo: "panele sufitowe z dębu" → 0 ' +
        'sugerencias; "panele sufitowe" → 10, todas de PVC y Cadenas retail; ' +
        '"panele dębowe" → "podłogowe", "castorama", "jodełka". No se compite por la cabeza ' +
        'de "panele sufitowe": se llega por "panele drewniane na sufit" y por la galería. ' +
        'Esta página no debe cargar el peso del SEO del sitio.',
    },
  },
  {
    key: 'gallery',
    routes: { pl: '/realizacje/', en: '/en/gallery/', de: '/de/galerie/' },
    intent: 'commercial',
    answers: 'Trabajo terminado: dónde se colocó cada listón y cómo quedó.',
    keywords: {
      pl: {
        primary: 'realizacje z obłogów dębowych',
        secondary: ['obłogi dębowe zdjęcia', 'obłóg dębowy w ścianie', 'obłogi dębowe realizacje'],
        longTail: ['obłóg dębowy na ścianę', 'panele sufitowe SEDO', 'dąb wędzony w zabudowie'],
        evidence: 'sugerido',
      },
      en: {
        primary: 'oak trim projects',
        secondary: ['oak trim gallery', 'oak ceiling panels', 'smoked oak projects'],
        longTail: ['oak paneling for walls', 'smoked oak battens', 'oak cladding battens'],
        evidence: 'razonado',
      },
      de: {
        primary: 'Projekte mit Eichen-Abschlussleisten',
        secondary: ['Eichen-Abschlussleisten Galerie', 'Eichen-Deckenpaneele', 'Raucheiche Projekte'],
        longTail: ['Eichen Paneele Wand', 'geräucherte Eiche', 'Eichenleiste Wand'],
        evidence: 'razonado',
      },
    },
    contested: [
      {
        term: 'Eichenleiste Wand',
        with: 'product-trim',
        resolution:
          'La galería lo usa como long-tail visual; la ficha de producto lo usa como ' +
          'secondary. Si se solapan, la ficha gana por profundidad de página.',
      },
      {
        term: 'Eichen-Deckenpaneele',
        with: 'product-panels',
        resolution: 'La ficha de producto gana; la galería solo la nombra en un pie de foto.',
      },
    ],
    serp: {
      checked: '2026-10-26',
      engine: 'Google Suggest',
      observed:
        'No hay búsqueda propia de "realizacje" para este sector: se busca por el producto ' +
        '("obłóg dębowy na ścianę" sí aparece en el autocompletado de Google). ' +
        'La galería no persigue un término propio: persigue las búsquedas de producto ' +
        'en la fase de decisión, con fotos reales del cliente.',
    },
  },
  {
    key: 'about',
    routes: { pl: '/o-nas/', en: '/en/about/', de: '/de/ueber-uns/' },
    intent: 'local',
    answers: 'Quién es el taller, dónde está y por qué su madera es de fianza.',
    keywords: {
      pl: {
        primary: 'obłóg dębowy Olsztyn',
        secondary: ['producent obłogów dębowych', 'obłóg dębowy Słonecznik', 'pracownia obłogów dębowych'],
        longTail: ['obłogi dębowe producent', 'obłóg dębowy warmińsko-mazurskie', 'obłóg dębowy producent'],
        evidence: 'serp',
      },
      en: {
        primary: 'oak trim batten manufacturer Poland',
        secondary: ['oak trim battens Poland', 'oak battens supplier Poland', 'oak workshop Olsztyn'],
        longTail: ['oak trim batten supplier', 'oak battens Poland', 'oak trim workshop Poland'],
        evidence: 'razonado',
      },
      de: {
        primary: 'Eichen-Abschlussleisten Hersteller Polen',
        secondary: ['Eichenleisten Hersteller', 'Eichenleiste Polen', 'Eichen-Abschlussleisten Olsztyn'],
        longTail: ['Eichen-Abschlussleisten Hersteller', 'Eichenleisten Polen', 'Eichenleiste Hersteller'],
        evidence: 'razonado',
      },
    },
    contested: [
      {
        term: 'obłogi dębowe producent',
        with: 'catalog',
        resolution:
          'El término es del fabricante, no del catálogo: la home y /o-nas/ lo cubren, ' +
          'el catálogo no lo repite.',
      },
    ],
    serp: {
      checked: '2026-10-26',
      engine: 'Google Suggest + DuckDuckGo HTML',
      observed:
        'El patrón "producto + ciudad" existe en el mercado: Google sugiere "obłóg dębowy ' +
        'białystok" y "obłóg dębowy warszawa"; olgawood.pl (fabricante chico, con dirección ' +
        'y NIP en el pie) se posiciona por eso. "Olsztyn" no llega al autocompletado ' +
        '(volumen bajo de ciudad) pero la búsqueda existe. En esta página cabe además ' +
        '"producent", que Google sí sugiere para "obłogi dębowe".',
    },
  },
  {
    key: 'price-list',
    routes: { pl: '/cennik/', en: '/en/price-list/', de: '/de/preisliste/' },
    intent: 'transactional',
    answers: 'Cuánto cuesta una partida y en cuánto tiempo, por escrito.',
    keywords: {
      pl: {
        primary: 'obłogi dębowe cena',
        secondary: ['cennik obłogów dębowych', 'wycena obłogów dębowych', 'obłóg dębowy wycena'],
        longTail: ['obłóg dębowy 4mm cena', 'obłóg dębowy 2mm cena', 'obłóg dębowy 6mm cena'],
        evidence: 'serp',
      },
      en: {
        primary: 'oak trim batten price',
        secondary: ['oak battens price list', 'oak trim quote', 'oak battens cost'],
        longTail: ['oak battens price', 'oak trim batten cost', 'oak price list'],
        evidence: 'razonado',
      },
      de: {
        primary: 'Eichen-Abschlussleisten Preis',
        secondary: ['Preisliste Eichenleisten', 'Eichenleiste Angebot', 'Eichenleisten kaufen'],
        longTail: ['Eichenleisten Preis', 'Eichenleiste Angebot', 'Eichenleiste Preisliste'],
        evidence: 'sugerido',
      },
    },
    serp: {
      checked: '2026-10-26',
      engine: 'DuckDuckGo HTML',
      observed:
        'AQUÍ ESTÁ EL LÍMITE ESTRUCTURAL, y hay que decirlo claro: la SERP de "obłóg ' +
        'dębowy cena" la ocupan páginas que SÍ publican precios — Allegro, OLX, la tabla de ' +
        'oblogi.pl/oblogi-dab-ceny/ y el PDF de cennik de stol-dom.pl. Como el cliente no ' +
        'publica precios (§1 ESTRATEGIA), esta página NO puede ganar esa cabeza. ' +
        'Su trabajo es convertir ("wycena", "cennik na zapytanie"), no posicionar.',
    },
  },
  {
    key: 'contact',
    routes: { pl: '/kontakt/', en: '/en/contact/', de: '/de/kontakt/' },
    intent: 'navigational',
    answers: 'Cómo llegar al taller: teléfono, WhatsApp y formulario.',
    keywords: {
      pl: {
        primary: 'Doors Obłogi kontakt',
        secondary: ['obłogi dębowe kontakt', 'obłóg dębowy telefon', 'obłóg dębowy zamówienie'],
        longTail: [
          'obłogi dębowe numer telefonu',
          'zamówienie obłogów dębowych',
          'obłóg dębowy Słonecznik kontakt',
        ],
        evidence: 'razonado',
      },
      en: {
        primary: 'Doors Obłogi contact',
        secondary: ['oak trim battens contact', 'oak battens order', 'oak workshop Olsztyn'],
        longTail: ['oak trim batten quote', 'oak battens supplier contact', 'oak trim Poland contact'],
        evidence: 'razonado',
      },
      de: {
        primary: 'Doors Obłogi Kontakt',
        secondary: ['Eichen-Abschlussleisten Kontakt', 'Eichenleiste bestellen', 'Eichenleisten Polen'],
        longTail: ['Eichenleiste Kontakt', 'Eichenleisten anfragen', 'Eichen-Abschlussleisten Telefon'],
        evidence: 'razonado',
      },
    },
    serp: {
      checked: '2026-10-26',
      engine: 'Google Suggest',
      observed:
        'Búsqueda por marca y por contacto: "wycena" (autocompletado) devuelve tasaciones ' +
        'inmobiliarias y de móviles — inútil. Aquí la entrada es la marca + "kontakt", que ' +
        'es navegación, no búsqueda de producto.',
    },
  },
  {
    key: 'for-trade',
    routes: { pl: '/dla-firm/', en: '/en/for-trade/', de: '/de/fuer-handwerk/' },
    intent: 'transactional',
    answers: 'Condiciones para talleres: mismo perfil, lote completo y entrega en un envío.',
    keywords: {
      pl: {
        primary: 'obłogi dębowe hurtowo',
        secondary: ['obłogi dębowe dla stolarzy', 'hurtownia obłogów dębowych', 'obłogi dębowe na partię'],
        longTail: ['obłogi dębowe dla firm', 'obłogi dębowe hurtownia', 'obłogi dębowe na zamówienie'],
        evidence: 'serp',
      },
      en: {
        primary: 'oak battens for trade',
        secondary: ['oak trim battens wholesale', 'oak battens supplier', 'oak battens bulk'],
        longTail: ['oak battens bulk order', 'oak trim battens wholesale', 'oak battens supplier uk'],
        evidence: 'sugerido',
      },
      de: {
        primary: 'Eichen-Abschlussleisten Großhandel',
        secondary: ['Eichenleisten Großhandel', 'Eichenleisten für Schreiner', 'Eichenleiste Handwerk'],
        longTail: ['Eichenleisten Großhandel', 'Eichenleiste Werkstatt', 'Eichenleisten Serie'],
        evidence: 'sugerido',
      },
    },
    serp: {
      checked: '2026-10-26',
      engine: 'DuckDuckGo HTML',
      observed:
        'El SERP de "obłóg dębowy cena" incluye una página de mayorista de grupos ' +
        '(drewnohurt.agrobiz.net, "w hurtowych ilościach") y oblogi.pl, que habla de ' +
        'cantidades. El B2B existe y es un canal real: aquí es donde se juega el pedido ' +
        'de lote. NOTA DE COPY: "hurtowo" es la palabra que usa el sector, pero conviene ' +
        'revisarla contra el registro de gama alta (§5.0 ESTRATEGIA) — "obłogi dębowe dla ' +
        'stolarzy" o "obłogi dębowe na partię" dicen lo mismo sin sonar a barato.',
    },
  },
  {
    key: 'delivery',
    routes: { pl: '/dostawa/', en: '/en/delivery/', de: '/de/lieferung/' },
    intent: 'informational',
    answers: 'Cómo viaja el listón, en cuánto tiempo y qué pasa con el embalaje.',
    keywords: {
      pl: {
        primary: 'dostawa obłogów dębowych',
        secondary: ['obłogi dębowe dostawa', 'obłóg dębowy termin realizacji', 'wysyłka obłogów dębowych'],
        longTail: ['obłogi dębowe kurier', 'dostawa obłogów dębowych Polska', 'obłóg dębowy na wymiar dostawa'],
        evidence: 'razonado',
      },
      en: {
        primary: 'oak trim batten delivery',
        secondary: ['oak battens delivery', 'oak trim lead time', 'oak battens shipping'],
        longTail: ['oak trim batten lead time', 'oak battens delivery Poland', 'oak battens courier'],
        evidence: 'razonado',
      },
      de: {
        primary: 'Eichen-Abschlussleisten Lieferung',
        secondary: ['Eichenleisten Lieferung', 'Eichenleiste Lieferzeit', 'Eichenleisten Versand'],
        longTail: ['Eichenleiste Lieferzeit', 'Eichen-Abschlussleisten Versand', 'Eichenleisten Polen'],
        evidence: 'razonado',
      },
    },
    serp: {
      checked: '2026-10-26',
      engine: 'DuckDuckGo HTML',
      observed:
        'Ninguna de las páginas del SERP publica plazo — ni oblogi.pl, ni stol-dom.pl, ni ' +
        'Allegro. "Długości do 300 cm" y "do 230 cm przy sprzedaży wysyłkowej" sí aparecen ' +
        '(stol-dom.pl). El plazo y el embalaje son nuestro hueco: el cliente los confirma ' +
        '(terms.ts: "Termin realizacji" confirmed=true) y los competidores no los dan.',
    },
  },
  {
    key: 'privacy',
    routes: {
      pl: '/polityka-prywatnosci/',
      en: '/en/privacy-policy/',
      de: '/de/datenschutz/',
    },
    intent: 'legal',
    answers: 'Quién trata los datos del formulario y hasta cuándo.',
    keywords: {
      pl: {
        primary: 'polityka prywatności Doors Obłogi',
        secondary: [],
        longTail: ['polityka prywatności', 'klauzula informacyjna'],
        evidence: 'razonado',
      },
      en: {
        primary: 'Doors Obłogi privacy policy',
        secondary: [],
        longTail: ['privacy policy'],
        evidence: 'razonado',
      },
      de: {
        primary: 'Doors Obłogi Datenschutz',
        secondary: [],
        longTail: ['Datenschutzerklärung'],
        evidence: 'razonado',
      },
    },
  },
];

// ------------------------------------------------------------------ helpers

/** Mapa ruta → entrada, indexado por la ruta de cada idioma. */
export const keywordByRoute: Map<string, PageKeyword> = new Map(
  keywordMap.flatMap((entry) =>
    (Object.entries(entry.routes) as [Locale, string][]).map(([locale, route]) => [
      route,
      entry,
    ] as [string, PageKeyword]),
  ),
);

/** Idioma de una ruta a partir de su prefijo. */
export function localeOfRoute(route: string): Locale {
  if (route.startsWith('/en/') || route === '/en/') return 'en';
  if (route.startsWith('/de/') || route === '/de/') return 'de';
  return 'pl';
}

/** Keyword principal de una ruta, si esa ruta está en el mapa. */
export function primaryKeyword(route: string): string | undefined {
  const entry = keywordByRoute.get(route);
  return entry?.keywords[localeOfRoute(route)]?.primary;
}

/**
 * Qué páginas reclamar una keyword. Si devuelve más de una, hay canibalización.
 * La comprobación vive en `_tools/check-keywords.mjs`.
 */
export function pagesClaiming(keyword: string, locale?: Locale): PageKeyword[] {
  const needle = keyword.trim().toLowerCase();
  return keywordMap.filter((entry) =>
    (['pl', 'en', 'de'] as Locale[]).some((l) => {
      if (locale && l !== locale) return false;
      const profile = entry.keywords[l];
      if (!profile) return false;
      return (
        profile.primary.toLowerCase() === needle ||
        profile.secondary.some((k) => k.toLowerCase() === needle) ||
        profile.longTail.some((k) => k.toLowerCase() === needle)
      );
    }),
  );
}

/** Intención de una ruta, si está en el mapa. */
export function intentFor(route: string): SearchIntent | undefined {
  return keywordByRoute.get(route)?.intent;
}
